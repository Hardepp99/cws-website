"use client";

import type { MemberUser } from "@/lib/member/types";

export async function memberFetch<T>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const res = await fetch(`/api/member/cms${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.json ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers as Record<string, string>),
    },
    body: init?.json ? JSON.stringify(init.json) : init?.body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message || (data as { error?: string }).error || "Request failed",
    );
  }
  return data as T;
}

export async function memberRegister(payload: {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}) {
  const res = await fetch("/api/member/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data as { success: boolean; member?: MemberUser; displayName?: string };
}

export async function memberLogin(email: string, password: string) {
  const res = await fetch("/api/member/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Sign in failed");
  return data as { success: boolean; member?: MemberUser; displayName?: string };
}

export async function memberGoogleLogin(credential: string) {
  const res = await fetch("/api/member/google", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Google sign-in failed");
  return data;
}

export async function memberLogout() {
  await fetch("/api/member/logout", { method: "POST", credentials: "include" });
}
