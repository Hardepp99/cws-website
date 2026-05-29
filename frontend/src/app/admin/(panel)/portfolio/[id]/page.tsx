import { PortfolioItemForm } from "@/components/admin/portfolio/PortfolioItemForm";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminPortfolioEditPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  return (
    <AdminShell title="Edit portfolio">
      <PortfolioItemForm itemId={id} />
    </AdminShell>
  );
}
