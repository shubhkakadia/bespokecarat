import db from "../../../../../../config/dbConfig";
import {
  runMiddleware,
  uploadMedia,
} from "../../../../../../lib/middlewares/fileUpload";
import { cleanupUploadedFiles } from "../../../../../../lib/middlewares/cleanupUploadedFiles";
import { isAdmin } from "../../../../../../lib/authFromToken";

const Cuts = db.cuts;
const CutVariants = db.cutVariants;
const Medias = db.medias;

export const config = { api: { bodyParser: false } };

// ---------- helpers ----------
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

async function syncChildren({
  t,
  ParentId,
  items,
  mode = "upsert",
  deleted_ids = [],
  Model,
  fk,
  allow,
}) {
  const filter = (o) =>
    Object.fromEntries(Object.entries(o).filter(([k]) => allow.includes(k)));

  if (mode === "replace") {
    await Model.destroy({ where: { [fk]: ParentId }, transaction: t });
    if (items?.length) {
      const rows = items.map((v) => ({ ...filter(v), [fk]: ParentId }));
      await Model.bulkCreate(rows, { transaction: t });
    }
    return;
  }

  if (mode === "upsert") {
    if (deleted_ids?.length) {
      await Model.destroy({
        where: { id: deleted_ids, [fk]: ParentId },
        transaction: t,
      });
    }
    for (const v of items || []) {
      if (v.id) {
        const { id, ...rest } = v;
        await Model.update(filter(rest), {
          where: { id, [fk]: ParentId },
          transaction: t,
        });
      } else {
        await Model.create(
          { ...filter(v), [fk]: ParentId },
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
      await Model.update(filter(rest), {
        where: { id, [fk]: ParentId },
        transaction: t,
      });
    }
  }
}
// --------------------------------

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
    const cut = await Cuts.findOne({
      where: db.Sequelize.where(
        db.Sequelize.fn("LOWER", db.Sequelize.col("sku")),
        rawSku.toLowerCase()
      ),
    });
    if (!cut) {
      await cleanupUploadedFiles(req.files);
      return res.status(200).send({ status: false, message: "Cut not found" });
    }

    // parse payload
    try {
      parseArrayField(req.body, "cut_variants");
      parseArrayField(req.body, "cut_variants_deleted_ids");
      if (typeof req.body.cut_variants_mode === "string") {
        req.body.cut_variants_mode = req.body.cut_variants_mode.toLowerCase();
      }
    } catch (e) {
      await cleanupUploadedFiles(req.files);
      return res.status(200).send({ status: false, message: e.message });
    }

    normalizeBoolean(req.body, "is_available");

    // main patchable fields (SKU is not editable)
    const updatable = [
      "name",
      "shape",
      "cut_type",
      "color_range",
      "clarity_range",
      "description",
      "is_available",
    ];
    const mainPatch = {};
    for (const k of updatable) if (k in req.body) mainPatch[k] = req.body[k];

    const t = await db.sequelize.transaction();
    try {
      if (Object.keys(mainPatch).length) {
        await Cuts.update(mainPatch, { where: { id: cut.id }, transaction: t });
      }

      // sync cut_variants
      const mode = req.body.cut_variants_mode || "upsert";
      if (
        mode === "replace" ||
        (Array.isArray(req.body.cut_variants) &&
          req.body.cut_variants.length) ||
        (Array.isArray(req.body.cut_variants_deleted_ids) &&
          req.body.cut_variants_deleted_ids.length)
      ) {
        await syncChildren({
          t,
          ParentId: cut.id,
          items: req.body.cut_variants || [],
          mode,
          deleted_ids: req.body.cut_variants_deleted_ids || [],
          Model: CutVariants,
          fk: "cutId",
          allow: ["dimension", "carat_weight", "price"],
        });
      }

      // add new media if uploaded
      const rowsToAdd = collectMediaRowsToAdd(req.files, cut.slug);
      if (rowsToAdd.length) {
        await Medias.bulkCreate(rowsToAdd, { transaction: t });
      }

      await t.commit();

      return res.status(200).send({
        status: true,
        message: "Cut updated successfully",
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
