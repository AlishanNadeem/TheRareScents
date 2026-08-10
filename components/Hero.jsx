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
        className="object-cover object-center"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-ink/75" aria-hidden="true" />

      <motion.div
        className="relative mx-auto flex max-w-6xl flex-col items-center px-5 py-14 text-center sm:px-6 sm:py-24 md:py-28"
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
            className="h-auto w-20 sm:w-28 md:w-32"
          />
        </motion.div>

        <motion.h1
          variants={reduceMotion ? undefined : heroItemVariants}
          className="mt-5 max-w-3xl font-display text-[1.65rem] leading-snug text-white sm:mt-8 sm:text-4xl md:text-5xl"
        >
          Buy Original Perfumes Online in Pakistan
        </motion.h1>

        <motion.p
          variants={reduceMotion ? undefined : heroItemVariants}
          className="mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:mt-6 sm:max-w-2xl sm:text-base md:text-lg"
        >
          <span className="sm:hidden">
            Rare oils &amp; exclusive blends — curated and delivered across
            Pakistan.
          </span>
          <span className="hidden sm:inline">{siteConfig.tagline}</span>
        </motion.p>

        <motion.div variants={reduceMotion ? undefined : heroItemVariants}>
          <Link
            href="/products"
            className="mt-7 inline-flex items-center justify-center rounded-full bg-gold px-7 py-2.5 text-xs font-semibold uppercase tracking-wide text-espresso shadow-sm transition duration-300 ease-out hover:scale-[1.03] hover:bg-[#d4af5a] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink motion-reduce:hover:scale-100 sm:mt-9 sm:px-8 sm:py-3 sm:text-sm md:text-base"
          >
            Shop The Collection
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
