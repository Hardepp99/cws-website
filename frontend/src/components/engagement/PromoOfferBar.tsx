"use client";

interface PromoOfferBarProps {
  text: string;
  quoteLabel: string;
  callLabel: string;
  onAskPriceClick: () => void;
  onDismiss: () => void;
  phone?: string;
}

export function PromoOfferBar({
  text,
  quoteLabel,
  callLabel,
  onAskPriceClick,
  onDismiss,
  phone,
}: PromoOfferBarProps) {
  const tel = phone?.replace(/\s/g, "") || "+917015969967";

  return (
    <div className="promo-offer-bar" id="promoOfferBar" role="region" aria-label="Promotion">
      <div className="container promo-offer-inner">
        <p className="promo-offer-text">
          <i className="fas fa-star promo-offer-text__icon" aria-hidden="true" />
          <span data-customize="promo-offer-text">{text}</span>
          <i className="fas fa-star promo-offer-text__icon" aria-hidden="true" />
        </p>
        <div className="promo-offer-actions">
          <button
            type="button"
            className="promo-offer-btn promo-offer-btn--quote"
            onClick={onAskPriceClick}
            data-customize="promo-offer-quote-label"
          >
            {quoteLabel}
          </button>
          <a href={`tel:${tel}`} className="promo-offer-btn promo-offer-btn--call" data-customize="promo-offer-call-label">
            {callLabel}
          </a>
          <button
            type="button"
            className="promo-offer-close"
            onClick={onDismiss}
            aria-label="Dismiss offer for this visit"
          >
            <i className="fas fa-times" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
