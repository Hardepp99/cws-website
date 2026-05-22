import { AdminDialogLayout } from "@/components/admin/dialog/AdminDialogLayout";
import { AdminThemeStyles } from "@/components/admin/AdminThemeStyles";
import "../admin.css";

export const metadata = {
  title: "CWS CMS Admin",
  robots: "noindex",
};

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminThemeStyles />
      <AdminDialogLayout>{children}</AdminDialogLayout>
    </>
  );
}
