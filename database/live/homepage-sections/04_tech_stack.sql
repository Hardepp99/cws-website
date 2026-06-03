-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

-- Section: tech_stack
UPDATE homepage_sections
SET sort_order = 4, layout = 'tech_stack', status = 'published',
    admin_title = 'Technologies',
    payload = '{"acfFcLayout":"tech_stack","sectionTheme":"light","badge":"Technologies","title":"Modern stack. Clear ownership. No lock-in surprises.","subtitle":"Frontend, backend, mobile, cloud, DevOps, AI, and blockchain - picked for maintainability and hiring ease.","items":[{"icon":"fab fa-react","title":"Frontend - React","tone":"blue"},{"icon":"fas fa-bolt","title":"Frontend - Next.js","tone":"grey"},{"icon":"fab fa-node-js","title":"Backend - Node.js","tone":"green"},{"icon":"fab fa-php","title":"Backend - PHP / Laravel","tone":"purple"},{"icon":"fab fa-android","title":"Mobile - Flutter","tone":"green"},{"icon":"fab fa-aws","title":"Cloud - AWS","tone":"orange"},{"icon":"fas fa-infinity","title":"DevOps - CI/CD","tone":"grey"},{"icon":"fas fa-robot","title":"AI - Integrations","tone":"pink"},{"icon":"fab fa-ethereum","title":"Blockchain - Web3","tone":"blue"}]}'
WHERE page_id = @page_id AND layout = 'tech_stack' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 4, 'tech_stack', 'published', 'Technologies', '{"acfFcLayout":"tech_stack","sectionTheme":"light","badge":"Technologies","title":"Modern stack. Clear ownership. No lock-in surprises.","subtitle":"Frontend, backend, mobile, cloud, DevOps, AI, and blockchain - picked for maintainability and hiring ease.","items":[{"icon":"fab fa-react","title":"Frontend - React","tone":"blue"},{"icon":"fas fa-bolt","title":"Frontend - Next.js","tone":"grey"},{"icon":"fab fa-node-js","title":"Backend - Node.js","tone":"green"},{"icon":"fab fa-php","title":"Backend - PHP / Laravel","tone":"purple"},{"icon":"fab fa-android","title":"Mobile - Flutter","tone":"green"},{"icon":"fab fa-aws","title":"Cloud - AWS","tone":"orange"},{"icon":"fas fa-infinity","title":"DevOps - CI/CD","tone":"grey"},{"icon":"fas fa-robot","title":"AI - Integrations","tone":"pink"},{"icon":"fab fa-ethereum","title":"Blockchain - Web3","tone":"blue"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'tech_stack' AND hs.status <> 'trash'
  );
