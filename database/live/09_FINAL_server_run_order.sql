-- =============================================================================
-- CWS LIVE — FINAL POST TO SERVER (plan2)
-- =============================================================================
-- Run in phpMyAdmin on database cws_cms IN ORDER:
--
--   1) database/live/01_schema_pending_migrations.sql  (ignore duplicate column errors)
--   2) database/live/02_fix_menu_db_keys.sql
--   3) database/live/07_plan2_homepage_full_update.sql   (this file's sibling — homepage)
--   4) database/live/08_plan2_site_settings_promo.sql
--
-- Or import ONLY steps 3+4 if schema/menus already applied.
-- Does NOT overwrite blog, service pages, or staff-edited non-home content.
-- =============================================================================

SELECT 'Run 07_plan2_homepage_full_update.sql then 08_plan2_site_settings_promo.sql' AS next_step;
