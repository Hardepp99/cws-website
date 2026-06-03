"use client";

import type { ReactNode } from "react";
import { Reveal, type RevealVariant } from "@/components/ui/Reveal";
import { HomeItemCard } from "@/components/homepage/items/HomeItemCard";
import { useHomeSectionVisual } from "@/components/homepage/items/HomeSectionVisualContext";
import type { HomeDisplayItem } from "@/lib/homepage/home-display-item";
import {
  pickItemLayoutVariant,
  type ItemLayoutVariant,
} from "@/lib/homepage/item-layout-variant";

const REVEAL_CYCLE: RevealVariant[] = ["fade-up", "zoom-in", "slide-left", "slide-right"];

type HomeSectionItemsProps = {
  items: HomeDisplayItem[];
  columns?: 2 | 3 | 4;
  /** chips / pills without body copy */
  compact?: boolean;
  cardVariant?: "default" | "why" | "chip" | "compact";
  gridExtraClass?: string;
  /** force variant (CMS override) */
  visual?: ItemLayoutVariant | string | null;
  renderItem?: (item: HomeDisplayItem, index: number, variant: ItemLayoutVariant) => ReactNode;
};

function DefaultItem({
  item,
  index,
  cardVariant,
  className,
}: {
  item: HomeDisplayItem;
  index: number;
  cardVariant: HomeSectionItemsProps["cardVariant"];
  className?: string;
}) {
  return <HomeItemCard item={item} index={index} variant={cardVariant} className={className} showInfo={!cardVariant?.includes("compact")} />;
}

function GridLayout({
  items,
  columns,
  cardVariant,
  gridExtraClass,
  renderItem,
  variant,
}: HomeSectionItemsProps & { variant: ItemLayoutVariant }) {
  const colCls = `home-grid-balanced home-grid-balanced--${columns ?? 3}${gridExtraClass ? ` ${gridExtraClass}` : ""}`;
  return (
    <div className={colCls} data-item-layout={variant}>
      {items.map((item, i) => (
        <div key={itemKey(item, i)} className="home-grid-balanced__item">
          <Reveal variant={REVEAL_CYCLE[i % REVEAL_CYCLE.length]} delay={i * 85}>
            {renderItem ? renderItem(item, i, variant) : <DefaultItem item={item} index={i} cardVariant={cardVariant} />}
          </Reveal>
        </div>
      ))}
    </div>
  );
}

