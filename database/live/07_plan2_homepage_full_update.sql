-- =============================================================================
-- CWS LIVE — PLAN2 homepage (full section content + order)
-- =============================================================================
-- MariaDB-safe: JSON assigned as quoted string (no CAST AS JSON).
-- Source: frontend/src/data/cws-homepage-sections-defaults.json
-- Regenerate: node frontend/scripts/export-homepage-live-sql.mjs
-- Generated: 2026-06-03T12:00:51.311Z
-- =============================================================================

USE cws_cms;

SET NAMES utf8mb4;

START TRANSACTION;

UPDATE pages
SET
  slug = 'home',
  title = 'Home',
  is_homepage = 1,
  status = 'published',
  display_mode = 'classic'
WHERE is_homepage = 1
   OR slug IN ('home', 'index');

SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);

UPDATE pages SET is_homepage = 1 WHERE slug = 'home' AND @page_id IS NULL LIMIT 1;
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

UPDATE pages SET is_homepage = 0 WHERE id <> @page_id AND is_homepage = 1;

SELECT @page_id AS homepage_page_id;

UPDATE homepage_sections
SET status = 'trash',
    admin_title = CONCAT(COALESCE(NULLIF(admin_title, ''), layout), ' (archived)')
WHERE page_id = @page_id
  AND status <> 'trash'
  AND FIND_IN_SET(layout, 'hero_slider,trust_badges,why_codify,services_grid,tech_stack,industries,portfolio,process,testimonials,guarantees,pricing_packages,faq,cta') = 0;


-- ---------- hero_slider (sort 0) ----------
UPDATE homepage_sections
SET
  sort_order = 0,
  layout = 'hero_slider',
  status = 'published',
  admin_title = 'Hero',
  payload = '{"acfFcLayout":"hero_slider","eyebrow":"Premium Software & Digital Agency","headline":"Transform ideas into scalable digital products","subheadline":"Web development, mobile apps, AI integrations, and growth marketing for brands that compete globally - one accountable team from discovery to launch.","headlineParts":[{"text":"scalable","tone":"green"},{"text":"digital products","tone":"blue"}],"ctaPrimary":{"label":"Book consultation","href":"#ask-price"},"ctaSecondary":{"label":"Get free proposal","href":"/contact#contact-form"},"slides":[{"image":{"url":"/assets/images/hero1.png"}},{"image":{"url":"/assets/images/hero2.png"}},{"image":{"url":"/assets/images/hero3.png"}}],"heroVisual":"svg","personImage":"/assets/images/hero2.png","personImageAlt":"Creative Web Solutions - product engineering team","stats":[{"icon":"fas fa-project-diagram","count":549,"label":"Projects delivered","tone":"blue"},{"icon":"fas fa-users","count":320,"label":"Happy clients","tone":"green"},{"icon":"fas fa-globe-americas","count":25,"label":"Countries served","tone":"royal"},{"icon":"fas fa-award","count":15,"label":"Years experience","tone":"orange"}],"gmbRating":4.9,"gmbReviewCount":"120+","gmbReviews":[{"author":"Amit K.","rating":5,"text":"Enterprise-grade delivery with clear milestones. Our platform launch stayed on scope and on time.","ago":"3 weeks ago"},{"author":"Priya Sharma","rating":5,"text":"SEO, paid media, and product UX finally align - we attribute revenue to channels, not guesses.","ago":"1 month ago"},{"author":"Vikram S.","rating":5,"text":"Mobile app plus admin dashboard shipped in sprints. Communication felt like an in-house product team.","ago":"2 months ago"}],"marqueeItems":[{"letter":"W","title":"Website development","href":"/website-development-zirakpur"},{"letter":"M","title":"Mobile apps","href":"/mobile-app-development-zirakpur"},{"letter":"A","title":"AI solutions","href":"/custom-software-development-zirakpur"},{"letter":"S","title":"SEO & growth","href":"/seo-services-zirakpur"},{"letter":"U","title":"UI/UX design","href":"/ui-ux-design-zirakpur"},{"letter":"E","title":"Ecommerce","href":"/ecommerce-website-zirakpur"}]}'
