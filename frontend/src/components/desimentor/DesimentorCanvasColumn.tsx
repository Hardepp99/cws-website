"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createWidgetFromRegistry } from "@/lib/desimentor/widget-registry";
import type { DndData } from "@/lib/desimentor/dnd-data";
import { removeColumn } from "@/lib/desimentor/mutations";
import { useDesimentorStore } from "@/lib/desimentor/store";
import type { DesimentorColumn } from "@/lib/desimentor/types";
import { DesimentorCanvasWidget } from "./DesimentorCanvasWidget";
import { DesimentorElementChrome } from "./DesimentorElementChrome";

export function DesimentorCanvasColumn({
  column,
  sectionIndex,
  columnIndex,
  canDeleteColumn,
}: {
  column: DesimentorColumn;
  sectionIndex: number;
  columnIndex: number;
  canDeleteColumn: boolean;
}) {
  const selectedId = useDesimentorStore((s) => s.selectedId);
  const select = useDesimentorStore((s) => s.select);
  const document = useDesimentorStore((s) => s.document);
  const updateDocument = useDesimentorStore((s) => s.updateDocument);

  const isSelected = selectedId === column.id;
  const childWidgetSelected = column.widgets.some((w) => w.id === selectedId);

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `col:${column.id}`,
    data: { kind: "column", columnId: column.id, sectionIndex, columnIndex } satisfies DndData,
  });

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: { kind: "column", columnId: column.id, sectionIndex, columnIndex } satisfies DndData,
  });

  const colStyle = {
    flex: `0 0 ${column.width}%`,
    maxWidth: `${column.width}%`,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
    minHeight: column.styles?.minHeight ?? "80px",
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        setDropRef(node);
      }}
      className={`desimentor-col${isSelected ? " is-selected" : ""}${isOver ? " is-drop-over" : ""}`}
      style={colStyle}
      onClick={(e) => {
        e.stopPropagation();
        select(column.id);
      }}
    >
      {isSelected && !childWidgetSelected ? (
        <div
          className="desimentor-element-chrome-layer"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <DesimentorElementChrome
            compact
            showDelete={canDeleteColumn}
            onDelete={() => {
              updateDocument(removeColumn(document, column.id));
              select(null);
            }}
            dragAttributes={attributes}
            dragListeners={listeners}
          />
        </div>
      ) : null}

      <SortableContext items={column.widgets.map((w) => w.id)} strategy={verticalListSortingStrategy}>
        <div className="desimentor-col-widgets">
          {column.widgets.map((w) => (
            <DesimentorCanvasWidget
              key={w.id}
              widget={w}
              sectionIndex={sectionIndex}
              columnIndex={columnIndex}
              columnId={column.id}
            />
          ))}
        </div>
      </SortableContext>

      <button
        type="button"
        className="desimentor-add-widget-btn"
        title="Add widget"
        onClick={(e) => {
          e.stopPropagation();
          const next = structuredClone(document);
          next.sections[sectionIndex].columns[columnIndex].widgets.push(createWidgetFromRegistry("text"));
          updateDocument(next);
          const added = next.sections[sectionIndex].columns[columnIndex].widgets.at(-1);
          if (added) select(added.id);
        }}
      >
        <i className="fa-solid fa-plus" aria-hidden="true" />
      </button>

      {isSelected ? (
        <div
          className="desimentor-col-width-handle"
          title="Resize column width"
          onMouseDown={(e) => {
            e.stopPropagation();
            const colEl = (e.target as HTMLElement).closest(".desimentor-col") as HTMLElement | null;
            const rowEl = colEl?.closest(".desimentor-section-row") as HTMLElement | null;
            const rowWidth = rowEl?.offsetWidth ?? 800;
            const startX = e.clientX;
            const startW = column.width;
            const onMove = (ev: MouseEvent) => {
              const dw = ((ev.clientX - startX) / rowWidth) * 100;
              const next = structuredClone(useDesimentorStore.getState().document);
              const w = Math.min(100, Math.max(15, Math.round(startW + dw)));
              next.sections[sectionIndex].columns[columnIndex].width = w;
              useDesimentorStore.getState().updateDocument(next);
            };
            const onUp = () => {
              window.removeEventListener("mousemove", onMove);
              window.removeEventListener("mouseup", onUp);
            };
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
          }}
        />
      ) : null}
    </div>
  );
}
