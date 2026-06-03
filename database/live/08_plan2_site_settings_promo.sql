-- =============================================================================
-- CWS LIVE — site_settings promo bar (plan2 announcement bar)
-- =============================================================================
-- Run after homepage update. Safe to re-run.
-- =============================================================================

USE cws_cms;

SET NAMES utf8mb4;

START TRANSACTION;

INSERT INTO site_settings (id, payload)
VALUES (
  1,
  '{"promoOfferEnabled":"1","promoOfferText":"Limited-time: written quote on website & app packages — reply within one business day","promoOfferQuoteLabel":"Ask price","promoOfferCallLabel":"Call now"}'
)
ON DUPLICATE KEY UPDATE payload = JSON_MERGE_PATCH(
  COALESCE(payload, JSON_OBJECT()),
  JSON_OBJECT(
    'promoOfferEnabled', '1',
    'promoOfferText', 'Limited-time: written quote on website & app packages — reply within one business day',
    'promoOfferQuoteLabel', 'Ask price',
    'promoOfferCallLabel', 'Call now'
  )
);

COMMIT;

SELECT JSON_UNQUOTE(JSON_EXTRACT(payload, '$.promoOfferText')) AS promo_text FROM site_settings WHERE id = 1;
