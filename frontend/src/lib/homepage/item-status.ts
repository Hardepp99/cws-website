export type ItemStatus = "published" | "draft" | "trash";

export function normalizeItemStatus(raw: unknown): ItemStatus {
  const s = String(raw ?? "published");
  if (s === "draft" || s === "trash") return s;
  return "published";
}

/** Legacy items without status are treated as published on the live site. */
export function isItemVisibleOnSite(item: Record<string, unknown>): boolean {
  return normalizeItemStatus(item.status) === "published";
}

export function filterPublishedItems<T extends Record<string, unknown>>(items: T[] | undefined): T[] {
  return (items ?? []).filter(isItemVisibleOnSite);
}

export function newItemId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `item_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function ensureItemIds(items: Record<string, unknown>[]): Record<string, unknown>[] {
  return items.map((item) => (item.id ? item : { ...item, id: newItemId() }));
}

export function itemListTitle(item: Record<string, unknown>, fallback: string): string {
  return String(
    item.title ?? item.name ?? item.text ?? item.label ?? fallback
  ).trim() || fallback;
}
