import { AdminThemeStyles } from "@/components/admin/AdminThemeStyles";
import "../admin.css";

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminThemeStyles />
      {children}
    </>
  );
}
