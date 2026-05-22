import Link from "next/link";
import type { DesimentorEntityType } from "@/lib/desimentor/types";

export function DesimentorEditLink({
  entityType,
  entityId,
  label = "Edit with Desimentor",
}: {
  entityType: DesimentorEntityType;
  entityId: number;
  label?: string;
}) {
  if (!entityId) return null;
  return (
    <Link
      href={`/admin/desimentor/${entityType}/${entityId}`}
      className="desimentor-edit-link"
      title="Open visual page builder"
    >
      <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
