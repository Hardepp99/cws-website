import Link from "next/link";
import type { ReactNode } from "react";
import { AdminPageHeader, type DesimentorHeaderLink } from "@/components/admin/AdminPageHeader";

export function WpEditScreen({
  title,
  backHref,
  backLabel = "← Back to list",
  desimentor,
  headerActions,
  onSave,
  saving,
  saveLabel = "Update",
  message,
  error,
  children,
}: {
  title: string;
  backHref: string;
  backLabel?: string;
  desimentor?: DesimentorHeaderLink;
  headerActions?: ReactNode;
  onSave: () => void;
  saving?: boolean;
  saveLabel?: string;
  message?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminPageHeader
        title={title}
        backHref={backHref}
        backLabel={backLabel}
        desimentor={desimentor}
        actions={headerActions}
      />
      {message ? <div className="cms-notice">{message}</div> : null}
      {error ? <div className="cms-notice err">{error}</div> : null}
      <div className="cms-card wp-edit-card">
        {children}
        <p className="wp-edit-actions">
          <button type="button" className="cms-btn" onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : saveLabel}
          </button>{" "}
          <Link href={backHref} className="cms-btn cms-btn-ghost">
            Cancel
          </Link>
        </p>
      </div>
    </>
  );
}
