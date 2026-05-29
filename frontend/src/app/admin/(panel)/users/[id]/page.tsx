"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { AdminRequireAdmin } from "@/components/admin/AdminRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminUserForm } from "@/components/admin/users/AdminUserForm";
import { adminFetch } from "@/lib/admin/client";
import type { AdminRole } from "@/lib/admin/types";

function EditUser({ id }: { id: number }) {
  const [user, setUser] = useState<{
    id: number;
    username: string;
    displayName: string;
    role: AdminRole;
  } | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    adminFetch<{
      id: number;
      username: string;
      displayName: string;
      role: AdminRole;
    }>(`/users/${id}`)
      .then(setUser)
      .catch((e) => setErr(String(e)));
  }, [id]);

  if (err) return <div className="cms-notice err">{err}</div>;
  if (!user) return <p>Loading user…</p>;

  return <AdminUserForm user={user} />;
}

export default function AdminUserEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = use(params);
  const id = Number(idParam);

  return (
    <AdminShell title="Edit user">
      <AdminRequireAdmin>
        <p style={{ marginBottom: 12 }}>
          <Link href="/admin/users">← All users</Link>
        </p>
        <EditUser id={id} />
      </AdminRequireAdmin>
    </AdminShell>
  );
}
