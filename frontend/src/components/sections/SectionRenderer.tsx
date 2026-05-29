import type { ReactNode } from "react";
import Link from "next/link";
import { CtaLink } from "@/components/engagement/CtaLink";
import Image from "next/image";
import { HeroSlider } from "./HeroSlider";
import { Reveal, type RevealVariant } from "@/components/ui/Reveal";
import { RichContent } from "@/components/ui/RichContent";
import {
  FaqSection,
  GuaranteesSection,
  IndustriesSection,
  PricingPackagesSection,
  TechStackSection,
  TrustBadgesSection,
  WebsiteTypesSection,
} from "@/components/sections/HomeExtendedSections";
import { HomeAboutSection } from "@/components/sections/HomeAboutSection";
import { HomeProcessSection } from "@/components/sections/HomeProcessSection";
import { HomeTestimonialsSection } from "@/components/sections/HomeTestimonialsSection";
import { ServiceGridCard, type ServiceGridItem } from "@/components/sections/ServiceGridCard";
import { HomepageSectionShell } from "@/components/sections/HomepageSectionShell";
import { LocalPortfolioSection } from "@/components/sections/LocalPortfolioSection";
import {
  isHeroLayout,
  resolveSectionBackdrop,
  resolveSectionBackdropStrength,
  resolveSectionTheme,
} from "@/lib/homepage/section-appearance";
import { gmbConfigFromApiPayload } from "@/lib/gmb/from-api";
import { gmbConfigFromSiteSettings } from "@/lib/gmb/resolve";
import {
  DEFAULT_SERVICES_GRID_SUBTITLE,
  enrichServiceGridItems,
} from "@/lib/homepage/service-grid-defaults";
import { resolveHeroMarqueeItems } from "@/lib/homepage/hero-marquee";
import { filterPublishedItems } from "@/lib/homepage/item-status";
import type { HomepageSection } from "@/lib/wordpress/types";
import { getBlogPosts, getGmbLive, getPortfolioHome, getSiteSettings } from "@/lib/wordpress/api";

function cardVariant(index: number): RevealVariant {
  const variants: RevealVariant[] = ["fade-up", "zoom-in", "slide-left", "slide-right"];
  return variants[index % variants.length];
}

interface SectionRendererProps {
  sections: HomepageSection[];
  /** Full CMS list (includes services_marquee for hero strip data). */
  allSections?: HomepageSection[];
}

