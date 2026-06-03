/** Visual layout variants for homepage section items (stable per section). */

export const ITEM_LAYOUT_VARIANTS = [
  "grid",
  "wheel",
  "infographic",
  "roadmap",
  "tree",
  "collage",
] as const;

export type ItemLayoutVariant = (typeof ITEM_LAYOUT_VARIANTS)[number];

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Layouts that may use each variant (grid always allowed as fallback). */
const LAYOUT_POOLS: Record<string, ItemLayoutVariant[]> = {
  trust_badges: ["wheel", "infographic", "collage", "tree", "grid"],
  industries: ["wheel", "collage", "infographic", "grid"],
  website_types: ["collage", "tree", "roadmap", "grid"],
  tech_stack: ["infographic", "wheel", "grid"],
  pricing_packages: ["collage", "infographic", "grid", "wheel"],
  guarantees: ["tree", "wheel", "infographic", "grid"],
  why_codify: ["wheel", "tree", "collage", "grid"],
  services_grid: ["collage", "wheel", "grid"],
  process: ["roadmap", "infographic", "wheel", "grid"],
  courses: ["collage", "tree", "grid"],
  testimonials: ["collage", "grid"],
  default: ["wheel", "infographic", "roadmap", "tree", "collage", "grid"],
};

/**
 * Pick a layout variant from section type + index (same on every page load).
 * Optional `itemsVisual` in CMS can override later.
 */
export function pickItemLayoutVariant(
  acfLayout: string,
  sectionIndex: number,
  override?: string | null,
): ItemLayoutVariant {
  const forced = override?.trim() as ItemLayoutVariant | undefined;
  if (forced && ITEM_LAYOUT_VARIANTS.includes(forced)) return forced;

  const pool = LAYOUT_POOLS[acfLayout] ?? LAYOUT_POOLS.default;
  const seed = hashSeed(`${acfLayout}:${sectionIndex}`);
  return pool[seed % pool.length] ?? "grid";
}
