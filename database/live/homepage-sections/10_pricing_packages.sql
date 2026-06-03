-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

SET NAMES utf8mb4;
-- Section: pricing_packages
UPDATE homepage_sections
SET sort_order = 10, layout = 'pricing_packages', status = 'published',
    admin_title = 'Pricing models',
    payload = '{"acfFcLayout":"pricing_packages","sectionTheme":"dark","badge":"How we engage","title":"Models that match your ambition","subtitle":"From a sharp launch to an embedded product squad - flexible structures, transparent pricing after discovery.","items":[{"icon":"fas fa-rocket","title":"Launch packages","desc":"Fixed-scope websites, product sites, or app MVPs with milestone payments and a clear finish line.","tone":"blue"},{"icon":"fas fa-user-clock","title":"Dedicated developers","desc":"Senior engineers embedded in your rhythm - sprints, backlog grooming, and production releases.","tone":"green"},{"icon":"fas fa-calendar-check","title":"Growth retainers","desc":"Ongoing SEO, paid media, CRO, and content - report on leads and revenue, not impressions alone.","tone":"orange"},{"icon":"fas fa-people-arrows","title":"Team augmentation","desc":"Plug in designers, developers, or marketers to accelerate without a long hiring cycle.","tone":"purple"}]}'
WHERE page_id = @page_id AND layout = 'pricing_packages' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 10, 'pricing_packages', 'published', 'Pricing models', '{"acfFcLayout":"pricing_packages","sectionTheme":"dark","badge":"How we engage","title":"Models that match your ambition","subtitle":"From a sharp launch to an embedded product squad - flexible structures, transparent pricing after discovery.","items":[{"icon":"fas fa-rocket","title":"Launch packages","desc":"Fixed-scope websites, product sites, or app MVPs with milestone payments and a clear finish line.","tone":"blue"},{"icon":"fas fa-user-clock","title":"Dedicated developers","desc":"Senior engineers embedded in your rhythm - sprints, backlog grooming, and production releases.","tone":"green"},{"icon":"fas fa-calendar-check","title":"Growth retainers","desc":"Ongoing SEO, paid media, CRO, and content - report on leads and revenue, not impressions alone.","tone":"orange"},{"icon":"fas fa-people-arrows","title":"Team augmentation","desc":"Plug in designers, developers, or marketers to accelerate without a long hiring cycle.","tone":"purple"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'pricing_packages' AND hs.status <> 'trash'
  );
