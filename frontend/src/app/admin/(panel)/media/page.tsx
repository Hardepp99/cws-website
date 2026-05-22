"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { MediaCropModal } from "@/components/admin/media/MediaCropModal";
import type { MediaItem, MediaListResponse } from "@/lib/admin/media-types";
import { MEDIA_ACCEPT, MEDIA_ACCEPT_LABEL } from "@/lib/admin/media-types";
import { useAdminDialog } from "@/components/admin/dialog/AdminDialogProvider";
import { adminFetch, adminUploadFile } from "@/lib/admin/client";

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadAlt, setUploadAlt] = useState("");
  const [showUploadMeta, setShowUploadMeta] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);
  const [err, setErr] = useState("");
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [cropItem, setCropItem] = useState<MediaItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { confirm } = useAdminDialog();

  const load = useCallback(() => {
    setLoading(true);
    const qs = new URLSearchParams({ page: String(page), perPage: "30", type, search });
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

  function onFilesChosen(files: FileList | null) {
    if (!files?.length) return;
    const first = files[0];
    const base = first.name.replace(/\.[^.]+$/, "");
    setUploadTitle(base);
    setUploadAlt(base);
    setPendingFiles(files);
    setShowUploadMeta(true);
  }

  async function confirmUpload() {
    if (!pendingFiles?.length) return;
    setUploading(true);
    setErr("");
    try {
      for (const file of Array.from(pendingFiles)) {
        const base = file.name.replace(/\.[^.]+$/, "");
        await adminUploadFile<{ item: MediaItem }>("/media/upload", file, "file", {
          title: uploadTitle || base,
          altText: uploadAlt || uploadTitle || base,
        });
      }
      setPage(1);
      load();
      setShowUploadMeta(false);
      setPendingFiles(null);
    } catch (e) {
      setErr(String(e));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function saveMeta() {
    if (!editItem) return;
    await adminFetch(`/media/${editItem.id}`, {
      method: "PUT",
      json: {
        altText: editItem.altText,
        title: editItem.title,
        caption: editItem.caption,
        description: editItem.description,
      },
    });
    setEditItem(null);
    load();
  }

  const pages = Math.max(1, Math.ceil(total / 30));

  return (
    <AdminShell title="Media Library">
      <div className="wp-list-header">
        <h1 className="wp-heading-inline">Media Library</h1>
        <input
          ref={fileRef}
          type="file"
          accept={MEDIA_ACCEPT}
          multiple
          hidden
          onChange={(e) => onFilesChosen(e.target.files)}
        />
        <button type="button" className="page-title-action" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? "Uploading…" : "Add New"}
        </button>
        <hr className="wp-header-end" />
        <p className="wp-list-desc">{MEDIA_ACCEPT_LABEL}. Safe storage with auto resize. Images support crop & SEO metadata.</p>
      </div>

      <div className="media-toolbar">
        <input
          type="search"
          className="cms-input"
          placeholder="Search…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select className="cms-select" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
          <option value="all">All</option>
          <option value="image">Images</option>
          <option value="audio">Audio</option>
          <option value="video">Video</option>
          <option value="document">PDF</option>
        </select>
      </div>
      {err ? <div className="cms-notice err">{err}</div> : null}

      {showUploadMeta ? (
        <div className="cms-card media-upload-meta">
          <h2>Upload details (SEO)</h2>
          <label className="cms-label">Title</label>
          <input className="cms-input" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} />
          <label className="cms-label">Alt text</label>
          <input className="cms-input" value={uploadAlt} onChange={(e) => setUploadAlt(e.target.value)} />
          <button type="button" className="cms-btn" onClick={confirmUpload} disabled={uploading}>
            {uploading ? "Uploading…" : "Upload"}
          </button>{" "}
          <button
            type="button"
            className="cms-btn cms-btn-ghost"
            onClick={() => {
              setShowUploadMeta(false);
              setPendingFiles(null);
              if (fileRef.current) fileRef.current.value = "";
            }}
          >
            Cancel
          </button>
        </div>
      ) : null}

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="media-grid media-grid--page">
          {items.map((item) => (
            <div key={item.id} className="media-card">
              {item.mediaType === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.thumbUrl} alt={item.altText} className="media-card-img" />
              ) : (
                <div className="media-card-icon-lg">
                  <i className={`fas fa-${item.mediaType === "audio" ? "music" : item.mediaType === "video" ? "film" : "file-pdf"}`} />
                </div>
              )}
              <div className="media-card-meta">
                <strong>{item.title || item.originalName}</strong>
                <span>
                  {item.mediaType} · {(item.fileSize / 1024).toFixed(0)} KB
                  {item.width ? ` · ${item.width}×${item.height}` : ""}
                </span>
              </div>
              <div className="media-card-actions">
                <button type="button" className="cms-btn-text" onClick={() => setEditItem(item)}>
                  Edit SEO
                </button>
                {item.mediaType === "image" ? (
                  <button type="button" className="cms-btn-text" onClick={() => setCropItem(item)}>
                    Crop
                  </button>
                ) : null}
                <button
                  type="button"
                  className="cms-btn-text danger"
                  onClick={async () => {
                    const ok = await confirm({
                      title: "Delete file",
                      message: "Delete this file permanently?",
                      confirmLabel: "Delete",
                      danger: true,
                    });
                    if (!ok) return;
                    await adminFetch(`/media/${item.id}`, { method: "DELETE" });
                    load();
                  }}
                >
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
            {page} / {pages}
          </span>
          <button type="button" className="cms-btn cms-btn-ghost" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            Next ›
          </button>
        </div>
      ) : null}

      {editItem ? (
        <div className="cms-card media-edit-panel">
          <h2>Attachment details</h2>
          <label className="cms-label">Title</label>
          <input className="cms-input" value={editItem.title} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} />
          <label className="cms-label">Alt text</label>
          <input className="cms-input" value={editItem.altText} onChange={(e) => setEditItem({ ...editItem, altText: e.target.value })} />
          <label className="cms-label">Caption</label>
          <input className="cms-input" value={editItem.caption} onChange={(e) => setEditItem({ ...editItem, caption: e.target.value })} />
          <label className="cms-label">Description</label>
          <textarea className="cms-textarea" rows={3} value={editItem.description} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} />
          <p className="cms-field-hint">URL: {editItem.url}</p>
          <button type="button" className="cms-btn" onClick={saveMeta}>
            Save
          </button>{" "}
          <button type="button" className="cms-btn cms-btn-ghost" onClick={() => setEditItem(null)}>
            Cancel
          </button>
        </div>
      ) : null}

      {cropItem ? <MediaCropModal item={cropItem} onClose={() => setCropItem(null)} onSaved={load} /> : null}
    </AdminShell>
  );
}
