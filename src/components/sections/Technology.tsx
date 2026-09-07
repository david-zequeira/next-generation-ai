"use client";

import { motion } from "framer-motion";
import TextReveal from "@/components/ui/TextReveal";
import { useLocale } from "@/i18n/LocaleContext";

type Brand = { name: string; mark: string; color: string };

const ROW_A: Brand[] = [
  { name: "LangChain", mark: "Lc", color: "#1c3c3c" },
  { name: "Claude", mark: "✳", color: "#d97757" },
  { name: "MCP", mark: "⌘", color: "#111111" },
  { name: "n8n", mark: "n8n", color: "#ea4b71" },
  { name: "Supabase", mark: "⚡", color: "#3ecf8e" },
  { name: "Firebase", mark: "🔥", color: "#ffa000" },
  { name: "AWS", mark: "aws", color: "#232f3e" },
  { name: "Vercel", mark: "▲", color: "#000000" },
  { name: "Figma", mark: "F", color: "#a259ff" },
];
const ROW_B: Brand[] = [
  { name: "Twilio", mark: "Tw", color: "#f22f46" },
  { name: "Redis", mark: "R", color: "#dc382d" },
  { name: "PostgreSQL", mark: "Pg", color: "#336791" },
  { name: "Node.js", mark: "JS", color: "#3c873a" },
  { name: "React", mark: "⚛", color: "#61dafb" },
  { name: "Next.js", mark: "N", color: "#000000" },
  { name: "TypeScript", mark: "TS", color: "#3178c6" },
  { name: "Python", mark: "Py", color: "#3776ab" },
  { name: "Docker", mark: "🐳", color: "#2496ed" },
];

/** Pastilla clara con la marca — el "logo" es un sello redondo de su color. */
function LogoPill({ brand }: { brand: Brand }) {
  return (
    <span className="mx-2.5 inline-flex shrink-0 cursor-default items-center gap-3 rounded-full border border-white/70 bg-paper py-2 pl-2 pr-6 font-display text-sm font-medium text-ink shadow-[0_10px_30px_-18px_rgba(0,0,0,0.9)] transition-transform duration-300 hover:-translate-y-0.5 md:py-2.5 md:pl-2.5 md:pr-7 md:text-[15px]">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-white ring-2 ring-white"
        style={{ background: brand.color }}
      >
        {brand.mark}
      </span>
      {brand.name}
    </span>
  );
}

function MarqueeRow({ items, reverse = false }: { items: Brand[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div
      className="flex overflow-hidden"
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div
        className={`flex w-max py-2 hover:[animation-play-state:paused] ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {doubled.map((b, i) => (
          <LogoPill key={`${b.name}-${i}`} brand={b} />
        ))}
      </div>
    </div>
  );
}

/**
 * Sección 6 — Tecnología (Figma): el stack pasa en dos corrientes de
 * pastillas claras sobre el azul noche, en sentidos opuestos.
 */
export default function Technology() {
  const { locale, dict } = useLocale();
  const t = dict.technology;

  return (
    <section className="relative overflow-hidden border-t border-line bg-void py-28 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[60%] h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-electric/[0.08] blur-[140px]"
      />
      <div className="relative mx-auto max-w-7xl px-6 text-center" key={locale}>
        <p className="eyebrow mb-6">{t.eyebrow}</p>
        <TextReveal text={t.titleA} className="block text-[clamp(2rem,4.6vw,3.4rem)] text-white" />
        <TextReveal text={t.titleB} delay={0.2} className="block text-[clamp(2rem,4.6vw,3.4rem)] text-white" />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-mist md:text-lg"
        >
          {t.sub}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.2 }}
        className="relative mt-16 space-y-4 md:mt-20"
      >
        <MarqueeRow items={ROW_A} />
        <MarqueeRow items={ROW_B} reverse />
      </motion.div>
    </section>
  );
}