WHERE page_id = @page_id AND layout = 'hero_slider' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 0, 'hero_slider', 'published', 'Hero', '{"acfFcLayout":"hero_slider","eyebrow":"Premium Software & Digital Agency","headline":"Transform ideas into scalable digital products","subheadline":"Web development, mobile apps, AI integrations, and growth marketing for brands that compete globally - one accountable team from discovery to launch.","headlineParts":[{"text":"scalable","tone":"green"},{"text":"digital products","tone":"blue"}],"ctaPrimary":{"label":"Book consultation","href":"#ask-price"},"ctaSecondary":{"label":"Get free proposal","href":"/contact#contact-form"},"slides":[{"image":{"url":"/assets/images/hero1.png"}},{"image":{"url":"/assets/images/hero2.png"}},{"image":{"url":"/assets/images/hero3.png"}}],"heroVisual":"svg","personImage":"/assets/images/hero2.png","personImageAlt":"Creative Web Solutions - product engineering team","stats":[{"icon":"fas fa-project-diagram","count":549,"label":"Projects delivered","tone":"blue"},{"icon":"fas fa-users","count":320,"label":"Happy clients","tone":"green"},{"icon":"fas fa-globe-americas","count":25,"label":"Countries served","tone":"royal"},{"icon":"fas fa-award","count":15,"label":"Years experience","tone":"orange"}],"gmbRating":4.9,"gmbReviewCount":"120+","gmbReviews":[{"author":"Amit K.","rating":5,"text":"Enterprise-grade delivery with clear milestones. Our platform launch stayed on scope and on time.","ago":"3 weeks ago"},{"author":"Priya Sharma","rating":5,"text":"SEO, paid media, and product UX finally align - we attribute revenue to channels, not guesses.","ago":"1 month ago"},{"author":"Vikram S.","rating":5,"text":"Mobile app plus admin dashboard shipped in sprints. Communication felt like an in-house product team.","ago":"2 months ago"}],"marqueeItems":[{"letter":"W","title":"Website development","href":"/website-development-zirakpur"},{"letter":"M","title":"Mobile apps","href":"/mobile-app-development-zirakpur"},{"letter":"A","title":"AI solutions","href":"/custom-software-development-zirakpur"},{"letter":"S","title":"SEO & growth","href":"/seo-services-zirakpur"},{"letter":"U","title":"UI/UX design","href":"/ui-ux-design-zirakpur"},{"letter":"E","title":"Ecommerce","href":"/ecommerce-website-zirakpur"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'hero_slider' AND hs.status <> 'trash'
  );


-- ---------- trust_badges (sort 1) ----------
UPDATE homepage_sections
SET
  sort_order = 1,
  layout = 'trust_badges',
  status = 'published',
  admin_title = 'Client trust',
  payload = '{"acfFcLayout":"trust_badges","sectionTheme":"light","badge":"Client trust","title":"Trusted by ambitious brands worldwide","subtitle":"Logos, awards, certifications, and partnerships that signal enterprise credibility before the first call.","items":[{"icon":"fas fa-building","title":"Global client logos","desc":"Retail, healthcare, B2B, and SaaS teams across multiple regions","tone":"blue"},{"icon":"fas fa-trophy","title":"Industry awards","desc":"Recognised for delivery quality, communication, and measurable outcomes","tone":"green"},{"icon":"fas fa-certificate","title":"Certified practices","desc":"Secure delivery, documented scope, and production-ready handover","tone":"purple"},{"icon":"fab fa-google","title":"4.9★ Google rating","desc":"Verified reviews from founders and marketing leaders","tone":"orange"},{"icon":"fas fa-handshake","title":"Technology partnerships","desc":"Cloud, payments, analytics, and MarTech integrations you can rely on","tone":"grey"},{"icon":"fas fa-shield-alt","title":"Enterprise security","desc":"Access control, backups, and sensible data handling baked into delivery","tone":"pink"}]}'
WHERE page_id = @page_id AND layout = 'trust_badges' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 1, 'trust_badges', 'published', 'Client trust', '{"acfFcLayout":"trust_badges","sectionTheme":"light","badge":"Client trust","title":"Trusted by ambitious brands worldwide","subtitle":"Logos, awards, certifications, and partnerships that signal enterprise credibility before the first call.","items":[{"icon":"fas fa-building","title":"Global client logos","desc":"Retail, healthcare, B2B, and SaaS teams across multiple regions","tone":"blue"},{"icon":"fas fa-trophy","title":"Industry awards","desc":"Recognised for delivery quality, communication, and measurable outcomes","tone":"green"},{"icon":"fas fa-certificate","title":"Certified practices","desc":"Secure delivery, documented scope, and production-ready handover","tone":"purple"},{"icon":"fab fa-google","title":"4.9★ Google rating","desc":"Verified reviews from founders and marketing leaders","tone":"orange"},{"icon":"fas fa-handshake","title":"Technology partnerships","desc":"Cloud, payments, analytics, and MarTech integrations you can rely on","tone":"grey"},{"icon":"fas fa-shield-alt","title":"Enterprise security","desc":"Access control, backups, and sensible data handling baked into delivery","tone":"pink"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'trust_badges' AND hs.status <> 'trash'
  );


