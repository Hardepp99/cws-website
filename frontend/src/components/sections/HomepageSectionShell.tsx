import type { SectionTheme } from "@/lib/homepage/section-appearance";

interface HomepageSectionShellProps {
  theme: SectionTheme;
  backdropUrl: string;
  backdropStrength: number;
  layout: string;
  children: React.ReactNode;
}

/** Alternating light/dark band with optional full-bleed backdrop image. */
export function HomepageSectionShell({
  theme,
  backdropUrl,
  backdropStrength,
  layout,
  children,
}: HomepageSectionShellProps) {
  const photoOpacity = Math.min(0.55, 0.12 + backdropStrength / 200);

  return (
    <div
      className={`home-section-band home-section-band--${theme}`}
      data-section-theme={theme}
      data-layout={layout}
    >
      {backdropUrl ? (
        <>
          <div
            className="home-section-band__backdrop"
            style={{
              backgroundImage: `url("${backdropUrl.replace(/"/g, "%22")}")`,
              opacity: photoOpacity,
            }}
            aria-hidden="true"
          />
          <div
            className="home-section-band__scrim"
            style={{ opacity: 0.55 + backdropStrength / 250 }}
            aria-hidden="true"
          />
        </>
      ) : null}
      <div className="home-section-band__content">{children}</div>
    </div>
  );
}
