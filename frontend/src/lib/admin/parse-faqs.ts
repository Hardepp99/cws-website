import { normalizeFaqItems } from "@/lib/faq/normalize";
import type { FaqItem } from "@/lib/wordpress/types";

/** Load FAQ rows from admin API (`faqs` or landing `faq`). */
export function parseFaqsFromAdminRow(row: Record<string, unknown>): FaqItem[] {
  const raw = row.faqs ?? row.faq;
  if (typeof raw === "string") {
    try {
      return normalizeFaqItems(JSON.parse(raw));
    } catch {
      return [];
    }
  }
  return normalizeFaqItems(raw);
}
