"use client";

import { useParams, useSearchParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { SectionItemForm } from "@/components/admin/homepage/SectionItemForm";

export default function SectionItemEditPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sectionId = parseInt(String(params.id), 10);
  const itemId = String(params.itemId);
  const key = searchParams.get("key") || "items";

  return (
    <AdminShell title="Edit item">
      <SectionItemForm sectionId={sectionId} repeaterKey={key} itemId={itemId} />
    </AdminShell>
  );
}
