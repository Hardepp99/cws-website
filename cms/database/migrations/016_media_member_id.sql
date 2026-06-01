-- Track member-uploaded media (blog featured images, etc.)
ALTER TABLE media
  ADD COLUMN member_id INT UNSIGNED NULL DEFAULT NULL AFTER large_path,
  ADD INDEX idx_media_member (member_id);
