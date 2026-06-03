/** Neutral brand tokens — public site uses fixed CSS, not admin color pickers. */
export const CWS_LOGO_PATH = "/assets/images/cws-logo.svg";
export const CWS_LOGO_LIGHT_PATH = "/assets/images/cws-logo-light.svg";

/** viewBox 450 × 344.37 */
export const CWS_LOGO_ASPECT = 450 / 344.37;

export const CWS_BRAND = {
  navy: "#012174",
  royal: "#0A78ED",
  blue: "#0A78ED",
  green: "#34C759",
  greenDark: "#248A3D",
  orange: "#FF9500",
  orangeLight: "#FFB340",
  slate: "#86868B",
  logoGrey: "#6E6E73",
  ink: "#1D1D1F",
  gradient: "linear-gradient(180deg, #FAFAFA 0%, #F5F5F7 100%)",
  gradientCta: "linear-gradient(180deg, #333336 0%, #1D1D1F 100%)",
  gradientGreen: "linear-gradient(180deg, #333336 0%, #1D1D1F 100%)",
} as const;

/** Lighter tints for dark backgrounds (footer) */
export const CWS_BRAND_LIGHT = {
  navy: "#F5F5F7",
  royal: "#E8E8ED",
  blue: "#2997FF",
  slate: "#AEAEB2",
  ink: "#D2D2D7",
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
