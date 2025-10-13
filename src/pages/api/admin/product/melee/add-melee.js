import { isAdmin } from "../../../../../../lib/authFromToken";
import { isGlobalSkuTaken } from "../../../../../../lib/checkProductExist";

const db = require("../../../../../../config/dbConfig");
const { getUniqueId } = require("../../../../../../lib/getUniqueId");
const {
  cleanupUploadedFiles,
} = require("../../../../../../lib/middlewares/cleanupUploadedFiles");
const {
  runMiddleware,
  uploadMedia,
} = require("../../../../../../lib/middlewares/fileUpload");
const {
  meleeValidator,
} = require("../../../../../../lib/validators/meleeValidator");

const Melees = db.melees;
const SieveSizes = db.sieveSize;
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

    // Normalize sieve_sizes if stringified
    if (typeof req.body?.sieve_sizes === "string") {
      try {
        req.body.sieve_sizes = JSON.parse(req.body.sieve_sizes || "[]");
      } catch {
        return res.status(200).send({
          status: false,
          message: "sieve_sizes must be a valid JSON array string",
        });
      }
    } else if (
      Array.isArray(req.body?.sieve_sizes) &&
      typeof req.body.sieve_sizes[0] === "string"
    ) {
      try {
        req.body.sieve_sizes = JSON.parse(req.body.sieve_sizes[0] || "[]");
      } catch {
        return res.status(200).send({
          status: false,
          message: "sieve_sizes must be a valid JSON array string",
        });
      }
    }

    if (typeof req.body?.is_available === "string") {
      req.body.is_available = req.body.is_available.toLowerCase() === "true";
    }

    const { error, value } = meleeValidator.validate(req.body, {
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
      const { name, shape, sku, description, is_available, sieve_sizes } =
        value;

      const taken = await isGlobalSkuTaken(sku, t);

      if (taken.taken) {
        await t.rollback();
        await cleanupUploadedFiles(req.files);
        return res.status(200).send({
          status: false,
          message: `SKU : '${sku}' already exists in ${taken.table}`,
        });
      }

      let slug = `MEL-${getUniqueId(7).toUpperCase()}`;

      const melee = await Melees.create(
        {
          name,
          slug,
          shape,
          sku: sku.toUpperCase(),
          description,
          is_available,
        },
        { transaction: t }
      );

      // Create sieve sizes if provided
      if (sieve_sizes?.length > 0) {
        const rows = sieve_sizes.map((s) => ({
          ...s,
          meleeId: melee.id,
        }));
        await SieveSizes.bulkCreate(rows, { transaction: t });
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
        message: "Melee created successfully",
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
