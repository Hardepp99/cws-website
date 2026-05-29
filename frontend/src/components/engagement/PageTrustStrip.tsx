"use client";

import { useGmbMapsUrl } from "@/components/layout/SiteMapsContext";
import { Reveal } from "@/components/ui/Reveal";

const TRUST_ITEMS = [
  { icon: "fas fa-star", label: "4.9★ on Google", sub: "120+ reviews" },
  { icon: "fas fa-map-marker-alt", label: "Zirakpur office", sub: "Chandigarh Tricity", maps: true },
  { icon: "fas fa-clock", label: "15+ years", sub: "Web & software delivery" },
  { icon: "fas fa-headset", label: "Post-launch support", sub: "Clear SLAs on request" },
] as const;

/** Compact trust row for inner pages — matches corporate theme. */
export function PageTrustStrip() {
  const gmbMapsUrl = useGmbMapsUrl();

  return (
    <Reveal variant="fade-up">
      <section className="page-trust-strip" aria-label="Why clients choose us">
        <div className="corp-container">
          <ul className="page-trust-strip__list">
            {TRUST_ITEMS.map((item) => (
              <li key={item.label} className="page-trust-strip__item">
                <span className="page-trust-strip__icon" aria-hidden="true">
                  <i className={item.icon} />
                </span>
                {"maps" in item && item.maps ? (
                  <a
                    href={gmbMapsUrl}
                    className="page-trust-strip__text page-trust-strip__text--link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong>{item.label}</strong>
                    <span>{item.sub}</span>
                  </a>
                ) : (
                  <span className="page-trust-strip__text">
                    <strong>{item.label}</strong>
                    <span>{item.sub}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Reveal>
  );
}
