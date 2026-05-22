"use client";

import { useParams, useSearchParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { SectionItemsList } from "@/components/admin/homepage/SectionItemsList";

export default function SectionItemsListPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sectionId = parseInt(String(params.id), 10);
  const key = searchParams.get("key") || "items";
  const status = searchParams.get("status") || "all";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  return (
    <AdminShell title="Section items">
      <SectionItemsList sectionId={sectionId} repeaterKey={key} statusFilter={status} page={page} />
    </AdminShell>
  );
}
