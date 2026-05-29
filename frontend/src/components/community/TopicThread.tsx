"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useMemberSession } from "@/components/member/MemberSessionProvider";
import { memberFetch } from "@/lib/member/client";

type Reply = {
  id: number;
  body: string;
  displayName: string;
  createdAt: string;
};

type Topic = {
  id: number;
  title: string;
  body: string;
  authorName: string;
  createdAt: string;
  replies: Reply[];
};

export function TopicThread({
  forumSlug,
  forumTitle,
  topic,
}: {
  forumSlug: string;
  forumTitle: string;
  topic: Topic;
}) {
  const { member } = useMemberSession();
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState("");

  async function onReply(e: FormEvent) {
    e.preventDefault();
    if (!member) return;
    try {
      const res = await memberFetch<{ message?: string }>(`/community/topics/${topic.id}/replies`, {
        method: "POST",
        json: { body },
      });
      setMsg(res.message || "Reply submitted for moderation.");
      setBody("");
    } catch (ex) {
      setMsg(String(ex));
    }
  }

  return (
    <article className="topic-thread">
      <nav className="topic-thread__crumb">
        <Link href="/community">Community</Link>
        <span>/</span>
        <Link href={`/community/${forumSlug}`}>{forumTitle}</Link>
      </nav>
      <header className="topic-thread__header">
        <h1>{topic.title}</h1>
        <p className="text-muted small">
          {topic.authorName} · {new Date(topic.createdAt).toLocaleString()}
        </p>
      </header>
      <div className="topic-thread__body" dangerouslySetInnerHTML={{ __html: topic.body.replace(/\n/g, "<br>") }} />

      <section className="topic-replies">
        <h2>Replies ({topic.replies.length})</h2>
        <ul>
          {topic.replies.map((r) => (
            <li key={r.id}>
              <strong>{r.displayName}</strong>
              <time>{new Date(r.createdAt).toLocaleString()}</time>
              <p>{r.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {member ? (
        <form onSubmit={onReply} className="topic-reply-form">
          <label className="form-label">Add a reply</label>
          <textarea className="form-control mb-2" rows={4} required value={body} onChange={(e) => setBody(e.target.value)} />
          {msg ? <p className="small text-muted">{msg}</p> : null}
          <button type="submit" className="btn btn-primary btn-sm">
            Post reply
          </button>
        </form>
      ) : (
        <p>
          <Link href="/account/login">Sign in</Link> to reply. Replies are moderated.
        </p>
      )}
    </article>
  );
}
