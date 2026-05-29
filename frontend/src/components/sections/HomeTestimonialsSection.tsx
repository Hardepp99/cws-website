import { Reveal } from "@/components/ui/Reveal";
import { filterPublishedItems } from "@/lib/homepage/item-status";
import type { HomepageSection } from "@/lib/wordpress/types";

const TESTIMONIAL_TONES = ["blue", "purple", "green"] as const;

function HomeSectionHead({
  badge,
  title,
  subtitle,
}: {
  badge?: string;
  title?: string;
  subtitle?: string;
}) {
  if (!badge && !title && !subtitle) return null;
  return (
    <div className="home-section-head home-section-head--center">
      {badge ? <span className="home-eyebrow">{badge}</span> : null}
      {title ? <h2>{title}</h2> : null}
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}

export function HomeTestimonialsSection({ section }: { section: HomepageSection }) {
  const items = filterPublishedItems(
    (section.testimonials as { name: string; text: string; role: string; status?: string }[]) || [],
  );
  if (!items.length) return null;

  return (
    <section className="testimonials-section home-testimonials corp-section" id="testimonials">
      <div className="corp-container">
        <Reveal variant="fade-up">
          <HomeSectionHead
            badge={section.badge as string}
            title={section.title as string}
            subtitle={section.subtitle as string}
          />
        </Reveal>
        <div className="home-testimonials__grid">
          {items.map((t, i) => {
            const tone = TESTIMONIAL_TONES[i % TESTIMONIAL_TONES.length];
            return (
              <Reveal key={`${t.name}-${i}`} variant="fade-up" delay={i * 80}>
                <article className={`testimonial-card testimonial-card--${tone}`}>
                  <span className="testimonial-card__mark" aria-hidden="true">
                    &ldquo;
                  </span>
                  <blockquote className="testimonial-card__text">{t.text}</blockquote>
                  <footer className="testimonial-card__footer">
                    <cite className="testimonial-card__name">{t.name}</cite>
                    {t.role ? <span className="testimonial-card__tag">{t.role}</span> : null}
                  </footer>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
