"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE_OUT, fadeUpVariants } from "@/lib/motion";

/**
 * Scroll-triggered fade + slight upward slide. Animates once.
 * Skips animation when prefers-reduced-motion is set.
 */
export function Reveal({ children, className, delay = 0 }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants =
    delay > 0
      ? {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: DURATION, ease: EASE_OUT, delay },
          },
        }
      : fadeUpVariants;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -32px 0px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

/**
 * Parent for staggered grid/list entrances. Pair with StaggerItem children.
 */
export function Stagger({ children, className, stagger = 0.08 }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -32px 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={fadeUpVariants}>
      {children}
    </motion.div>
  );
}
