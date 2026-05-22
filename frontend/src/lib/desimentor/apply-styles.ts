import type { CSSProperties } from "react";
import type { ElementStyles } from "./types";

export function stylesToCss(styles?: ElementStyles): CSSProperties {
  if (!styles) return {};
  const css: CSSProperties = {};
  if (styles.marginTop) css.marginTop = styles.marginTop;
  if (styles.marginRight) css.marginRight = styles.marginRight;
  if (styles.marginBottom) css.marginBottom = styles.marginBottom;
  if (styles.marginLeft) css.marginLeft = styles.marginLeft;
  if (styles.paddingTop) css.paddingTop = styles.paddingTop;
  if (styles.paddingRight) css.paddingRight = styles.paddingRight;
  if (styles.paddingBottom) css.paddingBottom = styles.paddingBottom;
  if (styles.paddingLeft) css.paddingLeft = styles.paddingLeft;
  if (styles.color) css.color = styles.color;
  if (styles.backgroundColor) css.backgroundColor = styles.backgroundColor;
  if (styles.backgroundImage) css.backgroundImage = styles.backgroundImage;
  if (styles.fontSize) css.fontSize = styles.fontSize;
  if (styles.fontWeight) css.fontWeight = styles.fontWeight as CSSProperties["fontWeight"];
  if (styles.lineHeight) css.lineHeight = styles.lineHeight;
  if (styles.textAlign) css.textAlign = styles.textAlign as CSSProperties["textAlign"];
  if (styles.borderRadius) css.borderRadius = styles.borderRadius;
  if (styles.borderWidth) css.borderWidth = styles.borderWidth;
  if (styles.borderColor) css.borderColor = styles.borderColor;
  if (styles.borderStyle) css.borderStyle = styles.borderStyle as CSSProperties["borderStyle"];
  if (styles.boxShadow) css.boxShadow = styles.boxShadow;
  if (styles.maxWidth) css.maxWidth = styles.maxWidth;
  if (styles.minHeight) css.minHeight = styles.minHeight;
  if (styles.width) css.width = styles.width;
  return css;
}

export function scopedClass(id: string): string {
  return `dsmt-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}
