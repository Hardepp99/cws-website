import type { HomepageSection } from "@/lib/wordpress/types";

/** Bundled HD office photo (admin can override with any URL). */
export const DEFAULT_ABOUT_OFFICE_IMAGE = "/assets/images/about-office.jpg";

/** Removed from Unsplash — treat as legacy so CMS JSON still upgrades. */
const DEAD_ABOUT_UNSPLASH =
  "https://images.unsplash.com/photo-1497366811353-207109966fe6";

export const DEFAULT_ABOUT_IMAGE_ALT =
  "Creative Web Solutions office — modern workspace for web design and development";

const LEGACY_ABOUT_IMAGES = new Set([
  "/assets/images/hero2.png",
  "/assets/images/hero1.png",
  "/assets/images/hero3.png",
]);

export function resolveAboutImageUrl(section: HomepageSection): string {
  const raw = section.image;
  let url = "";
  if (typeof raw === "string" && raw.trim()) url = raw.trim();
  else if (raw && typeof raw === "object" && "url" in raw) {
    url = String((raw as { url?: string }).url ?? "").trim();
  }

  if (
    !url ||
    LEGACY_ABOUT_IMAGES.has(url) ||
    url.includes(DEAD_ABOUT_UNSPLASH)
  ) {
    return DEFAULT_ABOUT_OFFICE_IMAGE;
  }
  return url;
}
