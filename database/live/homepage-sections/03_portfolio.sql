-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

SET NAMES utf8mb4;
-- Section: portfolio
UPDATE homepage_sections
SET sort_order = 3, layout = 'portfolio', status = 'published',
    admin_title = 'Portfolio',
    payload = '{"acfFcLayout":"portfolio","sectionTheme":"dark","badge":"Proof","title":"Products that look premium and perform","subtitle":"Browse websites, apps, and campaigns built for healthcare, retail, B2B, and fast-growing startups - crafted to impress buyers and drive action.","ctaLabel":"Explore case studies","ctaHref":"/portfolio"}'
WHERE page_id = @page_id AND layout = 'portfolio' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 3, 'portfolio', 'published', 'Portfolio', '{"acfFcLayout":"portfolio","sectionTheme":"dark","badge":"Proof","title":"Products that look premium and perform","subtitle":"Browse websites, apps, and campaigns built for healthcare, retail, B2B, and fast-growing startups - crafted to impress buyers and drive action.","ctaLabel":"Explore case studies","ctaHref":"/portfolio"}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'portfolio' AND hs.status <> 'trash'
  );
