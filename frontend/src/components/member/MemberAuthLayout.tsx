import Link from "next/link";
import { ReactNode } from "react";

type MemberAuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerLabel: string;
  footerHref: string;
  footerLinkText: string;
};

const BENEFITS = [
  "Comment on blog posts and join discussions",
  "Participate in community forums",
  "Share expertise with member articles",
];

export function MemberAuthLayout({
  title,
  subtitle,
  children,
  footerLabel,
  footerHref,
  footerLinkText,
}: MemberAuthLayoutProps) {
  return (
    <div className="member-auth-layout">
      <aside className="member-auth-brand" aria-hidden={false}>
        <p className="member-auth-brand__tagline">Member community</p>
        <ul className="member-auth-brand__list">
          {BENEFITS.map((item) => (
            <li key={item}>
              <i className="fa-solid fa-check" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </aside>

      <div className="member-auth-panel">
        <div className="member-auth-card">
          <header className="member-auth-card__head">
            <h2 className="member-auth-card__title">{title}</h2>
            <p className="member-auth-card__subtitle">{subtitle}</p>
          </header>
          {children}
          <p className="member-auth-card__footer">
            {footerLabel}{" "}
            <Link href={footerHref} className="member-auth-card__link">
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
