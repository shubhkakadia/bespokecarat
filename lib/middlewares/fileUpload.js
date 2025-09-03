import fs from "fs";
import path from "path";
import multer from "multer";
import { getUniqueId } from "../getUniqueId";

const uploadDir = path.join(process.cwd(), "uploads", "product");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = getUniqueId(10).toUpperCase();
    cb(null, `BESPOKE-${unique}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image/* and video/* files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

export const uploadMedia = upload.fields([
  { name: "images", maxCount: 20 },
  { name: "videos", maxCount: 20 },
]);

export const runMiddleware = (req, res, fn) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result) =>
      result instanceof Error ? reject(result) : resolve(result)
    );
  });
