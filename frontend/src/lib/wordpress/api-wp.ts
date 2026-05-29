import {
  CWS_ALL_SLUGS,
  CWS_BLOG_POSTS,
  CWS_HOMEPAGE,
  CWS_MENUS,
  CWS_PAGE,
  CWS_SERVICE,
  CWS_SERVICE_LANDING,
  CWS_SERVICE_LANDINGS,
  CWS_PRICING_OPTIONS,
  CWS_SITE_SETTINGS,
} from "./queries";
import { wpQuery } from "./client";
import { decodeHtmlEntities } from "@/lib/text";
import { parseWpJson } from "./parse";
import { emptySiteMenus, emptySiteSettings, normalizeSiteSettings } from "./fallback";
import type {
  BlogPost,
  MenuItem,
  ResolvedContent,
  ServiceDetail,
  ServiceLanding,
  PricingOptions,
  SiteMenus,
  SiteSettings,
  WpPage,
} from "./types";

export async function getSiteSettings(): Promise<SiteSettings> {
  const result = await wpQuery<{ cwsSiteSettings?: string }>(CWS_SITE_SETTINGS);
  if (result?.cwsSiteSettings) {
    return normalizeSiteSettings(parseWpJson<SiteSettings>(result.cwsSiteSettings));
  }
  return emptySiteSettings();
}

export async function getPricingOptions(): Promise<PricingOptions> {
  const result = await wpQuery<{ cwsPricingOptions?: string }>(CWS_PRICING_OPTIONS);
  const parsed = parseWpJson<PricingOptions>(result?.cwsPricingOptions);
  return (
    parsed ?? {
      bundles: [],
      serviceGroups: [],
      budgetRanges: [],
      timelines: [],
    }
  );
}

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

export async function getMenus(): Promise<SiteMenus> {
  const result = await wpQuery<{ cwsMenus?: string }>(CWS_MENUS);
  const parsed = parseWpJson<SiteMenus>(result?.cwsMenus);
  return parsed ? normalizeMenus(parsed) : emptySiteMenus();
}

export async function getHomepage(): Promise<WpPage | null> {
  const result = await wpQuery<{ cwsHomepage?: string }>(CWS_HOMEPAGE);
  return parseWpJson<WpPage>(result?.cwsHomepage);
}

export async function getPageBySlug(slug: string): Promise<WpPage | null> {
  const result = await wpQuery<{ cwsPage?: string }>(CWS_PAGE, { slug });
  const page = parseWpJson<WpPage>(result?.cwsPage);
  return page ? { ...page, title: decodeHtmlEntities(page.title) } : null;
}

export async function getServiceLanding(slug: string): Promise<ServiceLanding | null> {
  const result = await wpQuery<{ cwsServiceLanding?: string }>(CWS_SERVICE_LANDING, { slug });
  return parseWpJson<ServiceLanding>(result?.cwsServiceLanding);
}

export async function getAllServiceLandings(): Promise<ServiceLanding[]> {
  const result = await wpQuery<{ cwsServiceLandings?: string }>(CWS_SERVICE_LANDINGS);
  return parseWpJson<ServiceLanding[]>(result?.cwsServiceLandings) ?? [];
}

export async function getServiceDetail(slug: string): Promise<ServiceDetail | null> {
  const result = await wpQuery<{ cwsService?: string }>(CWS_SERVICE, { slug });
  return parseWpJson<ServiceDetail>(result?.cwsService);
}

export async function getContentBySlug(slug: string): Promise<ResolvedContent | null> {
  const normalized = slug === "index" ? "home" : slug.replace(/\/$/, "");

  if (normalized === "home" || normalized === "") {
    const home = await getHomepage();
    if (!home) return null;
    return { type: "page", data: home };
  }

  const page = await getPageBySlug(normalized);
  if (page) {
    return { type: "page", data: page };
  }

  const landing = await getServiceLanding(normalized);
  if (landing) {
    return { type: "service_landing", data: landing };
  }

  const service = await getServiceDetail(normalized);
  if (service) {
    return { type: "service", data: service };
  }

  return null;
}

export async function getAllSlugs(): Promise<string[]> {
  const result = await wpQuery<{ cwsAllSlugs?: string }>(CWS_ALL_SLUGS);
  const parsed = parseWpJson<string[]>(result?.cwsAllSlugs);
  return parsed?.length ? parsed : [];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const result = await wpQuery<{ cwsBlogPosts?: string }>(CWS_BLOG_POSTS);
  return parseWpJson<BlogPost[]>(result?.cwsBlogPosts) ?? [];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
