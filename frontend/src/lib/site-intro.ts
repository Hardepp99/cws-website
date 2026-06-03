/** Fired when intro preloader finishes and site chrome may animate in */
export const SITE_INTRO_READY_EVENT = "site-intro-ready";

/** Minimum time preloader stays visible (ms) */
export const SITE_INTRO_MIN_MS = 3000;

/** Preloader slide-out to the right (ms) — keep in sync with CSS */
export const SITE_INTRO_EXIT_MS = 680;

/** Safety cap if load never completes (ms) */
export const SITE_INTRO_MAX_MS = 20000;

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

/** Resolves when document is fully loaded AND minimum intro time has elapsed */
export function waitForSiteIntroGate(startedAt: number): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  return new Promise((resolve) => {
    let settled = false;
    let loadDone = document.readyState === "complete";

    const finish = () => {
      if (settled) return;
      const elapsed = performance.now() - startedAt;
      if (!loadDone || elapsed < SITE_INTRO_MIN_MS) return;
      settled = true;
      window.clearInterval(poll);
      window.clearTimeout(safety);
      window.removeEventListener("load", onLoad);
      resolve();
    };

    const onLoad = () => {
      loadDone = true;
      finish();
    };

    if (!loadDone) {
      window.addEventListener("load", onLoad, { once: true });
    }

    const poll = window.setInterval(finish, 40);
    const safety = window.setTimeout(() => {
      if (settled) return;
      loadDone = true;
      finish();
    }, SITE_INTRO_MAX_MS);

    finish();
  });
}
