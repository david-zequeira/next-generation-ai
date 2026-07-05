"use client";

import { motion } from "framer-motion";
import TextReveal from "@/components/ui/TextReveal";
import { useLocale } from "@/i18n/LocaleContext";

type Testimonial = { quote: string; name: string; role: string };

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="glass mx-3 flex w-[320px] shrink-0 cursor-default flex-col justify-between rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(148,170,255,0.3)] md:w-[420px] md:p-8">
      <blockquote className="text-[15px] leading-relaxed text-frost/90">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-7 flex items-center gap-3.5">
        <span
          aria-hidden
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-electric to-pulse font-display text-sm font-bold text-white"
        >
          {t.name.charAt(0)}
        </span>
        <div>
          <p className="font-display text-sm font-semibold text-frost">{t.name}</p>
          <p className="mt-0.5 text-xs text-mist">{t.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * Section 9 — Testimonials. A slow, elegant stream of glass cards.
 * Hover pauses the drift.
 */
export default function Testimonials() {
  const { locale, dict } = useLocale();
  const t = dict.testimonials;
  const doubled = [...t.items, ...t.items];

  return (
    <section className="relative bg-void py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-6 text-center" key={locale}>
        <p className="eyebrow mb-6">{t.eyebrow}</p>
        <TextReveal
          text={t.title}
          className="text-[clamp(2.2rem,5.5vw,4.75rem)] text-frost"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-16 flex overflow-hidden md:mt-20"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee py-4 hover:[animation-play-state:paused]">
          {doubled.map((item, i) => (
            <Card key={`${item.name}-${i}`} t={item} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
