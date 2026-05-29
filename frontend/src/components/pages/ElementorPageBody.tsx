import { PageDesimentorContent } from "@/components/ui/PageDesimentorContent";
import { resolvePublicBody } from "@/lib/content/display-mode";
import type { DesimentorDocument } from "@/lib/desimentor/types";
import type { ContentDisplayMode } from "@/lib/wordpress/types";

type ElementorPageBodyProps = {
  title: string;
  displayMode?: ContentDisplayMode | string | null;
  content?: string | null;
  desimentor?: DesimentorDocument;
};

/** Renders CMS Desimentor layout full-width, or classic HTML in a container. */
export function ElementorPageBody({
  title,
  displayMode,
  content,
  desimentor,
}: ElementorPageBodyProps) {
  const body = resolvePublicBody({ displayMode, content, desimentor });
  const mode: ContentDisplayMode | undefined =
    displayMode === "elementor" || displayMode === "classic" ? displayMode : undefined;

  if (!body.showElementor && !body.showClassic) {
    return null;
  }

  if (body.showElementor) {
    return (
      <div className="inner-page-elementor">
        <PageDesimentorContent
          title={title}
          displayMode={mode}
          desimentor={desimentor}
          html={content ?? undefined}
        />
      </div>
    );
  }

  return (
    <section className="content-page-section">
      <div className="corp-container">
        <PageDesimentorContent
          title={title}
          displayMode={mode}
          desimentor={desimentor}
          html={content ?? undefined}
        />
      </div>
    </section>
  );
}
