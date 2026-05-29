"use client";

import Link from "next/link";
import { useAdminSession } from "@/components/admin/AdminSessionProvider";

export function AdminRequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAdminSession();

  if (loading) {
    return <p className="cms-admin-loading">Loading…</p>;
  }

  if (!isAdmin) {
    return (
      <div className="cms-notice err">
        <p>You do not have permission to view this page. Admin role required.</p>
        <p style={{ marginTop: 12 }}>
          <Link href="/admin">← Back to dashboard</Link>
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="cms-notice err">
        <p>Session expired. Please sign in again.</p>
      </div>
    );
  }

  return <>{children}</>;
}
