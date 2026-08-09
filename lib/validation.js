// Lightweight client-side validation helpers — no external deps.

export function isValidPakistaniPhone(value) {
  if (!value) return false;
  const normalized = value.replace(/[\s-]/g, "");
  const local = /^03\d{9}$/; // e.g. 03001234567
  const international = /^(\+92|0092)3\d{9}$/; // e.g. +923001234567
  return local.test(normalized) || international.test(normalized);
}

export function isNonEmpty(value) {
  return Boolean(value && value.trim().length > 0);
}
