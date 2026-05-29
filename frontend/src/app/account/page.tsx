import { SiteLayout } from "@/components/layout/SiteLayout";
import { AccountDashboard } from "@/components/member/AccountDashboard";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AccountPage() {
  return (
    <SiteLayout currentPath="/account">
      <PageHeader breadcrumb={[{ label: "Home", href: "/" }, { label: "My account" }]} />
      <section className="content-page-section member-area">
        <div className="corp-container">
          <AccountDashboard />
        </div>
      </section>
    </SiteLayout>
  );
}
