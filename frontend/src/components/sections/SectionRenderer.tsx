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
import { HomeSectionItems } from "@/components/homepage/items/HomeSectionItems";
import { HomeMacIcon } from "@/components/ui/HomeMacIcon";
import type { HomeDisplayItem } from "@/lib/homepage/home-display-item";
import { resolveMacTone } from "@/lib/homepage/mac-tones";
import { HomeSectionVisualProvider } from "@/components/homepage/items/HomeSectionVisualContext";
import { HomepageSectionShell } from "@/components/sections/HomepageSectionShell";
import { LocalPortfolioSection } from "@/components/sections/LocalPortfolioSection";
import {
  isHeroLayout,
  pickRandomLightPastelTint,
  resolveSectionBackdrop,
  resolveSectionBackdropStrength,
  resolveSectionTheme,
  type LightPastelTint,
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
            node = (
              <div className="home-hero-stack">
                <HeroSlider section={section} marqueeItems={heroMarqueeItems} />
              </div>
            );
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
        const lightTint: LightPastelTint | undefined =
          theme === "light" ? pickRandomLightPastelTint() : undefined;
        bandIndex += 1;

        return (
          <HomepageSectionShell
            key={key}
            theme={theme}
            lightTint={lightTint}
            backdropUrl={backdropUrl}
            backdropStrength={backdropStrength}
            layout={layout}
          >
            <HomeSectionVisualProvider acfLayout={layout} sectionIndex={index}>
              {node}
            </HomeSectionVisualProvider>
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
      <div className={`home-section-head home-agency-head${center ? " home-section-head--center" : ""}`}>
        {badge && <span className="home-eyebrow home-eyebrow--mac">{badge}</span>}
        {title && <h2>{title}</h2>}
        {subtitle && <p>{subtitle}</p>}
      </div>
    </Reveal>
  );
}

function WhyCodifySection({ section }: { section: HomepageSection }) {
  const cards = filterPublishedItems(
    (section.cards as HomeDisplayItem[]) || [],
  ).map((c) => ({
    ...c,
    desc: c.description || c.desc,
    number: c.number,
  }));
  return (
    <section className="why-codify-section home-agency-why corp-section corp-section-alt" id="why-codify">
      <div className="container">
        <HomeSectionHead badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <HomeSectionItems items={cards} columns={3} cardVariant="why" visual={section.itemsVisual as string} />
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
    <section className="services-section home-services home-agency-section corp-section" id="services">
      <div className="corp-container">
        <HomeSectionHead badge={section.badge as string} title={section.title as string} subtitle={subtitle} />
        <HomeSectionItems
          items={services}
          columns={3}
          gridExtraClass="home-services__grid"
          visual={section.itemsVisual as string}
          renderItem={(item, i) => <ServiceGridCard item={item as ServiceGridItem} index={i} />}
        />
        <Reveal variant="zoom-in">
        <div className="home-agency-services-cta">
          <div className="home-agency-strip">
            <p>Not sure where to start? We will map the right mix of design, build, and growth on a free call.</p>
            <CtaLink href="#ask-price" className="home-hero__btn home-hero__btn--primary">
              Get free proposal
            </CtaLink>
          </div>
          <Link href="/services" className="home-hero__btn home-hero__btn--ghost">
            Browse all services
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
        <HomeSectionItems
          items={courses as HomeDisplayItem[]}
          columns={3}
          visual={section.itemsVisual as string}
          renderItem={(item, i) => (
            <article className="course-card home-mac-card h-100" data-tone={resolveMacTone(undefined, i)}>
              <HomeMacIcon icon={item.icon || "fas fa-graduation-cap"} index={i} size="lg" />
              <h3>{item.title}</h3>
              <p className="small text-muted mb-2">{item.desc || item.description}</p>
              {item.href ? <Link href={item.href}>View program</Link> : null}
            </article>
          )}
        />
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
              <Reveal variant="fade-up" delay={i * 120}>
              <article className="blog-card home-mac-card" data-tone={resolveMacTone(undefined, i)}>
                {post.image && (
                  <div className="blog-image">
                    <Image src={post.image} alt={post.title} width={400} height={220} />
                  </div>
                )}
                <div className="blog-content p-3">
                  <HomeMacIcon
                    icon="fas fa-newspaper"
                    index={i}
                    size="sm"
                    className="blog-card__mac-icon"
                  />
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
  const primary = (section.ctaPrimary as { label?: string; href?: string }) || {};
  const secondary = (section.ctaSecondary as { label?: string; href?: string }) || {};
  const primaryHref = String(primary.href ?? section.ctaHref ?? "#ask-price").trim() || "#ask-price";
  const primaryLabel = String(primary.label ?? section.ctaLabel ?? "Book free consultation").trim();
  const secondaryHref = String(secondary.href ?? "/contact#contact-form").trim();
  const secondaryLabel = String(secondary.label ?? "Contact us").trim();

  return (
    <section className="cta-section home-cta-band home-agency-final-cta">
      <div className="corp-container text-center">
        <Reveal variant="fade-up">
          <h2>{section.title}</h2>
        </Reveal>
        <Reveal variant="fade-in">
          <p>{section.subtitle}</p>
        </Reveal>
        <Reveal variant="zoom-in">
          <div className="page-conversion-band__actions home-cta-band__actions">
            <CtaLink href={primaryHref} className="home-hero__btn home-hero__btn--primary">
              {primaryLabel}
            </CtaLink>
            {secondaryHref ? (
              <Link href={secondaryHref} className="home-hero__btn home-hero__btn--ghost">
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
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
        <Reveal variant="slide-left" delay={220}>
        <CtaLink href={href} className="btn btn-primary-custom btn-sm">
          {label}
        </CtaLink>
        </Reveal>
      </div>
    </section>
  );
}
