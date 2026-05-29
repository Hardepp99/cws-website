import { SiteLayout } from "@/components/layout/SiteLayout";
import { PortfolioTabbedShowcase } from "@/components/portfolio/PortfolioTabbedShowcase";
import { ContentArticle } from "@/components/ui/ContentArticle";
import { PageHeader } from "@/components/ui/PageHeader";
import { RichContent } from "@/components/ui/RichContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPageBySlug, getPortfolioAll, getSiteSettings } from "@/lib/wordpress/api";
import { breadcrumbJsonLd, buildMetadata, siteUrl } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await getPageBySlug("portfolio");
  if (page?.seo?.title) return buildMetadata(page.seo, "/portfolio");
  const settings = await getSiteSettings();
  return buildMetadata(
    {
      title: settings.portfolioTitle ?? "Portfolio | Creative Web Solutions",
      description:
        settings.portfolioSubtitle ??
        "Explore websites, ecommerce, and marketing projects we have delivered for local businesses.",
    },
    "/portfolio",
  );
}

export default async function PortfolioPage() {
  const [items, settings, page] = await Promise.all([
    getPortfolioAll(),
    getSiteSettings(),
    getPageBySlug("portfolio"),
  ]);

  const title = page?.title ?? settings.portfolioTitle ?? "Explore our work";
  const subtitle =
    page?.seo?.description ??
    settings.portfolioSubtitle ??
    "Filter by category to see websites, stores, and campaigns we have shipped across the Tricity.";

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description: subtitle,
    url: `${siteUrl}/portfolio`,
    isPartOf: { "@type": "WebSite", name: "Creative Web Solutions", url: siteUrl },
  };

  return (
    <SiteLayout currentPath="/portfolio">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Portfolio", url: "/portfolio" },
          ]),
          collectionSchema,
        ]}
      />
      <PageHeader breadcrumb={[{ label: "Home", href: "/" }, { label: "Portfolio" }]} />
      <div className="portfolio-page">
        <div className="corp-container">
          <header className="portfolio-page__hero">
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </header>
          {page?.content ? (
            <section className="content-page-section portfolio-page__intro">
              <ContentArticle title="">
                <RichContent html={page.content} className="seo-rich-prose" />
              </ContentArticle>
            </section>
          ) : null}
          <PortfolioTabbedShowcase
            items={items}
            allTabLabel="All work"
            className="portfolio-showcase--page"
          />
        </div>
      </div>
    </SiteLayout>
  );
}
