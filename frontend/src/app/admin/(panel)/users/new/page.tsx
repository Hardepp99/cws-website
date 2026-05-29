"use client";

import Link from "next/link";
import { AdminRequireAdmin } from "@/components/admin/AdminRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminUserForm } from "@/components/admin/users/AdminUserForm";

export default function AdminUserNewPage() {
  return (
    <AdminShell title="Add user">
      <AdminRequireAdmin>
        <p style={{ marginBottom: 12 }}>
          <Link href="/admin/users">← All users</Link>
        </p>
        <AdminUserForm />
      </AdminRequireAdmin>
    </AdminShell>
  );
}
