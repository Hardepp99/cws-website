-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

SET NAMES utf8mb4;
-- Section: testimonials
UPDATE homepage_sections
SET sort_order = 6, layout = 'testimonials', status = 'published',
    admin_title = 'Testimonials',
    payload = '{"acfFcLayout":"testimonials","sectionTheme":"dark","badge":"Client voices","title":"Trusted by teams who expect more than a facelift","subtitle":"Straight talk from founders and marketing leads who needed revenue-ready digital - not slide decks.","testimonials":[{"name":"Ecommerce director","text":"Our store finally feels premium on mobile. Speed, checkout, and merchandising all levelled up in one engagement.","role":"Retail - Shopify + CRO"},{"name":"Healthcare operations lead","text":"Patient booking and content SEO now work together. Enquiries are steady and the admin is easy for staff.","role":"Healthcare - Web + SEO"},{"name":"B2B sales manager","text":"Corporate site plus paid landing pages - we finally attribute leads to campaigns instead of guessing.","role":"Manufacturing - Web + Ads"},{"name":"SaaS founder","text":"MVP app, admin dashboard, and API delivered in milestones. Communication was crisp the whole way.","role":"Startup - Mobile + Backend"}]}'
WHERE page_id = @page_id AND layout = 'testimonials' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 6, 'testimonials', 'published', 'Testimonials', '{"acfFcLayout":"testimonials","sectionTheme":"dark","badge":"Client voices","title":"Trusted by teams who expect more than a facelift","subtitle":"Straight talk from founders and marketing leads who needed revenue-ready digital - not slide decks.","testimonials":[{"name":"Ecommerce director","text":"Our store finally feels premium on mobile. Speed, checkout, and merchandising all levelled up in one engagement.","role":"Retail - Shopify + CRO"},{"name":"Healthcare operations lead","text":"Patient booking and content SEO now work together. Enquiries are steady and the admin is easy for staff.","role":"Healthcare - Web + SEO"},{"name":"B2B sales manager","text":"Corporate site plus paid landing pages - we finally attribute leads to campaigns instead of guessing.","role":"Manufacturing - Web + Ads"},{"name":"SaaS founder","text":"MVP app, admin dashboard, and API delivered in milestones. Communication was crisp the whole way.","role":"Startup - Mobile + Backend"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'testimonials' AND hs.status <> 'trash'
  );
