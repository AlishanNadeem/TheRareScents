"use client";

import { useEffect, useRef, useState } from "react";

export const COOKIE_CONSENT_KEY = "cookie-consent";
export const COOKIE_CONSENT_EVENT = "cookie-consent-changed";

function readConsent() {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch {
    return null;
  }
}

function writeConsent(value) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    // Ignore storage failures — choice still applies for this session in memory.
  }
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_EVENT, { detail: { value } })
  );
}

function clearConsent() {
  try {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
  } catch {
    // Ignore.
  }
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_EVENT, { detail: { value: null } })
  );
}

function setBannerOffset(px) {
  document.documentElement.style.setProperty(
    "--cookie-banner-h",
    px ? `${px}px` : "0px"
  );
}

/**
 * Slim bottom cookie bar. Stores accepted/declined in localStorage and
 * notifies GoogleAnalytics via a custom event when the choice changes.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef(null);

  useEffect(() => {
    function sync() {
      const consent = readConsent();
      setVisible(!consent);
    }
    sync();
    window.addEventListener(COOKIE_CONSENT_EVENT, sync);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, sync);
  }, []);

  // Measure real banner height so the WhatsApp FAB clears it on all breakpoints.
  useEffect(() => {
    if (!visible) {
      setBannerOffset(0);
      return undefined;
    }

    const node = bannerRef.current;
    if (!node) return undefined;

    function update() {
      setBannerOffset(Math.ceil(node.getBoundingClientRect().height));
    }

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      setBannerOffset(0);
    };
  }, [visible]);

  function accept() {
    writeConsent("accepted");
    setVisible(false);
  }

  function decline() {
    writeConsent("declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-gold/25 bg-ink text-paper shadow-[0_-8px_24px_rgba(0,0,0,0.25)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2.5 px-4 py-2.5 pr-16 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-3.5 sm:pr-6">
        <p className="text-xs leading-snug text-paper/85 sm:text-sm sm:leading-relaxed">
          We use cookies to understand site traffic and improve your experience.
        </p>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={decline}
            className="rounded-full border border-paper/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-paper/90 transition duration-300 ease-out hover:border-paper/50 hover:bg-paper/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:px-4 sm:py-2 sm:text-xs"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-espresso transition duration-300 ease-out hover:bg-[#d4af5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:px-4 sm:py-2 sm:text-xs"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

/** Footer link — clears stored choice and re-opens the banner. */
export function CookieSettingsLink({ className = "" }) {
  return (
    <button
      type="button"
      onClick={clearConsent}
      className={`transition-colors duration-300 hover:text-gold ${className}`}
    >
      Cookie Settings
    </button>
  );
}
