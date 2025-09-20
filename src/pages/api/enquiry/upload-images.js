import fs from "fs";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

// Create upload directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "public", "enquiry");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueId = uuidv4();
    cb(null, `${uniqueId}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  // Only allow image files
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
  },
});

const runMiddleware = (req, res, fn) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result) =>
      result instanceof Error ? reject(result) : resolve(result)
    );
  });

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await runMiddleware(req, res, upload.array("enquiry_images", 5));
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Generate file URLs
    const fileUrls = req.files.map(file => ({
      filename: file.filename,
      url: `${process.env.NEXTAUTH_URL || 'https://bespokecarat.com'}/api/enquiry/${file.filename}`,
      originalName: file.originalname,
      size: file.size
    }));

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      files: fileUrls
    });

  } catch (error) {
    console.error("Upload error:", error);
    
    // Clean up any uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error("Error cleaning up file:", err);
        }
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || "Upload failed"
    });
  }
}
