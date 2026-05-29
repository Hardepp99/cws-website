import { PortfolioItemForm } from "@/components/admin/portfolio/PortfolioItemForm";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminPortfolioNewPage() {
  return (
    <AdminShell title="New portfolio item">
      <PortfolioItemForm isNew />
    </AdminShell>
  );
}
