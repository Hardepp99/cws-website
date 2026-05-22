/** Use as CTA href in WP/seed data to open the shared Ask price modal. */
export const ASK_PRICE_HREF = "#ask-price";

export function isAskPriceHref(href: string | undefined): boolean {
  if (!href) return false;
  const h = href.trim().toLowerCase();
  return h === ASK_PRICE_HREF || h === "ask-price" || h === "#askprice";
}

export function openAskPriceModal(): void {
  window.dispatchEvent(new CustomEvent("cws:open-ask-price"));
}
