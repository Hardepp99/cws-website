/**
 * Normalize CMS / WYSIWYG HTML so plain text from the database still renders as structured prose.
 */
export function formatCmsHtml(raw: string): string {
  const html = raw?.trim() ?? "";
  if (!html) return "";

  if (/<(p|h[1-6]|ul|ol|li|div|blockquote|table|section|article|figure)\b/i.test(html)) {
    return html;
  }

  const escaped = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const blocks = escaped.split(/\n\s*\n/).filter((b) => b.trim());
  if (blocks.length === 0) return "";

  return blocks
    .map((block, i) => {
      const inner = block.trim().replace(/\n/g, "<br />");
      const cls = i === 0 ? ' class="lead"' : "";
      return `<p${cls}>${inner}</p>`;
    })
    .join("\n");
}
