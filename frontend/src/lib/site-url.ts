/**
 * Public site origin — set NEXT_PUBLIC_SITE_URL on every deployment (no trailing slash).
 * Dev fallback: http://localhost:3000
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    return raw.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return "";
}

/** Resolved public site URL (empty in production if env missing — run prebuild check). */
export const siteUrl = getSiteUrl();
