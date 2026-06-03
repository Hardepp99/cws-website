-- =============================================================================
-- CWS Live Server — Agency homepage sections (DATA only, no new tables)
-- =============================================================================
-- The live site reads section JSON from `homepage_sections` and merges with
-- code defaults. This script:
--   1) Trashes old layouts no longer on the public homepage
--   2) Sets sort_order for admin list (matches conversion funnel)
--   3) Inserts `guarantees` section if missing
--
-- BEFORE RUNNING: confirm homepage page id:
--   SELECT id, slug, is_homepage FROM pages WHERE is_homepage = 1;
-- If NULL, use: SELECT id FROM pages WHERE slug = 'home' LIMIT 1;
-- Then set @page_id below.
-- =============================================================================

USE cws_cms;

SET @page_id := (
  SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1
);

SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

-- Abort hint if still null (uncomment to debug)
-- SELECT @page_id AS homepage_page_id;

-- Layouts used on the public agency homepage (2026 funnel)
SET @layouts := 'hero_slider,trust_badges,services_grid,portfolio,why_codify,process,testimonials,guarantees,industries,tech_stack,pricing_packages,faq,cta';

-- 1) Trash sections that are not part of the new homepage (about, old duplicates, etc.)
UPDATE homepage_sections
SET status = 'trash',
    admin_title = CONCAT(IFNULL(admin_title, layout), ' (archived)')
WHERE page_id = @page_id
  AND status <> 'trash'
  AND FIND_IN_SET(layout, @layouts) = 0;

-- 2) sort_order for admin (live frontend order comes from deployed code + merge)
UPDATE homepage_sections SET sort_order = 0  WHERE page_id = @page_id AND layout = 'hero_slider';
UPDATE homepage_sections SET sort_order = 1  WHERE page_id = @page_id AND layout = 'trust_badges';
UPDATE homepage_sections SET sort_order = 2  WHERE page_id = @page_id AND layout = 'services_grid';
UPDATE homepage_sections SET sort_order = 3  WHERE page_id = @page_id AND layout = 'portfolio';
UPDATE homepage_sections SET sort_order = 4  WHERE page_id = @page_id AND layout = 'why_codify';
UPDATE homepage_sections SET sort_order = 5  WHERE page_id = @page_id AND layout = 'process';
UPDATE homepage_sections SET sort_order = 6  WHERE page_id = @page_id AND layout = 'testimonials';
UPDATE homepage_sections SET sort_order = 7  WHERE page_id = @page_id AND layout = 'guarantees';
UPDATE homepage_sections SET sort_order = 8  WHERE page_id = @page_id AND layout = 'industries';
UPDATE homepage_sections SET sort_order = 9  WHERE page_id = @page_id AND layout = 'tech_stack';
UPDATE homepage_sections SET sort_order = 10 WHERE page_id = @page_id AND layout = 'pricing_packages';
UPDATE homepage_sections SET sort_order = 11 WHERE page_id = @page_id AND layout = 'faq';
UPDATE homepage_sections SET sort_order = 12 WHERE page_id = @page_id AND layout = 'cta';

-- 3) Insert guarantees block if admin has no row yet (minimal JSON — edit in admin later)
INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT
  @page_id,
  7,
  'guarantees',
  'published',
  'Guarantees',
  JSON_OBJECT(
    'acfFcLayout', 'guarantees',
    'sectionTheme', 'light',
    'badge', 'Your investment, protected',
    'title', 'Commitments we make on every project',
    'subtitle', 'Reduce risk early — standard on our engagements.',
    'items', JSON_ARRAY(
      JSON_OBJECT('icon', 'fas fa-file-contract', 'title', 'Scope in writing', 'desc', 'Deliverables and timeline documented before build.', 'tone', 'blue'),
      JSON_OBJECT('icon', 'fas fa-eye', 'title', 'Staging previews', 'desc', 'Approve on a test link before launch.', 'tone', 'green'),
      JSON_OBJECT('icon', 'fas fa-key', 'title', 'You own the assets', 'desc', 'Code and admin access at go-live.', 'tone', 'purple'),
      JSON_OBJECT('icon', 'fas fa-life-ring', 'title', 'Post-launch help', 'desc', 'Updates and optional support plans.', 'tone', 'orange')
    )
  )
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'guarantees' AND hs.status <> 'trash'
  );

-- 4) Ensure homepage uses classic sections (not Desimentor-only) unless you rely on builder
UPDATE pages
SET display_mode = 'classic'
WHERE id = @page_id
  AND (display_mode IS NULL OR display_mode = '');

-- Verify
SELECT id, layout, status, sort_order, admin_title
FROM homepage_sections
WHERE page_id = @page_id
ORDER BY sort_order ASC, id ASC;
