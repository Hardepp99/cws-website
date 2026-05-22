import { DesimentorRenderer } from "@/components/desimentor/DesimentorRenderer";
import { ContentArticle } from "@/components/ui/ContentArticle";
import { RichContent } from "@/components/ui/RichContent";
import { resolvePublicBody, type PageBodyInput } from "@/lib/content/display-mode";

export function PageBodyContent({
  title,
  displayMode,
  content,
  desimentor,
  showArticleWrapper = true,
}: PageBodyInput & {
  title: string;
  showArticleWrapper?: boolean;
}) {
  const { showElementor, showClassic } = resolvePublicBody({ displayMode, content, desimentor });

  if (!showElementor && !showClassic) return null;

  return (
    <>
      {showElementor && desimentor ? <DesimentorRenderer document={desimentor} /> : null}
      {showClassic && content ? (
        showArticleWrapper ? (
          <ContentArticle title={title}>
            <RichContent html={content} />
          </ContentArticle>
        ) : (
          <RichContent html={content} />
        )
      ) : null}
    </>
  );
}
