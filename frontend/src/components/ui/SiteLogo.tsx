import { CWS_LOGO_ASPECT, CWS_LOGO_PATH, logoDimensions, resolveLogoSrc } from "@/lib/site-brand";

type SiteLogoVariant = "header" | "footer" | "preloader";

const HEIGHTS: Record<SiteLogoVariant, number> = {
  header: 60,
  footer: 60,
  preloader: 80,
};

interface SiteLogoProps {
  variant?: SiteLogoVariant;
  className?: string;
  priority?: boolean;
  src?: string;
}

export function SiteLogo({
  variant = "header",
  className = "",
  priority = false,
  src = CWS_LOGO_PATH,
}: SiteLogoProps) {
  const height = HEIGHTS[variant];
  const { width } = logoDimensions(height);
  const logoSrc = resolveLogoSrc(variant, src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoSrc}
      alt="Creative Web Solutions"
      width={width}
      height={height}
      className={`site-logo site-logo--${variant}${className ? ` ${className}` : ""}`}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
    />
  );
}

export { CWS_LOGO_ASPECT, CWS_LOGO_PATH };
