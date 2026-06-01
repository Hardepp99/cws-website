ALTER TABLE blog_posts
  ADD COLUMN categories JSON NULL AFTER published_date,
  ADD COLUMN is_featured TINYINT(1) NOT NULL DEFAULT 0 AFTER categories;
