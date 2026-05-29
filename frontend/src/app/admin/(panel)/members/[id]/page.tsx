"use client";

import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { AdminRequireAdmin } from "@/components/admin/AdminRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminFetch } from "@/lib/admin/client";

function MemberEditForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState("active");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    adminFetch<{ displayName: string; status: string }>(`/members/${id}`)
      .then((m) => {
        setDisplayName(m.displayName);
        setStatus(m.status);
      })
      .catch((e) => setErr(String(e)));
  }, [id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      await adminFetch(`/members/${id}`, {
        method: "PUT",
        json: { displayName, status, ...(password ? { password } : {}) },
      });
      setMsg("Saved.");
      router.refresh();
    } catch (ex) {
      setErr(String(ex));
    }
  }

  async function suspend() {
    if (!confirm("Suspend this member? They will not be able to sign in.")) return;
    await adminFetch(`/members/${id}`, { method: "DELETE" });
    router.push("/admin/members");
  }

  return (
    <>
      <p className="cms-breadcrumb">
        <Link href="/admin/members">Members</Link> / Edit
      </p>
      <form className="cms-card" onSubmit={onSubmit} style={{ maxWidth: 480 }}>
      <h2>Edit member</h2>
      <div className="cms-field">
        <label>Display name</label>
        <input className="cms-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
      </div>
      <div className="cms-field">
        <label>Status</label>
        <select className="cms-input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      <div className="cms-field">
        <label>New password (optional)</label>
        <input type="password" className="cms-input" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} />
      </div>
      {err ? <div className="cms-notice err">{err}</div> : null}
      {msg ? <div className="cms-notice ok">{msg}</div> : null}
      <div className="cms-form-actions">
        <button type="submit" className="cms-btn cms-btn-green">
          Save
        </button>
        <button type="button" className="cms-btn cms-btn-danger" onClick={suspend}>
          Suspend
        </button>
      </div>
    </form>
    </>
  );
}

export default function AdminMemberEditPage() {
  return (
    <AdminShell title="Edit member">
      <AdminRequireAdmin>
        <MemberEditForm />
      </AdminRequireAdmin>
    </AdminShell>
  );
}
