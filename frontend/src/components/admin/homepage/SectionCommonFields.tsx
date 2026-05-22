"use client";

import { layoutLabel } from "@/components/admin/homepage/layouts";

export function SectionCommonFields({
  adminTitle,
  status,
  layout,
  onAdminTitleChange,
  onStatusChange,
  showLayout = true,
}: {
  adminTitle: string;
  status: string;
  layout: string;
  onAdminTitleChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  showLayout?: boolean;
}) {
  return (
    <div className="section-common-fields">
      <label className="cms-label">Admin title</label>
      <input
        className="cms-input"
        type="text"
        value={adminTitle}
        onChange={(e) => onAdminTitleChange(e.target.value)}
        placeholder="Label in admin list (optional)"
      />
      <label className="cms-label">Status</label>
      <select className="cms-select" value={status} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="published">Published — visible on site</option>
        <option value="draft">Draft — hidden on site</option>
        {status === "trash" ? <option value="trash">Trash</option> : null}
      </select>
      {status === "trash" ? (
        <p className="cms-notice">In trash — not shown on the site. Set to Draft or Published to restore.</p>
      ) : null}
      {showLayout ? (
        <p className="cms-field-hint">
          Layout: <strong>{layoutLabel(layout)}</strong>
        </p>
      ) : null}
    </div>
  );
}
