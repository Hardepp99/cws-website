USE cws_cms;

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
);
