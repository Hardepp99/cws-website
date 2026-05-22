import { nanoid } from "nanoid";
import type {
  DesimentorColumn,
  DesimentorDocument,
  DesimentorSection,
  DesimentorWidget,
} from "./types";

export function emptyDocument(): DesimentorDocument {
  return { version: 1, sections: [] };
}

export function newId(prefix: string): string {
  return `${prefix}_${nanoid(8)}`;
}

export function cloneDocument(doc: DesimentorDocument): DesimentorDocument {
  return remapIds(JSON.parse(JSON.stringify(doc)) as DesimentorDocument);
}

function remapIds(doc: DesimentorDocument): DesimentorDocument {
  return {
    version: doc.version || 1,
    sections: (doc.sections || []).map((sec) => ({
      ...sec,
      id: newId("sec"),
      columns: (sec.columns || []).map((col) => ({
        ...col,
        id: newId("col"),
        widgets: (col.widgets || []).map((w) => ({ ...w, id: newId("w") })),
      })),
    })),
  };
}

export function createSection(): DesimentorSection {
  return {
    id: newId("sec"),
    type: "section",
    settings: { paddingTop: "40px", paddingBottom: "40px" },
    columns: [
      { id: newId("col"), width: 100, widgets: [] },
    ],
  };
}

export function createColumn(width = 50): DesimentorColumn {
  return { id: newId("col"), width, widgets: [] };
}

export function createWidget(type: string, props: Record<string, unknown> = {}): DesimentorWidget {
  return { id: newId("w"), type, props, styles: {} };
}

export function findSelectionPath(
  doc: DesimentorDocument,
  targetId: string
): { sectionIndex: number; columnIndex?: number; widgetIndex?: number; kind: "section" | "column" | "widget" } | null {
  for (let si = 0; si < doc.sections.length; si++) {
    const sec = doc.sections[si];
    if (sec.id === targetId) return { sectionIndex: si, kind: "section" };
    for (let ci = 0; ci < sec.columns.length; ci++) {
      const col = sec.columns[ci];
      if (col.id === targetId) return { sectionIndex: si, columnIndex: ci, kind: "column" };
      for (let wi = 0; wi < col.widgets.length; wi++) {
        if (col.widgets[wi].id === targetId) {
          return { sectionIndex: si, columnIndex: ci, widgetIndex: wi, kind: "widget" };
        }
      }
    }
  }
  return null;
}
