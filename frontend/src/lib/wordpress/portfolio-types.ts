import type { FaqItem } from "@/lib/wordpress/types";

export interface PortfolioItem {
  id: number;
  slug: string;
  title: string;
  clientName: string;
  location: string;
  category: string;
  image: string;
  /** Link to project detail page */
  href: string;
  /** Optional live site / external URL */
  projectUrl?: string;
  excerpt: string;
  content?: string;
  faqs?: FaqItem[];
  showOnHomepage?: boolean;
}

export interface PortfolioHomePayload {
  items: PortfolioItem[];
  settings: {
    badge: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    maxPerCategory?: number;
  };
}
