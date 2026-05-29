import Link from "next/link";
import { adminListPath } from "@/lib/admin/list-query";

export type StatusView = { id: string; label: string; count?: number };

export function WpStatusFilter({
  listPath,
  views,
  current,
  listQuery = {},
}: {
  listPath: string;
  views: StatusView[];
  current: string;
  listQuery?: Record<string, string | undefined>;
}) {
  return (
    <ul className="wp-status-views">
      {views.map((view, index) => (
        <li key={view.id}>
          {index > 0 ? <span className="wp-status-views__sep" aria-hidden="true"> | </span> : null}
          <Link
            href={adminListPath(listPath, { ...listQuery, status: view.id === "all" ? undefined : view.id, page: 1 })}
            className={current === view.id ? "current" : undefined}
          >
            {view.label}
            {typeof view.count === "number" ? <span className="wp-status-views__count"> ({view.count})</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
