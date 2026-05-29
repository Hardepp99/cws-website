"use client";

import Link from "next/link";
import { useMemberSession } from "@/components/member/MemberSessionProvider";
import { closeMobileMenu } from "@/lib/nav/close-mobile-menu";

function AccountNavButton({
  href,
  label,
  onClick,
  fullWidth = false,
}: {
  href: string;
  label: string;
  onClick?: () => void;
  fullWidth?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`btn-outline-custom btn-sm member-auth-nav__account-btn${fullWidth ? " w-100" : ""}`}
      onClick={onClick}
      title={label}
    >
      <i className="fa-regular fa-circle-user" aria-hidden="true" />
      <span className="member-auth-nav__account-label">{label}</span>
    </Link>
  );
}

export function MemberAuthNav() {
  const { member, loading } = useMemberSession();

  const onNavClick = () => {
    closeMobileMenu();
  };

  if (loading) {
    return (
      <div className="member-auth-nav member-auth-nav--loading" aria-hidden="true">
        <span className="member-auth-nav__account-btn member-auth-nav__account-btn--placeholder" />
      </div>
    );
  }

  if (member) {
    const name = member.displayName?.trim() || "Account";
    return (
      <div className="member-auth-nav">
        <AccountNavButton href="/account" label={name} onClick={onNavClick} />
      </div>
    );
  }

  return (
    <div className="member-auth-nav">
      <AccountNavButton href="/account/login" label="Account" onClick={onNavClick} />
    </div>
  );
}

export function MemberAuthNavMobileFooter() {
  const { member, loading } = useMemberSession();

  if (loading) return null;

  const onNavClick = () => closeMobileMenu();

  if (member) {
    const name = member.displayName?.trim() || "Account";
    return (
      <div className="member-auth-mobile-footer">
        <AccountNavButton href="/account" label={name} onClick={onNavClick} fullWidth />
      </div>
    );
  }

  return (
    <div className="member-auth-mobile-footer">
      <AccountNavButton href="/account/login" label="Account" onClick={onNavClick} fullWidth />
    </div>
  );
}
