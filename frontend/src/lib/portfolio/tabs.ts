import type { PortfolioItem } from "@/lib/wordpress/portfolio-types";

export type PortfolioTab = {
  id: string;
  label: string;
  /** Raw category string to match; undefined for "all". */
  category?: string;
};

export function buildPortfolioTabs(items: PortfolioItem[], allLabel = "All work"): PortfolioTab[] {
  const categories = new Set<string>();
  for (const item of items) {
    const cat = item.category?.trim();
    if (cat) categories.add(cat);
  }

  const sorted = Array.from(categories).sort((a, b) => a.localeCompare(b));

  return [
    { id: "all", label: allLabel },
    ...sorted.map((cat) => ({
      id: slugifyCategory(cat),
      label: cat,
      category: cat,
    })),
  ];
}

export function filterPortfolioByTab(items: PortfolioItem[], tabId: string, tabs: PortfolioTab[]): PortfolioItem[] {
  if (tabId === "all") return items;
  const tab = tabs.find((t) => t.id === tabId);
  if (!tab?.category) return items;
  return items.filter((item) => item.category?.trim() === tab.category);
}

/** Homepage only — cap visible projects for the active tab. */
export function limitPortfolioTabItems(
  items: PortfolioItem[],
  tabId: string,
  tabs: PortfolioTab[],
  maxItems: number,
): PortfolioItem[] {
  const list = filterPortfolioByTab(items, tabId, tabs);
  const max = Math.max(1, maxItems);
  return list.slice(0, max);
}

function slugifyCategory(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "category";
}
