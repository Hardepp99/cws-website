"use client";

export async function adminFetch<T>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const res = await fetch(`/api/admin/cms${path}`, {
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
    throw new Error((data as { message?: string }).message || (data as { error?: string }).error || "Request failed");
  }
  return data as T;
}

export async function adminLogin(username: string, password: string) {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function adminLogout() {
  await fetch("/api/admin/logout", { method: "POST" });
}

export async function adminUploadFile<T>(
  path: string,
  file: File,
  fieldName = "file",
  meta?: { title?: string; altText?: string }
): Promise<T> {
  const fd = new FormData();
  fd.append(fieldName, file);
  if (meta?.title) fd.append("title", meta.title);
  if (meta?.altText) fd.append("alt_text", meta.altText);
  const res = await fetch(`/api/admin/cms${path}`, {
    method: "POST",
    credentials: "include",
    body: fd,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "Upload failed");
  }
  return data as T;
}
