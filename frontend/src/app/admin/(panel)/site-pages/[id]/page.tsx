"use client";

import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { SitePageForm } from "@/components/admin/site-pages/SitePageForm";

export default function AdminPageEditPage() {
  const params = useParams();
  const id = parseInt(String(params.id), 10);

  return (
    <AdminShell title="Edit page">
      <SitePageForm pageId={id} />
    </AdminShell>
  );
}
