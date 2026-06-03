import { mergeHomepageSectionsFromCms } from "@/data/cws-homepage-modern-sections";
import { applyCanonicalSectionTheme } from "@/lib/homepage/section-appearance";
import type { HomepageSection } from "@/lib/wordpress/types";

const REGION_IN_TEXT =
  /\b(Zirakpur|Chandigarh|Mohali|Punjab|Tricity|Chandigarh Tricity)\b/gi;

const COPY_KEYS = new Set([
  "eyebrow",
  "headline",
  "subheadline",
  "badge",
  "title",
  "subtitle",
  "desc",
  "description",
  "text",
  "ctaLabel",
  "name",
  "role",
  "label",
]);

function cleanMarketingCopy(text: string): string {
  let s = text;
  s = s.replace(
    /,?\s*(in|across|from|near)\s+Zirakpur[^.]*?(Chandigarh|Mohali|Punjab)?[^.]*\.?/gi,
    ".",
  );
  s = s.replace(REGION_IN_TEXT, "");
  s = s.replace(/\s{2,}/g, " ").replace(/\s+([,.])/g, "$1").replace(/\.\s*\./g, ".").trim();
  return s;
}

function sanitizeSectionCopy(section: HomepageSection): HomepageSection {
  const out: HomepageSection = { ...section };

  const walk = (obj: Record<string, unknown>, key?: string) => {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string" && (COPY_KEYS.has(k) || (key && COPY_KEYS.has(key)))) {
        if (REGION_IN_TEXT.test(v)) obj[k] = cleanMarketingCopy(v);
      } else if (Array.isArray(v)) {
        v.forEach((item) => {
          if (item && typeof item === "object" && !Array.isArray(item)) {
            walk(item as Record<string, unknown>);
          }
        });
      } else if (v && typeof v === "object" && !Array.isArray(v)) {
        walk(v as Record<string, unknown>, k);
      }
    }
  };

  walk(out as Record<string, unknown>);
  return out;
}

/** Public homepage sections — CMS merged with worldwide agency defaults. */
export function resolveHomepageSections(raw: HomepageSection[]): HomepageSection[] {
  return mergeHomepageSectionsFromCms(raw)
    .map(sanitizeSectionCopy)
    .map(applyCanonicalSectionTheme);
}
