import { HomeMacIcon } from "@/components/ui/HomeMacIcon";
import { Reveal } from "@/components/ui/Reveal";
import { filterPublishedItems } from "@/lib/homepage/item-status";
import { resolveMacTone } from "@/lib/homepage/mac-tones";
import type { HomepageSection } from "@/lib/wordpress/types";

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
        {badge ? <span className="home-eyebrow home-eyebrow--mac home-process__eyebrow">{badge}</span> : null}
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
        <div className="home-process__grid home-grid-balanced home-grid-balanced--4">
          {steps.map((step, i) => {
            const tone = resolveMacTone(undefined, i);
            return (
              <div key={step.title} className="home-grid-balanced__item">
                <Reveal variant="fade-up" delay={i * 110}>
                  <article className="home-process__step home-mac-card" data-tone={tone}>
                  <HomeMacIcon
                    icon={step.icon || "fas fa-arrow-right"}
                    tone={tone}
                    index={i}
                    size="md"
                    className="home-process__step-icon"
                  />
                  <span className="home-process__index">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="home-process__step-title">{step.title}</h3>
                  <p className="home-process__step-desc">{step.description}</p>
                  </article>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
