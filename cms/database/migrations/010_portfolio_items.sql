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
) ENGINE=InnoDB;
