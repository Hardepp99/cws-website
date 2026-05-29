"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export type CrmSummernoteHandle = {
  getHtml: () => string;
  setHtml: (html: string) => void;
  isEmpty: () => boolean;
};

type JQuerySummernoteElement = {
  summernote: (command: string, value?: string) => string | void;
};

type JQueryStatic = (el: HTMLElement) => JQuerySummernoteElement;

declare global {
  interface Window {
    jQuery?: JQueryStatic;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(el);
  });
}

function loadStylesheet(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`link[href="${href}"]`)) {
      resolve();
      return;
    }
    const el = document.createElement("link");
    el.rel = "stylesheet";
    el.href = href;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${href}`));
    document.head.appendChild(el);
  });
}

type Props = {
  minHeight?: number;
  placeholder?: string;
};

export const CrmSummernoteEditor = forwardRef<CrmSummernoteHandle, Props>(
  function CrmSummernoteEditor({ minHeight = 380, placeholder = "Write your message…" }, ref) {
    const holderRef = useRef<HTMLDivElement>(null);
    const readyRef = useRef(false);

    useImperativeHandle(ref, () => ({
      getHtml: () => {
        const $ = window.jQuery;
        if (!$ || !holderRef.current || !readyRef.current) return "";
        return String($(holderRef.current).summernote("code") ?? "");
      },
      setHtml: (html: string) => {
        const $ = window.jQuery;
        if (!$ || !holderRef.current || !readyRef.current) return;
        $(holderRef.current).summernote("code", html);
      },
      isEmpty: () => {
        const html = String(
          window.jQuery && holderRef.current && readyRef.current
            ? window.jQuery(holderRef.current).summernote("code") ?? ""
            : "",
        ).trim();
        return html === "" || html === "<p><br></p>" || html === "<p></p>" || html === "<br>";
      },
    }));

    useEffect(() => {
      let cancelled = false;
      const el = holderRef.current;
      if (!el) return;

      (async () => {
        try {
          await loadScript("https://code.jquery.com/jquery-3.7.1.min.js");
          await loadStylesheet(
            "https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-lite.min.css",
          );
          await loadScript(
            "https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-lite.min.js",
          );
          if (cancelled || !holderRef.current || !window.jQuery) return;

          window.jQuery(holderRef.current).summernote({
            height: minHeight,
            placeholder,
            tabsize: 2,
            toolbar: [
              ["style", ["style"]],
              ["font", ["bold", "italic", "underline", "strikethrough", "clear"]],
              ["fontname", ["fontname"]],
              ["color", ["color"]],
              ["para", ["ul", "ol", "paragraph"]],
              ["insert", ["link", "picture", "table", "hr"]],
              ["view", ["fullscreen", "codeview", "help"]],
            ],
          });
          readyRef.current = true;
        } catch {
          /* editor assets failed — parent may show error */
        }
      })();

      return () => {
        cancelled = true;
        readyRef.current = false;
        if (window.jQuery && holderRef.current) {
          try {
            window.jQuery(holderRef.current).summernote("destroy");
          } catch {
            /* ignore */
          }
        }
      };
    }, [minHeight, placeholder]);

    return <div ref={holderRef} className="crm-summernote-host" />;
  },
);
