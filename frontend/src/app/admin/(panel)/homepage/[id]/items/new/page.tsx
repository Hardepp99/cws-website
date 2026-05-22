"use client";

import { useParams, useSearchParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { SectionItemForm } from "@/components/admin/homepage/SectionItemForm";

export default function SectionItemNewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sectionId = parseInt(String(params.id), 10);
  const key = searchParams.get("key") || "items";

  return (
    <AdminShell title="Add item">
      <SectionItemForm sectionId={sectionId} repeaterKey={key} isNew />
    </AdminShell>
  );
}
