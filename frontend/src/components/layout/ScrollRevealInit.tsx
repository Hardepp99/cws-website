"use client";

import { useEffect } from "react";
import { onSiteIntroReady } from "@/lib/site-intro";
import { applyScrollRevealClasses, SCROLL_REVEAL_OBSERVER } from "@/lib/scroll-reveal";

/**
 * Observes .scroll-reveal elements — animates on enter, resets on leave (replays on scroll back).
 */
export function ScrollRevealInit() {
  useEffect(() => {
    let observer: IntersectionObserver | undefined;
    let mutationObserver: MutationObserver | undefined;
    let bindTimer: number | undefined;

    const bind = () => {
      applyScrollRevealClasses();

      const nodes = document.querySelectorAll<HTMLElement>(".scroll-reveal");
      observer?.disconnect();

      if (!nodes.length) return;

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            entry.target.classList.toggle("is-visible", entry.isIntersecting);
          }
        },
        SCROLL_REVEAL_OBSERVER,
      );

      nodes.forEach((node) => observer?.observe(node));
    };

    const scheduleBind = () => {
      if (bindTimer !== undefined) window.clearTimeout(bindTimer);
      bindTimer = window.setTimeout(bind, 120);
    };

    const cancelIntro = onSiteIntroReady(() => {
      bind();

      mutationObserver = new MutationObserver(scheduleBind);
      const main = document.querySelector("main.site-main");
      const footer = document.querySelector("footer.footer");
      if (main) mutationObserver.observe(main, { childList: true, subtree: true });
      if (footer) mutationObserver.observe(footer, { childList: true, subtree: true });
    });

    return () => {
      cancelIntro();
      if (bindTimer !== undefined) window.clearTimeout(bindTimer);
      observer?.disconnect();
      mutationObserver?.disconnect();
    };
  }, []);

  return null;
}