-- ---------- why_codify (sort 2) ----------
UPDATE homepage_sections
SET
  sort_order = 2,
  layout = 'why_codify',
  status = 'published',
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


-- ---------- services_grid (sort 3) ----------
UPDATE homepage_sections
SET
  sort_order = 3,
  layout = 'services_grid',
  status = 'published',
  admin_title = 'Services',
  payload = '{"acfFcLayout":"services_grid","sectionTheme":"dark","badge":"Services","title":"Full-stack capabilities for $5k-$100k+ engagements","subtitle":"Strategy, design, engineering, and growth in one partner - each service links to a dedicated SEO landing page.","items":[{"icon":"fas fa-paint-brush","image":"https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=960&h=540&q=85","title":"Web design","desc":"Bold, on-brand interfaces that guide visitors to action - desktop and mobile, built for trust at first scroll.","href":"/ui-ux-design-zirakpur","tone":"pink"},{"icon":"fas fa-code","image":"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=960&h=540&q=85","title":"Website development","desc":"Fast, secure sites and landing pages with forms, CRM hooks, and analytics baked in - code your team can extend.","href":"/website-development-zirakpur","tone":"blue"},{"icon":"fas fa-mobile-alt","image":"https://images.unsplash.com/photo-1512945903694-92d7a22944f4?auto=format&fit=crop&w=960&h=540&q=85","title":"Mobile apps","desc":"Polished Android & iOS experiences users keep - onboarding, push, payments, and admin when you need scale.","href":"/mobile-app-development-zirakpur","tone":"green"},{"icon":"fas fa-bullhorn","image":"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=960&h=540&q=85","title":"Digital marketing","desc":"Google Ads, Meta, and landing pages engineered for leads - weekly clarity on cost per enquiry, not vanity charts.","href":"/digital-marketing-zirakpur","tone":"orange"},{"icon":"fas fa-robot","image":"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&h=540&q=85","title":"Custom software & AI","desc":"Dashboards, portals, automation, and AI features that replace manual work - shaped around how your team operates.","href":"/custom-software-development-zirakpur","tone":"grey"},{"icon":"fas fa-pen-nib","image":"https://images.unsplash.com/photo-1626785774573-4b7999ee4feb?auto=format&fit=crop&w=960&h=540&q=85","title":"Brand & graphics","desc":"Logos, decks, ad kits, and social systems that look expensive everywhere - consistent, launch-ready creative.","href":"/graphic-designing-zirakpur","tone":"pink"},{"icon":"fas fa-cart-shopping","image":"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=960&h=540&q=85","title":"Ecommerce","desc":"Shopify, WooCommerce, or custom storefronts with checkout that feels effortless - merchandising built to convert.","href":"/ecommerce-website-zirakpur","tone":"green"},{"icon":"fas fa-chart-line","image":"https://images.unsplash.com/photo-1432888498266-38ffec3eaf4a?auto=format&fit=crop&w=960&h=540&q=85","title":"SEO & content","desc":"Technical SEO, topic clusters, and content that ranks - so the right buyers find you when intent is highest.","href":"/seo-services-zirakpur","tone":"blue"}]}'
