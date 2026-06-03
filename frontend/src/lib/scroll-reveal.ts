/** Element-level scroll reveal targets (skip nodes already inside <Reveal>). */

export const SCROLL_REVEAL_VARIANTS = [
  "fade-up",
  "fade-up",
  "zoom-in",
  "slide-left",
  "slide-right",
  "fade-in",
] as const;

export type ScrollRevealVariant = (typeof SCROLL_REVEAL_VARIANTS)[number];

/** Whole sections (pages without nested Reveal). */
export const SCROLL_REVEAL_SECTION_SELECTORS = [
  "main.site-main section.corp-section",
  "main.site-main section.content-page-section",
  "main.site-main section.page-trust-strip",
  "main.site-main section.page-conversion-band",
  "main.site-main section.cta-section",
  "main.site-main section.service-detail-section",
  "main.site-main section.portfolio-detail__related",
  "main.site-main .desimentor-section",
  "main.site-main .home-section-band__content > section",
] as const;

/** Finer blocks inside sections (homepage + inner pages). */
export const SCROLL_REVEAL_BLOCK_SELECTORS = [
  "main.site-main .home-section-head",
  "main.site-main .home-trust-grid > *",
  "main.site-main .home-industries-grid > *",
  "main.site-main .home-services__grid > [class*=\"col-\"]",
  "main.site-main .home-process__grid > *",
  "main.site-main .home-portfolio-grid > *",
  "main.site-main .home-testimonials__grid > *",
  "main.site-main .home-blog-grid > *",
  "main.site-main .page-header--compact .corp-container",
  "main.site-main .content-page-section .corp-container > *",
  "main.site-main .service-detail-intro",
  "main.site-main .portfolio-showcase__head",
  "main.site-main .portfolio-showcase__grid > *",
  "main.site-main .row.g-4 > [class*=\"col-\"]",
  "main.site-main .row.g-lg-5 > [class*=\"col-\"]",
] as const;

/** Footer — element-wise. */
export const SCROLL_REVEAL_FOOTER_SELECTORS = [
  "footer.footer .footer-logo",
  "footer.footer .footer-desc",
  "footer.footer .footer-widget--brand .footer-title",
  "footer.footer .footer-contact__item",
  "footer.footer .footer-social-link",
  "footer.footer .footer-widget:not(.footer-widget--brand)",
  "footer.footer .footer-links li",
] as const;

export const SCROLL_REVEAL_OBSERVER = {
  threshold: 0.12,
  rootMargin: "0px 0px 4% 0px",
} as const;

export function shouldSkipScrollReveal(el: Element): boolean {
  if (el.closest(".home-hero-stack")) return true;
  if (el.closest(".footer-bar")) return true;
  if (el.closest(".reveal")) return true;
  if (el.classList.contains("reveal") || el.classList.contains("scroll-reveal")) return true;
  return false;
}

export function sectionHasRevealContent(el: Element): boolean {
  return el.querySelector(".reveal") !== null;
}

let variantCursor = 0;

function nextVariant(): ScrollRevealVariant {
  const variant = SCROLL_REVEAL_VARIANTS[variantCursor % SCROLL_REVEAL_VARIANTS.length];
  variantCursor += 1;
  return variant;
}

function markScrollReveal(el: HTMLElement, delayMs: number): void {
  const variant = nextVariant();
  el.classList.add("scroll-reveal", `scroll-reveal--${variant}`);
  el.style.setProperty("--scroll-reveal-delay", `${delayMs}ms`);
  el.style.setProperty("--scroll-reveal-duration", "720ms");
}

export function applyScrollRevealClasses(root: ParentNode = document): void {
  const seen = new Set<Element>();
  variantCursor = 0;

  const register = (el: Element, delayMs: number) => {
    if (!(el instanceof HTMLElement)) return;
    if (seen.has(el)) return;
    if (shouldSkipScrollReveal(el)) return;

    markScrollReveal(el, delayMs);
    seen.add(el);
  };

  const registerGroup = (selector: string, staggerMs: number, baseDelayMs = 0) => {
    root.querySelectorAll(selector).forEach((el, index) => {
      register(el, baseDelayMs + index * staggerMs);
    });
  };

  for (const selector of SCROLL_REVEAL_SECTION_SELECTORS) {
    root.querySelectorAll(selector).forEach((el, index) => {
      if (sectionHasRevealContent(el)) return;
      register(el, index * 100);
    });
  }

  for (const selector of SCROLL_REVEAL_BLOCK_SELECTORS) {
    registerGroup(selector, 120, 80);
  }

  let footerBase = 60;
  for (const selector of SCROLL_REVEAL_FOOTER_SELECTORS) {
    const nodes = root.querySelectorAll(selector);
    nodes.forEach((el, index) => {
      register(el, footerBase + index * 105);
    });
    footerBase += nodes.length * 48;
  }
}
