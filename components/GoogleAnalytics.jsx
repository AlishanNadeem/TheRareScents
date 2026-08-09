"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

/**
 * Loads Google Analytics (gtag.js) when NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 * Leave the env var empty in local/.env.example until you have a real GA4 ID.
 */
export default function GoogleAnalytics({ measurementId }) {
  const pathname = usePathname();

  if (!measurementId) return null;
  if (pathname?.startsWith("/admin")) return null;

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
