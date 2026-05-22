"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { listDesimentorTemplates } from "@/lib/admin/desimentor-client";
import type { DesimentorTemplate } from "@/lib/desimentor/types";
import "@/app/admin/desimentor.css";

export default function DesimentorTemplatesPage() {
  const [items, setItems] = useState<DesimentorTemplate[]>([]);

  useEffect(() => {
    listDesimentorTemplates("all").then((r) => setItems(r.items)).catch(() => setItems([]));
  }, []);

  return (
    <AdminShell title="Desimentor Templates">
      <div className="wp-list-header">
        <h1 className="wp-heading-inline">Desimentor Templates</h1>
        <Link href="/admin/site-pages" className="page-title-action">
          Back to admin
        </Link>
      </div>
      <ul className="desimentor-template-list">
        {items.map((t) => (
          <li key={t.id}>
            <strong>{t.name}</strong> — {t.category} ({t.slug})
          </li>
        ))}
      </ul>
      {items.length === 0 ? <p>No templates yet. Save from the Desimentor editor.</p> : null}
    </AdminShell>
  );
}
