"use client";

import Image from "next/image";
import { Reveal } from "@/components/Reveal";

export default function BrandStory() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
              <Image
                src="/about-image.jpg"
                alt="The Rare Scents — curated perfume collection"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition duration-500 ease-out hover:scale-105"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl">
                Our Story
              </h2>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-neutral-700">
                <p>
                  The Rare Scents began with a simple belief: that a fragrance
                  should be as rare as the moments it&apos;s worn for. We travel
                  beyond the ordinary aisle, sourcing rare oils, aged oud, and
                  hand-blended attars from across Pakistan and beyond —
                  ingredients most perfume houses never bother to look for.
                </p>
                <p>
                  Every bottle we curate is chosen for its character, not just
                  its name. We work in small batches, testing each blend for
                  depth, longevity, and how it evolves on skin, so what you
                  smell in the bottle is exactly what lingers hours later.
                </p>
                <p>
                  From the streets of Karachi to your doorstep anywhere in
                  Pakistan, our promise stays the same: rare oils, exclusive
                  blends, and fragrances designed to delight and inspire.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
