"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type RevealVariant = "fade-up" | "zoom-in" | "fade-in" | "slide-left" | "slide-right";

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  /** Extra delay in ms (on top of stagger) */
  delay?: number;
  /** scroll = when in viewport; load = on page load (hero) */
  trigger?: "scroll" | "load";
  className?: string;
}

export function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  trigger = "scroll",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (trigger === "load") {
      const t = window.setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [trigger]);

  return (
    <div
      ref={ref}
      className={`reveal reveal--${variant}${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
