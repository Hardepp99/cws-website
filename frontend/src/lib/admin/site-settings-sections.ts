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
  return flat;
}
