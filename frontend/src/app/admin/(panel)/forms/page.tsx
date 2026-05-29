"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { FormsCrmInbox } from "@/components/admin/crm/FormsCrmInbox";

export default function AdminFormsPage() {
  return (
    <AdminShell title="Inbox">
      <FormsCrmInbox />
    </AdminShell>
  );
}
