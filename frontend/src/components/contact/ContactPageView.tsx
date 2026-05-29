"use client";

import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { resolveGmbMapsUrl } from "@/lib/gmb/resolve";
import type { SiteSettings } from "@/lib/wordpress/types";

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

function whatsAppHref(phone: string): string {
  const d = digitsOnly(phone);
  const num = d.length === 10 ? `91${d}` : d;
  if (!num) return "";
  return `https://wa.me/${num}?text=${encodeURIComponent("Hi, I'd like to discuss a project with Creative Web Solutions.")}`;
}

function formatAddress(address: string): string[] {
  return address.split("\n").map((l) => l.trim()).filter(Boolean);
}

type ContactPageViewProps = {
  title: string;
  intro: string;
  settings: SiteSettings;
  mapsEmbedUrl: string;
  placeName: string;
  rating?: string;
  reviewCount?: string;
};

export function ContactPageView({
  title,
  intro,
  settings,
  mapsEmbedUrl,
  placeName,
  rating = "4.9",
  reviewCount = "120+",
}: ContactPageViewProps) {
  const addressLines = formatAddress(settings.address);
  const gmbMapsUrl = resolveGmbMapsUrl(settings);
  const waHref = whatsAppHref(settings.phone);
  const telHref = settings.phone ? `tel:${settings.phone.replace(/\s/g, "")}` : "";
  const mailHref = settings.email ? `mailto:${settings.email}` : "";

  return (
    <div className="contact-page">
      <section className="contact-page-hero">
        <div className="corp-container">
          <Reveal variant="fade-up" trigger="load">
            <p className="contact-page-hero__eyebrow">
              <i className="fas fa-paper-plane" aria-hidden="true" /> Get in touch
            </p>
            <h1 className="contact-page-hero__title">{title}</h1>
            <p className="contact-page-hero__lead">{intro}</p>
          </Reveal>
        </div>
        <div className="contact-page-hero__glow" aria-hidden="true" />
      </section>

      <section className="contact-page-main" aria-labelledby="contact-main-heading">
        <div className="corp-container">
          <h2 id="contact-main-heading" className="visually-hidden">
            Contact details and enquiry form
          </h2>
          <div className="row g-4 g-xl-5 align-items-stretch">
            <div className="col-lg-5">
              <Reveal variant="slide-left" delay={80}>
                <div className="contact-details-panel">
                  <h3 className="contact-details-panel__title">Contact details</h3>
                  <p className="contact-details-panel__sub">
                    Call, email, or visit our Zirakpur office — we reply within one business day.
                  </p>

                  <ul className="contact-details-list">
                    {telHref ? (
                      <li className="contact-details-card contact-details-card--phone">
                        <span className="contact-details-card__icon" aria-hidden="true">
                          <i className="fas fa-phone-alt" />
                        </span>
                        <div>
                          <span className="contact-details-card__label">Phone &amp; WhatsApp</span>
                          <a href={telHref} className="contact-details-card__value">
                            {settings.phone}
                          </a>
                          {waHref ? (
                            <a
                              href={waHref}
                              className="contact-details-card__link"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fab fa-whatsapp" aria-hidden="true" /> Chat on WhatsApp
                            </a>
                          ) : null}
                        </div>
                      </li>
                    ) : null}

                    {mailHref ? (
                      <li className="contact-details-card contact-details-card--email">
                        <span className="contact-details-card__icon" aria-hidden="true">
                          <i className="fas fa-envelope" />
                        </span>
                        <div>
                          <span className="contact-details-card__label">Email</span>
                          <a href={mailHref} className="contact-details-card__value">
                            {settings.email}
                          </a>
                        </div>
                      </li>
                    ) : null}

                    {addressLines.length > 0 ? (
                      <li className="contact-details-card contact-details-card--address">
                        <span className="contact-details-card__icon" aria-hidden="true">
                          <i className="fas fa-map-marker-alt" />
                        </span>
                        <div>
                          <span className="contact-details-card__label">Office address</span>
                          <a
                            href={gmbMapsUrl}
                            className="contact-details-card__address-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View Creative Web Solutions on Google Maps"
                          >
                            <address className="contact-details-card__address">
                              {addressLines.map((line) => (
                                <span key={line}>{line}</span>
                              ))}
                            </address>
                          </a>
                        </div>
                      </li>
                    ) : null}

                    <li className="contact-details-card contact-details-card--hours">
                      <span className="contact-details-card__icon" aria-hidden="true">
                        <i className="fas fa-clock" />
                      </span>
                      <div>
                        <span className="contact-details-card__label">Office hours</span>
                        <p className="contact-details-card__value contact-details-card__value--plain">
                          Mon – Sat · 10:00 AM – 7:00 PM IST
                        </p>
                      </div>
                    </li>
                  </ul>

                  <div className="contact-gmb-badge">
                    <span className="contact-gmb-badge__stars" aria-hidden="true">
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                    </span>
                    <span>
                      <strong>{rating}</strong> on Google · {reviewCount} reviews
                    </span>
                    <span className="contact-gmb-badge__place">{placeName}</span>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="col-lg-7">
              <Reveal variant="slide-right" delay={140}>
                <div className="contact-form-panel">
                  <h3 className="contact-form-panel__title">Send us a message</h3>
                  <p className="contact-form-panel__sub">
                    Tell us about your website, app, or marketing goals. Prefer a package quote? Use{" "}
                    <a href="#ask-price">Ask price</a> in the menu.
                  </p>
                  <ContactForm />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-page-map" aria-labelledby="contact-map-heading">
        <div className="corp-container">
          <Reveal variant="fade-up" delay={60}>
            <div className="contact-page-map__head">
              <h2 id="contact-map-heading" className="contact-page-map__title">
                Find our office
              </h2>
              <p className="contact-page-map__sub">
                {placeName} — Chandigarh Tricity. Parking available on VIP Road.
              </p>
              <Link
                href={gmbMapsUrl}
                className="btn btn-outline-custom btn-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-map-marker-alt" aria-hidden="true" /> View on Google Maps
              </Link>
            </div>
          </Reveal>
        </div>
        <Reveal variant="zoom-in" delay={120}>
          <div className="contact-page-map__frame">
            <iframe
              src={mapsEmbedUrl}
              title={`Map — ${placeName}`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
