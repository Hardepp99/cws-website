import type { DesimentorDocument, DesimentorWidget, ElementStyles } from "./types";
import { findSelectionPath } from "./document-utils";
import { createWidgetFromRegistry } from "./widget-registry";

export function cloneDoc(doc: DesimentorDocument): DesimentorDocument {
  return JSON.parse(JSON.stringify(doc)) as DesimentorDocument;
}

export function updateSliderSlideField(
  doc: DesimentorDocument,
  widgetId: string,
  slideIndex: number,
  field: string,
  value: string
): DesimentorDocument {
  const next = cloneDoc(doc);
  const path = findSelectionPath(next, widgetId);
  if (path?.kind !== "widget" || path.columnIndex === undefined || path.widgetIndex === undefined) {
    return doc;
  }
  const w = next.sections[path.sectionIndex].columns[path.columnIndex].widgets[path.widgetIndex];
  const slides = Array.isArray(w.props.slides) ? [...(w.props.slides as Record<string, string>[])] : [];
  if (!slides[slideIndex]) return doc;
  slides[slideIndex] = { ...slides[slideIndex], [field]: value };
  w.props.slides = slides;
  return next;
}

export function updateWidgetProp(
  doc: DesimentorDocument,
  targetId: string,
  key: string,
  value: unknown
): DesimentorDocument {
  const next = cloneDoc(doc);
  const path = findSelectionPath(next, targetId);
  if (path?.kind !== "widget" || path.columnIndex === undefined || path.widgetIndex === undefined) {
    return doc;
  }
  const w = next.sections[path.sectionIndex].columns[path.columnIndex].widgets[path.widgetIndex];
  w.props[key] = value;
  return next;
}

export function updateWidgetProps(
  doc: DesimentorDocument,
  targetId: string,
  patch: Record<string, unknown>
): DesimentorDocument {
  let next = doc;
  for (const [key, value] of Object.entries(patch)) {
    next = updateWidgetProp(next, targetId, key, value);
  }
  return next;
}

export function updateElementStyles(
  doc: DesimentorDocument,
  targetId: string,
  patch: Partial<ElementStyles>
): DesimentorDocument {
  const next = cloneDoc(doc);
  const path = findSelectionPath(next, targetId);
  if (!path) return doc;

  if (path.kind === "section") {
    next.sections[path.sectionIndex].settings = {
      ...next.sections[path.sectionIndex].settings,
      ...patch,
    };
  } else if (path.kind === "column" && path.columnIndex !== undefined) {
    const col = next.sections[path.sectionIndex].columns[path.columnIndex];
    col.styles = { ...col.styles, ...patch };
  } else if (
    path.kind === "widget" &&
    path.columnIndex !== undefined &&
    path.widgetIndex !== undefined
  ) {
    const w = next.sections[path.sectionIndex].columns[path.columnIndex].widgets[path.widgetIndex];
    w.styles = { ...w.styles, ...patch };
  }
  return next;
}

export function duplicateWidget(doc: DesimentorDocument, widgetId: string): DesimentorDocument {
  const next = cloneDoc(doc);
  const path = findSelectionPath(next, widgetId);
  if (path?.kind !== "widget" || path.columnIndex === undefined || path.widgetIndex === undefined) {
    return doc;
  }
  const col = next.sections[path.sectionIndex].columns[path.columnIndex];
  const src = col.widgets[path.widgetIndex];
  const copy = createWidgetFromRegistry(src.type);
  copy.props = { ...src.props };
  copy.styles = src.styles ? { ...src.styles } : {};
  col.widgets.splice(path.widgetIndex + 1, 0, copy);
  return next;
}

export function removeWidget(doc: DesimentorDocument, widgetId: string): DesimentorDocument {
  const next = cloneDoc(doc);
  const path = findSelectionPath(next, widgetId);
  if (path?.kind !== "widget" || path.columnIndex === undefined || path.widgetIndex === undefined) {
    return doc;
  }
  next.sections[path.sectionIndex].columns[path.columnIndex].widgets.splice(path.widgetIndex, 1);
  return next;
}

