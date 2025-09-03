import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const { path: filePathParts } = req.query;
  const filePath = path.join(
    process.cwd(),
    "uploads/product",
    ...filePathParts
  );

  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.status(404).json({ error: "File not found" });
  }
}
