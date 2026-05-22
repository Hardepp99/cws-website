/** Plain text from WordPress may include HTML entities (e.g. &amp;) — decode for React text nodes */
export function decodeHtmlEntities(text: string): string {
  if (!text || !text.includes("&")) return text;
  return text
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/gi, "'")
    .replace(/&apos;/gi, "'");
}
