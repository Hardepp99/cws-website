"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/client";
import type { AdminSessionUser } from "@/lib/admin/types";

type AdminSessionContextValue = {
  user: AdminSessionUser | null;
  loading: boolean;
  isAdmin: boolean;
  refresh: () => Promise<void>;
};

const AdminSessionContext = createContext<AdminSessionContextValue>({
  user: null,
  loading: true,
  isAdmin: false,
  refresh: async () => {},
});

export function AdminSessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminSessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await adminFetch<AdminSessionUser & { success?: boolean }>("/me");
      setUser({
        userId: data.userId,
        username: data.username,
        displayName: data.displayName,
        role: data.role === "admin" ? "admin" : "user",
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AdminSessionContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === "admin",
        refresh,
      }}
    >
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession() {
  return useContext(AdminSessionContext);
}
