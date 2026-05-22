"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function PageViewTracker() {
  const pathname = usePathname();
  const last = useRef("");

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (last.current === pathname) return;
    last.current = pathname;
    const slug = pathname === "/" ? "home" : pathname.replace(/^\//, "").split("/")[0];
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, slug }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
