-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

-- Section: industries
UPDATE homepage_sections
SET sort_order = 5, layout = 'industries', status = 'published',
    admin_title = 'Industries',
    payload = '{"acfFcLayout":"industries","sectionTheme":"dark","badge":"Industries","title":"Sector expertise that shortens discovery","subtitle":"Education, healthcare, hospitality, real estate, agriculture, manufacturing, fintech, logistics, and startups - each with tailored landing pages.","items":[{"icon":"fas fa-graduation-cap","title":"Education","tone":"blue"},{"icon":"fas fa-heartbeat","title":"Healthcare","tone":"pink"},{"icon":"fas fa-hotel","title":"Hospitality","tone":"orange"},{"icon":"fas fa-building","title":"Real estate","tone":"green"},{"icon":"fas fa-seedling","title":"Agriculture","tone":"green"},{"icon":"fas fa-industry","title":"Manufacturing","tone":"grey"},{"icon":"fas fa-coins","title":"Fintech","tone":"purple"},{"icon":"fas fa-truck","title":"Logistics","tone":"blue"},{"icon":"fas fa-rocket","title":"Startups","tone":"orange"}]}'
WHERE page_id = @page_id AND layout = 'industries' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 5, 'industries', 'published', 'Industries', '{"acfFcLayout":"industries","sectionTheme":"dark","badge":"Industries","title":"Sector expertise that shortens discovery","subtitle":"Education, healthcare, hospitality, real estate, agriculture, manufacturing, fintech, logistics, and startups - each with tailored landing pages.","items":[{"icon":"fas fa-graduation-cap","title":"Education","tone":"blue"},{"icon":"fas fa-heartbeat","title":"Healthcare","tone":"pink"},{"icon":"fas fa-hotel","title":"Hospitality","tone":"orange"},{"icon":"fas fa-building","title":"Real estate","tone":"green"},{"icon":"fas fa-seedling","title":"Agriculture","tone":"green"},{"icon":"fas fa-industry","title":"Manufacturing","tone":"grey"},{"icon":"fas fa-coins","title":"Fintech","tone":"purple"},{"icon":"fas fa-truck","title":"Logistics","tone":"blue"},{"icon":"fas fa-rocket","title":"Startups","tone":"orange"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'industries' AND hs.status <> 'trash'
  );
