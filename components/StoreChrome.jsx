"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import CookieConsent from "@/components/CookieConsent";

// Public store chrome (header/footer/WhatsApp FAB) should not wrap the
// password-protected admin panel — those routes render their own sidebar.
export default function StoreChrome({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return children;
  }

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <WhatsAppFloatingButton />
      <CookieConsent />
    </>
  );
}
