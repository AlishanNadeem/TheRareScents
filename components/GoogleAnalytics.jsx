"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_KEY,
} from "@/components/CookieConsent";

/**
 * Loads Google Analytics (gtag.js) only when:
 * - NEXT_PUBLIC_GA_MEASUREMENT_ID is set
 * - the user is not on /admin
 * - cookie consent is "accepted"
 */
export default function GoogleAnalytics({ measurementId }) {
  const pathname = usePathname();
  const [consentAccepted, setConsentAccepted] = useState(false);

  useEffect(() => {
    function sync() {
      try {
        setConsentAccepted(
          localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted"
        );
      } catch {
        setConsentAccepted(false);
      }
    }
    sync();
    window.addEventListener(COOKIE_CONSENT_EVENT, sync);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, sync);
  }, []);

  if (!measurementId) return null;
  if (pathname?.startsWith("/admin")) return null;
  if (!consentAccepted) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
