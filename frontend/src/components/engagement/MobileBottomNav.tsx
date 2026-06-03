"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { openAskPriceModal } from "@/lib/ask-price";
import { resolveGmbMapsUrl } from "@/lib/gmb/resolve";
import type { SiteSettings } from "@/lib/wordpress/types";

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

function whatsAppNumber(settings: SiteSettings): string {
  const env = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (env) return digitsOnly(env);
  const d = digitsOnly(settings.phone ?? "");
  if (d.length === 10) return `91${d}`;
  return d;
}

type TabItem = {
  id: string;
  label: string;
  icon: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  accent?: "wa" | "cta";
};

export function MobileBottomNav({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const mapsUrl = resolveGmbMapsUrl(settings);
  const wa = whatsAppNumber(settings);
  const waHref = wa
    ? `https://wa.me/${wa}?text=${encodeURIComponent("Hi, I'd like to discuss a project with Creative Web Solutions.")}`
    : "";

  const tabs: TabItem[] = [
    { id: "home", label: "Home", icon: "fas fa-home", href: "/" },
    { id: "portfolio", label: "Portfolio", icon: "fas fa-briefcase", href: "/portfolio" },
    {
      id: "ask",
      label: "Consult",
      icon: "fas fa-calendar-check",
      onClick: openAskPriceModal,
      accent: "cta",
    },
    {
      id: "location",
      label: "Location",
      icon: "fas fa-map-marker-alt",
      href: mapsUrl,
      external: true,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: "fab fa-whatsapp",
      href: waHref || undefined,
      external: true,
      accent: "wa",
    },
  ];

  const isActive = (tab: TabItem) => {
    if (!tab.href || tab.external) return false;
    if (tab.href === "/") return pathname === "/";
    return pathname === tab.href || pathname.startsWith(`${tab.href}/`);
  };

  return (
    <nav className="cws-mobile-tab-bar" aria-label="Quick navigation">
      <div className="cws-mobile-tab-bar__inner">
        {tabs.map((tab) => {
          const active = isActive(tab);
          const className = [
            "cws-mobile-tab-bar__item",
            active ? "is-active" : "",
            tab.accent === "wa" ? "cws-mobile-tab-bar__item--wa" : "",
            tab.accent === "cta" ? "cws-mobile-tab-bar__item--cta" : "",
            !tab.href && !tab.onClick ? "is-disabled" : "",
          ]
            .filter(Boolean)
            .join(" ");

          const content = (
            <>
              <span className="cws-mobile-tab-bar__icon" aria-hidden="true">
                <i className={tab.icon} />
              </span>
              <span className="cws-mobile-tab-bar__label">{tab.label}</span>
            </>
          );

          if (tab.onClick) {
            return (
              <button key={tab.id} type="button" className={className} onClick={tab.onClick}>
                {content}
              </button>
            );
          }

          if (!tab.href) {
            return (
              <span key={tab.id} className={className} aria-disabled="true">
                {content}
              </span>
            );
          }

          if (tab.external) {
            return (
              <a
                key={tab.id}
                href={tab.href}
                className={className}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={tab.id} href={tab.href} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
