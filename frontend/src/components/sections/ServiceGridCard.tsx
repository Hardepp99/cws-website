import Image from "next/image";
import Link from "next/link";
import { HomeMacIcon } from "@/components/ui/HomeMacIcon";
import { resolveServiceItemImage } from "@/lib/homepage/service-item-image";
import { resolveMacTone } from "@/lib/homepage/mac-tones";

export type ServiceGridItem = {
  title: string;
  desc: string;
  href: string;
  icon?: string;
  tone?: string;
  image?: string | { url?: string };
  imageUrl?: string;
};

export function ServiceGridCard({ item, index = 0 }: { item: ServiceGridItem; index?: number }) {
  const tone = resolveMacTone(item.tone, index);
  const imageUrl = resolveServiceItemImage(item);
  const icon = item.icon || "fas fa-check";
  const href = item.href?.trim() || "/services";

  return (
    <article className="service-card home-service-card home-mac-card" data-tone={tone}>
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
        <HomeMacIcon
          icon={icon}
          tone={tone}
          index={index}
          size="md"
          className="home-service-card__mac-badge"
        />
        <h3>{item.title}</h3>
        {item.desc ? <p>{item.desc}</p> : null}
        <Link href={href} className="service-link">
          Learn more <i className="fas fa-arrow-right ms-1" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
