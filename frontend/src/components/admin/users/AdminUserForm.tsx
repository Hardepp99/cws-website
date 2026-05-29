"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin/client";
import type { AdminRole } from "@/lib/admin/types";

type UserRow = {
  id: number;
  username: string;
  displayName: string;
  role: AdminRole;
};

export function AdminUserForm({ user }: { user?: UserRow }) {
  const router = useRouter();
  const isNew = !user;
  const [username, setUsername] = useState(user?.username ?? "");
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [role, setRole] = useState<AdminRole>(user?.role ?? "user");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    setMsg("");
    try {
      if (isNew) {
        await adminFetch("/users", {
          method: "POST",
          json: { username, displayName, role, password },
        });
        setMsg("User created.");
        router.push("/admin/users");
        router.refresh();
        return;
      }
      const body: Record<string, string> = { displayName, role };
      if (password.trim()) body.password = password;
      await adminFetch(`/users/${user.id}`, { method: "PUT", json: body });
      setMsg("User saved.");
      setPassword("");
      router.refresh();
    } catch (e) {
      setErr(String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="cms-card" onSubmit={onSubmit}>
      {err ? <div className="cms-notice err">{err}</div> : null}
      {msg ? <div className="cms-notice">{msg}</div> : null}

      {isNew ? (
        <>
          <label className="cms-label">Username</label>
          <input
            className="cms-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            required
            minLength={3}
          />
        </>
      ) : (
        <p className="cms-field-hint">
          Username: <strong>{user.username}</strong> (cannot be changed)
        </p>
      )}

      <label className="cms-label">Display name</label>
      <input
        className="cms-input"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        required
      />

      <label className="cms-label">Role</label>
      <select className="cms-input" value={role} onChange={(e) => setRole(e.target.value as AdminRole)}>
        <option value="user">User — edit content only</option>
        <option value="admin">Admin — full access + user management</option>
      </select>

      <label className="cms-label">{isNew ? "Password" : "New password (leave blank to keep)"}</label>
      <input
        className="cms-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        required={isNew}
        minLength={isNew ? 8 : undefined}
      />

      <p style={{ marginTop: 20 }}>
        <button type="submit" className="cms-btn cms-btn-green" disabled={saving}>
          {saving ? "Saving…" : isNew ? "Create user" : "Save user"}
        </button>
      </p>
    </form>
  );
}
