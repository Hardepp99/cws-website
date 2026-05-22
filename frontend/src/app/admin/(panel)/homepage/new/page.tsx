"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { HomepageSectionForm } from "@/components/admin/homepage/HomepageSectionForm";

export default function AdminHomepageNewPage() {
  return (
    <AdminShell title="Add section">
      <HomepageSectionForm isNew />
    </AdminShell>
  );
}
