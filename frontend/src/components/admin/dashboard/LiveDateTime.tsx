"use client";

import { useEffect, useState } from "react";

function formatNow(d: Date): string {
  return d.toLocaleString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function LiveDateTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <time className="cms-live-datetime" dateTime={now?.toISOString()} suppressHydrationWarning>
      {now ? formatNow(now) : "—"}
    </time>
  );
}
