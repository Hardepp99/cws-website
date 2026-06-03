-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

SET NAMES utf8mb4;
-- Section: industries
UPDATE homepage_sections
SET sort_order = 8, layout = 'industries', status = 'published',
    admin_title = 'Industries',
    payload = '{"acfFcLayout":"industries","sectionTheme":"dark","badge":"Sectors we know","title":"Fluent in your market - fluent in digital","subtitle":"Sector-specific UX patterns, compliance cues, and messaging that speaks to how your buyers decide.","items":[{"icon":"fas fa-heartbeat","title":"Healthcare","tone":"pink"},{"icon":"fas fa-graduation-cap","title":"Education","tone":"blue"},{"icon":"fas fa-building","title":"Real estate","tone":"green"},{"icon":"fas fa-hotel","title":"Hospitality","tone":"orange"},{"icon":"fas fa-shopping-bag","title":"Retail & ecommerce","tone":"purple"},{"icon":"fas fa-industry","title":"Manufacturing","tone":"grey"},{"icon":"fas fa-seedling","title":"Agriculture","tone":"green"},{"icon":"fas fa-rocket","title":"Startups & SaaS","tone":"blue"}]}'
WHERE page_id = @page_id AND layout = 'industries' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 8, 'industries', 'published', 'Industries', '{"acfFcLayout":"industries","sectionTheme":"dark","badge":"Sectors we know","title":"Fluent in your market - fluent in digital","subtitle":"Sector-specific UX patterns, compliance cues, and messaging that speaks to how your buyers decide.","items":[{"icon":"fas fa-heartbeat","title":"Healthcare","tone":"pink"},{"icon":"fas fa-graduation-cap","title":"Education","tone":"blue"},{"icon":"fas fa-building","title":"Real estate","tone":"green"},{"icon":"fas fa-hotel","title":"Hospitality","tone":"orange"},{"icon":"fas fa-shopping-bag","title":"Retail & ecommerce","tone":"purple"},{"icon":"fas fa-industry","title":"Manufacturing","tone":"grey"},{"icon":"fas fa-seedling","title":"Agriculture","tone":"green"},{"icon":"fas fa-rocket","title":"Startups & SaaS","tone":"blue"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'industries' AND hs.status <> 'trash'
  );
