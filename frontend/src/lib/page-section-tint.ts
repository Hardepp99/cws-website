/** Pastel band backgrounds — one random tint per light section on each page load. */
export type LightPastelTint = "white" | "yellow" | "pink" | "sky" | "green";

/** White appears once; colored tints dominate so pages do not look flat white. */
const LIGHT_PASTEL_TINT_POOL: LightPastelTint[] = [
  "yellow",
  "pink",
  "sky",
  "green",
  "yellow",
  "pink",
  "sky",
  "green",
  "white",
];

export function pickRandomLightPastelTint(): LightPastelTint {
  const index = Math.floor(Math.random() * LIGHT_PASTEL_TINT_POOL.length);
  return LIGHT_PASTEL_TINT_POOL[index] ?? "yellow";
}

export const LIGHT_PASTEL_TINTS: readonly LightPastelTint[] = [
  "white",
  "yellow",
  "pink",
  "sky",
  "green",
] as const;
