import db from "../../../../../../config/dbConfig";
import {
  runMiddleware,
  uploadMedia,
} from "../../../../../../lib/middlewares/fileUpload";
import { cleanupUploadedFiles } from "../../../../../../lib/middlewares/cleanupUploadedFiles";
import { isAdmin } from "../../../../../../lib/authFromToken";

const Layouts = db.layout;
const DiamondDetails = db.diamondDetails;
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
    const layout = await Layouts.findOne({
      where: db.Sequelize.where(
        db.Sequelize.fn("LOWER", db.Sequelize.col("sku")),
        rawSku.toLowerCase()
      ),
    });
    if (!layout) {
      await cleanupUploadedFiles(req.files);
      return res
        .status(200)
        .send({ status: false, message: "Layout not found" });
    }

    // parse arrays from payload
    try {
      parseArrayField(req.body, "diamond_details");
      parseArrayField(req.body, "diamond_details_deleted_ids");
      if (typeof req.body.diamond_details_mode === "string") {
        req.body.diamond_details_mode =
          req.body.diamond_details_mode.toLowerCase();
      }
    } catch (e) {
      await cleanupUploadedFiles(req.files);
      return res.status(200).send({ status: false, message: e.message });
    }

    normalizeBoolean(req.body, "is_available");

    // Main patchable fields (SKU is NOT editable)
    const updatable = [
      "name",
      "layout_type",
      "description",
      "is_available",
      "price",
    ];
    const mainPatch = {};
    for (const k of updatable) if (k in req.body) mainPatch[k] = req.body[k];

    const t = await db.sequelize.transaction();
    try {
      if (Object.keys(mainPatch).length) {
        await Layouts.update(mainPatch, {
          where: { id: layout.id },
          transaction: t,
        });
      }

      // sync diamond_details (child rows)
      const mode = req.body.diamond_details_mode || "upsert";
      if (
        mode === "replace" ||
        (Array.isArray(req.body.diamond_details) &&
          req.body.diamond_details.length) ||
        (Array.isArray(req.body.diamond_details_deleted_ids) &&
          req.body.diamond_details_deleted_ids.length)
      ) {
        await syncChildren({
          t,
          ParentId: layout.id,
          items: req.body.diamond_details || [],
          mode,
          deleted_ids: req.body.diamond_details_deleted_ids || [],
          Model: DiamondDetails,
          fk: "layoutId",
          allow: [
            "shape",
            "pcs",
            "carat_weight",
            "dimension",
            "color_range",
            "clarity_range",
          ],
        });
      }

      // append new media if uploaded
      const rowsToAdd = collectMediaRowsToAdd(req.files, layout.slug);
      if (rowsToAdd.length) {
        await Medias.bulkCreate(rowsToAdd, { transaction: t });
      }

      await t.commit();

      return res.status(200).send({
        status: true,
        message: "Layout updated successfully",
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
