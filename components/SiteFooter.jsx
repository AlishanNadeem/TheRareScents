import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import SocialStrip from "@/components/SocialStrip";
import { CookieSettingsLink } from "@/components/CookieConsent";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-paper/90">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <h2 className="m-0">
              <Image
                src="/logo.png"
                alt={siteConfig.name}
                width={160}
                height={160}
                className="h-auto w-[110px] sm:w-[140px] md:w-[160px]"
              />
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-paper/80">
              Rare oils. Exclusive blends. Curated perfumes delivered across
              Pakistan.
            </p>
            <SocialStrip className="mt-5" />
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gold">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="transition-colors duration-300 hover:text-gold"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="transition-colors duration-300 hover:text-gold"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors duration-300 hover:text-gold"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="transition-colors duration-300 hover:text-gold"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gold">
              Shop by Category
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {siteConfig.categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={category.href}
                    className="transition-colors duration-300 hover:text-gold"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gold">
              Contact
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-paper/80">
              <li>
                <a
                  href={siteConfig.whatsapp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-gold"
                >
                  WhatsApp: {siteConfig.whatsapp.display}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors duration-300 hover:text-gold"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="text-paper/60">Online store — order anytime</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gold">
              We Deliver To
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-paper/80">
              {siteConfig.cities.map((city) => (
                <li key={city}>{city}</li>
              ))}
              <li className="text-paper/60">
                &amp; nationwide across Pakistan
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-paper/10 pt-6 text-center text-xs text-paper/60">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved. Original
            perfumes, oud &amp; attars — proudly Pakistani.
          </p>
          <p className="mt-2">
            <CookieSettingsLink className="text-paper/60" />
          </p>
        </div>
      </div>
    </footer>
  );
}
