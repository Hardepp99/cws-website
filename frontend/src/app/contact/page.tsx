import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageDesimentorContent } from "@/components/ui/PageDesimentorContent";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageTrustStrip } from "@/components/engagement/PageTrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPageBySlug } from "@/lib/wordpress/api";
import { breadcrumbJsonLd, buildMetadata, contactPageJsonLd } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await getPageBySlug("contact");
  if (!page?.seo) return { title: "Contact Us" };
  return buildMetadata(page.seo, "/contact");
}

export default async function ContactPage() {
  const page = await getPageBySlug("contact");
  if (!page) notFound();

  const hasElementor =
    page.displayMode === "elementor" && Boolean(page.desimentor?.sections?.length);
  const hasClassic = Boolean(page.content?.trim());
  const hasContent = hasElementor || hasClassic;

  return (
    <SiteLayout currentPath="/contact">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: page.title, url: "/contact" },
          ]),
          contactPageJsonLd(),
        ]}
      />
      <PageHeader breadcrumb={[{ label: "Home", href: "/" }, { label: page.title }]} />
      {hasElementor ? (
        <section className="content-page-section pb-0">
          <div className="container">
            <PageDesimentorContent
              title={page.title}
              displayMode={page.displayMode}
              desimentor={page.desimentor}
              showArticleWrapper={false}
            />
          </div>
        </section>
      ) : null}
      <section className="content-page-section">
        <div className="container">
          <div className="row g-4 align-items-start">
            {hasClassic ? (
              <div className="col-lg-5">
                <PageDesimentorContent
                  title={page.title}
                  displayMode="classic"
                  html={page.content}
                />
              </div>
            ) : null}
            <div className={hasContent ? "col-lg-7" : "col-lg-8 mx-auto"}>
              <div className="p-4 p-lg-5 bg-white rounded-4 border shadow-sm">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      <PageTrustStrip />
    </SiteLayout>
  );
}
