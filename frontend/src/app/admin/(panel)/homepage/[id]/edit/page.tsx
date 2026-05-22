"use client";

import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { HomepageSectionForm } from "@/components/admin/homepage/HomepageSectionForm";

export default function AdminHomepageEditPage() {
  const params = useParams();
  const id = parseInt(String(params.id), 10);

  return (
    <AdminShell title="Edit section">
      <HomepageSectionForm sectionId={id} />
    </AdminShell>
  );
}
