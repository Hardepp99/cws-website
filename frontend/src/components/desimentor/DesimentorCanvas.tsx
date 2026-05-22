"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { createSection } from "@/lib/desimentor/document-utils";
import { createWidgetFromRegistry } from "@/lib/desimentor/widget-registry";
import { useDesimentorStore } from "@/lib/desimentor/store";
import { DesimentorCanvasSection } from "./DesimentorCanvasSection";

function CanvasDropZone({ empty }: { empty: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-root",
    data: { kind: "canvas" },
  });

  if (!empty) return null;

  return (
    <div ref={setNodeRef} className={`desimentor-canvas-empty${isOver ? " is-over" : ""}`}>
      <p>Drag widgets here or add a section from the left panel</p>
    </div>
  );
}

export function DesimentorCanvas() {
  const document = useDesimentorStore((s) => s.document);
  const updateDocument = useDesimentorStore((s) => s.updateDocument);
  const select = useDesimentorStore((s) => s.select);
  const pendingWidget = useDesimentorStore((s) => s.pendingWidgetType);
  const clearPending = useDesimentorStore((s) => s.clearPendingWidget);
  const editorDevice = useDesimentorStore((s) => s.editorDevice);

  if (pendingWidget) {
    const next = structuredClone(document);
    const widget = createWidgetFromRegistry(pendingWidget);
    if (!next.sections.length) {
      const sec = createSection();
      sec.columns[0].widgets.push(widget);
      next.sections.push(sec);
    } else {
      const last = next.sections[next.sections.length - 1];
      const col = last.columns[last.columns.length - 1] ?? last.columns[0];
      col.widgets.push(widget);
    }
    updateDocument(next);
    select(widget.id);
    clearPending();
  }

  return (
    <div className={`desimentor-canvas-wrap device-${editorDevice}`}>
      <div className="desimentor-canvas">
        <SortableContext items={document.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {document.sections.map((sec, i) => (
            <DesimentorCanvasSection key={sec.id} section={sec} sectionIndex={i} />
          ))}
        </SortableContext>
        <CanvasDropZone empty={document.sections.length === 0} />
      </div>
    </div>
  );
}
