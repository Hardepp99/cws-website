"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { PortfolioAppleCard } from "@/components/portfolio/PortfolioAppleCard";
import { buildPortfolioTabs, filterPortfolioByTab, limitPortfolioTabItems } from "@/lib/portfolio/tabs";
import type { PortfolioItem } from "@/lib/wordpress/portfolio-types";
import "swiper/css";
import "swiper/css/navigation";

interface PortfolioTabbedShowcaseProps {
  items: PortfolioItem[];
  allTabLabel?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
  /** Homepage: max items per tab (including “All work”). Omit on /portfolio for no cap. */
  maxItemsPerTab?: number;
}

const APPLE_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

export function PortfolioTabbedShowcase({
  items,
  allTabLabel = "All work",
  viewAllHref,
  viewAllLabel = "View all work",
  className = "",
  maxItemsPerTab,
}: PortfolioTabbedShowcaseProps) {
  const tabs = useMemo(() => buildPortfolioTabs(items, allTabLabel), [items, allTabLabel]);
  const [activeTab, setActiveTab] = useState("all");
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0, height: 0, ready: false });
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const filtered = useMemo(() => {
    if (maxItemsPerTab != null && maxItemsPerTab > 0) {
      return limitPortfolioTabItems(items, activeTab, tabs, maxItemsPerTab);
    }
    return filterPortfolioByTab(items, activeTab, tabs);
  }, [items, activeTab, tabs, maxItemsPerTab]);

  const isPageGrid = className.includes("portfolio-showcase--page");

  const updateIndicator = useCallback(() => {
    const capsule = capsuleRef.current;
    const tab = tabRefs.current[activeTab];
    if (!capsule || !tab) return;
    setIndicator({
      left: tab.offsetLeft,
      top: tab.offsetTop,
      width: tab.offsetWidth,
      height: tab.offsetHeight,
      ready: true,
    });
  }, [activeTab]);

  /** Scroll only the tab strip — avoid scrollIntoView shifting the page or panel. */
  const scrollActiveTabIntoView = useCallback((tabId: string) => {
    const capsule = capsuleRef.current;
    const tab = tabRefs.current[tabId];
    if (!capsule || !tab) return;

    const tabLeft = tab.offsetLeft;
    const tabWidth = tab.offsetWidth;
    const capsuleWidth = capsule.clientWidth;
    const maxScroll = Math.max(0, capsule.scrollWidth - capsuleWidth);
    const targetScroll = tabLeft - (capsuleWidth - tabWidth) / 2;

    capsule.scrollTo({
      left: Math.max(0, Math.min(targetScroll, maxScroll)),
      behavior: "smooth",
    });
  }, []);

  const prevTabRef = useRef(activeTab);

  useLayoutEffect(() => {
    updateIndicator();
    if (prevTabRef.current !== activeTab && isPageGrid) {
      scrollActiveTabIntoView(activeTab);
    }
    prevTabRef.current = activeTab;
  }, [activeTab, updateIndicator, isPageGrid, tabs.length, scrollActiveTabIntoView]);

  useEffect(() => {
    const capsule = capsuleRef.current;
    if (!capsule) return;
    const ro = new ResizeObserver(() => updateIndicator());
    ro.observe(capsule);
    window.addEventListener("resize", updateIndicator);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  const bindNavigation = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper;
    const nav = swiper.params.navigation;
    if (!nav || typeof nav === "boolean" || !prevRef.current || !nextRef.current) return;
    nav.prevEl = prevRef.current;
    nav.nextEl = nextRef.current;
    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  }, []);

  useEffect(() => {
    if (swiperRef.current) bindNavigation(swiperRef.current);
  }, [activeTab, filtered.length, bindNavigation]);

  const selectTab = (tabId: string) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
  };

  if (!items.length) return null;

  return (
    <div className={`portfolio-showcase ${className}`.trim()}>
      <div className={`portfolio-capsule-wrap${isPageGrid ? " portfolio-capsule-wrap--scroll" : ""}`}>
        <div
          ref={capsuleRef}
          className={`portfolio-capsule${isPageGrid ? " portfolio-capsule--scroll" : ""}`}
          role="tablist"
          aria-label="Filter portfolio"
        >
          <span
            className="portfolio-capsule__indicator"
            aria-hidden="true"
            style={{
              left: indicator.left,
              top: indicator.top,
              width: indicator.width,
              height: indicator.height,
              opacity: indicator.ready ? 1 : 0,
              transition: `left 0.48s ${APPLE_EASE}, top 0.48s ${APPLE_EASE}, width 0.48s ${APPLE_EASE}, height 0.48s ${APPLE_EASE}, opacity 0.25s ease`,
            }}
          />
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`portfolio-panel-${tab.id}`}
              id={`portfolio-tab-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={`portfolio-capsule__tab${activeTab === tab.id ? " is-active" : ""}`}
              onClick={() => selectTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="portfolio-showcase__panel"
        key={activeTab}
        id={`portfolio-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`portfolio-tab-${activeTab}`}
        aria-live="polite"
      >
        {filtered.length > 0 ? (
          isPageGrid ? (
            <div className="portfolio-showcase__track portfolio-showcase__track--grid">
              {filtered.map((item, i) => (
                <div
                  key={item.id}
                  className="portfolio-showcase__grid-item"
                  style={{ animationDelay: `${i * 45}ms` }}
                >
                  <PortfolioAppleCard item={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="portfolio-showcase__carousel">
              <button
                ref={prevRef}
                type="button"
                className="portfolio-showcase__nav portfolio-showcase__nav--prev"
                aria-label="Previous projects"
              >
                <i className="fas fa-chevron-left" aria-hidden="true" />
              </button>

              <Swiper
                className="portfolio-showcase__swiper"
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={1.08}
                slidesPerGroup={1}
                speed={680}
                grabCursor
                touchRatio={1}
                touchStartPreventDefault={false}
                resistanceRatio={0.72}
                watchOverflow
                breakpoints={{
                  480: { slidesPerView: 1.4, spaceBetween: 18 },
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  992: { slidesPerView: 2.85, spaceBetween: 22 },
                  1200: { slidesPerView: 3.1, spaceBetween: 24 },
                }}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onSwiper={bindNavigation}
                onBeforeInit={bindNavigation}
              >
                {filtered.map((item) => (
                  <SwiperSlide key={item.id} className="portfolio-showcase__slide">
                    <PortfolioAppleCard item={item} />
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                ref={nextRef}
                type="button"
                className="portfolio-showcase__nav portfolio-showcase__nav--next"
                aria-label="Next projects"
              >
                <i className="fas fa-chevron-right" aria-hidden="true" />
              </button>
            </div>
          )
        ) : (
          <p className="portfolio-showcase__empty">No projects in this category yet.</p>
        )}
      </div>

      {viewAllHref ? (
        <div className="portfolio-showcase__footer">
          <Link href={viewAllHref} className="portfolio-showcase__view-all">
            {viewAllLabel}
            <i className="fas fa-arrow-right ms-2" aria-hidden="true" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
