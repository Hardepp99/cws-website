import { ServicesMarqueeStrip, type MarqueeItem } from "@/components/sections/ServicesMarqueeStrip";

export function ServicesMarqueeRail({
  items,
  attached = false,
  tone = "dark",
}: {
  items: MarqueeItem[];
  /** Flush under hero stats tray */
  attached?: boolean;
  /** `light` when sitting below dark hero */
  tone?: "dark" | "light";
}) {
  if (!items.length) return null;

  const className = [
    "home-marquee-rail",
    attached ? "home-marquee-rail--hero-attached" : "",
    tone === "light" ? "home-marquee-rail--light" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const Tag = attached ? "div" : "section";

  return (
    <Tag className={className} aria-label="Services we offer">
      {!attached ? (
        <div className="home-marquee-rail__bg" aria-hidden="true">
          <span className="home-marquee-rail__glow home-marquee-rail__glow--a" />
          <span className="home-marquee-rail__glow home-marquee-rail__glow--b" />
          <span className="home-marquee-rail__glow home-marquee-rail__glow--c" />
        </div>
      ) : null}
      <ServicesMarqueeStrip items={items} variant="rail" />
    </Tag>
  );
}
