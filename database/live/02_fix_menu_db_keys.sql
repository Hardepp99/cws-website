-- =============================================================================
-- CWS Live Server — Fix footer menu keys in `menus` table
-- =============================================================================
-- Problem: Admin saved menus as footerServices / footerProducts but the app
-- reads footer_services / footer_products. Empty footer columns can result.
-- Safe to run multiple times.
-- =============================================================================

USE cws_cms;

-- Copy payload from wrong key to correct key if correct row is empty/missing
INSERT INTO menus (menu_key, payload)
SELECT 'footer_services', m.payload
FROM menus m
WHERE m.menu_key = 'footerServices'
  AND NOT EXISTS (SELECT 1 FROM menus x WHERE x.menu_key = 'footer_services')
ON DUPLICATE KEY UPDATE payload = VALUES(payload);

INSERT INTO menus (menu_key, payload)
SELECT 'footer_products', m.payload
FROM menus m
WHERE m.menu_key = 'footerProducts'
  AND NOT EXISTS (SELECT 1 FROM menus x WHERE x.menu_key = 'footer_products')
ON DUPLICATE KEY UPDATE payload = VALUES(payload);

-- Remove legacy wrong keys after copy (optional — comment out if you want to keep backup)
DELETE FROM menus WHERE menu_key IN ('footerServices', 'footerProducts');

-- Ensure all four menu slots exist (empty arrays if missing)
INSERT IGNORE INTO menus (menu_key, payload) VALUES
  ('primary', '[]'),
  ('footer', '[]'),
  ('footer_services', '[]'),
  ('footer_products', '[]');
