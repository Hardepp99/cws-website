import { CtaLink } from "@/components/engagement/CtaLink";
import { HomeSectionItems } from "@/components/homepage/items/HomeSectionItems";
import { HomeMacIcon } from "@/components/ui/HomeMacIcon";
import { resolveMacTone } from "@/lib/homepage/mac-tones";
import { ServicesMarqueeStrip } from "@/components/sections/ServicesMarqueeStrip";
import { Reveal } from "@/components/ui/Reveal";
import { filterTrustItemsNotInHeroStats } from "@/lib/homepage/dedupe-trust-items";
import type { HomeDisplayItem } from "@/lib/homepage/home-display-item";
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
      <div className="home-section-head home-section-head--center home-agency-head">
        {badge ? <span className="home-eyebrow home-eyebrow--mac">{badge}</span> : null}
        {title ? <h2>{title}</h2> : null}
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </Reveal>
  );
}

function sectionVisual(section: HomepageSection): string | undefined {
  const v = section.itemsVisual ?? section.items_visual;
  return typeof v === "string" ? v : undefined;
}

export function TrustBadgesSection({
  section,
  heroStats,
}: {
  section: HomepageSection;
  heroStats?: { count?: number; label?: string; status?: string }[];
}) {
  const published = filterPublishedItems((section.items as HomeDisplayItem[]) || []);
  const heroPublished = filterPublishedItems(heroStats || []);
  const items = filterTrustItemsNotInHeroStats(published, heroPublished);
  return (
    <section className="home-trust home-agency-section corp-section corp-section-alt">
      <div className="corp-container">
        <Head badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <HomeSectionItems items={items} columns={4} visual={sectionVisual(section)} />
      </div>
    </section>
  );
}

/** @deprecated Marquee lives on hero bottom — use ServicesMarqueeStrip via HeroSlider */
export function ServicesMarqueeSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems((section.items as HomeDisplayItem[]) || []);
  return (
    <section className="home-marquee corp-section" aria-label="Services">
      <ServicesMarqueeStrip items={items} />
    </section>
  );
}

export function IndustriesSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems((section.items as HomeDisplayItem[]) || []);
  return (
    <section className="home-industries corp-section">
      <div className="corp-container">
        <Head badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <HomeSectionItems
          items={items}
          columns={4}
          compact
          cardVariant="chip"
          visual={sectionVisual(section)}
        />
      </div>
    </section>
  );
}

export function WebsiteTypesSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems((section.items as HomeDisplayItem[]) || []);
  return (
    <section className="home-website-types corp-section corp-section-alt">
      <div className="corp-container">
        <Head badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <HomeSectionItems items={items} columns={3} visual={sectionVisual(section)} />
      </div>
    </section>
  );
}

export function TechStackSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems((section.items as HomeDisplayItem[]) || []);
  return (
    <section className="home-tech corp-section">
      <div className="corp-container">
        <Head badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <HomeSectionItems
          items={items}
          columns={4}
          compact
          cardVariant="compact"
          visual={sectionVisual(section)}
        />
      </div>
    </section>
  );
}

export function PricingPackagesSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems((section.items as HomeDisplayItem[]) || []);
  return (
    <section className="home-pricing corp-section corp-section-alt" id="packages">
      <div className="corp-container">
        <Head badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <HomeSectionItems
          items={items}
          columns={4}
          visual={sectionVisual(section)}
          renderItem={(item, i) => (
            <article className="home-package-card home-mac-card h-100" data-tone={resolveMacTone(item.tone, i)}>
              <HomeMacIcon icon={item.icon || "fas fa-box"} tone={item.tone} index={i} size="lg" />
              <h3>{item.title}</h3>
              <p>{item.desc || item.description}</p>
              <CtaLink href="#ask-price" className="btn btn-outline-custom btn-sm">
                Get estimate
              </CtaLink>
            </article>
          )}
        />
      </div>
    </section>
  );
}

export function GuaranteesSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems((section.items as HomeDisplayItem[]) || []);
  return (
    <section className="home-guarantees home-agency-section corp-section">
      <div className="corp-container">
        <Head badge={section.badge as string} title={section.title as string} subtitle={section.subtitle as string} />
        <HomeSectionItems items={items} columns={4} visual={sectionVisual(section)} />
      </div>
    </section>
  );
}

export function FaqSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems((section.items as HomeDisplayItem[]) || []);
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
