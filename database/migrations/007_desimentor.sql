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
