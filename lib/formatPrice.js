export function formatPrice(price, currency = "PKR") {
  const amount = new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(price);

  if (currency === "PKR") {
    return `Rs ${amount}`;
  }

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}
