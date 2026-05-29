export interface PortfolioItem {
  id: number;
  title: string;
  clientName: string;
  location: string;
  category: string;
  image: string;
  href: string;
  excerpt: string;
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
