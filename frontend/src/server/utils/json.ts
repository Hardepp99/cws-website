import "server-only";

/** Parse JSON column value (object or array). */
export function parseJsonValue(raw: unknown): unknown | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "object") return raw;
  if (typeof raw !== "string" || !raw.trim()) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function decodeJson(raw: unknown): Record<string, unknown> | null {
  const data = parseJsonValue(raw);
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return null;
}

export function decodeJsonArray(raw: unknown): unknown[] {
  const data = parseJsonValue(raw);
  return Array.isArray(data) ? data : [];
}

export function encodeJson(data: unknown): string {
  return JSON.stringify(data);
}

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function sanitizeSlug(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "item";
}
