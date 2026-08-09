"use client";

import { useId, useState } from "react";
import { FAQS } from "@/lib/faq";

function ChevronIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${
        open ? "rotate-180" : "rotate-0"
      }`}
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FAQSection() {
  const baseId = useId();
  // One open at a time — cleaner on mobile and easier to scan.
  const [openIndex, setOpenIndex] = useState(0);

  function toggle(index) {
    setOpenIndex((current) => (current === index ? -1 : index));
  }

  return (
    <section className="bg-paper" aria-labelledby={`${baseId}-heading`}>
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <div className="text-center">
          <h2
            id={`${baseId}-heading`}
            className="font-display text-2xl text-ink sm:text-3xl"
          >
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-600">
            Quick answers about delivery, authenticity, and ordering with The
            Rare Scents.
          </p>
        </div>

        <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
          {FAQS.map((item, index) => {
            const open = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;

            return (
              <div key={item.question}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                    className={`flex w-full items-center justify-between gap-4 py-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold ${
                      open ? "text-ink" : "text-ink/90 hover:text-ink"
                    }`}
                  >
                    <span className="font-display text-lg sm:text-xl">
                      {item.question}
                    </span>
                    <ChevronIcon open={open} />
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-10 text-sm leading-relaxed text-neutral-600 sm:text-base">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
