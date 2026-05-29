"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/client";

type Forum = {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
  status: string;
  sortOrder: number;
};

export function ForumForm({ forumId, isNew }: { forumId?: number; isNew?: boolean }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("fa-comments");
  const [status, setStatus] = useState("published");
  const [sortOrder, setSortOrder] = useState(0);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!forumId || isNew) return;
    adminFetch<Forum>(`/forums/${forumId}`)
      .then((f) => {
        setTitle(f.title);
        setSlug(f.slug);
        setDescription(f.description);
        setIcon(f.icon);
        setStatus(f.status);
        setSortOrder(f.sortOrder);
      })
      .catch((e) => setErr(String(e)));
  }, [forumId, isNew]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    const payload = { title, slug, description, icon, status, sortOrder };
    try {
      if (isNew) {
        const res = await adminFetch<{ forum: Forum }>("/forums", { method: "POST", json: payload });
        router.push(`/admin/forums/${res.forum.id}`);
        router.refresh();
        return;
      }
      await adminFetch(`/forums/${forumId}`, { method: "PUT", json: payload });
      setMsg("Forum saved.");
      router.refresh();
    } catch (ex) {
      setErr(String(ex));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!forumId || !confirm("Delete this forum and all its topics?")) return;
    await adminFetch(`/forums/${forumId}`, { method: "DELETE" });
    router.push("/admin/forums");
    router.refresh();
  }

  return (
    <form className="cms-card" style={{ maxWidth: 560 }} onSubmit={onSubmit}>
      <p className="cms-field-hint" style={{ marginTop: 0 }}>
        <Link href="/admin/forums">← All forums</Link>
      </p>
      <label className="cms-label">Title</label>
      <input className="cms-input" required value={title} onChange={(e) => setTitle(e.target.value)} />
      <label className="cms-label">Slug</label>
      <input className="cms-input" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-from-title" />
      <label className="cms-label">Description</label>
      <textarea className="cms-textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      <label className="cms-label">Icon (Font Awesome class)</label>
      <input className="cms-input" value={icon} onChange={(e) => setIcon(e.target.value)} />
      <label className="cms-label">Sort order</label>
      <input className="cms-input" type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value) || 0)} />
      <label className="cms-label">Status</label>
      <select className="cms-select" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
      {err ? <div className="cms-notice err">{err}</div> : null}
      {msg ? <div className="cms-notice ok">{msg}</div> : null}
      <div className="cms-form-actions">
        <button type="submit" className="cms-btn cms-btn-green" disabled={saving}>
          {saving ? "Saving…" : isNew ? "Create forum" : "Save forum"}
        </button>
        {!isNew ? (
          <button type="button" className="cms-btn cms-btn-danger" onClick={remove}>
            Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}
