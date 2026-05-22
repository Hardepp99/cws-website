/** Brand assets and colors — lucky palette (70% blue / 20% green / 10% orange) */
export const CWS_LOGO_PATH = "/assets/images/cws-logo.svg";
export const CWS_LOGO_LIGHT_PATH = "/assets/images/cws-logo-light.svg";

/** viewBox 450 × 344.37 */
export const CWS_LOGO_ASPECT = 450 / 344.37;

export const CWS_BRAND = {
  navy: "#0A1E5E",
  royal: "#0057FF",
  blue: "#0088FF",
  green: "#00A86B",
  greenDark: "#008C5E",
  orange: "#FF7A00",
  orangeLight: "#FF8C1A",
  slate: "#64748B",
  logoGrey: "#4E5051",
  ink: "#1A2D4D",
  gradient: "linear-gradient(135deg, #0088FF 0%, #0057FF 55%, #0A1E5E 100%)",
  gradientCta: "linear-gradient(135deg, #0057FF 0%, #0088FF 100%)",
  gradientGreen: "linear-gradient(135deg, #00A86B 0%, #008C5E 100%)",
} as const;

/** Lighter tints for dark backgrounds (footer) */
export const CWS_BRAND_LIGHT = {
  navy: "#7EB2FF",
  royal: "#8BC4FF",
  blue: "#8FD4FF",
  slate: "#C5CAD1",
  ink: "#9AAFBF",
} as const;

export function logoDimensions(height: number) {
  return {
    height,
    width: Math.round(height * CWS_LOGO_ASPECT),
  };
}

export function resolveLogoSrc(
  variant: "header" | "footer" | "preloader",
  src?: string | null
): string {
  const resolved = (src ?? "").trim() || CWS_LOGO_PATH;
  if (variant !== "footer") return resolved;

  const isDefaultLogo =
    resolved === CWS_LOGO_PATH ||
    resolved.endsWith("/cws-logo.svg") ||
    resolved.endsWith("\\cws-logo.svg");

  return isDefaultLogo ? CWS_LOGO_LIGHT_PATH : resolved;
}
