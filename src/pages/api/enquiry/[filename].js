import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename } = req.query;
  
  if (!filename) {
    return res.status(400).json({ error: 'Filename required' });
  }

  const filePath = path.join(process.cwd(), "public", "enquiry", filename);

  try {
    // Check if file exists
    await fs.promises.access(filePath, fs.constants.R_OK);
    
    // Get file stats to determine content type
    const stats = await fs.promises.stat(filePath);
    if (!stats.isFile()) {
      return res.status(404).json({ error: "File not found" });
    }

    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
    }

    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (err) {
    console.error('Error serving enquiry file:', err);
    res.status(404).json({ error: "File not found" });
  }
}
