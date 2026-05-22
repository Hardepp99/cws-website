"use client";

import { useState } from "react";
import type { MediaItem } from "@/lib/admin/media-types";
import { MediaLibraryModal } from "./MediaLibraryModal";

export function MediaPickerField({
  label,
  value,
  onChange,
  hint,
  mediaFilter = "image",
  compact = false,
}: {
  label: string;
  value: string;
  onChange: (url: string, item?: MediaItem) => void;
  hint?: string;
  mediaFilter?: "all" | "image" | "audio" | "video" | "document";
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isImage = mediaFilter === "image" || /\.(jpe?g|png|gif|webp)(\?|$)/i.test(value);

  function select(item: MediaItem) {
    const url = item.mediaType === "image" ? item.largeUrl || item.url : item.url;
    onChange(url, item);
    setOpen(false);
  }

  return (
    <div className={`media-picker-field${compact ? " media-picker-field--compact" : ""}`}>
      <label className={compact ? "dsmt-label" : "cms-label"}>{label}</label>
      {hint ? <p className="cms-field-hint">{hint}</p> : null}
      <div className="media-picker-row">
        {value && isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="media-picker-preview" />
        ) : value ? (
          <span className="media-picker-file">{value.split("/").pop()}</span>
        ) : (
          <span className="media-picker-empty">No file selected</span>
        )}
        <div className="media-picker-btns">
          <button
            type="button"
            className={compact ? "dsmt-btn" : "cms-btn"}
            onClick={() => setOpen(true)}
          >
            {value ? "Replace" : compact ? "Library" : "Select from library"}
          </button>
          {value ? (
            <button
              type="button"
              className={compact ? "dsmt-link" : "cms-btn cms-btn-ghost"}
              onClick={() => onChange("")}
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>
      {open ? (
        <MediaLibraryModal
          title={label}
          filterType={mediaFilter}
          onSelect={select}
          onClose={() => setOpen(false)}
          compact={compact}
        />
      ) : null}
    </div>
  );
}
