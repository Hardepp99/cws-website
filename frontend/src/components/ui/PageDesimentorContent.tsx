import { DesimentorRenderer } from "@/components/desimentor/DesimentorRenderer";
import { ContentArticle } from "@/components/ui/ContentArticle";
import { RichContent } from "@/components/ui/RichContent";
import type { DesimentorDocument } from "@/lib/desimentor/types";

export function PageDesimentorContent({
  title,
  desimentor,
  html,
  showArticleWrapper = true,
}: {
  title: string;
  desimentor?: DesimentorDocument;
  html?: string;
  showArticleWrapper?: boolean;
}) {
  const hasDesimentor = Boolean(desimentor?.sections?.length);
  const hasHtml = Boolean(html?.trim());

  if (!hasDesimentor && !hasHtml) return null;

  return (
    <>
      {hasDesimentor ? <DesimentorRenderer document={desimentor!} /> : null}
      {hasHtml ? (
        showArticleWrapper ? (
          <ContentArticle title={title}>
            <RichContent html={html!} />
          </ContentArticle>
        ) : (
          <RichContent html={html!} />
        )
      ) : null}
    </>
  );
}
