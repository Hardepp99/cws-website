"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { onSiteIntroReady } from "@/lib/site-intro";
import { pickMarqueePillAnimation } from "@/lib/homepage/marquee-animations";

export type MarqueeItem = {
  title?: string;
  href?: string;
  letter?: string;
  status?: string;
};

function MarqueePill({
  item,
  index,
  segment,
  measure = false,
}: {
  item: MarqueeItem;
  index: number;
  segment: number;
  measure?: boolean;
}) {
  const title = item.title ?? "Service";
  const letter = item.letter || title.charAt(0);
  const anim = pickMarqueePillAnimation(`${title}-${segment}`, index);
  const delay = (index % 7) * 0.09;

  return (
    <Link
      href={item.href || "/services"}
      className={[
        "home-marquee-pill",
        measure ? "home-marquee-pill--measure" : "",
        `home-marquee-pill--anim-${anim}`,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ "--pill-stagger": `${delay}s` } as CSSProperties}
      title={title}
    >
      <span className="home-marquee-letter">{letter}</span>
      <span className="home-marquee-pill__label">{title}</span>
    </Link>
  );
}

export function ServicesMarqueeStrip({
  items,
  className = "",
  variant = "inline",
}: {
  items: MarqueeItem[];
  className?: string;
  variant?: "inline" | "rail";
}) {
  const measureRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [segmentCount, setSegmentCount] = useState(3);
  const [scrollEnd, setScrollEnd] = useState("-33.333%");
  const [durationSec, setDurationSec] = useState(42);
  const [introReady, setIntroReady] = useState(false);

  const viewportClass =
    variant === "rail" ? "home-marquee-viewport--rail" : "home-marquee-viewport--inline";

  const stripClass = ["home-marquee-strip", className].filter(Boolean).join(" ");

  useEffect(() => {
    return onSiteIntroReady(() => setIntroReady(true));
  }, []);

  useEffect(() => {
    const measure = () => {
      const measureEl = measureRef.current;
      const viewport = viewportRef.current;
      if (!measureEl || !viewport || items.length === 0) return;

      const setWidth = measureEl.offsetWidth;
      const viewWidth = viewport.clientWidth;
      if (setWidth <= 0 || viewWidth <= 0) return;

      const segments = Math.max(3, Math.min(8, Math.ceil((viewWidth * 2.2) / setWidth)));
      setSegmentCount(segments);
      setScrollEnd(`-${100 / segments}%`);
      const pxPerSec = 48;
      setDurationSec(Math.max(28, Math.min(72, (setWidth * segments) / pxPerSec)));
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (measureRef.current) ro.observe(measureRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items]);

  const segments = useMemo(() => {
    return Array.from({ length: segmentCount }, (_, segment) => segment);
  }, [segmentCount]);

  if (!items.length) return null;

  return (
    <div className={stripClass} aria-label="Services">
      <div ref={viewportRef} className={`home-marquee-viewport ${viewportClass}`.trim()}>
        <div className="home-marquee-measure" ref={measureRef} aria-hidden="true">
          {items.map((item, index) => (
            <MarqueePill key={`m-${item.title}-${index}`} item={item} index={index} segment={0} measure />
          ))}
        </div>
        <div
          className={`home-marquee-track${introReady ? " home-marquee-track--intro-ready" : ""}`}
          style={
            {
              "--marquee-end": scrollEnd,
              "--marquee-duration": `${durationSec}s`,
            } as CSSProperties
          }
        >
          {segments.map((segment) =>
            items.map((item, index) => (
              <MarqueePill
                key={`${segment}-${item.title}-${index}`}
                item={item}
                index={index}
                segment={segment}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
}
