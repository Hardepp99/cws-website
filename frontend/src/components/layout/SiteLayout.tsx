import { SiteFloatWidgets } from "@/components/engagement/SiteFloatWidgets";
import { SitePromoQuote } from "@/components/engagement/SitePromoQuote";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PastelSectionsInit } from "./PastelSectionsInit";
import { ScrollRevealInit } from "./ScrollRevealInit";
import { Preloader } from "./Preloader";
import { SiteScripts } from "./SiteScripts";
import { MemberSessionProvider } from "@/components/member/MemberSessionProvider";
import { SiteMapsProvider } from "./SiteMapsContext";
import { Topbar } from "./Topbar";
import { resolveGmbMapsUrl } from "@/lib/gmb/resolve";
import { isHomePath } from "@/lib/site-intro";
import { getLayoutBootstrap } from "@/lib/wordpress/api";

interface SiteLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

export async function SiteLayout({ children, currentPath = "/" }: SiteLayoutProps) {
  const { settings, menus, pricing: pricingOptions } = await getLayoutBootstrap();

  const gmbMapsUrl = resolveGmbMapsUrl(settings);
  const showHomePreloader = isHomePath(currentPath);

  return (
    <MemberSessionProvider>
    <SiteMapsProvider mapsUrl={gmbMapsUrl}>
      {showHomePreloader ? <Preloader /> : null}
      <SitePromoQuote settings={settings} pricingOptions={pricingOptions} />
      <Topbar settings={settings} />
      <Header settings={settings} menu={menus.primary} currentPath={currentPath} />
      <main className="site-main">
        {children}
        <PastelSectionsInit />
        <ScrollRevealInit />
      </main>
      <Footer
        settings={settings}
        footerMenu={menus.footer}
        footerServicesMenu={menus.footerServices}
        footerProductsMenu={menus.footerProducts}
      />
      <SiteFloatWidgets settings={settings} />
      <SiteScripts />
    </SiteMapsProvider>
    </MemberSessionProvider>
  );
}
