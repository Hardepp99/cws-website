"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteLogo } from "@/components/ui/SiteLogo";
import { useCallback, useEffect, useRef, useState } from "react";
import { MemberAuthNav, MemberAuthNavMobileFooter } from "@/components/member/MemberAuthNav";
import { openAskPriceModal } from "@/lib/ask-price";
import type { MenuItem, SiteSettings } from "@/lib/wordpress/types";

function scrollContentToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

interface HeaderProps {
  settings: SiteSettings;
  menu: MenuItem[];
  currentPath?: string;
}

export function Header({ settings, menu, currentPath = "" }: HeaderProps) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMobileMenu = useCallback(() => {
    const collapse = document.getElementById("navbarNav");
    const toggler = document.querySelector<HTMLButtonElement>(".navbar-toggler");
    if (collapse?.classList.contains("show") && toggler) {
      toggler.click();
    }
    setOpenDropdown(null);
  }, []);

  const onMainNavClick = useCallback(
    (href: string) => {
      closeMobileMenu();
      if (href && href !== "#" && !href.startsWith("#")) {
        scrollContentToTop();
      }
    },
    [closeMobileMenu],
  );

  const isActive = (href: string) => {
    if (href === "/") return currentPath === "/";
    return currentPath.startsWith(href.replace(/#.*/, ""));
  };

  const openMenu = (label: string) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpenDropdown(label);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 220);
  };

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  useEffect(() => {
    const collapse = document.getElementById("navbarNav");
    const overlay = document.getElementById("mobileMenuOverlay");
    const headerEl = document.getElementById("header");
    if (!collapse || !overlay || !headerEl) return;

    const barHeight = (el: HTMLElement | null) => {
      if (!el) return 0;
      const h = el.getBoundingClientRect().height;
      return h > 0 ? h : 0;
    };

    const setMobileNavAnchor = () => {
      if (!window.matchMedia("(max-width: 991.98px)").matches) {
        document.documentElement.style.removeProperty("--mobile-nav-sheet-top");
        document.documentElement.style.removeProperty("--mobile-overlay-top");
        document.body.classList.remove("has-promo-offer");
        return;
      }
      const promo = document.getElementById("promoOfferBar");
      const topbar = document.getElementById("topbar");
      const navbar = headerEl.querySelector<HTMLElement>(".navbar");
      const promoH = barHeight(promo);
      const topbarH = barHeight(topbar);
      const navbarH = barHeight(navbar);
      const chromeTop = promoH + topbarH;
      document.body.classList.toggle("has-promo-offer", promoH > 0);
      document.documentElement.style.setProperty("--mobile-overlay-top", `${Math.max(0, Math.round(chromeTop))}px`);
      document.documentElement.style.setProperty(
        "--mobile-nav-sheet-top",
        `${Math.max(0, Math.round(chromeTop + navbarH))}px`,
      );
    };

    const sync = () => {
      const open = collapse.classList.contains("show");
      overlay.classList.toggle("active", open);
      headerEl.classList.toggle("mobile-nav-active", open);
      document.body.classList.toggle("mobile-nav-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      setMobileNavAnchor();
    };

    const observer = new MutationObserver(sync);
    observer.observe(collapse, { attributes: true, attributeFilter: ["class"] });
    sync();

    setMobileNavAnchor();
    window.addEventListener("resize", setMobileNavAnchor);
    window.addEventListener("cws:promo-offer-dismissed", setMobileNavAnchor);
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => setMobileNavAnchor())
        : null;
    const promo = document.getElementById("promoOfferBar");
    const topbar = document.getElementById("topbar");
    const navbar = headerEl.querySelector(".navbar");
    if (ro) {
      if (promo) ro.observe(promo);
      if (topbar) ro.observe(topbar);
      if (navbar) ro.observe(navbar);
    }

    const closeFromOverlay = () => {
      const toggler = document.querySelector<HTMLButtonElement>(".navbar-toggler");
      if (collapse.classList.contains("show") && toggler) toggler.click();
    };
    overlay.addEventListener("click", closeFromOverlay);

    return () => {
      observer.disconnect();
      overlay.removeEventListener("click", closeFromOverlay);
      window.removeEventListener("resize", setMobileNavAnchor);
      window.removeEventListener("cws:promo-offer-dismissed", setMobileNavAnchor);
      ro?.disconnect();
      document.documentElement.style.removeProperty("--mobile-nav-sheet-top");
      document.documentElement.style.removeProperty("--mobile-overlay-top");
      headerEl.classList.remove("mobile-nav-active");
      document.body.classList.remove("mobile-nav-open");
      document.body.classList.remove("has-promo-offer");
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const collapse = document.getElementById("navbarNav");
    if (!collapse) return;
    const clearSubmenu = () => {
      if (!collapse.classList.contains("show")) {
        setOpenDropdown(null);
      }
    };
    const obs = new MutationObserver(clearSubmenu);
    obs.observe(collapse, { attributes: true, attributeFilter: ["class"] });
    clearSubmenu();
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    closeMobileMenu();
    scrollContentToTop();
  }, [pathname, closeMobileMenu]);

  return (
    <>
      <header className="header" id="header">
        <div className="mobile-menu-overlay" id="mobileMenuOverlay" aria-hidden="true" />
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <Link className="navbar-brand" href="/" onClick={() => onMainNavClick("/")}>
              <SiteLogo
                variant="header"
                src={settings.logoUrl}
                priority
                className="logo-img"
                dataCustomize="logo-header"
              />
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="toggler-icon">
                <span />
                <span />
                <span />
              </span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                {menu.map((item) =>
                  item.children?.length ? (
                    <li
                      key={item.label}
                      className={`nav-item dropdown nav-item-has-menu${openDropdown === item.label ? " is-open" : ""}`}
                      onMouseEnter={() => {
                        if (
                          typeof window !== "undefined" &&
                          window.matchMedia("(min-width: 992px)").matches
                        ) {
                          openMenu(item.label);
                        }
                      }}
                      onMouseLeave={() => {
                        if (
                          typeof window !== "undefined" &&
                          window.matchMedia("(min-width: 992px)").matches
                        ) {
                          scheduleClose();
                        }
                      }}
                    >
                      <Link
                        href={item.href === "#" ? "#" : item.href}
                        className={`nav-link dropdown-toggle nav-link-parent-desktop d-none d-lg-flex${isActive(item.href) ? " active" : ""}`}
                        aria-expanded={openDropdown === item.label ? true : false}
                        onClick={(e) => {
                          if (item.href === "#") e.preventDefault();
                          else onMainNavClick(item.href);
                        }}
                      >
                        {item.label}
                      </Link>
                      <div className="nav-mobile-parent d-lg-none">
                        <span
                          className={`nav-mobile-parent-label${isActive(item.href) ? " is-active-trail" : ""}`}
                        >
                          {item.label}
                        </span>
                        <button
                          type="button"
                          className="nav-mobile-submenu-toggle"
                          aria-expanded={openDropdown === item.label}
                          aria-controls={`submenu-${item.label.replace(/\s+/g, "-").toLowerCase()}`}
                          aria-label={
                            openDropdown === item.label
                              ? `Close ${item.label} submenu`
                              : `Open ${item.label} submenu`
                          }
                          onClick={() =>
                            setOpenDropdown((prev) => (prev === item.label ? null : item.label))
                          }
                        >
                          <i className="fas fa-chevron-down" aria-hidden="true" />
                        </button>
                      </div>
                      <ul
                        id={`submenu-${item.label.replace(/\s+/g, "-").toLowerCase()}`}
                        className={`dropdown-menu${item.label === "Services" ? " mega-dropdown" : ""}${openDropdown === item.label ? " show" : ""}`}
                        onMouseEnter={() => {
                          if (
                            typeof window !== "undefined" &&
                            window.matchMedia("(min-width: 992px)").matches
                          ) {
                            cancelClose();
                          }
                        }}
                        onMouseLeave={() => {
                          if (
                            typeof window !== "undefined" &&
                            window.matchMedia("(min-width: 992px)").matches
                          ) {
                            scheduleClose();
                          }
                        }}
                      >
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              className="dropdown-item"
                              href={child.href}
                              onClick={() => onMainNavClick(child.href)}
                            >
                              {child.icon ? <i className={`${child.icon} me-2`} /> : null}
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li key={item.label} className="nav-item">
                      <Link
                        className={`nav-link${isActive(item.href) ? " active" : ""}`}
                        href={item.href}
                        onClick={() => onMainNavClick(item.href)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
              <div className="navbar-actions">
                <button
                  type="button"
                  className="btn-cta btn-cta-navbar"
                  onClick={openAskPriceModal}
                >
                  <i className="fas fa-tags" aria-hidden="true" />
                  <span>Ask price</span>
                </button>
                <div className="d-none d-lg-flex">
                  <MemberAuthNav />
                </div>
              </div>
              <div className="d-lg-none">
                <MemberAuthNavMobileFooter />
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
