/** Fixed neutral tint — Premium grey bands only (no random pastels). */
export type LightPastelTint = "white";

export function pickRandomLightPastelTint(): LightPastelTint {
  return "white";
}

export const LIGHT_PASTEL_TINTS: readonly LightPastelTint[] = ["white"] as const;
