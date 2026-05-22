"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { LandingForm } from "@/components/admin/landings/LandingForm";

export default function AdminLandingNewPage() {
  return (
    <AdminShell title="Add landing">
      <LandingForm isNew />
    </AdminShell>
  );
}
