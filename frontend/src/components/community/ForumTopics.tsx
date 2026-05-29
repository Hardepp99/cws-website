"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useMemberSession } from "@/components/member/MemberSessionProvider";
import { memberFetch } from "@/lib/member/client";

type Topic = {
  id: number;
  slug: string;
  title: string;
  replyCount: number;
  isPinned: boolean;
  authorName: string;
  lastActivity: string;
};

export function ForumTopics({
  forumSlug,
  forumTitle,
  initialTopics,
}: {
  forumSlug: string;
  forumTitle: string;
  initialTopics: Topic[];
}) {
  const { member } = useMemberSession();
  const [topics] = useState(initialTopics);
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState("");

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!member) return;
    try {
      const res = await memberFetch<{ message?: string }>(`/community/forums/${forumSlug}/topics`, {
        method: "POST",
        json: { title, body },
      });
      setMsg(res.message || "Topic submitted for moderation.");
      setShowNew(false);
    } catch (ex) {
      setMsg(String(ex));
    }
  }

  return (
    <div className="forum-topics">
      <div className="forum-topics__head">
        <Link href="/community" className="text-muted small">
          ← All forums
        </Link>
        <h1>{forumTitle}</h1>
        {member ? (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowNew((v) => !v)}>
            {showNew ? "Cancel" : "New topic"}
          </button>
        ) : (
          <Link href="/account/login" className="btn btn-outline-primary btn-sm">
            Sign in to post
          </Link>
        )}
      </div>

      {showNew ? (
        <form className="forum-topic-form" onSubmit={onCreate}>
          <input className="form-control mb-2" placeholder="Topic title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="form-control mb-2" rows={5} placeholder="Start the discussion…" required value={body} onChange={(e) => setBody(e.target.value)} />
          <button type="submit" className="btn btn-primary btn-sm">
            Submit topic
          </button>
        </form>
      ) : null}
      {msg ? <p className="alert alert-info py-2">{msg}</p> : null}

      <ul className="forum-topic-list">
        {topics.map((t) => (
          <li key={t.id} className={t.isPinned ? "is-pinned" : ""}>
            <Link href={`/community/${forumSlug}/${t.slug}`} className="forum-topic-list__link">
              <strong>{t.title}</strong>
              <span className="forum-topic-list__meta">
                {t.authorName} · {t.replyCount} replies · {new Date(t.lastActivity).toLocaleDateString()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {topics.length === 0 ? <p className="text-muted">No published topics yet.</p> : null}
    </div>
  );
}
