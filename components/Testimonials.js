"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { Reveal } from "@/components/Reveal";

// MOCK DATA — replace with real customer reviews before final launch
const TESTIMONIALS = [
  {
    name: "Ayesha K.",
    city: "Karachi",
    rating: 5,
    quote:
      "Absolutely loved the fragrance, lasted the whole day. Packaging was beautiful too!",
  },
  {
    name: "Bilal R.",
    city: "Lahore",
    rating: 5,
    quote:
      "Ordered via WhatsApp, super quick response and delivery was faster than expected.",
  },
  {
    name: "Hina M.",
    city: "Islamabad",
    rating: 4,
    quote: "Great scent and very original, exactly what I was looking for.",
  },
  {
    name: "Usman T.",
    city: "Karachi",
    rating: 5,
    quote:
      "Been buying from The Rare Scents for a while now, always consistent quality.",
  },
  {
    name: "Sana A.",
    city: "Lahore",
    rating: 5,
    quote:
      "Cash on delivery made it so easy to trust buying online. Will order again.",
  },
];

const AUTO_MS = 5500;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

function usePerView() {
  const [perView, setPerView] = useState(1);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width >= 1024) setPerView(3);
      else if (width >= 640) setPerView(2);
      else setPerView(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return perView;
}

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < rating;
        return (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className={`h-4 w-4 ${filled ? "text-gold" : "text-gold/25"}`}
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M10 1.5l2.4 5.1 5.6.5-4.2 3.7 1.3 5.4L10 13.4l-4.9 2.8 1.3-5.4-4.2-3.7 5.6-.5L10 1.5z"
            />
          </svg>
        );
      })}
    </div>
  );
}

function TestimonialCard({ item }) {
  return (
    <blockquote className="relative flex h-full flex-col rounded-xl border border-gold/15 bg-paper p-6 shadow-sm">
      <span
        className="pointer-events-none absolute right-4 top-2 font-display text-6xl leading-none text-gold/20"
        aria-hidden="true"
      >
        &ldquo;
      </span>
      <StarRating rating={item.rating} />
      <p className="relative mt-4 flex-1 text-sm leading-relaxed text-neutral-700 sm:text-base">
        {item.quote}
      </p>
      <footer className="mt-5 border-t border-ink/10 pt-4">
        <cite className="not-italic">
          <span className="block text-sm font-medium text-ink">{item.name}</span>
          <span className="mt-0.5 block text-xs text-neutral-500">
            {item.city}
          </span>
        </cite>
      </footer>
    </blockquote>
  );
}

export default function Testimonials() {
  const headingId = useId();
  const reduceMotion = usePrefersReducedMotion();
  const perView = usePerView();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = TESTIMONIALS.length;
  const maxStart = Math.max(0, count - perView);
  const pageCount = maxStart + 1;

  const goTo = useCallback(
    (next) => {
      setIndex(((next % pageCount) + pageCount) % pageCount);
    },
    [pageCount]
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    setIndex((current) => Math.min(current, maxStart));
  }, [maxStart]);

  useEffect(() => {
    if (reduceMotion || paused || pageCount <= 1) return undefined;

    const id = window.setInterval(() => {
      setIndex((current) => (current >= maxStart ? 0 : current + 1));
    }, AUTO_MS);

    return () => window.clearInterval(id);
  }, [reduceMotion, paused, pageCount, maxStart]);

  return (
    <section
      className="bg-ink"
      aria-labelledby={headingId}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <Reveal>
          <div className="text-center">
            <h2
              id={headingId}
              className="font-display text-2xl text-paper sm:text-3xl"
            >
              What Our Customers Say
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-paper/75">
              Notes from fragrance lovers across Pakistan.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-10" delay={0.06}>
          <div className="relative">
            <div className="overflow-hidden">
              <ul
                className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
                style={{
                  width: `${(count / perView) * 100}%`,
                  transform: `translateX(-${(index / count) * 100}%)`,
                }}
              >
                {TESTIMONIALS.map((item) => (
                  <li
                    key={`${item.name}-${item.city}`}
                    className="box-border shrink-0 px-3"
                    style={{ width: `${100 / count}%` }}
                  >
                    <TestimonialCard item={item} />
                  </li>
                ))}
              </ul>
            </div>

            {pageCount > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous testimonials"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold transition duration-300 ease-out hover:bg-gold hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M15 6 9 12l6 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div
                  className="flex items-center gap-2"
                  role="tablist"
                  aria-label="Testimonial slides"
                >
                  {Array.from({ length: pageCount }, (_, page) => {
                    const active = page === index;
                    return (
                      <button
                        key={page}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-label={`Show testimonials group ${page + 1} of ${pageCount}`}
                        onClick={() => goTo(page)}
                        className={`h-2.5 rounded-full transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${
                          active
                            ? "w-6 bg-gold"
                            : "w-2.5 bg-paper/30 hover:bg-paper/50"
                        }`}
                      />
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next testimonials"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold transition duration-300 ease-out hover:bg-gold hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="m9 6 6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
