/** Apple-style topbar pastels — one solid color per page view */
export const TOPBAR_PASTEL_COLORS = [
  { id: "mint", bg: "#c8ddd0" },
  { id: "blue", bg: "#c5d0e0" },
  { id: "pink", bg: "#d4c4d6" },
  { id: "grey", bg: "#d2d2d6" },
  { id: "sky", bg: "#b8cfe8" },
  { id: "sage", bg: "#c0d8c8" },
] as const;

export const TOPBAR_COLOR_STORAGE_KEY = "cws-topbar-color-index";
export const TOPBAR_LAST_PATH_KEY = "cws-topbar-last-path";
export const TOPBAR_NAV_ID_KEY = "cws-topbar-nav-id";

export function advanceTopbarColorIndex(): number {
  const len = TOPBAR_PASTEL_COLORS.length;
  if (typeof window === "undefined") return 0;

  const raw = window.sessionStorage.getItem(TOPBAR_COLOR_STORAGE_KEY);
  const prev = raw === null ? -1 : parseInt(raw, 10);
  const safePrev = Number.isFinite(prev) ? prev : -1;
  const next = (safePrev + 1) % len;
  window.sessionStorage.setItem(TOPBAR_COLOR_STORAGE_KEY, String(next));
  return next;
}

/** Advance on new document load or pathname change (not twice in React Strict Mode). */
export function resolveTopbarColorForNavigation(pathname: string): number {
  if (typeof window === "undefined") return 0;

  const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  const navId = navEntry ? `${navEntry.type}:${navEntry.startTime}` : "unknown";
  const lastNavId = window.sessionStorage.getItem(TOPBAR_NAV_ID_KEY);
  const lastPath = window.sessionStorage.getItem(TOPBAR_LAST_PATH_KEY);
  const newDocument = lastNavId !== navId;
  const pathChanged = lastPath !== pathname;
  const shouldAdvance = newDocument || lastPath === null || pathChanged;

  const index = shouldAdvance
    ? advanceTopbarColorIndex()
    : parseInt(window.sessionStorage.getItem(TOPBAR_COLOR_STORAGE_KEY) ?? "0", 10);

  const safeIndex = Number.isFinite(index) ? index : 0;
  window.sessionStorage.setItem(TOPBAR_NAV_ID_KEY, navId);
  window.sessionStorage.setItem(TOPBAR_LAST_PATH_KEY, pathname);
  return safeIndex;
}

export function getTopbarColorByIndex(index: number): (typeof TOPBAR_PASTEL_COLORS)[number] {
  const i = ((index % TOPBAR_PASTEL_COLORS.length) + TOPBAR_PASTEL_COLORS.length) % TOPBAR_PASTEL_COLORS.length;
  return TOPBAR_PASTEL_COLORS[i];
}
