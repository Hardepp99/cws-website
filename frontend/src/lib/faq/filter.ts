import type { FaqItem } from "@/lib/wordpress/types";

/** Drop empty rows before save / render. */
export function filterValidFaqs(items: FaqItem[]): FaqItem[] {
  return items
    .map((item) => ({
      question: item.question.trim(),
      answer: item.answer.trim(),
    }))
    .filter((item) => item.question && item.answer);
}
