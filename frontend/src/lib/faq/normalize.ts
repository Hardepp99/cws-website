import type { FaqItem } from "@/lib/wordpress/types";

/** Normalize CMS / seed FAQ payloads to { question, answer }. */
export function normalizeFaqItems(raw: unknown): FaqItem[] {
  if (!Array.isArray(raw)) {
    if (typeof raw === "string" && raw.trim()) {
      try {
        return normalizeFaqItems(JSON.parse(raw));
      } catch {
        return [];
      }
    }
    return [];
  }

  const out: FaqItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const o = entry as Record<string, unknown>;
    const question = String(o.question ?? o.title ?? o.q ?? "").trim();
    const answer = String(o.answer ?? o.desc ?? o.description ?? o.a ?? "").trim();
    if (question && answer) {
      out.push({ question, answer });
    }
  }
  return out;
}
