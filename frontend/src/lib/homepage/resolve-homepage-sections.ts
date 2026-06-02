import { HOMEPAGE_PUBLIC_LAYOUTS } from "@/data/cws-homepage-modern-sections";
import { applyCanonicalSectionTheme } from "@/lib/homepage/section-appearance";
import type { HomepageSection } from "@/lib/wordpress/types";

/** Public homepage sections in DB order (CMS only). */
export function resolveHomepageSections(raw: HomepageSection[]): HomepageSection[] {
  const filtered = raw.filter((s) => HOMEPAGE_PUBLIC_LAYOUTS.has(String(s.acfFcLayout ?? "")));
  return filtered.map(applyCanonicalSectionTheme);
}
