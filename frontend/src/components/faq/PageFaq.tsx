import { JsonLd } from "@/components/seo/JsonLd";
import { PageFaqSection, type PageFaqSectionProps } from "@/components/faq/PageFaqSection";
import { faqJsonLd } from "@/lib/seo/metadata";
import type { FaqItem } from "@/lib/wordpress/types";

type PageFaqProps = Omit<PageFaqSectionProps, "items"> & {
  items: FaqItem[];
};

/** FAQ block + schema for inner pages (not homepage). */
export function PageFaq({ items, ...sectionProps }: PageFaqProps) {
  if (!items.length) return null;
  const schema = faqJsonLd(items);

  return (
    <>
      {schema ? <JsonLd data={schema} /> : null}
      <PageFaqSection items={items} {...sectionProps} />
    </>
  );
}
