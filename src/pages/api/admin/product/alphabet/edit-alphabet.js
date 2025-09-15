import db from "../../../../../../config/dbConfig";
import {
  runMiddleware,
  uploadMedia,
} from "../../../../../../lib/middlewares/fileUpload";
import { cleanupUploadedFiles } from "../../../../../../lib/middlewares/cleanupUploadedFiles";
import { isAdmin } from "../../../../../../lib/authFromToken";

const Alphabets = db.alphabets;
const AlphabetVariants = db.alphabetVariants;
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

// Generic child sync (replace | upsert | patch)
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

  // accept new uploads (images[] / videos[])
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
    const alphabet = await Alphabets.findOne({
      where: db.Sequelize.where(
        db.Sequelize.fn("LOWER", db.Sequelize.col("sku")),
        rawSku.toLowerCase()
      ),
    });
    if (!alphabet) {
      await cleanupUploadedFiles(req.files);
      return res
        .status(200)
        .send({ status: false, message: "Alphabet not found" });
    }

    // parse arrays from payload
    try {
      parseArrayField(req.body, "alphabet_variants");
      parseArrayField(req.body, "alphabet_variants_deleted_ids");
      if (typeof req.body.alphabet_variants_mode === "string") {
        req.body.alphabet_variants_mode =
          req.body.alphabet_variants_mode.toLowerCase();
      }
    } catch (e) {
      await cleanupUploadedFiles(req.files);
      return res.status(200).send({ status: false, message: e.message });
    }

    normalizeBoolean(req.body, "is_available");

    // Main patchable fields (SKU is NOT editable)
    const updatable = [
      "name",
      "character",
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
        await Alphabets.update(mainPatch, {
          where: { id: alphabet.id },
          transaction: t,
        });
      }

      // sync alphabet_variants (child rows)
      const mode = req.body.alphabet_variants_mode || "upsert";
      if (
        mode === "replace" ||
        (Array.isArray(req.body.alphabet_variants) &&
          req.body.alphabet_variants.length) ||
        (Array.isArray(req.body.alphabet_variants_deleted_ids) &&
          req.body.alphabet_variants_deleted_ids.length)
      ) {
        await syncChildren({
          t,
          ParentId: alphabet.id,
          items: req.body.alphabet_variants || [],
          mode,
          deleted_ids: req.body.alphabet_variants_deleted_ids || [],
          Model: AlphabetVariants,
          fk: "alphabetId",
          allow: ["carat_weight", "price"],
        });
      }

      // append new media if uploaded
      const rowsToAdd = collectMediaRowsToAdd(req.files, alphabet.slug);
      if (rowsToAdd.length) {
        await Medias.bulkCreate(rowsToAdd, { transaction: t });
      }

      await t.commit();

      return res.status(200).send({
        status: true,
        message: "Alphabet updated successfully",
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
