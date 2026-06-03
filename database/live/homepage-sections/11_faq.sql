-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

SET NAMES utf8mb4;
-- Section: faq
UPDATE homepage_sections
SET sort_order = 11, layout = 'faq', status = 'published',
    admin_title = 'FAQ',
    payload = '{"acfFcLayout":"faq","sectionTheme":"light","badge":"FAQ","title":"Straight answers. No sales pressure.","subtitle":"Still exploring? These are the questions founders ask us most - or open Ask price for a quick ballpark.","items":[{"icon":"fas fa-rupee-sign","title":"What should I budget for a business website?","desc":"Scope drives investment - pages, integrations, content, and languages. After discovery you receive a written estimate with options, not a vague range.","tone":"green"},{"icon":"fas fa-clock","title":"How fast can you go live?","desc":"Marketing sites often land in 3-6 weeks. Apps and custom platforms follow a milestone plan shared before kickoff.","tone":"blue"},{"icon":"fas fa-mobile-alt","title":"Do you build iOS, Android, and cross-platform apps?","desc":"Yes - native and cross-platform, with admin panels, APIs, and store submission support when you need it.","tone":"purple"},{"icon":"fas fa-bullhorn","title":"Can you own SEO and paid acquisition?","desc":"Yes. Landing pages, tracking, and campaigns are built together so you know which channel pays for itself.","tone":"orange"},{"icon":"fas fa-globe","title":"Do you work with international clients?","desc":"Every day. Video workshops, async updates, staging reviews, and contracts in English - aligned to your timezone.","tone":"grey"}]}'
WHERE page_id = @page_id AND layout = 'faq' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 11, 'faq', 'published', 'FAQ', '{"acfFcLayout":"faq","sectionTheme":"light","badge":"FAQ","title":"Straight answers. No sales pressure.","subtitle":"Still exploring? These are the questions founders ask us most - or open Ask price for a quick ballpark.","items":[{"icon":"fas fa-rupee-sign","title":"What should I budget for a business website?","desc":"Scope drives investment - pages, integrations, content, and languages. After discovery you receive a written estimate with options, not a vague range.","tone":"green"},{"icon":"fas fa-clock","title":"How fast can you go live?","desc":"Marketing sites often land in 3-6 weeks. Apps and custom platforms follow a milestone plan shared before kickoff.","tone":"blue"},{"icon":"fas fa-mobile-alt","title":"Do you build iOS, Android, and cross-platform apps?","desc":"Yes - native and cross-platform, with admin panels, APIs, and store submission support when you need it.","tone":"purple"},{"icon":"fas fa-bullhorn","title":"Can you own SEO and paid acquisition?","desc":"Yes. Landing pages, tracking, and campaigns are built together so you know which channel pays for itself.","tone":"orange"},{"icon":"fas fa-globe","title":"Do you work with international clients?","desc":"Every day. Video workshops, async updates, staging reviews, and contracts in English - aligned to your timezone.","tone":"grey"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'faq' AND hs.status <> 'trash'
  );
