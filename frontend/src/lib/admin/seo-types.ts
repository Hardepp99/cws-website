export type SeoRobots = "index" | "noindex";

export type AdminSeoData = {
  focusKeyword: string;
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogImage: string;
  robots: SeoRobots;
};

export const EMPTY_SEO: AdminSeoData = {
  focusKeyword: "",
  title: "",
  description: "",
  keywords: "",
  canonical: "",
  ogImage: "",
  robots: "index",
};

export function parseSeoJson(raw: unknown): AdminSeoData {
  if (!raw) return { ...EMPTY_SEO };
  let o: Record<string, unknown> = {};
  if (typeof raw === "string") {
    try {
      o = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return { ...EMPTY_SEO };
    }
  } else if (typeof raw === "object") {
    o = raw as Record<string, unknown>;
  }
  return {
    focusKeyword: String(o.focusKeyword ?? o.focus_keyword ?? ""),
    title: String(o.title ?? ""),
    description: String(o.description ?? ""),
    keywords: String(o.keywords ?? ""),
    canonical: String(o.canonical ?? ""),
    ogImage: String(o.ogImage ?? o.og_image ?? ""),
    robots: o.robots === "noindex" ? "noindex" : "index",
  };
}

export function seoFromPageRow(row: {
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  seo_canonical?: string;
  seo_og_image?: string;
  seo_robots?: string;
  seo_focus_keyword?: string;
  title?: string;
}): AdminSeoData {
  return {
    focusKeyword: String(row.seo_focus_keyword ?? ""),
    title: String(row.seo_title ?? row.title ?? ""),
    description: String(row.seo_description ?? ""),
    keywords: String(row.seo_keywords ?? ""),
    canonical: String(row.seo_canonical ?? ""),
    ogImage: String(row.seo_og_image ?? ""),
    robots: row.seo_robots === "noindex" ? "noindex" : "index",
  };
}

export function seoToPagePayload(seo: AdminSeoData) {
  return {
    seo_title: seo.title,
    seo_description: seo.description,
    seo_keywords: seo.keywords,
    seo_canonical: seo.canonical,
    seo_og_image: seo.ogImage,
    seo_robots: seo.robots,
    seo_focus_keyword: seo.focusKeyword,
  };
}

export function seoToJson(seo: AdminSeoData) {
  return {
    focusKeyword: seo.focusKeyword,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    canonical: seo.canonical,
    ogImage: seo.ogImage,
    robots: seo.robots,
  };
}
