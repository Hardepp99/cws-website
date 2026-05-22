import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ContentArticle } from "@/components/ui/ContentArticle";
import { PageHeader } from "@/components/ui/PageHeader";
import { RichContent } from "@/components/ui/RichContent";
import { getAllServiceLandings, getPageBySlug } from "@/lib/wordpress/api";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await getPageBySlug("services");
  if (!page?.seo) return { title: "Services" };
  return buildMetadata(page.seo, "/services");
}

export default async function ServicesPage() {
  const page = await getPageBySlug("services");
  if (!page) notFound();

  const landings = await getAllServiceLandings();

  return (
    <SiteLayout currentPath="/services">
      <div className="services-page">
        <PageHeader breadcrumb={[{ label: "Home", href: "/" }, { label: page.title }]} />

        {page.content ? (
          <section className="content-page-section">
            <div className="corp-container">
              <ContentArticle title={page.title}>
                <RichContent html={page.content} />
              </ContentArticle>
            </div>
          </section>
        ) : null}

        {landings.length > 0 ? (
          <section className="corp-section corp-section-alt corp-section-tight">
            <div className="corp-container">
              <div className="row g-3 g-md-4">
                {landings.map((s) => (
                  <div key={s.slug} className="col-lg-4 col-md-6">
                    <article className="services-page-card h-100">
                      <div className="services-page-card__icon" aria-hidden="true">
                        <i className={s.theme.icon} />
                      </div>
                      <h3 className="services-page-card__title">{s.service}</h3>
                      <p className="services-page-card__desc">{s.intro.slice(0, 140)}</p>
                      <Link href={`/${s.slug}`} className="services-page-card__link">
                        Explore
                        <i className="fas fa-arrow-right" aria-hidden="true" />
                      </Link>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="content-page-section">
            <div className="corp-container">
              <ContentArticle title={page.title}>
                <p className="content-article__empty">Add service landings in the admin.</p>
              </ContentArticle>
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
