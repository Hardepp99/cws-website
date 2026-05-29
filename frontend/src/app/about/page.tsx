import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ContentArticle } from "@/components/ui/ContentArticle";
import { PageHeader } from "@/components/ui/PageHeader";
import { ElementorPageBody } from "@/components/pages/ElementorPageBody";
import { getPageBySlug } from "@/lib/wordpress/api";
import { PageFaq } from "@/components/faq/PageFaq";
import { PageConversionBand } from "@/components/engagement/PageConversionBand";
import { PageTrustStrip } from "@/components/engagement/PageTrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { normalizeFaqItems } from "@/lib/faq/normalize";
import { aboutPageJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await getPageBySlug("about");
  if (!page?.seo) return { title: "About Us" };
  return buildMetadata(page.seo, "/about");
}

export default async function AboutPage() {
  const page = await getPageBySlug("about");
  if (!page) notFound();

  return (
    <SiteLayout currentPath="/about">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: page.title, url: "/about" },
          ]),
          aboutPageJsonLd(),
        ]}
      />
      <PageHeader breadcrumb={[{ label: "Home", href: "/" }, { label: page.title }]} />
      <ElementorPageBody
        title={page.title}
        displayMode={page.displayMode}
        content={page.content}
        desimentor={page.desimentor}
      />
      {!page.content && !page.desimentor?.sections?.length ? (
        <section className="content-page-section">
          <div className="corp-container">
            <ContentArticle title={page.title}>
              <p className="content-article__empty">
                Add About page content in the admin under Site Pages.
              </p>
              <p>
                <Link href="/contact" className="btn btn-primary-custom">
                  Contact us
                </Link>
              </p>
            </ContentArticle>
          </div>
        </section>
      ) : null}
      <PageFaq items={normalizeFaqItems(page.faqs)} />
      <PageTrustStrip />
      <PageConversionBand
        title="Want a team that answers in plain language?"
        description="Tell us what you are building — website, app, or marketing. We will suggest a realistic path, timeline, and ballpark."
        primaryLabel="Book a consultation"
        primaryHref="/contact"
      />
    </SiteLayout>
  );
}
