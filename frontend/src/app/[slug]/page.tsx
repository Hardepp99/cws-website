import { notFound } from "next/navigation";
import nextDynamic from "next/dynamic";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ContentArticle } from "@/components/ui/ContentArticle";
import { PageDesimentorContent } from "@/components/ui/PageDesimentorContent";
import { PageContentTitle } from "@/components/ui/PageContentTitle";
import { PageHeader } from "@/components/ui/PageHeader";
import { RichContent } from "@/components/ui/RichContent";
import { ContactForm } from "@/components/forms/ContactForm";
import { EnrollmentForm } from "@/components/forms/EnrollmentForm";
import { getAllServiceLandings, getContentBySlug } from "@/lib/wordpress/api";
import { buildMetadata, faqJsonLd } from "@/lib/seo/metadata";
import type { ServiceDetail, ServiceLanding, WpPage } from "@/lib/wordpress/types";
import Link from "next/link";

const ServiceLandingPage = nextDynamic(
  () => import("@/components/templates/ServiceLandingPage").then((m) => m.ServiceLandingPage),
  { loading: () => <PageLoader /> }
);

const ServiceDetailPage = nextDynamic(
  () => import("@/components/templates/ServiceDetailPage").then((m) => m.ServiceDetailPage),
  { loading: () => <PageLoader /> }
);

function PageLoader() {
  return (
    <div className="corp-section text-center">
      <div className="spinner-border text-primary" role="status" />
      <p className="mt-3 text-muted">Loading…</p>
    </div>
  );
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** On-demand rendering avoids ChunkLoadError from large static param lists in dev */
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const content = await getContentBySlug(slug);
  if (!content) return {};

  if (content.type === "service") {
    return buildMetadata((content.data as ServiceDetail).seo, `/${slug}`);
  }

  if (content.type === "service_landing") {
    const d = content.data as ServiceLanding;
    const theme = d.theme as { seoOgImage?: string };
    return buildMetadata(
      {
        title: d.pageTitle,
        description: d.pageDescription,
        keywords: d.pageKeywords,
        canonical: `https://www.cwsindia.online/${slug}`,
        ogImage: theme?.seoOgImage,
      },
      `/${slug}`
    );
  }

  if (content.type === "page") {
    return buildMetadata((content.data as WpPage).seo, `/${slug}`);
  }

  return {};
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const content = await getContentBySlug(slug);

  if (content?.type === "service") {
    return (
      <SiteLayout currentPath={`/${slug}`}>
        <ServiceDetailPage data={content.data as ServiceDetail} />
      </SiteLayout>
    );
  }

  if (content?.type === "service_landing") {
    const data = content.data as ServiceLanding;
    return (
      <SiteLayout currentPath={`/${slug}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(data.faq)) }}
        />
        <ServiceLandingPage data={data} />
      </SiteLayout>
    );
  }

  if (!content || content.type !== "page") {
    notFound();
  }

  const page = content.data as WpPage;

  if (page.template === "contact") {
    return (
      <SiteLayout currentPath={`/${slug}`}>
        <PageHeader breadcrumb={[{ label: "Home", href: "/" }, { label: page.title }]} />
        <section className="content-page-section">
          <div className="container">
            <div className="row g-4 align-items-start">
              {page.content || page.desimentor?.sections?.length ? (
                <div className="col-lg-5">
                  <PageDesimentorContent
                    title={page.title}
                    displayMode={page.displayMode}
                    desimentor={page.desimentor}
                    html={page.content}
                  />
                </div>
              ) : (
                <div className="col-12">
                  <ContentArticle title={page.title}>
                    <p className="content-article__empty">Reach us using the form.</p>
                  </ContentArticle>
                </div>
              )}
              <div className={page.content ? "col-lg-7" : "col-lg-8 mx-auto"}>
                <div className="p-4 p-lg-5 bg-white rounded-4 border shadow-sm">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  if (page.template === "services") {
    const landings = await getAllServiceLandings();
    return (
      <SiteLayout currentPath={`/${slug}`}>
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
        ) : null}
      </SiteLayout>
    );
  }

  if (slug === "courses") {
    return (
      <SiteLayout currentPath={`/${slug}`}>
        <PageHeader breadcrumb={[{ label: "Home", href: "/" }, { label: "Courses" }]} />
        <section className="corp-section corp-section-tight">
          <div className="container">
            <PageContentTitle title="Courses & Training" />
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="p-4 bg-white rounded-4 border shadow-sm">
                  <EnrollmentForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout currentPath={`/${slug}`}>
      <PageHeader breadcrumb={[{ label: "Home", href: "/" }, { label: page.title }]} />
      {page.desimentor?.sections?.length || page.content ? (
        <section className="content-page-section">
          <div className="corp-container">
            <PageDesimentorContent
              title={page.title}
              displayMode={page.displayMode}
              desimentor={page.desimentor}
              html={page.content}
            />
          </div>
        </section>
      ) : null}
    </SiteLayout>
  );
}
