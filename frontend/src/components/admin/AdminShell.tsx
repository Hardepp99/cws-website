"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { adminLogout } from "@/lib/admin/client";
import { CWS_LOGO_LIGHT_PATH } from "@/lib/site-brand";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "fa-gauge-high" },
  { href: "/admin/media", label: "Media", icon: "fa-images" },
  { href: "/admin/homepage", label: "Homepage", icon: "fa-house" },
  { href: "/admin/site-pages", label: "Pages", icon: "fa-file-lines" },
  { href: "/admin/blog", label: "Blog", icon: "fa-newspaper" },
  { href: "/admin/services", label: "Services", icon: "fa-briefcase" },
  { href: "/admin/landings", label: "Service Landings", icon: "fa-layer-group" },
  { href: "/admin/menus", label: "Menus", icon: "fa-bars" },
  { href: "/admin/settings", label: "Customize", icon: "fa-sliders" },
  { href: "/admin/pricing", label: "Ask Price", icon: "fa-tag" },
  { href: "/admin/forms", label: "Form Submissions", icon: "fa-inbox" },
];

function navIsActive(pathname: string, href: string): boolean {
  return pathname === href || (href !== "/admin" && pathname.startsWith(href));
}

export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    closeSidebar();
    setProfileOpen(false);
  }, [pathname, closeSidebar]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen, closeSidebar]);

  useEffect(() => {
    if (!profileOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [profileOpen]);

  async function logout() {
    setProfileOpen(false);
    await adminLogout();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className={`cms-admin-root${sidebarOpen ? " cms-admin-root--nav-open" : ""}`}>
      <button
        type="button"
        className="cms-admin-overlay"
        aria-label="Close menu"
        onClick={closeSidebar}
        tabIndex={sidebarOpen ? 0 : -1}
      />

      <aside
        className={`cms-admin-sidebar${sidebarOpen ? " is-open" : ""}`}
        id="cms-admin-sidebar"
        aria-label="Admin navigation"
      >
        <div className="cms-admin-brand">
          <Image src={CWS_LOGO_LIGHT_PATH} alt="Creative Web Solutions" width={160} height={40} priority />
          <span>Content Manager</span>
        </div>
        <nav className="cms-admin-nav">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={navIsActive(pathname, item.href) ? "active" : ""}
              onClick={closeSidebar}
            >
              <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="cms-admin-main">
        <header className="cms-admin-topbar">
          <div className="cms-admin-topbar-start">
            <button
              type="button"
              className="cms-admin-menu-toggle"
              aria-expanded={sidebarOpen}
              aria-controls="cms-admin-sidebar"
              onClick={() => setSidebarOpen((o) => !o)}
            >
              <i className="fa-solid fa-bars" aria-hidden="true" />
              <span className="visually-hidden">Open menu</span>
            </button>
            <div className="cms-admin-topbar-brand">
              <strong className="cms-admin-topbar-title">CWS Admin</strong>
              <span className="cms-admin-topbar-page">{title}</span>
            </div>
          </div>

          <div className="cms-admin-topbar-end" ref={profileRef}>
            <button
              type="button"
              className="cms-admin-profile-btn"
              aria-expanded={profileOpen}
              aria-haspopup="true"
              onClick={() => setProfileOpen((o) => !o)}
            >
              <span className="cms-admin-profile-avatar" aria-hidden="true">
                <i className="fa-solid fa-user" />
              </span>
              <span className="cms-admin-profile-label">Admin</span>
              <i className={`fa-solid fa-chevron-down cms-admin-profile-caret${profileOpen ? " is-open" : ""}`} aria-hidden="true" />
            </button>
            {profileOpen ? (
              <div className="cms-admin-profile-menu" role="menu">
                <a href="/" target="_blank" rel="noreferrer" role="menuitem" onClick={() => setProfileOpen(false)}>
                  <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
                  View site
                </a>
                <button type="button" role="menuitem" onClick={logout}>
                  <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
                  Log out
                </button>
              </div>
            ) : null}
          </div>
        </header>

        <div className="cms-admin-content">{children}</div>
      </div>
    </div>
  );
}
