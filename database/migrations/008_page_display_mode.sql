-- Live site display: classic (HTML/sections) vs elementor (Desimentor builder).
-- Classic content is never overwritten by Desimentor documents.

ALTER TABLE pages
  ADD COLUMN display_mode ENUM('classic','elementor') NOT NULL DEFAULT 'classic' AFTER status;

ALTER TABLE services
  ADD COLUMN display_mode ENUM('classic','elementor') NOT NULL DEFAULT 'classic' AFTER status;

ALTER TABLE service_landings
  ADD COLUMN display_mode ENUM('classic','elementor') NOT NULL DEFAULT 'classic' AFTER status;
