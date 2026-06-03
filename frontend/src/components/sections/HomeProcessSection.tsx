import { HomeSectionItems } from "@/components/homepage/items/HomeSectionItems";
import { HomeMacIcon } from "@/components/ui/HomeMacIcon";
import { Reveal } from "@/components/ui/Reveal";
import type { HomeDisplayItem } from "@/lib/homepage/home-display-item";
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

function sectionVisual(section: HomepageSection): string | undefined {
  const v = section.itemsVisual ?? section.items_visual;
  return typeof v === "string" ? v : undefined;
}

export function HomeProcessSection({ section }: { section: HomepageSection }) {
  const steps = filterPublishedItems(
    (section.steps as { icon: string; title: string; description: string; status?: string }[]) || [],
  ).map(
    (s, i): HomeDisplayItem => ({
      title: s.title,
      desc: s.description,
      icon: s.icon || "fas fa-arrow-right",
      number: String(i + 1).padStart(2, "0"),
      tone: undefined,
    }),
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
        <HomeSectionItems
          items={steps}
          columns={4}
          visual={sectionVisual(section)}
          gridExtraClass="home-process__grid"
          renderItem={(item, i) => {
            const tone = resolveMacTone(undefined, i);
            return (
              <article className="home-process__step home-mac-card" data-tone={tone}>
                <HomeMacIcon
                  icon={item.icon || "fas fa-arrow-right"}
                  tone={tone}
                  index={i}
                  size="md"
                  className="home-process__step-icon"
                />
                <span className="home-process__index">{item.number}</span>
                <h3 className="home-process__step-title">{item.title}</h3>
                <p className="home-process__step-desc">{item.desc}</p>
              </article>
            );
          }}
        />
      </div>
    </section>
  );
}
