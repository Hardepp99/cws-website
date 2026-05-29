"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAdminSession } from "@/components/admin/AdminSessionProvider";
import { adminFetch } from "@/lib/admin/client";
import {
  CrmComposePanel,
  type CrmContact,
} from "@/components/admin/crm/CrmComposePanel";
import {
  CrmSummernoteEditor,
  type CrmSummernoteHandle,
} from "@/components/admin/crm/CrmSummernoteEditor";
import "./crm-inbox.css";

type InboxRow = {
  id: number;
  formType: string;
  fromName: string | null;
  fromEmail: string | null;
  subject: string | null;
  snippet: string | null;
  isRead: boolean;
  isStarred: boolean;
  folder: string;
  direction: string;
  createdAt: string;
  lastActivityAt: string;
};

type MessageDetail = InboxRow & {
  parentId?: number | null;
  payload: Record<string, unknown>;
  bodyHtml: string;
};

type Stats = {
  inbox: number;
  unread: number;
  starred: number;
  trash: number;
  byCategory: Record<string, number>;
};

type Folder = "inbox" | "sent" | "archive" | "trash";
type Category = "all" | "unread" | "starred" | "contact" | "enrollment" | "leads";
type ViewMode = "inbox" | "compose";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "contact", label: "Contact" },
  { id: "leads", label: "Leads" },
  { id: "enrollment", label: "Enrollment" },
  { id: "starred", label: "Starred" },
];

