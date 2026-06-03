-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

-- Section: guarantees
UPDATE homepage_sections
SET sort_order = 9, layout = 'guarantees', status = 'published',
    admin_title = 'Guarantees',
    payload = '{"acfFcLayout":"guarantees","sectionTheme":"light","badge":"Peace of mind","title":"Enterprise promises in every statement of work","subtitle":"Written scope, staging approvals, and ownership transfer - standard on launches and retainers alike.","items":[{"icon":"fas fa-file-contract","title":"Fixed-scope clarity","desc":"Deliverables, owners, timelines, and revision rounds documented upfront.","tone":"blue"},{"icon":"fas fa-eye","title":"Approve on staging","desc":"Desktop, tablet, and mobile sign-off before production keys turn.","tone":"green"},{"icon":"fas fa-key","title":"You own the assets","desc":"Repos, design files, domains, and credentials handed over at go-live.","tone":"purple"},{"icon":"fas fa-life-ring","title":"Support after launch","desc":"Security patches, content updates, and optional 24/7 escalation paths.","tone":"orange"}]}'
WHERE page_id = @page_id AND layout = 'guarantees' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 9, 'guarantees', 'published', 'Guarantees', '{"acfFcLayout":"guarantees","sectionTheme":"light","badge":"Peace of mind","title":"Enterprise promises in every statement of work","subtitle":"Written scope, staging approvals, and ownership transfer - standard on launches and retainers alike.","items":[{"icon":"fas fa-file-contract","title":"Fixed-scope clarity","desc":"Deliverables, owners, timelines, and revision rounds documented upfront.","tone":"blue"},{"icon":"fas fa-eye","title":"Approve on staging","desc":"Desktop, tablet, and mobile sign-off before production keys turn.","tone":"green"},{"icon":"fas fa-key","title":"You own the assets","desc":"Repos, design files, domains, and credentials handed over at go-live.","tone":"purple"},{"icon":"fas fa-life-ring","title":"Support after launch","desc":"Security patches, content updates, and optional 24/7 escalation paths.","tone":"orange"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'guarantees' AND hs.status <> 'trash'
  );
