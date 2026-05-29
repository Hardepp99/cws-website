/** Resolve Font Awesome class string for a menu item icon field from the CMS. */
export function resolveMenuIconClass(icon?: string | null, fallback = "fa-angle-right"): string {
  const raw = icon?.trim();
  if (!raw) {
    return fallback.startsWith("fa") ? (fallback.includes(" ") ? fallback : `fas ${fallback}`) : `fas fa-${fallback}`;
  }
  if (raw.startsWith("fab ") || raw.startsWith("fas ") || raw.startsWith("far ") || raw.startsWith("fa-brands ")) {
    return raw;
  }
  if (raw.startsWith("fa-")) {
    return `fas ${raw}`;
  }
  return `fas fa-${raw}`;
}
