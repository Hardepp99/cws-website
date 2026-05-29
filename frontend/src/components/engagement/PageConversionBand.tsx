import Link from "next/link";

type PageConversionBandProps = {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  showAskPrice?: boolean;
};

/** Non-intrusive CTA band for inner pages — uses existing `.cta-section` styles. */
export function PageConversionBand({
  title = "Ready to talk through your project?",
  description = "Share your goals — we reply within one business day with practical next steps. Prefer a ballpark first? Use Ask price in the menu.",
  primaryLabel = "Contact us",
  primaryHref = "/contact",
  secondaryLabel = "Call +91-7015969967",
  secondaryHref = "tel:+917015969967",
  showAskPrice = true,
}: PageConversionBandProps) {
  return (
    <section className="cta-section page-conversion-band">
      <div className="corp-container text-center">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="page-conversion-band__actions">
          <Link href={primaryHref} className="btn btn-light btn-sm px-4">
            {primaryLabel}
          </Link>
          {showAskPrice ? (
            <a href="#ask-price" className="btn btn-outline-light btn-sm px-4">
              Ask price
            </a>
          ) : null}
          <a href={secondaryHref} className="btn btn-outline-light btn-sm px-4">
            {secondaryLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
