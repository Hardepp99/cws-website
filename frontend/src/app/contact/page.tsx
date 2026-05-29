import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ContactPageView } from "@/components/contact/ContactPageView";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageTrustStrip } from "@/components/engagement/PageTrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { googleMapsEmbedUrl } from "@/lib/contact/maps-embed";
import { gmbConfigFromSiteSettings } from "@/lib/gmb/resolve";
import { getPageBySlug, getSiteSettings } from "@/lib/wordpress/api";
import { breadcrumbJsonLd, buildMetadata, contactPageJsonLd } from "@/lib/seo/metadata";
import "./contact-page.css";

export const dynamic = "force-dynamic";

const DEFAULT_INTRO =
  "Share your project goals — we respond within one business day with practical next steps. For urgent enquiries, call or WhatsApp the number below.";

export async function generateMetadata() {
  const page = await getPageBySlug("contact");
  if (!page?.seo) return { title: "Contact Us" };
  return buildMetadata(page.seo, "/contact");
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getPageBySlug("contact"), getSiteSettings()]);
  if (!page) notFound();

  const gmb = gmbConfigFromSiteSettings(settings);
  const mapsEmbedUrl = googleMapsEmbedUrl(gmb.mapsUrl, gmb.placeName);

  const intro =
    page.seo?.description?.trim() ||
    "Share your project goals — we respond within one business day with practical next steps and a ballpark scope.";

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
      <ContactPageView
        title={page.title}
        intro={intro || DEFAULT_INTRO}
        settings={settings}
        mapsEmbedUrl={mapsEmbedUrl}
        placeName={gmb.placeName}
        rating={String(gmb.rating)}
        reviewCount={gmb.reviewCount}
      />
      <PageTrustStrip />
    </SiteLayout>
  );
}
