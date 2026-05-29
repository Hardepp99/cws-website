import { CWS_BRAND } from "@/lib/site-brand";
import { GlassBubbleCursor } from "@/components/effects/GlassBubbleCursor";
import { SiteFloatWidgets } from "@/components/engagement/SiteFloatWidgets";
import { FooterAskPriceTrigger } from "@/components/engagement/FooterAskPriceTrigger";
import { SitePromoQuote } from "@/components/engagement/SitePromoQuote";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Preloader } from "./Preloader";
import { SiteScripts } from "./SiteScripts";
import { Topbar } from "./Topbar";
import { getMenus, getPricingOptions, getSiteSettings } from "@/lib/wordpress/api";

interface SiteLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

export async function SiteLayout({ children, currentPath = "/" }: SiteLayoutProps) {
  const [settings, menus, pricingOptions] = await Promise.all([
    getSiteSettings(),
    getMenus(),
    getPricingOptions(),
  ]);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `:root {
            --primary-color: ${settings.primaryColor || CWS_BRAND.royal};
            --secondary-color: ${settings.secondaryColor || CWS_BRAND.blue};
            --accent-color: ${CWS_BRAND.green};
            --highlight-color: ${CWS_BRAND.orange};
            --cws-royal: ${settings.primaryColor || CWS_BRAND.royal};
            --cws-blue: ${settings.secondaryColor || CWS_BRAND.blue};
          }`,
        }}
      />
      <Preloader />
      <SitePromoQuote settings={settings} pricingOptions={pricingOptions} />
      <Topbar settings={settings} />
      <Header settings={settings} menu={menus.primary} currentPath={currentPath} />
      <main className="site-main">{children}</main>
      <Footer
        settings={settings}
        footerMenu={menus.footer}
        footerServicesMenu={menus.footerServices}
        footerProductsMenu={menus.footerProducts}
      />
      <FooterAskPriceTrigger />
      <GlassBubbleCursor />
      <SiteFloatWidgets settings={settings} />
      <SiteScripts />
    </>
  );
}
