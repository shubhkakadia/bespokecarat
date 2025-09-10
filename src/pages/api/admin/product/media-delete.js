import fs from "fs/promises";
import path from "path";
import { isAdmin } from "../../../../../lib/authFromToken";
const db = require("../../../../../config/dbConfig");

const BASE_DIR = path.join(process.cwd(), "uploads", "product");
const FILELINK_PREFIX = "/api/media/";

export default async function handler(req, res) {
  const admin = await isAdmin(req);

  if (!admin) {
    return res
      .status(200)
      .send({ status: false, message: "Authorization failed" });
  }

  if (req.method === "DELETE") {
    try {
      const { filename } = req.body;

      if (!filename) {
        return res
          .status(200)
          .send({ status: false, message: "filename required" });
      }

      const filelink = FILELINK_PREFIX + filename;

      const media = await db.medias.findOne({ where: { filelink } });

      if (!media) {
        return res
          .status(200)
          .send({ status: false, message: "Media not found" });
      }

      const filePath = path.join(BASE_DIR, filename);

      let fileDeleted = false;
      try {
        await fs.unlink(filePath);
        fileDeleted = true;
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.error(`Failed to delete file ${filePath}:`, err.message);
        }
      }

      await db.medias.destroy({ where: { id: media.id } });

      return res.status(200).send({
        status: true,
        message: fileDeleted
          ? `File and DB entry deleted for '${filename}'`
          : `DB entry deleted, file was missing`,
      });
    } catch (error) {
      return res.status(200).send({ status: false, message: error.message });
    }
  } else {
    return res.status(200).send({ status: false, message: "Not Allowed" });
  }
}
