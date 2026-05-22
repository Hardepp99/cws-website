"use client";

interface PromoOfferBarProps {
  onAskPriceClick: () => void;
  phone?: string;
}

export function PromoOfferBar({ onAskPriceClick, phone }: PromoOfferBarProps) {
  const tel = phone?.replace(/\s/g, "") || "+917015969967";

  return (
    <div className="promo-offer-bar" id="promoOfferBar" role="region" aria-label="Promotion">
      <div className="container promo-offer-inner">
        <p className="promo-offer-text">
          <i className="fas fa-star" aria-hidden="true" />
          <span>Limited-time: written quote on website &amp; app packages — reply within one business day</span>
          <i className="fas fa-star" aria-hidden="true" />
        </p>
        <div className="promo-offer-actions">
          <button type="button" className="promo-offer-btn promo-offer-btn--quote" onClick={onAskPriceClick}>
            Ask price
          </button>
          <a href={`tel:${tel}`} className="promo-offer-btn promo-offer-btn--call">
            Call now
          </a>
        </div>
      </div>
    </div>
  );
}
