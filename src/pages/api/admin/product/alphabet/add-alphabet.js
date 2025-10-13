const db = require("../../../../../../config/dbConfig");
const { isAdmin } = require("../../../../../../lib/authFromToken");
const { getUniqueId } = require("../../../../../../lib/getUniqueId");
const {
  cleanupUploadedFiles,
} = require("../../../../../../lib/middlewares/cleanupUploadedFiles");
const {
  runMiddleware,
  uploadMedia,
} = require("../../../../../../lib/middlewares/fileUpload");
const {
  alphabetValidator,
} = require("../../../../../../lib/validators/alphabetValidator");

const Alphabets = db.alphabets;
const AlphabetVariants = db.alphabetVariants;
const Medias = db.medias;

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const admin = await isAdmin(req);

    if (!admin) {
      return res
        .status(200)
        .send({ status: false, message: "Authorization failed" });
    }

    try {
      await runMiddleware(req, res, uploadMedia);
    } catch (e) {
      return res
        .status(200)
        .send({ status: false, message: e.message || "Upload error" });
    }

    req.body.images = req.files?.images || [];
    req.body.videos = req.files?.videos || [];

    if (typeof req.body?.alphabet_variants === "string") {
      try {
        req.body.alphabet_variants = JSON.parse(
          req.body.alphabet_variants || "[]"
        );
      } catch {
        return res.status(200).send({
          status: false,
          message: "alphabet_variants must be a valid JSON array string",
        });
      }
    } else if (
      Array.isArray(req.body?.alphabet_variants) &&
      typeof req.body.alphabet_variants[0] === "string"
    ) {
      try {
        req.body.alphabet_variants = JSON.parse(
          req.body.alphabet_variants[0] || "[]"
        );
      } catch {
        return res.status(200).send({
          status: false,
          message: "alphabet_variants must be a valid JSON array string",
        });
      }
    }

    if (typeof req.body?.is_available === "string") {
      req.body.is_available = req.body.is_available.toLowerCase() === "true";
    }

    const { error, value } = alphabetValidator.validate(req.body, {
      abortEarly: false,
      convert: true,
    });
    if (error) {
      await cleanupUploadedFiles(req.files);

      return res.status(200).send({
        status: false,
        message: "Validation error",
        errors: error.details.map((d) => d.message),
      });
    }

    const t = await db.sequelize.transaction();

    try {
      const {
        name,
        sku,
        character,
        color_range,
        clarity_range,
        description,
        is_available,
        alphabet_variants,
      } = value;

      const isExist = await Alphabets.findOne({
        where: { sku },
        transaction: t,
      });

      if (isExist) {
        await t.rollback();

        await cleanupUploadedFiles(req.files);

        return res.status(200).send({
          status: false,
          message: `An alphabet with sku ${isExist.sku} already exists.`,
        });
      }

      let slug = `ALP-${getUniqueId(7).toUpperCase()}`;

      const alphabet = await Alphabets.create(
        {
          name,
          sku: sku.toUpperCase(),
          slug,
          character,
          color_range,
          clarity_range,
          description,
          is_available,
        },
        { transaction: t }
      );

      if (alphabet_variants?.length > 0) {
        const variants = alphabet_variants.map((v) => ({
          ...v,
          alphabetId: alphabet.id,
        }));
        await AlphabetVariants.bulkCreate(variants, { transaction: t });
      }

      const mediaFiles = [
        ...(req.files?.images || []),
        ...(req.files?.videos || []),
      ];

      if (mediaFiles.length > 0) {
        const rows = mediaFiles.map((f) => ({
          filelink: `/api/media/${f.filename}`,
          file_type: f.mimetype.startsWith("image/") ? "image" : "video",
          product_slug: slug,
        }));
        await Medias.bulkCreate(rows, { transaction: t });
      }

      await t.commit();

      return res.status(200).send({
        status: true,
        message: "Alphabet created successfully",
      });
    } catch (error) {
      await t.rollback();

      await cleanupUploadedFiles(req.files);

      return res.status(200).send({ status: false, message: error.message });
    }
  } else {
    return res.status(200).send({ status: false, message: "Not Allowed" });
  }
}
