#!/usr/bin/env node
/**
 * Generate database/live/12_services_detail_genuine_content.sql from JSON source.
 *
 *   node database/scripts/export-services-live-sql.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..", "..");
const src = join(root, "database", "content", "services-detail-genuine.json");
const out = join(root, "database", "live", "12_services_detail_genuine_content.sql");

function escSql(s) {
  return String(s ?? "").replace(/\\/g, "\\\\").replace(/'/g, "''");
}

const data = JSON.parse(readFileSync(src, "utf8"));
const lines = [
  "-- =============================================================================",
  "-- Service detail pages — genuine copy, pro HTML (H2 sections), features & FAQs",
  "-- Run on production DB `cws_cms` after 01_schema (display_mode, faqs, page_custom_css)",
  "-- Safe to re-run: updates by slug; inserts missing rows",
  "-- Generated: node database/scripts/export-services-live-sql.mjs",
  "-- =============================================================================",
  "",
  "SET NAMES utf8mb4;",
  "",
];

const pageCss =
  ".pro-page__section-title { max-width: 42rem; margin-left: auto; margin-right: auto; } .pro-page__icon-list li { transition: transform 0.25s ease; } .pro-page__icon-list li:hover { transform: translateY(-2px); }";

for (const [slug, row] of Object.entries(data)) {
  const title = row.hero_title?.split("|")[0]?.trim() || slug.replace(/-/g, " ");
  const features = JSON.stringify(row.features ?? []);
  const faqs = JSON.stringify(row.faqs ?? []);
  const seo = JSON.stringify(row.seo ?? {});

  lines.push(`-- ${slug}`);
  lines.push(`INSERT INTO services (`);
  lines.push(
    `  slug, title, hero_title, hero_subtitle, price_badge, content_html, features,`,
  );
  lines.push(`  cta_title, cta_text, seo, status, display_mode, faqs, page_custom_css`);
  lines.push(`) VALUES (`);
  lines.push(`  '${escSql(slug)}',`);
  lines.push(`  '${escSql(title)}',`);
  lines.push(`  '${escSql(row.hero_title)}',`);
  lines.push(`  '${escSql(row.hero_subtitle)}',`);
  lines.push(`  '${escSql(row.price_badge)}',`);
  lines.push(`  '${escSql(row.content_html)}',`);
  lines.push(`  '${escSql(features)}',`);
  lines.push(`  '${escSql(row.cta_title)}',`);
  lines.push(`  '${escSql(row.cta_text)}',`);
  lines.push(`  '${escSql(seo)}',`);
  lines.push(`  'published',`);
  lines.push(`  'classic',`);
  lines.push(`  '${escSql(faqs)}',`);
  lines.push(`  '${escSql(pageCss)}'`);
  lines.push(`)`);
  lines.push(`ON DUPLICATE KEY UPDATE`);
  lines.push(`  title = VALUES(title),`);
  lines.push(`  hero_title = VALUES(hero_title),`);
  lines.push(`  hero_subtitle = VALUES(hero_subtitle),`);
  lines.push(`  price_badge = VALUES(price_badge),`);
  lines.push(`  content_html = VALUES(content_html),`);
  lines.push(`  features = VALUES(features),`);
  lines.push(`  cta_title = VALUES(cta_title),`);
  lines.push(`  cta_text = VALUES(cta_text),`);
  lines.push(`  seo = VALUES(seo),`);
  lines.push(`  status = 'published',`);
  lines.push(`  display_mode = 'classic',`);
  lines.push(`  faqs = VALUES(faqs),`);
  lines.push(`  page_custom_css = VALUES(page_custom_css);`);
  lines.push("");
}

lines.push("SELECT slug, title, LENGTH(content_html) AS content_len, display_mode, status FROM services ORDER BY slug;");
lines.push("");

writeFileSync(out, lines.join("\n"), "utf8");
console.log("Wrote", out.replace(root, ""));
