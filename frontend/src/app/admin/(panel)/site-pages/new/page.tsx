"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { SitePageForm } from "@/components/admin/site-pages/SitePageForm";

export default function AdminSitePageNewPage() {
  return (
    <AdminShell title="Add page">
      <SitePageForm isNew />
    </AdminShell>
  );
}
