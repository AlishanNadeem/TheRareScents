"use client";

import { useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";

export default function ProductGallery({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const gallery = images?.length ? images : [];
  const activeImage = gallery[activeIndex] ?? gallery[0];

  return (
    <div>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-100">
        {activeImage && (
          <Image
            src={activeImage}
            alt={`${productName} perfume by ${siteConfig.name} — image ${activeIndex + 1} of ${gallery.length}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        )}
      </div>

      {gallery.length > 1 && (
        <div
          role="tablist"
          aria-label={`${productName} image gallery`}
          className="mt-4 flex gap-3"
        >
          {gallery.map((src, index) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Show image ${index + 1} of ${productName}`}
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg ring-2 transition focus-visible:outline-none focus-visible:ring-gold ${
                index === activeIndex
                  ? "ring-gold"
                  : "ring-transparent hover:ring-ink/30"
              }`}
            >
              <Image
                src={src}
                alt={`${productName} thumbnail ${index + 1} — ${siteConfig.name}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
