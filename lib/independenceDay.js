/**
 * Helpers for the Independence Day banner.
 * To take the banner down, remove <IndependenceDayBanner /> from app/page.js
 * and delete components/IndependenceDayBanner.js — nothing auto-hides it.
 */

export const PAKISTAN_FLAG_GREEN = "#01411C";
export const INDEPENDENCE_YEAR = 1947;

/** @returns {{ year: number, month: number, day: number }} calendar parts in PKT */
export function getPakistanDateParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);

  const value = (type) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
  };
}

/** Years since 14 Aug 1947, based on the Pakistan calendar year. */
export function getFreedomYears(now = new Date()) {
  const { year } = getPakistanDateParts(now);
  return year - INDEPENDENCE_YEAR;
}
