import Link from "next/link";
import { CtaLink } from "@/components/engagement/CtaLink";
import { ASK_PRICE_HREF } from "@/lib/ask-price";
import { PageContentTitle } from "@/components/ui/PageContentTitle";
import { PageHeader } from "@/components/ui/PageHeader";
import { DesimentorRenderer } from "@/components/desimentor/DesimentorRenderer";
import { RichContent } from "@/components/ui/RichContent";
import type { ServiceLanding } from "@/lib/wordpress/types";

function slugToLabel(slug: string): string {
  return slug
    .replace(/-zirakpur$/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

interface ServiceLandingPageProps {
  data: ServiceLanding;
}

export function ServiceLandingPage({ data }: ServiceLandingPageProps) {
  const { theme } = data;
  const style = {
    "--service-start": theme.start,
    "--service-mid": theme.mid,
    "--service-end": theme.end,
    "--service-accent": theme.accent,
  } as React.CSSProperties;

  return (
    <div className="service-landing-page" style={style}>
      <PageHeader
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: data.service },
        ]}
      />
      <section className="service-location-hero">
        <div className="corp-container">
          <PageContentTitle title={data.pageTitle.split("|")[0].trim()} />
          <div className="row align-items-start g-4">
            <div className="col-lg-7">
              <span className="service-location-kicker">
                <i className={theme.icon} /> {theme.badge}
              </span>
              <p className="service-location-lead">{data.intro}</p>
              <div className="corp-intro-actions">
                <CtaLink href={ASK_PRICE_HREF} className="btn btn-primary-custom btn-sm">
                  Ask price
                </CtaLink>
                <a href="tel:+917015969967" className="btn btn-outline-custom btn-sm">
                  Call +91-7015969967
                </a>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="service-location-preview">
                <div className="service-location-preview-window">
                  <span className="service-location-preview-dot red" />
                  <span className="service-location-preview-dot yellow" />
                  <span className="service-location-preview-dot green" />
                </div>
                <pre className="service-location-preview-code">{`// ${data.service}\nconst locations = [\n  'Zirakpur',\n  'Chandigarh',\n  'Mohali'\n];`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="service-location-section">
        <div className="corp-container service-location-copy">
          <h3>Benefits of {data.service}</h3>
          <p className="lead-copy">{data.intro}</p>
          <ul className="service-location-benefits">
            {data.benefits.map((b) => (
              <li key={b}>
                <i className="fas fa-check-circle" /> {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {data.desimentor?.sections?.length ? (
        <section className="service-location-section alt">
          <DesimentorRenderer document={data.desimentor} />
        </section>
      ) : data.seoBody ? (
        <section className="service-location-section alt">
          <div className="corp-container service-location-copy">
            <RichContent html={data.seoBody} className="seo-rich-prose--wide" />
          </div>
        </section>
      ) : null}

      <section className="service-location-section alt">
        <div className="corp-container">
          <div className="service-location-block">
            <div className="service-location-block-header">
              <h3>What You Get</h3>
              <p>Deliverables included with our {data.service.toLowerCase()} services.</p>
            </div>
            <ul className="service-location-deliverables">
              {data.deliverables.map((d) => (
                <li key={d}>
                  <i className="fas fa-check" /> {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="service-location-section">
        <div className="corp-container">
          <h3 className="mb-3">Frequently Asked Questions</h3>
          <div className="accordion" id="serviceFaq">
            {data.faq.map((item, i) => (
              <div className="accordion-item" key={item.question}>
                <h4 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#faq-${i}`}
                  >
                    {item.question}
                  </button>
                </h4>
                <div id={`faq-${i}`} className="accordion-collapse collapse" data-bs-parent="#serviceFaq">
                  <div className="accordion-body">{item.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {data.related.length > 0 && (
        <section className="service-location-section alt">
          <div className="corp-container">
            <h3 className="mb-3">Related Services</h3>
            <div className="row g-3">
              {data.related.map((relSlug) => (
                <div key={relSlug} className="col-lg-4 col-md-6">
                  <div className="service-location-card">
                    <h4>{slugToLabel(relSlug)}</h4>
                    <Link href={`/${relSlug}`}>Learn more</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="cta-section">
        <div className="corp-container text-center">
          <h2>Ready for {data.service}?</h2>
          <p>Contact Creative Web Solutions for a free consultation in Zirakpur, Chandigarh, and Mohali.</p>
          <Link href="/contact" className="btn btn-primary-custom btn-sm">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
