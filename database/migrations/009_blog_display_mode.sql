-- Blog posts: live classic HTML vs Elementor (Desimentor), same as pages.

ALTER TABLE blog_posts
  ADD COLUMN display_mode ENUM('classic','elementor') NOT NULL DEFAULT 'classic' AFTER status;

ALTER TABLE desimentor_documents
  MODIFY COLUMN entity_type ENUM('page','homepage','service_landing','service','blog_post') NOT NULL;
