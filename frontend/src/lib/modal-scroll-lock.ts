/** Reference-counted scroll lock while site modals are open (iOS-safe). */

let lockCount = 0;
let savedScrollY = 0;

export function lockBodyScroll(): void {
  if (typeof document === "undefined") return;
  lockCount += 1;
  if (lockCount > 1) return;

  savedScrollY = window.scrollY;
  document.documentElement.style.setProperty("--cws-scroll-lock-y", `-${savedScrollY}px`);
  document.documentElement.classList.add("cws-modal-open");
  document.body.classList.add("cws-modal-open");
}

export function unlockBodyScroll(): void {
  if (typeof document === "undefined") return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;

  document.documentElement.classList.remove("cws-modal-open");
  document.body.classList.remove("cws-modal-open");
  document.documentElement.style.removeProperty("--cws-scroll-lock-y");

  window.scrollTo(0, savedScrollY);
}
