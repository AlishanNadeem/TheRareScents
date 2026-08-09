/**
 * Normalize a Pakistani phone number into digits suitable for tel: / wa.me.
 * Accepts 03XXXXXXXXX, +923XXXXXXXXX, 00923XXXXXXXXX, or already 923XXXXXXXXX.
 */
export function toWhatsAppNumber(phone) {
  if (!phone) return "";
  let digits = String(phone).replace(/\D/g, "");

  if (digits.startsWith("0092")) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0") && digits.length === 11) {
    digits = `92${digits.slice(1)}`;
  } else if (digits.startsWith("3") && digits.length === 10) {
    digits = `92${digits}`;
  }

  return digits;
}

export function telHref(phone) {
  const digits = toWhatsAppNumber(phone);
  return digits ? `tel:+${digits}` : `tel:${phone}`;
}

export function whatsappHref(phone, message = "") {
  const digits = toWhatsAppNumber(phone);
  if (!digits) return "#";
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
