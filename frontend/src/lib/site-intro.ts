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

export function hasHomeIntroBeenShown(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(HOME_INTRO_SESSION_KEY) === "1";
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

/** Runs before paint — skip intro on non-home or repeat home visit in session. */
export function buildSiteIntroBootstrapScript(): string {
  const key = HOME_INTRO_SESSION_KEY;
  const failsafe = SITE_INTRO_FAILSAFE_MS;
  return `(function(){var K=${JSON.stringify(key)},M=${failsafe},p=location.pathname||"/",h=p==="/"||p===""||p==="/index"||p==="/index.html",s=!h;try{if(sessionStorage.getItem(K)==="1")s=true}catch(e){}function d(){var e=document.documentElement,b=document.body,pl=document.getElementById("preloader");e.classList.remove("is-intro-pending");b.classList.add("site-ready");if(pl){pl.classList.add("loaded");pl.style.display="none";pl.style.pointerEvents="none"}}function m(){try{sessionStorage.setItem(K,"1")}catch(e){}}if(s){d();return}document.documentElement.classList.add("is-intro-pending");window.addEventListener("site-intro-ready",function(){m();d()},{once:true});setTimeout(function(){m();d()},M)})();`;
}
