"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { openAskPriceModal } from "@/lib/ask-price";

const SESSION_KEY = "cws_footer_ask_price_prompted";
const DELAY_MS = 5000;
const FOOTER_SELECTOR = "footer.footer";

/** Homepage: open Ask price modal 5s after the footer enters the viewport (once per session). */
export function FooterAskPriceTrigger() {
  const pathname = usePathname();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promptedRef = useRef(false);

  useEffect(() => {
    if (pathname !== "/") return;

    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        promptedRef.current = true;
        return;
      }
    } catch {
      /* private mode */
    }

    const footer = document.querySelector(FOOTER_SELECTOR);
    if (!footer) return;

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const prompt = () => {
      if (promptedRef.current) return;
      promptedRef.current = true;
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      openAskPriceModal();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (promptedRef.current) {
          clearTimer();
          return;
        }
        if (entry.isIntersecting) {
          clearTimer();
          timerRef.current = setTimeout(prompt, DELAY_MS);
        } else {
          clearTimer();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
      clearTimer();
    };
  }, [pathname]);

  return null;
}
