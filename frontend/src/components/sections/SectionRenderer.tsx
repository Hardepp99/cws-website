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
  ServicesMarqueeSection,
  TechStackSection,
  TrustBadgesSection,
  WebsiteTypesSection,
} from "@/components/sections/HomeExtendedSections";
import { filterPublishedItems } from "@/lib/homepage/item-status";
import type { HomepageSection } from "@/lib/wordpress/types";
import { getBlogPosts } from "@/lib/wordpress/api";

function cardVariant(index: number): RevealVariant {
  const variants: RevealVariant[] = ["fade-up", "zoom-in", "slide-left", "slide-right"];
  return variants[index % variants.length];
}

interface SectionRendererProps {
  sections: HomepageSection[];
}

export async function SectionRenderer({ sections }: SectionRendererProps) {
  const posts = await getBlogPosts();

  return (
    <>
      {sections.map((section, index) => {
        const key = `${section.acfFcLayout}-${index}`;
        switch (section.acfFcLayout) {
          case "hero_slider":
            return <HeroSlider key={key} section={section} />;
          case "trust_badges":
            return <TrustBadgesSection key={key} section={section} />;
          case "services_marquee":
            return <ServicesMarqueeSection key={key} section={section} />;
          case "industries":
            return <IndustriesSection key={key} section={section} />;
          case "website_types":
            return <WebsiteTypesSection key={key} section={section} />;
          case "tech_stack":
            return <TechStackSection key={key} section={section} />;
          case "pricing_packages":
            return <PricingPackagesSection key={key} section={section} />;
          case "guarantees":
            return <GuaranteesSection key={key} section={section} />;
          case "faq":
            return <FaqSection key={key} section={section} />;
          case "about":
            return <AboutSection key={key} section={section} />;
          case "why_codify":
            return <WhyCodifySection key={key} section={section} />;
          case "process":
            return <ProcessSection key={key} section={section} />;
          case "services_grid":
            return <ServicesGridSection key={key} section={section} />;
          case "courses":
            return <CoursesSection key={key} section={section} />;
          case "portfolio":
            return <PortfolioPreviewSection key={key} section={section} />;
          case "blog_preview":
            return <BlogPreviewSection key={key} section={section} posts={posts} />;
          case "testimonials":
            return <TestimonialsSection key={key} section={section} />;
          case "cta":
            return <CtaSection key={key} section={section} />;
          case "contact_preview":
            return <ContactPreviewSection key={key} section={section} />;
          case "seo_rich":
            return <SeoRichSection key={key} section={section} />;
          default:
            return null;
        }
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

function AboutSection({ section }: { section: HomepageSection }) {
  const features = filterPublishedItems(
    (section.features as { title: string; description: string; status?: string }[]) || []
  );
  const title = (section.title as string) || "Technology partner for ambitious businesses";
  const titleParts = title.split(" ");
  const highlight = titleParts.length > 3 ? titleParts.slice(-2).join(" ") : "";
  const mainTitle = highlight ? titleParts.slice(0, -2).join(" ") : title;

  return (
    <section className="about-section about-section-home corp-section" id="about">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <Reveal variant="slide-left">
            <div className="about-image">
              <Image
                src={(section.image as string) || "/assets/images/hero2.png"}
                alt="Creative Web Solutions team"
                width={600}
                height={500}
                className="grid-img main-img"
              />
              <div className="experience-badge">
                <span className="years">15+</span>
                <span className="text">Years experience</span>
              </div>
            </div>
            </Reveal>
          </div>
          <div className="col-lg-6">
            <Reveal variant="slide-right" delay={80}>
            <div className="about-content">
              <HomeSectionHead badge={section.badge as string} center={false} />
              <h2 className="section-title text-start" style={{ fontSize: "1.5rem" }}>
                {mainTitle}
                {highlight ? (
                  <>
                    {" "}
                    <span className="gradient-text">{highlight}</span>
                  </>
                ) : null}
              </h2>
              <p className="section-description">{section.subtitle}</p>
              <div className="about-features">
                {features.map((f) => (
                  <div key={f.title} className="feature-item">
                    <div className="feature-icon">
                      <i className="fas fa-check-circle" />
                    </div>
                    <div className="feature-text">
                      <h4>{f.title}</h4>
                      <p>{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href={(section.ctaHref as string) || "/about"} className="btn btn-primary-custom mt-3">
                {(section.ctaLabel as string) || "About our company"}
                <i className="fas fa-arrow-right ms-2" />
              </Link>
            </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
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

function ProcessSection({ section }: { section: HomepageSection }) {
  const steps = filterPublishedItems(
    (section.steps as { icon: string; title: string; description: string; status?: string }[]) || []
  );
  return (
    <section className="process-section corp-section" id="process">
      <div className="container">
        <HomeSectionHead badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <div className="row g-3">
          {steps.map((step, i) => (
            <div key={step.title} className="col-lg-3 col-md-6">
              <Reveal variant="fade-up" delay={i * 60}>
              <div className="process-card">
                <div className="process-number">{String(i + 1).padStart(2, "0")}</div>
                <div className="process-icon">
                  <i className={step.icon} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
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
  const services = filterPublishedItems(
    (section.items as { title: string; desc: string; href: string; icon: string; status?: string }[]) || []
  );
  if (!services.length) return null;

  return (
    <section className="services-section home-services corp-section" id="services">
      <div className="container">
        <HomeSectionHead badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <div className="row g-3">
          {services.map((s, i) => (
            <div key={s.href} className="col-lg-4 col-md-6">
              <Reveal variant={i % 2 === 0 ? "slide-left" : "slide-right"} delay={i * 50}>
              <div className="service-card home-service-card">
                <div className="service-icon">
                  <i className={s.icon} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <Link href={s.href} className="service-link">
                  Learn more <i className="fas fa-arrow-right ms-1" />
                </Link>
              </div>
              </Reveal>
            </div>
          ))}
        </div>
        <Reveal variant="zoom-in" delay={200}>
        <div className="text-center mt-4">
          <Link href="/services" className="btn btn-primary-custom btn-sm">
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

function PortfolioPreviewSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems(
    (section.portfolioItems as { title: string; image: string; href?: string; status?: string }[]) || []
  );
  if (!items.length) return null;

  return (
    <section className="portfolio-section corp-section corp-section-alt" id="portfolio">
      <div className="container">
        <HomeSectionHead badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <div className="home-portfolio-grid mb-4">
          {items.map((item, i) => (
            <Reveal key={item.title} variant={cardVariant(i)} delay={i * 100}>
            <Link href={item.href || "/portfolio"} className="home-portfolio-item text-decoration-none">
              <Image src={item.image} alt={item.title} width={400} height={300} />
              <span>{item.title}</span>
            </Link>
            </Reveal>
          ))}
        </div>
        <Reveal variant="fade-up">
        <div className="text-center">
          <Link href="/portfolio" className="btn btn-primary-custom btn-sm">
            View portfolio
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

function TestimonialsSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems(
    (section.testimonials as { name: string; text: string; role: string; status?: string }[]) || []
  );
  if (!items.length) return null;

  return (
    <section className="testimonials-section corp-section" id="testimonials">
      <div className="container">
        <HomeSectionHead badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <div className="row g-3">
          {items.map((t, i) => (
            <div key={t.name} className="col-lg-4 col-md-6">
              <Reveal variant="zoom-in" delay={i * 100}>
              <div className="testimonial-card">
                <p>&ldquo;{t.text}&rdquo;</p>
                <h4>{t.name}</h4>
                <span>{t.role}</span>
              </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ section }: { section: HomepageSection }) {
  return (
    <section className="cta-section">
      <div className="container text-center">
        <Reveal variant="fade-up">
          <h2>{section.title}</h2>
        </Reveal>
        <Reveal variant="fade-in" delay={120}>
          <p>{section.subtitle}</p>
        </Reveal>
        <Reveal variant="zoom-in" delay={240}>
          <CtaLink href={(section.ctaHref as string) || "/contact"} className="btn btn-light btn-sm px-4">
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