WHERE page_id = @page_id AND layout = 'services_grid' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 3, 'services_grid', 'published', 'Services', '{"acfFcLayout":"services_grid","sectionTheme":"dark","badge":"Services","title":"Full-stack capabilities for $5k-$100k+ engagements","subtitle":"Strategy, design, engineering, and growth in one partner - each service links to a dedicated SEO landing page.","items":[{"icon":"fas fa-paint-brush","image":"https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=960&h=540&q=85","title":"Web design","desc":"Bold, on-brand interfaces that guide visitors to action - desktop and mobile, built for trust at first scroll.","href":"/ui-ux-design-zirakpur","tone":"pink"},{"icon":"fas fa-code","image":"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=960&h=540&q=85","title":"Website development","desc":"Fast, secure sites and landing pages with forms, CRM hooks, and analytics baked in - code your team can extend.","href":"/website-development-zirakpur","tone":"blue"},{"icon":"fas fa-mobile-alt","image":"https://images.unsplash.com/photo-1512945903694-92d7a22944f4?auto=format&fit=crop&w=960&h=540&q=85","title":"Mobile apps","desc":"Polished Android & iOS experiences users keep - onboarding, push, payments, and admin when you need scale.","href":"/mobile-app-development-zirakpur","tone":"green"},{"icon":"fas fa-bullhorn","image":"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=960&h=540&q=85","title":"Digital marketing","desc":"Google Ads, Meta, and landing pages engineered for leads - weekly clarity on cost per enquiry, not vanity charts.","href":"/digital-marketing-zirakpur","tone":"orange"},{"icon":"fas fa-robot","image":"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&h=540&q=85","title":"Custom software & AI","desc":"Dashboards, portals, automation, and AI features that replace manual work - shaped around how your team operates.","href":"/custom-software-development-zirakpur","tone":"grey"},{"icon":"fas fa-pen-nib","image":"https://images.unsplash.com/photo-1626785774573-4b7999ee4feb?auto=format&fit=crop&w=960&h=540&q=85","title":"Brand & graphics","desc":"Logos, decks, ad kits, and social systems that look expensive everywhere - consistent, launch-ready creative.","href":"/graphic-designing-zirakpur","tone":"pink"},{"icon":"fas fa-cart-shopping","image":"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=960&h=540&q=85","title":"Ecommerce","desc":"Shopify, WooCommerce, or custom storefronts with checkout that feels effortless - merchandising built to convert.","href":"/ecommerce-website-zirakpur","tone":"green"},{"icon":"fas fa-chart-line","image":"https://images.unsplash.com/photo-1432888498266-38ffec3eaf4a?auto=format&fit=crop&w=960&h=540&q=85","title":"SEO & content","desc":"Technical SEO, topic clusters, and content that ranks - so the right buyers find you when intent is highest.","href":"/seo-services-zirakpur","tone":"blue"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'services_grid' AND hs.status <> 'trash'
  );


-- ---------- tech_stack (sort 4) ----------
UPDATE homepage_sections
SET
  sort_order = 4,
  layout = 'tech_stack',
  status = 'published',
  admin_title = 'Technologies',
  payload = '{"acfFcLayout":"tech_stack","sectionTheme":"light","badge":"Technologies","title":"Modern stack. Clear ownership. No lock-in surprises.","subtitle":"Frontend, backend, mobile, cloud, DevOps, AI, and blockchain - picked for maintainability and hiring ease.","items":[{"icon":"fab fa-react","title":"Frontend - React","tone":"blue"},{"icon":"fas fa-bolt","title":"Frontend - Next.js","tone":"grey"},{"icon":"fab fa-node-js","title":"Backend - Node.js","tone":"green"},{"icon":"fab fa-php","title":"Backend - PHP / Laravel","tone":"purple"},{"icon":"fab fa-android","title":"Mobile - Flutter","tone":"green"},{"icon":"fab fa-aws","title":"Cloud - AWS","tone":"orange"},{"icon":"fas fa-infinity","title":"DevOps - CI/CD","tone":"grey"},{"icon":"fas fa-robot","title":"AI - Integrations","tone":"pink"},{"icon":"fab fa-ethereum","title":"Blockchain - Web3","tone":"blue"}]}'
WHERE page_id = @page_id AND layout = 'tech_stack' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 4, 'tech_stack', 'published', 'Technologies', '{"acfFcLayout":"tech_stack","sectionTheme":"light","badge":"Technologies","title":"Modern stack. Clear ownership. No lock-in surprises.","subtitle":"Frontend, backend, mobile, cloud, DevOps, AI, and blockchain - picked for maintainability and hiring ease.","items":[{"icon":"fab fa-react","title":"Frontend - React","tone":"blue"},{"icon":"fas fa-bolt","title":"Frontend - Next.js","tone":"grey"},{"icon":"fab fa-node-js","title":"Backend - Node.js","tone":"green"},{"icon":"fab fa-php","title":"Backend - PHP / Laravel","tone":"purple"},{"icon":"fab fa-android","title":"Mobile - Flutter","tone":"green"},{"icon":"fab fa-aws","title":"Cloud - AWS","tone":"orange"},{"icon":"fas fa-infinity","title":"DevOps - CI/CD","tone":"grey"},{"icon":"fas fa-robot","title":"AI - Integrations","tone":"pink"},{"icon":"fab fa-ethereum","title":"Blockchain - Web3","tone":"blue"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'tech_stack' AND hs.status <> 'trash'
  );


