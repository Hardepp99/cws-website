"use client";

import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";
import type { ReactNode } from "react";

type Props = {
  compact?: boolean;
  label?: ReactNode;
  onDelete?: () => void;
  showDelete?: boolean;
  dragAttributes?: DraggableAttributes;
  dragListeners?: DraggableSyntheticListeners;
};

export function DesimentorElementChrome({
  compact = false,
  label,
  onDelete,
  showDelete = true,
  dragAttributes,
  dragListeners,
}: Props) {
  return (
    <div className={`desimentor-element-handle${compact ? " is-compact" : ""}`}>
      <button
        type="button"
        className="desimentor-drag-handle"
        title="Drag to move"
        {...dragAttributes}
        {...dragListeners}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <i className="fa-solid fa-grip-vertical" aria-hidden="true" />
      </button>
      {!compact && label ? <span className="desimentor-element-label">{label}</span> : <span className="desimentor-element-spacer" />}
      {showDelete && onDelete ? (
        <button
          type="button"
          className="desimentor-element-delete"
          title="Delete"
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete();
          }}
        >
          <i className="fa-solid fa-trash-can" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
