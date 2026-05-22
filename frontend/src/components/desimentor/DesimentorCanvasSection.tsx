"use client";

import { SortableContext, useSortable, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createColumn } from "@/lib/desimentor/document-utils";
import type { DndData } from "@/lib/desimentor/dnd-data";
import { useDesimentorStore } from "@/lib/desimentor/store";
import type { DesimentorDocument, DesimentorSection } from "@/lib/desimentor/types";
import { DesimentorCanvasColumn } from "./DesimentorCanvasColumn";
import { DesimentorElementChrome } from "./DesimentorElementChrome";

export function DesimentorCanvasSection({
  section,
  sectionIndex,
}: {
  section: DesimentorSection;
  sectionIndex: number;
}) {
  const selectedId = useDesimentorStore((s) => s.selectedId);
  const select = useDesimentorStore((s) => s.select);
  const document = useDesimentorStore((s) => s.document);
  const updateDocument = useDesimentorStore((s) => s.updateDocument);

  const isSelected = selectedId === section.id;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
    data: { kind: "section", sectionIndex } satisfies DndData,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
  };

  function removeSection() {
    const next: DesimentorDocument = {
      ...document,
      sections: document.sections.filter((_, i) => i !== sectionIndex),
    };
    updateDocument(next);
    select(null);
  }

  function addColumn() {
    const next = structuredClone(document) as DesimentorDocument;
    next.sections[sectionIndex].columns.push(createColumn(50));
    updateDocument(next);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`desimentor-canvas-section${isSelected ? " is-selected" : ""}${isDragging ? " is-dragging" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        select(section.id);
      }}
    >
      {isSelected ? (
        <div
          className="desimentor-element-chrome-layer desimentor-element-chrome-layer--section"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <DesimentorElementChrome
            label={
              <>
                <i className="fa-solid fa-layer-group" aria-hidden="true" />
                Section
              </>
            }
            onDelete={removeSection}
            dragAttributes={attributes}
            dragListeners={listeners}
          />
        </div>
      ) : (
        <button
          type="button"
          className="desimentor-section-drag-fab"
          title="Drag section"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <i className="fa-solid fa-grip-vertical" aria-hidden="true" />
        </button>
      )}

      {isSelected ? (
        <div className="desimentor-section-actions">
          <button type="button" onClick={(e) => { e.stopPropagation(); addColumn(); }}>
            + Col
          </button>
        </div>
      ) : null}

      <div className="desimentor-row desimentor-section-row">
        <SortableContext items={section.columns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
          {section.columns.map((col, ci) => (
            <DesimentorCanvasColumn
              key={col.id}
              column={col}
              sectionIndex={sectionIndex}
              columnIndex={ci}
              canDeleteColumn={section.columns.length > 1}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
