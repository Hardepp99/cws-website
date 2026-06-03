-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

SET NAMES utf8mb4;
-- Section: guarantees
UPDATE homepage_sections
SET sort_order = 7, layout = 'guarantees', status = 'published',
    admin_title = 'Guarantees',
    payload = '{"acfFcLayout":"guarantees","sectionTheme":"light","badge":"Peace of mind","title":"Promises we put in every contract","subtitle":"Confidence should not be optional - these standards apply whether you are launching or scaling.","items":[{"icon":"fas fa-file-contract","title":"Crystal-clear scope","desc":"Deliverables, owners, timelines, and revision rounds documented before a single line of code.","tone":"blue"},{"icon":"fas fa-eye","title":"See before you sign off","desc":"Approve on staging - desktop, tablet, and phone - so launch day feels predictable.","tone":"green"},{"icon":"fas fa-key","title":"Full ownership","desc":"Repositories, design files, domains, and admin credentials belong to you at go-live.","tone":"purple"},{"icon":"fas fa-life-ring","title":"Care after launch","desc":"Security updates, content tweaks, and optional retainers so you are never stranded.","tone":"orange"}]}'
WHERE page_id = @page_id AND layout = 'guarantees' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 7, 'guarantees', 'published', 'Guarantees', '{"acfFcLayout":"guarantees","sectionTheme":"light","badge":"Peace of mind","title":"Promises we put in every contract","subtitle":"Confidence should not be optional - these standards apply whether you are launching or scaling.","items":[{"icon":"fas fa-file-contract","title":"Crystal-clear scope","desc":"Deliverables, owners, timelines, and revision rounds documented before a single line of code.","tone":"blue"},{"icon":"fas fa-eye","title":"See before you sign off","desc":"Approve on staging - desktop, tablet, and phone - so launch day feels predictable.","tone":"green"},{"icon":"fas fa-key","title":"Full ownership","desc":"Repositories, design files, domains, and admin credentials belong to you at go-live.","tone":"purple"},{"icon":"fas fa-life-ring","title":"Care after launch","desc":"Security updates, content tweaks, and optional retainers so you are never stranded.","tone":"orange"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'guarantees' AND hs.status <> 'trash'
  );
