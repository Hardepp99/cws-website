import Link from "next/link";
import type { ReactNode } from "react";
import { AdminPageHeader, type DesimentorHeaderLink } from "@/components/admin/AdminPageHeader";
import type { ListQueryRecord } from "@/lib/admin/list-query";
import { WpPagination } from "./WpPagination";

export type WpListQuery = ListQueryRecord & { perPage?: number; page?: number };

export type WpColumn<T> = {
  key: string;
  label: string;
  className?: string;
  render: (row: T) => React.ReactNode;
};

export function WpListScreen({
  title,
  description,
  addNewHref,
  addNewLabel = "Add New",
  desimentor,
  headerActions,
  children,
}: {
  title: string;
  description?: string;
  addNewHref?: string;
  addNewLabel?: string;
  desimentor?: DesimentorHeaderLink;
  headerActions?: ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminPageHeader
        title={title}
        description={description}
        addNewHref={addNewHref}
        addNewLabel={addNewLabel}
        desimentor={desimentor}
        actions={headerActions}
      />
      {children}
    </>
  );
}

export function WpListTable<T extends { id: number | string }>({
  columns,
  rows,
  total,
  page,
  perPage,
  basePath,
  listPath,
  listQuery,
  toolbar,
  emptyMessage = "No items found.",
  rowActions,
  showActions = true,
}: {
  columns: WpColumn<T>[];
  rows: T[];
  total: number;
  page: number;
  perPage: number;
  /** Full URL with query string for pagination */
  basePath?: string;
  listPath?: string;
  listQuery?: WpListQuery;
  toolbar?: React.ReactNode;
  emptyMessage?: string;
  rowActions?: (row: T) => React.ReactNode;
  /** Show actions as first column (default true when rowActions provided) */
  showActions?: boolean;
}) {
  const paginationPath = basePath ?? (listPath ? listPath : "/");
  const paginationProps = listPath
    ? { listPath, listQuery: { ...listQuery, perPage } }
    : { basePath: paginationPath };
  const hasActions = showActions && !!rowActions;
  const colSpan = columns.length + (hasActions ? 1 : 0);

  return (
    <div className="wp-list-table-wrap">
      {toolbar}
      <WpPagination {...paginationProps} page={page} perPage={perPage} total={total} />
      <div className="wp-list-table-scroll" role="region" aria-label="Content list" tabIndex={0}>
        <table className="wp-list-table widefat striped">
          <thead>
            <tr>
              {hasActions ? (
                <th className="column-actions column-actions-first">Actions</th>
              ) : null}
              {columns.map((col) => (
                <th key={col.key} className={col.className || `column-${col.key}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr className="no-items">
                <td colSpan={colSpan}>{emptyMessage}</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  {hasActions ? (
                    <td className="column-actions column-actions-first">{rowActions(row)}</td>
                  ) : null}
                  {columns.map((col) => (
                    <td key={col.key} className={`column-${col.key}`}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              {hasActions ? <th className="column-actions-first">Actions</th> : null}
              {columns.map((col) => (
                <th key={col.key} className={col.className || `column-${col.key}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
      <WpPagination {...paginationProps} page={page} perPage={perPage} total={total} />
    </div>
  );
}

export function WpRowActions({
  editHref,
  desimentorHref,
  deleteAction,
  viewHref,
}: {
  editHref?: string;
  desimentorHref?: string;
  deleteAction?: React.ReactNode;
  viewHref?: string;
}) {
  return (
    <div className="row-actions row-actions-buttons">
      {editHref ? (
        <Link href={editHref} className="row-action-btn row-action-btn--edit">
          Edit
        </Link>
      ) : null}
      {desimentorHref ? (
        <Link href={desimentorHref} className="row-action-btn row-action-btn--desimentor">
          Desimentor
        </Link>
      ) : null}
      {viewHref ? (
        <Link href={viewHref} className="row-action-btn row-action-btn--view">
          View
        </Link>
      ) : null}
      {deleteAction}
    </div>
  );
}
