import { InternalProPageBody } from "@/components/pages/InternalProPageBody";
import type { DesimentorDocument } from "@/lib/desimentor/types";
import type { ContentDisplayMode } from "@/lib/wordpress/types";

type ElementorPageBodyProps = {
  title: string;
  displayMode?: ContentDisplayMode | string | null;
  content?: string | null;
  desimentor?: DesimentorDocument | null;
  pageCustomCss?: string | null;
  contentStructure?: unknown;
};

/** Renders CMS content: Desimentor builder or sectionized pro classic HTML. */
export function ElementorPageBody(props: ElementorPageBodyProps) {
  return <InternalProPageBody {...props} hideTitleInBody />;
}
