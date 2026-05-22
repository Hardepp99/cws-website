"use client";

import { useCallback, useRef, useState } from "react";
import type { MediaItem } from "@/lib/admin/media-types";
import { adminFetch } from "@/lib/admin/client";

export function MediaCropModal({
  item,
  onClose,
  onSaved,
}: {
  item: MediaItem;
  onClose: () => void;
  onSaved: (item: MediaItem) => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 200, h: 200 });
  const [drag, setDrag] = useState<"move" | "se" | null>(null);
  const [origin, setOrigin] = useState({ mx: 0, my: 0, x: 0, y: 0, w: 0, h: 0 });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onImgLoad = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const w = Math.min(img.naturalWidth, img.clientWidth);
    const h = Math.min(img.naturalHeight, img.clientHeight);
    const size = Math.min(w, h, 280);
    setCrop({ x: (w - size) / 2, y: (h - size) / 2, w: size, h: size });
  }, []);

  function pointerDown(e: React.PointerEvent, mode: "move" | "se") {
    e.preventDefault();
    setDrag(mode);
    setOrigin({ mx: e.clientX, my: e.clientY, ...crop });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function pointerMove(e: React.PointerEvent) {
    if (!drag || !imgRef.current) return;
    const img = imgRef.current;
    const maxW = img.clientWidth;
    const maxH = img.clientHeight;
    const dx = e.clientX - origin.mx;
    const dy = e.clientY - origin.my;
    if (drag === "move") {
      setCrop({
        x: Math.max(0, Math.min(maxW - origin.w, origin.x + dx)),
        y: Math.max(0, Math.min(maxH - origin.h, origin.y + dy)),
        w: origin.w,
        h: origin.h,
      });
    } else {
      const w = Math.max(40, Math.min(maxW - origin.x, origin.w + dx));
      const h = Math.max(40, Math.min(maxH - origin.y, origin.h + dy));
      setCrop({ x: origin.x, y: origin.y, w, h });
    }
  }

  function pointerUp() {
    setDrag(null);
  }

  async function applyCrop() {
    const img = imgRef.current;
    if (!img || !img.naturalWidth) return;
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;
    setBusy(true);
    setErr("");
    try {
      const res = await adminFetch<{ item: MediaItem }>(`/media/${item.id}/crop`, {
        method: "POST",
        json: {
          x: Math.round(crop.x * scaleX),
          y: Math.round(crop.y * scaleY),
          width: Math.round(crop.w * scaleX),
          height: Math.round(crop.h * scaleY),
        },
      });
      onSaved(res.item);
      onClose();
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="media-modal-backdrop" role="dialog" aria-modal="true">
      <div className="media-modal media-crop-modal">
        <div className="media-modal-head">
          <h2>Crop image</h2>
          <button type="button" className="media-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="media-crop-stage">
          <img
            ref={imgRef}
            src={item.originalUrl}
            alt=""
            onLoad={onImgLoad}
            draggable={false}
            className="media-crop-img"
          />
          <div
            className="media-crop-box"
            style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h }}
            onPointerDown={(e) => pointerDown(e, "move")}
            onPointerMove={pointerMove}
            onPointerUp={pointerUp}
          >
            <span
              className="media-crop-handle"
              onPointerDown={(e) => {
                e.stopPropagation();
                pointerDown(e, "se");
              }}
            />
          </div>
        </div>
        {err ? <p className="cms-notice err">{err}</p> : null}
        <p className="cms-field-hint">Drag to move · corner handle to resize · saves new scaled versions (thumb, medium, large).</p>
        <div className="media-modal-foot">
          <button type="button" className="cms-btn" onClick={applyCrop} disabled={busy}>
            {busy ? "Saving…" : "Apply crop"}
          </button>
          <button type="button" className="cms-btn cms-btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
