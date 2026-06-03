import { filterPublishedItems } from "@/lib/homepage/item-status";
import type { HomepageSection } from "@/lib/wordpress/types";

export type HeroStatItem = {
  icon?: string;
  count?: number;
  label?: string;
  tone?: string;
  status?: string;
};

export const DEFAULT_HERO_STATS: HeroStatItem[] = [
  { icon: "fas fa-project-diagram", count: 549, label: "Projects delivered", tone: "blue" },
  { icon: "fas fa-users", count: 320, label: "Clients served", tone: "green" },
  { icon: "fas fa-award", count: 15, label: "Years in business", tone: "royal" },
];

export function resolveHeroStats(section?: HomepageSection): HeroStatItem[] {
  const fromSection = filterPublishedItems(
    (section?.stats as HeroStatItem[] | undefined) ?? [],
  );
  if (fromSection.length > 0) return fromSection;
  return DEFAULT_HERO_STATS;
}

export function formatHeroStatCount(count: number | undefined): string {
  if (count == null || Number.isNaN(count)) return "—";
  return count >= 100 ? `${count.toLocaleString()}+` : String(count);
}
