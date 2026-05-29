"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { memberFetch } from "@/lib/member/client";
import type { MemberUser } from "@/lib/member/types";

type MemberSessionContextValue = {
  member: MemberUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const MemberSessionContext = createContext<MemberSessionContextValue>({
  member: null,
  loading: true,
  refresh: async () => {},
});

export function MemberSessionProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<MemberUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await memberFetch<{ success: boolean; member: MemberUser }>("/member/me");
      setMember(data.member);
    } catch {
      setMember(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <MemberSessionContext.Provider value={{ member, loading, refresh }}>
      {children}
    </MemberSessionContext.Provider>
  );
}

export function useMemberSession() {
  return useContext(MemberSessionContext);
}
