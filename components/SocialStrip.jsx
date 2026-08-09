import { siteConfig } from "@/lib/siteConfig";

const icons = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 8.5h2V5.6c-.34-.05-1.5-.15-2.86-.15-2.9 0-4.64 1.72-4.64 4.86v2.32H6v3.2h2.5V21h3.3v-5.17h2.72l.42-3.2h-3.14V10.6c0-.93.27-1.55 1.5-1.55Z"
        fill="currentColor"
      />
    </svg>
  ),
};

const socialLinks = [
  { key: "instagram", label: "Instagram", href: siteConfig.social.instagram },
  { key: "facebook", label: "Facebook", href: siteConfig.social.facebook },
];

export default function SocialStrip({ className = "" }) {
  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {socialLinks.map((social) => (
        <li key={social.key}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${siteConfig.name} on ${social.label}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold transition duration-300 ease-out hover:scale-105 hover:bg-gold hover:text-espresso hover:shadow-md"
          >
            <span className="h-4 w-4">{icons[social.key]}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