export async function SectionRenderer({ sections, allSections }: SectionRendererProps) {
  const [posts, siteSettings, portfolioHome, gmbLive] = await Promise.all([
    getBlogPosts(),
    getSiteSettings(),
    getPortfolioHome(),
    getGmbLive(),
  ]);
  const gmb = gmbConfigFromApiPayload(gmbLive) ?? gmbConfigFromSiteSettings(siteSettings);
  const heroSection = sections.find((s) => s.acfFcLayout === "hero_slider");
  const heroStats = (heroSection?.stats as { count?: number; label?: string; status?: string }[]) || [];
  const heroMarqueeItems = resolveHeroMarqueeItems(sections, heroSection, allSections ?? sections);

  let bandIndex = 0;

  return (
    <>
      {sections.map((section, index) => {
        const layout = section.acfFcLayout;
        if (layout === "services_marquee") return null;

        const key = `${layout}-${index}`;
        let node: ReactNode = null;

        switch (layout) {
          case "hero_slider":
            node = <HeroSlider section={section} gmb={gmb} marqueeItems={heroMarqueeItems} />;
            break;
          case "trust_badges":
            node = <TrustBadgesSection section={section} heroStats={heroStats} />;
            break;
          case "industries":
            node = <IndustriesSection section={section} />;
            break;
          case "website_types":
            node = <WebsiteTypesSection section={section} />;
            break;
          case "tech_stack":
            node = <TechStackSection section={section} />;
            break;
          case "pricing_packages":
            node = <PricingPackagesSection section={section} />;
            break;
          case "guarantees":
            node = <GuaranteesSection section={section} />;
            break;
          case "faq":
            node = <FaqSection section={section} />;
            break;
          case "about":
            node = <HomeAboutSection section={section} />;
            break;
          case "why_codify":
            node = <WhyCodifySection section={section} />;
            break;
          case "process":
            node = <HomeProcessSection section={section} />;
            break;
          case "services_grid":
            node = <ServicesGridSection section={section} />;
            break;
          case "courses":
            node = <CoursesSection section={section} />;
            break;
          case "portfolio":
            node = <LocalPortfolioSection section={section} portfolio={portfolioHome} />;
            break;
          case "blog_preview":
            node = <BlogPreviewSection section={section} posts={posts} />;
            break;
          case "testimonials":
            node = <HomeTestimonialsSection section={section} />;
            break;
          case "cta":
            node = <CtaSection section={section} />;
            break;
          case "contact_preview":
            node = <ContactPreviewSection section={section} />;
            break;
          case "seo_rich":
            node = <SeoRichSection section={section} />;
            break;
          default:
            node = null;
        }

        if (!node) return null;

        if (isHeroLayout(layout)) {
          return <div key={key}>{node}</div>;
        }

        const theme = resolveSectionTheme(section, bandIndex);
        const backdropUrl = resolveSectionBackdrop(section);
        const backdropStrength = resolveSectionBackdropStrength(section, theme);
        bandIndex += 1;

        return (
          <HomepageSectionShell
            key={key}
            theme={theme}
            backdropUrl={backdropUrl}
            backdropStrength={backdropStrength}
            layout={layout}
          >
            {node}
          </HomepageSectionShell>
        );
      })}
    </>
  );
}

function SeoRichSection({ section }: { section: HomepageSection }) {
  const html = (section.content as string) || "";
  if (!html.trim()) return null;
  return (
    <section className="corp-section corp-section-alt seo-rich-section">
      <div className="corp-container">
        <HomeSectionHead badge={section.badge as string} title={section.title as string} />
        <RichContent html={html} className="seo-rich-prose--wide" />
      </div>
    </section>
  );
}

function HomeSectionHead({
  badge,
  title,
  subtitle,
  center = true,
}: {
  badge?: string;
  title?: string;
  subtitle?: string;
  center?: boolean;
}) {
  if (!title && !subtitle && !badge) return null;
  return (
    <Reveal variant="fade-up">
      <div className={`home-section-head${center ? " home-section-head--center" : ""}`}>
        {badge && <span className="home-eyebrow">{badge}</span>}
        {title && <h2>{title}</h2>}
        {subtitle && <p>{subtitle}</p>}
      </div>
    </Reveal>
  );
}

