"use client";

import { useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getWidgetDef } from "@/lib/desimentor/widget-registry";
import type { DndData } from "@/lib/desimentor/dnd-data";
import {
  defaultPlaceholderSize,
  isPlaceholderWidget,
  isResizableWidget,
} from "@/lib/desimentor/placeholder-utils";
import { updateElementStyles, removeWidget, updateSliderSlideField, updateWidgetProp } from "@/lib/desimentor/mutations";
import { useDesimentorStore } from "@/lib/desimentor/store";
import type { DesimentorWidget } from "@/lib/desimentor/types";
import { DesimentorElementChrome } from "./DesimentorElementChrome";
import { DesimentorResizeHandle } from "./DesimentorResizeHandle";
import { DesimentorSlider } from "./DesimentorSlider";
import { WidgetContent } from "./WidgetContent";

export function DesimentorCanvasWidget({
  widget,
  sectionIndex,
  columnIndex,
  columnId,
}: {
  widget: DesimentorWidget;
  sectionIndex: number;
  columnIndex: number;
  columnId: string;
}) {
  const selectedId = useDesimentorStore((s) => s.selectedId);
  const select = useDesimentorStore((s) => s.select);
  const document = useDesimentorStore((s) => s.document);
  const updateDocument = useDesimentorStore((s) => s.updateDocument);
  const editorDevice = useDesimentorStore((s) => s.editorDevice);

  const isSelected = selectedId === widget.id;
  const isSlider = widget.type === "slider";
  const def = getWidgetDef(widget.type);
  const compact = isPlaceholderWidget(widget);
  const resizable = isResizableWidget(widget);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: widget.id,
    data: {
      kind: "widget",
      sectionIndex,
      columnIndex,
      columnId,
    } satisfies DndData,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    minHeight: widget.styles?.minHeight,
    width: widget.styles?.width,
    boxSizing: "border-box" as const,
  };

  useEffect(() => {
    if (!isSelected || !compact) return;
    if (!widget.styles?.minHeight && !widget.styles?.width) {
      const patch = defaultPlaceholderSize(widget);
      if (Object.keys(patch).length) {
        updateDocument(updateElementStyles(document, widget.id, patch));
      }
    }
  }, [isSelected, compact, widget.id, widget.styles?.minHeight, widget.styles?.width, document, updateDocument, widget]);

  function onPropChange(key: string, value: unknown) {
    updateDocument(updateWidgetProp(document, widget.id, key, value));
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`desimentor-canvas-widget${isSelected ? " is-selected" : ""}${compact ? " is-placeholder" : ""}${isDragging ? " is-dragging" : ""}${isSlider ? " is-slider-widget" : ""}`}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest(".desimentor-element-chrome-layer")) return;
        e.stopPropagation();
      }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest(".desimentor-element-chrome-layer")) return;
        e.stopPropagation();
        select(widget.id);
      }}
    >
      {isSelected ? (
        <div
          className="desimentor-element-chrome-layer"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <DesimentorElementChrome
            compact={compact}
            label={
              compact ? null : (
                <>
                  <i className={`fa-solid ${def?.icon ?? "fa-cube"}`} aria-hidden="true" />
                  {def?.label ?? widget.type}
                </>
              )
            }
            onDelete={() => {
              updateDocument(removeWidget(document, widget.id));
              select(null);
            }}
            dragAttributes={attributes}
            dragListeners={listeners}
          />
        </div>
      ) : null}
      <div className={`desimentor-widget-body${compact ? " is-placeholder-body" : ""}${isSlider ? " is-slider-body" : ""}`}>
        {isSlider ? (
          <DesimentorSlider
            widgetId={widget.id}
            props={widget.props}
            editable={isSelected}
            device={editorDevice}
            onPropChange={onPropChange}
            onSlideFieldChange={(slideIndex, field, value) => {
              updateDocument(updateSliderSlideField(document, widget.id, slideIndex, field, value));
            }}
          />
        ) : (
          <WidgetContent
            widget={widget}
            editable={isSelected && def?.inlineEditable !== false}
            onPropChange={onPropChange}
          />
        )}
      </div>
      {isSelected && resizable && !isSlider ? <DesimentorResizeHandle targetId={widget.id} /> : null}
    </div>
  );
}
