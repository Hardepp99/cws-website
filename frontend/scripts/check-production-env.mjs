#!/usr/bin/env node
/**
 * Run before `next build` — ensures required env vars for production.
 * Set SKIP_ENV_CHECK=1 to bypass (not recommended on real deploys).
 */
const skip = process.env.SKIP_ENV_CHECK === "1";
const isProd = process.env.NODE_ENV === "production";

if (skip || !isProd) {
  process.exit(0);
}

const required = [
  ["NEXT_PUBLIC_SITE_URL", "Public site URL (https://your-domain.com)"],
  ["MYSQL_DATABASE", "MySQL database name (or DB_NAME)"],
];

const missing = required.filter(([key]) => {
  if (key === "MYSQL_DATABASE") {
    return !(process.env.MYSQL_DATABASE?.trim() || process.env.DB_NAME?.trim());
  }
  return !process.env[key]?.trim();
});

if (missing.length) {
  console.error("\n[cws-website] Production build missing required environment variables:\n");
  for (const [key, hint] of missing) {
    console.error(`  - ${key}  (${hint})`);
  }
  console.error("\nSee frontend/.env.production.example and docs/NODE_CMS.md\n");
  process.exit(1);
}

try {
  new URL(process.env.NEXT_PUBLIC_SITE_URL);
} catch {
  console.error("[cws-website] NEXT_PUBLIC_SITE_URL must be a valid absolute URL.\n");
  process.exit(1);
}

console.log("[cws-website] Production env OK:", process.env.NEXT_PUBLIC_SITE_URL);
