"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileBottomNav } from "@/components/engagement/MobileBottomNav";
import type { SiteSettings } from "@/lib/wordpress/types";

const SCROLL_REVEAL_PX = 320;

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

function whatsAppNumber(settings: SiteSettings): string {
  const env = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (env) return digitsOnly(env);
  const d = digitsOnly(settings.phone);
  if (d.length === 10) return `91${d}`;
  return d;
}

interface SiteFloatWidgetsProps {
  settings: SiteSettings;
}

export function SiteFloatWidgets({ settings }: SiteFloatWidgetsProps) {
  const [scrolled, setScrolled] = useState(false);

  const wa = whatsAppNumber(settings);
  const waHref = wa ? `https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to discuss a project with Creative Web Solutions.")}` : "";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_REVEAL_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const socials = [
    settings.facebook ? { href: settings.facebook, label: "Facebook", icon: "fab fa-facebook-f", key: "fb" } : null,
    settings.linkedin ? { href: settings.linkedin, label: "LinkedIn", icon: "fab fa-linkedin-in", key: "in" } : null,
    settings.instagram ? { href: settings.instagram, label: "Instagram", icon: "fab fa-instagram", key: "ig" } : null,
  ].filter(Boolean) as { href: string; label: string; icon: string; key: string }[];

  return (
    <>
      {waHref ? (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="cws-float-wa cws-float-desktop-only"
          aria-label="Chat on WhatsApp"
        >
          <i className="fab fa-whatsapp" aria-hidden="true" />
        </a>
      ) : null}

      <MobileBottomNav settings={settings} />

      <div className={`cws-float-dock${scrolled ? " is-visible" : ""}`} aria-hidden={!scrolled}>
        <Link
          href="/portfolio"
          className="cws-float-dock__btn cws-float-dock__btn--portfolio cws-float-desktop-only"
          title="View portfolio"
        >
          <i className="fas fa-briefcase" aria-hidden="true" />
          <span className="cws-float-dock__label">Portfolio</span>
        </Link>
        {socials.map((s) => (
          <a
            key={s.key}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`cws-float-dock__btn cws-float-dock__btn--${s.key}`}
            aria-label={s.label}
          >
            <i className={s.icon} aria-hidden="true" />
          </a>
        ))}
      </div>
    </>
  );
}
