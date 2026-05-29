type HeroStat = { count?: number; label?: string };
type TrustItem = { title?: string };

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function leadingCount(text: string): number | null {
  const m = norm(text).match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

/** Drop trust badges that repeat a hero stat (e.g. 480+ projects vs 480 Projects delivered). */
export function filterTrustItemsNotInHeroStats<T extends TrustItem>(
  items: T[],
  heroStats: HeroStat[] | undefined
): T[] {
  if (!heroStats?.length) return items;

  const heroKeys = heroStats
    .filter((s) => s.label)
    .map((s) => ({
      count: typeof s.count === "number" ? s.count : leadingCount(String(s.count ?? "")),
      words: norm(`${s.count ?? ""} ${s.label ?? ""}`).split(" ").filter((w) => w.length > 2),
    }));

  return items.filter((item) => {
    const title = norm(item.title ?? "");
    if (!title) return true;
    const itemCount = leadingCount(title);
    const itemWords = title.split(" ").filter((w) => w.length > 2);

    return !heroKeys.some((hero) => {
      if (itemCount != null && hero.count != null && itemCount !== hero.count) return false;
      const shared = itemWords.filter((w) => hero.words.includes(w));
      return shared.length > 0;
    });
  });
}
