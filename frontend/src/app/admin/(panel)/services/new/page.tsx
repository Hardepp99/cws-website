"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { ServiceForm } from "@/components/admin/services/ServiceForm";

export default function AdminServiceNewPage() {
  return (
    <AdminShell title="Add service">
      <ServiceForm isNew />
    </AdminShell>
  );
}
