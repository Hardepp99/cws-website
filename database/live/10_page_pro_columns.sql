-- 019 — Pro internal pages: per-page CSS + section structure (pages, services, landings)
-- Safe to re-run (duplicate column errors are ignored by apply-local.mjs)

ALTER TABLE pages
  ADD COLUMN page_custom_css MEDIUMTEXT NULL AFTER content_html,
  ADD COLUMN content_structure JSON NULL AFTER page_custom_css;

ALTER TABLE services
  ADD COLUMN page_custom_css MEDIUMTEXT NULL AFTER content_html,
  ADD COLUMN content_structure JSON NULL AFTER page_custom_css;

ALTER TABLE service_landings
  ADD COLUMN page_custom_css MEDIUMTEXT NULL AFTER seo_body_html,
  ADD COLUMN content_structure JSON NULL AFTER page_custom_css;
