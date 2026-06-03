-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

-- Section: testimonials
UPDATE homepage_sections
SET sort_order = 8, layout = 'testimonials', status = 'published',
    admin_title = 'Testimonials',
    payload = '{"acfFcLayout":"testimonials","sectionTheme":"dark","badge":"Testimonials","title":"What founders and marketing leaders say","subtitle":"Ratings, roles, and reviews from teams who needed premium delivery - not another template refresh.","testimonials":[{"name":"Sarah Mitchell","text":"They rebuilt our funnel and ecommerce stack - revenue up sharply within two quarters. Communication was board-ready every week.","role":"CMO - Retail","rating":5},{"name":"Dr. Rajesh Nair","text":"Patient booking, compliance-friendly UX, and SEO moved together. Staff adoption was smooth because training was included.","role":"Operations Director - Healthcare","rating":5},{"name":"James Porter","text":"Dedicated developers embedded with our product squad. We shipped integrations months faster than hiring locally.","role":"VP Engineering - B2B SaaS","rating":5},{"name":"Elena Costa","text":"Landing pages, ads, and analytics finally tell one story. Cost per qualified lead dropped while volume grew.","role":"Growth Lead - Fintech","rating":5}]}'
WHERE page_id = @page_id AND layout = 'testimonials' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 8, 'testimonials', 'published', 'Testimonials', '{"acfFcLayout":"testimonials","sectionTheme":"dark","badge":"Testimonials","title":"What founders and marketing leaders say","subtitle":"Ratings, roles, and reviews from teams who needed premium delivery - not another template refresh.","testimonials":[{"name":"Sarah Mitchell","text":"They rebuilt our funnel and ecommerce stack - revenue up sharply within two quarters. Communication was board-ready every week.","role":"CMO - Retail","rating":5},{"name":"Dr. Rajesh Nair","text":"Patient booking, compliance-friendly UX, and SEO moved together. Staff adoption was smooth because training was included.","role":"Operations Director - Healthcare","rating":5},{"name":"James Porter","text":"Dedicated developers embedded with our product squad. We shipped integrations months faster than hiring locally.","role":"VP Engineering - B2B SaaS","rating":5},{"name":"Elena Costa","text":"Landing pages, ads, and analytics finally tell one story. Cost per qualified lead dropped while volume grew.","role":"Growth Lead - Fintech","rating":5}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'testimonials' AND hs.status <> 'trash'
  );
