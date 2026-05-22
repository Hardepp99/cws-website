"use client";

import { AdminDialogProvider } from "./AdminDialogProvider";

export function AdminDialogLayout({ children }: { children: React.ReactNode }) {
  return <AdminDialogProvider>{children}</AdminDialogProvider>;
}
