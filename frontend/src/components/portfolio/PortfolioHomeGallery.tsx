"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { buildPortfolioTabs, filterPortfolioByTab } from "@/lib/portfolio/tabs";
import type { PortfolioItem } from "@/lib/wordpress/portfolio-types";

function detailHref(item: PortfolioItem): string {
  return item.slug?.trim() ? `/portfolio/${item.slug}` : item.href?.trim() || "/portfolio";
}

function liveHref(item: PortfolioItem): string | null {
  const external = item.projectUrl?.trim() || "";
  if (external && /^https?:\/\//i.test(external)) return external;
  const href = item.href?.trim() || "";
  if (href && /^https?:\/\//i.test(href) && !href.includes("/portfolio")) return href;
  return null;
}

interface PortfolioHomeGalleryProps {
  items: PortfolioItem[];
  allTabLabel?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export function PortfolioHomeGallery({
  items,
  allTabLabel = "All work",
  viewAllHref,
  viewAllLabel = "View all case studies",
}: PortfolioHomeGalleryProps) {
  const tabs = useMemo(() => buildPortfolioTabs(items, allTabLabel), [items, allTabLabel]);
  const [activeTab, setActiveTab] = useState("all");
  const [index, setIndex] = useState(0);

  const filtered = useMemo(
    () => filterPortfolioByTab(items, activeTab, tabs),
    [items, activeTab, tabs],
  );

  const current = filtered[index] ?? null;
  const live = current ? liveHref(current) : null;
  const total = filtered.length;

  useEffect(() => {
    setIndex(0);
  }, [activeTab]);

  const goPrev = useCallback(() => {
    if (total < 2) return;
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    if (total < 2) return;
    setIndex((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  if (!items.length) return null;

  return (
    <div className="portfolio-home-gallery">
      <div className="portfolio-home-gallery__filters">
        <label className="portfolio-home-gallery__select-wrap" htmlFor="portfolio-home-category">
          <span className="sr-only">Filter by category</span>
          <select
            id="portfolio-home-category"
            className="portfolio-home-gallery__select"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            aria-label="Portfolio category"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
          <i className="fas fa-chevron-down portfolio-home-gallery__select-icon" aria-hidden="true" />
        </label>

        <div className="portfolio-home-gallery__tags" role="tablist" aria-label="Portfolio categories">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`portfolio-home-gallery__tag${activeTab === tab.id ? " is-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {total > 0 && current ? (
        <div className="portfolio-home-gallery__stage" key={`${activeTab}-${current.id}`}>
          <button
            type="button"
            className="portfolio-home-gallery__nav portfolio-home-gallery__nav--prev"
            onClick={goPrev}
            disabled={total < 2}
            aria-label="Previous project"
          >
            <i className="fas fa-chevron-left" aria-hidden="true" />
          </button>

          <article className="portfolio-home-gallery__slide">
            <div className="portfolio-home-gallery__media">
              {current.image ? (
                <Image
                  src={current.image}
                  alt={current.clientName?.trim() || current.title}
                  fill
                  sizes="(max-width: 991px) 100vw, 58vw"
                  className="portfolio-home-gallery__img"
                  priority={index === 0}
                />
              ) : (
                <div className="portfolio-home-gallery__placeholder" aria-hidden="true">
                  <i className="fas fa-image" />
                </div>
              )}
            </div>

            <div className="portfolio-home-gallery__copy">
              {current.category ? (
                <span className="portfolio-home-gallery__eyebrow">{current.category}</span>
              ) : null}
              <h3 className="portfolio-home-gallery__title">
                {current.clientName?.trim() || current.title}
              </h3>
              {current.title && current.clientName?.trim() ? (
                <p className="portfolio-home-gallery__project">{current.title}</p>
              ) : null}
              {current.excerpt ? (
                <p className="portfolio-home-gallery__desc">{current.excerpt}</p>
              ) : null}
              {current.location ? (
                <p className="portfolio-home-gallery__meta">
                  <i className="fas fa-map-marker-alt" aria-hidden="true" /> {current.location}
                </p>
              ) : null}

              <div className="portfolio-home-gallery__actions">
                {live ? (
                  <a
                    href={live}
                    className="portfolio-home-gallery__btn portfolio-home-gallery__btn--live"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-external-link-alt" aria-hidden="true" />
                    View live
                  </a>
                ) : null}
                <Link href={detailHref(current)} className="portfolio-home-gallery__btn portfolio-home-gallery__btn--detail">
                  Project details
                  <i className="fas fa-arrow-right" aria-hidden="true" />
                </Link>
              </div>

              {total > 1 ? (
                <p className="portfolio-home-gallery__counter" aria-live="polite">
                  {index + 1} <span>of</span> {total}
                </p>
              ) : null}
            </div>
          </article>

          <button
            type="button"
            className="portfolio-home-gallery__nav portfolio-home-gallery__nav--next"
            onClick={goNext}
            disabled={total < 2}
            aria-label="Next project"
          >
            <i className="fas fa-chevron-right" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <p className="portfolio-home-gallery__empty">No projects in this category yet.</p>
      )}

      {viewAllHref ? (
        <div className="portfolio-home-gallery__footer">
          <Link href={viewAllHref} className="portfolio-showcase__view-all">
            {viewAllLabel}
            <i className="fas fa-arrow-right ms-2" aria-hidden="true" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
