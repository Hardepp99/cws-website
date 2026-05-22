import { PageBodyContent } from "@/components/ui/PageBodyContent";
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
  return (
    <PageBodyContent
      title={title}
      content={html}
      desimentor={desimentor}
      displayMode={displayMode}
      showArticleWrapper={showArticleWrapper}
    />
  );
}
