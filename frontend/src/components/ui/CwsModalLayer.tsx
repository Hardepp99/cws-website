"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/modal-scroll-lock";

type CwsModalLayerProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Extra classes on `.cws-modal-root` (e.g. `cws-modal-root--refined is-visible`) */
  rootClassName?: string;
};

/**
 * Portals modals to `document.documentElement` (outside scroll-locked body) so the page
 * stays visible through the dimmed backdrop. Locks page scroll via overflow only.
 */
export function CwsModalLayer({ open, onClose, children, rootClassName = "" }: CwsModalLayerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const rootClass = ["cws-modal-root", rootClassName].filter(Boolean).join(" ");

  const portalTarget = document.documentElement;

  return createPortal(
    <div className={rootClass} role="presentation" data-cws-modal-layer="">
      <button type="button" className="cws-modal-backdrop" aria-label="Close dialog" onClick={onClose} />
      {children}
    </div>,
    portalTarget,
  );
}
