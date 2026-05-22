"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { paletteId } from "@/lib/desimentor/dnd-data";
import type { WidgetDef } from "@/lib/desimentor/widget-registry";
import { useDesimentorStore } from "@/lib/desimentor/store";

export function DesimentorPaletteWidget({ def }: { def: WidgetDef }) {
  const queueWidget = useDesimentorStore((s) => s.queueWidget);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: paletteId(def.type),
    data: { kind: "palette", widgetType: def.type },
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.5 : 1 }
    : undefined;

  return (
    <button
      ref={setNodeRef}
      type="button"
      className="desimentor-widget-tile"
      style={style}
      title={def.label}
      onClick={() => queueWidget(def.type)}
      {...listeners}
      {...attributes}
    >
      <i className={`fa-solid ${def.icon}`} aria-hidden="true" />
      <span className="desimentor-widget-tile-label">{def.label}</span>
    </button>
  );
}
