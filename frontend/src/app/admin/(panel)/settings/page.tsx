"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { SiteSettingsForm } from "@/components/admin/settings/SiteSettingsForm";

export default function AdminSettingsPage() {
  return (
    <AdminShell title="Site settings">
      <SiteSettingsForm />
    </AdminShell>
  );
}
