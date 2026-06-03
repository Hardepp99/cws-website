-- =============================================================================
-- Migration 017 — Agency homepage (NO schema change)
-- =============================================================================
-- Homepage reconstruction is content/order only. No new columns or tables.
--
-- For phpMyAdmin on production, use:
--   database/live/01_schema_pending_migrations.sql  (if DB behind)
--   database/live/02_fix_menu_db_keys.sql
--   database/live/03_homepage_agency_sections.sql
--
-- After deploy: edit copy in Admin → Homepage sections, or re-run seed on staging
-- and export homepage_sections rows if you prefer full JSON in DB.
-- =============================================================================

-- No-op marker for migration log
SELECT '017_agency_homepage: no DDL — see database/live/*.sql' AS migration_note;
