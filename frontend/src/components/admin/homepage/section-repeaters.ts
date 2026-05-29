import type { SectionRecord } from "./SectionEditor";
import { newItemId, normalizeItemStatus } from "@/lib/homepage/item-status";

export type RepeaterFieldType = "text" | "textarea" | "number" | "media";

export type RepeaterFieldDef = {
  key: string;
  label: string;
  type?: RepeaterFieldType;
  hint?: string;
  mediaFilter?: "all" | "image" | "audio" | "video" | "document";
};

export type SectionRepeaterDef = {
  /** Key on section JSON (items, testimonials, …) */
  key: string;
  label: string;
  singular: string;
  fields: RepeaterFieldDef[];
  emptyItem: () => SectionRecord;
};

export function getSectionRepeaters(layout: string): SectionRepeaterDef[] {
  const draft = () => ({ id: newItemId(), status: "draft" as const });

  const gridItem = (): SectionRecord => ({
    ...draft(),
    title: "",
    desc: "",
    href: "",
    icon: "fas fa-check",
    tone: "blue",
  });

  const serviceGridItem = (): SectionRecord => ({
    ...draft(),
    title: "",
    desc: "",
    href: "",
    image: "",
    imageUrl: "",
    icon: "fas fa-check",
    tone: "blue",
  });

  const gridFields: RepeaterFieldDef[] = [
    { key: "title", label: "Title" },
    { key: "desc", label: "Description", type: "textarea" },
    { key: "href", label: "Link (optional)" },
    { key: "icon", label: "Icon class (Font Awesome)" },
    { key: "tone", label: "Tone (green, blue, orange, royal)" },
  ];

  const serviceGridFields: RepeaterFieldDef[] = [
    { key: "image", label: "Card image (top)", type: "media", mediaFilter: "image" },
    { key: "title", label: "Title" },
    { key: "desc", label: "Description", type: "textarea" },
    { key: "href", label: "Link" },
    { key: "icon", label: "Fallback icon (if no image)", hint: "Font Awesome class" },
    { key: "tone", label: "Accent (blue, green, pink, orange, grey)" },
  ];

  if (layout === "services_grid") {
    return [
      {
        key: "items",
        label: "Services",
        singular: "Service",
        fields: serviceGridFields,
        emptyItem: serviceGridItem,
      },
    ];
  }

  if (
    layout === "trust_badges" ||
    layout === "industries" ||
    layout === "website_types" ||
    layout === "tech_stack" ||
    layout === "pricing_packages" ||
    layout === "guarantees" ||
    layout === "faq"
  ) {
    return [{ key: "items", label: "Items", singular: "Item", fields: gridFields, emptyItem: gridItem }];
  }

  if (layout === "services_marquee") {
    return [
      {
        key: "items",
        label: "Marquee items",
        singular: "Marquee item",
        fields: [...gridFields, { key: "letter", label: "Letter (marquee)" }],
        emptyItem: () => ({ ...gridItem(), letter: "" }),
      },
    ];
  }

  if (layout === "hero_slider") {
    return [
      {
        key: "marqueeItems",
        label: "Bottom marquee (service pills)",
        singular: "Marquee item",
        fields: [
          { key: "title", label: "Title" },
          { key: "href", label: "Link" },
          { key: "letter", label: "Letter badge" },
        ],
        emptyItem: () => ({ ...draft(), title: "", href: "/services", letter: "" }),
      },
      {
        key: "headlineParts",
        label: "Headline words",
        singular: "Word",
        fields: [
          { key: "text", label: "Word" },
          { key: "tone", label: "Tone (white, green, blue, …)" },
        ],
        emptyItem: () => ({ ...draft(), text: "", tone: "white" }),
      },
      {
        key: "slides",
        label: "Hero slides",
        singular: "Slide",
        fields: [{ key: "imageUrl", label: "Slide image", type: "media", mediaFilter: "image" }],
        emptyItem: () => ({ ...draft(), imageUrl: "/assets/images/hero1.png" }),
      },
      {
        key: "stats",
        label: "Stats",
        singular: "Stat",
        fields: [
          { key: "icon", label: "Icon" },
          { key: "count", label: "Count", type: "number" },
          { key: "label", label: "Label" },
          { key: "tone", label: "Tone" },
        ],
        emptyItem: () => ({ ...draft(), icon: "fas fa-star", count: 0, label: "", tone: "green" }),
      },
    ];
  }

  if (layout === "about") {
    return [
      {
        key: "features",
        label: "Features",
        singular: "Feature",
        fields: gridFields,
        emptyItem: gridItem,
      },
    ];
  }

  if (layout === "testimonials") {
    return [
      {
        key: "testimonials",
        label: "Testimonials",
        singular: "Testimonial",
        fields: [
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "text", label: "Quote", type: "textarea" },
        ],
        emptyItem: () => ({ ...draft(), name: "", role: "", text: "" }),
      },
    ];
  }

  if (layout === "portfolio") {
    return [
      {
        key: "portfolioItems",
        label: "Portfolio items",
        singular: "Portfolio item",
        fields: [
          { key: "title", label: "Title" },
          { key: "image", label: "Image", type: "media", mediaFilter: "image" },
          { key: "href", label: "Link" },
        ],
        emptyItem: () => ({ ...draft(), title: "", image: "", href: "/portfolio" }),
      },
    ];
  }

  if (layout === "why_codify") {
    return [
      {
        key: "cards",
        label: "Cards",
        singular: "Card",
        fields: [
          { key: "icon", label: "Icon" },
          { key: "title", label: "Title" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "number", label: "Number label" },
        ],
        emptyItem: () => ({ ...draft(), icon: "fas fa-check", title: "", description: "", number: "" }),
      },
    ];
  }

  if (layout === "process") {
    return [
      {
        key: "steps",
        label: "Process steps",
        singular: "Step",
        fields: [
          { key: "icon", label: "Icon" },
          { key: "title", label: "Title" },
          { key: "description", label: "Description", type: "textarea" },
        ],
        emptyItem: () => ({ ...draft(), icon: "fas fa-circle", title: "", description: "" }),
      },
    ];
  }

  if (layout === "courses") {
    return [
      {
        key: "courses",
        label: "Courses",
        singular: "Course",
        fields: gridFields,
        emptyItem: gridItem,
      },
    ];
  }

  return [];
}

