const db = require("../../../../../../config/dbConfig");
import { isAdmin } from "../../../../../../lib/authFromToken";
import { isGlobalSkuTaken } from "../../../../../../lib/checkProductExist";
const { getUniqueId } = require("../../../../../../lib/getUniqueId");
const {
  cleanupUploadedFiles,
} = require("../../../../../../lib/middlewares/cleanupUploadedFiles");
const {
  runMiddleware,
  uploadMedia,
} = require("../../../../../../lib/middlewares/fileUpload");
const {
  cutValidator,
} = require("../../../../../../lib/validators/cutValidator");

const Cuts = db.cuts;
const CutVariants = db.cutVariants;
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

    if (typeof req.body?.cut_variants === "string") {
      try {
        req.body.cut_variants = JSON.parse(req.body.cut_variants || "[]");
      } catch {
        return res.status(200).send({
          status: false,
          message: "cut_variants must be a valid JSON array string",
        });
      }
    } else if (
      Array.isArray(req.body?.cut_variants) &&
      typeof req.body.cut_variants[0] === "string"
    ) {
      try {
        req.body.cut_variants = JSON.parse(req.body.cut_variants[0] || "[]");
      } catch {
        return res.status(200).send({
          status: false,
          message: "cut_variants must be a valid JSON array string",
        });
      }
    }

    if (typeof req.body?.is_available === "string") {
      req.body.is_available = req.body.is_available.toLowerCase() === "true";
    }

    const { error, value } = cutValidator.validate(req.body, {
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
        shape,
        sku,
        cut_type,
        color_range,
        clarity_range,
        description,
        is_available,
        cut_variants,
      } = value;

      const taken = await isGlobalSkuTaken(sku, t);

      if (taken.taken) {
        await t.rollback();
        await cleanupUploadedFiles(req.files);
        return res.status(200).send({
          status: false,
          message: `SKU : '${sku}' already exists in ${taken.table}`,
        });
      }

      let slug = `CUT-${getUniqueId(7).toUpperCase()}`;

      const cut = await Cuts.create(
        {
          name,
          shape,
          slug,
          sku: sku.toUpperCase(),
          cut_type,
          color_range,
          clarity_range,
          description,
          is_available,
        },
        { transaction: t }
      );

      if (cut_variants?.length > 0) {
        const variants = cut_variants.map((v) => ({
          ...v,
          cutId: cut.id,
        }));
        await CutVariants.bulkCreate(variants, { transaction: t });
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
        message: "Cut created successfully",
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
