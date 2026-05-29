"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import type { FaqItem } from "@/lib/wordpress/types";

export type PageFaqSectionProps = {
  items: FaqItem[];
  title?: string;
  subtitle?: string;
  badge?: string;
  id?: string;
};

function FaqSkeleton() {
  return (
    <div className="page-faq__skeleton" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="page-faq__skeleton-item" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="page-faq__skeleton-q" />
          <div className="page-faq__skeleton-a" />
        </div>
      ))}
    </div>
  );
}

export function PageFaqSection({
  items,
  title = "Frequently asked questions",
  subtitle,
  badge = "FAQ",
  id = "page-faq",
}: PageFaqSectionProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(t);
  }, [items]);

  if (!items.length) return null;

  return (
    <section className="page-faq corp-section" id={id} aria-labelledby={`${id}-heading`}>
      <div className="corp-container">
        <header className="page-faq__head text-center">
          {badge ? <span className="section-badge">{badge}</span> : null}
          <h2 id={`${id}-heading`} className="section-title mt-2">
            {title}
          </h2>
          {subtitle ? <p className="section-subtitle mx-auto">{subtitle}</p> : null}
        </header>

        {!ready ? (
          <FaqSkeleton />
        ) : (
          <div className="page-faq__list">
            {items.map((item, i) => (
              <Reveal key={`${item.question}-${i}`} variant="fade-up" delay={i * 45}>
                <details className="page-faq__item">
                  <summary className="page-faq__question">
                    <span className="page-faq__q-text">{item.question}</span>
                    <span className="page-faq__chevron" aria-hidden="true">
                      <i className="fas fa-chevron-down" />
                    </span>
                  </summary>
                  <div className="page-faq__answer">
                    <p>{item.answer}</p>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
