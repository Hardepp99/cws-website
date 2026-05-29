import type { ServiceGridItem } from "@/components/sections/ServiceGridCard";
import { resolveServiceItemImage } from "@/lib/homepage/service-item-image";

const u = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=960&h=540&q=85`;

/** Live HD images + copy for homepage “What we do” cards. */
export const DEFAULT_SERVICE_GRID_ITEMS: ServiceGridItem[] = [
  {
    icon: "fas fa-paint-brush",
    image: u("photo-1561070791-2526d30994b5"),
    title: "Web design",
    desc: "Clear, modern layouts for mobile and desktop — so visitors grasp your offer in seconds and know exactly what to do next.",
    href: "/ui-ux-design-zirakpur",
    tone: "pink",
  },
  {
    icon: "fas fa-code",
    image: u("photo-1498050108023-c5249f4df085"),
    title: "Website development",
    desc: "Fast, secure corporate sites and landing pages with forms, WhatsApp, and analytics wired in from day one — built on clean, maintainable code.",
    href: "/website-development-zirakpur",
    tone: "blue",
  },
  {
    icon: "fas fa-mobile-alt",
    image: u("photo-1512945903694-92d7a22944f4"),
    title: "Mobile apps",
    desc: "Android and iOS apps that feel native, with smooth onboarding and the features your customers actually use — plus cross-platform when speed matters.",
    href: "/mobile-app-development-zirakpur",
    tone: "green",
  },
  {
    icon: "fas fa-bullhorn",
    image: u("photo-1460925895917-afdab827c52f"),
    title: "Digital marketing",
    desc: "Google Ads, Meta campaigns, and landing pages planned around real leads — with simple weekly reports, not vanity metrics.",
    href: "/digital-marketing-zirakpur",
    tone: "orange",
  },
  {
    icon: "fas fa-robot",
    image: u("photo-1551288049-bebda4e38f71"),
    title: "Custom software",
    desc: "Dashboards, CRM tools, booking systems, and APIs shaped around how your team works — so spreadsheets are not your operating system.",
    href: "/custom-software-development-zirakpur",
    tone: "grey",
  },
  {
    icon: "fas fa-pen-nib",
    image: u("photo-1626785774573-4b7999ee4feb"),
    title: "Brand & graphics",
    desc: "Logos, pitch decks, social kits, and campaign creatives that look sharp everywhere — consistent, on-brand, ready to ship.",
    href: "/graphic-designing-zirakpur",
    tone: "pink",
  },
  {
    icon: "fas fa-cart-shopping",
    image: u("photo-1556742049-0cfed4f6a45d"),
    title: "Ecommerce",
    desc: "Shopify, WooCommerce, or custom stores with smooth checkout, easy admin, and product pages written to turn browsers into buyers.",
    href: "/ecommerce-website-zirakpur",
    tone: "green",
  },
  {
    icon: "fas fa-chart-line",
    image: u("photo-1432888498266-38ffec3eaf4a"),
    title: "SEO & content",
    desc: "Technical SEO, service-area pages, and useful content so you show up when people search in Zirakpur, Chandigarh, Mohali, and beyond.",
    href: "/seo-services-zirakpur",
    tone: "blue",
  },
];

export const DEFAULT_SERVICES_GRID_SUBTITLE =
  "From first wireframe to launch day — one team for design, build, and measurable growth across Punjab.";

const LEGACY_SERVICE_IMAGES = new Set([
  "/assets/images/hero1.png",
  "/assets/images/hero2.png",
  "/assets/images/hero3.png",
]);

const LEGACY_SERVICE_DESCS = new Set([
  "Layouts that build trust and guide action",
  "Fast corporate sites and landing pages",
  "Android, iOS, and cross-platform",
  "SEO, ads, and campaigns that match intent",
  "Dashboards, CRM tools, and APIs",
  "Logos, decks, and campaign assets",
  "Shopify, WooCommerce, custom stores",
  "Technical SEO and location pages",
  "Design, engineering, and growth — one team, clear delivery.",
]);

function defaultForItem(item: ServiceGridItem, index: number): ServiceGridItem {
  return (
    DEFAULT_SERVICE_GRID_ITEMS.find((d) => d.href === item.href) ??
    DEFAULT_SERVICE_GRID_ITEMS[index % DEFAULT_SERVICE_GRID_ITEMS.length]
  );
}

/** Upgrade CMS placeholders to live images + richer copy. */
export function enrichServiceGridItems(items: ServiceGridItem[]): ServiceGridItem[] {
  return items.map((item, index) => {
    const fallback = defaultForItem(item, index);
    const image = resolveServiceItemImage(item);
    const legacyImage = !image || LEGACY_SERVICE_IMAGES.has(image);
    const legacyDesc = !item.desc?.trim() || LEGACY_SERVICE_DESCS.has(item.desc.trim());

    return {
      ...fallback,
      ...item,
      title: item.title?.trim() || fallback.title,
      href: item.href?.trim() || fallback.href,
      tone: item.tone || fallback.tone,
      icon: item.icon || fallback.icon,
      image: legacyImage ? fallback.image : image,
      desc: legacyDesc ? fallback.desc : item.desc,
    };
  });
}
