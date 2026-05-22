import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ContentArticle } from "@/components/ui/ContentArticle";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageDesimentorContent } from "@/components/ui/PageDesimentorContent";
import { getPageBySlug } from "@/lib/wordpress/api";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo/metadata";

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
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: page.title, url: "/about" },
        ])}
      />
      <PageHeader breadcrumb={[{ label: "Home", href: "/" }, { label: page.title }]} />
      {page.desimentor?.sections?.length || page.content ? (
        <section className="content-page-section">
          <div className="corp-container">
            <PageDesimentorContent
              title={page.title}
              desimentor={page.desimentor}
              html={page.content}
            />
          </div>
        </section>
      ) : (
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
      )}
    </SiteLayout>
  );
}
