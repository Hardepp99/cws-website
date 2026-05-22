import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDashboard } from "@/components/admin/dashboard/AdminDashboard";

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Dashboard">
      <AdminDashboard />
    </AdminShell>
  );
}
