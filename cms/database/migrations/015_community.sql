-- Members, sessions, blog comments, forums, member-submitted blogs

CREATE TABLE IF NOT EXISTS members (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NULL,
  google_sub VARCHAR(64) NULL,
  display_name VARCHAR(120) NOT NULL,
  avatar_url VARCHAR(500) NULL,
  status ENUM('active','suspended') NOT NULL DEFAULT 'active',
  email_verified_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_members_email (email),
  UNIQUE KEY uq_members_google (google_sub),
  INDEX idx_members_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS member_sessions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  member_id INT UNSIGNED NOT NULL,
  token CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_member_token (token),
  INDEX idx_member_sessions_member (member_id),
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS blog_comments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  blog_post_id INT UNSIGNED NOT NULL,
  member_id INT UNSIGNED NOT NULL,
  body TEXT NOT NULL,
  status ENUM('pending','approved','rejected','spam') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_blog_comments_post (blog_post_id, status),
  INDEX idx_blog_comments_member (member_id),
  FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS forums (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(200) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(80) DEFAULT 'fa-comments',
  sort_order INT NOT NULL DEFAULT 0,
  status ENUM('published','draft') NOT NULL DEFAULT 'published',
  created_by_member_id INT UNSIGNED NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_forums_slug (slug),
  INDEX idx_forums_status (status, sort_order),
  FOREIGN KEY (created_by_member_id) REFERENCES members(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS forum_topics (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  forum_id INT UNSIGNED NOT NULL,
  slug VARCHAR(200) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body LONGTEXT NOT NULL,
  member_id INT UNSIGNED NOT NULL,
  status ENUM('pending','published','locked','rejected','trash') NOT NULL DEFAULT 'pending',
  is_pinned TINYINT(1) NOT NULL DEFAULT 0,
  reply_count INT UNSIGNED NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_forum_topic_slug (forum_id, slug),
  INDEX idx_forum_topics_forum (forum_id, status, last_activity_at),
  FOREIGN KEY (forum_id) REFERENCES forums(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS forum_replies (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  topic_id INT UNSIGNED NOT NULL,
  member_id INT UNSIGNED NOT NULL,
  parent_reply_id INT UNSIGNED NULL,
  body TEXT NOT NULL,
  status ENUM('pending','approved','rejected','spam') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_forum_replies_topic (topic_id, status),
  FOREIGN KEY (topic_id) REFERENCES forum_topics(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_reply_id) REFERENCES forum_replies(id) ON DELETE SET NULL
) ENGINE=InnoDB;

ALTER TABLE blog_posts
  ADD COLUMN author_member_id INT UNSIGNED NULL AFTER id,
  ADD COLUMN author_type ENUM('staff','member') NOT NULL DEFAULT 'staff' AFTER author_member_id;

ALTER TABLE blog_posts
  MODIFY status ENUM('published','draft','pending_review','rejected') NOT NULL DEFAULT 'draft';

ALTER TABLE blog_posts
  ADD INDEX idx_blog_posts_member (author_member_id),
  ADD CONSTRAINT fk_blog_posts_member FOREIGN KEY (author_member_id) REFERENCES members(id) ON DELETE SET NULL;
