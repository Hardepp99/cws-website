import type { Metadata } from "next";
import type { SeoMeta } from "@/lib/wordpress/types";
import { getSiteUrl, siteUrl } from "@/lib/site-url";

export { siteUrl, getSiteUrl };

const defaultKeywords =
  "web development company India, website developer Chandigarh, digital marketing Zirakpur, mobile app development Mohali, IT training Punjab, Creative Web Solutions";

const defaultDescription =
  "Creative Web Solutions — web development, mobile apps, digital marketing, and IT training in Chandigarh, Zirakpur, Mohali. Call +91-7015969967";

export function parseKeywords(keywords?: string): string[] | undefined {
  if (!keywords?.trim()) return undefined;
  return keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

export function isNoindex(seo: SeoMeta): boolean {
  return seo.robots === "noindex";
}

export function buildMetadata(seo: SeoMeta, path = ""): Metadata {
  const canonicalPath = path.startsWith("/") ? path : path ? `/${path}` : "";
  const base = siteUrl || "http://localhost:3000";
  const canonical =
    seo.canonical?.trim() ||
    `${base}${canonicalPath}`.replace(/([^:]\/)\/+/g, "$1") ||
    base;
  const ogImage =
    seo.ogImage?.trim() ||
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&h=630&q=85";
  const title = seo.title?.trim() || "Creative Web Solutions";
  const description = seo.description?.trim() || defaultDescription;
  const keywords = parseKeywords(seo.keywords) ?? parseKeywords(defaultKeywords);
  const noindex = isNoindex(seo);

  return {
    metadataBase: new URL(base),
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: "en_IN",
      siteName: "Creative Web Solutions",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noindex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Creative Web Solutions",
    url: siteUrl,
    logo: `${siteUrl}/assets/images/cws-logo.svg`,
    description: defaultDescription,
    address: {
      "@type": "PostalAddress",
      streetAddress: "#313, 3rd Floor, D & E Block, VIP Road",
      addressLocality: "Zirakpur",
      addressRegion: "Punjab",
      postalCode: "140603",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-7015969967",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=61565017048983",
      "https://www.linkedin.com/company/creative-websolutions/",
      "https://www.instagram.com/creativeweb_solutions",
    ],
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Creative Web Solutions",
    url: siteUrl,
    description: defaultDescription,
    publisher: { "@type": "Organization", name: "Creative Web Solutions" },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleJsonLd(post: {
  title: string;
  description: string;
  slug: string;
  date: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "Creative Web Solutions" },
    publisher: {
      "@type": "Organization",
      name: "Creative Web Solutions",
      logo: { "@type": "ImageObject", url: `${siteUrl}/assets/images/cws-logo.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${post.slug}` },
    image: post.image ? [post.image] : [`${siteUrl}/assets/images/og-image.jpg`],
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

export function faqJsonLd(faq: { question: string; answer: string }[]) {
  if (!faq?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function serviceJsonLd(service: {
  name: string;
  description: string;
  path: string;
}) {
  const url = service.path.startsWith("http") ? service.path : `${siteUrl}${service.path.startsWith("/") ? service.path : `/${service.path}`}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url,
    provider: {
      "@type": "Organization",
      name: "Creative Web Solutions",
      url: siteUrl,
      telephone: "+91-7015969967",
    },
    areaServed: [
      { "@type": "City", name: "Zirakpur" },
      { "@type": "City", name: "Chandigarh" },
      { "@type": "City", name: "Mohali" },
      { "@type": "AdministrativeArea", name: "Punjab" },
      { "@type": "Country", name: "India" },
    ],
  };
}

export function blogItemListJsonLd(
  posts: { title: string; slug: string; excerpt?: string }[],
) {
  if (!posts.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Creative Web Solutions Blog",
    itemListElement: posts.map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl}/blog/${post.slug}`,
      name: post.title,
      description: post.excerpt,
    })),
  };
}

export function aboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Creative Web Solutions",
    url: `${siteUrl}/about`,
    description:
      "Technology partner for web development, mobile apps, digital marketing, and IT training in Zirakpur, Chandigarh, and Mohali.",
    mainEntity: organizationJsonLd(),
  };
}

export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Creative Web Solutions",
    url: `${siteUrl}/contact`,
    description: "Request a website, app, or marketing quote from Creative Web Solutions in Zirakpur.",
    mainEntity: organizationJsonLd(),
  };
}