export function updateColumnWidth(
  doc: DesimentorDocument,
  columnId: string,
  width: number
): DesimentorDocument {
  const next = cloneDoc(doc);
  const path = findSelectionPath(next, columnId);
  if (path?.kind !== "column" || path.columnIndex === undefined) return doc;
  next.sections[path.sectionIndex].columns[path.columnIndex].width = width;
  return next;
}

function findColumnIndices(doc: DesimentorDocument, columnId: string) {
  for (let si = 0; si < doc.sections.length; si++) {
    const ci = doc.sections[si].columns.findIndex((c) => c.id === columnId);
    if (ci >= 0) return { sectionIndex: si, columnIndex: ci };
  }
  return null;
}

export function insertWidgetAt(
  doc: DesimentorDocument,
  columnId: string,
  index: number,
  widget: DesimentorWidget
): DesimentorDocument {
  const next = cloneDoc(doc);
  const loc = findColumnIndices(next, columnId);
  if (!loc) return doc;
  const widgets = next.sections[loc.sectionIndex].columns[loc.columnIndex].widgets;
  widgets.splice(Math.max(0, Math.min(index, widgets.length)), 0, widget);
  return next;
}

export function moveWidget(
  doc: DesimentorDocument,
  widgetId: string,
  toColumnId: string,
  toIndex: number
): DesimentorDocument {
  const next = cloneDoc(doc);
  const fromPath = findSelectionPath(next, widgetId);
  if (fromPath?.kind !== "widget" || fromPath.columnIndex === undefined || fromPath.widgetIndex === undefined) {
    return doc;
  }

  const fromCol = next.sections[fromPath.sectionIndex].columns[fromPath.columnIndex];
  const [widget] = fromCol.widgets.splice(fromPath.widgetIndex, 1);
  if (!widget) return doc;

  const toLoc = findColumnIndices(next, toColumnId);
  if (!toLoc) return doc;

  let insertAt = toIndex;
  if (
    fromPath.sectionIndex === toLoc.sectionIndex &&
    fromPath.columnIndex === toLoc.columnIndex &&
    fromPath.widgetIndex < toIndex
  ) {
    insertAt -= 1;
  }

  const toWidgets = next.sections[toLoc.sectionIndex].columns[toLoc.columnIndex].widgets;
  toWidgets.splice(Math.max(0, Math.min(insertAt, toWidgets.length)), 0, widget);
  return next;
}

export function reorderWidgetsInColumn(
  doc: DesimentorDocument,
  columnId: string,
  fromIndex: number,
  toIndex: number
): DesimentorDocument {
  const next = cloneDoc(doc);
  const loc = findColumnIndices(next, columnId);
  if (!loc) return doc;
  const widgets = next.sections[loc.sectionIndex].columns[loc.columnIndex].widgets;
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= widgets.length || toIndex >= widgets.length) return doc;
  const [item] = widgets.splice(fromIndex, 1);
  widgets.splice(toIndex, 0, item);
  return next;
}

export function removeColumn(doc: DesimentorDocument, columnId: string): DesimentorDocument {
  const next = cloneDoc(doc);
  const loc = findColumnIndices(next, columnId);
  if (!loc) return doc;
  const cols = next.sections[loc.sectionIndex].columns;
  if (cols.length <= 1) return doc;
  cols.splice(loc.columnIndex, 1);
  return next;
}

export function reorderColumns(
  doc: DesimentorDocument,
  sectionIndex: number,
  fromIndex: number,
  toIndex: number
): DesimentorDocument {
  const next = cloneDoc(doc);
  const cols = next.sections[sectionIndex]?.columns;
  if (!cols || fromIndex < 0 || toIndex < 0 || fromIndex >= cols.length || toIndex >= cols.length) return doc;
  const [item] = cols.splice(fromIndex, 1);
  cols.splice(toIndex, 0, item);
  return next;
}
