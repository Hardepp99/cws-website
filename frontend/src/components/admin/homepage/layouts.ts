export const HOMEPAGE_LAYOUTS: { value: string; label: string }[] = [
  { value: "hero_slider", label: "Hero Slider" },
  { value: "trust_badges", label: "Trust Badges" },
  { value: "services_marquee", label: "Services Marquee" },
  { value: "services_grid", label: "Services Grid" },
  { value: "industries", label: "Industries" },
  { value: "website_types", label: "Website Types" },
  { value: "process", label: "Process" },
  { value: "why_codify", label: "Why Choose Us" },
  { value: "about", label: "About" },
  { value: "portfolio", label: "Portfolio" },
  { value: "tech_stack", label: "Tech Stack" },
  { value: "pricing_packages", label: "Pricing Packages" },
  { value: "guarantees", label: "Guarantees" },
  { value: "testimonials", label: "Testimonials" },
  { value: "faq", label: "FAQ" },
  { value: "courses", label: "Courses" },
  { value: "blog_preview", label: "Blog Preview" },
  { value: "cta", label: "CTA Band" },
  { value: "seo_rich", label: "SEO Rich Content" },
  { value: "contact_preview", label: "Contact Preview" },
];

const GRID = new Set([
  "trust_badges",
  "services_marquee",
  "services_grid",
  "industries",
  "website_types",
  "tech_stack",
  "pricing_packages",
  "guarantees",
  "faq",
]);

export function isGridLayout(layout: string): boolean {
  return GRID.has(layout);
}

export function layoutLabel(layout: string): string {
  return HOMEPAGE_LAYOUTS.find((l) => l.value === layout)?.label || layout;
}

export function emptySection(layout: string): Record<string, unknown> {
  const base: Record<string, unknown> = { acfFcLayout: layout };
  if (layout === "hero_slider") {
    return {
      ...base,
      eyebrow: "",
      headline: "",
      headlineParts: [],
      subheadline: "",
      ctaPrimary: { label: "Ask price", href: "#ask-price" },
      ctaSecondary: { label: "Our services", href: "/services" },
      slides: [{ image: { url: "/assets/images/hero1.png" } }],
      personImage: "",
      personImageAlt: "Team member",
      stats: [],
    };
  }
  if (layout === "cta" || layout === "contact_preview") {
    return {
      ...base,
      title: "",
      subtitle: "",
      ctaLabel: layout === "cta" ? "Ask price" : "Contact us",
      ctaHref: layout === "cta" ? "#ask-price" : "/contact",
    };
  }
  if (isGridLayout(layout)) {
    return { ...base, badge: "", title: "", subtitle: "", items: [] };
  }
  return { ...base, badge: "", title: "", subtitle: "" };
}
