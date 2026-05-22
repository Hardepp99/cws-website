import type { DesimentorDocument } from "@/lib/desimentor/types";

export interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  logoUrl: string;
  logoWhiteUrl: string;
  primaryColor: string;
  secondaryColor: string;
  footerText: string;
  facebook: string;
  linkedin: string;
  instagram: string;
  footerCompanyTitle?: string;
  footerServicesTitle?: string;
  footerProductsTitle?: string;
}

export interface SiteMenus {
  primary: MenuItem[];
  footer: MenuItem[];
  footerServices: MenuItem[];
  footerProducts: MenuItem[];
}

export interface PricingSelectOption {
  value: string;
  label: string;
}

export interface PricingBundle {
  id: string;
  label: string;
  summary: string;
  includes?: string[];
}

export interface PricingServiceGroup {
  label: string;
  options: PricingSelectOption[];
}

export interface PricingOptions {
  bundles: PricingBundle[];
  serviceGroups: PricingServiceGroup[];
  budgetRanges: PricingSelectOption[];
  timelines: PricingSelectOption[];
}

export interface MenuItem {
  label: string;
  href: string;
  icon?: string;
  children?: MenuItem[];
}

export interface SeoMeta {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  robots?: "index" | "noindex";
  focusKeyword?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ServiceTheme {
  start: string;
  mid: string;
  end: string;
  accent: string;
  icon: string;
  badge: string;
}

export interface ServiceLanding {
  slug: string;
  displayMode?: ContentDisplayMode;
  service: string;
  pageTitle: string;
  pageDescription: string;
  pageKeywords: string;
  intro: string;
  benefits: string[];
  deliverables: string[];
  faq: FaqItem[];
  related: string[];
  theme: ServiceTheme;
  /** Long-form sample copy for editors / localhost (optional). */
  seoBody?: string;
  desimentor?: DesimentorDocument;
}

export interface ServiceDetail {
  slug: string;
  displayMode?: ContentDisplayMode;
  title: string;
  heroTitle: string;
  heroSubtitle: string;
  priceBadge?: string;
  content?: string;
  features: { title: string; description: string; icon: string }[];
  ctaTitle?: string;
  ctaText?: string;
  seo: SeoMeta;
  desimentor?: DesimentorDocument;
}

export interface HomepageSection {
  acfFcLayout: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  slides?: { image?: { url: string } }[];
  items?: Record<string, unknown>[];
  [key: string]: unknown;
}

export type ContentDisplayMode = "classic" | "elementor";

export interface WpPage {
  slug: string;
  title: string;
  content?: string;
  displayMode?: ContentDisplayMode;
  seo: SeoMeta;
  sections?: HomepageSection[];
  desimentor?: DesimentorDocument;
  template?: "default" | "service_landing" | "service_detail" | "contact" | "services";
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string;
  content?: string;
  categories?: string[];
  featured?: boolean;
  seo: SeoMeta;
}

export interface PortfolioItem {
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  category?: string;
}

export interface Course {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  seo: SeoMeta;
}

export type ContentType = "page" | "service_landing" | "service" | "course" | "post";

export interface ResolvedContent {
  type: ContentType;
  data: WpPage | ServiceLanding | ServiceDetail | Course | BlogPost;
}
