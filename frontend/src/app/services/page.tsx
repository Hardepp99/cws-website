import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ElementorPageBody } from "@/components/pages/ElementorPageBody";
import { PageFaq } from "@/components/faq/PageFaq";
import { PageConversionBand } from "@/components/engagement/PageConversionBand";
import { PageTrustStrip } from "@/components/engagement/PageTrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { resolvePublicBody } from "@/lib/content/display-mode";
import { getAllServiceLandings, getPageBySlug } from "@/lib/wordpress/api";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo/metadata";

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
  const body = resolvePublicBody({
    displayMode: page.displayMode,
    content: page.content,
    desimentor: page.desimentor,
  });

  return (
    <SiteLayout currentPath="/services">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: page.title, url: "/services" },
        ])}
      />
      <div className="services-page">
        <ElementorPageBody
          title={page.title}
          displayMode={page.displayMode}
          content={page.content}
          desimentor={page.desimentor}
        />

        {landings.length > 0 ? (
          <section className="corp-section corp-section-alt corp-section-tight">
            <div className="corp-container">
              {!body.showElementor ? (
                <header className="services-page__list-head text-center mb-4">
                  <h2 className="section-title">Service landings by intent</h2>
                  <p className="section-subtitle">
                    Location-focused pages for Zirakpur, Chandigarh, Mohali, and India-wide search.
                  </p>
                </header>
              ) : null}
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
        <PageFaq items={normalizeFaqItems(page.faqs)} />
        <PageTrustStrip />
        <PageConversionBand
          title="Not sure which service fits?"
          description="Tell us your goal — website, app, marketing, or training. We will point you to the right landing and a realistic quote."
          primaryLabel="Contact us"
          primaryHref="/contact"
        />
      </div>
    </SiteLayout>
  );
}
