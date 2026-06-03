import { PortfolioHomeGallery } from "@/components/portfolio/PortfolioHomeGallery";
import type { PortfolioHomePayload } from "@/lib/wordpress/portfolio-types";
import type { HomepageSection } from "@/lib/wordpress/types";

export function LocalPortfolioSection({
  section,
  portfolio,
}: {
  section: HomepageSection;
  portfolio: PortfolioHomePayload;
}) {
  const items = portfolio.items;
  if (!items.length) return null;

  const badge = (section.badge as string) || portfolio.settings.badge;
  const title = (section.title as string) || portfolio.settings.title;
  const subtitle = (section.subtitle as string) || portfolio.settings.subtitle;
  const ctaLabel = (section.ctaLabel as string) || portfolio.settings.ctaLabel;
  const ctaHref = (section.ctaHref as string) || portfolio.settings.ctaHref;

  return (
    <section className="portfolio-section home-portfolio corp-section" id="portfolio">
      <div className="corp-container">
        <div className="home-section-head home-section-head--center">
          {badge ? <span className="home-eyebrow home-eyebrow--mac">{badge}</span> : null}
          {title ? <h2>{title}</h2> : null}
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        <PortfolioHomeGallery
          items={items}
          allTabLabel="All work"
          viewAllHref={ctaHref || undefined}
          viewAllLabel={ctaLabel || "View all case studies"}
        />
      </div>
    </section>
  );
}
