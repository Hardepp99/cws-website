"use client";

import { onSiteIntroReady } from "@/lib/site-intro";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type RevealVariant = "fade-up" | "zoom-in" | "fade-in" | "slide-left" | "slide-right";

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  /** Extra delay in ms (on top of stagger) */
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
  delay = 0,
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

    let timeoutId: number | undefined;
    let observer: IntersectionObserver | undefined;

    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    const scheduleShow = () => {
      if (delay > 0) {
        timeoutId = window.setTimeout(show, delay);
      } else {
        show();
      }
    };

    const clearScheduled = () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
    };

    const start = () => {
      if (trigger === "load") {
        timeoutId = window.setTimeout(show, delay + 48);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            scheduleShow();
          } else if (repeat) {
            clearScheduled();
            hide();
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px 4% 0px" },
      );
      observer.observe(el);
    };

    const cancelIntro = onSiteIntroReady(start);

    return () => {
      cancelIntro();
      clearScheduled();
      observer?.disconnect();
    };
  }, [trigger, delay, repeat]);

  return (
    <div
      ref={ref}
      className={`reveal reveal--${variant}${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
