import { isGlobalSkuTaken } from "../../../../../../lib/checkProductExist";
import { cleanupUploadedFiles } from "../../../../../../lib/middlewares/cleanupUploadedFiles";

const db = require("../../../../../../config/dbConfig");
const { isAdmin } = require("../../../../../../lib/authFromToken");
const { getUniqueId } = require("../../../../../../lib/getUniqueId");
const {
  runMiddleware,
  uploadMedia,
} = require("../../../../../../lib/middlewares/fileUpload");
const {
  colorStoneValidator,
} = require("../../../../../../lib/validators/colorStoneValidator");

const ColorStones = db.colorStone;
const ColorStoneVariants = db.colorStoneVariants;
const Medias = db.medias;

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  console.log("🔵 [DEBUG] Request method:", req.method);
  
  if (req.method === "POST") {
    const admin = await isAdmin(req);
    console.log("🔵 [DEBUG] Admin check:", admin);

    if (!admin) {
      return res
        .status(200)
        .send({ status: false, message: "Authorization failed" });
    }

    try {
      console.log("🔵 [DEBUG] Running upload middleware...");
      await runMiddleware(req, res, uploadMedia);
      console.log("🔵 [DEBUG] Upload middleware completed");
    } catch (e) {
      console.error("🔴 [ERROR] Upload middleware failed:", e.message);
      return res
        .status(200)
        .send({ status: false, message: e.message || "Upload error" });
    }

    console.log("🔵 [DEBUG] req.files:", JSON.stringify(req.files, null, 2));
    console.log("🔵 [DEBUG] req.body BEFORE parsing:", JSON.stringify(req.body, null, 2));

    req.body.images = req.files?.images || [];
    req.body.videos = req.files?.videos || [];

    // Parse color_stone_variants
    if (typeof req.body?.color_stone_variants === "string") {
      console.log("🔵 [DEBUG] Parsing color_stone_variants as string:", req.body.color_stone_variants);
      try {
        req.body.color_stone_variants = JSON.parse(
          req.body.color_stone_variants || "[]"
        );
        console.log("🔵 [DEBUG] Parsed color_stone_variants:", JSON.stringify(req.body.color_stone_variants, null, 2));
      } catch (parseError) {
        console.error("🔴 [ERROR] Failed to parse color_stone_variants:", parseError.message);
        return res.status(200).send({
          status: false,
          message: "color_stone_variants must be a valid JSON array string",
        });
      }
    } else if (
      Array.isArray(req.body?.color_stone_variants) &&
      typeof req.body.color_stone_variants[0] === "string"
    ) {
      console.log("🔵 [DEBUG] Parsing color_stone_variants from array[0]:", req.body.color_stone_variants[0]);
      try {
        req.body.color_stone_variants = JSON.parse(
          req.body.color_stone_variants[0] || "[]"
        );
        console.log("🔵 [DEBUG] Parsed color_stone_variants:", JSON.stringify(req.body.color_stone_variants, null, 2));
      } catch (parseError) {
        console.error("🔴 [ERROR] Failed to parse color_stone_variants from array:", parseError.message);
        return res.status(200).send({
          status: false,
          message: "color_stone_variants must be a valid JSON array string",
        });
      }
    } else {
      console.log("🔵 [DEBUG] color_stone_variants type:", typeof req.body?.color_stone_variants);
      console.log("🔵 [DEBUG] color_stone_variants value:", req.body?.color_stone_variants);
    }

    // Parse is_available
    if (typeof req.body?.is_available === "string") {
      console.log("🔵 [DEBUG] Converting is_available from string:", req.body.is_available);
      req.body.is_available = req.body.is_available.toLowerCase() === "true";
      console.log("🔵 [DEBUG] Converted is_available to boolean:", req.body.is_available);
    } else {
      console.log("🔵 [DEBUG] is_available type:", typeof req.body?.is_available);
      console.log("🔵 [DEBUG] is_available value:", req.body?.is_available);
    }

    console.log("🔵 [DEBUG] req.body AFTER parsing (before validation):", JSON.stringify(req.body, null, 2));
    console.log("🔵 [DEBUG] Starting validation...");

    const { error, value } = colorStoneValidator.validate(req.body, {
      abortEarly: false,
      convert: true,
    });

    if (error) {
      console.error("🔴 [VALIDATION ERROR] Validation failed!");
      console.error("🔴 [VALIDATION ERROR] Error details:", JSON.stringify(error.details, null, 2));
      console.error("🔴 [VALIDATION ERROR] Error messages:", error.details.map((d) => d.message));
      console.error("🔴 [VALIDATION ERROR] Failed fields:", error.details.map((d) => d.path.join('.')));
      
      await cleanupUploadedFiles(req.files);

      return res.status(200).send({
        status: false,
        message: "Validation error",
        errors: error.details.map((d) => d.message),
      });
    }

    console.log("✅ [DEBUG] Validation passed!");
    console.log("🔵 [DEBUG] Validated value:", JSON.stringify(value, null, 2));

    const t = await db.sequelize.transaction();
    console.log("🔵 [DEBUG] Transaction started");

    try {
      const {
        name,
        color,
        sku,
        certification,
        description,
        is_available,
        color_stone_variants,
      } = value;

      console.log("🔵 [DEBUG] Checking if SKU exists:", sku);

      const isExist = await ColorStones.findOne({
        where: { sku },
        transaction: t,
      });

      if (isExist) {
        console.log("🔴 [ERROR] SKU already exists:", isExist.sku);
        await t.rollback();
        await cleanupUploadedFiles(req.files);
        return res.status(200).send({
          status: false,
          message: `A Color Stone with sku ${isExist.sku} already exists.`,
        });
      }

      console.log("🔵 [DEBUG] SKU is unique, proceeding with creation");

      let slug;
      let isSlugUnique = false;
      let attempts = 0;
      const maxAttempts = 10;

      // Generate a unique slug
      while (!isSlugUnique && attempts < maxAttempts) {
        slug = `COL-${getUniqueId(7).toUpperCase()}`;
        console.log("🔵 [DEBUG] Generated slug attempt", attempts + 1, ":", slug);
        
        const slugExists = await ColorStones.findOne({
          where: { slug },
          transaction: t,
        });

        if (!slugExists) {
          isSlugUnique = true;
          console.log("✅ [DEBUG] Slug is unique:", slug);
        } else {
          console.log("⚠️ [DEBUG] Slug collision detected, regenerating...");
          attempts++;
        }
      }

      if (!isSlugUnique) {
        await t.rollback();
        await cleanupUploadedFiles(req.files);
        return res.status(200).send({
          status: false,
          message: "Failed to generate unique slug after multiple attempts",
        });
      }

      console.log("🔵 [DEBUG] Creating ColorStone record...");
      const color_stone = await ColorStones.create(
        {
          name,
          color,
          slug,
          sku: sku.toUpperCase(),
          certification,
          description,
          is_available,
        },
        { transaction: t }
      );
      console.log("✅ [DEBUG] ColorStone created with ID:", color_stone.id);

      if (color_stone_variants?.length > 0) {
        console.log("🔵 [DEBUG] Creating", color_stone_variants.length, "variants");
        const variants = color_stone_variants.map((v) => ({
          ...v,
          colorStoneId: color_stone.id,
        }));
        await ColorStoneVariants.bulkCreate(variants, { transaction: t });
        console.log("✅ [DEBUG] Variants created successfully");
      } else {
        console.log("🔵 [DEBUG] No variants to create");
      }

      const mediaFiles = [
        ...(req.files?.images || []),
        ...(req.files?.videos || []),
      ];

      if (mediaFiles.length > 0) {
        console.log("🔵 [DEBUG] Creating", mediaFiles.length, "media files");
        const rows = mediaFiles.map((f) => ({
          filelink: `/api/media/${f.filename}`,
          file_type: f.mimetype.startsWith("image/") ? "image" : "video",
          product_slug: slug,
        }));
        await Medias.bulkCreate(rows, { transaction: t });
        console.log("✅ [DEBUG] Media files created successfully");
      } else {
        console.log("🔵 [DEBUG] No media files to create");
      }

      await t.commit();
      console.log("✅ [DEBUG] Transaction committed successfully");

      return res.status(200).send({
        status: true,
        message: "Color Stone created successfully",
      });
    } catch (error) {
      console.error("🔴 [ERROR] Transaction failed:", error.message);
      console.error("🔴 [ERROR] Error name:", error.name);
      
      // Log Sequelize unique constraint errors
      if (error.name === "SequelizeUniqueConstraintError") {
        console.error("🔴 [UNIQUE CONSTRAINT ERROR] Duplicate entry found!");
        console.error("🔴 [UNIQUE CONSTRAINT ERROR] Fields:", error.fields);
        console.error("🔴 [UNIQUE CONSTRAINT ERROR] Parent:", error.parent?.message);
        console.error("🔴 [UNIQUE CONSTRAINT ERROR] SQL:", error.sql);
        if (error.errors) {
          error.errors.forEach((err, index) => {
            console.error(`  ${index + 1}. Field: "${err.path}"`);
            console.error(`     Value: ${JSON.stringify(err.value)}`);
            console.error(`     Message: ${err.message}`);
          });
        }
      }
      
      // Log Sequelize validation errors in detail
      if (error.name === "SequelizeValidationError" && error.errors) {
        console.error("🔴 [SEQUELIZE VALIDATION ERROR] Details:");
        error.errors.forEach((err, index) => {
          console.error(`  ${index + 1}. Field: "${err.path}"`);
          console.error(`     Type: ${err.type}`);
          console.error(`     Message: ${err.message}`);
          console.error(`     Value: ${JSON.stringify(err.value)}`);
        });
      }
      
      // Log Sequelize database errors
      if (error.name === "SequelizeDatabaseError") {
        console.error("🔴 [DATABASE ERROR]:", error.message);
        console.error("🔴 [SQL]:", error.sql);
      }
      
      console.error("🔴 [ERROR] Stack trace:", error.stack);
      
      await t.rollback();
      console.log("🔵 [DEBUG] Transaction rolled back");

      await cleanupUploadedFiles(req.files);

      return res.status(200).send({ status: false, message: error.message });
    }
  } else {
    console.log("🔴 [ERROR] Invalid method:", req.method);
    return res.status(200).send({ status: false, message: "Not Allowed" });
  }
}