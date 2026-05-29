"use client";

import Image from "next/image";
import Link from "next/link";
import { HeroWebBuilderIllustration } from "@/components/illustrations/HeroWebBuilderIllustration";
import { CtaLink } from "@/components/engagement/CtaLink";
import type { GmbConfig } from "@/lib/gmb/types";
import {
  resolveHeroGmbCount,
  resolveHeroGmbRating,
  resolveHeroGmbReviews,
} from "@/lib/gmb/resolve";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Reveal } from "@/components/ui/Reveal";
import "swiper/css";
import { ServicesMarqueeStrip, type MarqueeItem } from "@/components/sections/ServicesMarqueeStrip";
import type { HomepageSection } from "@/lib/wordpress/types";
import type { GmbReviewRecord } from "@/lib/gmb/types";

const DEFAULT_PERSON_IMAGE = "/assets/images/hero2.png";

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

function StarRow({ rating }: { rating: number }) {
  const full = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <span className="home-hero-gmb__stars" aria-label={`${full} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={i < full ? "fas fa-star" : "far fa-star"} aria-hidden="true" />
      ))}
    </span>
  );
}

function GmbReviewsBlock({
  reviews,
  rating,
  countLabel,
  mapsUrl,
  placeName,
}: {
  reviews: GmbReviewRecord[];
  rating: number;
  countLabel: string;
  mapsUrl: string;
  placeName: string;
}) {
  return (
    <div className="home-hero-gmb">
      <div className="home-hero-gmb__header">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="home-hero-gmb__google-link"
          aria-label={`${placeName} on Google Maps`}
        >
          <span className="home-hero-gmb__google" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" role="img">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </span>
          <span className="home-hero-gmb__score">{rating.toFixed(1)}</span>
          <StarRow rating={rating} />
        </a>
        <span className="home-hero-gmb__count">
          {countLabel} Google reviews ·{" "}
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="home-hero-gmb__maps-link">
            {placeName}
          </a>
        </span>
      </div>

      <Swiper
        className="home-hero-gmb__carousel"
        modules={[Autoplay]}
        spaceBetween={12}
        slidesPerView={1.12}
        breakpoints={{
          480: { slidesPerView: 1.45, spaceBetween: 12 },
          640: { slidesPerView: 1.85, spaceBetween: 14 },
          992: { slidesPerView: 2.15, spaceBetween: 14 },
          1200: { slidesPerView: 2.35, spaceBetween: 16 },
        }}
        autoplay={{ delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: true }}
        loop={reviews.length > 2}
        speed={600}
        grabCursor
      >
        {reviews.map((r, i) => (
          <SwiperSlide key={r.id || `${r.author}-${i}`} className="home-hero-gmb__slide">
            <article
              className="home-hero-gmb__card"
              style={{
                ["--tilt" as string]: `${(i % 2 === 0 ? -1 : 1) * (0.35 + (i % 3) * 0.2)}deg`,
              }}
            >
              <div className="home-hero-gmb__card-top">
                <strong>{r.author}</strong>
                <StarRow rating={r.rating ?? 5} />
              </div>
              <p>{r.text}</p>
              {r.ago ? <span className="home-hero-gmb__ago">{r.ago}</span> : null}
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export function HeroSlider({
  section,
  gmb,
  marqueeItems = [],
}: {
  section: HomepageSection;
  gmb: GmbConfig;
  marqueeItems?: MarqueeItem[];
}) {
  const heroVisual = resolveHeroVisualMode(section);
  const personImageUrl = resolvePersonImageUrl(section);
  const personAlt = String(
    section.personImageAlt ?? section.person_image_alt ?? "Designer building a website",
  );

  const eyebrow = (section.eyebrow as string) || "Creative Web Solutions · Zirakpur";
  const headline =
    (section.headline as string) ||
    "We build websites, mobile apps, and digital marketing that turn visitors into real enquiries.";

  const ctaPrimary = (section.ctaPrimary as { label: string; href: string }) || {
    label: "Get a quote",
    href: "#ask-price",
  };
  const ctaSecondary = (section.ctaSecondary as { label: string; href: string }) || {
    label: "Call now",
    href: "tel:+917015969967",
  };

  const gmbReviews =
    gmb.reviews.filter((r) => r.showOnHomepage !== false).length > 0
      ? gmb.reviews.filter((r) => r.showOnHomepage !== false)
      : resolveHeroGmbReviews(gmb, section);
  const gmbRating = resolveHeroGmbRating(gmb, section);
  const gmbCount = resolveHeroGmbCount(gmb, section);

  return (
    <section className="home-hero" id="home">
      <div className="home-hero__surface">
        <div className="home-hero__inner">
        <div className="corp-container home-hero__grid">
          <div className="home-hero__copy">
            <Reveal variant="fade-in" trigger="load">
              <p className="home-hero__eyebrow">{eyebrow}</p>
            </Reveal>
            <Reveal variant="fade-up" trigger="load" delay={80}>
              <h1 className="home-hero__title">{headline}</h1>
            </Reveal>
            <Reveal variant="fade-up" trigger="load" delay={160}>
              <GmbReviewsBlock
                reviews={gmbReviews}
                rating={gmbRating}
                countLabel={gmbCount}
                mapsUrl={gmb.mapsUrl}
                placeName={gmb.placeName}
              />
            </Reveal>
            <Reveal variant="fade-up" trigger="load" delay={240}>
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

          <Reveal variant="zoom-in" trigger="load" delay={120} className="home-hero__photo-wrap">
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
        {marqueeItems.length > 0 ? (
          <ServicesMarqueeStrip items={marqueeItems} className="home-hero__marquee" />
        ) : null}
      </div>
    </section>
  );
}
