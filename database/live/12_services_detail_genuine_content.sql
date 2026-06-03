-- =============================================================================
-- Service detail pages — genuine copy, pro HTML (H2 sections), features & FAQs
-- Run on production DB `cws_cms` after 01_schema (display_mode, faqs, page_custom_css)
-- Safe to re-run: updates by slug; inserts missing rows
-- Generated: node database/scripts/export-services-live-sql.mjs
-- =============================================================================

SET NAMES utf8mb4;

-- web-application
INSERT INTO services (
  slug, title, hero_title, hero_subtitle, price_badge, content_html, features,
  cta_title, cta_text, seo, status, display_mode, faqs, page_custom_css
) VALUES (
  'web-application',
  'Custom Web Application Development',
  'Custom Web Application Development',
  'Dashboards, SaaS products, and internal tools built with modern stacks — scoped in plain language, delivered in milestones, and supported after launch for teams in Chandigarh, Mohali, Zirakpur, and across India.',
  'Projects from ₹49,999',
  '<p class="lead">Creative Web Solutions designs and builds web applications that replace spreadsheets and disconnected tools — admin panels, customer portals, booking systems, and SaaS products with clear ownership from discovery to launch.</p><h2>What we deliver</h2><figure><img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&amp;fit=crop&amp;w=1200&amp;h=700&amp;q=85" alt="Web application dashboard on laptop" /></figure><p>Every engagement starts with a short discovery: who uses the product, what must integrate (payments, CRM, WhatsApp, ERP), and what “done” means for your business. You receive wireframes or clickable UI before production code, plus weekly staging links so progress is visible.</p><h2>Technology choices</h2><ul><li><i class="fas fa-layer-group"></i> Front ends with React, Next.js, or Vue when SEO and speed matter</li><li><i class="fas fa-server"></i> APIs in Node, PHP, or .NET matched to your hosting and team skills</li><li><i class="fas fa-database"></i> MySQL, PostgreSQL, or managed cloud databases with sensible backups</li><li><i class="fas fa-mobile-alt"></i> Responsive layouts and optional PWA behaviour for field teams</li></ul><h2>Typical modules</h2><p>Role-based dashboards, reporting exports, notification queues, file uploads, multi-branch settings, and audit logs — scoped so you pay for what you need, not a generic template.</p><h2>Who we work with</h2><p>Manufacturers, distributors, clinics, coaching institutes, and B2B service firms across Punjab and India that have outgrown off-the-shelf software but are not ready for enterprise ERP.</p>',
  '[{"title":"Discovery & scope","description":"Written brief with user roles, integrations, and success metrics before design starts.","icon":"fas fa-clipboard-list"},{"title":"Modern stack","description":"React, Next.js, Node, or PHP — chosen for maintainability, not hype.","icon":"fas fa-code"},{"title":"Secure delivery","description":"Auth, backups, staging demos, and handover docs your team can extend.","icon":"fas fa-shield-alt"}]',
  'Plan your web application',
  'Share your workflow on a short call. We will outline modules, timeline, and a ballpark before any commitment.',
  '{"title":"Web Application Development Company | Creative Web Solutions","description":"Custom web apps, admin dashboards, and SaaS builds in Chandigarh & Zirakpur. Secure APIs, clear milestones, post-launch support. Call +91-7015969967.","keywords":"web application development Chandigarh, SaaS development Zirakpur, custom software Mohali, web app company Punjab"}',
  'published',
  'classic',
  '[{"question":"How long does a typical web app take?","answer":"MVPs often ship in 8–14 weeks depending on modules and integrations. We give a milestone plan after discovery."},{"question":"Do you work with our in-house team?","answer":"Yes. We can own the full build or integrate with your developers via Git, code review, and shared staging."},{"question":"What happens after launch?","answer":"We offer maintenance retainers for updates, monitoring, and small feature batches — terms are agreed upfront."}]',
  '.pro-page__section-title { max-width: 42rem; margin-left: auto; margin-right: auto; } .pro-page__icon-list li { transition: transform 0.25s ease; } .pro-page__icon-list li:hover { transform: translateY(-2px); }'
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  hero_title = VALUES(hero_title),
  hero_subtitle = VALUES(hero_subtitle),
  price_badge = VALUES(price_badge),
  content_html = VALUES(content_html),
  features = VALUES(features),
  cta_title = VALUES(cta_title),
  cta_text = VALUES(cta_text),
  seo = VALUES(seo),
  status = 'published',
  display_mode = 'classic',
  faqs = VALUES(faqs),
  page_custom_css = VALUES(page_custom_css);

-- logo-design
INSERT INTO services (
  slug, title, hero_title, hero_subtitle, price_badge, content_html, features,
  cta_title, cta_text, seo, status, display_mode, faqs, page_custom_css
) VALUES (
  'logo-design',
  'Logo & Brand Identity Design',
  'Logo & Brand Identity Design',
  'Distinct logo systems, colour palettes, and usage rules for startups and established brands — files you can hand to print, social, and web teams without guesswork.',
  'Packages from ₹4,999',
  '<p class="lead">Your logo is the fastest signal of trust. We design marks that stay legible on a favicon, signage, and Instagram — grounded in your market, not stock clipart.</p><h2>Our process</h2><figure><img src="https://images.unsplash.com/photo-1626785774573-4b8747b5c0c0?auto=format&amp;fit=crop&amp;w=1200&amp;h=700&amp;q=85" alt="Brand identity design workspace" /></figure><p>Workshop → mood directions → vector concepts → refinement → export kit. You see rationale for each direction so internal approvals are easier.</p><h2>Deliverables</h2><ul><li><i class="fas fa-palette"></i> Primary and alternate logo lockups (horizontal, stacked, icon-only)</li><li><i class="fas fa-swatchbook"></i> Brand colours with HEX / CMYK references</li><li><i class="fas fa-font"></i> Typography recommendations for web and print</li><li><i class="fas fa-share-alt"></i> Social profile and cover safe-zone templates</li></ul><h2>After the logo</h2><p>Need business cards, packaging, or a new website? Our design and development teams use the same brand system so everything feels like one company.</p>',
  '[{"title":"Strategic brief","description":"We capture positioning, audience, and competitors before sketching.","icon":"fas fa-lightbulb"},{"title":"Print & digital files","description":"SVG, PNG, PDF, and favicon exports with clear naming.","icon":"fas fa-file-image"},{"title":"Mini brand guide","description":"Colours, typography pairing, and do/don’t usage examples.","icon":"fas fa-book-open"}]',
  'Start your brand project',
  'Tell us your audience and competitors. We return concepts with rationale, not random shapes.',
  '{"title":"Logo Design & Branding | Creative Web Solutions","description":"Professional logo design in Chandigarh & Zirakpur. Multiple concepts, vector files, brand colours. Identity that works on web and print.","keywords":"logo design Chandigarh, branding agency Zirakpur, brand identity Mohali"}',
  'published',
  'classic',
  '[{"question":"How many concepts do we get?","answer":"Standard packages include 3 initial directions and 2 refinement rounds on the chosen route."},{"question":"Who owns the final files?","answer":"You receive full usage rights for the approved logo and agreed deliverables once the project is paid in full."},{"question":"Can you refresh an existing logo?","answer":"Yes. We audit current touchpoints (signage, web, social) and propose evolution or a clean redesign."}]',
  '.pro-page__section-title { max-width: 42rem; margin-left: auto; margin-right: auto; } .pro-page__icon-list li { transition: transform 0.25s ease; } .pro-page__icon-list li:hover { transform: translateY(-2px); }'
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  hero_title = VALUES(hero_title),
  hero_subtitle = VALUES(hero_subtitle),
  price_badge = VALUES(price_badge),
  content_html = VALUES(content_html),
  features = VALUES(features),
  cta_title = VALUES(cta_title),
  cta_text = VALUES(cta_text),
  seo = VALUES(seo),
  status = 'published',
  display_mode = 'classic',
  faqs = VALUES(faqs),
  page_custom_css = VALUES(page_custom_css);

-- gst-software
INSERT INTO services (
  slug, title, hero_title, hero_subtitle, price_badge, content_html, features,
  cta_title, cta_text, seo, status, display_mode, faqs, page_custom_css
) VALUES (
  'gst-software',
  'GST Billing & Business Software',
  'GST Billing & Business Software',
  'Invoicing, inventory, and GSTR-friendly reports for Indian shops and distributors — trained staff support and sensible pricing without surprise modules.',
  'Demo & onboarding included',
  '<p class="lead">Stop losing hours on manual registers. Our GST-ready billing software is built for Indian compliance habits — fast checkout, clear stock, and reports your CA can use.</p><h2>Built for daily operations</h2><figure><img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&amp;fit=crop&amp;w=1200&amp;h=700&amp;q=85" alt="Retail billing and inventory" /></figure><p>Barcode scanning, credit customers, purchase orders, and supplier dues on one screen. Staff learn the flow in a single training session.</p><h2>Reports you actually open</h2><ul><li><i class="fas fa-percent"></i> GSTR-oriented sales and purchase summaries</li><li><i class="fas fa-calendar-day"></i> Day-end counters and payment-mode splits</li><li><i class="fas fa-exclamation-circle"></i> Expiry and reorder alerts for pharma and FMCG</li></ul><h2>Support from a local team</h2><p>Based in Zirakpur with on-call support during business hours — not a ticket queue overseas.</p>',
  '[{"title":"GST-compliant bills","description":"HSN, tax splits, and e-invoice readiness where applicable.","icon":"fas fa-file-invoice"},{"title":"Stock control","description":"Purchase, batch, and low-stock alerts for busy counters.","icon":"fas fa-boxes"},{"title":"Owner dashboards","description":"Daily sales, dues, and fast-moving SKU snapshots.","icon":"fas fa-chart-line"}]',
  'Book a GST software demo',
  'See billing, stock, and reports on your data in a 30-minute walkthrough.',
  '{"title":"GST Billing Software | Creative Web Solutions","description":"GST invoicing and inventory software for Punjab businesses. GSTR reports, multi-user access, local support in Zirakpur.","keywords":"GST billing software Punjab, pharmacy billing, inventory software Zirakpur"}',
  'published',
  'classic',
  '[{"question":"Is training included?","answer":"Yes. We onboard your counter staff and provide quick-reference sheets for common tasks."},{"question":"Can multiple branches use one system?","answer":"Multi-branch and role permissions are available — we configure during setup."},{"question":"What about backups?","answer":"Scheduled backups and export options are built in; we document restore steps for your IT contact."}]',
  '.pro-page__section-title { max-width: 42rem; margin-left: auto; margin-right: auto; } .pro-page__icon-list li { transition: transform 0.25s ease; } .pro-page__icon-list li:hover { transform: translateY(-2px); }'
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  hero_title = VALUES(hero_title),
  hero_subtitle = VALUES(hero_subtitle),
  price_badge = VALUES(price_badge),
  content_html = VALUES(content_html),
  features = VALUES(features),
  cta_title = VALUES(cta_title),
  cta_text = VALUES(cta_text),
  seo = VALUES(seo),
  status = 'published',
  display_mode = 'classic',
  faqs = VALUES(faqs),
  page_custom_css = VALUES(page_custom_css);

-- exchange-listing
INSERT INTO services (
  slug, title, hero_title, hero_subtitle, price_badge, content_html, features,
  cta_title, cta_text, seo, status, display_mode, faqs, page_custom_css
) VALUES (
  'exchange-listing',
  'Exchange Listing Advisory',
  'Exchange Listing Advisory',
  'Structured preparation for token and project listings — documentation, technical checklists, and realistic timelines before you approach exchanges.',
  'Consultation-led engagements',
  '<p class="lead">Listing applications fail when documentation is scattered or product URLs do not match the whitepaper. We help teams present a coherent, review-ready package.</p><h2>Readiness review</h2><p>We audit tokenomics summary, team disclosures, security practices, community channels, and live product links — then prioritise fixes.</p><h2>What we prepare</h2><ul><li><i class="fas fa-file-alt"></i> Exchange-specific forms and annexures</li><li><i class="fas fa-balance-scale"></i> Compliance and risk FAQ drafts</li><li><i class="fas fa-link"></i> Landing pages and explorer links verified</li></ul><h2>Working style</h2><p>Milestone-based consulting with clear owners on your side and ours. No vague “full service” retainers without deliverables.</p>',
  '[{"title":"Application packs","description":"Organised decks, FAQs, and due-diligence answers.","icon":"fas fa-folder-open"},{"title":"Technical review","description":"Smart contract, site, and wallet flow checklist.","icon":"fas fa-code-branch"},{"title":"Coordination","description":"Structured follow-ups with exchange contacts.","icon":"fas fa-handshake"}]',
  'Discuss listing readiness',
  'We review your project scope and exchange targets, then outline gaps and effort.',
  '{"title":"Crypto Exchange Listing Support | Creative Web Solutions","description":"Exchange listing documentation, compliance checklists, and technical coordination for blockchain projects in India.","keywords":"exchange listing services, token listing advisory, crypto project documentation"}',
  'published',
  'classic',
  '[{"question":"Do you guarantee listing?","answer":"No. We improve readiness and presentation; approval remains with each exchange."},{"question":"Which exchanges do you support?","answer":"We adapt checklists to your target CEX/DEX list — scope is agreed in discovery."},{"question":"Can you fix our website before applying?","answer":"Yes. Our web team can align branding, legal pages, and product flows with exchange expectations."}]',
  '.pro-page__section-title { max-width: 42rem; margin-left: auto; margin-right: auto; } .pro-page__icon-list li { transition: transform 0.25s ease; } .pro-page__icon-list li:hover { transform: translateY(-2px); }'
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  hero_title = VALUES(hero_title),
  hero_subtitle = VALUES(hero_subtitle),
  price_badge = VALUES(price_badge),
  content_html = VALUES(content_html),
  features = VALUES(features),
  cta_title = VALUES(cta_title),
  cta_text = VALUES(cta_text),
  seo = VALUES(seo),
  status = 'published',
  display_mode = 'classic',
  faqs = VALUES(faqs),
  page_custom_css = VALUES(page_custom_css);

-- website-redesign
INSERT INTO services (
  slug, title, hero_title, hero_subtitle, price_badge, content_html, features,
  cta_title, cta_text, seo, status, display_mode, faqs, page_custom_css
) VALUES (
  'website-redesign',
  'Website Redesign & UX Refresh',
  'Website Redesign & UX Refresh',
  'Faster, clearer, conversion-focused sites — modern UI, improved Core Web Vitals, and content structure that helps SEO without losing your brand voice.',
  'Redesigns from ₹14,999',
  '<p class="lead">An outdated site costs enquiries. We redesign with evidence: what visitors click, where they drop off, and what your sales team says leads ask on calls.</p><h2>Before / after focus</h2><figure><img src="https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&amp;fit=crop&amp;w=1200&amp;h=700&amp;q=85" alt="Modern website design on devices" /></figure><p>Clear hero propositions, trust blocks, service paths, and forms that work on mobile. Visual style follows your brand — not a generic template skin.</p><h2>Technical cleanup</h2><ul><li><i class="fas fa-mobile-alt"></i> Responsive layouts tested on common devices</li><li><i class="fas fa-bolt"></i> Optimised images and font loading</li><li><i class="fas fa-chart-line"></i> Analytics and conversion events reconfigured</li></ul><h2>Launch discipline</h2><p>Staging review, content freeze window, redirect checklist, and post-launch monitoring for 404s and form delivery.</p>',
  '[{"title":"UX audit","description":"Heatmap-style review of journeys, forms, and mobile friction.","icon":"fas fa-search"},{"title":"Performance","description":"Image discipline, caching, and lean scripts for better scores.","icon":"fas fa-tachometer-alt"},{"title":"Content mapping","description":"Services, proof, and CTAs placed where buyers decide.","icon":"fas fa-sitemap"}]',
  'Get a redesign quote',
  'Send your current URL. We return a short audit and phased plan.',
  '{"title":"Website Redesign Company | Creative Web Solutions","description":"Website redesign in Chandigarh & Zirakpur. UX, speed, mobile-first layouts, SEO-friendly structure. Free review of your current site.","keywords":"website redesign Chandigarh, UX redesign Mohali, website refresh Zirakpur"}',
  'published',
  'classic',
  '[{"question":"Will we lose SEO rankings?","answer":"We plan redirects, metadata, and URL preservation. Most clients stabilise or improve within 6–10 weeks when content is strengthened."},{"question":"Can you redesign without changing the CMS?","answer":"Yes, if your platform still fits goals. We recommend moves to maintainable stacks when the old site blocks speed or edits."},{"question":"How long does a redesign take?","answer":"Marketing sites often relaunch in 4–8 weeks; larger catalogues take longer — timeline is fixed in the proposal."}]',
  '.pro-page__section-title { max-width: 42rem; margin-left: auto; margin-right: auto; } .pro-page__icon-list li { transition: transform 0.25s ease; } .pro-page__icon-list li:hover { transform: translateY(-2px); }'
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  hero_title = VALUES(hero_title),
  hero_subtitle = VALUES(hero_subtitle),
  price_badge = VALUES(price_badge),
  content_html = VALUES(content_html),
  features = VALUES(features),
  cta_title = VALUES(cta_title),
  cta_text = VALUES(cta_text),
  seo = VALUES(seo),
  status = 'published',
  display_mode = 'classic',
  faqs = VALUES(faqs),
  page_custom_css = VALUES(page_custom_css);

-- desktop-application
INSERT INTO services (
  slug, title, hero_title, hero_subtitle, price_badge, content_html, features,
  cta_title, cta_text, seo, status, display_mode, faqs, page_custom_css
) VALUES (
  'desktop-application',
  'Desktop Application Development',
  'Desktop Application Development',
  'Windows and cross-platform tools for warehouses, labs, and front desks — offline-capable where needed, with sync and role controls when you are back online.',
  'Scoped after discovery',
  '<p class="lead">When browsers are not enough — heavy files, device drivers, or guaranteed offline counters — a focused desktop app reduces errors and speed at the point of work.</p><h2>Use cases we build</h2><p>Inventory floor apps, production logging, clinic front desks, and internal tools that must not fail when Wi‑Fi drops.</p><h2>Architecture</h2><ul><li><i class="fas fa-desktop"></i> Windows-first or cross-platform (Electron / .NET) as appropriate</li><li><i class="fas fa-database"></i> SQLite locally with server sync, or direct API when always online</li><li><i class="fas fa-user-lock"></i> Roles, permissions, and activity logs</li></ul><h2>Delivery</h2><p>Installer packages, admin guide, and training for super-users. Optional annual maintenance for OS updates and feature batches.</p>',
  '[{"title":"Offline-first options","description":"Local data with controlled sync when connectivity returns.","icon":"fas fa-wifi"},{"title":"Hardware integration","description":"Barcode scanners, label printers, and serial devices where required.","icon":"fas fa-plug"},{"title":"Deployment control","description":"Installers, auto-update policy, and version notes for IT.","icon":"fas fa-download"}]',
  'Scope your desktop app',
  'Describe users, devices, and integrations. We propose architecture and phases.',
  '{"title":"Desktop Application Development | Creative Web Solutions","description":"Custom desktop software for Indian businesses. Offline workflows, database sync, enterprise roles. Based in Chandigarh Tricity.","keywords":"desktop application development India, Windows software Punjab, offline business app"}',
  'published',
  'classic',
  '[{"question":"Electron or native?","answer":"We choose based on performance needs, hardware access, and your maintenance capacity — explained in the proposal."},{"question":"Can it talk to our web app?","answer":"Yes. Shared APIs and auth models keep desktop and web data aligned."},{"question":"Do you sign NDAs?","answer":"Standard mutual NDAs are part of enterprise engagements."}]',
  '.pro-page__section-title { max-width: 42rem; margin-left: auto; margin-right: auto; } .pro-page__icon-list li { transition: transform 0.25s ease; } .pro-page__icon-list li:hover { transform: translateY(-2px); }'
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  hero_title = VALUES(hero_title),
  hero_subtitle = VALUES(hero_subtitle),
  price_badge = VALUES(price_badge),
  content_html = VALUES(content_html),
  features = VALUES(features),
  cta_title = VALUES(cta_title),
  cta_text = VALUES(cta_text),
  seo = VALUES(seo),
  status = 'published',
  display_mode = 'classic',
  faqs = VALUES(faqs),
  page_custom_css = VALUES(page_custom_css);

-- bank-management
INSERT INTO services (
  slug, title, hero_title, hero_subtitle, price_badge, content_html, features,
  cta_title, cta_text, seo, status, display_mode, faqs, page_custom_css
) VALUES (
  'bank-management',
  'Banking Operations Software',
  'Banking Operations Software',
  'Modules for customer onboarding, account servicing workflows, and operational reporting — tailored to cooperative banks, NBFCs, and fintech pilots, with audit trails built in.',
  'Enterprise discovery required',
  '<p class="lead">We help financial teams digitise repeatable processes without boiling the ocean — one workflow at a time, with evidence for auditors and managers.</p><h2>Modules we often scope</h2><figure><img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&amp;fit=crop&amp;w=1200&amp;h=700&amp;q=85" alt="Banking and finance technology" /></figure><p>Customer onboarding packs, loan application tracking, internal ticketing, and branch performance dashboards — integrated where APIs exist.</p><h2>Controls</h2><ul><li><i class="fas fa-user-shield"></i> Maker-checker patterns for sensitive actions</li><li><i class="fas fa-file-export"></i> Exportable logs for compliance reviews</li><li><i class="fas fa-server"></i> Deployment options discussed with your IT/security lead</li></ul>',
  '[{"title":"Workflow engine","description":"Configurable steps for KYC, approvals, and exceptions.","icon":"fas fa-project-diagram"},{"title":"Audit trails","description":"Who changed what, and when — exportable for compliance.","icon":"fas fa-history"},{"title":"Reporting","description":"Operational dashboards and scheduled regulatory extracts.","icon":"fas fa-chart-bar"}]',
  'Request a discovery workshop',
  'We map your processes before estimating build effort.',
  '{"title":"Bank Management System Development | Creative Web Solutions","description":"Custom banking workflow software. Account management, compliance reporting, secure access. Software partner in India.","keywords":"bank management software, NBFC software development, banking workflow system"}',
  'published',
  'classic',
  '[{"question":"Is this a core banking replacement?","answer":"Usually no. We integrate with existing cores or start with targeted modules (onboarding, collections, internal ops)."},{"question":"How is security handled?","answer":"Role-based access, encryption in transit, hardened hosting guidance, and logging aligned to your policy."},{"question":"What is the first milestone?","answer":"Process workshop + clickable prototype of the highest-pain workflow before full build spend."}]',
  '.pro-page__section-title { max-width: 42rem; margin-left: auto; margin-right: auto; } .pro-page__icon-list li { transition: transform 0.25s ease; } .pro-page__icon-list li:hover { transform: translateY(-2px); }'
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  hero_title = VALUES(hero_title),
  hero_subtitle = VALUES(hero_subtitle),
  price_badge = VALUES(price_badge),
  content_html = VALUES(content_html),
  features = VALUES(features),
  cta_title = VALUES(cta_title),
  cta_text = VALUES(cta_text),
  seo = VALUES(seo),
  status = 'published',
  display_mode = 'classic',
  faqs = VALUES(faqs),
  page_custom_css = VALUES(page_custom_css);

-- mall-management
INSERT INTO services (
  slug, title, hero_title, hero_subtitle, price_badge, content_html, features,
  cta_title, cta_text, seo, status, display_mode, faqs, page_custom_css
) VALUES (
  'mall-management',
  'Mall & Commercial Property Software',
  'Mall & Commercial Property Software',
  'Tenant contracts, rent invoicing, common-area billing, and maintenance tickets in one place — fewer spreadsheets, clearer occupancy visibility for mall and plaza operators.',
  'Demo for property teams',
  '<p class="lead">Running a mall on shared drives breaks when teams grow. We centralise tenant facts, money, and maintenance so accounts and operations stop chasing different versions of truth.</p><h2>Operations dashboard</h2><p>See arrears, expiring leases, open tickets, and footfall notes (where you capture them) without opening five files.</p><h2>Tenant experience</h2><ul><li><i class="fas fa-store"></i> Optional tenant portal for invoices and requests</li><li><i class="fas fa-bell"></i> Automated reminders before due dates</li><li><i class="fas fa-chart-pie"></i> Category-wise revenue views for management meetings</li></ul>',
  '[{"title":"Lease registry","description":"Units, tenants, escalations, and document storage.","icon":"fas fa-file-contract"},{"title":"Billing runs","description":"Rent, CAM, and utility charge generation with reminders.","icon":"fas fa-receipt"},{"title":"Facilities","description":"Maintenance requests and vendor assignment.","icon":"fas fa-tools"}]',
  'See mall management demo',
  'Walk through tenant, billing, and maintenance flows with your real scenarios.',
  '{"title":"Mall Management System | Creative Web Solutions","description":"Mall management software for tenants, rent, and facilities. Commercial property operators in Punjab and India.","keywords":"mall management software, tenant billing system, commercial property software"}',
  'published',
  'classic',
  '[{"question":"Can owners see live occupancy?","answer":"Dashboards show vacant vs occupied units, upcoming renewals, and collection status."},{"question":"Multi-mall support?","answer":"Yes — properties and roles can be separated per site or group."},{"question":"Migration from Excel?","answer":"We import master data in a controlled cutover weekend with validation reports."}]',
  '.pro-page__section-title { max-width: 42rem; margin-left: auto; margin-right: auto; } .pro-page__icon-list li { transition: transform 0.25s ease; } .pro-page__icon-list li:hover { transform: translateY(-2px); }'
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  hero_title = VALUES(hero_title),
  hero_subtitle = VALUES(hero_subtitle),
  price_badge = VALUES(price_badge),
  content_html = VALUES(content_html),
  features = VALUES(features),
  cta_title = VALUES(cta_title),
  cta_text = VALUES(cta_text),
  seo = VALUES(seo),
  status = 'published',
  display_mode = 'classic',
  faqs = VALUES(faqs),
  page_custom_css = VALUES(page_custom_css);

-- medical-store-management
INSERT INTO services (
  slug, title, hero_title, hero_subtitle, price_badge, content_html, features,
  cta_title, cta_text, seo, status, display_mode, faqs, page_custom_css
) VALUES (
  'medical-store-management',
  'Pharmacy & Medical Store Software',
  'Pharmacy & Medical Store Software',
  'Batch-wise stock, expiry alerts, GST billing at the counter, and purchase tracking — built for busy pharmacies in Punjab and across India.',
  'Counter-ready in days',
  '<p class="lead">Pharmacy counters cannot wait on slow software. Our medical store system prioritises speed, expiry safety, and clear purchase history for owners and CAs.</p><h2>Counter workflow</h2><figure><img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&amp;fit=crop&amp;w=1200&amp;h=700&amp;q=85" alt="Pharmacy inventory and billing" /></figure><p>Search by name or salt, substitute suggestions where you allow them, and print GST invoices in seconds.</p><h2>Stock intelligence</h2><ul><li><i class="fas fa-calendar-times"></i> Expiry reports by rack and supplier</li><li><i class="fas fa-box"></i> Minimum stock alerts tied to lead times</li><li><i class="fas fa-file-invoice-dollar"></i> Purchase vs sales margin snapshots</li></ul><h2>Local support</h2><p>Training at your store plus phone support during business hours from our Zirakpur team.</p>',
  '[{"title":"Batch & expiry","description":"FEFO-friendly picking and near-expiry alerts.","icon":"fas fa-pills"},{"title":"Fast billing","description":"Keyboard-friendly POS with GST breakdown.","icon":"fas fa-cash-register"},{"title":"Purchase control","description":"Supplier orders matched to stock receipts.","icon":"fas fa-truck"}]',
  'Schedule pharmacy demo',
  'We configure GST, racks, and suppliers with your team on site or remotely.',
  '{"title":"Medical Store Management Software | Creative Web Solutions","description":"Pharmacy billing and inventory software. Expiry tracking, GST invoices, reports. Support in Zirakpur & Tricity.","keywords":"pharmacy software Punjab, medical store billing, chemist shop software"}',
  'published',
  'classic',
  '[{"question":"Does it support Schedule H drugs logging?","answer":"We configure registers and fields per your compliance practice — confirm requirements in discovery."},{"question":"Barcode scanning?","answer":"Yes, for SKUs you barcode. We help map fast-moving items first."},{"question":"Multiple counters?","answer":"Additional counters and cashier roles can share one database with permissions."}]',
  '.pro-page__section-title { max-width: 42rem; margin-left: auto; margin-right: auto; } .pro-page__icon-list li { transition: transform 0.25s ease; } .pro-page__icon-list li:hover { transform: translateY(-2px); }'
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  hero_title = VALUES(hero_title),
  hero_subtitle = VALUES(hero_subtitle),
  price_badge = VALUES(price_badge),
  content_html = VALUES(content_html),
  features = VALUES(features),
  cta_title = VALUES(cta_title),
  cta_text = VALUES(cta_text),
  seo = VALUES(seo),
  status = 'published',
  display_mode = 'classic',
  faqs = VALUES(faqs),
  page_custom_css = VALUES(page_custom_css);

-- school-management-system
INSERT INTO services (
  slug, title, hero_title, hero_subtitle, price_badge, content_html, features,
  cta_title, cta_text, seo, status, display_mode, faqs, page_custom_css
) VALUES (
  'school-management-system',
  'School Management ERP',
  'School Management ERP',
  'Admissions, fees, attendance, exams, and parent communication — one system for CBSE, ICSE, and state-board schools that reduces office repetition and keeps parents informed.',
  'Per-student pricing available',
  '<p class="lead">School offices spend too much time on fee receipts and phone calls. Our ERP connects front office, accounts, and teachers so parents get answers without queuing at the desk.</p><h2>Modules</h2><figure><img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&amp;fit=crop&amp;w=1200&amp;h=700&amp;q=85" alt="School campus and education" /></figure><p>Student master, attendance (class-wise), timetable, exams, transport routes, and library basics — enabled per your plan.</p><h2>For parents</h2><ul><li><i class="fas fa-bell"></i> Fee dues and event notices on portal/SMS where configured</li><li><i class="fas fa-chart-bar"></i> Report cards and progress views after approval</li><li><i class="fas fa-bus"></i> Transport and ID card data in one profile</li></ul><h2>Implementation</h2><p>Train admins first, then teachers, then parent onboarding. We stay on call through the first fee cycle.</p>',
  '[{"title":"Admissions pipeline","description":"Enquiry to enrollment with document checklist.","icon":"fas fa-user-plus"},{"title":"Fee automation","description":"Structures, concessions, receipts, and dues reminders.","icon":"fas fa-money-check-alt"},{"title":"Parent portal","description":"Attendance, homework, and results with controlled access.","icon":"fas fa-mobile-alt"}]',
  'Book school ERP demo',
  'See admission, fee, and parent portal flows aligned to your school size.',
  '{"title":"School Management System | Creative Web Solutions","description":"School ERP software in Chandigarh & Punjab. Admissions, fees, attendance, parent app. Implementation and training included.","keywords":"school management software Chandigarh, school ERP Punjab, parent portal school"}',
  'published',
  'classic',
  '[{"question":"Is there a parent mobile app?","answer":"Parent views work on mobile browsers; dedicated apps can be scoped if required."},{"question":"Can teachers enter marks?","answer":"Yes, with role limits so only authorised staff publish report cards."},{"question":"Data migration?","answer":"We import students, classes, and opening balances in a planned window before go-live."}]',
  '.pro-page__section-title { max-width: 42rem; margin-left: auto; margin-right: auto; } .pro-page__icon-list li { transition: transform 0.25s ease; } .pro-page__icon-list li:hover { transform: translateY(-2px); }'
)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  hero_title = VALUES(hero_title),
  hero_subtitle = VALUES(hero_subtitle),
  price_badge = VALUES(price_badge),
  content_html = VALUES(content_html),
  features = VALUES(features),
  cta_title = VALUES(cta_title),
  cta_text = VALUES(cta_text),
  seo = VALUES(seo),
  status = 'published',
  display_mode = 'classic',
  faqs = VALUES(faqs),
  page_custom_css = VALUES(page_custom_css);

SELECT slug, title, LENGTH(content_html) AS content_len, display_mode, status FROM services ORDER BY slug;
