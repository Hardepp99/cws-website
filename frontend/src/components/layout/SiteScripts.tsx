"use client";

import { useEffect } from "react";

export function SiteScripts() {
  useEffect(() => {
    const hidePreloader = () => {
      const el = document.getElementById("preloader");
      if (!el) return;
      el.classList.add("loaded");
      el.style.opacity = "0";
      el.style.visibility = "hidden";
      setTimeout(() => {
        el.style.display = "none";
      }, 500);
    };

    if (document.readyState === "complete") hidePreloader();
    else window.addEventListener("load", hidePreloader);
    const t = setTimeout(hidePreloader, 1500);

    const header = document.getElementById("header");
    const onScroll = () => {
      if (!header) return;
      if (window.scrollY > 50) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll);
    onScroll();

    const counters = document.querySelectorAll<HTMLElement>("[data-count]");
    const observer = new IntersectionObserver(
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
          observer.unobserve(el);
        });
      },
      { threshold: 0.3 }
    );
    counters.forEach((c) => observer.observe(c));

    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", hidePreloader);
      observer.disconnect();
    };
  }, []);

  return null;
}
