"use client";

import { useEffect, useId, useRef } from "react";
import { CmsFieldCounter } from "@/components/admin/CmsFieldCounter";

type Editor = { getContent: () => string; on: (e: string, cb: () => void) => void };

declare global {
  interface Window {
    tinymce?: {
      init: (o: Record<string, unknown>) => void;
      get: (id: string) => Editor | null;
      remove: (ed: Editor) => void;
    };
  }
}

let tinymceLoading: Promise<void> | null = null;

function loadTinymce(): Promise<void> {
  if (window.tinymce) return Promise.resolve();
  if (!tinymceLoading) {
    tinymceLoading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("TinyMCE failed to load"));
      document.body.appendChild(s);
    });
  }
  return tinymceLoading;
}

interface WysiwygFieldProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
  height?: number;
}

export function WysiwygField({ label, value, onChange, height = 300 }: WysiwygFieldProps) {
  const id = useId().replace(/:/g, "");
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let cancelled = false;
    loadTinymce().then(() => {
      if (cancelled || !window.tinymce) return;
      const existing = window.tinymce.get(id);
      if (existing) window.tinymce.remove(existing);

      window.tinymce.init({
        selector: `#${id}`,
        height,
        menubar: false,
        branding: false,
        plugins: "lists link table code",
        toolbar:
          "undo redo | blocks | bold italic underline | bullist numlist | alignleft aligncenter alignright | link table | code",
        content_style: "body{font-family:system-ui,sans-serif;font-size:14px;padding:12px;}",
        setup(editor: Editor) {
          editor.on("change keyup blur", () => {
            onChangeRef.current(editor.getContent());
          });
        },
      });
    });
    return () => {
      cancelled = true;
      const ed = window.tinymce?.get(id);
      if (ed) window.tinymce?.remove(ed);
    };
  }, [id, height]);

  return (
    <div className="cms-wysiwyg-wrap">
      <label className="cms-label cms-label--row">
        <span>{label}</span>
        <CmsFieldCounter value={value} mode="both" stripHtml />
      </label>
      <textarea id={id} className="cms-wysiwyg-target" defaultValue={value} />
    </div>
  );
}