-- ---------- industries (sort 5) ----------
UPDATE homepage_sections
SET
  sort_order = 5,
  layout = 'industries',
  status = 'published',
  admin_title = 'Industries',
  payload = '{"acfFcLayout":"industries","sectionTheme":"dark","badge":"Industries","title":"Sector expertise that shortens discovery","subtitle":"Education, healthcare, hospitality, real estate, agriculture, manufacturing, fintech, logistics, and startups - each with tailored landing pages.","items":[{"icon":"fas fa-graduation-cap","title":"Education","tone":"blue"},{"icon":"fas fa-heartbeat","title":"Healthcare","tone":"pink"},{"icon":"fas fa-hotel","title":"Hospitality","tone":"orange"},{"icon":"fas fa-building","title":"Real estate","tone":"green"},{"icon":"fas fa-seedling","title":"Agriculture","tone":"green"},{"icon":"fas fa-industry","title":"Manufacturing","tone":"grey"},{"icon":"fas fa-coins","title":"Fintech","tone":"purple"},{"icon":"fas fa-truck","title":"Logistics","tone":"blue"},{"icon":"fas fa-rocket","title":"Startups","tone":"orange"}]}'
WHERE page_id = @page_id AND layout = 'industries' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 5, 'industries', 'published', 'Industries', '{"acfFcLayout":"industries","sectionTheme":"dark","badge":"Industries","title":"Sector expertise that shortens discovery","subtitle":"Education, healthcare, hospitality, real estate, agriculture, manufacturing, fintech, logistics, and startups - each with tailored landing pages.","items":[{"icon":"fas fa-graduation-cap","title":"Education","tone":"blue"},{"icon":"fas fa-heartbeat","title":"Healthcare","tone":"pink"},{"icon":"fas fa-hotel","title":"Hospitality","tone":"orange"},{"icon":"fas fa-building","title":"Real estate","tone":"green"},{"icon":"fas fa-seedling","title":"Agriculture","tone":"green"},{"icon":"fas fa-industry","title":"Manufacturing","tone":"grey"},{"icon":"fas fa-coins","title":"Fintech","tone":"purple"},{"icon":"fas fa-truck","title":"Logistics","tone":"blue"},{"icon":"fas fa-rocket","title":"Startups","tone":"orange"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'industries' AND hs.status <> 'trash'
  );


-- ---------- portfolio (sort 6) ----------
UPDATE homepage_sections
SET
  sort_order = 6,
  layout = 'portfolio',
  status = 'published',
  admin_title = 'Case studies',
  payload = '{"acfFcLayout":"portfolio","sectionTheme":"dark","badge":"Featured case studies","title":"Challenge → solution → measurable results","subtitle":"Real outcomes such as +250% revenue, +150K users, and -60% operating costs - explore projects with context, tech stack, and timelines.","ctaLabel":"View case studies","ctaHref":"/portfolio"}'
WHERE page_id = @page_id AND layout = 'portfolio' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 6, 'portfolio', 'published', 'Case studies', '{"acfFcLayout":"portfolio","sectionTheme":"dark","badge":"Featured case studies","title":"Challenge → solution → measurable results","subtitle":"Real outcomes such as +250% revenue, +150K users, and -60% operating costs - explore projects with context, tech stack, and timelines.","ctaLabel":"View case studies","ctaHref":"/portfolio"}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'portfolio' AND hs.status <> 'trash'
  );


-- ---------- process (sort 7) ----------
UPDATE homepage_sections
SET
  sort_order = 7,
  layout = 'process',
  status = 'published',
  admin_title = 'Process',
  payload = '{"acfFcLayout":"process","sectionTheme":"light","backdropImage":"/assets/images/process-hero-mac-students.jpg","backdropStrength":40,"badge":"Development process","title":"Interactive delivery timeline - seven clear phases","subtitle":"Discovery through support - you always know what we are doing this week and what you need to approve.","steps":[{"icon":"fas fa-search","title":"Discovery","description":"Goals, users, integrations, risks, and success metrics captured in a written brief."},{"icon":"fas fa-microscope","title":"Research","description":"Competitive scan, analytics review, and technical spikes before we commit to scope."},{"icon":"fas fa-pencil-ruler","title":"UI/UX","description":"Wireframes and high-fidelity UI you approve - mobile, accessibility, and brand aligned."},{"icon":"fas fa-code","title":"Development","description":"Staging builds, API work, and demos on a predictable sprint cadence."},{"icon":"fas fa-vial","title":"Testing","description":"QA across devices, performance checks, and sign-off checklists before launch."},{"icon":"fas fa-rocket","title":"Launch","description":"Go-live, tracking, training, and handover docs your team can operate."},{"icon":"fas fa-life-ring","title":"Support","description":"Maintenance, iterations, and retainers so momentum continues after day one."}]}'
