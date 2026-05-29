"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useMemberSession } from "@/components/member/MemberSessionProvider";
import { memberFetch } from "@/lib/member/client";

export type ForumItem = {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  topicCount: number;
};

export function ForumHub({ initialForums }: { initialForums: ForumItem[] }) {
  const { member } = useMemberSession();
  const [forums, setForums] = useState(initialForums);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");

  async function createForum(e: FormEvent) {
    e.preventDefault();
    if (!member) return;
    try {
      const res = await memberFetch<{ slug: string }>("/community/forums", {
        method: "POST",
        json: { title, description },
      });
      setMsg("Forum created.");
      setShowCreate(false);
      const list = await memberFetch<{ items: ForumItem[] }>("/community/forums");
      setForums(list.items);
      setTitle("");
      setDescription("");
      void res;
    } catch (ex) {
      setMsg(String(ex));
    }
  }

  return (
    <div className="forum-hub">
      <div className="forum-hub__head">
        <p className="text-muted mb-0">Discuss services, projects, and ideas with the CWS community.</p>
        {member ? (
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? "Cancel" : "Create forum"}
          </button>
        ) : (
          <Link href="/account/login" className="btn btn-outline-primary btn-sm">
            Sign in to participate
          </Link>
        )}
      </div>

      {showCreate && member ? (
        <form className="forum-create-card" onSubmit={createForum}>
          <h3>New forum</h3>
          <input className="form-control mb-2" placeholder="Forum title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="form-control mb-2" placeholder="Short description" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          <button type="submit" className="btn btn-primary btn-sm">
            Create
          </button>
        </form>
      ) : null}
      {msg ? <p className="small text-muted">{msg}</p> : null}

      <div className="forum-grid">
        {forums.map((f) => (
          <Link key={f.id} href={`/community/${f.slug}`} className="forum-card">
            <span className="forum-card__icon">
              <i className={`fas ${f.icon || "fa-comments"}`} aria-hidden="true" />
            </span>
            <h2>{f.title}</h2>
            <p>{f.description || "Open discussion"}</p>
            <span className="forum-card__meta">{f.topicCount} topics</span>
          </Link>
        ))}
      </div>
      {forums.length === 0 ? <p className="text-muted">No forums yet. Be the first to create one.</p> : null}
    </div>
  );
}