function WheelLayout({ items, cardVariant, renderItem, variant }: HomeSectionItemsProps & { variant: ItemLayoutVariant }) {
  const n = items.length;
  const radius = n <= 4 ? 148 : n <= 6 ? 168 : 188;
  return (
    <div className="home-item-wheel" data-item-layout={variant} style={{ ["--wheel-r" as string]: `${radius}px` }}>
      <div className="home-item-wheel__hub" aria-hidden="true">
        <svg viewBox="0 0 64 64" className="home-item-wheel__hub-svg">
          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
          <circle cx="32" cy="32" r="18" fill="currentColor" opacity="0.08" />
          <path
            d="M32 12v8M32 44v8M12 32h8M44 32h8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>
      <ul className="home-item-wheel__orbit">
        {items.map((item, i) => {
          const deg = (360 / n) * i - 90;
          return (
            <li
              key={itemKey(item, i)}
              className="home-item-wheel__spoke"
              style={{ transform: `rotate(${deg}deg) translate(${radius}px) rotate(${-deg}deg)` }}
            >
              <Reveal variant="zoom-in" delay={i * 70}>
                <div className="home-item-wheel__node">
                  {renderItem ? (
                    renderItem(item, i, variant)
                  ) : (
                    <DefaultItem item={item} index={i} cardVariant={cardVariant} className="home-item-card--wheel" />
                  )}
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function InfographicLayout({ items, cardVariant, renderItem, variant }: HomeSectionItemsProps & { variant: ItemLayoutVariant }) {
  return (
    <div className="home-item-infographic" data-item-layout={variant}>
      <svg className="home-item-infographic__line" viewBox="0 0 4 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="2" y1="0" x2="2" y2="100" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" />
      </svg>
      <ol className="home-item-infographic__list">
        {items.map((item, i) => (
          <li key={itemKey(item, i)} className="home-item-infographic__step">
            <Reveal variant="slide-left" delay={i * 90}>
              <span className="home-item-infographic__dot" aria-hidden="true">
                <svg viewBox="0 0 24 24" width={24} height={24}>
                  <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
                  <circle cx="12" cy="12" r="4" fill="currentColor" />
                </svg>
              </span>
              {renderItem ? (
                renderItem(item, i, variant)
              ) : (
                <DefaultItem item={item} index={i} cardVariant={cardVariant} className="home-item-card--info" />
              )}
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

function RoadmapLayout({ items, cardVariant, renderItem, variant }: HomeSectionItemsProps & { variant: ItemLayoutVariant }) {
  return (
    <div className="home-item-roadmap" data-item-layout={variant}>
      <div className="home-item-roadmap__track" aria-hidden="true">
        <svg className="home-item-roadmap__track-svg" viewBox="0 0 800 24" preserveAspectRatio="none">
          <path
            d="M0 12 H800"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="12 14"
            className="home-item-roadmap__path-anim"
          />
        </svg>
      </div>
      <ol className="home-item-roadmap__steps">
        {items.map((item, i) => (
          <li key={itemKey(item, i)} className="home-item-roadmap__step">
            <Reveal variant="fade-up" delay={i * 100}>
              <span className="home-item-roadmap__marker">{String(i + 1).padStart(2, "0")}</span>
              {renderItem ? (
                renderItem(item, i, variant)
              ) : (
                <DefaultItem item={item} index={i} cardVariant={cardVariant} className="home-item-card--road" />
              )}
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

function TreeLayout({ items, cardVariant, renderItem, variant }: HomeSectionItemsProps & { variant: ItemLayoutVariant }) {
  const root = items[0];
  const branches = items.slice(1);
  return (
    <div className="home-item-tree" data-item-layout={variant}>
      <svg className="home-item-tree__svg" viewBox="0 0 400 80" aria-hidden="true">
        <path d="M200 8 V36" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
        {branches.length > 0 ? (
          <path
            d={`M200 36 Q200 52 ${branches.length === 1 ? 200 : 80} 56 M200 36 Q200 52 ${branches.length === 1 ? 200 : 320} 56`}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            opacity="0.35"
          />
        ) : null}
      </svg>
      {root ? (
        <Reveal variant="zoom-in">
          <div className="home-item-tree__root">
            {renderItem ? renderItem(root, 0, variant) : <DefaultItem item={root} index={0} cardVariant={cardVariant} />}
          </div>
        </Reveal>
      ) : null}
      <ul className="home-item-tree__branches">
        {branches.map((item, i) => (
          <li key={itemKey(item, i + 1)} className="home-item-tree__branch">
            <Reveal variant="fade-up" delay={(i + 1) * 80}>
              {renderItem ? (
                renderItem(item, i + 1, variant)
              ) : (
                <DefaultItem item={item} index={i + 1} cardVariant={cardVariant} className="home-item-card--branch" />
              )}
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CollageLayout({ items, cardVariant, renderItem, variant }: HomeSectionItemsProps & { variant: ItemLayoutVariant }) {
  const spans = ["home-item-collage__cell--a", "home-item-collage__cell--b", "home-item-collage__cell--c", "home-item-collage__cell--d", "home-item-collage__cell--e", "home-item-collage__cell--f"];
  return (
    <div className="home-item-collage" data-item-layout={variant}>
      {items.map((item, i) => (
        <Reveal key={itemKey(item, i)} variant={REVEAL_CYCLE[i % REVEAL_CYCLE.length]} delay={i * 75}>
          <div className={`home-item-collage__cell ${spans[i % spans.length]}`}>
            {renderItem ? (
              renderItem(item, i, variant)
            ) : (
              <DefaultItem item={item} index={i} cardVariant={cardVariant} className="home-item-card--collage h-100" />
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function itemKey(item: HomeDisplayItem, i: number): string {
  return `${item.title ?? item.letter ?? "item"}-${i}`;
}

export function HomeSectionItems(props: HomeSectionItemsProps) {
  const { acfLayout, sectionIndex } = useHomeSectionVisual();
  const { items, compact, visual } = props;

  if (!items.length) return null;

  const variant = pickItemLayoutVariant(acfLayout, sectionIndex, visual);
  const merged = { ...props, variant };
  const effective = compact && (variant === "wheel" || variant === "tree") ? "grid" : variant;

  let body: React.ReactNode;
  switch (effective) {
    case "wheel":
      body = <WheelLayout {...merged} variant={effective} />;
      break;
    case "infographic":
      body = <InfographicLayout {...merged} variant={effective} />;
      break;
    case "roadmap":
      body = <RoadmapLayout {...merged} variant={effective} />;
      break;
    case "tree":
      body = <TreeLayout {...merged} variant={effective} />;
      break;
    case "collage":
      body = <CollageLayout {...merged} variant={effective} />;
      break;
    default:
      body = <GridLayout {...merged} variant="grid" />;
  }

  return (
    <div className={`home-section-items home-section-items--${effective}`} data-item-layout={effective}>
      {body}
    </div>
  );
}

/** Screen-reader hint for current visual style */
export function HomeSectionLayoutLabel({ variant }: { variant?: ItemLayoutVariant }) {
  const { acfLayout, sectionIndex } = useHomeSectionVisual();
  const v = variant ?? pickItemLayoutVariant(acfLayout, sectionIndex);
  return (
    <span className="visually-hidden">
      Items shown in {v} layout
    </span>
  );
}
