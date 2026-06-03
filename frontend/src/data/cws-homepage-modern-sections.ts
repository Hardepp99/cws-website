import sectionDefaults from "@/data/cws-homepage-sections-defaults.json";
import {
  DEFAULT_SERVICE_GRID_ITEMS,
  DEFAULT_SERVICES_GRID_SUBTITLE,
} from "@/lib/homepage/service-grid-defaults";
import type { HomepageSection } from "@/lib/wordpress/types";

const LAYOUT_ORDER = [
  "hero_slider",
  "trust_badges",
  "why_codify",
  "services_grid",
  "tech_stack",
  "industries",
  "portfolio",
  "process",
  "testimonials",
  "guarantees",
  "pricing_packages",
  "faq",
  "cta",
] as const;

function withServicesGridDefaults(section: HomepageSection): HomepageSection {
  if (section.acfFcLayout !== "services_grid") return section;
  const items =
    Array.isArray(section.items) && section.items.length > 0
      ? section.items
      : DEFAULT_SERVICE_GRID_ITEMS;
  const subtitle = section.subtitle?.trim() || DEFAULT_SERVICES_GRID_SUBTITLE;
  return { ...section, subtitle, items };
}

/**
 * Plan2 agency homepage — worldwide positioning.
 * Announcement bar = site_settings promo (admin).
 * Order: Hero → Trust → Why → Services → Tech → Industries → Case studies →
 * Process → Testimonials → Guarantees → Pricing → FAQ → CTA
 */
export const CWS_MODERN_HOMEPAGE_SECTIONS: HomepageSection[] = (
  sectionDefaults as HomepageSection[]
).map(withServicesGridDefaults);

export const HOMEPAGE_PUBLIC_LAYOUTS = new Set<string>(LAYOUT_ORDER);

export function mergeHomepageSectionsFromCms(cmsSections: HomepageSection[]): HomepageSection[] {
  const cmsByLayout = new Map<string, HomepageSection>();
  for (const s of cmsSections) {
    const layout = String(s.acfFcLayout ?? "");
    if (HOMEPAGE_PUBLIC_LAYOUTS.has(layout)) {
      cmsByLayout.set(layout, s);
    }
  }

  return LAYOUT_ORDER.map((layout) => {
    const defaults = CWS_MODERN_HOMEPAGE_SECTIONS.find((s) => s.acfFcLayout === layout);
    const base = defaults ?? ({ acfFcLayout: layout } as HomepageSection);
    const fromCms = cmsByLayout.get(layout);
    if (!fromCms) return withServicesGridDefaults(base);
    return withServicesGridDefaults({ ...base, ...fromCms, acfFcLayout: layout });
  });
}
