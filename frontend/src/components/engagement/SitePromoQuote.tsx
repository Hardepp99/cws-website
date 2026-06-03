"use client";

import { useCallback, useEffect, useState } from "react";
import { AskPriceModal } from "./AskPriceModal";
import { PromoOfferBar } from "./PromoOfferBar";
import { DEFAULT_PROMO_OFFER_TEXT } from "@/lib/wordpress/fallback";
import type { PricingOptions, SiteSettings } from "@/lib/wordpress/types";

const PROMO_DISMISS_SESSION_KEY = "cws_promo_offer_dismissed";

function promoBarEnabled(settings: SiteSettings): boolean {
  return settings.promoOfferEnabled !== "0";
}

function promoCopy(settings: SiteSettings) {
  const text = settings.promoOfferText?.trim() || DEFAULT_PROMO_OFFER_TEXT;
  const quoteLabel = settings.promoOfferQuoteLabel?.trim() || "Ask price";
  const callLabel = settings.promoOfferCallLabel?.trim() || "Call now";
  return { text, quoteLabel, callLabel };
}

/** Promo strip + shared Ask price modal (header & promo bar use cws:open-ask-price). */
export function SitePromoQuote({ settings, pricingOptions }: { settings: SiteSettings; pricingOptions: PricingOptions }) {
  const [askPriceOpen, setAskPriceOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    try {
      setShowPromo(sessionStorage.getItem(PROMO_DISMISS_SESSION_KEY) !== "1");
    } catch {
      setShowPromo(true);
    }
  }, []);

  const dismissPromo = useCallback(() => {
    try {
      sessionStorage.setItem(PROMO_DISMISS_SESSION_KEY, "1");
    } catch {
      /* private mode */
    }
    setShowPromo(false);
    window.dispatchEvent(new CustomEvent("cws:promo-offer-dismissed"));
  }, []);

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

  const promo = promoCopy(settings);
  const showPromoBar = showPromo && promoBarEnabled(settings);

  return (
    <>
      {showPromoBar ? (
        <PromoOfferBar
          text={promo.text}
          quoteLabel={promo.quoteLabel}
          callLabel={promo.callLabel}
          phone={settings.phone}
          onAskPriceClick={() => setAskPriceOpen(true)}
          onDismiss={dismissPromo}
        />
      ) : null}
      <AskPriceModal
        open={askPriceOpen}
        onClose={() => setAskPriceOpen(false)}
        settings={settings}
        pricingOptions={pricingOptions}
      />
    </>
  );
}
