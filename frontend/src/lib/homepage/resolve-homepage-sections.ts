import {
  CWS_MODERN_HOMEPAGE_SECTIONS,
  HOMEPAGE_PUBLIC_LAYOUTS,
} from "@/data/cws-homepage-modern-sections";
import { applyCanonicalSectionTheme } from "@/lib/homepage/section-appearance";
import type { HomepageSection } from "@/lib/wordpress/types";

const DEFAULT_ABOUT = CWS_MODERN_HOMEPAGE_SECTIONS.find((s) => s.acfFcLayout === "about");

/** Public homepage sections in display order; injects About after hero when CMS omits it. */
export function resolveHomepageSections(raw: HomepageSection[]): HomepageSection[] {
  const filtered = raw.filter((s) => HOMEPAGE_PUBLIC_LAYOUTS.has(String(s.acfFcLayout ?? "")));
  const base = filtered.length > 0 ? filtered : [...CWS_MODERN_HOMEPAGE_SECTIONS];

  let sections = base;

  if (!sections.some((s) => s.acfFcLayout === "about") && DEFAULT_ABOUT) {
    const heroIdx = sections.findIndex((s) => s.acfFcLayout === "hero_slider");
    const insertAt = heroIdx >= 0 ? heroIdx + 1 : 0;
    sections = [...sections.slice(0, insertAt), { ...DEFAULT_ABOUT }, ...sections.slice(insertAt)];
  }

  return sections.map(applyCanonicalSectionTheme);
}
