import Image from "next/image";
import Link from "next/link";
import type { PortfolioItem } from "@/lib/wordpress/portfolio-types";

export function PortfolioAppleCard({ item }: { item: PortfolioItem }) {
  const name = item.clientName?.trim() || item.title;
  const detailHref = item.href?.trim() || "/portfolio";

  return (
    <article className="portfolio-apple-card">
      <div className="portfolio-apple-card__media">
        {item.image ? (
          <Image
            src={item.image}
            alt={name}
            width={480}
            height={360}
            className="portfolio-apple-card__img"
          />
        ) : (
          <div className="portfolio-apple-card__placeholder" aria-hidden="true">
            <i className="fas fa-image" />
          </div>
        )}
      </div>
      <div className="portfolio-apple-card__body">
        {item.category ? <span className="portfolio-apple-card__eyebrow">{item.category}</span> : null}
        <h3 className="portfolio-apple-card__title">{name}</h3>
        {item.excerpt ? <p className="portfolio-apple-card__desc">{item.excerpt}</p> : null}
        {item.location ? <p className="portfolio-apple-card__meta">{item.location}</p> : null}
        <div className="portfolio-apple-card__actions">
          <Link href={detailHref} className="portfolio-apple-card__btn">
            View project
          </Link>
        </div>
      </div>
    </article>
  );
}
