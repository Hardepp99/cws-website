import Link from "next/link";
import { HomeMacIcon } from "@/components/ui/HomeMacIcon";
import { HomeItemInfoSvg } from "@/components/homepage/items/HomeItemInfoSvg";
import { resolveMacTone } from "@/lib/homepage/mac-tones";
import type { HomeDisplayItem } from "@/lib/homepage/home-display-item";

type HomeItemCardProps = {
  item: HomeDisplayItem;
  index: number;
  variant?: "default" | "why" | "chip" | "compact";
  className?: string;
  showInfo?: boolean;
};

export function HomeItemCard({
  item,
  index,
  variant = "default",
  className = "",
  showInfo,
}: HomeItemCardProps) {
  const showInfoBadge = showInfo ?? (variant !== "compact" && variant !== "chip");
  const tone = resolveMacTone(item.tone, index);
  const desc = item.desc || item.description;
  const icon = item.icon || "fas fa-check";

  if (variant === "chip") {
    return (
      <div className={`home-item-chip home-mac-chip ${className}`.trim()} data-tone={tone}>
        <HomeMacIcon icon={icon} tone={tone} index={index} size="sm" />
        <span>{item.title}</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <span className={`home-item-compact home-mac-chip ${className}`.trim()} data-tone={tone}>
        <HomeMacIcon icon={icon} tone={tone} index={index} size="sm" />
        {item.title}
      </span>
    );
  }

  const cardCls =
    variant === "why"
      ? "why-card home-mac-card home-item-card home-item-card--why"
      : "home-mac-card home-item-card";

  return (
    <article className={`${cardCls} ${className}`.trim()} data-tone={tone}>
      {showInfoBadge ? (
        <span className="home-item-card__info" title={desc || item.title}>
          <HomeItemInfoSvg />
        </span>
      ) : null}
      <HomeMacIcon icon={icon} tone={tone} index={index} size={variant === "why" ? "lg" : "md"} />
      <h3>{item.title}</h3>
      {desc ? <p>{desc}</p> : null}
      {item.number ? <div className="why-number">{item.number}</div> : null}
      {item.href ? (
        <Link href={item.href} className="home-type-link">
          Learn more <i className="fas fa-arrow-right ms-1" aria-hidden="true" />
        </Link>
      ) : null}
    </article>
  );
}
