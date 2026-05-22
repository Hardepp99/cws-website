"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { DesimentorRenderer } from "@/components/desimentor/DesimentorRenderer";
import { emptyDocument } from "@/lib/desimentor/document-utils";
import type { DesimentorDocument } from "@/lib/desimentor/types";
import { useDesimentorStore } from "@/lib/desimentor/store";

function PreviewInner() {
  const token = useSearchParams().get("token") ?? "";
  const document = useDesimentorStore((s) => s.document);
  const [doc, setDoc] = useState<DesimentorDocument | null>(null);

  useEffect(() => {
    if (document.sections.length) {
      setDoc(document);
      return;
    }
    if (!token) return;
    fetch(`/api/admin/cms/desimentor/preview?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d) => setDoc(d.content ?? emptyDocument()))
      .catch(() => setDoc(emptyDocument()));
  }, [token, document]);

  const content = doc ?? (document.sections.length ? document : null);
  if (!content) return <p style={{ padding: 24 }}>Loading preview…</p>;

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <DesimentorRenderer document={content} />
    </div>
  );
}

export default function DesimentorPreviewPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <PreviewInner />
    </Suspense>
  );
}
