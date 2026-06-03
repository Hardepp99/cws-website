#!/usr/bin/env node
/**
 * Generates database/live SQL from frontend/src/data/cws-homepage-sections-defaults.json
 * Run: node frontend/scripts/export-homepage-live-sql.mjs
 */
import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..");

const SERVICES_SUBTITLE =
  "Strategy, design, engineering, and growth in one partner — each service links to a dedicated SEO landing page.";

const SERVICE_ITEMS = [
  {
    icon: "fas fa-paint-brush",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=960&h=540&q=85",
    title: "Web design",
    desc: "Bold, on-brand interfaces that guide visitors to action — desktop and mobile, built for trust at first scroll.",
    href: "/ui-ux-design-zirakpur",
    tone: "pink",
  },
  {
    icon: "fas fa-code",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=960&h=540&q=85",
    title: "Website development",
    desc: "Fast, secure sites and landing pages with forms, CRM hooks, and analytics baked in — code your team can extend.",
    href: "/website-development-zirakpur",
    tone: "blue",
  },
  {
    icon: "fas fa-mobile-alt",
    image: "https://images.unsplash.com/photo-1512945903694-92d7a22944f4?auto=format&fit=crop&w=960&h=540&q=85",
    title: "Mobile apps",
    desc: "Polished Android & iOS experiences users keep — onboarding, push, payments, and admin when you need scale.",
    href: "/mobile-app-development-zirakpur",
    tone: "green",
  },
  {
    icon: "fas fa-bullhorn",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=960&h=540&q=85",
    title: "Digital marketing",
    desc: "Google Ads, Meta, and landing pages engineered for leads — weekly clarity on cost per enquiry, not vanity charts.",
    href: "/digital-marketing-zirakpur",
    tone: "orange",
  },
  {
    icon: "fas fa-robot",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&h=540&q=85",
    title: "Custom software & AI",
    desc: "Dashboards, portals, automation, and AI features that replace manual work — shaped around how your team operates.",
    href: "/custom-software-development-zirakpur",
    tone: "grey",
  },
  {
    icon: "fas fa-pen-nib",
    image: "https://images.unsplash.com/photo-1626785774573-4b7999ee4feb?auto=format&fit=crop&w=960&h=540&q=85",
    title: "Brand & graphics",
    desc: "Logos, decks, ad kits, and social systems that look expensive everywhere — consistent, launch-ready creative.",
    href: "/graphic-designing-zirakpur",
    tone: "pink",
  },
  {
    icon: "fas fa-cart-shopping",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=960&h=540&q=85",
    title: "Ecommerce",
    desc: "Shopify, WooCommerce, or custom storefronts with checkout that feels effortless — merchandising built to convert.",
    href: "/ecommerce-website-zirakpur",
    tone: "green",
  },
  {
    icon: "fas fa-chart-line",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf4a?auto=format&fit=crop&w=960&h=540&q=85",
    title: "SEO & content",
    desc: "Technical SEO, topic clusters, and content that ranks — so the right buyers find you when intent is highest.",
    href: "/seo-services-zirakpur",
    tone: "blue",
  },
];

const ADMIN_TITLES = {
  hero_slider: "Hero",
  trust_badges: "Client trust",
  why_codify: "Why choose us",
  services_grid: "Services",
  tech_stack: "Technologies",
  industries: "Industries",
  portfolio: "Case studies",
  process: "Process",
  testimonials: "Testimonials",
  guarantees: "Guarantees",
  pricing_packages: "Pricing models",
  faq: "FAQ",
  cta: "Final CTA",
};

const defaultsPath = join(root, "frontend", "src", "data", "cws-homepage-sections-defaults.json");
const rawSections = JSON.parse(readFileSync(defaultsPath, "utf8"));

const SECTIONS = rawSections.map((payload, sort_order) => {
  const layout = payload.acfFcLayout;
  const p = { ...payload };
  if (layout === "services_grid") {
    p.subtitle = p.subtitle || SERVICES_SUBTITLE;
    p.items = SERVICE_ITEMS;
  }
  return {
    layout,
    sort_order,
    admin_title: ADMIN_TITLES[layout] || layout,
    payload: p,
  };
});

/** MariaDB / older MySQL: assign JSON string directly (no CAST … AS JSON). */
function sqlEscapeJson(obj) {
  return JSON.stringify(obj)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "''")
    .replace(/\u2014/g, "-")
    .replace(/\u00b7/g, "-")
    .replace(/\u2013/g, "-");
}

function payloadAssignment(jsonEscaped) {
  return `payload = '${jsonEscaped}'`;
}

const layoutsList = SECTIONS.map((s) => s.layout).join(",");

