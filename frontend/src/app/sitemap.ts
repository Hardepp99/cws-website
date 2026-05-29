import type { MetadataRoute } from "next";
import { getAllSlugs, getBlogPosts, getPortfolioAll } from "@/lib/wordpress/api";
import { isNoindex, siteUrl } from "@/lib/seo/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllSlugs();
  const posts = (await getBlogPosts()).filter((p) => !isNoindex(p.seo));
  const portfolio = await getPortfolioAll();

  const pages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...slugs.map((slug) => ({
      url: `${siteUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${siteUrl}/portfolio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    ...portfolio
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${siteUrl}/portfolio/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.65,
      })),
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return pages;
}
