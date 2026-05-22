CREATE DATABASE IF NOT EXISTS cws_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cws_cms;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL DEFAULT 'Admin',
  role ENUM('admin','editor') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS site_settings (
  id TINYINT UNSIGNED PRIMARY KEY DEFAULT 1,
  payload JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS menus (
  menu_key VARCHAR(50) PRIMARY KEY,
  payload JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pricing_options (
  id TINYINT UNSIGNED PRIMARY KEY DEFAULT 1,
  payload JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(200) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  content_html LONGTEXT,
  template VARCHAR(50) NOT NULL DEFAULT 'default',
  seo_title VARCHAR(255) DEFAULT '',
  seo_description TEXT,
  seo_keywords VARCHAR(500) DEFAULT '',
  seo_canonical VARCHAR(500) DEFAULT '',
  seo_og_image VARCHAR(500) DEFAULT '',
  seo_robots VARCHAR(20) NOT NULL DEFAULT 'index',
  seo_focus_keyword VARCHAR(120) DEFAULT '',
  is_homepage TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('published','draft') NOT NULL DEFAULT 'published',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS homepage_sections (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page_id INT UNSIGNED NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  layout VARCHAR(80) NOT NULL,
  status ENUM('published','draft','trash') NOT NULL DEFAULT 'published',
  admin_title VARCHAR(255) NOT NULL DEFAULT '',
  payload JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  INDEX idx_page_order (page_id, sort_order),
  INDEX idx_page_status (page_id, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS media (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  original_name VARCHAR(255) NOT NULL,
  stored_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  media_type ENUM('image','audio','video','document') NOT NULL,
  file_size INT UNSIGNED NOT NULL DEFAULT 0,
  width INT UNSIGNED NULL,
  height INT UNSIGNED NULL,
  alt_text VARCHAR(255) NOT NULL DEFAULT '',
  title VARCHAR(255) NOT NULL DEFAULT '',
  caption TEXT,
  description TEXT,
  file_path VARCHAR(500) NOT NULL,
  thumb_path VARCHAR(500) NULL,
  medium_path VARCHAR(500) NULL,
  large_path VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_media_type (media_type),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS service_landings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(200) NOT NULL UNIQUE,
  service_name VARCHAR(255) NOT NULL,
  page_title VARCHAR(255) NOT NULL DEFAULT '',
  page_description TEXT,
  page_keywords VARCHAR(500) DEFAULT '',
  intro TEXT,
  benefits JSON,
  deliverables JSON,
  faq JSON,
  related_slugs JSON,
  theme JSON,
  seo_body_html LONGTEXT,
  status ENUM('published','draft') NOT NULL DEFAULT 'published',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS services (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(200) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  hero_title VARCHAR(255) DEFAULT '',
  hero_subtitle TEXT,
  price_badge VARCHAR(120) DEFAULT '',
  content_html LONGTEXT,
  features JSON,
  cta_title VARCHAR(255) DEFAULT '',
  cta_text TEXT,
  seo JSON,
  status ENUM('published','draft') NOT NULL DEFAULT 'published',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS blog_posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(200) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content_html LONGTEXT,
  featured_image VARCHAR(500) DEFAULT '',
  published_date DATE,
  categories JSON,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  seo JSON,
  status ENUM('published','draft') NOT NULL DEFAULT 'published',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS desimentor_documents (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entity_type ENUM('page','homepage','service_landing','service') NOT NULL,
  entity_id INT UNSIGNED NOT NULL,
  content_json LONGTEXT NOT NULL,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  revision INT UNSIGNED NOT NULL DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_desimentor_entity (entity_type, entity_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS desimentor_templates (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  category ENUM('section','page','widget') NOT NULL DEFAULT 'section',
  content_json LONGTEXT NOT NULL,
  thumbnail_media_id INT UNSIGNED NULL,
  status ENUM('draft','published') NOT NULL DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS admin_sessions (
  token CHAR(64) PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

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

CREATE TABLE IF NOT EXISTS form_submissions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  form_type VARCHAR(40) NOT NULL,
  payload JSON NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type_created (form_type, created_at)
) ENGINE=InnoDB;
