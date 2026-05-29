import { CWS_MODERN_HOMEPAGE_SECTIONS } from "@/data/cws-homepage-modern-sections";
import { filterPublishedItems } from "@/lib/homepage/item-status";
import type { MarqueeItem } from "@/components/sections/ServicesMarqueeStrip";
import type { HomepageSection } from "@/lib/wordpress/types";

const fallbackHero = CWS_MODERN_HOMEPAGE_SECTIONS.find((s) => s.acfFcLayout === "hero_slider");

/** Default pills when CMS hero has no marqueeItems and legacy section was removed. */
export const DEFAULT_HERO_MARQUEE_ITEMS: MarqueeItem[] = (
  (fallbackHero?.marqueeItems as MarqueeItem[] | undefined) ?? []
).filter((item) => item?.title);

/** Marquee pills: hero.marqueeItems → legacy services_marquee → built-in defaults. */
export function resolveHeroMarqueeItems(
  sections: HomepageSection[],
  heroSection?: HomepageSection,
  allSections?: HomepageSection[],
): MarqueeItem[] {
  const pool = allSections ?? sections;

  const fromHero = filterPublishedItems(
    (heroSection?.marqueeItems as MarqueeItem[] | undefined) ?? [],
  );
  if (fromHero.length > 0) return fromHero;

  const legacy = pool.find((s) => s.acfFcLayout === "services_marquee");
  if (legacy) {
    const fromLegacy = filterPublishedItems((legacy.items as MarqueeItem[]) || []);
    if (fromLegacy.length > 0) return fromLegacy;
  }

  return filterPublishedItems(DEFAULT_HERO_MARQUEE_ITEMS);
}
