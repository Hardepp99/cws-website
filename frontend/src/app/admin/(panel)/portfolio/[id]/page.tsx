import { PortfolioItemForm } from "@/components/admin/portfolio/PortfolioItemForm";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminPortfolioEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  return (
    <AdminShell title="Edit portfolio">
      <PortfolioItemForm itemId={id} />
    </AdminShell>
  );
}
