"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { siteConfig } from "@/lib/siteConfig";

export default function CategoryHighlights() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <Reveal>
          <h2 className="text-center font-display text-2xl text-paper sm:text-3xl">
            Shop By Category
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-paper/75">
            From bold ouds to soft florals — find the fragrance made for you.
          </p>
        </Reveal>

        <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.categories.map((category) => (
            <StaggerItem key={category.slug}>
              <Link
                href={category.href}
                className="group block overflow-hidden rounded-xl bg-ink/60 ring-1 ring-gold/15 transition duration-300 ease-out hover:scale-[1.03] hover:ring-gold/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold motion-reduce:hover:scale-100"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={`${category.label} perfumes at ${siteConfig.name}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-300 ease-out group-hover:scale-110 motion-reduce:group-hover:scale-100"
                    />
                  )}
                  <div className="absolute inset-0 bg-ink/40" />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg text-gold">
                    {category.label}
                  </h3>
                  <p className="mt-1 text-sm text-paper/75">
                    {category.description}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
