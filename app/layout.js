import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import StoreChrome from "@/components/StoreChrome";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { siteConfig } from "@/lib/siteConfig";

// Cormorant Garamond — headings, display text, and the brand name.
const fontDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
  display: "swap",
});

// Jost — body text, nav, buttons, forms; the site-wide default sans-serif.
const fontSans = Jost({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Buy Original Perfumes Online in Pakistan`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  alternates: {
    canonical: "/",
    languages: {
      "en-PK": "/",
    },
  },
  openGraph: {
    title: `${siteConfig.name} | Buy Original Perfumes Online in Pakistan`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Original Perfumes & Oud in Pakistan`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Buy Original Perfumes Online in Pakistan`,
    description: siteConfig.description,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  // Google Search Console — set GOOGLE_SITE_VERIFICATION in .env.local
  // (the content value from the HTML-tag verification method). Omitted when empty.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  other: {
    "geo.region": "PK",
    "geo.placename": siteConfig.country,
  },
};

export const viewport = {
  themeColor: "#0A0A0A",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-PK">
      <body
        className={`${fontDisplay.variable} ${fontSans.variable} bg-paper font-sans text-ink antialiased`}
      >
        <GoogleAnalytics
          measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
        />
        <StoreChrome>{children}</StoreChrome>
      </body>
    </html>
  );
}
