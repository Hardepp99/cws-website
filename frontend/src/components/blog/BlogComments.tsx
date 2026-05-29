"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useMemberSession } from "@/components/member/MemberSessionProvider";
import { memberFetch } from "@/lib/member/client";

type Comment = {
  id: number;
  body: string;
  createdAt: string;
  displayName: string;
  status?: string;
  isOwn?: boolean;
};

export function BlogComments({ postSlug }: { postSlug: string }) {
  const { member, loading } = useMemberSession();
  const [items, setItems] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await memberFetch<{ items: Comment[] }>(`/blog/${postSlug}/comments`);
      setItems(data.items);
    } catch {
      setItems([]);
    }
  }, [postSlug]);

  useEffect(() => {
    load();
  }, [load]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!member) return;
    setSubmitting(true);
    setErr("");
    setMsg("");
    try {
      const res = await memberFetch<{ message?: string }>(`/blog/${postSlug}/comments`, {
        method: "POST",
        json: { body },
      });
      setBody("");
      setMsg(res.message || "Comment submitted for moderation.");
      await load();
    } catch (ex) {
      setErr(String(ex));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="blog-comments" aria-labelledby="blog-comments-title">
      <h2 id="blog-comments-title" className="blog-comments__title">
        Discussion
      </h2>
      {items.length > 0 ? (
        <ul className="blog-comments__list">
          {items.map((c) => (
            <li key={c.id} className="blog-comments__item">
              <div className="blog-comments__meta">
                <strong>{c.displayName}</strong>
                {c.isOwn && c.status && c.status !== "approved" ? (
                  <span className="blog-comments__pending badge bg-warning text-dark">
                    {c.status === "pending" ? "Awaiting approval" : c.status}
                  </span>
                ) : null}
                <time dateTime={c.createdAt}>
                  {new Date(c.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>
              <p>{c.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No approved comments yet. Be the first to share your thoughts.</p>
      )}

      {!loading && !member ? (
        <p className="blog-comments__signin">
          <Link href="/account/login">Sign in</Link> to join the discussion. Comments are reviewed before they appear.
        </p>
      ) : null}

      {member ? (
        <form className="blog-comments__form" onSubmit={onSubmit}>
          <label htmlFor="comment-body" className="form-label">
            Your comment
          </label>
          <textarea
            id="comment-body"
            className="form-control"
            rows={4}
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your perspective…"
          />
          <p className="form-text">Comments are moderated by our team before publishing.</p>
          {err ? <div className="alert alert-danger py-2">{err}</div> : null}
          {msg ? <div className="alert alert-success py-2">{msg}</div> : null}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Sending…" : "Post comment"}
          </button>
        </form>
      ) : null}
    </section>
  );
}
