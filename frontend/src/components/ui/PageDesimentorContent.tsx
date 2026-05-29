import { PageBodyContent } from "@/components/ui/PageBodyContent";
import { resolvePublicBody } from "@/lib/content/display-mode";
import type { DesimentorDocument } from "@/lib/desimentor/types";
import type { ContentDisplayMode } from "@/lib/wordpress/types";

export function PageDesimentorContent({
  title,
  desimentor,
  html,
  displayMode,
  showArticleWrapper = true,
}: {
  title: string;
  desimentor?: DesimentorDocument;
  html?: string;
  displayMode?: ContentDisplayMode;
  showArticleWrapper?: boolean;
}) {
  const { showElementor } = resolvePublicBody({ displayMode, content: html, desimentor });

  return (
    <PageBodyContent
      title={title}
      content={html}
      desimentor={desimentor}
      displayMode={displayMode}
      showArticleWrapper={showElementor ? false : showArticleWrapper}
    />
  );
}
