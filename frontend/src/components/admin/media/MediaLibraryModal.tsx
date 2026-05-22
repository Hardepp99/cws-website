"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaItem, MediaListResponse } from "@/lib/admin/media-types";
import { MEDIA_ACCEPT, MEDIA_ACCEPT_LABEL } from "@/lib/admin/media-types";
import { useAdminDialog } from "@/components/admin/dialog/AdminDialogProvider";
import { adminFetch, adminUploadFile } from "@/lib/admin/client";
import { MediaCropModal } from "./MediaCropModal";

export function MediaLibraryModal({
  onSelect,
  onClose,
  filterType = "image",
  title = "Media Library",
  compact = false,
}: {
  onSelect: (item: MediaItem) => void;
  onClose: () => void;
  filterType?: "all" | "image" | "audio" | "video" | "document";
  title?: string;
  compact?: boolean;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState(filterType);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [cropItem, setCropItem] = useState<MediaItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { confirm } = useAdminDialog();

  const load = useCallback(() => {
    setLoading(true);
    const qs = new URLSearchParams({
      page: String(page),
      perPage: "24",
      type,
      search,
    });
    adminFetch<MediaListResponse>(`/media/list?${qs}`)
      .then((d) => {
        setItems(d.items);
        setTotal(d.total);
      })
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [page, search, type]);

  useEffect(() => {
    load();
  }, [load]);

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setErr("");
    try {
      for (const file of Array.from(files)) {
        await adminUploadFile<{ item: MediaItem }>("/media/upload", file);
      }
      setPage(1);
      load();
    } catch (e) {
      setErr(String(e));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function saveMeta() {
    if (!editItem) return;
    try {
      const res = await adminFetch<{ item: MediaItem }>(`/media/${editItem.id}`, {
        method: "PUT",
        json: {
          altText: editItem.altText,
          title: editItem.title,
          caption: editItem.caption,
          description: editItem.description,
        },
      });
      setEditItem(res.item);
      load();
    } catch (e) {
      setErr(String(e));
    }
  }

  async function removeItem(id: number) {
    const ok = await confirm({
      title: "Delete file",
      message: "Delete this file permanently?",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    await adminFetch(`/media/${id}`, { method: "DELETE" });
    load();
  }

  const pages = Math.max(1, Math.ceil(total / 24));

  return (
    <div className="media-modal-backdrop" role="dialog" aria-modal="true">
      <div className={`media-modal media-library-modal${compact ? " media-library-modal--compact" : ""}`}>
        <div className="media-modal-head">
          <h2>{title}</h2>
          <button type="button" className="media-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="media-toolbar">
          <input
            type="search"
            className="cms-input"
            placeholder="Search media…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select className="cms-select" value={type} onChange={(e) => { setType(e.target.value as typeof type); setPage(1); }}>
            <option value="all">All types</option>
            <option value="image">Images</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
            <option value="document">Documents</option>
          </select>
          <button type="button" className="cms-btn" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? "Uploading…" : "Upload files"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept={MEDIA_ACCEPT}
            multiple
            hidden
            onChange={(e) => onUpload(e.target.files)}
          />
        </div>
        <p className="cms-field-hint">{MEDIA_ACCEPT_LABEL}. Code and script files are blocked.</p>
        {err ? <p className="cms-notice err">{err}</p> : null}

        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="media-grid">
            {items.map((item) => (
              <div key={item.id} className={`media-card media-card--${item.mediaType}`}>
                <button type="button" className="media-card-select" onClick={() => onSelect(item)}>
                  {item.mediaType === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.thumbUrl} alt={item.altText} />
                  ) : (
                    <span className="media-card-icon">
                      <i className={`fas fa-${item.mediaType === "audio" ? "music" : item.mediaType === "video" ? "film" : "file-pdf"}`} />
                    </span>
                  )}
                  <span className="media-card-name">{item.title || item.originalName}</span>
                </button>
                <div className="media-card-actions">
                  <button type="button" className="cms-btn-text" onClick={() => setEditItem(item)}>
                    SEO
                  </button>
                  {item.mediaType === "image" ? (
                    <button type="button" className="cms-btn-text" onClick={() => setCropItem(item)}>
                      Crop
                    </button>
                  ) : null}
                  <button type="button" className="cms-btn-text danger" onClick={() => removeItem(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pages > 1 ? (
          <div className="media-pager">
            <button type="button" className="cms-btn cms-btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              ‹ Prev
            </button>
            <span>
              Page {page} of {pages}
            </span>
            <button type="button" className="cms-btn cms-btn-ghost" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
              Next ›
            </button>
          </div>
        ) : null}

        {editItem ? (
          <div className="media-edit-panel">
            <h3>Attachment details (SEO)</h3>
            <label className="cms-label">Title</label>
            <input className="cms-input" value={editItem.title} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} />
            <label className="cms-label">Alt text (accessibility & SEO)</label>
            <input className="cms-input" value={editItem.altText} onChange={(e) => setEditItem({ ...editItem, altText: e.target.value })} />
            <label className="cms-label">Caption</label>
            <input className="cms-input" value={editItem.caption} onChange={(e) => setEditItem({ ...editItem, caption: e.target.value })} />
            <label className="cms-label">Description</label>
            <textarea className="cms-textarea" rows={2} value={editItem.description} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} />
            <div className="media-modal-foot">
              <button type="button" className="cms-btn" onClick={saveMeta}>
                Save details
              </button>
              <button type="button" className="cms-btn cms-btn-ghost" onClick={() => setEditItem(null)}>
                Close
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {cropItem ? (
        <MediaCropModal item={cropItem} onClose={() => setCropItem(null)} onSaved={() => load()} />
      ) : null}
    </div>
  );
}
