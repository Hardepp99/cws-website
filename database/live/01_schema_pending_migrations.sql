-- =============================================================================
-- CWS Live Server — Schema migrations (phpMyAdmin)
-- =============================================================================
-- Database: cws_cms (change USE line if your live DB name differs)
-- How to run: Import this file in phpMyAdmin, or run section-by-section.
-- If you see "Duplicate column name" — that part is already applied; continue.
-- Run files in database/live/ in numeric order: 01 → 02 → 03
-- =============================================================================

USE cws_cms;

-- -----------------------------------------------------------------------------
-- 003 — Homepage section status (skip if columns already exist)
-- -----------------------------------------------------------------------------
ALTER TABLE homepage_sections
  ADD COLUMN status ENUM('published','draft','trash') NOT NULL DEFAULT 'published' AFTER layout;

ALTER TABLE homepage_sections
  ADD COLUMN admin_title VARCHAR(255) NOT NULL DEFAULT '' AFTER status;

ALTER TABLE homepage_sections
  ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- -----------------------------------------------------------------------------
-- 008 — Page / service display_mode (classic vs Desimentor)
-- -----------------------------------------------------------------------------
ALTER TABLE pages
  ADD COLUMN display_mode ENUM('classic','elementor') NOT NULL DEFAULT 'classic' AFTER status;

ALTER TABLE services
  ADD COLUMN display_mode ENUM('classic','elementor') NOT NULL DEFAULT 'classic' AFTER status;

ALTER TABLE service_landings
  ADD COLUMN display_mode ENUM('classic','elementor') NOT NULL DEFAULT 'classic' AFTER status;

-- -----------------------------------------------------------------------------
-- 009 — Blog display_mode + desimentor entity types
-- -----------------------------------------------------------------------------
ALTER TABLE blog_posts
  ADD COLUMN display_mode ENUM('classic','elementor') NOT NULL DEFAULT 'classic' AFTER status;

ALTER TABLE desimentor_documents
  MODIFY COLUMN entity_type ENUM('page','homepage','service_landing','service','blog_post') NOT NULL;

-- -----------------------------------------------------------------------------
-- 010 — Portfolio items table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS portfolio_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  client_name VARCHAR(255) NOT NULL DEFAULT '',
  location VARCHAR(120) NOT NULL DEFAULT '',
  category VARCHAR(120) NOT NULL DEFAULT '',
  image VARCHAR(500) NOT NULL DEFAULT '',
  href VARCHAR(500) NOT NULL DEFAULT '',
  excerpt TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  show_on_homepage TINYINT(1) NOT NULL DEFAULT 1,
  status ENUM('published','draft') NOT NULL DEFAULT 'published',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_portfolio_status (status),
  INDEX idx_portfolio_home (show_on_homepage, status, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 013 — Portfolio slug + detail content
-- -----------------------------------------------------------------------------
ALTER TABLE portfolio_items
  ADD COLUMN slug VARCHAR(200) NOT NULL DEFAULT '' AFTER title;

ALTER TABLE portfolio_items
  ADD COLUMN content LONGTEXT NULL AFTER excerpt;

-- -----------------------------------------------------------------------------
-- 011 — Admin activity log
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  username VARCHAR(60) NOT NULL DEFAULT '',
  action VARCHAR(64) NOT NULL,
  method VARCHAR(10) NOT NULL DEFAULT '',
  path VARCHAR(255) NOT NULL DEFAULT '',
  summary VARCHAR(500) NOT NULL DEFAULT '',
  meta_json JSON NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_activity_created (created_at DESC),
  INDEX idx_activity_user (user_id, created_at DESC),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 012 — CRM inbox columns on form_submissions
-- -----------------------------------------------------------------------------
ALTER TABLE form_submissions
  ADD COLUMN from_name VARCHAR(120) NULL AFTER payload;

ALTER TABLE form_submissions
  ADD COLUMN from_email VARCHAR(190) NULL AFTER from_name;

ALTER TABLE form_submissions
  ADD COLUMN subject VARCHAR(255) NULL AFTER from_email;

ALTER TABLE form_submissions
  ADD COLUMN snippet VARCHAR(500) NULL AFTER subject;

ALTER TABLE form_submissions
  ADD COLUMN thread_id INT UNSIGNED NULL AFTER snippet;

ALTER TABLE form_submissions
  ADD COLUMN parent_id INT UNSIGNED NULL AFTER thread_id;

ALTER TABLE form_submissions
  ADD COLUMN folder VARCHAR(20) NOT NULL DEFAULT 'inbox' AFTER parent_id;

ALTER TABLE form_submissions
  ADD COLUMN is_starred TINYINT(1) NOT NULL DEFAULT 0 AFTER is_read;

ALTER TABLE form_submissions
  ADD COLUMN direction VARCHAR(10) NOT NULL DEFAULT 'inbound' AFTER is_starred;

ALTER TABLE form_submissions
  ADD COLUMN last_activity_at DATETIME NULL AFTER created_at;

CREATE INDEX idx_form_submissions_inbox ON form_submissions (folder, is_read, last_activity_at);

CREATE INDEX idx_form_submissions_thread ON form_submissions (thread_id);

CREATE INDEX idx_form_submissions_category ON form_submissions (form_type, folder);

-- -----------------------------------------------------------------------------
-- 014 — FAQs JSON on pages / services / portfolio / blog
-- -----------------------------------------------------------------------------
ALTER TABLE pages ADD COLUMN faqs JSON NULL AFTER content_html;

ALTER TABLE services ADD COLUMN faqs JSON NULL AFTER features;

ALTER TABLE portfolio_items ADD COLUMN faqs JSON NULL AFTER content;

ALTER TABLE blog_posts ADD COLUMN faqs JSON NULL AFTER content_html;

-- -----------------------------------------------------------------------------
-- 016 — Media member_id (member uploads)
-- -----------------------------------------------------------------------------
ALTER TABLE media
  ADD COLUMN member_id INT UNSIGNED NULL DEFAULT NULL AFTER large_path;

ALTER TABLE media ADD INDEX idx_media_member (member_id);

-- -----------------------------------------------------------------------------
-- 015 — Community / members (large — run database/migrations/015_community.sql
--       separately if you use forums / member login)
-- -----------------------------------------------------------------------------
