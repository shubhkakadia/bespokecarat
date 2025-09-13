const db = require("../../../../../config/dbConfig");
const { SEARCH_MAP } = require("../../../../../lib/mappers");
import fs from "fs/promises";
import path from "path";
import { isAdmin } from "../../../../../lib/authFromToken";

const MEDIA_DIR = path.join(process.cwd(), "uploads", "product");

function fileFromLink(filelink = "") {
  try {
    const parts = String(filelink).split("/");
    return parts[parts.length - 1] || "";
  } catch {
    return "";
  }
}

export default async function handler(req, res) {
  const admin = await isAdmin(req);

  if (!admin) {
    return res
      .status(200)
      .send({ status: false, message: "Authorization failed" });
  }

  if (req.method === "DELETE") {
    try {
      const sku = String(req.query.sku || "").trim();
      if (!sku) {
        return res
          .status(200)
          .send({ status: true, message: "SKU is required", data: null });
      }

      let found = null;
      let productType = null;

      for (const c of Object.keys(SEARCH_MAP)) {
        const entry = SEARCH_MAP[c];
        if (!entry?.model) continue;

        const product = await entry.model.findOne({
          where: { sku },
          attributes: ["id", "slug", "sku"],
          include: [
            { model: db.medias, as: "medias", attributes: ["id", "filelink"] },
          ],
        });

        if (product) {
          found = { entry, product };
          productType = c;
          break;
        }
      }

      if (!found) {
        return res.status(200).send({
          status: true,
          message: `No product found with SKU '${sku}'`,
          data: null,
        });
      }

      const { entry, product } = found;
      const slug = product.slug;
      const mediaFiles = (product.medias || [])
        .map((m) => fileFromLink(m.filelink))
        .filter(Boolean);

      await db.medias.destroy({ where: { product_slug: slug } });
      await entry.model.destroy({ where: { id: product.id } });

      const results = await Promise.allSettled(
        mediaFiles.map(async (fname) => {
          const fp = path.join(MEDIA_DIR, path.basename(fname));
          await fs.unlink(fp);
          return fname;
        })
      );

      const deleted_files = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);
      const failed_files = results
        .filter((r) => r.status === "rejected")
        .map((r) => ({
          file: mediaFiles[results.indexOf(r)],
          error: r.reason?.message || String(r.reason),
        }));

      return res.status(200).send({
        status: true,
        message: "Product Deleted",
        data: {
          product_type: productType,
          product_id: product.id,
          sku,
          medias_deleted_db: deleted_files.length + failed_files.length,
          medias_deleted_files: deleted_files,
          medias_delete_failed: failed_files,
        },
      });
    } catch (error) {
      return res.status(200).send({ status: false, message: error.message });
    }
  } else {
    res.status(200).send({ status: false, message: "Not allowed" });
  }
}
