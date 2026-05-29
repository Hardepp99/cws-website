"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useMemberSession } from "@/components/member/MemberSessionProvider";
import { memberFetch } from "@/lib/member/client";
import type { MemberContributions } from "@/lib/member/types";

export function AccountDashboard() {
  const { member, loading } = useMemberSession();
  const [data, setData] = useState<MemberContributions | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!member) return;
    memberFetch<MemberContributions>("/member/contributions")
      .then(setData)
      .catch((e) => setErr(String(e)));
  }, [member]);

  if (loading) {
    return <p className="text-muted">Loading your account…</p>;
  }

  if (!member) {
    return (
      <div className="account-guest">
        <p>Please sign in to view your profile and contributions.</p>
        <Link href="/account/login" className="btn btn-primary me-2">
          Sign in
        </Link>
        <Link href="/account/signup" className="btn btn-outline-primary">
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="account-dashboard">
      <header className="account-dashboard__hero">
        <div className="account-dashboard__avatar">{(member.displayName || "M").charAt(0).toUpperCase()}</div>
        <div>
          <h2 className="account-dashboard__name">{member.displayName}</h2>
          <p className="account-dashboard__email text-muted mb-0">{member.email}</p>
        </div>
      </header>

      {err ? <div className="alert alert-danger">{err}</div> : null}

      {data ? (
        <div className="account-stats">
          {[
            { label: "Comments", value: data.stats.comments, href: "#account-comments" },
            { label: "Blog posts", value: data.stats.blogPosts, href: "#account-posts" },
            { label: "Forum topics", value: data.stats.forumTopics, href: "#account-topics" },
            { label: "Replies", value: data.stats.forumReplies, href: "#account-replies" },
          ].map((s) => (
            <a key={s.label} href={s.href} className="account-stat account-stat--link">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </a>
          ))}
        </div>
      ) : null}

      <div className="account-actions">
        <Link href="/account/blog/new" className="btn btn-primary">
          Write a blog post
        </Link>
        <Link href="/community" className="btn btn-outline-primary">
          Browse forums
        </Link>
      </div>

      <div className="account-dashboard__grid">
        <AccountPanel
          id="account-comments"
          title="Blog comments"
          description="Comments you left on blog posts — pending items appear after admin approval."
          empty="You have not commented on any posts yet."
          hasRows={!!(data?.comments?.length ?? 0)}
        >
          <div className="account-table-wrap">
            <table className="account-table">
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Your comment</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {(data?.comments ?? []).map((c) => (
                  <tr key={c.id}>
                    <td>
                      {c.postSlug ? (
                        <Link href={`/blog/${c.postSlug}`}>{c.postTitle}</Link>
                      ) : (
                        c.postTitle
                      )}
                    </td>
                    <td className="account-table__excerpt">{truncate(c.body, 120)}</td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="account-table__date">{formatDate(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccountPanel>

        <AccountPanel
          id="account-posts"
          title="Your blog posts"
          description="Submissions are reviewed before they appear on the public blog."
          empty="No submissions yet."
          hasRows={!!(data?.blogPosts?.length ?? 0)}
        >
          <div className="account-table-wrap">
            <table className="account-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {(data?.blogPosts ?? []).map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/account/blog/${p.id}`}>{p.title}</Link>
                      {p.status === "published" && p.slug ? (
                        <>
                          <br />
                          <Link href={`/blog/${p.slug}`} className="account-table__sub">
                            View live
                          </Link>
                        </>
                      ) : null}
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="account-table__date">{formatDate(p.updatedAt || p.date)}</td>
                    <td>
                      {p.status !== "published" ? (
                        <Link href={`/account/blog/${p.id}`} className="account-table__action">
                          Edit
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccountPanel>

        <AccountPanel
          id="account-forums"
          title="Your forums"
          description="Forums you created or joined through topics and replies."
          empty="No forum activity yet. Browse community forums to get started."
          hasRows={!!(data?.forums?.length ?? 0)}
        >
          <div className="account-table-wrap">
            <table className="account-table">
              <thead>
                <tr>
                  <th>Forum</th>
                  <th>Your topics</th>
                  <th>Your replies</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {(data?.forums ?? []).map((f) => (
                  <tr key={f.id}>
                    <td>
                      <Link href={`/community/${f.slug}`}>{f.title}</Link>
                      {f.description ? (
                        <p className="account-table__sub">{truncate(f.description, 80)}</p>
                      ) : null}
                    </td>
                    <td>{f.myTopics}</td>
                    <td>{f.myReplies}</td>
                    <td>{f.createdByMe ? "Creator" : "Member"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccountPanel>

        <AccountPanel
          id="account-topics"
          title="Forum topics"
          description="Discussions you started."
          empty="You have not started any forum topics yet."
          hasRows={!!(data?.forumTopics?.length ?? 0)}
        >
          <div className="account-table-wrap">
            <table className="account-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Forum</th>
                  <th>Replies</th>
                  <th>Status</th>
                  <th>Last activity</th>
                </tr>
              </thead>
              <tbody>
                {(data?.forumTopics ?? []).map((t) => (
                  <tr key={t.id}>
                    <td>
                      <Link href={`/community/${t.forumSlug}/${t.slug}`}>{t.title}</Link>
                    </td>
                    <td>
                      <Link href={`/community/${t.forumSlug}`}>{t.forumTitle}</Link>
                    </td>
                    <td>{t.replyCount}</td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="account-table__date">{formatDate(t.lastActivity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccountPanel>

        <AccountPanel
          id="account-replies"
          title="Forum replies"
          description="Replies you posted in community discussions."
          empty="You have not posted any forum replies yet."
          hasRows={!!(data?.forumReplies?.length ?? 0)}
        >
          <div className="account-table-wrap">
            <table className="account-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Forum</th>
                  <th>Reply</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {(data?.forumReplies ?? []).map((r) => (
                  <tr key={r.id}>
                    <td>
                      <Link href={`/community/${r.forumSlug}/${r.topicSlug}`}>{r.topicTitle}</Link>
                    </td>
                    <td>
                      <Link href={`/community/${r.forumSlug}`}>{r.forumTitle}</Link>
                    </td>
                    <td className="account-table__excerpt">{truncate(r.body, 100)}</td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="account-table__date">{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccountPanel>
      </div>
    </div>
  );
}

function AccountPanel({
  id,
  title,
  description,
  empty,
  hasRows,
  children,
}: {
  id: string;
  title: string;
  description: string;
  empty: string;
  hasRows: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className="account-panel">
      <header className="account-panel__head">
        <h3 className="account-panel__title">{title}</h3>
        <p className="account-panel__desc text-muted">{description}</p>
      </header>
      {hasRows ? children : <p className="account-panel__empty text-muted">{empty}</p>}
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, " ");
  let cls = "account-badge account-badge--muted";
  if (status === "published" || status === "approved") cls = "account-badge account-badge--ok";
  else if (status === "pending" || status === "pending_review") cls = "account-badge account-badge--pending";
  else if (status === "rejected" || status === "spam") cls = "account-badge account-badge--bad";

  return <span className={cls}>{label}</span>;
}

function formatDate(value: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function truncate(text: string, max: number) {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}
