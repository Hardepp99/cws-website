import { DesimentorRenderer } from "@/components/desimentor/DesimentorRenderer";
import { PageCustomCss } from "@/components/pages/PageCustomCss";
import { ProSectionedContent } from "@/components/pages/ProSectionedContent";
import { resolvePublicBody } from "@/lib/content/display-mode";
import type { DesimentorDocument } from "@/lib/desimentor/types";
import type { ContentDisplayMode } from "@/lib/wordpress/types";

export type InternalProPageInput = {
  title: string;
  displayMode?: ContentDisplayMode | string | null;
  content?: string | null;
  desimentor?: DesimentorDocument | null;
  pageCustomCss?: string | null;
  contentStructure?: unknown;
  /** Hide H1 in pro sections when page header already shows title */
  hideTitleInBody?: boolean;
};

/** Renders internal pages (not blog): Desimentor builder OR sectionized classic HTML + per-page CSS. */
export function InternalProPageBody({
  title,
  displayMode,
  content,
  desimentor,
  pageCustomCss,
  contentStructure,
  hideTitleInBody = true,
}: InternalProPageInput) {
  const { showElementor, showClassic } = resolvePublicBody({
    displayMode,
    content,
    desimentor: desimentor ?? undefined,
  });

  if (!showElementor && !showClassic) return null;

  return (
    <>
      <PageCustomCss css={pageCustomCss} />
      {showElementor && desimentor?.sections?.length ? (
        <div className="inner-page-elementor">
          <DesimentorRenderer document={desimentor} />
        </div>
      ) : null}
      {showClassic && content?.trim() ? (
        <ProSectionedContent
          html={content}
          storedStructure={contentStructure}
          pageTitle={title}
          showPageTitle={!hideTitleInBody}
        />
      ) : null}
    </>
  );
}
