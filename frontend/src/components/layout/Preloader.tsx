import { SiteLogo } from "@/components/ui/SiteLogo";

export function Preloader() {
  return (
    <div className="preloader" id="preloader">
      <div className="loader">
        <SiteLogo variant="preloader" className="loader-logo" priority />
        <div className="loader-inner" />
      </div>
    </div>
  );
}
