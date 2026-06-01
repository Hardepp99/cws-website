-- CRM inbox: enrich form submissions + threading for replies
ALTER TABLE form_submissions
  ADD COLUMN from_name VARCHAR(120) NULL AFTER payload,
  ADD COLUMN from_email VARCHAR(190) NULL AFTER from_name,
  ADD COLUMN subject VARCHAR(255) NULL AFTER from_email,
  ADD COLUMN snippet VARCHAR(500) NULL AFTER subject,
  ADD COLUMN thread_id INT UNSIGNED NULL AFTER snippet,
  ADD COLUMN parent_id INT UNSIGNED NULL AFTER thread_id,
  ADD COLUMN folder VARCHAR(20) NOT NULL DEFAULT 'inbox' AFTER parent_id,
  ADD COLUMN is_starred TINYINT(1) NOT NULL DEFAULT 0 AFTER is_read,
  ADD COLUMN direction VARCHAR(10) NOT NULL DEFAULT 'inbound' AFTER is_starred,
  ADD COLUMN last_activity_at DATETIME NULL AFTER created_at;

CREATE INDEX idx_form_submissions_inbox ON form_submissions (folder, is_read, last_activity_at);
CREATE INDEX idx_form_submissions_thread ON form_submissions (thread_id);
CREATE INDEX idx_form_submissions_category ON form_submissions (form_type, folder);
