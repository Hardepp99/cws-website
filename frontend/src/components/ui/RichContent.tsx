import { formatCmsHtml } from "@/lib/format-cms-html";

interface RichContentProps {
  html: string;
  className?: string;
}

/**
 * CMS HTML body — typography via .seo-rich-prose inside .content-article__body
 */
export function RichContent({ html, className = "" }: RichContentProps) {
  const formatted = formatCmsHtml(html);
  if (!formatted) return null;
  return (
    <div
      className={`seo-rich-prose seo-rich-prose--article${className ? ` ${className}` : ""}`}
      dangerouslySetInnerHTML={{ __html: formatted }}
    />
  );
}
