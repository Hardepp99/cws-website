import Link from "next/link";
import { PageContentTitle } from "@/components/ui/PageContentTitle";
import { PageHeader } from "@/components/ui/PageHeader";
import { DesimentorRenderer } from "@/components/desimentor/DesimentorRenderer";
import { RichContent } from "@/components/ui/RichContent";
import type { ServiceDetail } from "@/lib/wordpress/types";

interface ServiceDetailPageProps {
  data: ServiceDetail;
}

export function ServiceDetailPage({ data }: ServiceDetailPageProps) {
  return (
    <div className="service-detail-page">
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

      {data.desimentor?.sections?.length ? (
        <section className="content-page-section content-page-section--flush">
          <DesimentorRenderer document={data.desimentor} />
        </section>
      ) : data.content ? (
        <section className="content-page-section content-page-section--flush">
          <div className="corp-container">
            <div className="content-article content-article--page">
              <div className="content-article__body">
                <RichContent html={data.content} />
              </div>
            </div>
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
