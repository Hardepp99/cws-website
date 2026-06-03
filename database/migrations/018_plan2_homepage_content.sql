-- =============================================================================
-- Migration 018 — Plan2 homepage content (NO schema change)
-- =============================================================================
-- Content and section order ship via:
--   database/live/07_plan2_homepage_full_update.sql
--   database/live/08_plan2_site_settings_promo.sql
--
-- Regenerate from repo: node frontend/scripts/export-homepage-live-sql.mjs
-- =============================================================================

SELECT '018_plan2: apply database/live/07 and 08 on production' AS migration_note;
