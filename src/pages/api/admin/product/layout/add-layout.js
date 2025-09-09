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
  layoutValidator,
} = require("../../../../../../lib/validators/layoutValidator");

const Layouts = db.layout;
const DiamondDetails = db.diamondDetails;
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

    if (typeof req.body?.diamond_details === "string") {
      try {
        req.body.diamond_details = JSON.parse(req.body.diamond_details || "[]");
      } catch {
        return res.status(200).send({
          status: false,
          message: "diamond_details must be a valid JSON array string",
        });
      }
    } else if (
      Array.isArray(req.body?.diamond_details) &&
      typeof req.body.diamond_details[0] === "string"
    ) {
      try {
        req.body.diamond_details = JSON.parse(
          req.body.diamond_details[0] || "[]"
        );
      } catch {
        return res.status(200).send({
          status: false,
          message: "diamond_details must be a valid JSON array string",
        });
      }
    }

    if (typeof req.body?.is_available === "string") {
      req.body.is_available = req.body.is_available.toLowerCase() === "true";
    }

    const { error, value } = layoutValidator.validate(req.body, {
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
        layout_type,
        description,
        is_available,
        price,
        diamond_details,
      } = value;

      const isExist = await Layouts.findOne({
        where: { sku },
        transaction: t,
      });

      if (isExist) {
        await t.rollback();

        await cleanupUploadedFiles(req.files);

        return res.status(200).send({
          status: false,
          message: `A layout with sku ${isExist.sku} already exists.`,
        });
      }

      let slug = `LAY-${getUniqueId(7).toUpperCase()}`;

      const layout = await Layouts.create(
        {
          name,
          slug,
          sku: sku.toUpperCase(),
          layout_type,
          description,
          is_available,
          price,
        },
        { transaction: t }
      );

      if (diamond_details?.length > 0) {
        const variants = diamond_details.map((v) => ({
          ...v,
          layoutId: layout.id,
        }));
        await DiamondDetails.bulkCreate(variants, { transaction: t });
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
        message: "Layout created successfully",
      });
    } catch (error) {
      await t.rollback();

      await cleanupUploadedFiles(req.files);

      return res.status(200).send({ status: true, message: error.message });
    }
  } else {
    return res.status(200).send({ status: false, message: "Not Allowed" });
  }
}
