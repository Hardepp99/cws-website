"use client";

import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ServiceForm } from "@/components/admin/services/ServiceForm";

export default function AdminServiceEditPage() {
  const params = useParams();
  const id = parseInt(String(params.id), 10);

  return (
    <AdminShell title="Edit service">
      <ServiceForm serviceId={id} />
    </AdminShell>
  );
}
