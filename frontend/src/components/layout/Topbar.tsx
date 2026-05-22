import type { SiteSettings } from "@/lib/wordpress/types";
import { TopbarBackground } from "./TopbarBackground";

interface TopbarProps {
  settings: SiteSettings;
}

export function Topbar({ settings }: TopbarProps) {
  const phone = settings.phone ?? "";
  const email = settings.email ?? "";
  const addressLine = (settings.address ?? "").replace(/\n+/g, ", ").trim();

  return (
    <div className="topbar" id="topbar">
      <TopbarBackground />
      <div className="container topbar-content">
        <div className="topbar-inner">
          <div className="topbar-contact">
            {phone ? (
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="topbar-link">
                <i className="fas fa-phone-alt" aria-hidden="true" />
                <span>{phone}</span>
              </a>
            ) : null}
            {email ? (
              <a href={`mailto:${email}`} className="topbar-link">
                <i className="fas fa-envelope" aria-hidden="true" />
                <span className="topbar-email">{email}</span>
              </a>
            ) : null}
          </div>

          {addressLine ? (
            <p className="topbar-address" title={addressLine}>
              <i className="fas fa-map-marker-alt" aria-hidden="true" />
              <span>{addressLine}</span>
            </p>
          ) : null}

          <div className="topbar-social">
            {settings.facebook ? (
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                <i className="fab fa-facebook-f" />
              </a>
            ) : null}
            {settings.linkedin ? (
              <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in" />
              </a>
            ) : null}
            {settings.instagram ? (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