const FOLDERS: { id: Folder; label: string; icon: string }[] = [
  { id: "inbox", label: "Inbox", icon: "fa-inbox" },
  { id: "sent", label: "Sent", icon: "fa-paper-plane" },
  { id: "archive", label: "Archive", icon: "fa-box-archive" },
  { id: "trash", label: "Trash", icon: "fa-trash" },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function displayFrom(row: InboxRow): string {
  if (row.direction === "outbound") {
    return row.fromEmail ? `To: ${row.fromEmail}` : "Sent";
  }
  return row.fromName || row.fromEmail || row.formType || "Unknown";
}

function rowToContact(row: InboxRow): CrmContact | null {
  if (!row.fromEmail) return null;
  return {
    submissionId: row.id,
    email: row.fromEmail,
    name: row.fromName,
    formType: row.formType,
    lastSeen: row.lastActivityAt || row.createdAt,
  };
}

export function FormsCrmInbox() {
  const { isAdmin } = useAdminSession();
  const [view, setView] = useState<ViewMode>("inbox");
  const [composePreset, setComposePreset] = useState<{
    subject?: string;
    recipients?: CrmContact[];
    html?: string;
  }>();
  const [folder, setFolder] = useState<Folder>("inbox");
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [items, setItems] = useState<InboxRow[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [detail, setDetail] = useState<{ message: MessageDetail; thread: MessageDetail[] } | null>(
    null,
  );
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const replyEditorRef = useRef<CrmSummernoteHandle>(null);

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadStats = useCallback(() => {
    adminFetch<Stats>("/crm/stats").then(setStats).catch(() => {});
  }, []);

  const loadList = useCallback(() => {
    setLoading(true);
    setErr("");
    const params = new URLSearchParams({
      folder,
      category: folder === "inbox" ? category : "all",
      page: "1",
      perPage: "50",
    });
    if (searchDebounced) params.set("q", searchDebounced);
    adminFetch<{ items: InboxRow[] }>(`/crm/inbox?${params}`)
      .then((d) => {
        setItems(d.items);
        if (selectedId && !d.items.some((i) => i.id === selectedId)) {
          setSelectedId(null);
          setDetail(null);
        }
      })
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [folder, category, searchDebounced, selectedId]);

  const loadMessage = useCallback(
    async (id: number, options?: { autoMarkRead?: boolean }) => {
      const data = await adminFetch<{ message: MessageDetail; thread: MessageDetail[] }>(
        `/crm/messages/${id}`,
      );
      setDetail(data);

      const shouldMarkRead = options?.autoMarkRead === true && !data.message.isRead;
      if (!shouldMarkRead) {
        return;
      }

      await adminFetch(`/crm/messages/${id}`, {
        method: "PATCH",
        json: { is_read: true },
      });
      loadStats();
      setItems((prev) => prev.map((r) => (r.id === id ? { ...r, isRead: true } : r)));
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              message: { ...prev.message, isRead: true },
            }
          : prev,
      );
    },
    [loadStats],
  );

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (view === "inbox") loadList();
  }, [loadList, view]);

  useEffect(() => {
    if (selectedId && view === "inbox") {
      loadMessage(selectedId, { autoMarkRead: true }).catch((e) => setErr(String(e)));
    } else if (view === "inbox") {
      setDetail(null);
    }
  }, [selectedId, loadMessage, view]);

  function openCompose(preset?: typeof composePreset) {
    setComposePreset(preset);
    setView("compose");
    setSelectedId(null);
    setDetail(null);
  }

  function closeCompose() {
    setView("inbox");
    setComposePreset(undefined);
    loadList();
    loadStats();
  }

  function toggleRowCheck(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function emailSelectedFromList() {
    const recipients = items
      .filter((r) => checkedIds.has(r.id) && r.fromEmail)
      .map((r) => rowToContact(r))
      .filter((c): c is CrmContact => c !== null);
    if (recipients.length === 0) {
      setErr("Select messages that have an email address.");
      return;
    }
    openCompose({ recipients });
  }

  async function emptyTrash() {
    if (
      !window.confirm(
        "Permanently delete all messages in trash? This cannot be undone.",
      )
    ) {
      return;
    }
    setErr("");
    try {
      await adminFetch<{ deleted: number }>("/crm/trash/empty", {
        method: "POST",
        json: {},
      });
      setSelectedId(null);
      setDetail(null);
      loadList();
      loadStats();
    } catch (e) {
      setErr(String(e));
    }
  }

  async function patch(id: number, body: Record<string, unknown>) {
    const data = await adminFetch<{ message: MessageDetail; thread: MessageDetail[] }>(
      `/crm/messages/${id}`,
      { method: "PATCH", json: body },
    );
    if (selectedId === id && data?.message) {
      setDetail(data);
    }
    setItems((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next = { ...r };
        if ("is_read" in body) next.isRead = Boolean(body.is_read);
        if ("is_starred" in body) next.isStarred = Boolean(body.is_starred);
        if ("folder" in body && typeof body.folder === "string") next.folder = body.folder;
        return next;
      }),
    );
    loadStats();
    loadList();
  }

  async function sendReply() {
    if (!selectedId) return;
    const html = replyEditorRef.current?.getHtml() ?? "";
    if (replyEditorRef.current?.isEmpty()) return;
    setSending(true);
    setErr("");
    try {
      await adminFetch(`/crm/messages/${selectedId}/reply`, {
        method: "POST",
        json: { html },
      });
      replyEditorRef.current?.setHtml("");
      await loadMessage(selectedId, { autoMarkRead: false });
      loadList();
    } catch (e) {
      setErr(String(e));
    } finally {
      setSending(false);
    }
  }

  const unreadBadge = stats?.unread ?? 0;
  const trashBadge = stats?.trash ?? 0;
  const checkedWithEmail = items.filter((r) => checkedIds.has(r.id) && r.fromEmail).length;

  return (
    <>
      {err ? (
        <div className="cms-notice err" style={{ marginBottom: 12 }}>
          {err}
        </div>
      ) : null}
      <div className={`crm-inbox${view === "compose" ? " crm-inbox--compose" : ""}`}>
        <aside className="crm-inbox__rail">
          <button
            type="button"
            className={`cms-btn cms-btn-green crm-inbox__compose${view === "compose" ? " is-active" : ""}`}
            onClick={() => openCompose()}
          >
            <i className="fa-solid fa-pen" aria-hidden /> Compose
          </button>
          {FOLDERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`crm-inbox__nav-item${folder === f.id && view === "inbox" ? " is-active" : ""}`}
              onClick={() => {
                setFolder(f.id);
                setView("inbox");
                setSelectedId(null);
                setDetail(null);
              }}
            >
              <span>
                <i className={`fa-solid ${f.icon}`} aria-hidden /> {f.label}
              </span>
              {f.id === "inbox" && unreadBadge > 0 ? (
                <span className="crm-inbox__badge">{unreadBadge}</span>
              ) : null}
              {f.id === "trash" && trashBadge > 0 ? (
                <span className="crm-inbox__badge">{trashBadge}</span>
              ) : null}
            </button>
          ))}
          {folder === "inbox" && view === "inbox" ? (
            <>
              <div style={{ height: 8 }} />
              {CATEGORIES.map((c) => {
                const count =
                  c.id === "unread"
                    ? stats?.unread
                    : c.id === "starred"
                      ? stats?.starred
                      : stats?.byCategory?.[c.id];
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`crm-inbox__nav-item${category === c.id ? " is-active" : ""}`}
                    onClick={() => {
                      setCategory(c.id);
                      setSelectedId(null);
                    }}
                  >
                    <span>{c.label}</span>
                    {count ? <span className="crm-inbox__badge">{count}</span> : null}
                  </button>
                );
              })}
            </>
          ) : null}
          {isAdmin ? (
            <Link
              href="/admin/settings/email"
              className="crm-inbox__nav-item"
              style={{ marginTop: "auto", textDecoration: "none" }}
            >
              <span>
                <i className="fa-solid fa-gear" aria-hidden /> Email settings
              </span>
            </Link>
          ) : null}
        </aside>

        {view === "compose" ? (
          <CrmComposePanel onCancel={closeCompose} onSent={closeCompose} preset={composePreset} />
        ) : (
          <>
            <section className="crm-inbox__list">
              <div className="crm-inbox__list-toolbar">
                <input
                  type="search"
                  className="crm-inbox__search"
                  placeholder="Search messages…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {folder === "trash" && isAdmin ? (
                  <button
                    type="button"
                    className="cms-btn cms-btn-sm"
                    disabled={trashBadge === 0}
                    onClick={emptyTrash}
                    title="Admin only — permanently deletes all trashed messages"
                  >
                    Empty trash
                  </button>
                ) : null}
                {checkedWithEmail > 0 ? (
                  <button
                    type="button"
                    className="cms-btn cms-btn-sm cms-btn-green"
                    onClick={emailSelectedFromList}
                  >
                    Email selected ({checkedWithEmail})
                  </button>
                ) : null}
              </div>
              <div className="crm-inbox__rows">
                {loading && items.length === 0 ? (
                  <p style={{ padding: 16, color: "#86868b" }}>Loading…</p>
                ) : null}
                {!loading && items.length === 0 ? (
                  <p style={{ padding: 16, color: "#86868b" }}>No messages.</p>
                ) : null}
                {items.map((row) => (
                  <div
                    key={row.id}
                    className={`crm-inbox__row-wrap${selectedId === row.id ? " is-active" : ""}`}
                  >
                    {row.fromEmail && row.direction === "inbound" ? (
                      <input
                        type="checkbox"
                        className="crm-inbox__row-check"
                        checked={checkedIds.has(row.id)}
                        onChange={() => {}}
                        onClick={(e) => toggleRowCheck(row.id, e)}
                        aria-label={`Select ${row.fromEmail}`}
                      />
                    ) : (
                      <span className="crm-inbox__row-check-spacer" aria-hidden />
                    )}
                    <button
                      type="button"
                      className={`crm-inbox__row${!row.isRead ? " is-unread" : ""}`}
                      onClick={() => setSelectedId(row.id)}
                    >
                      <div className="crm-inbox__row-top">
                        <span className="crm-inbox__row-from">{displayFrom(row)}</span>
                        <span className="crm-inbox__row-date">
                          {formatDate(row.lastActivityAt || row.createdAt)}
                        </span>
                      </div>
                      <div className="crm-inbox__row-subject">
                        {row.subject || "(No subject)"}
                        <span className="crm-inbox__type-pill">{row.formType}</span>
                      </div>
                      <div className="crm-inbox__row-snippet">{row.snippet}</div>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="crm-inbox__detail">
              {!detail ? (
                <div className="crm-inbox__detail-empty">Select a message to read</div>
              ) : (
                <>
                  <header className="crm-inbox__detail-head">
                    <h2>{detail.message.subject || "(No subject)"}</h2>
                    <div className="crm-inbox__meta">
                      {detail.message.fromName ? `${detail.message.fromName} · ` : ""}
                      {detail.message.fromEmail || "—"} · {detail.message.createdAt}
                    </div>
                    <div className="crm-inbox__actions">
                      {detail.message.fromEmail && detail.message.direction === "inbound" ? (
                        <button
                          type="button"
                          className="cms-btn cms-btn-sm cms-btn-green"
                          onClick={() => {
                            const c = rowToContact(detail.message);
                            if (c) {
                              openCompose({
                                recipients: [c],
                                subject: detail.message.subject
                                  ? `Re: ${detail.message.subject.replace(/^Re:\s*/i, "")}`
                                  : undefined,
                              });
                            }
                          }}
                        >
                          Reply in composer
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="cms-btn cms-btn-sm"
                        onClick={() =>
                          patch(detail.message.id, { is_read: !detail.message.isRead })
                        }
                      >
                        {detail.message.isRead ? "Mark unread" : "Mark read"}
                      </button>
                      <button
                        type="button"
                        className="cms-btn cms-btn-sm"
                        onClick={() =>
                          patch(detail.message.id, { is_starred: !detail.message.isStarred })
                        }
                      >
                        {detail.message.isStarred ? "Unstar" : "Star"}
                      </button>
                      {detail.message.folder === "trash" ? (
                        <button
                          type="button"
                          className="cms-btn cms-btn-sm"
                          onClick={() => patch(detail.message.id, { folder: "inbox" })}
                        >
                          Restore to inbox
                        </button>
                      ) : (
                        <>
                          {detail.message.folder !== "archive" ? (
                            <button
                              type="button"
                              className="cms-btn cms-btn-sm"
                              onClick={() => patch(detail.message.id, { folder: "archive" })}
                            >
                              Archive
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="cms-btn cms-btn-sm"
                              onClick={() => patch(detail.message.id, { folder: "inbox" })}
                            >
                              Move to inbox
                            </button>
                          )}
                          <button
                            type="button"
                            className="cms-btn cms-btn-sm"
                            onClick={() => patch(detail.message.id, { folder: "trash" })}
                          >
                            Move to trash
                          </button>
                        </>
                      )}
                    </div>
                  </header>
                  <div className="crm-inbox__body">
                    {detail.thread.map((msg) => (
                      <article key={msg.id} className="crm-inbox__thread-item">
                        <div className="crm-inbox__thread-label">
                          {msg.direction === "outbound" ? "You replied" : displayFrom(msg)} ·{" "}
                          {msg.createdAt}
                        </div>
                        <div
                          className="crm-inbox__thread-html"
                          dangerouslySetInnerHTML={{ __html: msg.bodyHtml }}
                        />
                      </article>
                    ))}
                  </div>
                  {detail.message.fromEmail && detail.message.direction === "inbound" ? (
                    <div className="crm-inbox__reply crm-inbox__reply--editor">
                      <p className="cms-field-label" style={{ margin: "0 0 8px" }}>
                        Quick reply
                      </p>
                      <CrmSummernoteEditor ref={replyEditorRef} minHeight={200} />
                      <button
                        type="button"
                        className="cms-btn cms-btn-green"
                        style={{ marginTop: 8 }}
                        disabled={sending}
                        onClick={sendReply}
                      >
                        {sending ? "Sending…" : "Send reply"}
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}
