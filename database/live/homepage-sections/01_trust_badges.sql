-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

SET NAMES utf8mb4;
-- Section: trust_badges
UPDATE homepage_sections
SET sort_order = 1, layout = 'trust_badges', status = 'published',
    admin_title = 'Trust badges',
    payload = '{"acfFcLayout":"trust_badges","sectionTheme":"light","badge":"Why brands choose us","title":"One partner. Full stack. Zero guesswork.","subtitle":"Stop coordinating separate designers, developers, and marketers. We own the full journey - strategy, build, launch, and growth - with clear milestones and honest updates.","items":[{"icon":"fab fa-google","title":"4.9★ client rating","desc":"Consistently rated for delivery, communication, and results","tone":"blue"},{"icon":"fas fa-globe","title":"Remote-first, global-ready","desc":"Async collaboration across time zones - your pace, your tools","tone":"green"},{"icon":"fas fa-mobile-alt","title":"Mobile-first quality","desc":"Every experience tuned for thumb-friendly UX and speed","tone":"purple"},{"icon":"fas fa-chart-line","title":"Growth by design","desc":"Tracking, forms, and campaigns wired to real conversions","tone":"orange"},{"icon":"fas fa-file-signature","title":"Scope you can trust","desc":"Written deliverables, timelines, and revision rules upfront","tone":"grey"},{"icon":"fas fa-headset","title":"Support after launch","desc":"Maintenance, iterations, and retainers when you need a long-term team","tone":"pink"}]}'
WHERE page_id = @page_id AND layout = 'trust_badges' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 1, 'trust_badges', 'published', 'Trust badges', '{"acfFcLayout":"trust_badges","sectionTheme":"light","badge":"Why brands choose us","title":"One partner. Full stack. Zero guesswork.","subtitle":"Stop coordinating separate designers, developers, and marketers. We own the full journey - strategy, build, launch, and growth - with clear milestones and honest updates.","items":[{"icon":"fab fa-google","title":"4.9★ client rating","desc":"Consistently rated for delivery, communication, and results","tone":"blue"},{"icon":"fas fa-globe","title":"Remote-first, global-ready","desc":"Async collaboration across time zones - your pace, your tools","tone":"green"},{"icon":"fas fa-mobile-alt","title":"Mobile-first quality","desc":"Every experience tuned for thumb-friendly UX and speed","tone":"purple"},{"icon":"fas fa-chart-line","title":"Growth by design","desc":"Tracking, forms, and campaigns wired to real conversions","tone":"orange"},{"icon":"fas fa-file-signature","title":"Scope you can trust","desc":"Written deliverables, timelines, and revision rules upfront","tone":"grey"},{"icon":"fas fa-headset","title":"Support after launch","desc":"Maintenance, iterations, and retainers when you need a long-term team","tone":"pink"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'trust_badges' AND hs.status <> 'trash'
  );
