"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { PricingOptionsForm } from "@/components/admin/pricing/PricingOptionsForm";

export default function AdminPricingPage() {
  return (
    <AdminShell title="Ask price options">
      <PricingOptionsForm />
    </AdminShell>
  );
}
