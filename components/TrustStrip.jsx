"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { siteConfig } from "@/lib/siteConfig";

const trustItems = [
  {
    title: "Cash on Delivery",
    description: `Pay when it arrives, anywhere in ${siteConfig.country}.`,
    icon: (
      <path
        d="M4 7h16v10H4V7Zm0 0 8-4 8 4M12 12.2a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    title: "100% Original",
    description: "Every bottle is authentic, sourced and sealed with care.",
    icon: (
      <path
        d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3Zm-2.6 9.2 1.9 1.9 3.3-3.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    title: "Fast Delivery",
    description: `Same-day dispatch in ${siteConfig.primaryCity}, nationwide shipping across ${siteConfig.country}.`,
    icon: (
      <path
        d="M3 7h11v9H3V7Zm11 3h4l3 3v3h-7v-6ZM6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    title: "Order on WhatsApp",
    description: "Message us anytime — quick, easy, no account needed.",
    icon: (
      <path
        d="M20 12a8 8 0 1 1-3.2-6.4M20 4l-4 1 1-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
];

export default function TrustStrip() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <Reveal>
          <h2 className="text-center font-display text-2xl text-ink sm:text-3xl">
            Why Shop With Us
          </h2>
        </Reveal>

        <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <StaggerItem key={item.title}>
              <div className="rounded-xl border border-ink/10 bg-white p-6 text-center shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </svg>
                </span>
                <h3 className="mt-4 text-base font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-600">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
