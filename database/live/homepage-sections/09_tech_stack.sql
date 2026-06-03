-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

SET NAMES utf8mb4;
-- Section: tech_stack
UPDATE homepage_sections
SET sort_order = 9, layout = 'tech_stack', status = 'published',
    admin_title = 'Tech stack',
    payload = '{"acfFcLayout":"tech_stack","sectionTheme":"light","badge":"Technology","title":"Right stack. Right budget. Right timeline.","subtitle":"Battle-tested tools our engineers ship every week - chosen for maintainability, not hype.","items":[{"icon":"fab fa-react","title":"React","tone":"blue"},{"icon":"fas fa-bolt","title":"Next.js","tone":"grey"},{"icon":"fab fa-node-js","title":"Node.js","tone":"green"},{"icon":"fab fa-wordpress","title":"WordPress","tone":"blue"},{"icon":"fab fa-android","title":"Flutter","tone":"green"},{"icon":"fab fa-php","title":"PHP / Laravel","tone":"purple"},{"icon":"fab fa-aws","title":"AWS / Cloud","tone":"orange"},{"icon":"fas fa-database","title":"MySQL","tone":"grey"},{"icon":"fas fa-robot","title":"AI integrations","tone":"pink"},{"icon":"fab fa-shopify","title":"Shopify","tone":"green"}]}'
WHERE page_id = @page_id AND layout = 'tech_stack' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 9, 'tech_stack', 'published', 'Tech stack', '{"acfFcLayout":"tech_stack","sectionTheme":"light","badge":"Technology","title":"Right stack. Right budget. Right timeline.","subtitle":"Battle-tested tools our engineers ship every week - chosen for maintainability, not hype.","items":[{"icon":"fab fa-react","title":"React","tone":"blue"},{"icon":"fas fa-bolt","title":"Next.js","tone":"grey"},{"icon":"fab fa-node-js","title":"Node.js","tone":"green"},{"icon":"fab fa-wordpress","title":"WordPress","tone":"blue"},{"icon":"fab fa-android","title":"Flutter","tone":"green"},{"icon":"fab fa-php","title":"PHP / Laravel","tone":"purple"},{"icon":"fab fa-aws","title":"AWS / Cloud","tone":"orange"},{"icon":"fas fa-database","title":"MySQL","tone":"grey"},{"icon":"fas fa-robot","title":"AI integrations","tone":"pink"},{"icon":"fab fa-shopify","title":"Shopify","tone":"green"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'tech_stack' AND hs.status <> 'trash'
  );
