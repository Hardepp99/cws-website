"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getTopbarColorByIndex, resolveTopbarColorForNavigation } from "@/lib/topbar-colors";

/** One solid pastel per page load / route change (skipped for premium dark topbar). */
export function TopbarBackground({ premium = false }: { premium?: boolean }) {
  const pathname = usePathname();
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const topbar = document.getElementById("topbar");
    if (!topbar || premium) {
      topbar?.style.removeProperty("--topbar-bg");
      return;
    }
    const next = resolveTopbarColorForNavigation(pathname);
    setColorIndex(next);
    const { bg } = getTopbarColorByIndex(next);
    topbar.style.setProperty("--topbar-bg", bg);
  }, [pathname, premium]);

  if (premium) {
    return <div className="topbar-pastel-bg" aria-hidden="true" />;
  }

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
