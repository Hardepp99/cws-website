"use client";

import { useParams } from "next/navigation";
import "@/app/admin/desimentor.css";
import { DesimentorEditor } from "@/components/desimentor/DesimentorEditor";
import type { DesimentorEntityType } from "@/lib/desimentor/types";

const BACK: Record<DesimentorEntityType, string> = {
  page: "/admin/site-pages",
  homepage: "/admin/homepage",
  service_landing: "/admin/landings",
  service: "/admin/services",
};

export default function DesimentorEditPage() {
  const params = useParams();
  const entityType = String(params.entityType ?? "");
  const entityId = parseInt(String(params.entityId ?? ""), 10);
  const type = entityType as DesimentorEntityType;

  if (!["page", "homepage", "service_landing", "service"].includes(type) || Number.isNaN(entityId)) {
    return <p>Invalid Desimentor route.</p>;
  }

  return (
    <DesimentorEditor
      entityType={type}
      entityId={entityId}
      entityLabel={`${type} #${entityId}`}
      backHref={BACK[type]}
    />
  );
}
