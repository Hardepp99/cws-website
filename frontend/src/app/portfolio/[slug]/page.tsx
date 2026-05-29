import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PortfolioAppleCard } from "@/components/portfolio/PortfolioAppleCard";
import { PageFaq } from "@/components/faq/PageFaq";
import { PageConversionBand } from "@/components/engagement/PageConversionBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { RichContent } from "@/components/ui/RichContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata, siteUrl } from "@/lib/seo/metadata";
import { normalizeFaqItems } from "@/lib/faq/normalize";
import { getPortfolioAll, getPortfolioBySlug } from "@/lib/wordpress/api";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getPortfolioBySlug(slug);
  if (!project) return {};
  const name = project.clientName?.trim() || project.title;
  return buildMetadata(
    {
      title: `${name} | Portfolio | Creative Web Solutions`,
      description: project.excerpt || `${name} — ${project.category} project by Creative Web Solutions.`,
      ogImage: project.image,
    },
    `/portfolio/${slug}`,
  );
}

export default async function PortfolioProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getPortfolioBySlug(slug);
  if (!project) notFound();

  const name = project.clientName?.trim() || project.title;
  const headline = project.title?.trim() || name;
  const liveUrl = project.projectUrl?.trim() || "";
  const showLiveLink = liveUrl !== "" && isExternalUrl(liveUrl);

  const all = await getPortfolioAll();
  const related = all
    .filter((p) => p.slug !== slug && p.category === project.category)
    .slice(0, 4);

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: headline,
    description: project.excerpt,
    url: `${siteUrl}/portfolio/${slug}`,
    image: project.image || undefined,
    locationCreated: project.location
      ? { "@type": "Place", name: project.location }
      : undefined,
    provider: {
      "@type": "Organization",
      name: "Creative Web Solutions",
      url: siteUrl,
    },
  };

  return (
    <SiteLayout currentPath="/portfolio">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Portfolio", url: "/portfolio" },
            { name: name, url: `/portfolio/${slug}` },
          ]),
          projectSchema,
        ]}
      />
      <PageHeader
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Portfolio", href: "/portfolio" },
          { label: name },
        ]}
      />
      <article className="portfolio-detail">
        <div className="corp-container">
          <header className="portfolio-detail__header">
            {project.category ? (
              <span className="portfolio-detail__eyebrow">{project.category}</span>
            ) : null}
            <h1 className="portfolio-detail__title">{headline}</h1>
            <p className="portfolio-detail__client">{name}</p>
            {project.location ? (
              <p className="portfolio-detail__meta">
                <i className="fas fa-location-dot" aria-hidden="true" /> {project.location}
              </p>
            ) : null}
            {project.excerpt ? <p className="portfolio-detail__lead">{project.excerpt}</p> : null}
            <div className="portfolio-detail__actions">
              {showLiveLink ? (
                <a
                  href={liveUrl}
                  className="corp-btn corp-btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit live site
                </a>
              ) : null}
              <Link href="/portfolio" className="corp-btn corp-btn-outline">
                ← All projects
              </Link>
            </div>
          </header>

          {project.image ? (
            <div className="portfolio-detail__hero">
              <Image
                src={project.image}
                alt={name}
                width={1200}
                height={675}
                className="portfolio-detail__hero-img"
                priority
              />
            </div>
          ) : null}

          {project.content?.trim() ? (
            <div className="portfolio-detail__body content-article">
              <RichContent html={project.content} />
            </div>
          ) : null}

          {related.length > 0 ? (
            <section className="portfolio-detail__related" aria-labelledby="related-projects-heading">
              <h2 id="related-projects-heading" className="portfolio-detail__related-title">
                More in {project.category}
              </h2>
              <div className="portfolio-detail__related-grid">
                {related.map((item) => (
                  <PortfolioAppleCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ) : null}

          <PageFaq items={normalizeFaqItems(project.faqs)} title={`${name} — FAQs`} />

          <PageConversionBand
            title="Want a project like this?"
            description="Tell us about your business and goals — we will share a realistic plan and quote."
            primaryLabel="Start your project"
            primaryHref="/contact"
          />
        </div>
      </article>
    </SiteLayout>
  );
}
