import Image from "next/image";
import Link from "next/link";
import { resolveServiceItemImage } from "@/lib/homepage/service-item-image";

export type ServiceGridItem = {
  title: string;
  desc: string;
  href: string;
  icon?: string;
  tone?: string;
  image?: string | { url?: string };
  imageUrl?: string;
};

export function ServiceGridCard({ item }: { item: ServiceGridItem }) {
  const tone = item.tone || "blue";
  const imageUrl = resolveServiceItemImage(item);
  const icon = item.icon || "fas fa-check";
  const href = item.href?.trim() || "/services";

  return (
    <article className="service-card home-service-card" data-tone={tone}>
      <div className="home-service-card__media">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            quality={88}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="home-service-card__img"
          />
        ) : (
          <div className="home-service-card__icon-fallback" aria-hidden="true">
            <i className={icon} />
          </div>
        )}
      </div>
      <div className="home-service-card__body">
        <h3>{item.title}</h3>
        {item.desc ? <p>{item.desc}</p> : null}
        <Link href={href} className="service-link">
          Learn more <i className="fas fa-arrow-right ms-1" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
