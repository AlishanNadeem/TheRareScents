/**
 * Sale / effective-price helpers. Use these anywhere a product price is
 * shown or sent (cards, detail, WhatsApp, order form) so discounts stay
 * consistent and auto-expire after sale_ends_at.
 */

export function isSaleActive(product, now = new Date()) {
  if (!product?.on_sale) return false;

  const percent = Number(product.discount_percent);
  if (!Number.isFinite(percent) || percent <= 0) return false;

  if (product.sale_ends_at) {
    const ends = new Date(product.sale_ends_at);
    if (!Number.isNaN(ends.getTime()) && ends.getTime() <= now.getTime()) {
      return false;
    }
  }

  return true;
}

/** Rounded whole PKR amount the customer pays. */
export function getEffectivePrice(product, now = new Date()) {
  const price = Number(product?.price) || 0;

  if (!isSaleActive(product, now)) {
    return Math.round(price);
  }

  const percent = Number(product.discount_percent);
  const discounted = price - (price * percent) / 100;
  return Math.round(discounted);
}

/** Badge copy, e.g. "Azaadi Sale — 14% OFF". Null when sale is inactive. */
export function getSaleBadgeLabel(product, now = new Date()) {
  if (!isSaleActive(product, now)) return null;

  const percent = Math.round(Number(product.discount_percent));
  const label = typeof product.sale_label === "string" ? product.sale_label.trim() : "";

  if (label) return `${label} — ${percent}% OFF`;
  return `${percent}% OFF`;
}
