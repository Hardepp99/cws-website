import { resolveGmbMapsUrl } from "@/lib/gmb/resolve";
import type { SiteSettings } from "@/lib/wordpress/types";
import { TopbarBackground } from "./TopbarBackground";

interface TopbarProps {
  settings: SiteSettings;
}

export function Topbar({ settings }: TopbarProps) {
  const phone = settings.phone ?? "";
  const email = settings.email ?? "";
  const addressLine = (settings.address ?? "").replace(/\n+/g, ", ").trim();
  const gmbMapsUrl = resolveGmbMapsUrl(settings);

  return (
    <div className="topbar topbar--premium" id="topbar">
      <TopbarBackground premium />
      <div className="topbar-premium__shine" aria-hidden="true" />
      <div className="container topbar-content">
        <div className="topbar-inner">
          <div className="topbar-row topbar-row--contact">
            {email ? (
              <a
                href={`mailto:${email}`}
                className="topbar-link topbar-link--email"
                data-customize-email-wrap=""
              >
                <span className="topbar-link__icon" aria-hidden="true">
                  <i className="fas fa-envelope" />
                </span>
                <span className="topbar-link__text topbar-email" data-customize="email">
                  {email}
                </span>
              </a>
            ) : null}
            {phone ? (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="topbar-link topbar-link--phone"
                data-customize-phone-wrap=""
              >
                <span className="topbar-link__icon" aria-hidden="true">
                  <i className="fas fa-phone-alt" />
                </span>
                <span className="topbar-link__text" data-customize="phone">
                  {phone}
                </span>
              </a>
            ) : null}
          </div>

          {addressLine ? (
            <a
              href={gmbMapsUrl}
              className="topbar-link topbar-link--address"
              title={addressLine}
              target="_blank"
              rel="noopener noreferrer"
              data-customize-address-topbar-wrap=""
              aria-label="View office on Google Maps"
            >
              <span className="topbar-link__icon" aria-hidden="true">
                <i className="fas fa-map-marker-alt" />
              </span>
              <span className="topbar-link__text" data-customize="address-topbar">
                {addressLine}
              </span>
            </a>
          ) : null}

          <div className="topbar-social">
            {settings.facebook ? (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Facebook"
                data-customize="social-facebook"
              >
                <i className="fab fa-facebook-f" />
              </a>
            ) : null}
            {settings.linkedin ? (
              <a
                href={settings.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn"
                data-customize="social-linkedin"
              >
                <i className="fab fa-linkedin-in" />
              </a>
            ) : null}
            {settings.instagram ? (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram"
                data-customize="social-instagram"
              >
                <i className="fab fa-instagram" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
