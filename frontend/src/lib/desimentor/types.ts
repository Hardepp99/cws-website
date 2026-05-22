export type DesimentorEntityType = "page" | "homepage" | "service_landing" | "service" | "blog_post";

export type ElementStyles = {
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  color?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  textAlign?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: string;
  boxShadow?: string;
  maxWidth?: string;
  minHeight?: string;
  width?: string;
  customCss?: string;
};

export type DesimentorWidget = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  styles?: ElementStyles;
};

export type DesimentorColumn = {
  id: string;
  width: number;
  widgets: DesimentorWidget[];
  styles?: ElementStyles;
};

export type DesimentorSection = {
  id: string;
  type: "section";
  settings?: ElementStyles & { fullWidth?: boolean };
  columns: DesimentorColumn[];
};

export type DesimentorDocument = {
  version: number;
  sections: DesimentorSection[];
};

export type DesimentorDocumentRecord = {
  id: number;
  entityType: DesimentorEntityType;
  entityId: number;
  content: DesimentorDocument;
  status: "draft" | "published";
  revision: number;
  updatedAt: string;
};

export type DesimentorTemplate = {
  id: number;
  name: string;
  slug: string;
  category: "section" | "page" | "widget";
  content: DesimentorDocument | DesimentorSection | DesimentorWidget;
  thumbnailMediaId?: number | null;
  status: string;
};
