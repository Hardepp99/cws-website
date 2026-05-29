"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin/client";
import {
  CrmSummernoteEditor,
  type CrmSummernoteHandle,
} from "@/components/admin/crm/CrmSummernoteEditor";

export type CrmContact = {
  submissionId: number;
  email: string;
  name: string | null;
  formType: string;
  lastSeen: string;
};

type ComposePreset = {
  subject?: string;
  recipients?: CrmContact[];
  html?: string;
};

type Props = {
  onCancel: () => void;
  onSent: () => void;
  preset?: ComposePreset;
};

function contactKey(c: CrmContact): string {
  return c.email.toLowerCase();
}

export function CrmComposePanel({ onCancel, onSent, preset }: Props) {
  const editorRef = useRef<CrmSummernoteHandle>(null);
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [contactSearch, setContactSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(() => {
    const s = new Set<string>();
    preset?.recipients?.forEach((r) => s.add(contactKey(r)));
    return s;
  });
  const [extraTo, setExtraTo] = useState("");
  const [subject, setSubject] = useState(preset?.subject ?? "");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const loadContacts = useCallback(() => {
    const q = contactSearch.trim();
    const path = q ? `/crm/contacts?q=${encodeURIComponent(q)}` : "/crm/contacts";
    adminFetch<{ items: CrmContact[] }>(path)
      .then((d) => setContacts(d.items))
      .catch(() => {});
  }, [contactSearch]);

  useEffect(() => {
    const t = setTimeout(loadContacts, 250);
    return () => clearTimeout(t);
  }, [loadContacts]);

  useEffect(() => {
    if (preset?.html) {
      const t = setTimeout(() => editorRef.current?.setHtml(preset.html!), 400);
      return () => clearTimeout(t);
    }
  }, [preset?.html]);

  const selectedContacts = useMemo(
    () => contacts.filter((c) => selected.has(contactKey(c))),
    [contacts, selected],
  );

  const extraEmails = useMemo(() => {
    return extraTo
      .split(/[\s,;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes("@"));
  }, [extraTo]);

  const totalRecipients = selected.size + extraEmails.length;

  function toggleContact(c: CrmContact) {
    const key = contactKey(c);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function selectAllVisible() {
    setSelected((prev) => {
      const next = new Set(prev);
      contacts.forEach((c) => next.add(contactKey(c)));
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
    setExtraTo("");
  }

  async function send() {
    setErr("");
    setMsg("");
    const html = editorRef.current?.getHtml() ?? "";
    if (!subject.trim()) {
      setErr("Subject is required.");
      return;
    }
    if (editorRef.current?.isEmpty()) {
      setErr("Message body is required.");
      return;
    }
    if (totalRecipients === 0) {
      setErr("Select at least one contact or enter an email address.");
      return;
    }

    const recipients = [
      ...selectedContacts.map((c) => ({
        email: c.email,
        name: c.name,
        submissionId: c.submissionId,
      })),
      ...extraEmails
        .filter((e) => !selected.has(e))
        .map((email) => ({ email })),
    ];

    setSending(true);
    try {
      const res = await adminFetch<{
        sent: number;
        failed: { email: string; error: string }[];
        total: number;
      }>("/crm/compose", {
        method: "POST",
        json: {
          subject: subject.trim(),
          html,
          recipients,
          to: extraTo.trim(),
        },
      });
      const failCount = res.failed?.length ?? 0;
      setMsg(
        failCount > 0
          ? `Sent ${res.sent} of ${res.total}. ${failCount} failed.`
          : `Sent to ${res.sent} recipient${res.sent === 1 ? "" : "s"}.`,
      );
      setTimeout(() => onSent(), 800);
    } catch (e) {
      setErr(String(e));
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="crm-compose">
      <header className="crm-compose__head">
        <div>
          <h2 className="crm-compose__title">Compose email</h2>
          <p className="crm-field-hint" style={{ margin: "4px 0 0" }}>
            HTML editor · send to one or many contacts
          </p>
        </div>
        <div className="crm-compose__head-actions">
          <button type="button" className="cms-btn" disabled={sending} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="cms-btn cms-btn-green"
            disabled={sending || totalRecipients === 0}
            onClick={send}
          >
            {sending
              ? "Sending…"
              : totalRecipients > 1
                ? `Send to ${totalRecipients} contacts`
                : "Send"}
          </button>
        </div>
      </header>

      {err ? <div className="cms-notice err">{err}</div> : null}
      {msg ? <div className="cms-notice ok">{msg}</div> : null}

      <div className="crm-compose__grid">
        <aside className="crm-compose__contacts">
          <div className="crm-compose__contacts-head">
            <strong>Contacts</strong>
            <span className="crm-compose__count">{selected.size} selected</span>
          </div>
          <input
            type="search"
            className="crm-inbox__search"
            placeholder="Search contacts…"
            value={contactSearch}
            onChange={(e) => setContactSearch(e.target.value)}
          />
          <div className="crm-compose__contact-actions">
            <button type="button" className="cms-btn cms-btn-sm" onClick={selectAllVisible}>
              Select all
            </button>
            <button type="button" className="cms-btn cms-btn-sm" onClick={clearSelection}>
              Clear
            </button>
          </div>
          <ul className="crm-compose__contact-list">
            {contacts.map((c) => {
              const key = contactKey(c);
              const checked = selected.has(key);
              return (
                <li key={key}>
                  <label className="crm-compose__contact-row">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleContact(c)}
                    />
                    <span className="crm-compose__contact-info">
                      <span className="crm-compose__contact-name">
                        {c.name || c.email}
                      </span>
                      {c.name ? (
                        <span className="crm-compose__contact-email">{c.email}</span>
                      ) : null}
                      <span className="crm-inbox__type-pill">{c.formType}</span>
                    </span>
                  </label>
                </li>
              );
            })}
            {contacts.length === 0 ? (
              <li className="crm-compose__contact-empty">No contacts found.</li>
            ) : null}
          </ul>
          <label className="crm-compose__extra">
            <span className="cms-field-label">Additional recipients</span>
            <input
              type="text"
              placeholder="email@example.com, other@example.com"
              value={extraTo}
              onChange={(e) => setExtraTo(e.target.value)}
            />
          </label>
        </aside>

        <div className="crm-compose__editor-pane">
          <label className="crm-compose__field">
            <span className="cms-field-label">Subject</span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
            />
          </label>
          <div className="crm-compose__editor-wrap">
            <CrmSummernoteEditor ref={editorRef} minHeight={420} />
          </div>
        </div>
      </div>
    </section>
  );
}
