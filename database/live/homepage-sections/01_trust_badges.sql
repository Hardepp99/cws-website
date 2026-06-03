-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

-- Section: trust_badges
UPDATE homepage_sections
SET sort_order = 1, layout = 'trust_badges', status = 'published',
    admin_title = 'Client trust',
    payload = '{"acfFcLayout":"trust_badges","sectionTheme":"light","badge":"Client trust","title":"Trusted by ambitious brands worldwide","subtitle":"Logos, awards, certifications, and partnerships that signal enterprise credibility before the first call.","items":[{"icon":"fas fa-building","title":"Global client logos","desc":"Retail, healthcare, B2B, and SaaS teams across multiple regions","tone":"blue"},{"icon":"fas fa-trophy","title":"Industry awards","desc":"Recognised for delivery quality, communication, and measurable outcomes","tone":"green"},{"icon":"fas fa-certificate","title":"Certified practices","desc":"Secure delivery, documented scope, and production-ready handover","tone":"purple"},{"icon":"fab fa-google","title":"4.9★ Google rating","desc":"Verified reviews from founders and marketing leaders","tone":"orange"},{"icon":"fas fa-handshake","title":"Technology partnerships","desc":"Cloud, payments, analytics, and MarTech integrations you can rely on","tone":"grey"},{"icon":"fas fa-shield-alt","title":"Enterprise security","desc":"Access control, backups, and sensible data handling baked into delivery","tone":"pink"}]}'
WHERE page_id = @page_id AND layout = 'trust_badges' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 1, 'trust_badges', 'published', 'Client trust', '{"acfFcLayout":"trust_badges","sectionTheme":"light","badge":"Client trust","title":"Trusted by ambitious brands worldwide","subtitle":"Logos, awards, certifications, and partnerships that signal enterprise credibility before the first call.","items":[{"icon":"fas fa-building","title":"Global client logos","desc":"Retail, healthcare, B2B, and SaaS teams across multiple regions","tone":"blue"},{"icon":"fas fa-trophy","title":"Industry awards","desc":"Recognised for delivery quality, communication, and measurable outcomes","tone":"green"},{"icon":"fas fa-certificate","title":"Certified practices","desc":"Secure delivery, documented scope, and production-ready handover","tone":"purple"},{"icon":"fab fa-google","title":"4.9★ Google rating","desc":"Verified reviews from founders and marketing leaders","tone":"orange"},{"icon":"fas fa-handshake","title":"Technology partnerships","desc":"Cloud, payments, analytics, and MarTech integrations you can rely on","tone":"grey"},{"icon":"fas fa-shield-alt","title":"Enterprise security","desc":"Access control, backups, and sensible data handling baked into delivery","tone":"pink"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'trust_badges' AND hs.status <> 'trash'
  );
