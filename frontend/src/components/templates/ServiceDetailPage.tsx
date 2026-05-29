import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageBodyContent } from "@/components/ui/PageBodyContent";
import { PageContentTitle } from "@/components/ui/PageContentTitle";
import { PageHeader } from "@/components/ui/PageHeader";
import type { ServiceDetail } from "@/lib/wordpress/types";
import { resolvePublicBody } from "@/lib/content/display-mode";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo/metadata";

interface ServiceDetailPageProps {
  data: ServiceDetail;
}

export function ServiceDetailPage({ data }: ServiceDetailPageProps) {
  const body = resolvePublicBody({
    displayMode: data.displayMode,
    content: data.content,
    desimentor: data.desimentor,
  });

  const path = `/${data.slug}`;

  return (
    <div className="service-detail-page">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Services", url: "/services" },
            { name: data.title, url: path },
          ]),
          serviceJsonLd({
            name: data.title,
            description: data.seo?.description || data.heroSubtitle || data.title,
            path,
          }),
        ]}
      />
      <PageHeader
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: data.title },
        ]}
      />

      <section className="service-detail-intro">
        <div className="corp-container">
          <PageContentTitle title={data.heroTitle || data.title} subtitle={data.heroSubtitle} />
          {data.priceBadge ? (
            <span className="service-detail-price-badge">{data.priceBadge}</span>
          ) : null}
          <div className="corp-intro-actions">
            <Link href="/contact" className="btn btn-primary-custom btn-sm">
              Get a quote
            </Link>
            <a href="tel:+917015969967" className="btn btn-outline-custom btn-sm">
              Call +91-7015969967
            </a>
          </div>
        </div>
      </section>

      {data.features?.length > 0 ? (
        <section className="service-detail-section service-detail-section--alt">
          <div className="corp-container">
            <div className="service-detail-section-head text-center">
              <span className="section-badge section-badge--growth">Why choose us</span>
              <h2 className="section-title mt-2">Key features</h2>
              <p className="section-subtitle">
                What you get with our {data.title.toLowerCase()} service.
              </p>
            </div>
            <div className="row g-3 g-md-4">
              {data.features.map((feature) => (
                <div key={feature.title} className="col-lg-4 col-md-6">
                  <article className="service-detail-feature-card h-100">
                    <div className="service-detail-feature-icon" aria-hidden="true">
                      <i className={feature.icon || "fas fa-check"} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {body.showElementor || body.showClassic ? (
        <section className="content-page-section content-page-section--flush">
          <div className={body.showClassic && !body.showElementor ? "corp-container" : undefined}>
            <PageBodyContent
              title={data.title}
              displayMode={data.displayMode}
              content={data.content}
              desimentor={data.desimentor}
              showArticleWrapper={false}
            />
          </div>
        </section>
      ) : null}

      <section className="cta-section service-detail-cta">
        <div className="corp-container text-center">
          <h2>{data.ctaTitle || "Start Your Project"}</h2>
          <p>{data.ctaText || "Contact us for expert solutions tailored to your business."}</p>
          <Link href="/contact" className="btn btn-light btn-sm px-4">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
