import { isGlobalSkuTaken } from "../../../../../../lib/checkProductExist";
import { cleanupUploadedFiles } from "../../../../../../lib/middlewares/cleanupUploadedFiles";

const db = require("../../../../../../config/dbConfig");
const { isAdmin } = require("../../../../../../lib/authFromToken");
const { getUniqueId } = require("../../../../../../lib/getUniqueId");
const {
  runMiddleware,
  uploadMedia,
} = require("../../../../../../lib/middlewares/fileUpload");
const {
  colorStoneValidator,
} = require("../../../../../../lib/validators/colorStoneValidator");

const ColorStones = db.colorStone;
const ColorStoneVariants = db.colorStoneVariants;
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

    if (typeof req.body?.color_stone_variants === "string") {
      try {
        req.body.color_stone_variants = JSON.parse(
          req.body.color_stone_variants || "[]"
        );
      } catch {
        return res.status(200).send({
          status: false,
          message: "color_stone_variants must be a valid JSON array string",
        });
      }
    } else if (
      Array.isArray(req.body?.color_stone_variants) &&
      typeof req.body.color_stone_variants[0] === "string"
    ) {
      try {
        req.body.color_stone_variants = JSON.parse(
          req.body.color_stone_variants[0] || "[]"
        );
      } catch {
        return res.status(200).send({
          status: false,
          message: "color_stone_variants must be a valid JSON array string",
        });
      }
    }

    if (typeof req.body?.is_available === "string") {
      req.body.is_available = req.body.is_available.toLowerCase() === "true";
    }

    const { error, value } = colorStoneValidator.validate(req.body, {
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
        color,
        sku,
        certification,
        description,
        is_available,
        color_stone_variants,
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

      let slug = `COL-${getUniqueId(7).toUpperCase()}`;

      const color_stone = await ColorStones.create(
        {
          name,
          color,
          slug,
          sku: sku.toUpperCase(),
          certification,
          description,
          is_available,
        },
        { transaction: t }
      );

      if (color_stone_variants?.length > 0) {
        const variants = color_stone_variants.map((v) => ({
          ...v,
          colorStoneId: color_stone.id,
        }));
        await ColorStoneVariants.bulkCreate(variants, { transaction: t });
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
      } else {
        await t.rollback();
        return res.status(200).send({
          message: "Color Stone",
        });
      }

      await t.commit();

      return res.status(200).send({
        status: true,
        message: "Color Stone created successfully",
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
