-- =============================================================================
-- CWS Live — Refresh homepage copy (worldwide, no city targeting in marketing text)
-- =============================================================================
-- Does NOT change site_settings.address (office address stays as-is).
-- Run after deploy of new frontend defaults, or to overwrite old CMS copy.
-- =============================================================================

USE u354490369_cwsdb;

SET @page_id := (
  SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1
);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

-- Hero
UPDATE homepage_sections
SET payload = JSON_SET(
  JSON_SET(
    JSON_SET(
      JSON_SET(payload, '$.eyebrow', 'Global Web · Mobile · Digital Marketing Agency'),
      '$.headline', 'Turn visitors into paying customers'
    ),
    '$.subheadline',
    'Creative Web Solutions designs, builds, and markets high-performing websites and apps for brands that sell worldwide — one team from first sketch to measurable growth.'
  ),
  '$.ctaPrimary', JSON_OBJECT('label', 'Get free proposal', 'href', '#ask-price')
)
WHERE page_id = @page_id AND layout = 'hero_slider' AND status <> 'trash';

-- Trust
UPDATE homepage_sections
SET payload = JSON_SET(
  JSON_SET(payload, '$.title', 'One partner. Full stack. Zero guesswork.'),
  '$.subtitle',
  'Stop coordinating separate designers, developers, and marketers. We own the full journey with clear milestones and honest updates.'
)
WHERE page_id = @page_id AND layout = 'trust_badges' AND status <> 'trash';

-- Services header
UPDATE homepage_sections
SET payload = JSON_SET(
  JSON_SET(payload, '$.title', 'Everything you need to launch and scale online'),
  '$.subtitle',
  'Design, engineering, and growth under one roof — launch faster, look sharper, and turn traffic into qualified enquiries anywhere you sell.'
)
WHERE page_id = @page_id AND layout = 'services_grid' AND status <> 'trash';

-- Portfolio header
UPDATE homepage_sections
SET payload = JSON_SET(
  JSON_SET(payload, '$.title', 'Products that look premium and perform'),
  '$.subtitle',
  'Browse websites, apps, and campaigns built for healthcare, retail, B2B, and fast-growing startups.'
)
WHERE page_id = @page_id AND layout = 'portfolio' AND status <> 'trash';

-- FAQ — replace region-specific question if present
UPDATE homepage_sections
SET payload = JSON_SET(
  payload,
  '$.items',
  JSON_ARRAY(
    JSON_OBJECT('icon','fas fa-rupee-sign','title','What should I budget for a business website?','desc','Scope drives investment. After discovery you receive a written estimate with options.','tone','green'),
    JSON_OBJECT('icon','fas fa-clock','title','How fast can you go live?','desc','Marketing sites often land in 3–6 weeks. Apps follow a milestone plan shared before kickoff.','tone','blue'),
    JSON_OBJECT('icon','fas fa-mobile-alt','title','Do you build iOS, Android, and cross-platform apps?','desc','Yes — native and cross-platform, with admin panels and APIs when needed.','tone','purple'),
    JSON_OBJECT('icon','fas fa-bullhorn','title','Can you own SEO and paid acquisition?','desc','Yes. Landing pages, tracking, and campaigns built together.','tone','orange'),
    JSON_OBJECT('icon','fas fa-globe','title','Do you work with international clients?','desc','Every day. Video workshops, async updates, and contracts in English — aligned to your timezone.','tone','grey')
  )
)
WHERE page_id = @page_id AND layout = 'faq' AND status <> 'trash';

-- Final CTA
UPDATE homepage_sections
SET payload = JSON_SET(
  JSON_SET(payload, '$.title', 'Ready for digital that actually sells?'),
  '$.subtitle',
  'Tell us what you are building — we respond within one business day with scope, timeline, and a transparent estimate.'
)
WHERE page_id = @page_id AND layout = 'cta' AND status <> 'trash';

SELECT layout, JSON_UNQUOTE(JSON_EXTRACT(payload, '$.title')) AS title
FROM homepage_sections
WHERE page_id = @page_id AND status <> 'trash'
ORDER BY sort_order;
