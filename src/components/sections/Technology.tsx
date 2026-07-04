"use client";

import { motion } from "framer-motion";
import TextReveal from "@/components/ui/TextReveal";

const ROW_A = ["OpenAI", "Anthropic", "Claude", "GPT", "n8n", "Supabase", "Firebase"];
const ROW_B = ["AWS", "Docker", "Cursor", "MCP", "LangChain", "Vercel", "Cloudflare"];

function LogoPill({ name }: { name: string }) {
  return (
    <span className="glass mx-2.5 inline-flex shrink-0 cursor-default items-center gap-3 rounded-full px-7 py-3.5 font-display text-sm font-semibold tracking-wide text-mist transition-colors duration-300 hover:text-frost md:px-9 md:py-4 md:text-base">
      <span className="h-1.5 w-1.5 rounded-full bg-neon/70" />
      {name}
    </span>
  );
}

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div
      className="flex overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div
        className={`flex w-max py-2 hover:[animation-play-state:paused] ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {doubled.map((name, i) => (
          <LogoPill key={`${name}-${i}`} name={name} />
        ))}
      </div>
    </div>
  );
}

/**
 * Section 8 — Technology. The stack drifts by as two counter-rotating
 * streams of glass capsules.
 */
export default function Technology() {
  return (
    <section className="relative overflow-hidden bg-abyss py-32 md:py-40">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-void to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-void to-transparent"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/10 blur-[140px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <p className="eyebrow mb-6">Technology</p>
        <TextReveal
          text="Built on the frontier."
          className="text-[clamp(2.2rem,5.5vw,4.75rem)] text-frost"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-mist"
        >
          We build with the same tools powering the world&apos;s most advanced
          AI products — and swap them the moment something better exists.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.2 }}
        className="relative mt-16 space-y-5 md:mt-20"
      >
        <MarqueeRow items={ROW_A} />
        <MarqueeRow items={ROW_B} reverse />
      </motion.div>
    </section>
  );
}
