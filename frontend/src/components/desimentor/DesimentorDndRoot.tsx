"use client";

import { useState, type ReactNode } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { handleDesimentorDragEnd } from "@/lib/desimentor/dnd-handler";
import { isPaletteId, paletteTypeFromId } from "@/lib/desimentor/dnd-data";
import { getWidgetDef } from "@/lib/desimentor/widget-registry";
import { useDesimentorStore } from "@/lib/desimentor/store";

export function DesimentorDndRoot({ children }: { children: ReactNode }) {
  const document = useDesimentorStore((s) => s.document);
  const select = useDesimentorStore((s) => s.select);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const doc = useDesimentorStore.getState().document;
    const next = handleDesimentorDragEnd(doc, event);
    if (next) {
      useDesimentorStore.getState().updateDocument(next);
      if (isPaletteId(event.active.id)) {
        const last = next.sections[next.sections.length - 1];
        const col = last?.columns[last.columns.length - 1];
        const w = col?.widgets[col.widgets.length - 1];
        if (w) select(w.id);
      }
    }
  }

  const overlayLabel = (() => {
    if (!activeId) return null;
    if (isPaletteId(activeId)) {
      return getWidgetDef(paletteTypeFromId(activeId))?.label ?? "Widget";
    }
    const w = document.sections
      .flatMap((s) => s.columns)
      .flatMap((c) => c.widgets)
      .find((x) => x.id === activeId);
    if (w) return getWidgetDef(w.type)?.label ?? w.type;
    if (document.sections.some((s) => s.id === activeId)) return "Section";
    if (document.sections.flatMap((s) => s.columns).some((c) => c.id === activeId)) return "Column";
    return null;
  })();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {activeId && overlayLabel ? (
          <div className="desimentor-drag-overlay">
            <i className="fa-solid fa-grip-vertical" aria-hidden="true" />
            {overlayLabel}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
