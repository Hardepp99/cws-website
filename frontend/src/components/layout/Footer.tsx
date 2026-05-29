import Link from "next/link";
import { SiteLogo } from "@/components/ui/SiteLogo";
import { resolveGmbMapsUrl } from "@/lib/gmb/resolve";
import { resolveMenuIconClass } from "@/lib/menu-icon";
import type { MenuItem, SiteSettings } from "@/lib/wordpress/types";

type FooterColumnTone = "company" | "services" | "products" | "neutral";

const LEGAL_LINKS: MenuItem[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
  { label: "Contact Us", href: "/contact" },
];

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", type: "text" as const },
  { id: "visa", icon: "fab fa-cc-visa" },
  { id: "mastercard", icon: "fab fa-cc-mastercard" },
  { id: "amex", icon: "fab fa-cc-amex" },
  { id: "paypal", icon: "fab fa-cc-paypal" },
  { id: "bank", icon: "fas fa-university" },
];

function FooterSectionTitle({
  icon,
  children,
  className = "footer-title",
  dataCustomize,
  tone = "neutral",
}: {
  icon?: string;
  children: string;
  className?: string;
  dataCustomize?: string;
  tone?: FooterColumnTone;
}) {
  return (
    <h4 className={className}>
      {icon ? (
        <span className={`footer-title-icon footer-title-icon--${tone}`} aria-hidden="true">
          <i className={resolveMenuIconClass(icon)} />
        </span>
      ) : null}
      <span className={`footer-title-text footer-title-text--${tone}`} data-customize={dataCustomize}>
        {children}
      </span>
    </h4>
  );
}

function FooterNavLink({ item, tone }: { item: MenuItem; tone: FooterColumnTone }) {
  const iconClass = resolveMenuIconClass(item.icon);
  return (
    <li>
      <Link href={item.href}>
        <span className={`footer-link-icon footer-link-icon--${tone}`} aria-hidden="true">
          <i className={iconClass} />
        </span>
        <span>{item.label}</span>
      </Link>
    </li>
  );
}

function FooterMenuColumn({
  title,
  icon,
  items,
  titleCustomize,
  tone,
}: {
  title: string;
  icon: string;
  items: MenuItem[];
  titleCustomize?: string;
  tone: FooterColumnTone;
}) {
  if (!items.length) return null;

  return (
    <div className={`footer-widget footer-widget--${tone}`}>
      <FooterSectionTitle icon={icon} dataCustomize={titleCustomize} tone={tone}>
        {title}
      </FooterSectionTitle>
      <ul className="footer-links">
        {items.map((item) => (
          <FooterNavLink key={`${item.href}-${item.label}`} item={item} tone={tone} />
        ))}
      </ul>
    </div>
  );
}

interface FooterProps {
  settings: SiteSettings;
  footerMenu: MenuItem[];
  footerServicesMenu: MenuItem[];
  footerProductsMenu: MenuItem[];
}

export function Footer({ settings, footerMenu, footerServicesMenu, footerProductsMenu }: FooterProps) {
  const addressLines = (settings.address ?? "").split("\n").filter((line) => line.trim());
  const gmbMapsUrl = resolveGmbMapsUrl(settings);
  const phone = settings.phone ?? "";
  const email = settings.email ?? "";
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-content">
            <div className="row g-4 g-lg-5">
              <div className="col-lg-4 col-md-6">
                <div className="footer-widget footer-widget--brand">
                  <Link href="/" className="footer-logo">
                    <SiteLogo
                      variant="footer"
                      src={settings.logoWhiteUrl || settings.logoUrl}
                      className="footer-logo-img"
                      dataCustomize="logo-footer"
                    />
                  </Link>
                  {settings.footerText?.trim() ? (
                    <p className="footer-desc" data-customize="footer-text">
                      {settings.footerText}
                    </p>
                  ) : null}
                  <FooterSectionTitle
                    icon="fa-headset"
                    className="footer-title footer-title--sub"
                    tone="neutral"
                  >
                    Contact
                  </FooterSectionTitle>
                  <ul className="footer-contact">
                    {addressLines.length > 0 ? (
                      <li className="footer-contact__item footer-contact__item--address">
                        <a
                          href={gmbMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="footer-contact__row"
                          aria-label="View Creative Web Solutions on Google Maps"
                        >
                          <span className="footer-contact-icon" aria-hidden="true">
                            <i className="fas fa-map-marker-alt" />
                          </span>
                          <span className="footer-contact__text" data-customize="address-footer">
                            {addressLines.map((line, i) => (
                              <span key={i}>
                                {line}
                                {i < addressLines.length - 1 ? <br /> : null}
                              </span>
                            ))}
                          </span>
                        </a>
                      </li>
                    ) : null}
                    {phone ? (
                      <li className="footer-contact__item">
                        <a href={`tel:${phone.replace(/\s/g, "")}`} className="footer-contact__row">
                          <span className="footer-contact-icon" aria-hidden="true">
                            <i className="fas fa-phone-alt" />
                          </span>
                          <span className="footer-contact__text" data-customize="phone">
                            {phone}
                          </span>
                        </a>
                      </li>
                    ) : null}
                    {email ? (
                      <li className="footer-contact__item">
                        <a href={`mailto:${email}`} className="footer-contact__row">
                          <span className="footer-contact-icon" aria-hidden="true">
                            <i className="fas fa-envelope" />
                          </span>
                          <span className="footer-contact__text" data-customize="email">
                            {email}
                          </span>
                        </a>
                      </li>
                    ) : null}
                  </ul>
                  <div className="footer-social">
                    {settings.facebook ? (
                      <a
                        href={settings.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="footer-social-link"
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
                        aria-label="LinkedIn"
                        className="footer-social-link"
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
                        aria-label="Instagram"
                        className="footer-social-link"
                        data-customize="social-instagram"
                      >
                        <i className="fab fa-instagram" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-6 col-6">
                <FooterMenuColumn
                  title={settings.footerCompanyTitle || "Company"}
                  icon="fa-building"
                  items={footerMenu}
                  titleCustomize="footer-company-title"
                  tone="company"
                />
              </div>

              <div className="col-lg-3 col-md-6 col-6">
                <FooterMenuColumn
                  title={settings.footerServicesTitle || "Services"}
                  icon="fa-layer-group"
                  items={footerServicesMenu}
                  titleCustomize="footer-services-title"
                  tone="services"
                />
              </div>

              <div className="col-lg-3 col-md-12">
                <FooterMenuColumn
                  title={settings.footerProductsTitle || "Products & Training"}
                  icon="fa-graduation-cap"
                  items={footerProductsMenu}
                  titleCustomize="footer-products-title"
                  tone="products"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bar">
          <div className="footer-content footer-bar-inner">
            <p className="footer-copyright">
              &copy; {year} Creative Web Solutions. All rights reserved.
            </p>
            <nav className="footer-bar-nav" aria-label="Legal">
              <ul className="footer-bottom-links">
                {LEGAL_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="footer-payments">
              <span className="footer-payments-label">Payment accepted</span>
              <div className="footer-payments-icons" aria-label="Accepted payment methods">
                {PAYMENT_METHODS.map((method) =>
                  method.type === "text" ? (
                    <span key={method.id} className="footer-payment-badge footer-payment-badge--text">
                      {method.label}
                    </span>
                  ) : (
                    <span key={method.id} className="footer-payment-badge" title={method.id}>
                      <i className={method.icon} aria-hidden="true" />
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
