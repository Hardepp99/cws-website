"use client";

import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { LandingForm } from "@/components/admin/landings/LandingForm";

export default function AdminLandingEditPage() {
  const params = useParams();
  const id = parseInt(String(params.id), 10);

  return (
    <AdminShell title="Edit landing">
      <LandingForm landingId={id} />
    </AdminShell>
  );
}
