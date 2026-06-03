-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

-- Section: portfolio
UPDATE homepage_sections
SET sort_order = 6, layout = 'portfolio', status = 'published',
    admin_title = 'Case studies',
    payload = '{"acfFcLayout":"portfolio","sectionTheme":"dark","badge":"Featured case studies","title":"Challenge → solution → measurable results","subtitle":"Real outcomes such as +250% revenue, +150K users, and -60% operating costs - explore projects with context, tech stack, and timelines.","ctaLabel":"View case studies","ctaHref":"/portfolio"}'
WHERE page_id = @page_id AND layout = 'portfolio' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 6, 'portfolio', 'published', 'Case studies', '{"acfFcLayout":"portfolio","sectionTheme":"dark","badge":"Featured case studies","title":"Challenge → solution → measurable results","subtitle":"Real outcomes such as +250% revenue, +150K users, and -60% operating costs - explore projects with context, tech stack, and timelines.","ctaLabel":"View case studies","ctaHref":"/portfolio"}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'portfolio' AND hs.status <> 'trash'
  );
