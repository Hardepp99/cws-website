"use client";

import { useCallback, useRef } from "react";
import { findSelectionPath } from "@/lib/desimentor/document-utils";
import { updateElementStyles } from "@/lib/desimentor/mutations";
import { useDesimentorStore } from "@/lib/desimentor/store";

function parsePx(v: string | undefined, fallback: number) {
  if (!v) return fallback;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

export function DesimentorResizeHandle({ targetId }: { targetId: string }) {
  const dragging = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dragging.current = true;

    const doc = useDesimentorStore.getState().document;
    const path = findSelectionPath(doc, targetId);
    if (path?.kind !== "widget" || path.columnIndex === undefined || path.widgetIndex === undefined) {
      return;
    }

    const widget = doc.sections[path.sectionIndex].columns[path.columnIndex].widgets[path.widgetIndex];
    const styles = widget.styles ?? {};
    const startX = e.clientX;
    const startY = e.clientY;
    const startH = parsePx(styles.minHeight, 120);
    const startW = parsePx(styles.width?.replace("%", ""), 100);
    const widthIsPercent = styles.width?.includes("%") ?? true;

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const dh = ev.clientY - startY;
      const dw = ev.clientX - startX;
      const minHeight = `${Math.max(48, Math.round(startH + dh))}px`;
      const width = widthIsPercent
        ? `${Math.min(100, Math.max(20, Math.round(startW + dw * 0.12)))}%`
        : `${Math.max(80, Math.round(parsePx(styles.width, 200) + dw))}px`;

      const current = useDesimentorStore.getState().document;
      useDesimentorStore.getState().updateDocument(updateElementStyles(current, targetId, { minHeight, width }));
    };

    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [targetId]);

  return (
    <div
      className="desimentor-resize-handle"
      title="Resize"
      onMouseDown={onMouseDown}
      onClick={(e) => e.stopPropagation()}
    />
  );
}
