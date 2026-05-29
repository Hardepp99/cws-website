import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { RichContent } from "@/components/ui/RichContent";
import { DEFAULT_ABOUT_IMAGE_ALT, resolveAboutImageUrl } from "@/lib/homepage/about-image";
import { filterPublishedItems } from "@/lib/homepage/item-status";
import type { HomepageSection } from "@/lib/wordpress/types";

export function HomeAboutSection({ section }: { section: HomepageSection }) {
  const imageUrl = resolveAboutImageUrl(section);
  const badge = (section.badge as string) || "About us";
  const title = (section.title as string) || "Your technology partner in Punjab";
  const subtitle = (section.subtitle as string) || "";
  const html = String(section.content ?? "").trim();
  const features = filterPublishedItems(
    (section.features as { title: string; description: string; status?: string }[]) || [],
  );
  const ctaLabel = (section.ctaLabel as string) || "Learn more about us";
  const ctaHref = (section.ctaHref as string) || "/about";

  return (
    <section
      className="home-about corp-section"
      id="about"
      style={{ "--home-about-image": `url("${imageUrl.replace(/"/g, "%22")}")` } as CSSProperties}
    >
      <div className="home-about__backdrop" aria-hidden="true" />
      <div className="corp-container home-about__wrap">
        <div className="home-about__grid">
          <Reveal variant="slide-left" className="home-about__media">
            <div className="home-about__figure">
              <Image
                src={imageUrl}
                alt={String(section.imageAlt ?? section.image_alt ?? DEFAULT_ABOUT_IMAGE_ALT)}
                fill
                quality={90}
                className="home-about__img"
                sizes="(max-width: 991px) 100vw, min(560px, 50vw)"
                priority
              />
            </div>
          </Reveal>

          <div className="home-about__content">
            <Reveal variant="slide-right" delay={80}>
              <div className="home-about__copy">
                {badge ? <span className="home-eyebrow home-about__eyebrow">{badge}</span> : null}
                {title ? <h2 className="home-about__title">{title}</h2> : null}
                {subtitle && !html ? <p className="home-about__lead">{subtitle}</p> : null}
                {html ? (
                  <RichContent html={html} className="home-about__prose seo-rich-prose" />
                ) : null}
                {!html && features.length > 0 ? (
                  <ul className="home-about__points">
                    {features.map((f) => (
                      <li key={f.title}>
                        <strong>{f.title}</strong>
                        <span>{f.description}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Reveal>
            <Link href={ctaHref} className="home-btn home-btn--primary home-about__cta">
              {ctaLabel}
              <i className="fas fa-arrow-right ms-2" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
