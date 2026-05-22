"use client";

import { useEffect } from "react";
import {
  CUSTOMIZE_READY_MESSAGE,
  CUSTOMIZE_SETTINGS_MESSAGE,
  type CustomizeSettingsMessage,
} from "@/lib/customize/preview-messages";
import { resolveLogoSrc } from "@/lib/site-brand";

function setText(selector: string, value: string) {
  document.querySelectorAll(selector).forEach((el) => {
    el.textContent = value;
  });
}

function setHtml(selector: string, value: string) {
  document.querySelectorAll(selector).forEach((el) => {
    el.innerHTML = value.replace(/\n/g, "<br />");
  });
}

function setAttr(selector: string, attr: string, value: string) {
  document.querySelectorAll(selector).forEach((el) => {
    if (value) el.setAttribute(attr, value);
    else el.removeAttribute(attr);
  });
}

function applySettings(settings: Record<string, string>) {
  const primary = settings.primaryColor || "#0057FF";
  const secondary = settings.secondaryColor || "#0088FF";
  const root = document.documentElement;
  root.style.setProperty("--primary-color", primary);
  root.style.setProperty("--secondary-color", secondary);
  root.style.setProperty("--cws-royal", primary);
  root.style.setProperty("--cws-blue", secondary);

  setText('[data-customize="phone"]', settings.phone ?? "");
  setText('[data-customize="email"]', settings.email ?? "");
  setHtml('[data-customize="address-topbar"]', (settings.address ?? "").replace(/\n+/g, ", "));
  setHtml('[data-customize="address-footer"]', settings.address ?? "");
  setHtml('[data-customize="footer-text"]', settings.footerText ?? "");

  setText('[data-customize="footer-company-title"]', settings.footerCompanyTitle || "Company");
  setText('[data-customize="footer-services-title"]', settings.footerServicesTitle || "Services");
  setText('[data-customize="footer-products-title"]', settings.footerProductsTitle || "Products");

  const headerLogo = settings.logoUrl
    ? resolveLogoSrc("header", settings.logoUrl)
    : "";
  const footerLogo = settings.logoWhiteUrl || settings.logoUrl
    ? resolveLogoSrc("footer", settings.logoWhiteUrl || settings.logoUrl)
    : "";
  document.querySelectorAll('[data-customize="logo-header"]').forEach((el) => {
    if (el instanceof HTMLImageElement && headerLogo) el.src = headerLogo;
  });
  document.querySelectorAll('[data-customize="logo-footer"]').forEach((el) => {
    if (el instanceof HTMLImageElement && footerLogo) el.src = footerLogo;
  });

  const social: [string, string][] = [
    ["facebook", settings.facebook ?? ""],
    ["linkedin", settings.linkedin ?? ""],
    ["instagram", settings.instagram ?? ""],
  ];
  for (const [key, url] of social) {
    document.querySelectorAll(`[data-customize="social-${key}"]`).forEach((el) => {
      if (!(el instanceof HTMLAnchorElement)) return;
      if (url) {
        el.href = url;
        el.style.display = "";
      } else {
        el.style.display = "none";
      }
    });
  }

  document.querySelectorAll("[data-customize-address-topbar-wrap]").forEach((el) => {
    (el as HTMLElement).style.display = settings.address?.trim() ? "" : "none";
  });

  document.querySelectorAll("[data-customize-phone-wrap]").forEach((wrap) => {
    if (!(wrap instanceof HTMLAnchorElement)) return;
    if (settings.phone) {
      wrap.href = `tel:${settings.phone.replace(/\s/g, "")}`;
      wrap.style.display = "";
    } else {
      wrap.style.display = "none";
    }
  });
  document.querySelectorAll("[data-customize-email-wrap]").forEach((wrap) => {
    if (!(wrap instanceof HTMLAnchorElement)) return;
    if (settings.email) {
      wrap.href = `mailto:${settings.email}`;
      wrap.style.display = "";
    } else {
      wrap.style.display = "none";
    }
  });
}

export function CustomizePreviewListener() {
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data as CustomizeSettingsMessage | undefined;
      if (data?.type !== CUSTOMIZE_SETTINGS_MESSAGE || !data.settings) return;
      applySettings(data.settings);
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: CUSTOMIZE_READY_MESSAGE }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return null;
}
