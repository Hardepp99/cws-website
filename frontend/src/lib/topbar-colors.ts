/** Topbar — logo blue gradient (#0A78ED → #012174 from cws-logo.svg) */
export const TOPBAR_PASTEL_COLORS = [
  {
    id: "logo-blue",
    bg: "linear-gradient(90deg, #0A78ED 0%, #0155C4 52%, #012174 100%)",
  },
] as const;

export const TOPBAR_COLOR_STORAGE_KEY = "cws-topbar-color-index";
export const TOPBAR_LAST_PATH_KEY = "cws-topbar-last-path";
export const TOPBAR_NAV_ID_KEY = "cws-topbar-nav-id";

export function advanceTopbarColorIndex(): number {
  return 0;
}

export function resolveTopbarColorForNavigation(_pathname: string): number {
  return 0;
}

export function getTopbarColorByIndex(_index: number): (typeof TOPBAR_PASTEL_COLORS)[number] {
  return TOPBAR_PASTEL_COLORS[0];
}