WHERE page_id = @page_id AND layout = 'process' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 7, 'process', 'published', 'Process', '{"acfFcLayout":"process","sectionTheme":"light","backdropImage":"/assets/images/process-hero-mac-students.jpg","backdropStrength":40,"badge":"Development process","title":"Interactive delivery timeline - seven clear phases","subtitle":"Discovery through support - you always know what we are doing this week and what you need to approve.","steps":[{"icon":"fas fa-search","title":"Discovery","description":"Goals, users, integrations, risks, and success metrics captured in a written brief."},{"icon":"fas fa-microscope","title":"Research","description":"Competitive scan, analytics review, and technical spikes before we commit to scope."},{"icon":"fas fa-pencil-ruler","title":"UI/UX","description":"Wireframes and high-fidelity UI you approve - mobile, accessibility, and brand aligned."},{"icon":"fas fa-code","title":"Development","description":"Staging builds, API work, and demos on a predictable sprint cadence."},{"icon":"fas fa-vial","title":"Testing","description":"QA across devices, performance checks, and sign-off checklists before launch."},{"icon":"fas fa-rocket","title":"Launch","description":"Go-live, tracking, training, and handover docs your team can operate."},{"icon":"fas fa-life-ring","title":"Support","description":"Maintenance, iterations, and retainers so momentum continues after day one."}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'process' AND hs.status <> 'trash'
  );


-- ---------- testimonials (sort 8) ----------
UPDATE homepage_sections
SET
  sort_order = 8,
  layout = 'testimonials',
  status = 'published',
  admin_title = 'Testimonials',
  payload = '{"acfFcLayout":"testimonials","sectionTheme":"dark","badge":"Testimonials","title":"What founders and marketing leaders say","subtitle":"Ratings, roles, and reviews from teams who needed premium delivery - not another template refresh.","testimonials":[{"name":"Sarah Mitchell","text":"They rebuilt our funnel and ecommerce stack - revenue up sharply within two quarters. Communication was board-ready every week.","role":"CMO - Retail","rating":5},{"name":"Dr. Rajesh Nair","text":"Patient booking, compliance-friendly UX, and SEO moved together. Staff adoption was smooth because training was included.","role":"Operations Director - Healthcare","rating":5},{"name":"James Porter","text":"Dedicated developers embedded with our product squad. We shipped integrations months faster than hiring locally.","role":"VP Engineering - B2B SaaS","rating":5},{"name":"Elena Costa","text":"Landing pages, ads, and analytics finally tell one story. Cost per qualified lead dropped while volume grew.","role":"Growth Lead - Fintech","rating":5}]}'
WHERE page_id = @page_id AND layout = 'testimonials' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 8, 'testimonials', 'published', 'Testimonials', '{"acfFcLayout":"testimonials","sectionTheme":"dark","badge":"Testimonials","title":"What founders and marketing leaders say","subtitle":"Ratings, roles, and reviews from teams who needed premium delivery - not another template refresh.","testimonials":[{"name":"Sarah Mitchell","text":"They rebuilt our funnel and ecommerce stack - revenue up sharply within two quarters. Communication was board-ready every week.","role":"CMO - Retail","rating":5},{"name":"Dr. Rajesh Nair","text":"Patient booking, compliance-friendly UX, and SEO moved together. Staff adoption was smooth because training was included.","role":"Operations Director - Healthcare","rating":5},{"name":"James Porter","text":"Dedicated developers embedded with our product squad. We shipped integrations months faster than hiring locally.","role":"VP Engineering - B2B SaaS","rating":5},{"name":"Elena Costa","text":"Landing pages, ads, and analytics finally tell one story. Cost per qualified lead dropped while volume grew.","role":"Growth Lead - Fintech","rating":5}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'testimonials' AND hs.status <> 'trash'
  );


