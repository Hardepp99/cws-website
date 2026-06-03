import Link from "next/link";
import { ServicesMarqueeStrip } from "@/components/sections/ServicesMarqueeStrip";
import { HomeMacIcon } from "@/components/ui/HomeMacIcon";
import { Reveal } from "@/components/ui/Reveal";
import { filterTrustItemsNotInHeroStats } from "@/lib/homepage/dedupe-trust-items";
import { filterPublishedItems } from "@/lib/homepage/item-status";
import { resolveMacTone } from "@/lib/homepage/mac-tones";
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
        {badge ? <span className="home-eyebrow home-eyebrow--mac">{badge}</span> : null}
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

export function TrustBadgesSection({
  section,
  heroStats,
}: {
  section: HomepageSection;
  heroStats?: { count?: number; label?: string; status?: string }[];
}) {
  const published = filterPublishedItems((section.items as Item[]) || []);
  const heroPublished = filterPublishedItems(heroStats || []);
  const items = filterTrustItemsNotInHeroStats(published, heroPublished);
  return (
    <section className="home-trust corp-section corp-section-alt">
      <div className="corp-container">
        <Head badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <div className="home-trust-grid">
          {items.map((item, i) => {
            const tone = resolveMacTone(item.tone, i);
            return (
              <Reveal key={item.title} variant="zoom-in" delay={i * 85}>
                <article className={`home-trust-card home-mac-card home-trust-card--${tone}`} data-tone={tone}>
                  <HomeMacIcon icon={item.icon || "fas fa-check"} tone={tone} index={i} size="md" />
                  <h3>{item.title}</h3>
                  <p>{item.desc || item.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** @deprecated Marquee lives on hero bottom — use ServicesMarqueeStrip via HeroSlider */
export function ServicesMarqueeSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems((section.items as Item[]) || []);
  return (
    <section className="home-marquee corp-section" aria-label="Services">
      <ServicesMarqueeStrip items={items} />
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
          {items.map((item, i) => {
            const tone = resolveMacTone(item.tone, i);
            return (
              <Reveal key={item.title} variant="fade-up" delay={i * 55}>
                <div className="home-industry-chip home-mac-chip" data-tone={tone}>
                  <HomeMacIcon icon={item.icon || "fas fa-briefcase"} tone={tone} index={i} size="sm" />
                  <span>{item.title}</span>
                </div>
              </Reveal>
            );
          })}
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
          {items.map((item, i) => {
            const tone = resolveMacTone(item.tone, i);
            return (
              <div key={item.title} className="col-lg-4 col-md-6">
                <Reveal variant={i % 2 === 0 ? "slide-left" : "slide-right"} delay={i * 100}>
                  <article className="home-type-card home-mac-card h-100" data-tone={tone}>
                    <HomeMacIcon icon={item.icon || "fas fa-globe"} tone={tone} index={i} size="lg" />
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
            );
          })}
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
          {items.map((item, i) => {
            const tone = resolveMacTone(item.tone, i);
            return (
              <Reveal key={item.title} variant="zoom-in" delay={i * 45}>
                <span className="home-tech-pill home-mac-chip" data-tone={tone}>
                  <HomeMacIcon icon={item.icon || "fas fa-code"} tone={tone} index={i} size="sm" />
                  {item.title}
                </span>
              </Reveal>
            );
          })}
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
          {items.map((item, i) => {
            const tone = resolveMacTone(item.tone, i);
            return (
              <div key={item.title} className="col-lg-3 col-md-6">
                <Reveal variant="zoom-in" delay={i * 115}>
                  <article className="home-package-card home-mac-card h-100" data-tone={tone}>
                    <HomeMacIcon icon={item.icon || "fas fa-box"} tone={tone} index={i} size="lg" />
                    <h3>{item.title}</h3>
                    <p>{item.desc || item.description}</p>
                    <Link href="/contact" className="btn btn-outline-custom btn-sm">
                      View rate
                    </Link>
                  </article>
                </Reveal>
              </div>
            );
          })}
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
          {items.map((item, i) => {
            const tone = resolveMacTone(item.tone, i);
            return (
              <div key={item.title} className="col-lg-3 col-md-6">
                <Reveal variant="fade-up" delay={i * 120}>
                  <article className="home-guarantee-card home-mac-card h-100" data-tone={tone}>
                    <HomeMacIcon icon={item.icon || "fas fa-shield-alt"} tone={tone} index={i} size="md" />
                    <h3>{item.title}</h3>
                    <p>{item.desc || item.description}</p>
                  </article>
                </Reveal>
              </div>
            );
          })}
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
          {items.map((item, i) => {
            const tone = resolveMacTone(item.tone, i);
            return (
              <Reveal key={item.title} variant="fade-up" delay={i * 75}>
                <details className="home-faq-item home-mac-card" data-tone={tone}>
                  <summary>
                    <HomeMacIcon icon={item.icon || "fas fa-question-circle"} tone={tone} index={i} size="sm" />
                    {item.title}
                  </summary>
                  <p>{item.desc || item.description}</p>
                </details>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
