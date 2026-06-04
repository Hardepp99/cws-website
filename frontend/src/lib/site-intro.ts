/** Fired when intro preloader finishes and site chrome may animate in */
export const SITE_INTRO_READY_EVENT = "site-intro-ready";

/** sessionStorage — home intro shown this browser session */
export const HOME_INTRO_SESSION_KEY = "cws_home_intro_shown";

/** How long the preloader stays visible before exit (ms) */
export const SITE_INTRO_DURATION_MS = 3000;

/** Preloader slide-out to the right (ms) — keep in sync with CSS */
export const SITE_INTRO_EXIT_MS = 680;

/** Failsafe if client bundle never runs (duration + exit + buffer) */
export const SITE_INTRO_FAILSAFE_MS = SITE_INTRO_DURATION_MS + SITE_INTRO_EXIT_MS + 800;

export function isHomePath(pathname: string): boolean {
  const p = (pathname || "/").replace(/\/+$/, "") || "/";
  return p === "/" || p === "/index";
}

export const HOME_INTRO_COOKIE_OPTS = "path=/; SameSite=Lax";

function readIntroCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim().startsWith(`${HOME_INTRO_SESSION_KEY}=1`));
}

export function hasHomeIntroBeenShown(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (sessionStorage.getItem(HOME_INTRO_SESSION_KEY) === "1") return true;
    return readIntroCookie();
  } catch {
    return false;
  }
}

/** Home `/` only, once per session. */
export function shouldShowHomeIntro(pathname: string): boolean {
  return isHomePath(pathname) && !hasHomeIntroBeenShown();
}

export function markHomeIntroShown(): void {
  try {
    sessionStorage.setItem(HOME_INTRO_SESSION_KEY, "1");
  } catch {
    /* private mode */
  }
  try {
    if (typeof document !== "undefined") {
      document.cookie = `${HOME_INTRO_SESSION_KEY}=1; ${HOME_INTRO_COOKIE_OPTS}`;
    }
  } catch {
    /* private mode */
  }
}

/** Server/middleware: should the initial HTML skip the home intro overlay? */
export function shouldSkipIntroOnServer(pathname: string, introCookieValue?: string): boolean {
  if (!isHomePath(pathname)) return true;
  return introCookieValue === "1";
}

export function isSiteIntroReady(): boolean {
  return typeof document !== "undefined" && document.body.classList.contains("site-ready");
}

export function skipSiteIntro(): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove("is-intro-pending");
  document.body.classList.add("site-ready");
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.classList.add("loaded");
    preloader.setAttribute("aria-busy", "false");
    preloader.style.pointerEvents = "none";
    preloader.style.display = "none";
  }
  if (!isSiteIntroReady()) {
    window.dispatchEvent(new CustomEvent(SITE_INTRO_READY_EVENT));
  }
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

/** @deprecated Intro state is set in middleware + root layout; see SiteScripts for animation. */
export function buildSiteIntroBootstrapScript(): string {
  return "";
}
