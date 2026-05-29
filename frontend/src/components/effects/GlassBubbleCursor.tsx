"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const MAX_BUBBLES = 28;
const SPAWN_INTERVAL_MS = 42;
const TRAIL_STEP_PX = 14;

/** Soft watery tints — visible but airy */
const BUBBLE_TINTS = [
  "rgba(120, 200, 255, 0.72)",
  "rgba(10, 132, 255, 0.65)",
  "rgba(100, 220, 180, 0.62)",
  "rgba(52, 199, 89, 0.58)",
  "rgba(180, 160, 255, 0.6)",
  "rgba(255, 180, 220, 0.58)",
  "rgba(255, 210, 120, 0.55)",
  "rgba(200, 220, 240, 0.5)",
];

type BubbleKind = "lead" | "trail";

interface SpawnOptions {
  kind?: BubbleKind;
}

export function GlassBubbleCursor() {
  const pathname = usePathname();
  const layerRef = useRef<HTMLDivElement>(null);
  const lastSpawn = useRef(0);
  const activeCount = useRef(0);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduced || !finePointer) return;

    const layer = layerRef.current;
    if (!layer) return;

    const spawn = (x: number, y: number, options: SpawnOptions = {}) => {
      if (activeCount.current >= MAX_BUBBLES) return;

      const kind = options.kind ?? "lead";
      const isTrail = kind === "trail";

      const size = isTrail ? 5 + Math.random() * 10 : 10 + Math.random() * 18;
      const jitter = isTrail ? 6 : 10;
      const jitterX = (Math.random() - 0.5) * jitter;
      const jitterY = (Math.random() - 0.5) * jitter;
      const duration = isTrail ? 0.75 + Math.random() * 0.55 : 1.05 + Math.random() * 0.75;
      const drift = isTrail ? -2 - Math.random() * 8 : -6 - Math.random() * 14;
      const tint = BUBBLE_TINTS[Math.floor(Math.random() * BUBBLE_TINTS.length)];

      const bubble = document.createElement("span");
      bubble.className = `cws-glass-bubble${isTrail ? " cws-glass-bubble--trail" : " cws-glass-bubble--lead"}`;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${x + jitterX - size / 2}px`;
      bubble.style.top = `${y + jitterY - size / 2}px`;
      bubble.style.setProperty("--bubble-duration", `${duration}s`);
      bubble.style.setProperty("--bubble-drift", `${drift}px`);
      bubble.style.setProperty("--bubble-tint", tint);
      bubble.style.setProperty("--bubble-scale-end", isTrail ? "1.15" : "1.22");

      layer.appendChild(bubble);
      activeCount.current += 1;

      bubble.addEventListener(
        "animationend",
        () => {
          bubble.remove();
          activeCount.current = Math.max(0, activeCount.current - 1);
        },
        { once: true }
      );
    };

    const spawnTrailBetween = (fromX: number, fromY: number, toX: number, toY: number) => {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const dist = Math.hypot(dx, dy);
      if (dist < TRAIL_STEP_PX) return;

      const steps = Math.min(4, Math.floor(dist / TRAIL_STEP_PX));
      for (let i = 1; i <= steps; i += 1) {
        const t = i / (steps + 1);
        spawn(fromX + dx * t, fromY + dy * t, { kind: "trail" });
      }
    };

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();

      if (lastPos.current) {
        spawnTrailBetween(lastPos.current.x, lastPos.current.y, x, y);
      }

      if (now - lastSpawn.current >= SPAWN_INTERVAL_MS) {
        lastSpawn.current = now;
        spawn(x, y, { kind: "lead" });
      }

      lastPos.current = { x, y };
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return <div ref={layerRef} className="cws-glass-bubble-layer" aria-hidden="true" />;
}
