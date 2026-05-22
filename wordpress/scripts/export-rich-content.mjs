/**
 * Export sample SEO/content from frontend TS into wordpress/seed-data/*.json
 * Run: node wordpress/scripts/export-rich-content.mjs
 */
import { writeFileSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedDir = join(__dirname, "../seed-data");
const root = join(__dirname, "../..");

// Dynamic import TS via tsx when run as: npx tsx wordpress/scripts/export-rich-content.ts
// This .mjs duplicates minimal merge logic by reading pre-built JSON sources.

const samplePath = join(root, "frontend/src/data/cws-sample-seo-content.ts");
const homepagePath = join(seedDir, "homepage-sections.json");
const LOCATIONS =
  "Zirakpur, Chandigarh, Mohali, Panchkula, and businesses across Punjab and India searching for IT services near me";

function landingBody(service, focus, audience, outcomes) {
  const list = outcomes.map((o) => `<li>${o}</li>`).join("");
  return `
<h2>Professional ${service} for ${audience}</h2>
<p>Creative Web Solutions delivers ${service.toLowerCase()} with a focus on ${focus}. We work with ${LOCATIONS} — and with distributed teams that need reliable communication, written scope, and production discipline.</p>
<h3>Outcomes clients expect</h3>
<ul>${list}</ul>
<p>We start with a short discovery: current site or product, competitors you respect, keywords that matter, integrations (CRM, payments, inventory), and who will maintain content after launch. That keeps estimates honest and prevents surprise scope mid-project.</p>
<h3>Technical and SEO standards</h3>
<p>Semantic HTML, accessible forms, mobile-first layouts, compressed media, caching, and monitoring hooks are included by default — not sold as optional extras. For marketing sites we map service + location pages, FAQ schema where useful, and internal links so authority flows to money pages.</p>
<h3>Engagement options</h3>
<p>Fixed-scope projects, phased rollouts (design → build → launch → growth), and retainers for maintenance or ongoing SEO/PPC. Use <strong>Ask price</strong> on our site for a written ballpark, or <a href="/contact">contact us</a> for a call with a technical lead.</p>
`;
}

// Import enrichments by evaluating TS export — use tsx runner instead
console.log("Run with: npx tsx wordpress/scripts/export-rich-content.ts");
