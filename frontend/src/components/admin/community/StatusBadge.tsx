export function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, " ");
  const mod = status.includes("pending")
    ? "pending"
    : status === "published" || status === "approved" || status === "active"
      ? "ok"
      : status === "rejected" || status === "spam" || status === "suspended"
        ? "bad"
        : "neutral";

  return <span className={`cms-status-badge cms-status-badge--${mod}`}>{label}</span>;
}
