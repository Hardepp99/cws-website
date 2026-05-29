import { DEFAULT_ABOUT_OFFICE_IMAGE, DEFAULT_ABOUT_IMAGE_ALT } from "@/lib/homepage/about-image";
import {
  DEFAULT_SERVICE_GRID_ITEMS,
  DEFAULT_SERVICES_GRID_SUBTITLE,
} from "@/lib/homepage/service-grid-defaults";

/**
 * Streamlined homepage — hero + services + process + testimonials + CTA.
 */
import type { HomepageSection } from "@/lib/wordpress/types";

const LOC = "Zirakpur, Chandigarh & Mohali";

export const CWS_MODERN_HOMEPAGE_SECTIONS: HomepageSection[] = [
  {
    acfFcLayout: "hero_slider",
    eyebrow: `Creative Web Solutions · ${LOC}`,
    headline: "We build websites, mobile apps, and digital marketing that turn visitors into real enquiries.",
    subheadline: "",
    headlineParts: [],
    ctaPrimary: { label: "Get a quote", href: "#ask-price" },
    ctaSecondary: { label: "Call +91-7015969967", href: "tel:+917015969967" },
    slides: [
      { image: { url: "/assets/images/hero1.png" } },
      { image: { url: "/assets/images/hero2.png" } },
      { image: { url: "/assets/images/hero3.png" } },
    ],
    heroVisual: "svg",
    personImage: "/assets/images/hero2.png",
    personImageAlt: "Designer building websites and digital products",
    stats: [],
    gmbRating: 4.9,
    gmbReviewCount: "120+",
    gmbReviews: [
      {
        author: "Amit K.",
        rating: 5,
        text: "Website ekdum solid hai — fast load, clean design. Leads WhatsApp pe aa rahi hain regularly.",
        ago: "3 weeks ago",
      },
      {
        author: "Priya Sharma",
        rating: 5,
        text: "SEO ke baad Google pe ranking better hai. Team Zirakpur se, seedhi baat, time pe kaam.",
        ago: "1 month ago",
      },
      {
        author: "Vikram S.",
        rating: 5,
        text: "Ecommerce + payment gateway setup smooth tha. Content delay hua par delivery professional thi.",
        ago: "2 months ago",
      },
      {
        author: "Neha R.",
        rating: 4,
        text: "Logo, social posts, website — sab ek hi jagah. Ab brand thoda premium lagta hai.",
        ago: "2 months ago",
      },
      {
        author: "Rajesh T.",
        rating: 5,
        text: "Creative Web Solutions Zirakpur — local team jo samajh ke kaam karti hai. Small business ke liye best.",
        ago: "5 months ago",
      },
    ],
    marqueeItems: [
      { letter: "W", title: "Website design", href: "/ui-ux-design-zirakpur" },
      { letter: "D", title: "Website development", href: "/website-development-zirakpur" },
      { letter: "M", title: "Mobile apps", href: "/mobile-app-development-zirakpur" },
      { letter: "S", title: "SEO services", href: "/seo-services-zirakpur" },
      { letter: "A", title: "Digital marketing", href: "/digital-marketing-zirakpur" },
      { letter: "E", title: "Ecommerce", href: "/ecommerce-website-zirakpur" },
      { letter: "G", title: "Graphic design", href: "/graphic-designing-zirakpur" },
      { letter: "P", title: "Custom software", href: "/custom-software-development-zirakpur" },
      { letter: "Z", title: "Web design Zirakpur", href: "/ui-ux-design-zirakpur" },
      { letter: "C", title: "IT company Chandigarh", href: "/website-development-zirakpur" },
      { letter: "M", title: "Mohali", href: "/digital-marketing-zirakpur" },
      { letter: "L", title: "Landing pages", href: "/website-development-zirakpur" },
    ],
  },
  {
    acfFcLayout: "about",
    sectionTheme: "light",
    badge: "About us",
    title: "Technology partner for ambitious businesses",
    subtitle:
      "Creative Web Solutions combines product thinking, engineering discipline, and marketing expertise. From corporate websites to custom applications, we help teams in Zirakpur, Chandigarh, and Mohali launch faster and operate with confidence.",
    image: DEFAULT_ABOUT_OFFICE_IMAGE,
    imageAlt: DEFAULT_ABOUT_IMAGE_ALT,
    features: [
      { title: "Expert team", description: "15+ years delivering websites, apps, and campaigns" },
      { title: "Local support", description: "Fast replies and clear updates in English and Hindi" },
      { title: "Quality delivery", description: "Clean code, tested launches, and honest timelines" },
    ],
    ctaLabel: "Learn more about us",
    ctaHref: "/about",
  },
  {
    acfFcLayout: "services_grid",
    sectionTheme: "dark",
    backdropImage: "",
    badge: "Services",
    title: "What we do",
    subtitle: DEFAULT_SERVICES_GRID_SUBTITLE,
    items: DEFAULT_SERVICE_GRID_ITEMS,
  },
  {
    acfFcLayout: "process",
    sectionTheme: "light",
    backdropImage: "/assets/images/process-hero-mac-students.jpg",
    backdropStrength: 42,
    badge: "Process",
    title: "How we work",
    subtitle: "Simple steps. No confusion.",
    steps: [
      { icon: "fas fa-comments", title: "Discovery call", description: "Goals, timeline, and budget — written summary after the call." },
      { icon: "fas fa-pencil-ruler", title: "Design sign-off", description: "Wireframes or UI you approve before we write production code." },
      { icon: "fas fa-code", title: "Build & staging", description: "You review on a real URL on phone and desktop." },
      { icon: "fas fa-rocket", title: "Launch & support", description: "Go-live, handover, and optional maintenance." },
    ],
  },
  {
    acfFcLayout: "testimonials",
    sectionTheme: "dark",
    badge: "Clients",
    title: "Trusted by local businesses",
    subtitle: "Clear communication and delivery you can plan around.",
    testimonials: [
      { name: "Retail brand, Chandigarh", text: "Mobile site fast hai, forms finally use ho rahe hain. Updates bina drama ke.", role: "Ecommerce" },
      { name: "Clinic, Mohali", text: "SEO structure aur appointment flow — team ne khud follow-up kiya.", role: "Healthcare" },
      { name: "B2B supplier, Punjab", text: "Corporate website + Google Ads landing — enquiries track ho rahi hain.", role: "Manufacturing" },
    ],
  },
  {
    acfFcLayout: "portfolio",
    sectionTheme: "light",
    badge: "Local work",
    title: "Explore the line-up.",
    subtitle: "Real projects for businesses in Zirakpur, Chandigarh, Mohali & Punjab.",
    ctaLabel: "View all work",
    ctaHref: "/portfolio",
  },
];

/** Layouts shown on the public homepage (ignores extra CMS sections until removed in admin). */
export const HOMEPAGE_PUBLIC_LAYOUTS = new Set([
  "hero_slider",
  "about",
  "services_grid",
  "process",
  "testimonials",
  "portfolio",
]);