export function sectionHasRepeaters(layout: string): boolean {
  return getSectionRepeaters(layout).length > 0;
}

export function getRepeaterItems(section: SectionRecord, key: string): SectionRecord[] {
  const raw = section[key];
  if (!Array.isArray(raw)) return [];
  return raw.map((item, index) => {
    const row = typeof item === "object" && item !== null ? { ...(item as SectionRecord) } : {};
    if (!row.id) row.id = `legacy_${key}_${index}`;
    if (!row.status) row.status = "published";
    return row;
  });
}

export function setRepeaterItems(
  section: SectionRecord,
  key: string,
  items: SectionRecord[]
): SectionRecord {
  return { ...section, [key]: items };
}

export function readRepeaterFieldValue(item: SectionRecord, field: RepeaterFieldDef): string {
  if (field.key === "imageUrl" || (field.key === "image" && field.type === "media")) {
    const img = item.image as { url?: string } | string | undefined;
    if (typeof img === "object" && img?.url) return String(img.url);
    return String(item.imageUrl ?? (typeof img === "string" ? img : "") ?? "");
  }
  if (field.key === "desc") {
    return String(item.desc ?? item.description ?? "");
  }
  return String(item[field.key] ?? "");
}

export function writeRepeaterFieldValue(
  item: SectionRecord,
  field: RepeaterFieldDef,
  value: string
): SectionRecord {
  if (field.key === "imageUrl") {
    return { ...item, image: { url: value }, imageUrl: value };
  }
  if (field.key === "image" && field.type === "media") {
    return { ...item, image: value, imageUrl: value };
  }
  if (field.key === "desc") {
    return { ...item, desc: value, description: value };
  }
  if (field.type === "number") {
    return { ...item, [field.key]: Number(value) || 0 };
  }
  return { ...item, [field.key]: value };
}

export function countItemsByStatus(items: SectionRecord[]) {
  const counts = { all: items.length, published: 0, draft: 0, trash: 0 };
  for (const item of items) {
    const st = normalizeItemStatus(item.status);
    counts[st]++;
  }
  return counts;
}
