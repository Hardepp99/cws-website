import type { ServiceGridItem } from "@/components/sections/ServiceGridCard";
import { resolveServiceItemImage } from "@/lib/homepage/service-item-image";

const u = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=960&h=540&q=85`;

/** Homepage service cards — worldwide agency positioning. */
export const DEFAULT_SERVICE_GRID_ITEMS: ServiceGridItem[] = [
  {
    icon: "fas fa-paint-brush",
    image: u("photo-1561070791-2526d30994b5"),
    title: "Web design",
    desc: "Bold, on-brand interfaces that guide visitors to action — desktop and mobile, built for trust at first scroll.",
    href: "/ui-ux-design-zirakpur",
    tone: "pink",
  },
  {
    icon: "fas fa-code",
    image: u("photo-1498050108023-c5249f4df085"),
    title: "Website development",
    desc: "Fast, secure sites and landing pages with forms, CRM hooks, and analytics baked in — code your team can extend.",
    href: "/website-development-zirakpur",
    tone: "blue",
  },
  {
    icon: "fas fa-mobile-alt",
    image: u("photo-1512945903694-92d7a22944f4"),
    title: "Mobile apps",
    desc: "Polished Android & iOS experiences users keep — onboarding, push, payments, and admin when you need scale.",
    href: "/mobile-app-development-zirakpur",
    tone: "green",
  },
  {
    icon: "fas fa-bullhorn",
    image: u("photo-1460925895917-afdab827c52f"),
    title: "Digital marketing",
    desc: "Google Ads, Meta, and landing pages engineered for leads — weekly clarity on cost per enquiry, not vanity charts.",
    href: "/digital-marketing-zirakpur",
    tone: "orange",
  },
  {
    icon: "fas fa-robot",
    image: u("photo-1551288049-bebda4e38f71"),
    title: "Custom software",
    desc: "Dashboards, portals, booking engines, and APIs that replace spreadsheets — shaped around how your team really works.",
    href: "/custom-software-development-zirakpur",
    tone: "grey",
  },
  {
    icon: "fas fa-pen-nib",
    image: u("photo-1626785774573-4b7999ee4feb"),
    title: "Brand & graphics",
    desc: "Logos, decks, ad kits, and social systems that look expensive everywhere — consistent, launch-ready creative.",
    href: "/graphic-designing-zirakpur",
    tone: "pink",
  },
  {
    icon: "fas fa-cart-shopping",
    image: u("photo-1556742049-0cfed4f6a45d"),
    title: "Ecommerce",
    desc: "Shopify, WooCommerce, or custom storefronts with checkout that feels effortless — merchandising built to convert.",
    href: "/ecommerce-website-zirakpur",
    tone: "green",
  },
  {
    icon: "fas fa-chart-line",
    image: u("photo-1432888498266-38ffec3eaf4a"),
    title: "SEO & content",
    desc: "Technical SEO, topic clusters, and content that ranks — so the right buyers find you when intent is highest.",
    href: "/seo-services-zirakpur",
    tone: "blue",
  },
];

export const DEFAULT_SERVICES_GRID_SUBTITLE =
  "Design, engineering, and growth under one roof — launch faster, look sharper, and turn traffic into qualified enquiries anywhere you sell.";

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
  "Technical SEO, service-area pages, and useful content so you show up when people search in Zirakpur, Chandigarh, Mohali, and beyond.",
  "Design, engineering, and growth — one team, clear delivery.",
  "One agency for design, development, and digital marketing — so your website, app, and campaigns work together to bring enquiries.",
  "Clear, modern layouts for mobile and desktop — so visitors grasp your offer in seconds and know exactly what to do next.",
  "Fast, secure corporate sites and landing pages with forms, WhatsApp, and analytics wired in from day one — built on clean, maintainable code.",
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
    const desc = item.desc?.trim() ?? "";
    const legacyDesc =
      !desc ||
      LEGACY_SERVICE_DESCS.has(desc) ||
      /zirakpur|chandigarh|mohali|punjab/i.test(desc);

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
