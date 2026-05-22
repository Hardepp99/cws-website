export function parseWpJson<T>(raw: string | null | undefined): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    console.warn("[WP] Invalid JSON payload");
    return null;
  }
}
