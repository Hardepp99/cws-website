"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminSession } from "@/components/admin/AdminSessionProvider";
import { adminFetch } from "@/lib/admin/client";

type ActivityRow = {
  id: number;
  userId: number;
  username: string;
  summary: string;
  task: string;
  taskLabel: string;
  verb: string;
  hint: string;
  ipAddress: string | null;
  createdAt: string;
};

type TaskFilter = { id: string; label: string };

type UserOption = {
  id: number;
  username: string;
  displayName: string;
};

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ActivityLog() {
  const { user, isAdmin } = useAdminSession();
  const [items, setItems] = useState<ActivityRow[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [taskFilters, setTaskFilters] = useState<TaskFilter[]>([]);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterUserId, setFilterUserId] = useState<string>("all");
  const [filterTask, setFilterTask] = useState("");
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const perPage = 25;

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!isAdmin) return;
    adminFetch<{ items: UserOption[] }>("/users/list")
      .then((d) =>
        setUsers(
          d.items.map((u) => ({
            id: u.id,
            username: u.username,
            displayName: u.displayName,
          })),
        ),
      )
      .catch(() => {});
  }, [isAdmin]);

  useEffect(() => {
    const params = new URLSearchParams({
      page: String(page),
      perPage: String(perPage),
    });
    if (isAdmin && filterUserId !== "all") {
      params.set("userId", filterUserId);
    }
    if (filterTask) params.set("task", filterTask);
    if (searchDebounced) params.set("q", searchDebounced);

    adminFetch<{ items: ActivityRow[]; total: number; taskFilters?: TaskFilter[] }>(
      `/activity/list?${params}`,
    )
      .then((d) => {
        setItems(d.items);
        setTotal(d.total);
        if (d.taskFilters?.length) setTaskFilters(d.taskFilters);
      })
      .catch((e) => setErr(String(e)));
  }, [page, filterUserId, filterTask, searchDebounced, isAdmin]);

  const pages = Math.max(1, Math.ceil(total / perPage));

  return (
    <>
      {err ? <div className="cms-notice err">{err}</div> : null}
      <div className="cms-card">
        <h2 style={{ marginTop: 0 }}>{isAdmin ? "Team activity log" : "My activity"}</h2>
        <p className="cms-field-hint">
          {isAdmin
            ? "Searchable log of CMS tasks (create, update, delete). Admins can view any user; editors only see their own history."
            : "Your sign-ins and CMS changes only — you cannot view other users’ activity."}
        </p>

        <div className="cms-activity-toolbar">
          <label className="cms-activity-search">
            <span className="visually-hidden">Search activity</span>
            <input
              type="search"
              placeholder="Search summary, user, task…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <label className="cms-field cms-activity-filter">
            <span className="cms-field-label">Task</span>
            <select
              value={filterTask}
              onChange={(e) => {
                setFilterTask(e.target.value);
                setPage(1);
              }}
            >
              {(taskFilters.length ? taskFilters : [{ id: "", label: "All tasks" }]).map((t) => (
                <option key={t.id || "all"} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          {isAdmin ? (
            <label className="cms-field cms-activity-filter">
              <span className="cms-field-label">User</span>
              <select
                value={filterUserId}
                onChange={(e) => {
                  setFilterUserId(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All users</option>
                {user ? (
                  <option value={String(user.userId)}>Me ({user.username})</option>
                ) : null}
                {users
                  .filter((u) => u.id !== user?.userId)
                  .map((u) => (
                    <option key={u.id} value={String(u.id)}>
                      {u.displayName || u.username} (@{u.username})
                    </option>
                  ))}
              </select>
            </label>
          ) : null}
        </div>

        <table className="cms-table cms-activity-table" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>When</th>
              {isAdmin ? <th>User</th> : null}
              <th>Task</th>
              <th>Action</th>
              <th>Details</th>
              {isAdmin ? <th>IP</th> : null}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 4} style={{ color: "#6e6e73" }}>
                  {searchDebounced || filterTask
                    ? "No matching activity."
                    : "No activity recorded yet."}
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={row.id}>
                  <td className="cms-activity-time">{formatWhen(row.createdAt)}</td>
                  {isAdmin ? <td>{row.username}</td> : null}
                  <td>
                    <span className="cms-activity-task">{row.taskLabel}</span>
                  </td>
                  <td>
                    <span className="cms-activity-verb">{row.verb}</span>
                    <div className="cms-activity-summary">{row.summary}</div>
                  </td>
                  <td className="cms-activity-hint">{row.hint}</td>
                  {isAdmin ? <td>{row.ipAddress ?? "—"}</td> : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {pages > 1 ? (
          <div className="cms-activity-pager">
            <button
              type="button"
              className="cms-btn"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span>
              Page {page} of {pages} ({total} events)
            </span>
            <button
              type="button"
              className="cms-btn"
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default function AdminActivityPage() {
  return (
    <AdminShell title="Activity">
      <ActivityLog />
    </AdminShell>
  );
}
