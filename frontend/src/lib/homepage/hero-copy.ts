import type { HomepageSection } from "@/lib/wordpress/types";

export const HERO_TAGLINE =
  "We build websites, mobile apps, and digital marketing that turn visitors into real enquiries.";

const TAGLINE_END = "real enquiries.";

export const HERO_HEADLINE_FALLBACK = "What we do for you";

/** Strip em-dash “description” tail from CMS subheadlines. */
export function normalizeHeroTagline(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return HERO_TAGLINE;

  let base = trimmed;
  const dash = base.indexOf("—");
  if (dash !== -1) {
    base = base.slice(0, dash).trim();
  }

  if (base.includes(TAGLINE_END)) {
    const end = base.indexOf(TAGLINE_END) + TAGLINE_END.length;
    base = base.slice(0, end).trim();
  }

  if (base.startsWith("We build websites") && base.includes("real enquiries")) {
    return HERO_TAGLINE;
  }

  return base || HERO_TAGLINE;
}

export function isHeroTaglineHeadline(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (t === HERO_TAGLINE) return true;
  if (t.startsWith("We build websites") && t.includes("real enquiries")) return true;
  return normalizeHeroTagline(t) === HERO_TAGLINE;
}

export function resolveHeroHeadline(section: HomepageSection): string {
  const raw = String(section.headline ?? "").trim();
  if (!raw || isHeroTaglineHeadline(raw)) return HERO_HEADLINE_FALLBACK;
  return raw;
}

export function resolveHeroTagline(section: HomepageSection): string {
  const sub = String(section.subheadline ?? "").trim();
  if (sub) return normalizeHeroTagline(sub);
  const head = String(section.headline ?? "").trim();
  if (isHeroTaglineHeadline(head)) return HERO_TAGLINE;
  return HERO_TAGLINE;
}

export function heroShowsTaglineOnly(section: HomepageSection): boolean {
  const head = String(section.headline ?? "").trim();
  const sub = String(section.subheadline ?? "").trim();
  return isHeroTaglineHeadline(head) && (!sub || normalizeHeroTagline(sub) === HERO_TAGLINE);
}
