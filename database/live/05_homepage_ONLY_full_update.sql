-- =============================================================================
-- CWS LIVE — HOMEPAGE ONLY (full section content update)
-- =============================================================================
-- MariaDB-safe: JSON assigned as quoted string (no CAST AS JSON).
-- If phpMyAdmin truncates long lines, use homepage-sections/*.sql one file each.
--
-- Generated: 2026-06-03T11:36:57.214Z
-- Regenerate: node frontend/scripts/export-homepage-live-sql.mjs
-- =============================================================================

USE cws_cms;

SET NAMES utf8mb4;

START TRANSACTION;

-- Homepage page record (keeps your existing page id; only flags + display mode)
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

-- If no homepage flag, use slug home
UPDATE pages SET is_homepage = 1 WHERE slug = 'home' AND @page_id IS NULL LIMIT 1;
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));

-- Ensure only one homepage
UPDATE pages SET is_homepage = 0 WHERE id <> @page_id AND is_homepage = 1;

SELECT @page_id AS homepage_page_id;

-- Archive homepage sections that are NOT in the new agency layout set
UPDATE homepage_sections
SET status = 'trash',
    admin_title = CONCAT(COALESCE(NULLIF(admin_title, ''), layout), ' (archived)')
WHERE page_id = @page_id
  AND status <> 'trash'
  AND FIND_IN_SET(layout, 'hero_slider,trust_badges,services_grid,portfolio,why_codify,process,testimonials,guarantees,industries,tech_stack,pricing_packages,faq,cta') = 0;


-- ---------- hero_slider (sort 0) ----------
UPDATE homepage_sections
SET
  sort_order = 0,
  layout = 'hero_slider',
  status = 'published',
  admin_title = 'Hero',
  payload = '{"acfFcLayout":"hero_slider","eyebrow":"Global Web - Mobile - Digital Marketing Agency","headline":"Turn visitors into paying customers","subheadline":"Creative Web Solutions designs, builds, and markets high-performing websites and apps for brands that sell worldwide - one team from first sketch to measurable growth.","headlineParts":[{"text":"paying","tone":"green"},{"text":"customers","tone":"blue"}],"ctaPrimary":{"label":"Get free proposal","href":"#ask-price"},"ctaSecondary":{"label":"See our work","href":"/portfolio"},"slides":[{"image":{"url":"/assets/images/hero1.png"}},{"image":{"url":"/assets/images/hero2.png"}},{"image":{"url":"/assets/images/hero3.png"}}],"heroVisual":"svg","personImage":"/assets/images/hero2.png","personImageAlt":"Creative Web Solutions - website and mobile product team","stats":[{"icon":"fas fa-project-diagram","count":549,"label":"Projects shipped","tone":"blue"},{"icon":"fas fa-users","count":320,"label":"Clients worldwide","tone":"green"},{"icon":"fas fa-award","count":15,"label":"Years crafting digital","tone":"royal"}],"gmbRating":4.9,"gmbReviewCount":"120+","gmbReviews":[{"author":"Amit K.","rating":5,"text":"Lightning-fast site, premium feel. Our enquiry form finally gets used every day.","ago":"3 weeks ago"},{"author":"Priya Sharma","rating":5,"text":"SEO and paid campaigns are aligned - we see which pages actually drive leads.","ago":"1 month ago"},{"author":"Vikram S.","rating":5,"text":"Ecommerce launch was smooth. Checkout, payments, and handover were pro end-to-end.","ago":"2 months ago"}],"marqueeItems":[{"letter":"W","title":"Website development","href":"/website-development-zirakpur"},{"letter":"M","title":"Mobile apps","href":"/mobile-app-development-zirakpur"},{"letter":"S","title":"SEO & growth","href":"/seo-services-zirakpur"},{"letter":"A","title":"Digital marketing","href":"/digital-marketing-zirakpur"},{"letter":"U","title":"UI/UX design","href":"/ui-ux-design-zirakpur"},{"letter":"E","title":"Ecommerce","href":"/ecommerce-website-zirakpur"}]}'
WHERE page_id = @page_id AND layout = 'hero_slider' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 0, 'hero_slider', 'published', 'Hero', '{"acfFcLayout":"hero_slider","eyebrow":"Global Web - Mobile - Digital Marketing Agency","headline":"Turn visitors into paying customers","subheadline":"Creative Web Solutions designs, builds, and markets high-performing websites and apps for brands that sell worldwide - one team from first sketch to measurable growth.","headlineParts":[{"text":"paying","tone":"green"},{"text":"customers","tone":"blue"}],"ctaPrimary":{"label":"Get free proposal","href":"#ask-price"},"ctaSecondary":{"label":"See our work","href":"/portfolio"},"slides":[{"image":{"url":"/assets/images/hero1.png"}},{"image":{"url":"/assets/images/hero2.png"}},{"image":{"url":"/assets/images/hero3.png"}}],"heroVisual":"svg","personImage":"/assets/images/hero2.png","personImageAlt":"Creative Web Solutions - website and mobile product team","stats":[{"icon":"fas fa-project-diagram","count":549,"label":"Projects shipped","tone":"blue"},{"icon":"fas fa-users","count":320,"label":"Clients worldwide","tone":"green"},{"icon":"fas fa-award","count":15,"label":"Years crafting digital","tone":"royal"}],"gmbRating":4.9,"gmbReviewCount":"120+","gmbReviews":[{"author":"Amit K.","rating":5,"text":"Lightning-fast site, premium feel. Our enquiry form finally gets used every day.","ago":"3 weeks ago"},{"author":"Priya Sharma","rating":5,"text":"SEO and paid campaigns are aligned - we see which pages actually drive leads.","ago":"1 month ago"},{"author":"Vikram S.","rating":5,"text":"Ecommerce launch was smooth. Checkout, payments, and handover were pro end-to-end.","ago":"2 months ago"}],"marqueeItems":[{"letter":"W","title":"Website development","href":"/website-development-zirakpur"},{"letter":"M","title":"Mobile apps","href":"/mobile-app-development-zirakpur"},{"letter":"S","title":"SEO & growth","href":"/seo-services-zirakpur"},{"letter":"A","title":"Digital marketing","href":"/digital-marketing-zirakpur"},{"letter":"U","title":"UI/UX design","href":"/ui-ux-design-zirakpur"},{"letter":"E","title":"Ecommerce","href":"/ecommerce-website-zirakpur"}]}'
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
  admin_title = 'Trust badges',
  payload = '{"acfFcLayout":"trust_badges","sectionTheme":"light","badge":"Why brands choose us","title":"One partner. Full stack. Zero guesswork.","subtitle":"Stop coordinating separate designers, developers, and marketers. We own the full journey - strategy, build, launch, and growth - with clear milestones and honest updates.","items":[{"icon":"fab fa-google","title":"4.9★ client rating","desc":"Consistently rated for delivery, communication, and results","tone":"blue"},{"icon":"fas fa-globe","title":"Remote-first, global-ready","desc":"Async collaboration across time zones - your pace, your tools","tone":"green"},{"icon":"fas fa-mobile-alt","title":"Mobile-first quality","desc":"Every experience tuned for thumb-friendly UX and speed","tone":"purple"},{"icon":"fas fa-chart-line","title":"Growth by design","desc":"Tracking, forms, and campaigns wired to real conversions","tone":"orange"},{"icon":"fas fa-file-signature","title":"Scope you can trust","desc":"Written deliverables, timelines, and revision rules upfront","tone":"grey"},{"icon":"fas fa-headset","title":"Support after launch","desc":"Maintenance, iterations, and retainers when you need a long-term team","tone":"pink"}]}'
WHERE page_id = @page_id AND layout = 'trust_badges' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 1, 'trust_badges', 'published', 'Trust badges', '{"acfFcLayout":"trust_badges","sectionTheme":"light","badge":"Why brands choose us","title":"One partner. Full stack. Zero guesswork.","subtitle":"Stop coordinating separate designers, developers, and marketers. We own the full journey - strategy, build, launch, and growth - with clear milestones and honest updates.","items":[{"icon":"fab fa-google","title":"4.9★ client rating","desc":"Consistently rated for delivery, communication, and results","tone":"blue"},{"icon":"fas fa-globe","title":"Remote-first, global-ready","desc":"Async collaboration across time zones - your pace, your tools","tone":"green"},{"icon":"fas fa-mobile-alt","title":"Mobile-first quality","desc":"Every experience tuned for thumb-friendly UX and speed","tone":"purple"},{"icon":"fas fa-chart-line","title":"Growth by design","desc":"Tracking, forms, and campaigns wired to real conversions","tone":"orange"},{"icon":"fas fa-file-signature","title":"Scope you can trust","desc":"Written deliverables, timelines, and revision rules upfront","tone":"grey"},{"icon":"fas fa-headset","title":"Support after launch","desc":"Maintenance, iterations, and retainers when you need a long-term team","tone":"pink"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'trust_badges' AND hs.status <> 'trash'
  );


-- ---------- services_grid (sort 2) ----------
UPDATE homepage_sections
SET
  sort_order = 2,
  layout = 'services_grid',
  status = 'published',
  admin_title = 'Services',
  payload = '{"acfFcLayout":"services_grid","sectionTheme":"dark","badge":"Core services","title":"Everything you need to launch and scale online","subtitle":"Design, engineering, and growth under one roof - launch faster, look sharper, and turn traffic into qualified enquiries anywhere you sell.","items":[{"icon":"fas fa-paint-brush","image":"https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=960&h=540&q=85","title":"Web design","desc":"Bold, on-brand interfaces that guide visitors to action - desktop and mobile, built for trust at first scroll.","href":"/ui-ux-design-zirakpur","tone":"pink"},{"icon":"fas fa-code","image":"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=960&h=540&q=85","title":"Website development","desc":"Fast, secure sites and landing pages with forms, CRM hooks, and analytics baked in - code your team can extend.","href":"/website-development-zirakpur","tone":"blue"},{"icon":"fas fa-mobile-alt","image":"https://images.unsplash.com/photo-1512945903694-92d7a22944f4?auto=format&fit=crop&w=960&h=540&q=85","title":"Mobile apps","desc":"Polished Android & iOS experiences users keep - onboarding, push, payments, and admin when you need scale.","href":"/mobile-app-development-zirakpur","tone":"green"},{"icon":"fas fa-bullhorn","image":"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=960&h=540&q=85","title":"Digital marketing","desc":"Google Ads, Meta, and landing pages engineered for leads - weekly clarity on cost per enquiry, not vanity charts.","href":"/digital-marketing-zirakpur","tone":"orange"},{"icon":"fas fa-robot","image":"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&h=540&q=85","title":"Custom software","desc":"Dashboards, portals, booking engines, and APIs that replace spreadsheets - shaped around how your team really works.","href":"/custom-software-development-zirakpur","tone":"grey"},{"icon":"fas fa-pen-nib","image":"https://images.unsplash.com/photo-1626785774573-4b7999ee4feb?auto=format&fit=crop&w=960&h=540&q=85","title":"Brand & graphics","desc":"Logos, decks, ad kits, and social systems that look expensive everywhere - consistent, launch-ready creative.","href":"/graphic-designing-zirakpur","tone":"pink"},{"icon":"fas fa-cart-shopping","image":"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=960&h=540&q=85","title":"Ecommerce","desc":"Shopify, WooCommerce, or custom storefronts with checkout that feels effortless - merchandising built to convert.","href":"/ecommerce-website-zirakpur","tone":"green"},{"icon":"fas fa-chart-line","image":"https://images.unsplash.com/photo-1432888498266-38ffec3eaf4a?auto=format&fit=crop&w=960&h=540&q=85","title":"SEO & content","desc":"Technical SEO, topic clusters, and content that ranks - so the right buyers find you when intent is highest.","href":"/seo-services-zirakpur","tone":"blue"}]}'
WHERE page_id = @page_id AND layout = 'services_grid' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 2, 'services_grid', 'published', 'Services', '{"acfFcLayout":"services_grid","sectionTheme":"dark","badge":"Core services","title":"Everything you need to launch and scale online","subtitle":"Design, engineering, and growth under one roof - launch faster, look sharper, and turn traffic into qualified enquiries anywhere you sell.","items":[{"icon":"fas fa-paint-brush","image":"https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=960&h=540&q=85","title":"Web design","desc":"Bold, on-brand interfaces that guide visitors to action - desktop and mobile, built for trust at first scroll.","href":"/ui-ux-design-zirakpur","tone":"pink"},{"icon":"fas fa-code","image":"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=960&h=540&q=85","title":"Website development","desc":"Fast, secure sites and landing pages with forms, CRM hooks, and analytics baked in - code your team can extend.","href":"/website-development-zirakpur","tone":"blue"},{"icon":"fas fa-mobile-alt","image":"https://images.unsplash.com/photo-1512945903694-92d7a22944f4?auto=format&fit=crop&w=960&h=540&q=85","title":"Mobile apps","desc":"Polished Android & iOS experiences users keep - onboarding, push, payments, and admin when you need scale.","href":"/mobile-app-development-zirakpur","tone":"green"},{"icon":"fas fa-bullhorn","image":"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=960&h=540&q=85","title":"Digital marketing","desc":"Google Ads, Meta, and landing pages engineered for leads - weekly clarity on cost per enquiry, not vanity charts.","href":"/digital-marketing-zirakpur","tone":"orange"},{"icon":"fas fa-robot","image":"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&h=540&q=85","title":"Custom software","desc":"Dashboards, portals, booking engines, and APIs that replace spreadsheets - shaped around how your team really works.","href":"/custom-software-development-zirakpur","tone":"grey"},{"icon":"fas fa-pen-nib","image":"https://images.unsplash.com/photo-1626785774573-4b7999ee4feb?auto=format&fit=crop&w=960&h=540&q=85","title":"Brand & graphics","desc":"Logos, decks, ad kits, and social systems that look expensive everywhere - consistent, launch-ready creative.","href":"/graphic-designing-zirakpur","tone":"pink"},{"icon":"fas fa-cart-shopping","image":"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=960&h=540&q=85","title":"Ecommerce","desc":"Shopify, WooCommerce, or custom storefronts with checkout that feels effortless - merchandising built to convert.","href":"/ecommerce-website-zirakpur","tone":"green"},{"icon":"fas fa-chart-line","image":"https://images.unsplash.com/photo-1432888498266-38ffec3eaf4a?auto=format&fit=crop&w=960&h=540&q=85","title":"SEO & content","desc":"Technical SEO, topic clusters, and content that ranks - so the right buyers find you when intent is highest.","href":"/seo-services-zirakpur","tone":"blue"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'services_grid' AND hs.status <> 'trash'
  );


-- ---------- portfolio (sort 3) ----------
UPDATE homepage_sections
SET
  sort_order = 3,
  layout = 'portfolio',
  status = 'published',
  admin_title = 'Portfolio',
  payload = '{"acfFcLayout":"portfolio","sectionTheme":"dark","badge":"Proof","title":"Products that look premium and perform","subtitle":"Browse websites, apps, and campaigns built for healthcare, retail, B2B, and fast-growing startups - crafted to impress buyers and drive action.","ctaLabel":"Explore case studies","ctaHref":"/portfolio"}'
WHERE page_id = @page_id AND layout = 'portfolio' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 3, 'portfolio', 'published', 'Portfolio', '{"acfFcLayout":"portfolio","sectionTheme":"dark","badge":"Proof","title":"Products that look premium and perform","subtitle":"Browse websites, apps, and campaigns built for healthcare, retail, B2B, and fast-growing startups - crafted to impress buyers and drive action.","ctaLabel":"Explore case studies","ctaHref":"/portfolio"}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'portfolio' AND hs.status <> 'trash'
  );


-- ---------- why_codify (sort 4) ----------
UPDATE homepage_sections
SET
  sort_order = 4,
  layout = 'why_codify',
  status = 'published',
  admin_title = 'Why choose us',
  payload = '{"acfFcLayout":"why_codify","sectionTheme":"light","badge":"The CWS difference","title":"Agency craft. Product discipline. Marketing impact.","subtitle":"We think like founders: every page, screen, and ad should earn its place in your revenue story - not just fill a template.","cards":[{"icon":"fas fa-bullseye","title":"Conversion-led strategy","description":"Offers, funnels, and CTAs mapped before design - so traffic has somewhere profitable to land.","number":"01"},{"icon":"fas fa-laptop-code","title":"Engineering that scales","description":"Modern stacks, clean architecture, and APIs ready for the next feature - not a fragile one-off.","number":"02"},{"icon":"fas fa-bullhorn","title":"Marketing in sync","description":"SEO, paid media, and landing pages built on the same message your product delivers.","number":"03"},{"icon":"fas fa-tachometer-alt","title":"Speed that ranks","description":"Performance, accessibility, and Core Web Vitals treated as business metrics, not checkboxes.","number":"04"},{"icon":"fas fa-comments","title":"Radical clarity","description":"Staging links, Loom walkthroughs, and written status - you always know what shipped and what is next.","number":"05"},{"icon":"fas fa-handshake","title":"Partners, not vendors","description":"Post-launch iterations, feature roadmaps, and growth experiments with the same accountable team.","number":"06"}]}'
WHERE page_id = @page_id AND layout = 'why_codify' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 4, 'why_codify', 'published', 'Why choose us', '{"acfFcLayout":"why_codify","sectionTheme":"light","badge":"The CWS difference","title":"Agency craft. Product discipline. Marketing impact.","subtitle":"We think like founders: every page, screen, and ad should earn its place in your revenue story - not just fill a template.","cards":[{"icon":"fas fa-bullseye","title":"Conversion-led strategy","description":"Offers, funnels, and CTAs mapped before design - so traffic has somewhere profitable to land.","number":"01"},{"icon":"fas fa-laptop-code","title":"Engineering that scales","description":"Modern stacks, clean architecture, and APIs ready for the next feature - not a fragile one-off.","number":"02"},{"icon":"fas fa-bullhorn","title":"Marketing in sync","description":"SEO, paid media, and landing pages built on the same message your product delivers.","number":"03"},{"icon":"fas fa-tachometer-alt","title":"Speed that ranks","description":"Performance, accessibility, and Core Web Vitals treated as business metrics, not checkboxes.","number":"04"},{"icon":"fas fa-comments","title":"Radical clarity","description":"Staging links, Loom walkthroughs, and written status - you always know what shipped and what is next.","number":"05"},{"icon":"fas fa-handshake","title":"Partners, not vendors","description":"Post-launch iterations, feature roadmaps, and growth experiments with the same accountable team.","number":"06"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'why_codify' AND hs.status <> 'trash'
  );


-- ---------- process (sort 5) ----------
UPDATE homepage_sections
SET
  sort_order = 5,
  layout = 'process',
  status = 'published',
  admin_title = 'Process',
  payload = '{"acfFcLayout":"process","sectionTheme":"light","backdropImage":"/assets/images/process-hero-mac-students.jpg","backdropStrength":40,"badge":"Simple process","title":"From kickoff to live in four confident steps","subtitle":"No black boxes. Most engagements start with a focused discovery call and a clear proposal within days.","steps":[{"icon":"fas fa-comments","title":"Discover & define","description":"We unpack goals, users, integrations, and success metrics - then send a written scope and investment range."},{"icon":"fas fa-pencil-ruler","title":"Design to approve","description":"Wireframes or high-fidelity UI you sign off on - brand, UX, and mobile views included."},{"icon":"fas fa-code","title":"Build in the open","description":"Real staging URLs on phone and desktop; structured feedback until the experience feels right."},{"icon":"fas fa-rocket","title":"Launch & optimise","description":"Go-live, analytics, training, and optional SEO, ads, or maintenance - keep momentum after day one."}]}'
WHERE page_id = @page_id AND layout = 'process' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 5, 'process', 'published', 'Process', '{"acfFcLayout":"process","sectionTheme":"light","backdropImage":"/assets/images/process-hero-mac-students.jpg","backdropStrength":40,"badge":"Simple process","title":"From kickoff to live in four confident steps","subtitle":"No black boxes. Most engagements start with a focused discovery call and a clear proposal within days.","steps":[{"icon":"fas fa-comments","title":"Discover & define","description":"We unpack goals, users, integrations, and success metrics - then send a written scope and investment range."},{"icon":"fas fa-pencil-ruler","title":"Design to approve","description":"Wireframes or high-fidelity UI you sign off on - brand, UX, and mobile views included."},{"icon":"fas fa-code","title":"Build in the open","description":"Real staging URLs on phone and desktop; structured feedback until the experience feels right."},{"icon":"fas fa-rocket","title":"Launch & optimise","description":"Go-live, analytics, training, and optional SEO, ads, or maintenance - keep momentum after day one."}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'process' AND hs.status <> 'trash'
  );


-- ---------- testimonials (sort 6) ----------
UPDATE homepage_sections
SET
  sort_order = 6,
  layout = 'testimonials',
  status = 'published',
  admin_title = 'Testimonials',
  payload = '{"acfFcLayout":"testimonials","sectionTheme":"dark","badge":"Client voices","title":"Trusted by teams who expect more than a facelift","subtitle":"Straight talk from founders and marketing leads who needed revenue-ready digital - not slide decks.","testimonials":[{"name":"Ecommerce director","text":"Our store finally feels premium on mobile. Speed, checkout, and merchandising all levelled up in one engagement.","role":"Retail - Shopify + CRO"},{"name":"Healthcare operations lead","text":"Patient booking and content SEO now work together. Enquiries are steady and the admin is easy for staff.","role":"Healthcare - Web + SEO"},{"name":"B2B sales manager","text":"Corporate site plus paid landing pages - we finally attribute leads to campaigns instead of guessing.","role":"Manufacturing - Web + Ads"},{"name":"SaaS founder","text":"MVP app, admin dashboard, and API delivered in milestones. Communication was crisp the whole way.","role":"Startup - Mobile + Backend"}]}'
WHERE page_id = @page_id AND layout = 'testimonials' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 6, 'testimonials', 'published', 'Testimonials', '{"acfFcLayout":"testimonials","sectionTheme":"dark","badge":"Client voices","title":"Trusted by teams who expect more than a facelift","subtitle":"Straight talk from founders and marketing leads who needed revenue-ready digital - not slide decks.","testimonials":[{"name":"Ecommerce director","text":"Our store finally feels premium on mobile. Speed, checkout, and merchandising all levelled up in one engagement.","role":"Retail - Shopify + CRO"},{"name":"Healthcare operations lead","text":"Patient booking and content SEO now work together. Enquiries are steady and the admin is easy for staff.","role":"Healthcare - Web + SEO"},{"name":"B2B sales manager","text":"Corporate site plus paid landing pages - we finally attribute leads to campaigns instead of guessing.","role":"Manufacturing - Web + Ads"},{"name":"SaaS founder","text":"MVP app, admin dashboard, and API delivered in milestones. Communication was crisp the whole way.","role":"Startup - Mobile + Backend"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'testimonials' AND hs.status <> 'trash'
  );


-- ---------- guarantees (sort 7) ----------
UPDATE homepage_sections
SET
  sort_order = 7,
  layout = 'guarantees',
  status = 'published',
  admin_title = 'Guarantees',
  payload = '{"acfFcLayout":"guarantees","sectionTheme":"light","badge":"Peace of mind","title":"Promises we put in every contract","subtitle":"Confidence should not be optional - these standards apply whether you are launching or scaling.","items":[{"icon":"fas fa-file-contract","title":"Crystal-clear scope","desc":"Deliverables, owners, timelines, and revision rounds documented before a single line of code.","tone":"blue"},{"icon":"fas fa-eye","title":"See before you sign off","desc":"Approve on staging - desktop, tablet, and phone - so launch day feels predictable.","tone":"green"},{"icon":"fas fa-key","title":"Full ownership","desc":"Repositories, design files, domains, and admin credentials belong to you at go-live.","tone":"purple"},{"icon":"fas fa-life-ring","title":"Care after launch","desc":"Security updates, content tweaks, and optional retainers so you are never stranded.","tone":"orange"}]}'
WHERE page_id = @page_id AND layout = 'guarantees' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 7, 'guarantees', 'published', 'Guarantees', '{"acfFcLayout":"guarantees","sectionTheme":"light","badge":"Peace of mind","title":"Promises we put in every contract","subtitle":"Confidence should not be optional - these standards apply whether you are launching or scaling.","items":[{"icon":"fas fa-file-contract","title":"Crystal-clear scope","desc":"Deliverables, owners, timelines, and revision rounds documented before a single line of code.","tone":"blue"},{"icon":"fas fa-eye","title":"See before you sign off","desc":"Approve on staging - desktop, tablet, and phone - so launch day feels predictable.","tone":"green"},{"icon":"fas fa-key","title":"Full ownership","desc":"Repositories, design files, domains, and admin credentials belong to you at go-live.","tone":"purple"},{"icon":"fas fa-life-ring","title":"Care after launch","desc":"Security updates, content tweaks, and optional retainers so you are never stranded.","tone":"orange"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'guarantees' AND hs.status <> 'trash'
  );


-- ---------- industries (sort 8) ----------
UPDATE homepage_sections
SET
  sort_order = 8,
  layout = 'industries',
  status = 'published',
  admin_title = 'Industries',
  payload = '{"acfFcLayout":"industries","sectionTheme":"dark","badge":"Sectors we know","title":"Fluent in your market - fluent in digital","subtitle":"Sector-specific UX patterns, compliance cues, and messaging that speaks to how your buyers decide.","items":[{"icon":"fas fa-heartbeat","title":"Healthcare","tone":"pink"},{"icon":"fas fa-graduation-cap","title":"Education","tone":"blue"},{"icon":"fas fa-building","title":"Real estate","tone":"green"},{"icon":"fas fa-hotel","title":"Hospitality","tone":"orange"},{"icon":"fas fa-shopping-bag","title":"Retail & ecommerce","tone":"purple"},{"icon":"fas fa-industry","title":"Manufacturing","tone":"grey"},{"icon":"fas fa-seedling","title":"Agriculture","tone":"green"},{"icon":"fas fa-rocket","title":"Startups & SaaS","tone":"blue"}]}'
WHERE page_id = @page_id AND layout = 'industries' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 8, 'industries', 'published', 'Industries', '{"acfFcLayout":"industries","sectionTheme":"dark","badge":"Sectors we know","title":"Fluent in your market - fluent in digital","subtitle":"Sector-specific UX patterns, compliance cues, and messaging that speaks to how your buyers decide.","items":[{"icon":"fas fa-heartbeat","title":"Healthcare","tone":"pink"},{"icon":"fas fa-graduation-cap","title":"Education","tone":"blue"},{"icon":"fas fa-building","title":"Real estate","tone":"green"},{"icon":"fas fa-hotel","title":"Hospitality","tone":"orange"},{"icon":"fas fa-shopping-bag","title":"Retail & ecommerce","tone":"purple"},{"icon":"fas fa-industry","title":"Manufacturing","tone":"grey"},{"icon":"fas fa-seedling","title":"Agriculture","tone":"green"},{"icon":"fas fa-rocket","title":"Startups & SaaS","tone":"blue"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'industries' AND hs.status <> 'trash'
  );


-- ---------- tech_stack (sort 9) ----------
UPDATE homepage_sections
SET
  sort_order = 9,
  layout = 'tech_stack',
  status = 'published',
  admin_title = 'Tech stack',
  payload = '{"acfFcLayout":"tech_stack","sectionTheme":"light","badge":"Technology","title":"Right stack. Right budget. Right timeline.","subtitle":"Battle-tested tools our engineers ship every week - chosen for maintainability, not hype.","items":[{"icon":"fab fa-react","title":"React","tone":"blue"},{"icon":"fas fa-bolt","title":"Next.js","tone":"grey"},{"icon":"fab fa-node-js","title":"Node.js","tone":"green"},{"icon":"fab fa-wordpress","title":"WordPress","tone":"blue"},{"icon":"fab fa-android","title":"Flutter","tone":"green"},{"icon":"fab fa-php","title":"PHP / Laravel","tone":"purple"},{"icon":"fab fa-aws","title":"AWS / Cloud","tone":"orange"},{"icon":"fas fa-database","title":"MySQL","tone":"grey"},{"icon":"fas fa-robot","title":"AI integrations","tone":"pink"},{"icon":"fab fa-shopify","title":"Shopify","tone":"green"}]}'
WHERE page_id = @page_id AND layout = 'tech_stack' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 9, 'tech_stack', 'published', 'Tech stack', '{"acfFcLayout":"tech_stack","sectionTheme":"light","badge":"Technology","title":"Right stack. Right budget. Right timeline.","subtitle":"Battle-tested tools our engineers ship every week - chosen for maintainability, not hype.","items":[{"icon":"fab fa-react","title":"React","tone":"blue"},{"icon":"fas fa-bolt","title":"Next.js","tone":"grey"},{"icon":"fab fa-node-js","title":"Node.js","tone":"green"},{"icon":"fab fa-wordpress","title":"WordPress","tone":"blue"},{"icon":"fab fa-android","title":"Flutter","tone":"green"},{"icon":"fab fa-php","title":"PHP / Laravel","tone":"purple"},{"icon":"fab fa-aws","title":"AWS / Cloud","tone":"orange"},{"icon":"fas fa-database","title":"MySQL","tone":"grey"},{"icon":"fas fa-robot","title":"AI integrations","tone":"pink"},{"icon":"fab fa-shopify","title":"Shopify","tone":"green"}]}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'tech_stack' AND hs.status <> 'trash'
  );


-- ---------- pricing_packages (sort 10) ----------
UPDATE homepage_sections
SET
  sort_order = 10,
  layout = 'pricing_packages',
  status = 'published',
  admin_title = 'Pricing models',
  payload = '{"acfFcLayout":"pricing_packages","sectionTheme":"dark","badge":"How we engage","title":"Models that match your ambition","subtitle":"From a sharp launch to an embedded product squad - flexible structures, transparent pricing after discovery.","items":[{"icon":"fas fa-rocket","title":"Launch packages","desc":"Fixed-scope websites, product sites, or app MVPs with milestone payments and a clear finish line.","tone":"blue"},{"icon":"fas fa-user-clock","title":"Dedicated developers","desc":"Senior engineers embedded in your rhythm - sprints, backlog grooming, and production releases.","tone":"green"},{"icon":"fas fa-calendar-check","title":"Growth retainers","desc":"Ongoing SEO, paid media, CRO, and content - report on leads and revenue, not impressions alone.","tone":"orange"},{"icon":"fas fa-people-arrows","title":"Team augmentation","desc":"Plug in designers, developers, or marketers to accelerate without a long hiring cycle.","tone":"purple"}]}'
WHERE page_id = @page_id AND layout = 'pricing_packages' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 10, 'pricing_packages', 'published', 'Pricing models', '{"acfFcLayout":"pricing_packages","sectionTheme":"dark","badge":"How we engage","title":"Models that match your ambition","subtitle":"From a sharp launch to an embedded product squad - flexible structures, transparent pricing after discovery.","items":[{"icon":"fas fa-rocket","title":"Launch packages","desc":"Fixed-scope websites, product sites, or app MVPs with milestone payments and a clear finish line.","tone":"blue"},{"icon":"fas fa-user-clock","title":"Dedicated developers","desc":"Senior engineers embedded in your rhythm - sprints, backlog grooming, and production releases.","tone":"green"},{"icon":"fas fa-calendar-check","title":"Growth retainers","desc":"Ongoing SEO, paid media, CRO, and content - report on leads and revenue, not impressions alone.","tone":"orange"},{"icon":"fas fa-people-arrows","title":"Team augmentation","desc":"Plug in designers, developers, or marketers to accelerate without a long hiring cycle.","tone":"purple"}]}'
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
  payload = '{"acfFcLayout":"faq","sectionTheme":"light","badge":"FAQ","title":"Straight answers. No sales pressure.","subtitle":"Still exploring? These are the questions founders ask us most - or open Ask price for a quick ballpark.","items":[{"icon":"fas fa-rupee-sign","title":"What should I budget for a business website?","desc":"Scope drives investment - pages, integrations, content, and languages. After discovery you receive a written estimate with options, not a vague range.","tone":"green"},{"icon":"fas fa-clock","title":"How fast can you go live?","desc":"Marketing sites often land in 3-6 weeks. Apps and custom platforms follow a milestone plan shared before kickoff.","tone":"blue"},{"icon":"fas fa-mobile-alt","title":"Do you build iOS, Android, and cross-platform apps?","desc":"Yes - native and cross-platform, with admin panels, APIs, and store submission support when you need it.","tone":"purple"},{"icon":"fas fa-bullhorn","title":"Can you own SEO and paid acquisition?","desc":"Yes. Landing pages, tracking, and campaigns are built together so you know which channel pays for itself.","tone":"orange"},{"icon":"fas fa-globe","title":"Do you work with international clients?","desc":"Every day. Video workshops, async updates, staging reviews, and contracts in English - aligned to your timezone.","tone":"grey"}]}'
WHERE page_id = @page_id AND layout = 'faq' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 11, 'faq', 'published', 'FAQ', '{"acfFcLayout":"faq","sectionTheme":"light","badge":"FAQ","title":"Straight answers. No sales pressure.","subtitle":"Still exploring? These are the questions founders ask us most - or open Ask price for a quick ballpark.","items":[{"icon":"fas fa-rupee-sign","title":"What should I budget for a business website?","desc":"Scope drives investment - pages, integrations, content, and languages. After discovery you receive a written estimate with options, not a vague range.","tone":"green"},{"icon":"fas fa-clock","title":"How fast can you go live?","desc":"Marketing sites often land in 3-6 weeks. Apps and custom platforms follow a milestone plan shared before kickoff.","tone":"blue"},{"icon":"fas fa-mobile-alt","title":"Do you build iOS, Android, and cross-platform apps?","desc":"Yes - native and cross-platform, with admin panels, APIs, and store submission support when you need it.","tone":"purple"},{"icon":"fas fa-bullhorn","title":"Can you own SEO and paid acquisition?","desc":"Yes. Landing pages, tracking, and campaigns are built together so you know which channel pays for itself.","tone":"orange"},{"icon":"fas fa-globe","title":"Do you work with international clients?","desc":"Every day. Video workshops, async updates, staging reviews, and contracts in English - aligned to your timezone.","tone":"grey"}]}'
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
  payload = '{"acfFcLayout":"cta","sectionTheme":"dark","title":"Ready for digital that actually sells?","subtitle":"Tell us what you are building - we will respond within one business day with scope, timeline, and a transparent estimate for your website, app, or growth program.","ctaLabel":"Get free proposal","ctaHref":"#ask-price","ctaPrimary":{"label":"Get free proposal","href":"#ask-price"},"ctaSecondary":{"label":"Book a call","href":"/contact#contact-form"}}'
WHERE page_id = @page_id AND layout = 'cta' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, 12, 'cta', 'published', 'Final CTA', '{"acfFcLayout":"cta","sectionTheme":"dark","title":"Ready for digital that actually sells?","subtitle":"Tell us what you are building - we will respond within one business day with scope, timeline, and a transparent estimate for your website, app, or growth program.","ctaLabel":"Get free proposal","ctaHref":"#ask-price","ctaPrimary":{"label":"Get free proposal","href":"#ask-price"},"ctaSecondary":{"label":"Book a call","href":"/contact#contact-form"}}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = 'cta' AND hs.status <> 'trash'
  );


-- Optional: Desimentor document for homepage (only if you use builder — leaves other entities alone)
-- DELETE FROM desimentor_documents WHERE entity_type = 'homepage' AND entity_id = @page_id;

COMMIT;

-- Verify
SELECT id, layout, status, sort_order, admin_title,
       JSON_UNQUOTE(JSON_EXTRACT(payload, '$.title')) AS section_title
FROM homepage_sections
WHERE page_id = @page_id
ORDER BY sort_order ASC, id ASC;
