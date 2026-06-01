import { useEffect, type RefObject } from "react";

const DRAG_THRESHOLD_MOUSE = 8;
const DRAG_THRESHOLD_TOUCH = 16;

/**
 * Optional horizontal drag on an overflow strip. Pointer capture starts only after
 * a real drag so tab/button clicks still work.
 */
export function useHorizontalScrollDrag(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let activePointer: number | null = null;
    let startX = 0;
    let startScroll = 0;
    let isDragging = false;
    let suppressNextClick = false;

    const clearDragState = (pointerId: number) => {
      if (activePointer !== pointerId) return;
      if (isDragging && el.hasPointerCapture(pointerId)) {
        el.releasePointerCapture(pointerId);
      }
      activePointer = null;
      isDragging = false;
      el.classList.remove("is-dragging");
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (el.scrollWidth <= el.clientWidth + 1) return;

      activePointer = e.pointerId;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      isDragging = false;
      suppressNextClick = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerId !== activePointer) return;

      const dx = e.clientX - startX;
      const threshold =
        e.pointerType === "touch" ? DRAG_THRESHOLD_TOUCH : DRAG_THRESHOLD_MOUSE;

      if (!isDragging) {
        if (Math.abs(dx) < threshold) return;
        isDragging = true;
        el.setPointerCapture(e.pointerId);
        el.classList.add("is-dragging");
      }

      e.preventDefault();
      el.scrollLeft = startScroll - dx;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerId !== activePointer) return;
      suppressNextClick = isDragging;
      clearDragState(e.pointerId);
    };

    const onClickCapture = (e: MouseEvent) => {
      if (!suppressNextClick) return;
      suppressNextClick = false;
      e.preventDefault();
      e.stopPropagation();
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("click", onClickCapture, true);
      el.classList.remove("is-dragging");
    };
  }, [ref, enabled]);
}
