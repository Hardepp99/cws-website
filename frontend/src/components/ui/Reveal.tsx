"use client";

import { onSiteIntroReady } from "@/lib/site-intro";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type RevealVariant = "fade-up" | "zoom-in" | "fade-in" | "slide-left" | "slide-right";

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  /** @deprecated Delays are disabled — animations run immediately with no stagger */
  delay?: number;
  /** scroll = when in viewport; load = on page load (hero) */
  trigger?: "scroll" | "load";
  /** Re-run animation when leaving and re-entering viewport (scroll trigger only) */
  repeat?: boolean;
  className?: string;
}

export function Reveal({
  children,
  variant = "fade-up",
  trigger = "scroll",
  repeat: repeatProp,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const repeat = trigger === "scroll" ? (repeatProp ?? true) : false;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let observer: IntersectionObserver | undefined;

    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    const start = () => {
      if (trigger === "load") {
        show();
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            show();
          } else if (repeat) {
            hide();
          }
        },
        { threshold: 0.08, rootMargin: "0px 0px 6% 0px" },
      );
      observer.observe(el);
    };

    const cancelIntro = onSiteIntroReady(start);

    return () => {
      cancelIntro();
      observer?.disconnect();
    };
  }, [trigger, repeat]);

  return (
    <div
      ref={ref}
      className={`reveal reveal--${variant}${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
