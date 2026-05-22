export type DndKind = "palette" | "section" | "column" | "widget" | "canvas";

export type DndData = {
  kind: DndKind;
  widgetType?: string;
  sectionIndex?: number;
  columnIndex?: number;
  columnId?: string;
};

export function paletteId(widgetType: string) {
  return `palette:${widgetType}`;
}

export function isPaletteId(id: string | number) {
  return String(id).startsWith("palette:");
}

export function paletteTypeFromId(id: string | number): string {
  return String(id).slice("palette:".length);
}
