-- Fix for media foreign key constraint issue
-- This removes the incorrect foreign key constraint that only allows diamonds

-- Drop the incorrect foreign key constraint
ALTER TABLE `medias` DROP FOREIGN KEY `medias_ibfk_1`;

-- Optional: If there are any indexes on product_slug that were created with the FK, you might need to recreate them
-- Check existing indexes first with: SHOW INDEX FROM medias;

-- Note: After running this, the medias table will work correctly with all product types
-- The Sequelize associations in dbConfig.js already have constraints: false which is correct
