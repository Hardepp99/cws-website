/**
 * Minimal fallbacks when WordPress is unreachable — not editorial content.
 * All page copy, SEO, and sections must come from the WP database.
 */
import {
  CWS_GMB_MAPS_URL,
  CWS_GMB_PLACE_NAME,
  DEFAULT_GMB_RATING,
  DEFAULT_GMB_REVIEWS,
  DEFAULT_GMB_REVIEW_COUNT,
} from "@/lib/gmb/defaults";
import { serializeGmbReviews } from "@/lib/gmb/resolve";
import { decodeHtmlEntities } from "@/lib/text";
import type { BlogPost, MenuItem, SiteSettings } from "./types";

export function emptySiteSettings(): SiteSettings {
  return {
    phone: "",
    email: "",
    address: "",
    logoUrl: "/assets/images/cws-logo.svg",
    logoWhiteUrl: "/assets/images/cws-logo.svg",
    primaryColor: "#0057FF",
    secondaryColor: "#0088FF",
    footerText: "",
    facebook: "",
    linkedin: "",
    instagram: "",
    gmbMapsUrl: CWS_GMB_MAPS_URL,
    gmbPlaceId: "",
    gmbPlaceQuery: "Creative Web Solutions Zirakpur Punjab",
    gmbPlaceName: CWS_GMB_PLACE_NAME,
    gmbRating: String(DEFAULT_GMB_RATING),
    gmbReviewCount: DEFAULT_GMB_REVIEW_COUNT,
    gmbUseLive: "1",
    gmbCacheHours: "12",
    gmbReviewsCachedAt: "",
    gmbReviewsJson: serializeGmbReviews(DEFAULT_GMB_REVIEWS),
    portfolioBadge: "Local work",
    portfolioTitle: "Clients we have worked with",
    portfolioSubtitle: "Real projects for businesses in Zirakpur, Chandigarh, Mohali & Punjab.",
    portfolioHomeMax: "5",
    portfolioCtaLabel: "View all work",
    portfolioCtaHref: "/portfolio",
  };
}

/** Coerce null/undefined from WordPress JSON into safe strings for layout components. */
export function normalizeSiteSettings(input: Partial<SiteSettings> | null | undefined): SiteSettings {
  const defaults = emptySiteSettings();
  if (!input) return defaults;
  return {
    phone: input.phone ?? defaults.phone,
    email: input.email ?? defaults.email,
    address: decodeHtmlEntities(input.address ?? defaults.address),
    logoUrl: input.logoUrl ?? defaults.logoUrl,
    logoWhiteUrl: input.logoWhiteUrl ?? defaults.logoWhiteUrl,
    primaryColor: input.primaryColor ?? defaults.primaryColor,
    secondaryColor: input.secondaryColor ?? defaults.secondaryColor,
    footerText: decodeHtmlEntities(input.footerText ?? defaults.footerText),
    facebook: input.facebook ?? defaults.facebook,
    linkedin: input.linkedin ?? defaults.linkedin,
    instagram: input.instagram ?? defaults.instagram,
    footerCompanyTitle: input.footerCompanyTitle ?? "Company",
    footerServicesTitle: input.footerServicesTitle ?? "Services",
    footerProductsTitle: decodeHtmlEntities(input.footerProductsTitle ?? "Products & Training"),
    gmbMapsUrl: input.gmbMapsUrl ?? defaults.gmbMapsUrl,
    gmbPlaceId: input.gmbPlaceId ?? defaults.gmbPlaceId,
    gmbPlaceQuery: input.gmbPlaceQuery ?? defaults.gmbPlaceQuery,
    gmbPlaceName: input.gmbPlaceName ?? defaults.gmbPlaceName,
    gmbRating: input.gmbRating ?? defaults.gmbRating,
    gmbReviewCount: input.gmbReviewCount ?? defaults.gmbReviewCount,
    gmbUseLive: input.gmbUseLive ?? defaults.gmbUseLive,
    gmbCacheHours: input.gmbCacheHours ?? defaults.gmbCacheHours,
    gmbReviewsCachedAt: input.gmbReviewsCachedAt ?? defaults.gmbReviewsCachedAt,
    gmbReviewsJson: input.gmbReviewsJson?.trim() ? input.gmbReviewsJson : defaults.gmbReviewsJson,
    portfolioBadge: input.portfolioBadge ?? defaults.portfolioBadge,
    portfolioTitle: input.portfolioTitle ?? defaults.portfolioTitle,
    portfolioSubtitle: input.portfolioSubtitle ?? defaults.portfolioSubtitle,
    portfolioHomeMax: input.portfolioHomeMax ?? defaults.portfolioHomeMax,
    portfolioCtaLabel: input.portfolioCtaLabel ?? defaults.portfolioCtaLabel,
    portfolioCtaHref: input.portfolioCtaHref ?? defaults.portfolioCtaHref,
  };
}

export function emptySiteMenus(): import("./types").SiteMenus {
  return { primary: [], footer: [], footerServices: [], footerProducts: [] };
}

export function getFallbackMenus(): { primary: MenuItem[]; footer: MenuItem[] } {
  return { primary: [], footer: [] };
}

export function getFallbackBlogPosts(): BlogPost[] {
  return [];
}
