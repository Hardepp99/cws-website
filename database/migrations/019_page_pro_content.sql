-- Pro internal pages: per-page CSS + optional stored section structure (from HTML analysis)

ALTER TABLE pages
  ADD COLUMN page_custom_css MEDIUMTEXT NULL AFTER content_html,
  ADD COLUMN content_structure JSON NULL AFTER page_custom_css;

ALTER TABLE services
  ADD COLUMN page_custom_css MEDIUMTEXT NULL AFTER content_html,
  ADD COLUMN content_structure JSON NULL AFTER page_custom_css;

ALTER TABLE service_landings
  ADD COLUMN page_custom_css MEDIUMTEXT NULL AFTER seo_body_html,
  ADD COLUMN content_structure JSON NULL AFTER page_custom_css;
