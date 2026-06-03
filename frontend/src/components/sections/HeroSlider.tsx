"use client";

import Image from "next/image";
import Link from "next/link";
import { HeroWebBuilderIllustration } from "@/components/illustrations/HeroWebBuilderIllustration";
import { CtaLink } from "@/components/engagement/CtaLink";
import { HeroMulticolorLead } from "@/components/ui/HeroMulticolorLead";
import { Reveal } from "@/components/ui/Reveal";
import { HeroStatsCounters } from "@/components/sections/HeroStatsCounters";
import { ServicesMarqueeRail } from "@/components/sections/ServicesMarqueeRail";
import type { MarqueeItem } from "@/components/sections/ServicesMarqueeStrip";
import {
  heroShowsTaglineOnly,
  resolveHeroHeadline,
  resolveHeroTagline,
} from "@/lib/homepage/hero-copy";
import type { HomepageSection } from "@/lib/wordpress/types";

const DEFAULT_PERSON_IMAGE = "/assets/images/hero2.png";
const CONTACT_FORM_HREF = "/contact#contact-form";

function resolveHeroVisualMode(section: HomepageSection): "svg" | "photo" {
  const raw = String(section.heroVisual ?? section.hero_visual ?? "svg").toLowerCase();
  return raw === "photo" || raw === "image" ? "photo" : "svg";
}

function resolvePersonImageUrl(section: HomepageSection): string {
  const raw = section.personImage ?? section.person_image;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (raw && typeof raw === "object" && "url" in raw) {
    return String((raw as { url?: string }).url ?? "").trim();
  }
  return DEFAULT_PERSON_IMAGE;
}

function resolveHeroCtas(section: HomepageSection) {
  const primary = (section.ctaPrimary as { label?: string; href?: string }) || {};
  const secondary = (section.ctaSecondary as { label?: string; href?: string }) || {};

  const primaryHref = String(primary.href ?? "#ask-price").trim() || "#ask-price";
  let secondaryHref = String(secondary.href ?? CONTACT_FORM_HREF).trim() || CONTACT_FORM_HREF;
  if (secondaryHref.startsWith("tel:")) {
    secondaryHref = CONTACT_FORM_HREF;
  }
  if (secondaryHref === "/contact") {
    secondaryHref = CONTACT_FORM_HREF;
  }

  let secondaryLabel = String(secondary.label ?? "Contact us").trim() || "Contact us";
  if (/^call\b/i.test(secondaryLabel) || secondaryLabel.toLowerCase().includes("call now")) {
    secondaryLabel = "Contact us";
  }

  return {
    primary: {
      label: String(primary.label ?? "Book consultation").trim() || "Book consultation",
      href: primaryHref,
    },
    secondary: {
      label: secondaryLabel,
      href: secondaryHref,
    },
  };
}

export function HeroSlider({
  section,
  marqueeItems = [],
}: {
  section: HomepageSection;
  marqueeItems?: MarqueeItem[];
}) {
  const heroVisual = resolveHeroVisualMode(section);
  const personImageUrl = resolvePersonImageUrl(section);
  const personAlt = String(
    section.personImageAlt ?? section.person_image_alt ?? "Designer building a website",
  );

  const headline = resolveHeroHeadline(section);
  const tagline = resolveHeroTagline(section);
  const taglineOnly = heroShowsTaglineOnly(section);

  const { primary: ctaPrimary, secondary: ctaSecondary } = resolveHeroCtas(section);

  return (
    <section
      className={`home-hero home-hero--premium${marqueeItems.length > 0 ? " has-hero-tray" : ""}`}
      id="home"
    >
      <div className="home-hero__ambient" aria-hidden="true">
        <div className="home-hero__mesh" />
        <div className="home-hero__vignette" />
        <div className="home-hero__stars" />
        <div className="home-hero__halo" />
        <div className="home-hero__bokeh">
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i} className="home-hero__bokeh-dot" />
          ))}
        </div>
        <span className="home-hero__orb home-hero__orb--blue" />
        <span className="home-hero__orb home-hero__orb--violet" />
        <span className="home-hero__orb home-hero__orb--cyan" />
        <span className="home-hero__orb home-hero__orb--magenta" />
        <span className="home-hero__orb home-hero__orb--navy" />
      </div>
      <div className="home-hero__surface">
        <div className="home-hero__inner">
          <div className="corp-container home-hero__grid home-hero__banner">
            <div className="home-hero__copy">
              {taglineOnly ? (
                <Reveal variant="fade-up" trigger="load">
                  <h1 className="home-hero__title home-hero__title--tagline home-hero__lead--multicolor">
                    <HeroMulticolorLead text={tagline} />
                  </h1>
                </Reveal>
              ) : (
                <>
                  <Reveal variant="fade-up" trigger="load">
                    <h1 className="home-hero__title">{headline}</h1>
                  </Reveal>
                  <Reveal variant="fade-up" trigger="load">
                    <p className="home-hero__lead home-hero__lead--multicolor">
                      <HeroMulticolorLead text={tagline} />
                    </p>
                  </Reveal>
                </>
              )}
              <Reveal variant="fade-up" trigger="load">
                <div className="home-hero__actions">
                  <CtaLink href={ctaPrimary.href} className="home-hero__btn home-hero__btn--primary">
                    {ctaPrimary.label}
                  </CtaLink>
                  <Link href={ctaSecondary.href} className="home-hero__btn home-hero__btn--ghost">
                    {ctaSecondary.label}
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal variant="zoom-in" trigger="load" className="home-hero__photo-wrap">
              {heroVisual === "svg" ? (
                <div className="home-hero__visual home-hero__visual--svg" aria-hidden={false}>
                  <HeroWebBuilderIllustration />
                  <span className="visually-hidden">{personAlt}</span>
                </div>
              ) : (
                <div className="home-hero__photo">
                  <Image
                    src={personImageUrl}
                    alt={personAlt}
                    fill
                    priority
                    sizes="(max-width: 991px) 70vw, 380px"
                    className="home-hero__photo-img"
                  />
                </div>
              )}
            </Reveal>
          </div>
        </div>

        <div className="home-hero__bottom-tray">
          <div className="home-hero__stats-tray">
            <div className="corp-container">
              <HeroStatsCounters section={section} />
            </div>
          </div>
          {marqueeItems.length > 0 ? (
            <ServicesMarqueeRail items={marqueeItems} attached tone="light" />
          ) : null}
        </div>
      </div>
    </section>
  );
}
