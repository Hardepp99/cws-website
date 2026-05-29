-- Per-page FAQ blocks. Homepage uses homepage_sections instead.
ALTER TABLE pages ADD COLUMN faqs JSON NULL AFTER content_html;
ALTER TABLE services ADD COLUMN faqs JSON NULL AFTER features;
ALTER TABLE portfolio_items ADD COLUMN faqs JSON NULL AFTER content;
ALTER TABLE blog_posts ADD COLUMN faqs JSON NULL AFTER content_html;
