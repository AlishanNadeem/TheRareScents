import Image from "next/image";
import { getFreedomYears, PAKISTAN_FLAG_GREEN } from "@/lib/independenceDay";

/**
 * Seasonal Independence Day banner.
 * Always shown while this component is imported — remove it from app/page.js
 * (and delete this file) when you no longer want it.
 */
export default function IndependenceDayBanner() {
  const years = getFreedomYears();

  return (
    <div
      className="relative overflow-hidden text-paper"
      style={{ backgroundColor: PAKISTAN_FLAG_GREEN }}
      role="region"
      aria-label="Pakistan Independence Day"
    >
      <Image
        src="/banners/independence-day.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden="true"
        priority
      />
      {/* Keep text readable over the photo */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `${PAKISTAN_FLAG_GREEN}BB` }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-6xl items-center justify-center px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="flex min-w-0 flex-col items-center justify-center gap-0.5 text-center sm:gap-1">
          <p className="text-[12px] font-semibold leading-snug text-paper sm:text-sm md:text-base">
            Happy Independence Day, Pakistan!
          </p>
          <p className="text-[10px] font-medium tracking-wide text-paper/80 sm:text-[11px]">
            Celebrating {years} Years of Freedom
          </p>
        </div>
      </div>
    </div>
  );
}
