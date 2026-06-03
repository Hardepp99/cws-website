import { organizationJsonLd, webSiteJsonLd } from "@/lib/seo/metadata";

/** JSON-LD in body (valid for Google; avoids head inline-script dev noise in React 19). */
export function JsonLdScripts() {
  const payload = JSON.stringify([organizationJsonLd(), webSiteJsonLd()]);
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: payload }}
    />
  );
}
