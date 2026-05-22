import { AdminDialogLayout } from "@/components/admin/dialog/AdminDialogLayout";
import { AdminThemeStyles } from "@/components/admin/AdminThemeStyles";
import "../admin.css";

export const metadata = {
  title: "Desimentor — CWS CMS",
  robots: "noindex",
};

export default function DesimentorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminThemeStyles />
      <AdminDialogLayout>{children}</AdminDialogLayout>
    </>
  );
}
