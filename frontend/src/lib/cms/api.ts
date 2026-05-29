import { cmsApiEnabled, cmsFetch } from "./client";
import { decodeHtmlEntities } from "@/lib/text";
import { emptySiteMenus, emptySiteSettings, normalizeSiteSettings } from "@/lib/wordpress/fallback";
import type { GmbApiPayload } from "@/lib/gmb/from-api";
import {
  capPortfolioHomeItemsByCategory,
  DEFAULT_PORTFOLIO_HOME_PER_CATEGORY,
  parsePortfolioHomeMax,
} from "@/lib/portfolio/home-limit";
import type { PortfolioHomePayload, PortfolioItem } from "@/lib/wordpress/portfolio-types";
import type {
  BlogPost,
  MenuItem,
  PricingOptions,
  ResolvedContent,
  ServiceDetail,
  ServiceLanding,
  SiteMenus,
  SiteSettings,
  WpPage,
} from "@/lib/wordpress/types";

function normalizeMenuItem(item: MenuItem): MenuItem {
  return {
    ...item,
    label: decodeHtmlEntities(item.label),
    children: item.children?.map(normalizeMenuItem),
  };
}

function normalizeMenus(menus: SiteMenus): SiteMenus {
  return {
    primary: menus.primary.map(normalizeMenuItem),
    footer: menus.footer.map(normalizeMenuItem),
    footerServices: menus.footerServices.map(normalizeMenuItem),
    footerProducts: menus.footerProducts.map(normalizeMenuItem),
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await cmsFetch<SiteSettings>("/api/v1/settings");
  return data ? normalizeSiteSettings(data) : emptySiteSettings();
}

export async function getPricingOptions(): Promise<PricingOptions> {
  const data = await cmsFetch<PricingOptions>("/api/v1/pricing-options");
  return (
    data ?? {
      bundles: [],
      serviceGroups: [],
      budgetRanges: [],
      timelines: [],
    }
  );
}

export async function getMenus(): Promise<SiteMenus> {
  const data = await cmsFetch<SiteMenus>("/api/v1/menus");
  return data ? normalizeMenus(data) : emptySiteMenus();
}

export async function getHomepage(): Promise<WpPage | null> {
  return cmsFetch<WpPage>("/api/v1/homepage");
}

export async function getPageBySlug(slug: string): Promise<WpPage | null> {
  const page = await cmsFetch<WpPage>(`/api/v1/pages/${encodeURIComponent(slug)}`);
  return page ? { ...page, title: decodeHtmlEntities(page.title) } : null;
}

export async function getServiceLanding(slug: string): Promise<ServiceLanding | null> {
  return cmsFetch<ServiceLanding>(`/api/v1/landings/${encodeURIComponent(slug)}`);
}

export async function getAllServiceLandings(): Promise<ServiceLanding[]> {
  return (await cmsFetch<ServiceLanding[]>("/api/v1/landings")) ?? [];
}

export async function getServiceDetail(slug: string): Promise<ServiceDetail | null> {
  return cmsFetch<ServiceDetail>(`/api/v1/services/${encodeURIComponent(slug)}`);
}

export async function getContentBySlug(slug: string): Promise<ResolvedContent | null> {
  const normalized = slug === "index" ? "home" : slug.replace(/\/$/, "");

  if (normalized === "home" || normalized === "") {
    const home = await getHomepage();
    if (!home) return null;
    return { type: "page", data: home };
  }

  const page = await getPageBySlug(normalized);
  if (page) return { type: "page", data: page };

  const landing = await getServiceLanding(normalized);
  if (landing) return { type: "service_landing", data: landing };

  const service = await getServiceDetail(normalized);
  if (service) return { type: "service", data: service };

  return null;
}

export async function getAllSlugs(): Promise<string[]> {
  const slugs = await cmsFetch<string[]>("/api/v1/slugs");
  return slugs?.length ? slugs : [];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return (await cmsFetch<BlogPost[]>("/api/v1/blog")) ?? [];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getGmbLive(): Promise<GmbApiPayload | null> {
  return cmsFetch<GmbApiPayload>("/api/v1/gmb");
}

export async function getPortfolioHome(): Promise<PortfolioHomePayload> {
  const settings = await getSiteSettings();
  const maxPerCategory = parsePortfolioHomeMax(settings.portfolioHomeMax);
  const portfolioSettings = {
    badge: settings.portfolioBadge ?? "Local work",
    title: settings.portfolioTitle ?? "Explore the line-up.",
    subtitle: settings.portfolioSubtitle ?? "Websites, stores, and campaigns for businesses across the Tricity.",
    ctaLabel: settings.portfolioCtaLabel ?? "View all work",
    ctaHref: settings.portfolioCtaHref ?? "/portfolio",
    maxPerCategory,
  };

  try {
    const data = await cmsFetch<PortfolioHomePayload>("/api/v1/portfolio/home");
    if (data?.items?.length) {
      return {
        items: capPortfolioHomeItemsByCategory(data.items, maxPerCategory),
        settings: { ...portfolioSettings, ...data.settings, maxPerCategory },
      };
    }
  } catch {
    /* CMS offline */
  }

  const { PORTFOLIO_FALLBACK_ITEMS } = await import("@/data/portfolio-fallback");
  const homeItems = PORTFOLIO_FALLBACK_ITEMS.filter((i) => i.showOnHomepage !== false);

  return {
    items: capPortfolioHomeItemsByCategory(homeItems, maxPerCategory),
    settings: portfolioSettings,
  };
}

export async function getPortfolioAll(): Promise<PortfolioItem[]> {
  const { PORTFOLIO_FALLBACK_ITEMS } = await import("@/data/portfolio-fallback");
  try {
    const items = await cmsFetch<PortfolioItem[]>("/api/v1/portfolio");
    if (items?.length) return items;
  } catch {
    /* CMS offline */
  }
  return PORTFOLIO_FALLBACK_ITEMS;
}

export function isCmsActive(): boolean {
  return cmsApiEnabled();
}
