"use client";

import { motion } from "framer-motion";
import TextReveal from "@/components/ui/TextReveal";

const STEPS = [
  {
    title: "Discover",
    desc: "We map your operation end-to-end and locate the highest-leverage points for intelligence.",
  },
  {
    title: "Design",
    desc: "Agents, architecture and integrations — blueprinted around how your business actually runs.",
  },
  {
    title: "Build",
    desc: "Production-grade systems engineered in weeks, not quarters. You see progress every week.",
  },
  {
    title: "Deploy",
    desc: "Shipped into your stack with security, observability and guardrails from day one.",
  },
  {
    title: "Scale",
    desc: "What works gets expanded across teams, regions and workflows — compounding returns.",
  },
];

/**
 * Section 7 — How we work. A vertical journey: each step lights up as
 * it enters the frame, connected by a growing line of light.
 */
export default function Process() {
  return (
    <section id="process" className="relative bg-void py-32 md:py-44">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        {/* Sticky intro */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow mb-6">How We Work</p>
          <TextReveal
            text="From first call to fully autonomous."
            className="text-[clamp(2.2rem,5vw,4.5rem)] text-frost"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-6 max-w-md text-base leading-relaxed text-mist"
          >
            A tight, proven path. No discovery theatre, no endless decks —
            working systems, fast.
          </motion.p>
        </div>

        {/* Steps */}
        <ol className="relative">
          <div
            aria-hidden
            className="absolute bottom-6 left-[27px] top-6 w-px bg-white/[0.07]"
          />
          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex gap-8 pb-14 last:pb-0"
            >
              <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line bg-abyss font-display text-sm font-bold text-neon shadow-[0_0_0_6px_#04050a] transition-all duration-500 group-hover:border-neon/50 group-hover:shadow-[0_0_0_6px_#04050a,0_0_28px_-2px_rgba(56,212,255,0.5)]">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="pt-1.5">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-frost md:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-mist">
                  {step.desc}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
