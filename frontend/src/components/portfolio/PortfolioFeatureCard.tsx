import Image from "next/image";
import Link from "next/link";
import type { PortfolioItem } from "@/lib/wordpress/portfolio-types";

export function PortfolioFeatureCard({ item }: { item: PortfolioItem }) {
  const name = item.clientName?.trim() || item.title;
  const detailHref =
    item.slug?.trim()
      ? `/portfolio/${item.slug}`
      : item.href?.trim() || "/portfolio";

  return (
    <article className="portfolio-feature-card">
      <div className="portfolio-feature-card__media">
        {item.image ? (
          <Image
            src={item.image}
            alt={name}
            width={480}
            height={360}
            className="portfolio-feature-card__img"
          />
        ) : (
          <div className="portfolio-feature-card__placeholder" aria-hidden="true">
            <i className="fas fa-image" />
          </div>
        )}
      </div>
      <div className="portfolio-feature-card__body">
        {item.category ? (
          <span className="portfolio-feature-card__eyebrow">{item.category}</span>
        ) : null}
        <h3 className="portfolio-feature-card__title">{name}</h3>
        {item.excerpt ? <p className="portfolio-feature-card__desc">{item.excerpt}</p> : null}
        {item.location ? <p className="portfolio-feature-card__meta">{item.location}</p> : null}
        <div className="portfolio-feature-card__actions">
          <Link href={detailHref} className="portfolio-feature-card__btn">
            View project
          </Link>
        </div>
      </div>
    </article>
  );
}
