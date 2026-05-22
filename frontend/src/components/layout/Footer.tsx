import Link from "next/link";
import { SiteLogo } from "@/components/ui/SiteLogo";
import type { HeroHeadlineTone } from "@/components/sections/HeroHeadline";
import type { MenuItem, SiteSettings } from "@/lib/wordpress/types";

const FOOTER_TONES: HeroHeadlineTone[] = ["blue", "royal", "green", "orange", "slate"];

const LEGAL_LINKS: MenuItem[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
  { label: "Contact Us", href: "/contact" },
];

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", type: "text" as const },
  { id: "visa", icon: "fab fa-cc-visa", className: "footer-payment-badge--visa" },
  { id: "mastercard", icon: "fab fa-cc-mastercard", className: "footer-payment-badge--mastercard" },
  { id: "amex", icon: "fab fa-cc-amex", className: "footer-payment-badge--amex" },
  { id: "paypal", icon: "fab fa-cc-paypal", className: "footer-payment-badge--paypal" },
  { id: "bank", icon: "fas fa-university", className: "footer-payment-badge--bank" },
];

function footerTone(index: number): HeroHeadlineTone {
  return FOOTER_TONES[index % FOOTER_TONES.length];
}

function FooterMulticolorText({ text, className }: { text?: string | null; className?: string }) {
  const words = (text ?? "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return null;

  return (
    <p className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          {index > 0 ? " " : null}
          <span className={`footer-tone-word footer-tone-word--${footerTone(index)}`}>{word}</span>
        </span>
      ))}
    </p>
  );
}

function FooterSectionTitle({
  icon,
  iconTone,
  children,
  className = "footer-title",
  dataCustomize,
}: {
  icon?: string;
  iconTone: HeroHeadlineTone;
  children: string;
  className?: string;
  dataCustomize?: string;
}) {
  const words = children.trim().split(/\s+/).filter(Boolean);

  return (
    <h4 className={className}>
      {icon ? (
        <span className={`footer-title-icon footer-title-icon--${iconTone}`} aria-hidden="true">
          <i className={`fas ${icon}`} />
        </span>
      ) : null}
      <span className="footer-title-text" data-customize={dataCustomize}>
        {words.map((word, index) => (
          <span key={`${word}-${index}`}>
            {index > 0 ? " " : null}
            <span className={`footer-tone-word footer-tone-word--${footerTone(index)}`}>{word}</span>
          </span>
        ))}
      </span>
    </h4>
  );
}

function FooterNavLink({
  item,
  toneIndex,
}: {
  item: MenuItem;
  toneIndex: number;
}) {
  const tone = footerTone(toneIndex);
  const icon = item.icon || "fa-link";
  const iconClass = icon.startsWith("fa-brands") || icon.startsWith("fab ") ? icon : `fas ${icon.replace(/^fas\s+/, "")}`;

  return (
    <li>
      <Link href={item.href}>
        <span className={`footer-link-icon footer-link-icon--${tone}`} aria-hidden="true">
          <i className={iconClass.startsWith("fab") ? iconClass : iconClass} />
        </span>
        <span>{item.label}</span>
      </Link>
    </li>
  );
}

