USE cws_cms;

ALTER TABLE pages
  ADD COLUMN seo_canonical VARCHAR(500) DEFAULT '' AFTER seo_keywords,
  ADD COLUMN seo_og_image VARCHAR(500) DEFAULT '' AFTER seo_canonical,
  ADD COLUMN seo_robots VARCHAR(20) NOT NULL DEFAULT 'index' AFTER seo_og_image,
  ADD COLUMN seo_focus_keyword VARCHAR(120) DEFAULT '' AFTER seo_robots;

CREATE TABLE IF NOT EXISTS page_views (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  path VARCHAR(300) NOT NULL,
  slug VARCHAR(200) NOT NULL DEFAULT '',
  viewed_on DATE NOT NULL,
  views INT UNSIGNED NOT NULL DEFAULT 1,
  UNIQUE KEY uq_path_day (path, viewed_on),
  INDEX idx_viewed_on (viewed_on),
  INDEX idx_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS search_queries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  query VARCHAR(255) NOT NULL,
  clicks INT UNSIGNED NOT NULL DEFAULT 0,
  impressions INT UNSIGNED NOT NULL DEFAULT 0,
  position DECIMAL(5,2) NOT NULL DEFAULT 0,
  recorded_on DATE NOT NULL,
  UNIQUE KEY uq_query_day (query, recorded_on),
  INDEX idx_recorded (recorded_on)
) ENGINE=InnoDB;
