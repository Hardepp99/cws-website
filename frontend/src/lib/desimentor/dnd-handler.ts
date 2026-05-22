import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import { createWidgetFromRegistry } from "./widget-registry";
import { createSection } from "./document-utils";
import type { DndData } from "./dnd-data";
import { isPaletteId, paletteTypeFromId } from "./dnd-data";
import type { DesimentorDocument } from "./types";
import { findSelectionPath } from "./document-utils";
import { insertWidgetAt, moveWidget, reorderColumns, reorderWidgetsInColumn } from "./mutations";

function activeData(event: DragEndEvent): DndData | undefined {
  return event.active.data.current as DndData | undefined;
}

function overData(event: DragEndEvent): DndData | undefined {
  return event.over?.data.current as DndData | undefined;
}

function columnIdFromOver(event: DragEndEvent): string | null {
  const over = overData(event);
  if (over?.columnId) return over.columnId;
  const overId = event.over?.id;
  if (overId && String(overId).startsWith("col:")) return String(overId).slice(4);
  return null;
}

export function handleDesimentorDragEnd(
  document: DesimentorDocument,
  event: DragEndEvent
): DesimentorDocument | null {
  const { active, over } = event;
  if (!over || active.id === over.id) return null;

  const a = activeData(event);
  const o = overData(event);

  if (isPaletteId(active.id)) {
    const widgetType = paletteTypeFromId(active.id);
    const widget = createWidgetFromRegistry(widgetType);
    let columnId = columnIdFromOver(event);

    if (!columnId && o?.kind === "widget" && o.columnId) {
      columnId = o.columnId;
    }

    if (!columnId || o?.kind === "canvas") {
      const next = structuredClone(document) as DesimentorDocument;
      if (!next.sections.length) {
        const sec = createSection();
        sec.columns[0].widgets.push(widget);
        next.sections.push(sec);
      } else {
        const last = next.sections[next.sections.length - 1];
        last.columns[last.columns.length - 1].widgets.push(widget);
      }
      return next;
    }

    let index = -1;
    if (o?.kind === "widget" && o.columnId === columnId) {
      const col = document.sections
        .flatMap((s) => s.columns)
        .find((c) => c.id === columnId);
      if (col) {
        const wi = col.widgets.findIndex((w) => w.id === over.id);
        if (wi >= 0) index = wi;
      }
    }
    const col = document.sections.flatMap((s) => s.columns).find((c) => c.id === columnId);
    const at = index >= 0 ? index : (col?.widgets.length ?? 0);
    return insertWidgetAt(document, columnId, at, widget);
  }

  if (a?.kind === "widget" && a.columnId) {
    const toColumnId = o?.columnId ?? columnIdFromOver(event);
    if (!toColumnId) return null;

    if (o?.kind === "widget" && o.columnId) {
      if (a.columnId === o.columnId) {
        const col = document.sections[a.sectionIndex ?? 0]?.columns[a.columnIndex ?? 0];
        if (!col) return null;
        const oldIndex = col.widgets.findIndex((w) => w.id === active.id);
        const newIndex = col.widgets.findIndex((w) => w.id === over.id);
        if (oldIndex >= 0 && newIndex >= 0) {
          return reorderWidgetsInColumn(document, a.columnId, oldIndex, newIndex);
        }
      } else {
        const toCol = document.sections
          .flatMap((s) => s.columns)
          .find((c) => c.id === o.columnId);
        const newIndex = toCol ? toCol.widgets.findIndex((w) => w.id === over.id) : 0;
        return moveWidget(document, String(active.id), o.columnId, newIndex >= 0 ? newIndex : 0);
      }
    }

    if (o?.kind === "column" && o.columnId) {
      const toCol = document.sections
        .flatMap((s) => s.columns)
        .find((c) => c.id === o.columnId);
      return moveWidget(document, String(active.id), o.columnId, toCol?.widgets.length ?? 0);
    }
  }

  if (a?.kind === "column" && a.sectionIndex !== undefined) {
    const cols = document.sections[a.sectionIndex]?.columns;
    if (!cols) return null;
    const oldIndex = cols.findIndex((c) => c.id === active.id);
    const newIndex = cols.findIndex((c) => c.id === over.id);
    if (oldIndex >= 0 && newIndex >= 0) {
      return reorderColumns(document, a.sectionIndex, oldIndex, newIndex);
    }
  }

  if (a?.kind === "section") {
    const oldIndex = document.sections.findIndex((s) => s.id === active.id);
    const newIndex = document.sections.findIndex((s) => s.id === over.id);
    if (oldIndex >= 0 && newIndex >= 0) {
      return { ...document, sections: arrayMove(document.sections, oldIndex, newIndex) };
    }
  }

  return null;
}

export function widgetPath(document: DesimentorDocument, widgetId: string) {
  return findSelectionPath(document, widgetId);
}
