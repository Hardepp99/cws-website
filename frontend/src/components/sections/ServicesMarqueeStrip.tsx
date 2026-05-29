import Link from "next/link";

export type MarqueeItem = {
  title?: string;
  href?: string;
  letter?: string;
  status?: string;
};

export function ServicesMarqueeStrip({
  items,
  className = "",
}: {
  items: MarqueeItem[];
  className?: string;
}) {
  if (!items.length) return null;
  const doubled = [...items, ...items];

  return (
    <div className={`home-marquee-strip ${className}`.trim()} aria-label="Services">
      <div className="home-marquee-viewport home-marquee-viewport--full">
        <div className="home-marquee-track">
          {doubled.map((item, i) => (
            <Link key={`${item.title}-${i}`} href={item.href || "/services"} className="home-marquee-pill">
              <span className="home-marquee-letter">{item.letter || item.title?.charAt(0)}</span>
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
