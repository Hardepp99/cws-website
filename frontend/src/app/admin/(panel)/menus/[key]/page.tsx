"use client";

import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { MenuEditor } from "@/components/admin/menus/MenuEditor";

export default function AdminMenuEditPage() {
  const params = useParams();
  const key = params.key as string;

  return (
    <AdminShell title="Edit menu">
      <MenuEditor menuKey={key} />
    </AdminShell>
  );
}
