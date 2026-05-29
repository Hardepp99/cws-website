import type { DesimentorDocument } from "@/lib/desimentor/types";

export type DisplayMode = "classic" | "elementor";

export function normalizeDisplayMode(mode?: string | null): DisplayMode {
  return mode === "elementor" ? "elementor" : "classic";
}

export type PageBodyInput = {
  displayMode?: DisplayMode | string | null;
  content?: string | null;
  desimentor?: DesimentorDocument;
};

/** Which body to show on the public site (classic HTML vs Elementor layout). */
export function resolvePublicBody(input: PageBodyInput): {
  mode: DisplayMode;
  showElementor: boolean;
  showClassic: boolean;
} {
  const mode = normalizeDisplayMode(input.displayMode);
  const hasElementor = Boolean(input.desimentor?.sections?.length);
  const hasClassic = Boolean(input.content?.trim());

  if (mode === "elementor") {
    return {
      mode,
      showElementor: hasElementor,
      showClassic: !hasElementor && hasClassic,
    };
  }
  return {
    mode,
    showElementor: false,
    showClassic: hasClassic,
  };
}