-- ---------- guarantees (sort 9) ----------
UPDATE homepage_sections
SET
  sort_order = 9,
  layout = 'guarantees',
  status = 'published',
  admin_title = 'Guarantees',
  payload = '{"acfFcLayout":"guarantees","sectionTheme":"light","badge":"Peace of mind","title":"Enterprise promises in every statement of work","subtitle":"Written scope, staging approvals, and ownership transfer - standard on launches and retainers alike.","items":[{"icon":"fas fa-file-contract","title":"Fixed-scope clarity","desc":"Deliverables, owners, timelines, and revision rounds documented upfront.","tone":"blue"},{"icon":"fas fa-eye","title":"Approve on staging","desc":"Desktop, tablet, and mobile sign-off before production keys turn.","tone":"green"},{"icon":"fas fa-key","title":"You own the assets","desc":"Repos, design files, domains, and credentials handed over at go-live.","tone":"purple"},{"icon":"fas fa-life-ring","title":"Support after launch","desc":"Security patches, content updates, and optional 24/7 escalation paths.","tone":"orange"}]}'
WHERE page_id = @page_id AND layout = 'guarantees' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 9, 'guarantees', 'published', 'Guarantees', '{"acfFcLayout":"guarantees","sectionTheme":"light","badge":"Peace of mind","title":"Enterprise promises in every statement of work","subtitle":"Written scope, staging approvals, and ownership transfer - standard on launches and retainers alike.","items":[{"icon":"fas fa-file-contract","title":"Fixed-scope clarity","desc":"Deliverables, owners, timelines, and revision rounds documented upfront.","tone":"blue"},{"icon":"fas fa-eye","title":"Approve on staging","desc":"Desktop, tablet, and mobile sign-off before production keys turn.","tone":"green"},{"icon":"fas fa-key","title":"You own the assets","desc":"Repos, design files, domains, and credentials handed over at go-live.","tone":"purple"},{"icon":"fas fa-life-ring","title":"Support after launch","desc":"Security patches, content updates, and optional 24/7 escalation paths.","tone":"orange"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'guarantees' AND hs.status <> 'trash'
  );


-- ---------- pricing_packages (sort 10) ----------
UPDATE homepage_sections
SET
  sort_order = 10,
  layout = 'pricing_packages',
  status = 'published',
  admin_title = 'Pricing models',
  payload = '{"acfFcLayout":"pricing_packages","sectionTheme":"dark","badge":"Pricing models","title":"Engagement models that fit your stage","subtitle":"Transparent ranges after discovery - from fixed-cost launches to embedded engineers and monthly retainers.","items":[{"icon":"fas fa-file-invoice-dollar","title":"Fixed cost","desc":"Defined scope, milestone payments, and a clear finish line for websites and MVPs.","tone":"blue"},{"icon":"fas fa-user-clock","title":"Dedicated developers","desc":"Senior engineers in your tools, ceremonies, and release train.","tone":"green"},{"icon":"fas fa-people-arrows","title":"Team augmentation","desc":"Designers, developers, or marketers plugged in without a long hiring cycle.","tone":"purple"},{"icon":"fas fa-calendar-check","title":"Monthly retainers","desc":"Ongoing product, SEO, paid media, and support with predictable monthly investment.","tone":"orange"}]}'
WHERE page_id = @page_id AND layout = 'pricing_packages' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 10, 'pricing_packages', 'published', 'Pricing models', '{"acfFcLayout":"pricing_packages","sectionTheme":"dark","badge":"Pricing models","title":"Engagement models that fit your stage","subtitle":"Transparent ranges after discovery - from fixed-cost launches to embedded engineers and monthly retainers.","items":[{"icon":"fas fa-file-invoice-dollar","title":"Fixed cost","desc":"Defined scope, milestone payments, and a clear finish line for websites and MVPs.","tone":"blue"},{"icon":"fas fa-user-clock","title":"Dedicated developers","desc":"Senior engineers in your tools, ceremonies, and release train.","tone":"green"},{"icon":"fas fa-people-arrows","title":"Team augmentation","desc":"Designers, developers, or marketers plugged in without a long hiring cycle.","tone":"purple"},{"icon":"fas fa-calendar-check","title":"Monthly retainers","desc":"Ongoing product, SEO, paid media, and support with predictable monthly investment.","tone":"orange"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'pricing_packages' AND hs.status <> 'trash'
  );