function WhyCodifySection({ section }: { section: HomepageSection }) {
  const cards = filterPublishedItems(
    (section.cards as { icon: string; title: string; description: string; number: string; status?: string }[]) || []
  );
  return (
    <section className="why-codify-section corp-section corp-section-alt" id="why-codify">
      <div className="container">
        <HomeSectionHead badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <div className="row g-3">
          {cards.map((card, i) => (
            <div key={card.number} className="col-lg-4 col-md-6">
              <Reveal variant={cardVariant(i)} delay={i * 70}>
              <div className="why-card">
                <div className="why-icon">
                  <i className={card.icon} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <div className="why-number">{card.number}</div>
              </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesGridSection({ section }: { section: HomepageSection }) {
  const services = enrichServiceGridItems(
    filterPublishedItems((section.items as ServiceGridItem[]) || []),
  );
  if (!services.length) return null;

  const rawSubtitle = (section.subtitle as string)?.trim();
  const subtitle =
    rawSubtitle && rawSubtitle !== "Design, engineering, and growth — one team, clear delivery."
      ? rawSubtitle
      : DEFAULT_SERVICES_GRID_SUBTITLE;

  return (
    <section className="services-section home-services corp-section" id="services">
      <div className="corp-container">
        <HomeSectionHead badge={section.badge as string} title={section.title as string} subtitle={subtitle} />
        <div className="row g-3 home-services__grid">
          {services.map((s, i) => (
            <div key={`${s.href}-${s.title}-${i}`} className="col-lg-4 col-md-6">
              <Reveal variant={i % 2 === 0 ? "slide-left" : "slide-right"} delay={i * 50}>
                <ServiceGridCard item={s} />
              </Reveal>
            </div>
          ))}
        </div>
        <Reveal variant="zoom-in" delay={200}>
        <div className="text-center mt-4">
          <Link href="/services" className="home-btn home-btn--primary">
            All services
          </Link>
        </div>
        </Reveal>
      </div>
    </section>
  );
}

function CoursesSection({ section }: { section: HomepageSection }) {
  const courses = filterPublishedItems(
    (section.courses as { title: string; desc: string; href: string; icon: string; status?: string }[]) || []
  );
  if (!courses.length) return null;

  return (
    <section className="courses-section corp-section" id="courses">
      <div className="container">
        <HomeSectionHead badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <div className="row g-3">
          {courses.map((c, i) => (
            <div key={c.title} className="col-lg-4 col-md-6">
              <Reveal variant="zoom-in" delay={i * 90}>
              <div className="course-card">
                <i className={`${c.icon} course-icon`} />
                <h3>{c.title}</h3>
                <p className="small text-muted mb-2">{c.desc}</p>
                <Link href={c.href}>View program</Link>
              </div>
              </Reveal>
            </div>
          ))}
        </div>
        <Reveal variant="fade-in">
        <div className="text-center mt-4">
          <Link href="/courses" className="btn btn-outline-custom btn-sm">
            Course details
          </Link>
        </div>
        </Reveal>
      </div>
    </section>
  );
}

function BlogPreviewSection({
  section,
  posts,
}: {
  section: HomepageSection;
  posts: { slug: string; title: string; excerpt: string; image?: string }[];
}) {
  return (
    <section className="blog-section corp-section" id="blog">
      <div className="container">
        <HomeSectionHead badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <div className="row g-3">
          {posts.slice(0, 3).map((post, i) => (
            <div key={post.slug} className="col-lg-4 col-md-6">
              <Reveal variant="fade-up" delay={i * 80}>
              <article className="blog-card">
                {post.image && (
                  <div className="blog-image">
                    <Image src={post.image} alt={post.title} width={400} height={220} />
                  </div>
                )}
                <div className="blog-content p-3">
                  <h3>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p>{post.excerpt}</p>
                </div>
              </article>
              </Reveal>
            </div>
          ))}
        </div>
        <Reveal variant="slide-right">
        <div className="text-center mt-4">
          <Link href="/blog" className="btn btn-outline-custom btn-sm">
            Read all articles
          </Link>
        </div>
        </Reveal>
      </div>
    </section>
  );
}

function CtaSection({ section }: { section: HomepageSection }) {
  return (
    <section className="cta-section home-cta-band">
      <div className="corp-container text-center">
        <Reveal variant="fade-up">
          <h2>{section.title}</h2>
        </Reveal>
        <Reveal variant="fade-in" delay={120}>
          <p>{section.subtitle}</p>
        </Reveal>
        <Reveal variant="zoom-in" delay={240}>
          <CtaLink href={(section.ctaHref as string) || "/contact"} className="home-hero__btn home-hero__btn--ghost">
            {(section.ctaLabel as string) || "Contact us"}
          </CtaLink>
        </Reveal>
      </div>
    </section>
  );
}

function ContactPreviewSection({ section }: { section: HomepageSection }) {
  const href = (section.ctaHref as string) || "/contact";
  const label = (section.ctaLabel as string) || "Go to contact page";

  return (
    <section className="contact-preview-section corp-section" id="contact-preview">
      <div className="container text-center">
        <HomeSectionHead badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <Reveal variant="slide-left" delay={150}>
        <CtaLink href={href} className="btn btn-primary-custom btn-sm">
          {label}
        </CtaLink>
        </Reveal>
      </div>
    </section>
  );
}