function FooterMenuColumn({
  title,
  icon,
  iconTone,
  items,
  titleCustomize,
}: {
  title: string;
  icon: string;
  iconTone: HeroHeadlineTone;
  items: MenuItem[];
  titleCustomize?: string;
}) {
  if (!items.length) return null;

  return (
    <div className="footer-widget">
      <FooterSectionTitle icon={icon} iconTone={iconTone} dataCustomize={titleCustomize}>
        {title}
      </FooterSectionTitle>
      <ul className="footer-links">
        {items.map((item, index) => (
          <FooterNavLink key={`${item.href}-${item.label}`} item={item} toneIndex={index} />
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
  const phone = settings.phone ?? "";
  const email = settings.email ?? "";
  const year = new Date().getFullYear();
  const footerPages = footerMenu.length > 0 ? footerMenu : LEGAL_LINKS;

  return (
    <footer className="footer">
      <div className="footer-pages-bar">
        <div className="container footer-content">
          <nav aria-label="Site pages">
            <ul className="footer-pages-list">
              {footerPages.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="footer-top">
        <div className="container footer-content">
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
                <div data-customize="footer-text">
                  <FooterMulticolorText text={settings.footerText} className="footer-desc footer-desc--multicolor" />
                </div>
                {addressLines.length > 0 ? (
                  <div className="footer-address">
                    <span className="footer-contact-icon footer-contact-icon--orange" aria-hidden="true">
                      <i className="fas fa-map-marker-alt" />
                    </span>
                    <span data-customize="address-footer">
                      {addressLines.map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < addressLines.length - 1 ? <br /> : null}
                        </span>
                      ))}
                    </span>
                  </div>
                ) : null}
                <FooterSectionTitle icon="fa-headset" iconTone="green" className="footer-title footer-title--sub">
                  Contact
                </FooterSectionTitle>
                <ul className="footer-contact">
                  {phone ? (
                    <li>
                      <span className="footer-contact-icon footer-contact-icon--green" aria-hidden="true">
                        <i className="fas fa-phone-alt" />
                      </span>
                      <a href={`tel:${phone.replace(/\s/g, "")}`}>
                        <span data-customize="phone">{phone}</span>
                      </a>
                    </li>
                  ) : null}
                  {email ? (
                    <li>
                      <span className="footer-contact-icon footer-contact-icon--blue" aria-hidden="true">
                        <i className="fas fa-envelope" />
                      </span>
                      <a href={`mailto:${email}`}>
                        <span data-customize="email">{email}</span>
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
                      className="footer-social-link footer-social-link--facebook"
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
                      className="footer-social-link footer-social-link--linkedin"
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
                      className="footer-social-link footer-social-link--instagram"
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
                iconTone="royal"
                items={footerMenu}
                titleCustomize="footer-company-title"
              />
            </div>

            <div className="col-lg-3 col-md-6 col-6">
              <FooterMenuColumn
                title={settings.footerServicesTitle || "Services"}
                icon="fa-layer-group"
                iconTone="blue"
                items={footerServicesMenu}
                titleCustomize="footer-services-title"
              />
            </div>

            <div className="col-lg-3 col-md-12">
              <FooterMenuColumn
                title={settings.footerProductsTitle || "Products & Training"}
                icon="fa-graduation-cap"
                iconTone="orange"
                items={footerProductsMenu}
                titleCustomize="footer-products-title"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-content">
          <p className="footer-copyright">
            &copy; {year}{" "}
            <span className="footer-tone-word footer-tone-word--blue">Creative</span>{" "}
            <span className="footer-tone-word footer-tone-word--green">Web</span>{" "}
            <span className="footer-tone-word footer-tone-word--orange">Solutions</span>
            .{" "}
            <span className="footer-tone-word footer-tone-word--slate">All</span>{" "}
            <span className="footer-tone-word footer-tone-word--royal">Rights</span>{" "}
            <span className="footer-tone-word footer-tone-word--blue">Reserved</span>.
          </p>
        </div>
      </div>

      <div className="footer-legal-strip">
        <div className="container footer-content footer-legal-strip-inner">
          <nav aria-label="Legal">
            <ul className="footer-bottom-links">
              {LEGAL_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer-payments">
            <p className="footer-payments-label">Payment accepted</p>
            <div className="footer-payments-icons" aria-label="Accepted payment methods">
              {PAYMENT_METHODS.map((method) =>
                method.type === "text" ? (
                  <span
                    key={method.id}
                    className="footer-payment-badge footer-payment-badge--text footer-payment-badge--upi"
                  >
                    {method.label}
                  </span>
                ) : (
                  <span
                    key={method.id}
                    className={`footer-payment-badge ${method.className}`}
                    title={method.id}
                  >
                    <i className={method.icon} aria-hidden="true" />
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
