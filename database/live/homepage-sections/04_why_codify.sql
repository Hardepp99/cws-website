-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

SET NAMES utf8mb4;
-- Section: why_codify
UPDATE homepage_sections
SET sort_order = 4, layout = 'why_codify', status = 'published',
    admin_title = 'Why choose us',
    payload = '{"acfFcLayout":"why_codify","sectionTheme":"light","badge":"The CWS difference","title":"Agency craft. Product discipline. Marketing impact.","subtitle":"We think like founders: every page, screen, and ad should earn its place in your revenue story - not just fill a template.","cards":[{"icon":"fas fa-bullseye","title":"Conversion-led strategy","description":"Offers, funnels, and CTAs mapped before design - so traffic has somewhere profitable to land.","number":"01"},{"icon":"fas fa-laptop-code","title":"Engineering that scales","description":"Modern stacks, clean architecture, and APIs ready for the next feature - not a fragile one-off.","number":"02"},{"icon":"fas fa-bullhorn","title":"Marketing in sync","description":"SEO, paid media, and landing pages built on the same message your product delivers.","number":"03"},{"icon":"fas fa-tachometer-alt","title":"Speed that ranks","description":"Performance, accessibility, and Core Web Vitals treated as business metrics, not checkboxes.","number":"04"},{"icon":"fas fa-comments","title":"Radical clarity","description":"Staging links, Loom walkthroughs, and written status - you always know what shipped and what is next.","number":"05"},{"icon":"fas fa-handshake","title":"Partners, not vendors","description":"Post-launch iterations, feature roadmaps, and growth experiments with the same accountable team.","number":"06"}]}'
WHERE page_id = @page_id AND layout = 'why_codify' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 4, 'why_codify', 'published', 'Why choose us', '{"acfFcLayout":"why_codify","sectionTheme":"light","badge":"The CWS difference","title":"Agency craft. Product discipline. Marketing impact.","subtitle":"We think like founders: every page, screen, and ad should earn its place in your revenue story - not just fill a template.","cards":[{"icon":"fas fa-bullseye","title":"Conversion-led strategy","description":"Offers, funnels, and CTAs mapped before design - so traffic has somewhere profitable to land.","number":"01"},{"icon":"fas fa-laptop-code","title":"Engineering that scales","description":"Modern stacks, clean architecture, and APIs ready for the next feature - not a fragile one-off.","number":"02"},{"icon":"fas fa-bullhorn","title":"Marketing in sync","description":"SEO, paid media, and landing pages built on the same message your product delivers.","number":"03"},{"icon":"fas fa-tachometer-alt","title":"Speed that ranks","description":"Performance, accessibility, and Core Web Vitals treated as business metrics, not checkboxes.","number":"04"},{"icon":"fas fa-comments","title":"Radical clarity","description":"Staging links, Loom walkthroughs, and written status - you always know what shipped and what is next.","number":"05"},{"icon":"fas fa-handshake","title":"Partners, not vendors","description":"Post-launch iterations, feature roadmaps, and growth experiments with the same accountable team.","number":"06"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'why_codify' AND hs.status <> 'trash'
  );
