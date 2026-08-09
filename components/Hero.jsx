import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <Image
        src="/hero-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />
      {/* Dark overlay so the logo, tagline, and CTA stay readable over the photo. */}
      <div className="absolute inset-0 bg-ink/60" aria-hidden="true" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center sm:py-32">
        <Image
          src="/logo.png"
          alt={`${siteConfig.name} — RS monogram logo, original perfumes in Pakistan`}
          width={128}
          height={128}
          priority
          className="h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32"
        />

        <h1 className="mt-8 max-w-3xl font-display text-3xl leading-tight text-white sm:text-5xl">
          Buy Original Perfumes Online in Pakistan
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
          {siteConfig.tagline}
        </p>

        <Link
          href="/products"
          className="mt-9 inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-wide text-espresso transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:text-base"
        >
          Shop The Collection
        </Link>
      </div>
    </section>
  );
}
