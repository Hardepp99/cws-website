/**
 * Minimal fallbacks when WordPress is unreachable — not editorial content.
 * All page copy, SEO, and sections must come from the WP database.
 */
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
