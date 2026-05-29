"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminRequireAdmin } from "@/components/admin/AdminRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminFetch } from "@/lib/admin/client";
import type { AdminRole } from "@/lib/admin/types";

type UserRow = {
  id: number;
  username: string;
  displayName: string;
  role: AdminRole;
  createdAt: string;
};

function UsersList() {
  const [items, setItems] = useState<UserRow[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    adminFetch<{ items: UserRow[] }>("/users/list")
      .then((d) => setItems(d.items))
      .catch((e) => setErr(String(e)));
  }, []);

  return (
    <>
      {err ? <div className="cms-notice err">{err}</div> : null}
      <div className="cms-card">
        <div className="cms-users-head">
          <div>
            <h2 style={{ margin: 0 }}>Admin users</h2>
            <p className="cms-field-hint" style={{ margin: "6px 0 0" }}>
              Only admins can create users and set passwords. Users cannot manage other accounts.
            </p>
          </div>
          <Link href="/admin/users/new" className="cms-btn cms-btn-green">
            Add user
          </Link>
        </div>
        <table className="cms-table" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Role</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id}>
                <td>
                  <strong>{u.username}</strong>
                </td>
                <td>{u.displayName}</td>
                <td>
                  <span className={`cms-role-badge cms-role-badge--${u.role}`}>{u.role}</span>
                </td>
                <td>{u.createdAt}</td>
                <td className="column-actions">
                  <div className="row-actions row-actions-buttons">
                    <Link href={`/admin/users/${u.id}`} className="row-action-btn row-action-btn--edit">
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminShell title="Users">
      <AdminRequireAdmin>
        <UsersList />
      </AdminRequireAdmin>
    </AdminShell>
  );
}
