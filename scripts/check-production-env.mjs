#!/usr/bin/env node
/**
 * Run before `next build` — ensures required env vars for domain-independent production.
 * Set SKIP_ENV_CHECK=1 to bypass (not recommended on real deploys).
 */
const skip = process.env.SKIP_ENV_CHECK === "1";
const isProd = process.env.NODE_ENV === "production";

if (skip || !isProd) {
  process.exit(0);
}

const required = [
  ["NEXT_PUBLIC_SITE_URL", "Public site URL (https://your-domain.com)"],
  ["CMS_API_URL", "CMS API base reachable from the Next.js server"],
];

const missing = required.filter(([key]) => !process.env[key]?.trim());

if (missing.length) {
  console.error("\n[cws-website] Production build missing required environment variables:\n");
  for (const [key, hint] of missing) {
    console.error(`  - ${key}  (${hint})`);
  }
  console.error("\nCopy frontend/.env.production.example → frontend/.env.local (or set host env).");
  console.error("See docs/PRODUCTION_DEPLOY.md\n");
  process.exit(1);
}

try {
  new URL(process.env.NEXT_PUBLIC_SITE_URL);
  new URL(process.env.CMS_API_URL);
} catch {
  console.error("[cws-website] NEXT_PUBLIC_SITE_URL and CMS_API_URL must be valid absolute URLs.\n");
  process.exit(1);
}

console.log("[cws-website] Production env OK:", process.env.NEXT_PUBLIC_SITE_URL);
