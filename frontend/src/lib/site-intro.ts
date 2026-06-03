/** Fired when intro preloader finishes and site chrome may animate in */
export const SITE_INTRO_READY_EVENT = "site-intro-ready";

/** How long the preloader stays visible before exit (ms) */
export const SITE_INTRO_DURATION_MS = 3000;

/** Preloader slide-out to the right (ms) — keep in sync with CSS */
export const SITE_INTRO_EXIT_MS = 680;

/** Failsafe if client bundle never runs (duration + exit + buffer) */
export const SITE_INTRO_FAILSAFE_MS = SITE_INTRO_DURATION_MS + SITE_INTRO_EXIT_MS + 800;

export function isSiteIntroReady(): boolean {
  return typeof document !== "undefined" && document.body.classList.contains("site-ready");
}

export function onSiteIntroReady(callback: () => void): () => void {
  if (isSiteIntroReady()) {
    callback();
    return () => {};
  }

  const run = () => callback();
  window.addEventListener(SITE_INTRO_READY_EVENT, run, { once: true });
  return () => window.removeEventListener(SITE_INTRO_READY_EVENT, run);
}

/** Fixed preloader display time — does not wait for window load. */
export function waitForSiteIntroDuration(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  return new Promise((resolve) => {
    window.setTimeout(resolve, SITE_INTRO_DURATION_MS);
  });
}
