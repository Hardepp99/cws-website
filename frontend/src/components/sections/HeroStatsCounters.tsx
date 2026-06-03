import { Reveal } from "@/components/ui/Reveal";
import {
  formatHeroStatCount,
  resolveHeroStats,
  type HeroStatItem,
} from "@/lib/homepage/hero-stats";
import type { HomepageSection } from "@/lib/wordpress/types";

const TONES = ["blue", "green", "royal", "orange"] as const;

function statTone(item: HeroStatItem, index: number): string {
  const t = String(item.tone ?? "").toLowerCase();
  if (TONES.includes(t as (typeof TONES)[number])) return t;
  return TONES[index % TONES.length];
}

export function HeroStatsCounters({ section }: { section: HomepageSection }) {
  const stats = resolveHeroStats(section);
  if (!stats.length) return null;

  return (
    <div className="home-hero-stats" aria-label="Company highlights">
      <div className="home-hero-stats__grid">
        {stats.map((item, i) => {
          const tone = statTone(item, i);
          return (
            <Reveal
              key={`${item.label}-${i}`}
              className="home-hero-stats__cell"
              variant="fade-up"
              trigger="load"
            >
              <article className={`home-hero-stats__card home-hero-stats__card--${tone}`}>
                {item.icon ? (
                  <span className="home-hero-stats__icon" aria-hidden="true">
                    <i className={item.icon} />
                  </span>
                ) : null}
                <div className="home-hero-stats__body">
                  <p className="home-hero-stats__num">{formatHeroStatCount(item.count)}</p>
                  <p className="home-hero-stats__label">{item.label}</p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