-- ---------- faq (sort 11) ----------
UPDATE homepage_sections
SET
  sort_order = 11,
  layout = 'faq',
  status = 'published',
  admin_title = 'FAQ',
  payload = '{"acfFcLayout":"faq","sectionTheme":"light","badge":"FAQ","title":"Answers for serious buyers","subtitle":"SEO-friendly questions founders ask before a $5k-$100k+ engagement - use Ask price for a quick estimate range.","items":[{"icon":"fas fa-calculator","title":"How does the project cost calculator work?","desc":"Choose project type, features, and timeline in Ask price - we reply within one business day with a realistic range and next steps.","tone":"green"},{"icon":"fas fa-rupee-sign","title":"What should I budget for a business website?","desc":"Scope drives investment - pages, integrations, languages, and compliance. You receive written options after discovery, not vague guesses.","tone":"blue"},{"icon":"fas fa-clock","title":"How fast can you launch?","desc":"Marketing sites often ship in 3-6 weeks. Apps and platforms follow a milestone roadmap shared before kickoff.","tone":"purple"},{"icon":"fas fa-mobile-alt","title":"Do you build iOS, Android, and cross-platform apps?","desc":"Yes - native and cross-platform, with admin panels, APIs, and store submission when required.","tone":"orange"},{"icon":"fas fa-globe","title":"Do you work with international clients?","desc":"Daily. Video workshops, async updates, staging reviews, and contracts in English across time zones.","tone":"grey"}]}'
WHERE page_id = @page_id AND layout = 'faq' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 11, 'faq', 'published', 'FAQ', '{"acfFcLayout":"faq","sectionTheme":"light","badge":"FAQ","title":"Answers for serious buyers","subtitle":"SEO-friendly questions founders ask before a $5k-$100k+ engagement - use Ask price for a quick estimate range.","items":[{"icon":"fas fa-calculator","title":"How does the project cost calculator work?","desc":"Choose project type, features, and timeline in Ask price - we reply within one business day with a realistic range and next steps.","tone":"green"},{"icon":"fas fa-rupee-sign","title":"What should I budget for a business website?","desc":"Scope drives investment - pages, integrations, languages, and compliance. You receive written options after discovery, not vague guesses.","tone":"blue"},{"icon":"fas fa-clock","title":"How fast can you launch?","desc":"Marketing sites often ship in 3-6 weeks. Apps and platforms follow a milestone roadmap shared before kickoff.","tone":"purple"},{"icon":"fas fa-mobile-alt","title":"Do you build iOS, Android, and cross-platform apps?","desc":"Yes - native and cross-platform, with admin panels, APIs, and store submission when required.","tone":"orange"},{"icon":"fas fa-globe","title":"Do you work with international clients?","desc":"Daily. Video workshops, async updates, staging reviews, and contracts in English across time zones.","tone":"grey"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'faq' AND hs.status <> 'trash'
  );


-- ---------- cta (sort 12) ----------
UPDATE homepage_sections
SET
  sort_order = 12,
  layout = 'cta',
  status = 'published',
  admin_title = 'Final CTA',
  payload = '{"acfFcLayout":"cta","sectionTheme":"dark","title":"Book your consultation","subtitle":"Tell us what you are building - we respond within one business day with scope, timeline, and a transparent estimate for your website, app, or growth program.","ctaLabel":"Book consultation","ctaHref":"#ask-price","ctaPrimary":{"label":"Book consultation","href":"#ask-price"},"ctaSecondary":{"label":"Get free proposal","href":"/contact#contact-form"}}'
WHERE page_id = @page_id AND layout = 'cta' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 12, 'cta', 'published', 'Final CTA', '{"acfFcLayout":"cta","sectionTheme":"dark","title":"Book your consultation","subtitle":"Tell us what you are building - we respond within one business day with scope, timeline, and a transparent estimate for your website, app, or growth program.","ctaLabel":"Book consultation","ctaHref":"#ask-price","ctaPrimary":{"label":"Book consultation","href":"#ask-price"},"ctaSecondary":{"label":"Get free proposal","href":"/contact#contact-form"}}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'cta' AND hs.status <> 'trash'
  );


COMMIT;

SELECT id, layout, status, sort_order, admin_title,
       JSON_UNQUOTE(JSON_EXTRACT(payload, '$.title')) AS section_title
FROM homepage_sections
WHERE page_id = @page_id
ORDER BY sort_order ASC, id ASC;
