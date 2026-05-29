import type { Metadata } from "next";
import Script from "next/script";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import "./globals.css";
import { buildMetadata, organizationJsonLd, webSiteJsonLd } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Creative Web Solutions | Best Web Development Company in India",
  description:
    "Creative Web Solutions — web development, mobile apps, digital marketing, and IT training in Chandigarh, Zirakpur, Mohali. Call +91-7015969967",
  keywords:
    "web development company India, website developer Chandigarh, digital marketing Zirakpur, mobile app development Mohali, IT company Punjab, Creative Web Solutions",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/apple-theme.css" />
        <link rel="icon" type="image/png" href="/assets/images/favicon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd(), webSiteJsonLd()]),
          }}
        />
      </head>
      <body>
        <AnalyticsProvider />
        {children}
      </body>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
    </html>
  );
}
