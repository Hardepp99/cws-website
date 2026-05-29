import Link from "next/link";
import { PageBodyContent } from "@/components/ui/PageBodyContent";
import { PageHeader } from "@/components/ui/PageHeader";
import { resolvePublicBody } from "@/lib/content/display-mode";
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
  const body = resolvePublicBody({
    displayMode: data.displayMode,
    content: data.seoBody,
    desimentor: data.desimentor,
  });
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

      {body.showElementor ? (
        <div className="inner-page-elementor">
          <PageBodyContent
            title={data.pageTitle}
            displayMode={data.displayMode}
            content={data.seoBody}
            desimentor={data.desimentor}
            showArticleWrapper={false}
          />
        </div>
      ) : (
        <>
          <section className="service-location-hero">
            <div className="corp-container">
              <h1 className="page-content-title">{data.pageTitle.split("|")[0].trim()}</h1>
              <p className="service-location-lead">{data.intro}</p>
            </div>
          </section>
          {body.showClassic ? (
            <section className="service-location-section alt">
              <div className="corp-container service-location-copy">
                <PageBodyContent
                  title={data.pageTitle}
                  displayMode="classic"
                  content={data.seoBody}
                  showArticleWrapper={false}
                />
              </div>
            </section>
          ) : null}
        </>
      )}

      {data.related.length > 0 ? (
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
      ) : null}
    </div>
  );
}
