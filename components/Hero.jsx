"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/siteConfig";
import { heroContainerVariants, heroItemVariants } from "@/lib/motion";

export default function Hero() {
  const reduceMotion = useReducedMotion();

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
      <div className="absolute inset-0 bg-ink/75" aria-hidden="true" />

      <motion.div
        className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center sm:py-32"
        initial={reduceMotion ? false : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
        variants={reduceMotion ? undefined : heroContainerVariants}
      >
        <motion.div variants={reduceMotion ? undefined : heroItemVariants}>
          <Image
            src="/logo.png"
            alt={siteConfig.name}
            width={160}
            height={160}
            priority
            className="h-auto w-28 sm:w-32"
          />
        </motion.div>

        <motion.h1
          variants={reduceMotion ? undefined : heroItemVariants}
          className="mt-8 max-w-3xl font-display text-3xl leading-tight text-white sm:text-5xl"
        >
          Buy Original Perfumes Online in Pakistan
        </motion.h1>

        <motion.p
          variants={reduceMotion ? undefined : heroItemVariants}
          className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg"
        >
          {siteConfig.tagline}
        </motion.p>

        <motion.div variants={reduceMotion ? undefined : heroItemVariants}>
          <Link
            href="/products"
            className="mt-9 inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-wide text-espresso shadow-sm transition duration-300 ease-out hover:scale-[1.03] hover:bg-[#d4af5a] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink motion-reduce:hover:scale-100 sm:text-base"
          >
            Shop The Collection
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
