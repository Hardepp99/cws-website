import { serializeGmbReviews } from "@/lib/gmb/resolve";
import { DEFAULT_GMB_REVIEWS } from "@/lib/gmb/defaults";
import type { SiteSettings } from "@/lib/wordpress/types";

export type SettingsFieldType = "text" | "textarea" | "color" | "media";

export type SettingsFieldDef = {
  key: keyof SiteSettings & string;
  label: string;
  hint?: string;
  type?: SettingsFieldType;
};

export type SettingsSectionDef = {
  id: string;
  label: string;
  icon: string;
  description?: string;
  fields: SettingsFieldDef[];
};

export const SITE_SETTINGS_SECTIONS: SettingsSectionDef[] = [
  {
    id: "identity",
    label: "Site Identity",
    icon: "fa-id-card",
    description: "Logo and branding images used in the header and footer.",
    fields: [
      { key: "logoUrl", label: "Logo", type: "media" },
      { key: "logoWhiteUrl", label: "Logo (on dark backgrounds)", type: "media" },
    ],
  },
  {
    id: "colors",
    label: "Colors",
    icon: "fa-palette",
    description: "Brand colors applied across the public site.",
    fields: [
      { key: "primaryColor", label: "Primary color", type: "color" },
      { key: "secondaryColor", label: "Secondary color", type: "color" },
    ],
  },
  {
    id: "contact",
    label: "Contact Information",
    icon: "fa-address-book",
    description: "Shown in the top bar, footer, and contact areas.",
    fields: [
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "address", label: "Address", type: "textarea" },
    ],
  },
  {
    id: "social",
    label: "Social Media",
    icon: "fa-share-nodes",
    description: "Social profile links in the header and footer.",
    fields: [
      { key: "facebook", label: "Facebook URL" },
      { key: "linkedin", label: "LinkedIn URL" },
      { key: "instagram", label: "Instagram URL" },
    ],
  },
  {
    id: "portfolio",
    label: "Portfolio section",
    icon: "fa-images",
    description: "Homepage portfolio block — title and how many projects to show per category tab.",
    fields: [
      { key: "portfolioBadge", label: "Section badge" },
      { key: "portfolioTitle", label: "Section title" },
      { key: "portfolioSubtitle", label: "Section subtitle", type: "textarea" },
      {
        key: "portfolioHomeMax",
        label: "Max per category on homepage",
        hint: "Number 1–24 (default 5). Full list on /portfolio. Manage projects under Admin → Portfolio.",
      },
      { key: "portfolioCtaLabel", label: "Button label" },
      { key: "portfolioCtaHref", label: "Button link", hint: "e.g. /portfolio" },
    ],
  },
  {
    id: "gmb",
    label: "Google Business",
    icon: "fa-star",
    description:
      "Your Google Maps listing and reviews shown on the homepage hero. Tick “Show on homepage” for each review you want in the carousel.",
    fields: [
      {
        key: "gmbMapsUrl",
        label: "Google Maps listing URL",
        hint: "Open your GMB → Share → Copy link and paste here.",
      },
      {
        key: "gmbPlaceId",
        label: "Google Place ID (optional)",
        hint: "Auto-filled when you sync. Advanced: ChIJ… from Places API.",
      },
      {
        key: "gmbPlaceQuery",
        label: "Find place by name",
        hint: "Used on first sync if Place ID is empty.",
      },
      { key: "gmbPlaceName", label: "Business name (label under stars)" },
      { key: "gmbRating", label: "Overall rating (filled by Google sync)" },
      { key: "gmbReviewCount", label: "Review count (filled by Google sync)" },
      {
        key: "gmbUseLive",
        label: "Use live Google reviews",
        hint: "Set to 1 (yes) or 0 (no). Requires API key in cms/config.php.",
      },
      {
        key: "gmbCacheHours",
        label: "Cache hours",
        hint: "Refresh from Google after this many hours (default 12).",
      },
    ],
  },
  {
    id: "footer",
    label: "Footer",
    icon: "fa-window-maximize",
    description: "Footer copy and column headings.",
    fields: [
      { key: "footerText", label: "Footer description", type: "textarea" },
      { key: "footerCompanyTitle", label: "Company column title" },
      { key: "footerServicesTitle", label: "Services column title" },
      { key: "footerProductsTitle", label: "Products column title" },
    ],
  },
];

export const ALL_SETTINGS_FIELDS = SITE_SETTINGS_SECTIONS.flatMap((s) => s.fields);

export function emptySettingsFromFields(): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const f of ALL_SETTINGS_FIELDS) {
    flat[f.key] = "";
  }
  flat.gmbReviewsJson = serializeGmbReviews(DEFAULT_GMB_REVIEWS);
  return flat;
}

/** Keys stored in site_settings but not shown as simple text fields */
export const GMB_REVIEWS_JSON_KEY = "gmbReviewsJson";
