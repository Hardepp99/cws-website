"use client";

import Link from "next/link";
import { CtaLink } from "@/components/engagement/CtaLink";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Reveal } from "@/components/ui/Reveal";
import { HeroHeadline, resolveHeroHeadlineParts } from "@/components/sections/HeroHeadline";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { filterPublishedItems } from "@/lib/homepage/item-status";
import type { HomepageSection } from "@/lib/wordpress/types";

interface HeroSliderProps {
  section: HomepageSection;
}

export function HeroSlider({ section }: HeroSliderProps) {
  const slidesRaw = filterPublishedItems(
    (section.slides as { image?: { url: string }; status?: string }[]) || []
  );
  const slides = slidesRaw.length
    ? slidesRaw
    : [
        { image: { url: "/assets/images/hero1.png" } },
        { image: { url: "/assets/images/hero2.png" } },
        { image: { url: "/assets/images/hero3.png" } },
      ];
  const stats = filterPublishedItems(
    (section.stats as { icon: string; count: number; label: string; tone?: string; status?: string }[]) || []
  );

  const eyebrow = (section.eyebrow as string) || "Creative Web Solutions";
  const headline = (section.headline as string) || "Digital solutions that help your business scale";
  const headlinePartsRaw = filterPublishedItems(
    (section.headlineParts as { text?: string; tone?: string; status?: string }[]) || []
  );
  const headlineParts = resolveHeroHeadlineParts(
    headlinePartsRaw.length ? headlinePartsRaw : undefined,
    headline
  );
  const subheadline =
    (section.subheadline as string) ||
    "Web development, mobile apps, and digital marketing for companies in India and worldwide — delivered with clarity, quality, and measurable results.";
  const ctaPrimary = (section.ctaPrimary as { label: string; href: string }) || {
    label: "Start a project",
    href: "/contact",
  };
  const ctaSecondary = (section.ctaSecondary as { label: string; href: string }) || {
    label: "Our services",
    href: "/services",
  };

  return (
    <section className="hero-pro" id="home">
      <div className="hero-pro-banner">
        <Reveal variant="zoom-in" trigger="load" className="hero-pro-media-wrap">
          <div className="hero-pro-media" aria-hidden="true">
            <Swiper
              modules={[Autoplay, EffectFade, Pagination]}
              effect="fade"
              loop
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              className="hero-pro-swiper"
            >
              {slides.map((slide, i) => (
                <SwiperSlide key={i}>
                  <div
                    className="hero-pro-slide"
                    style={{
                      backgroundImage: `url(${slide.image?.url || "/assets/images/hero1.png"})`,
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="hero-pro-scrim" />
          </div>
        </Reveal>

        <div className="container hero-pro-content">
          <Reveal variant="fade-in" trigger="load" delay={100}>
            <p className="hero-pro-eyebrow">{eyebrow}</p>
          </Reveal>
          <Reveal variant="fade-up" trigger="load" delay={200}>
            <HeroHeadline parts={headlineParts} />
          </Reveal>
          <Reveal variant="fade-up" trigger="load" delay={320}>
            <p className="hero-pro-lead">{subheadline}</p>
          </Reveal>
          <Reveal variant="slide-right" trigger="load" delay={440}>
            <div className="hero-pro-actions">
              <CtaLink href={ctaPrimary.href} className="btn btn-primary-custom">
                {ctaPrimary.label}
              </CtaLink>
              <Link href={ctaSecondary.href} className="btn btn-outline-light hero-pro-btn-outline">
                {ctaSecondary.label}
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      {stats.length > 0 && (
        <div className="hero-pro-stats-panel">
          <div className="container">
            <div className="hero-pro-stats-grid">
              {stats.map((stat, i) => (
                <article
                  key={stat.label}
                  className={`hero-pro-stat-card${stat.tone ? ` hero-pro-stat-card--${stat.tone}` : ""}`}
                  style={{ animationDelay: `${0.12 + i * 0.1}s` }}
                >
                  <div className="hero-pro-stat-card__icon" aria-hidden="true">
                    <i className={stat.icon} />
                  </div>
                  <div className="hero-pro-stat-card__body">
                    <span className={`hero-pro-stat-num${stat.tone ? ` hero-pro-stat-num--${stat.tone}` : ""}`}>
                      <span data-count={stat.count}>0</span>+
                    </span>
                    <span className="hero-pro-stat-label">{stat.label}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
