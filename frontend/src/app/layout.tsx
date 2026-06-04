import type { Metadata } from "next";
import { headers } from "next/headers";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { JsonLdScripts } from "@/components/seo/JsonLdScripts";
import "./globals.css";
import { buildMetadata } from "@/lib/seo/metadata";

/** Every page reads fresh content from MySQL on each request (no static HTML at build time). */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = buildMetadata({
  title: "Creative Web Solutions | Best Web Development Company in India",
  description:
    "Creative Web Solutions — web development, mobile apps, and digital marketing in Chandigarh, Zirakpur, Mohali. Call +91-7015969967",
  keywords:
    "web development company India, website developer Chandigarh, digital marketing Zirakpur, mobile app development Mohali, IT company Punjab, Creative Web Solutions",
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const skipIntro = (await headers()).get("x-cws-skip-intro") === "1";

  return (
    <html
      lang="en"
      className={skipIntro ? undefined : "is-intro-pending"}
      suppressHydrationWarning
    >
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/cws-ui-theme.css" />
        <link rel="stylesheet" href="/assets/css/community.css" />
        <link rel="icon" type="image/png" href="/assets/images/favicon.png" />
      </head>
      <body className={skipIntro ? "site-ready" : undefined} suppressHydrationWarning>
        <JsonLdScripts />
        <AnalyticsProvider />
        {children}
      </body>
    </html>
  );
}
