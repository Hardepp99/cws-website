"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getTopbarColorByIndex, resolveTopbarColorForNavigation } from "@/lib/topbar-colors";

/** One solid pastel per page load / route change */
export function TopbarBackground() {
  const pathname = usePathname();
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const next = resolveTopbarColorForNavigation(pathname);
    setColorIndex(next);
    const { bg } = getTopbarColorByIndex(next);
    const topbar = document.getElementById("topbar");
    if (topbar) topbar.style.setProperty("--topbar-bg", bg);
  }, [pathname]);

  const { bg, id } = getTopbarColorByIndex(colorIndex);

  return (
    <div
      className="topbar-pastel-bg"
      data-topbar-tone={id}
      style={{ background: bg }}
      aria-hidden="true"
    />
  );
}
