"use client";

import { useEffect, useState } from "react";
import { AskPriceModal } from "./AskPriceModal";
import { PromoOfferBar } from "./PromoOfferBar";
import type { PricingOptions, SiteSettings } from "@/lib/wordpress/types";

/** Promo strip + shared Ask price modal (header & promo bar use cws:open-ask-price). */
export function SitePromoQuote({ settings, pricingOptions }: { settings: SiteSettings; pricingOptions: PricingOptions }) {
  const [askPriceOpen, setAskPriceOpen] = useState(false);

  useEffect(() => {
    const open = () => setAskPriceOpen(true);
    window.addEventListener("cws:open-ask-price", open);
    const onDocClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('a[href="#ask-price"]');
      if (el) {
        e.preventDefault();
        setAskPriceOpen(true);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => {
      window.removeEventListener("cws:open-ask-price", open);
      document.removeEventListener("click", onDocClick);
    };
  }, []);

  return (
    <>
      <PromoOfferBar phone={settings.phone} onAskPriceClick={() => setAskPriceOpen(true)} />
      <AskPriceModal
        open={askPriceOpen}
        onClose={() => setAskPriceOpen(false)}
        settings={settings}
        pricingOptions={pricingOptions}
      />
    </>
  );
}
