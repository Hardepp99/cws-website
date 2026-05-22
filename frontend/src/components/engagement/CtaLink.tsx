"use client";

import Link from "next/link";
import { isAskPriceHref, openAskPriceModal } from "@/lib/ask-price";

interface CtaLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

/** Renders a link, or a button that opens Ask price when href is `#ask-price`. */
export function CtaLink({ href, className, children }: CtaLinkProps) {
  if (isAskPriceHref(href)) {
    return (
      <button type="button" className={className} onClick={openAskPriceModal}>
        {children}
      </button>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
