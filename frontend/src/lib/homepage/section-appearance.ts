import type { HomepageSection } from "@/lib/wordpress/types";

export type { LightPastelTint } from "@/lib/page-section-tint";
export { pickRandomLightPastelTint } from "@/lib/page-section-tint";

export type SectionTheme = "light" | "dark";

/**
 * Fixed light: hero, about, footer.
 * After about: DARK → LIGHT → DARK → LIGHT → DARK (strict alternation).
 */
export const HOMEPAGE_SECTION_THEMES: Record<string, SectionTheme> = {
  about: "light",
  services_grid: "dark",
  process: "light",
  testimonials: "dark",
  portfolio: "light",
  cta: "dark",
};

/** Curated Unsplash URLs — IT / workspace themed (replace per section in admin). */
export const DEFAULT_SECTION_BACKDROPS: Record<string, string> = {
  services_grid:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80",
  services_marquee:
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=80",
  process: "/assets/images/process-hero-mac-students.jpg",
  testimonials:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=80",
  portfolio:
    "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1920&q=80",
  cta: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80",
  trust_badges:
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1920&q=80",
  industries:
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80",
  website_types:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80",
  tech_stack:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80",
  why_codify:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80",
  faq: "https://images.unsplash.com/photo-1521737711862-e3b97375f902?auto=format&fit=crop&w=1920&q=80",
  courses:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80",
  blog_preview:
    "https://images.unsplash.com/photo-1432888622747-4eb9ead71f14?auto=format&fit=crop&w=1920&q=80",
  about:
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1920&q=80",
  contact_preview:
    "https://images.unsplash.com/photo-1423666639041-f56000c27a9e?auto=format&fit=crop&w=1920&q=80",
  seo_rich:
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1920&q=80",
};

const HERO_LAYOUTS = new Set(["hero_slider"]);

export function isHeroLayout(layout: string): boolean {
  return HERO_LAYOUTS.has(layout);
}

export function resolveSectionTheme(section: HomepageSection, bandIndex: number): SectionTheme {
  const layout = String(section.acfFcLayout ?? "");
  const canonical = HOMEPAGE_SECTION_THEMES[layout];
  if (canonical) return canonical;

  const raw = String(section.sectionTheme ?? section.section_theme ?? "auto").toLowerCase();
  if (raw === "light" || raw === "dark") return raw;
  return bandIndex % 2 === 0 ? "light" : "dark";
}

/** Enforce canonical homepage band sequence (overrides CMS auto/wrong theme). */
export function applyCanonicalSectionTheme(section: HomepageSection): HomepageSection {
  const layout = String(section.acfFcLayout ?? "");
  const theme = HOMEPAGE_SECTION_THEMES[layout];
  if (!theme) return section;
  return { ...section, sectionTheme: theme };
}

export function resolveSectionBackdrop(section: HomepageSection): string {
  const layout = String(section.acfFcLayout ?? "");
  if (layout === "about") return "";
  const custom = section.backdropImage ?? section.backdrop_image;
  if (typeof custom === "string" && custom.trim()) return custom.trim();
  return DEFAULT_SECTION_BACKDROPS[layout] ?? "";
}

export function resolveSectionBackdropStrength(section: HomepageSection, theme: SectionTheme): number {
  const raw = section.backdropStrength ?? section.backdrop_strength;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Math.min(100, Math.max(0, raw));
  }
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = parseInt(raw, 10);
    if (Number.isFinite(n)) return Math.min(100, Math.max(0, n));
  }
  return theme === "dark" ? 38 : 24;
}
