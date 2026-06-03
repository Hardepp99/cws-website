"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  markHomeIntroShown,
  SITE_INTRO_EXIT_MS,
  SITE_INTRO_READY_EVENT,
  shouldShowHomeIntro,
  skipSiteIntro,
  waitForSiteIntroDuration,
} from "@/lib/site-intro";

export function SiteScripts() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    let finished = false;
    let hideTimer: number | undefined;
    const runIntro = shouldShowHomeIntro(pathname);

    const resetIntroState = () => {
      document.body.classList.remove("site-ready");
      document.documentElement.classList.add("is-intro-pending");

      const preloader = document.getElementById("preloader");
      if (!preloader) return;
      preloader.classList.remove("loaded", "is-exiting");
      preloader.removeAttribute("style");
      preloader.setAttribute("aria-busy", "true");
    };

    const finishIntro = () => {
      if (finished) return;
      finished = true;

      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const runExit = () => {
        const preloader = document.getElementById("preloader");
        const exitMs = prefersReduced ? 0 : SITE_INTRO_EXIT_MS;

        if (preloader && !prefersReduced) {
          preloader.classList.add("is-exiting");
        }

        document.documentElement.classList.remove("is-intro-pending");
        document.body.classList.add("site-ready");
        markHomeIntroShown();
        window.dispatchEvent(new CustomEvent(SITE_INTRO_READY_EVENT));

        hideTimer = window.setTimeout(() => {
          if (!preloader) return;
          preloader.classList.add("loaded");
          preloader.setAttribute("aria-busy", "false");
          preloader.style.pointerEvents = "none";
          window.setTimeout(() => {
            preloader.style.display = "none";
          }, 80);
        }, exitMs);
      };

      void waitForSiteIntroDuration().then(runExit);
    };

    if (!runIntro) {
      skipSiteIntro();
    } else {
      resetIntroState();
      finishIntro();
    }

    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      if (!shouldShowHomeIntro(pathname)) {
        skipSiteIntro();
        return;
      }
      finished = false;
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
      resetIntroState();
      finishIntro();
    };
    window.addEventListener("pageshow", onPageShow);

    const header = document.getElementById("header");
    const onScroll = () => {
      if (!header) return;
      if (window.scrollY > 50) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll);
    onScroll();

    const counters = document.querySelectorAll<HTMLElement>("[data-count]");
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = parseInt(el.dataset.count || "0", 10);
          let current = 0;
          const step = Math.ceil(target / 60);
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = String(current);
          }, 20);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.3 },
    );
    counters.forEach((c) => counterObserver.observe(c));

    return () => {
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("scroll", onScroll);
      counterObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
