-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

-- Section: cta
UPDATE homepage_sections
SET sort_order = 12, layout = 'cta', status = 'published',
    admin_title = 'Final CTA',
    payload = '{"acfFcLayout":"cta","sectionTheme":"dark","title":"Book your consultation","subtitle":"Tell us what you are building - we respond within one business day with scope, timeline, and a transparent estimate for your website, app, or growth program.","ctaLabel":"Book consultation","ctaHref":"#ask-price","ctaPrimary":{"label":"Book consultation","href":"#ask-price"},"ctaSecondary":{"label":"Get free proposal","href":"/contact#contact-form"}}'
WHERE page_id = @page_id AND layout = 'cta' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 12, 'cta', 'published', 'Final CTA', '{"acfFcLayout":"cta","sectionTheme":"dark","title":"Book your consultation","subtitle":"Tell us what you are building - we respond within one business day with scope, timeline, and a transparent estimate for your website, app, or growth program.","ctaLabel":"Book consultation","ctaHref":"#ask-price","ctaPrimary":{"label":"Book consultation","href":"#ask-price"},"ctaSecondary":{"label":"Get free proposal","href":"/contact#contact-form"}}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'cta' AND hs.status <> 'trash'
  );
