import db from "../../../../../../config/dbConfig";
import { isAdmin } from "../../../../../../lib/authFromToken";
import { isGlobalSkuTaken } from "../../../../../../lib/checkProductExist";
import { getUniqueId } from "../../../../../../lib/getUniqueId";
import { cleanupUploadedFiles } from "../../../../../../lib/middlewares/cleanupUploadedFiles";
import {
  runMiddleware,
  uploadMedia,
} from "../../../../../../lib/middlewares/fileUpload";
import { diamondValidator } from "../../../../../../lib/validators/diamondValidator";

const Diamonds = db.diamonds;
const DiamondVariants = db.diamondVariants;
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

    // Normalize diamond_variants if it comes as string or string array
    if (typeof req.body?.diamond_variants === "string") {
      try {
        req.body.diamond_variants = JSON.parse(
          req.body.diamond_variants || "[]"
        );
      } catch {
        return res.status(200).send({
          status: false,
          message: "diamond_variants must be a valid JSON array string",
        });
      }
    } else if (
      Array.isArray(req.body?.diamond_variants) &&
      typeof req.body.diamond_variants[0] === "string"
    ) {
      try {
        req.body.diamond_variants = JSON.parse(
          req.body.diamond_variants[0] || "[]"
        );
      } catch {
        return res.status(200).send({
          status: false,
          message: "diamond_variants must be a valid JSON array string",
        });
      }
    }

    if (typeof req.body?.is_available === "string") {
      req.body.is_available = req.body.is_available.toLowerCase() === "true";
    }

    const { error, value } = diamondValidator.validate(req.body, {
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
        certification,
        description,
        is_available,
        diamond_variants,
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

      let slug = `DIA-${getUniqueId(7).toUpperCase()}`;
      const diamond = await Diamonds.create(
        {
          name,
          shape,
          sku: sku.toUpperCase(),
          certification,
          description,
          is_available,
          slug,
        },
        { transaction: t }
      );

      if (diamond_variants?.length > 0) {
        const variants = diamond_variants.map((v) => ({
          ...v,
          diamondId: diamond.id,
        }));
        await DiamondVariants.bulkCreate(variants, { transaction: t });
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
        message: "Diamond created successfully",
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
