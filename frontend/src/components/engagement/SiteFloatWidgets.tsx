"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/wordpress/types";

const CALLBACK_DELAY_MS = 3 * 60 * 1000;
const SCROLL_REVEAL_PX = 320;
const SESSION_CALLBACK_KEY = "cws_callback_popup_shown";

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
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_CALLBACK_KEY) === "1") return;
    const t = window.setTimeout(() => {
      setCallbackOpen(true);
      sessionStorage.setItem(SESSION_CALLBACK_KEY, "1");
    }, CALLBACK_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  const closeCallback = useCallback(() => {
    setCallbackOpen(false);
    setStatus("idle");
    setErrorMessage("");
  }, []);

  const submitCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "callback_popup",
          name: name.trim(),
          phone: phone.trim(),
          message: "Callback request — special offers / follow-up",
          page_url: window.location.href,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.message || "Could not submit.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Network error.");
    }
  };

  const socials = [
    settings.facebook ? { href: settings.facebook, label: "Facebook", icon: "fab fa-facebook-f", key: "fb" } : null,
    settings.linkedin ? { href: settings.linkedin, label: "LinkedIn", icon: "fab fa-linkedin-in", key: "in" } : null,
    settings.instagram ? { href: settings.instagram, label: "Instagram", icon: "fab fa-instagram", key: "ig" } : null,
  ].filter(Boolean) as { href: string; label: string; icon: string; key: string }[];

  return (
    <>
      {/* WhatsApp — always visible */}
      {waHref ? (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="cws-float-wa"
          aria-label="Chat on WhatsApp"
        >
          <i className="fab fa-whatsapp" aria-hidden="true" />
        </a>
      ) : null}

      {/* Scroll-reveal dock: portfolio + social */}
      <div className={`cws-float-dock${scrolled ? " is-visible" : ""}`} aria-hidden={!scrolled}>
        <Link href="/portfolio" className="cws-float-dock__btn cws-float-dock__btn--portfolio" title="View portfolio">
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

      {/* 3-minute callback + offers */}
      {callbackOpen ? (
        <div className="cws-modal-root" role="presentation">
          <button type="button" className="cws-modal-backdrop" aria-label="Close" onClick={closeCallback} />
          <div className="cws-modal-dialog cws-modal-dialog--narrow" role="dialog" aria-modal="true">
            <div className="cws-modal-header">
              <h2 className="cws-modal-title h6 mb-0">Get a call back + new offers</h2>
              <button type="button" className="cws-modal-close" onClick={closeCallback} aria-label="Close">
                <i className="fas fa-times" aria-hidden="true" />
              </button>
            </div>
            {status === "success" ? (
              <div className="cws-modal-body">
                <p className="text-success fw-semibold small mb-0">
                  You&apos;re on our list — we&apos;ll call you soon with current offers.
                </p>
                <button type="button" className="btn btn-primary-custom btn-sm mt-3" onClick={closeCallback}>
                  Great
                </button>
              </div>
            ) : (
              <form className="cws-modal-body" onSubmit={submitCallback}>
                <p className="small text-muted mb-3">
                  Share your mobile number. We share periodic offers on web, apps, and marketing packages — no spam.
                </p>
                <div className="mb-2">
                  <label className="form-label small" htmlFor="cb-phone">
                    Mobile number <span className="text-danger">*</span>
                  </label>
                  <input
                    id="cb-phone"
                    type="tel"
                    className="form-control form-control-sm"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 ..."
                    autoComplete="tel"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small" htmlFor="cb-name">
                    Name (optional)
                  </label>
                  <input
                    id="cb-name"
                    className="form-control form-control-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
                {status === "error" ? (
                  <p className="text-danger small mb-2">{errorMessage}</p>
                ) : null}
                <div className="d-flex gap-2 justify-content-end">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={closeCallback}>
                    No thanks
                  </button>
                  <button type="submit" className="btn btn-primary-custom btn-sm" disabled={status === "loading"}>
                    {status === "loading" ? "Sending…" : "Request callback"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