function buildHomepageSql(filename, title) {
  let sql = `-- =============================================================================
-- ${title}
-- =============================================================================
-- MariaDB-safe: JSON assigned as quoted string (no CAST AS JSON).
-- Source: frontend/src/data/cws-homepage-sections-defaults.json
-- Regenerate: node frontend/scripts/export-homepage-live-sql.mjs
-- Generated: ${new Date().toISOString()}
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
  AND FIND_IN_SET(layout, '${layoutsList}') = 0;

`;

  for (const sec of SECTIONS) {
    const json = sqlEscapeJson(sec.payload);
    const titleEsc = sec.admin_title.replace(/'/g, "''");
    sql += `
-- ---------- ${sec.layout} (sort ${sec.sort_order}) ----------
UPDATE homepage_sections
SET
  sort_order = ${sec.sort_order},
  layout = '${sec.layout}',
  status = 'published',
  admin_title = '${titleEsc}',
  ${payloadAssignment(json)}
WHERE page_id = @page_id AND layout = '${sec.layout}' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, ${sec.sort_order}, '${sec.layout}', 'published', '${titleEsc}', '${json}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = '${sec.layout}' AND hs.status <> 'trash'
  );

`;
  }

  sql += `
COMMIT;

SELECT id, layout, status, sort_order, admin_title,
       JSON_UNQUOTE(JSON_EXTRACT(payload, '$.title')) AS section_title
FROM homepage_sections
WHERE page_id = @page_id
ORDER BY sort_order ASC, id ASC;
`;
  return sql;
}

const promoSql = `-- =============================================================================
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
`;

const finalSql = `-- =============================================================================
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
`;

writeFileSync(
  join(root, "database", "live", "05_homepage_ONLY_full_update.sql"),
  buildHomepageSql("05", "CWS LIVE — HOMEPAGE ONLY (full section content update)"),
  "utf8",
);
writeFileSync(
  join(root, "database", "live", "07_plan2_homepage_full_update.sql"),
  buildHomepageSql("07", "CWS LIVE — PLAN2 homepage (full section content + order)"),
  "utf8",
);
writeFileSync(join(root, "database", "live", "08_plan2_site_settings_promo.sql"), promoSql, "utf8");
writeFileSync(join(root, "database", "live", "09_FINAL_server_run_order.sql"), finalSql, "utf8");

console.log("Wrote 05, 07, 08, 09 SQL files");

const perDir = join(root, "database", "live", "homepage-sections");
mkdirSync(perDir, { recursive: true });

const pagePreamble = `-- Homepage ONLY - run after 00_page_setup.sql
USE cws_cms;
SET NAMES utf8mb4;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SET @page_id := IFNULL(@page_id, (SELECT id FROM pages WHERE slug = 'home' LIMIT 1));
`;

for (const sec of SECTIONS) {
  const json = sqlEscapeJson(sec.payload);
  const titleEsc = sec.admin_title.replace(/'/g, "''");
  const one = `${pagePreamble}
-- Section: ${sec.layout}
UPDATE homepage_sections
SET sort_order = ${sec.sort_order}, layout = '${sec.layout}', status = 'published',
    admin_title = '${titleEsc}',
    ${payloadAssignment(json)}
WHERE page_id = @page_id AND layout = '${sec.layout}' AND status <> 'trash';

INSERT INTO homepage_sections (page_id, sort_order, layout, status, admin_title, payload)
SELECT @page_id, ${sec.sort_order}, '${sec.layout}', 'published', '${titleEsc}', '${json}'
FROM DUAL
WHERE @page_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM homepage_sections hs
    WHERE hs.page_id = @page_id AND hs.layout = '${sec.layout}' AND hs.status <> 'trash'
  );
`;
  const file = join(perDir, `${String(sec.sort_order).padStart(2, "0")}_${sec.layout}.sql`);
  writeFileSync(file, one, "utf8");
}

writeFileSync(
  join(perDir, "00_README.txt"),
  `Plan2 homepage section SQL (one layout per file).
Run 00_page_setup.sql first, then files 00-12 in sort order.
OR use ../07_plan2_homepage_full_update.sql for all sections at once.
Promo bar: ../08_plan2_site_settings_promo.sql
`,
  "utf8",
);

writeFileSync(
  join(perDir, "00_page_setup.sql"),
  `-- Homepage page flags only (no other pages)
USE cws_cms;
START TRANSACTION;
UPDATE pages SET is_homepage = 0;
UPDATE pages SET slug = 'home', title = 'Home', is_homepage = 1, status = 'published', display_mode = 'classic'
WHERE slug IN ('home', 'index') OR is_homepage = 1
LIMIT 1;
SET @page_id := (SELECT id FROM pages WHERE is_homepage = 1 LIMIT 1);
SELECT @page_id AS homepage_page_id;
COMMIT;
`,
  "utf8",
);

console.log("Wrote per-section files to", perDir);
console.log("Sections:", SECTIONS.length);
