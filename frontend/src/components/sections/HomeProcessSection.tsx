import { Reveal } from "@/components/ui/Reveal";
import { filterPublishedItems } from "@/lib/homepage/item-status";
import type { HomepageSection } from "@/lib/wordpress/types";

/** Apple system accent colors — one per step (01–04). */
const PROCESS_MAC_TONES = ["blue", "purple", "green", "orange"] as const;

function ProcessSectionHead({
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
    <Reveal variant="fade-up">
      <div className="home-section-head home-section-head--center home-process__head">
        {badge ? <span className="home-eyebrow home-process__eyebrow">{badge}</span> : null}
        {title ? <h2 className="home-process__title">{title}</h2> : null}
        {subtitle ? <p className="home-process__subtitle">{subtitle}</p> : null}
      </div>
    </Reveal>
  );
}

export function HomeProcessSection({ section }: { section: HomepageSection }) {
  const steps = filterPublishedItems(
    (section.steps as { icon: string; title: string; description: string; status?: string }[]) || [],
  );
  if (!steps.length) return null;

  return (
    <section className="home-process process-section corp-section" id="process">
      <div className="corp-container">
        <ProcessSectionHead
          badge={section.badge as string}
          title={section.title as string}
          subtitle={section.subtitle as string}
        />
        <div className="home-process__grid">
          {steps.map((step, i) => (
            <Reveal key={step.title} variant="fade-up" delay={i * 70}>
              <article
                className="home-process__step"
                data-tone={PROCESS_MAC_TONES[i % PROCESS_MAC_TONES.length]}
              >
                <span className="home-process__index">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="home-process__step-title">{step.title}</h3>
                <p className="home-process__step-desc">{step.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
