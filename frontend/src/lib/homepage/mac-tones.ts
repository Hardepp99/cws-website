/** macOS / Apple system accent palette for homepage cards */
export const MAC_TONES = [
  "blue",
  "purple",
  "green",
  "orange",
  "pink",
  "teal",
  "indigo",
  "mint",
  "royal",
] as const;

export type MacTone = (typeof MAC_TONES)[number];

export function resolveMacTone(tone?: string, index = 0): MacTone {
  const normalized = (tone ?? "").toLowerCase().trim();
  if (MAC_TONES.includes(normalized as MacTone)) return normalized as MacTone;
  return MAC_TONES[Math.abs(index) % MAC_TONES.length];
}
