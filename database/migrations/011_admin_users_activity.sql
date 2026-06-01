-- Multi-user admin roles + activity audit log

ALTER TABLE users
  MODIFY COLUMN role ENUM('admin', 'user') NOT NULL DEFAULT 'user';

UPDATE users SET role = 'user' WHERE role NOT IN ('admin', 'user') OR role = 'editor';

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
