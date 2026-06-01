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
  const [navStuck, setNavStuck] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stickySentinelRef = useRef<HTMLDivElement>(null);

  const phone = settings.phone?.trim() ?? "";
  const phoneTel = phone ? `tel:${phone.replace(/[\s-]/g, "")}` : "";

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

    const updateOverlayTop = () => {
      if (!window.matchMedia("(max-width: 991.98px)").matches) {
        document.documentElement.style.removeProperty("--mobile-nav-sheet-top");
        return;
      }
      const chrome = headerEl.querySelector<HTMLElement>(".navbar-mobile-chrome");
      if (!chrome) return;
      document.documentElement.style.setProperty(
        "--mobile-nav-sheet-top",
        `${Math.round(chrome.getBoundingClientRect().bottom)}px`,
      );
    };

    if (overlay.parentElement !== document.body) {
      document.body.appendChild(overlay);
    }

    const sync = () => {
      const open = collapse.classList.contains("show");
      overlay.classList.toggle("active", open);
      headerEl.classList.toggle("mobile-nav-active", open);
      document.body.classList.toggle("mobile-nav-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      const toggler = headerEl.querySelector<HTMLButtonElement>(".navbar-toggler");
      if (toggler) {
        toggler.setAttribute("aria-expanded", open ? "true" : "false");
        toggler.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      }
      if (open) {
        updateOverlayTop();
        requestAnimationFrame(updateOverlayTop);
      }
    };

    const observer = new MutationObserver(sync);
    observer.observe(collapse, { attributes: true, attributeFilter: ["class"] });
    sync();

    window.addEventListener("resize", updateOverlayTop);
    window.addEventListener("cws:promo-offer-dismissed", updateOverlayTop);

    const closeFromOverlay = () => {
      const toggler = document.querySelector<HTMLButtonElement>(".navbar-toggler");
      if (collapse.classList.contains("show") && toggler) toggler.click();
    };
    overlay.addEventListener("click", closeFromOverlay);

    return () => {
      observer.disconnect();
      overlay.removeEventListener("click", closeFromOverlay);
      window.removeEventListener("resize", updateOverlayTop);
      window.removeEventListener("cws:promo-offer-dismissed", updateOverlayTop);
      document.documentElement.style.removeProperty("--mobile-nav-sheet-top");
      if (overlay.parentElement === document.body) {
        headerEl.prepend(overlay);
      }
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

  useEffect(() => {
    const sentinel = stickySentinelRef.current;
    const headerEl = document.getElementById("header");
    if (!sentinel || !headerEl) return;

    const mq = window.matchMedia("(max-width: 991.98px)");
    const applyStuck = (stuck: boolean) => {
      setNavStuck(stuck && mq.matches);
    };

    const observer = new IntersectionObserver(
      ([entry]) => applyStuck(!entry.isIntersecting),
      { threshold: 0, root: null, rootMargin: "0px" },
    );
    observer.observe(sentinel);

    const onMq = () => {
      if (!mq.matches) {
        applyStuck(false);
        return;
      }
      const rect = sentinel.getBoundingClientRect();
      applyStuck(rect.bottom <= 0);
    };
    mq.addEventListener("change", onMq);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", onMq);
    };
  }, []);

  return (
    <>
      <div ref={stickySentinelRef} className="navbar-sticky-sentinel" aria-hidden="true" />
      <header className={`header${navStuck ? " is-stuck" : ""}`} id="header">
        <div className="mobile-menu-overlay" id="mobileMenuOverlay" aria-hidden="true" />
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <div className="navbar-mobile-chrome">
              <Link className="navbar-brand" href="/" onClick={() => onMainNavClick("/")}>
                <SiteLogo
                  variant="header"
                  src={settings.logoUrl}
                  priority
                  className="logo-img"
                  dataCustomize="logo-header"
                />
              </Link>
              {phoneTel ? (
                <a
                  href={phoneTel}
                  className="navbar-sticky-call d-lg-none"
                  data-customize-phone-wrap=""
                  onClick={closeMobileMenu}
                >
                  <i className="fas fa-phone-alt" aria-hidden="true" />
                  <span data-customize="phone">{phone}</span>
                </a>
              ) : null}
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Open menu"
              >
                <span className="toggler-icon" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            </div>
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
