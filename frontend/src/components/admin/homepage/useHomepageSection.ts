"use client";

import { useCallback, useEffect, useState } from "react";
import type { SectionRecord } from "./SectionEditor";
import { adminFetch } from "@/lib/admin/client";

type SectionRowResponse = {
  section: SectionRecord;
  status?: string;
  adminTitle?: string;
};

export function useHomepageSection(sectionId: number) {
  const [section, setSection] = useState<SectionRecord | null>(null);
  const [adminTitle, setAdminTitle] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const reload = useCallback(() => {
    setLoading(true);
    setErr("");
    return adminFetch<SectionRowResponse>(`/homepage/sections/${sectionId}`)
      .then((data) => {
        setSection(data.section);
        setStatus(String(data.status ?? "draft"));
        setAdminTitle(String(data.adminTitle ?? ""));
      })
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [sectionId]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function saveSection(nextSection: SectionRecord, opts?: { status?: string; adminTitle?: string }) {
    const payload = {
      section: nextSection,
      status: opts?.status ?? status,
      adminTitle: opts?.adminTitle ?? adminTitle,
    };
    await adminFetch(`/homepage/sections/${sectionId}`, { method: "PUT", json: payload });
    setSection(nextSection);
    if (opts?.status) setStatus(opts.status);
    if (opts?.adminTitle !== undefined) setAdminTitle(opts.adminTitle);
  }

  return {
    section,
    setSection,
    adminTitle,
    setAdminTitle,
    status,
    setStatus,
    loading,
    err,
    reload,
    saveSection,
  };
}
