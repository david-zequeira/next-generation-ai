"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  text: string;
  className?: string;
  /**
   * Classes applied to each animated word. Gradient text (background-clip)
   * must go here, not in `className` — the words are composited layers,
   * so a parent-level clip never paints through them.
   */
  wordClassName?: string;
  delay?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

const container: Variants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: { staggerChildren: 0.07, delayChildren: delay },
  }),
};

const word: Variants = {
  hidden: { y: "115%", rotate: 4 },
  visible: {
    y: 0,
    rotate: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Cinematic word-by-word reveal: each word rises out of a masked line,
 * staggered like a title card in a film.
 */
export default function TextReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  once = true,
  as: Tag = "h2",
}: TextRevealProps) {
  const words = text.split(" ");

  return (
    <motion.span
      variants={container}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.6 }}
      className="inline"
    >
      <Tag className={cn("display", className)}>
        {words.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
          >
            <motion.span
              variants={word}
              className={cn("inline-block will-change-transform", wordClassName)}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </Tag>
    </motion.span>
  );
}
