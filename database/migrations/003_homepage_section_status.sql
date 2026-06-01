USE cws_cms;

ALTER TABLE homepage_sections
  ADD COLUMN status ENUM('published','draft','trash') NOT NULL DEFAULT 'published' AFTER layout,
  ADD COLUMN admin_title VARCHAR(255) NOT NULL DEFAULT '' AFTER status,
  ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

UPDATE homepage_sections SET status = 'published' WHERE status IS NULL OR status = '';
