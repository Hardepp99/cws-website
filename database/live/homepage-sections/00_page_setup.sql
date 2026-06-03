-- Homepage page flags only (no other pages)
USE cws_cms;
START TRANSACTION;
UPDATE pages SET is_homepage = 0;
UPDATE pages SET slug = 'home', title = 'Home', is_homepage = 1, status = 'published', display_mode = 'classic'
WHERE slug IN ('home', 'index') OR is_homepage = 1
LIMIT 1;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SELECT @page_id AS homepage_page_id;
COMMIT;
