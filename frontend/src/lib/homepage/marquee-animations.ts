/** Stable pseudo-random animation pick per marquee pill (SSR-safe seed). */
export const MARQUEE_PILL_ANIMATIONS = [
  "pop",
  "bounce",
  "pulse",
  "wiggle",
  "float",
  "tilt",
  "glow",
] as const;

export type MarqueePillAnimation = (typeof MARQUEE_PILL_ANIMATIONS)[number];

export function pickMarqueePillAnimation(seed: string, index: number): MarqueePillAnimation {
  let hash = index * 31;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) | 0;
  }
  return MARQUEE_PILL_ANIMATIONS[Math.abs(hash) % MARQUEE_PILL_ANIMATIONS.length];
}
