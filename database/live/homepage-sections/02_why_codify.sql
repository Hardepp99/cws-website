-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

-- Section: why_codify
UPDATE homepage_sections
SET sort_order = 2, layout = 'why_codify', status = 'published',
    admin_title = 'Why choose us',
    payload = '{"acfFcLayout":"why_codify","sectionTheme":"light","badge":"Why businesses choose us","title":"Built like a product company. Delivered like a premium agency.","subtitle":"Modern bento layout - the reasons enterprise buyers shortlist us before they read the fine print.","cards":[{"icon":"fas fa-users-cog","title":"Dedicated teams","description":"Named designers, engineers, and marketers on your account - not a rotating ticket queue.","number":"01"},{"icon":"fas fa-shipping-fast","title":"Fast delivery","description":"Milestone plans, staging reviews, and weekly demos so momentum never stalls.","number":"02"},{"icon":"fas fa-shield-alt","title":"Enterprise security","description":"Sensible auth, hosting, backups, and release discipline for serious workloads.","number":"03"},{"icon":"fas fa-brain","title":"AI-powered solutions","description":"Automation, copilots, and data features where they save time - not hype for slide decks.","number":"04"},{"icon":"fas fa-layer-group","title":"Scalable architecture","description":"APIs, modular frontends, and cloud choices that survive your next growth spike.","number":"05"},{"icon":"fas fa-headset","title":"24/7 support options","description":"Post-launch care, retainers, and escalation paths when your business cannot wait.","number":"06"}]}'
WHERE page_id = @page_id AND layout = 'why_codify' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 2, 'why_codify', 'published', 'Why choose us', '{"acfFcLayout":"why_codify","sectionTheme":"light","badge":"Why businesses choose us","title":"Built like a product company. Delivered like a premium agency.","subtitle":"Modern bento layout - the reasons enterprise buyers shortlist us before they read the fine print.","cards":[{"icon":"fas fa-users-cog","title":"Dedicated teams","description":"Named designers, engineers, and marketers on your account - not a rotating ticket queue.","number":"01"},{"icon":"fas fa-shipping-fast","title":"Fast delivery","description":"Milestone plans, staging reviews, and weekly demos so momentum never stalls.","number":"02"},{"icon":"fas fa-shield-alt","title":"Enterprise security","description":"Sensible auth, hosting, backups, and release discipline for serious workloads.","number":"03"},{"icon":"fas fa-brain","title":"AI-powered solutions","description":"Automation, copilots, and data features where they save time - not hype for slide decks.","number":"04"},{"icon":"fas fa-layer-group","title":"Scalable architecture","description":"APIs, modular frontends, and cloud choices that survive your next growth spike.","number":"05"},{"icon":"fas fa-headset","title":"24/7 support options","description":"Post-launch care, retainers, and escalation paths when your business cannot wait.","number":"06"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'why_codify' AND hs.status <> 'trash'
  );
