-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

-- Section: pricing_packages
UPDATE homepage_sections
SET sort_order = 10, layout = 'pricing_packages', status = 'published',
    admin_title = 'Pricing models',
    payload = '{"acfFcLayout":"pricing_packages","sectionTheme":"dark","badge":"Pricing models","title":"Engagement models that fit your stage","subtitle":"Transparent ranges after discovery - from fixed-cost launches to embedded engineers and monthly retainers.","items":[{"icon":"fas fa-file-invoice-dollar","title":"Fixed cost","desc":"Defined scope, milestone payments, and a clear finish line for websites and MVPs.","tone":"blue"},{"icon":"fas fa-user-clock","title":"Dedicated developers","desc":"Senior engineers in your tools, ceremonies, and release train.","tone":"green"},{"icon":"fas fa-people-arrows","title":"Team augmentation","desc":"Designers, developers, or marketers plugged in without a long hiring cycle.","tone":"purple"},{"icon":"fas fa-calendar-check","title":"Monthly retainers","desc":"Ongoing product, SEO, paid media, and support with predictable monthly investment.","tone":"orange"}]}'
WHERE page_id = @page_id AND layout = 'pricing_packages' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 10, 'pricing_packages', 'published', 'Pricing models', '{"acfFcLayout":"pricing_packages","sectionTheme":"dark","badge":"Pricing models","title":"Engagement models that fit your stage","subtitle":"Transparent ranges after discovery - from fixed-cost launches to embedded engineers and monthly retainers.","items":[{"icon":"fas fa-file-invoice-dollar","title":"Fixed cost","desc":"Defined scope, milestone payments, and a clear finish line for websites and MVPs.","tone":"blue"},{"icon":"fas fa-user-clock","title":"Dedicated developers","desc":"Senior engineers in your tools, ceremonies, and release train.","tone":"green"},{"icon":"fas fa-people-arrows","title":"Team augmentation","desc":"Designers, developers, or marketers plugged in without a long hiring cycle.","tone":"purple"},{"icon":"fas fa-calendar-check","title":"Monthly retainers","desc":"Ongoing product, SEO, paid media, and support with predictable monthly investment.","tone":"orange"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'pricing_packages' AND hs.status <> 'trash'
  );
