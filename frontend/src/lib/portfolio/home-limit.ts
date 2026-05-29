import type { PortfolioItem } from "@/lib/wordpress/portfolio-types";

/** Default max projects shown per category on the homepage portfolio block. */
export const DEFAULT_PORTFOLIO_HOME_PER_CATEGORY = 5;

export function parsePortfolioHomeMax(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return DEFAULT_PORTFOLIO_HOME_PER_CATEGORY;
  return Math.max(1, Math.min(24, Math.round(n)));
}

/**
 * Keeps global sort order while allowing at most `maxPerCategory` items per category.
 * Used when building the homepage portfolio payload (not on /portfolio).
 */
export function capPortfolioHomeItemsByCategory(
  items: PortfolioItem[],
  maxPerCategory: number,
): PortfolioItem[] {
  const max = Math.max(1, maxPerCategory);
  const counts = new Map<string, number>();
  const result: PortfolioItem[] = [];

  for (const item of items) {
    const cat = item.category?.trim() || "";
    const n = counts.get(cat) ?? 0;
    if (n >= max) continue;
    counts.set(cat, n + 1);
    result.push(item);
  }

  return result;
}
