"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { WysiwygField } from "@/components/admin/WysiwygField";
import { useMemberSession } from "@/components/member/MemberSessionProvider";
import { memberFetch } from "@/lib/member/client";

export function MemberBlogEditor({ postId }: { postId?: number }) {
  const router = useRouter();
  const { member, loading } = useMemberSession();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!postId || !member) return;
    memberFetch<{ title: string; excerpt: string; content: string; image: string }>(`/member/blog/${postId}`)
      .then((p) => {
        setTitle(p.title);
        setExcerpt(p.excerpt);
        setContent(p.content);
        setImage(p.image);
      })
      .catch((e) => setErr(String(e)));
  }, [postId, member]);

  if (loading) return <p className="text-muted">Loading…</p>;
  if (!member) {
    return (
      <p>
        <Link href="/account/login">Sign in</Link> to submit a blog post.
      </p>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    setMsg("");
    try {
      const payload = {
        title,
        excerpt,
        content_html: content,
        featured_image: image,
      };
      if (postId) {
        await memberFetch(`/member/blog/${postId}`, { method: "PUT", json: payload });
      } else {
        await memberFetch("/member/blog", { method: "POST", json: payload });
      }
      setMsg("Saved. Your post will appear on the blog after admin approval.");
      setTimeout(() => router.push("/account"), 1200);
    } catch (ex) {
      setErr(String(ex));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="member-blog-editor" onSubmit={onSubmit}>
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input className="form-control" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Excerpt</label>
        <textarea className="form-control" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Featured image URL (optional)</label>
        <input className="form-control" value={image} onChange={(e) => setImage(e.target.value)} />
      </div>
      <WysiwygField label="Article content" value={content} onChange={setContent} height={360} />
      <p className="form-text">Posts are reviewed by our team before publishing on the blog.</p>
      {err ? <div className="alert alert-danger py-2">{err}</div> : null}
      {msg ? <div className="alert alert-success py-2">{msg}</div> : null}
      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? "Saving…" : postId ? "Update submission" : "Submit for review"}
      </button>
    </form>
  );
}
