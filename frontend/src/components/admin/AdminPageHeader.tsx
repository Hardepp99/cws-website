import Link from "next/link";
import type { ReactNode } from "react";
import { DesimentorEditLink } from "@/components/admin/DesimentorEditLink";
import type { DesimentorEntityType } from "@/lib/desimentor/types";

export type DesimentorHeaderLink = {
  entityType: DesimentorEntityType;
  entityId: number;
  label?: string;
};

export function AdminPageHeader({
  title,
  addNewHref,
  addNewLabel = "Add New",
  backHref,
  backLabel = "← Back to list",
  desimentor,
  actions,
  description,
}: {
  title: string;
  addNewHref?: string;
  addNewLabel?: string;
  backHref?: string;
  backLabel?: string;
  desimentor?: DesimentorHeaderLink;
  actions?: ReactNode;
  description?: string;
}) {
  return (
    <div className="wp-list-header wp-list-header--bar">
      <div className="wp-list-header__primary">
        <h1 className="wp-heading-inline">{title}</h1>
        {addNewHref ? (
          <Link href={addNewHref} className="page-title-action">
            {addNewLabel}
          </Link>
        ) : null}
      </div>
      <div className="wp-list-header__actions">
        {actions}
        {desimentor?.entityId ? (
          <DesimentorEditLink
            entityType={desimentor.entityType}
            entityId={desimentor.entityId}
            label={desimentor.label}
          />
        ) : null}
        {backHref ? (
          <Link href={backHref} className="page-title-action page-title-action-secondary">
            {backLabel}
          </Link>
        ) : null}
      </div>
      <hr className="wp-header-end" />
      {description ? <p className="wp-list-desc">{description}</p> : null}
    </div>
  );
}
