import { SiteLogo } from "@/components/ui/SiteLogo";

/** Brand tiles mirror logo icon colors: royal blue, navy, slate grey */
const BRAND_TILES = [
  "preloader-premium__tile--blue",
  "preloader-premium__tile--navy",
  "preloader-premium__tile--slate",
] as const;

export function Preloader() {
  return (
    <div className="preloader preloader-premium" id="preloader" aria-busy="true" aria-label="Loading">
      <div className="preloader-premium__loader">
        <div className="preloader-premium__brand" aria-hidden="true">
          <div className="preloader-premium__tiles">
            {BRAND_TILES.map((tileClass) => (
              <span key={tileClass} className={`preloader-premium__tile ${tileClass}`} />
            ))}
          </div>
          <div className="preloader-premium__logo-plate">
            <SiteLogo variant="preloader" className="loader-logo preloader-premium__logo" priority />
          </div>
        </div>

        <div className="preloader-premium__bar" aria-hidden="true">
          <div className="preloader-premium__bar-fill" />
        </div>
        <p className="preloader-premium__label">Loading Creative Web Solutions…</p>
      </div>
    </div>
  );
}
