/** Strip HTML for plain-text counts (editor body, etc.). */
export function stripHtmlForCount(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countCharacters(text: string): number {
  return text.length;
}

export function countWords(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

export type CounterStatus = "neutral" | "ok" | "warn" | "over";

export function counterStatus(value: number, min?: number, max?: number): CounterStatus {
  if (max !== undefined && value > max) return "over";
  if (min !== undefined && value < min) return "warn";
  const meetsMin = min === undefined || value >= min;
  const meetsMax = max === undefined || value <= max;
  if (meetsMin && meetsMax && (min !== undefined || max !== undefined)) return "ok";
  return "neutral";
}
