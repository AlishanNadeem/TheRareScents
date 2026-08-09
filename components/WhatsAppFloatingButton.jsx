import { siteConfig } from "@/lib/siteConfig";

export default function WhatsAppFloatingButton() {
  return (
    <a
      href={siteConfig.whatsapp.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Order on WhatsApp — ${siteConfig.whatsapp.display}`}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-espresso shadow-lg transition duration-300 ease-out hover:scale-110 hover:bg-[#d4af5a] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-gold motion-reduce:hover:scale-100"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.51 3.62 1.4 5.12L2 22l5.13-1.5a9.9 9.9 0 0 0 4.91 1.3h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.1.11-1.77-.11-.4-.13-.93-.3-1.6-.6-2.82-1.22-4.66-4.07-4.8-4.26-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07 1-2.35.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.81 1.99.88 2.13.07.14.12.31.02.5-.1.19-.15.31-.3.48-.14.17-.3.38-.43.51-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.05.16-.17.7-.81.89-1.09.19-.28.38-.23.63-.14.26.1 1.65.78 1.94.92.28.14.47.21.54.33.07.12.07.7-.17 1.37Z" />
      </svg>
    </a>
  );
}
