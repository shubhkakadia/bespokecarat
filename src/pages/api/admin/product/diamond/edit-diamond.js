import db from "../../../../../../config/dbConfig";
import {
  runMiddleware,
  uploadMedia,
} from "../../../../../../lib/middlewares/fileUpload";
import { cleanupUploadedFiles } from "../../../../../../lib/middlewares/cleanupUploadedFiles";
import { isAdmin } from "../../../../../../lib/authFromToken";

const Diamonds = db.diamonds;
const DiamondVariants = db.diamondVariants;
const Medias = db.medias;

export const config = { api: { bodyParser: false } };

function parseArrayField(body, key) {
  if (typeof body?.[key] === "string") {
    try {
      body[key] = JSON.parse(body[key] || "[]");
    } catch {
      throw new Error(`${key} must be a valid JSON array string`);
    }
  } else if (Array.isArray(body?.[key]) && typeof body[key][0] === "string") {
    try {
      body[key] = JSON.parse(body[key][0] || "[]");
    } catch {
      throw new Error(`${key} must be a valid JSON array string`);
    }
  }
  return body[key];
}
function normalizeBoolean(body, key) {
  if (typeof body?.[key] === "string")
    body[key] = body[key].toLowerCase() === "true";
}
function collectMediaRowsToAdd(files, product_slug) {
  const mediaFiles = [...(files?.images || []), ...(files?.videos || [])];
  return mediaFiles.map((f) => ({
    filelink: `/api/media/${f.filename}`,
    file_type: f.mimetype.startsWith("image/") ? "image" : "video",
    product_slug,
  }));
}

async function syncDiamondVariants({
  t,
  diamondId,
  items,
  mode = "upsert",
  deleted_ids = [],
}) {
  const allow = ["color", "clarity", "carat_weight", "price"];
  const filter = (o) =>
    Object.fromEntries(Object.entries(o).filter(([k]) => allow.includes(k)));

  if (mode === "replace") {
    await DiamondVariants.destroy({ where: { diamondId }, transaction: t });
    if (items?.length) {
      const rows = items.map((v) => ({ ...filter(v), diamondId }));
      await DiamondVariants.bulkCreate(rows, { transaction: t });
    }
    return;
  }

  if (mode === "upsert") {
    if (deleted_ids?.length) {
      await DiamondVariants.destroy({
        where: { id: deleted_ids, diamondId },
        transaction: t,
      });
    }
    for (const v of items || []) {
      if (v.id) {
        const { id, ...rest } = v;
        await DiamondVariants.update(filter(rest), {
          where: { id, diamondId },
          transaction: t,
        });
      } else {
        await DiamondVariants.create(
          { ...filter(v), diamondId },
          { transaction: t }
        );
      }
    }
    return;
  }

  if (mode === "patch") {
    for (const v of items || []) {
      if (!v.id) continue;
      const { id, ...rest } = v;
      await DiamondVariants.update(filter(rest), {
        where: { id, diamondId },
        transaction: t,
      });
    }
  }
}
// -------------------------

export default async function handler(req, res) {
  const admin = await isAdmin(req);
  if (!admin) {
    return res
      .status(200)
      .send({ status: false, message: "Authorization failed" });
  }

  if (req.method !== "PATCH") {
    return res.status(200).send({ status: false, message: "Not Allowed" });
  }

  // handle uploads if any (images[] / videos[])
  try {
    await runMiddleware(req, res, uploadMedia);
  } catch (e) {
    return res
      .status(200)
      .send({ status: false, message: e.message || "Upload error" });
  }

  try {
    const rawSku = String(req.query.sku || "").trim();
    if (!rawSku) {
      await cleanupUploadedFiles(req.files);
      return res
        .status(200)
        .send({ status: true, message: "search value empty", data: [] });
    }

    // case-insensitive lookup
    const diamond = await Diamonds.findOne({
      where: db.Sequelize.where(
        db.Sequelize.fn("LOWER", db.Sequelize.col("sku")),
        rawSku.toLowerCase()
      ),
    });
    if (!diamond) {
      await cleanupUploadedFiles(req.files);
      return res
        .status(200)
        .send({ status: false, message: "Diamond not found" });
    }

    // parse patch payload
    try {
      parseArrayField(req.body, "diamond_variants");
      parseArrayField(req.body, "diamond_variants_deleted_ids");
      if (typeof req.body.diamond_variants_mode === "string") {
        req.body.diamond_variants_mode =
          req.body.diamond_variants_mode.toLowerCase();
      }
    } catch (e) {
      await cleanupUploadedFiles(req.files);
      return res.status(200).send({ status: false, message: e.message });
    }

    normalizeBoolean(req.body, "is_available");

    // Only these main fields are patchable (SKU is intentionally NOT allowed)
    const updatable = [
      "name",
      "shape",
      "certification",
      "description",
      "is_available",
    ];
    const mainPatch = {};
    for (const k of updatable) if (k in req.body) mainPatch[k] = req.body[k];

    const t = await db.sequelize.transaction();
    try {
      if (Object.keys(mainPatch).length) {
        await Diamonds.update(mainPatch, {
          where: { id: diamond.id },
          transaction: t,
        });
      }

      // variants sync (optional)
      const mode = req.body.diamond_variants_mode || "upsert";
      if (
        mode === "replace" ||
        (Array.isArray(req.body.diamond_variants) &&
          req.body.diamond_variants.length) ||
        (Array.isArray(req.body.diamond_variants_deleted_ids) &&
          req.body.diamond_variants_deleted_ids.length)
      ) {
        await syncDiamondVariants({
          t,
          diamondId: diamond.id,
          items: req.body.diamond_variants || [],
          mode,
          deleted_ids: req.body.diamond_variants_deleted_ids || [],
        });
      }

      // ADD NEW MEDIA (if files uploaded)
      const rowsToAdd = collectMediaRowsToAdd(req.files, diamond.slug);
      if (rowsToAdd.length) {
        await Medias.bulkCreate(rowsToAdd, { transaction: t });
      }

      await t.commit();

      return res.status(200).send({
        status: true,
        message: "Product edited successfully",
      });
    } catch (e) {
      await t.rollback();
      await cleanupUploadedFiles(req.files);
      return res
        .status(200)
        .send({ status: false, message: e.message || "Update failed" });
    }
  } catch (error) {
    return res.status(200).send({ status: false, message: error.message });
  }
}
