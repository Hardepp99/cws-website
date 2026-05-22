import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { filterPublishedItems } from "@/lib/homepage/item-status";
import type { HomepageSection } from "@/lib/wordpress/types";

function Head({
  badge,
  title,
  subtitle,
}: {
  badge?: string;
  title?: string;
  subtitle?: string;
}) {
  if (!badge && !title && !subtitle) return null;
  return (
    <Reveal variant="fade-up">
      <div className="home-section-head home-section-head--center">
        {badge ? <span className="home-eyebrow">{badge}</span> : null}
        {title ? <h2>{title}</h2> : null}
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </Reveal>
  );
}

type Item = {
  title?: string;
  desc?: string;
  description?: string;
  icon?: string;
  href?: string;
  letter?: string;
  tone?: string;
  status?: string;
};

export function TrustBadgesSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems((section.items as Item[]) || []);
  return (
    <section className="home-trust corp-section corp-section-alt">
      <div className="corp-container">
        <Head badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <div className="home-trust-grid">
          {items.map((item, i) => (
            <Reveal key={item.title} variant="zoom-in" delay={i * 50}>
              <article className={`home-trust-card home-trust-card--${item.tone || "blue"}`}>
                <span className="home-trust-icon" aria-hidden="true">
                  <i className={item.icon || "fas fa-check"} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.desc || item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesMarqueeSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems((section.items as Item[]) || []);
  const doubled = [...items, ...items];
  return (
    <section className="home-marquee" aria-label="Services">
      <div className="home-marquee-track">
        {doubled.map((item, i) => (
          <Link key={`${item.title}-${i}`} href={item.href || "/services"} className="home-marquee-pill">
            <span className="home-marquee-letter">{item.letter || item.title?.charAt(0)}</span>
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function IndustriesSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems((section.items as Item[]) || []);
  return (
    <section className="home-industries corp-section">
      <div className="corp-container">
        <Head badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <div className="home-industries-grid">
          {items.map((item, i) => (
            <Reveal key={item.title} variant="fade-up" delay={i * 30}>
              <div className="home-industry-chip">
                <i className={item.icon || "fas fa-briefcase"} aria-hidden="true" />
                <span>{item.title}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WebsiteTypesSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems((section.items as Item[]) || []);
  return (
    <section className="home-website-types corp-section corp-section-alt">
      <div className="corp-container">
        <Head badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <div className="row g-3 g-md-4">
          {items.map((item, i) => (
            <div key={item.title} className="col-lg-4 col-md-6">
              <Reveal variant={i % 2 === 0 ? "slide-left" : "slide-right"} delay={i * 60}>
                <article className="home-type-card h-100">
                  <div className="home-type-icon">
                    <i className={item.icon || "fas fa-globe"} aria-hidden="true" />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc || item.description}</p>
                  {item.href ? (
                    <Link href={item.href} className="home-type-link">
                      Learn more <i className="fas fa-arrow-right ms-1" />
                    </Link>
                  ) : null}
                </article>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TechStackSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems((section.items as Item[]) || []);
  return (
    <section className="home-tech corp-section">
      <div className="corp-container">
        <Head badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <div className="home-tech-row">
          {items.map((item) => (
            <span key={item.title} className="home-tech-pill">
              {item.title}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingPackagesSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems((section.items as Item[]) || []);
  return (
    <section className="home-pricing corp-section corp-section-alt" id="packages">
      <div className="corp-container">
        <Head badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <div className="row g-3 g-md-4">
          {items.map((item, i) => (
            <div key={item.title} className="col-lg-3 col-md-6">
              <Reveal variant="zoom-in" delay={i * 70}>
                <article className="home-package-card h-100">
                  <i className={`${item.icon || "fas fa-box"} home-package-icon`} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.desc || item.description}</p>
                  <Link href="/contact" className="btn btn-outline-custom btn-sm">
                    View rate
                  </Link>
                </article>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GuaranteesSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems((section.items as Item[]) || []);
  return (
    <section className="home-guarantees corp-section">
      <div className="corp-container">
        <Head badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <div className="row g-3">
          {items.map((item, i) => (
            <div key={item.title} className="col-lg-3 col-md-6">
              <Reveal variant="fade-up" delay={i * 80}>
                <article className="home-guarantee-card h-100">
                  <i className={item.icon || "fas fa-check"} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.desc || item.description}</p>
                </article>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems((section.items as Item[]) || []);
  return (
    <section className="home-faq corp-section corp-section-alt" id="faq">
      <div className="corp-container">
        <Head badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <div className="home-faq-list">
          {items.map((item, i) => (
            <Reveal key={item.title} variant="fade-up" delay={i * 40}>
              <details className="home-faq-item">
                <summary>{item.title}</summary>
                <p>{item.desc || item.description}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
