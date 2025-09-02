import fs from "fs/promises";
import path from "path";

export async function cleanupUploadedFiles(files) {
  if (!files) return;

  const baseDir = path.join(process.cwd(), "uploads", "product");

  for (const file of [...(files.images || []), ...(files.videos || [])]) {
    const filePath = path.join(baseDir, file.filename);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error(`Failed to delete ${filePath}: ${err.message}`);
    }
  }
}
