"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import TextReveal from "@/components/ui/TextReveal";
import { useLocale } from "@/i18n/LocaleContext";

type Brand = { name: string; file: string };

/**
 * Los logos son los originales del Figma («Asenix Desktop» › frame 557:3001),
 * exportados a SVG en public/logos. Dos filas, como en el diseño.
 *
 * Twilio es la excepción: en el Figma su pastilla queda fuera del marco y la
 * exportación la recorta, así que su marca viene de Simple Icons, que publica
 * los logotipos oficiales, en el rojo de marca #F22F46.
 */
const ROW_A: Brand[] = [
  { name: "LangChain", file: "langchain" },
  { name: "Claude", file: "claude" },
  { name: "MCP", file: "mcp" },
  { name: "n8n", file: "n8n" },
  { name: "Supabase", file: "supabase" },
  { name: "Firebase", file: "firebase" },
  { name: "AWS", file: "aws" },
  { name: "Vercel", file: "vercel" },
  { name: "Figma", file: "figma" },
  { name: "GitHub", file: "github" },
];
const ROW_B: Brand[] = [
  { name: "Twilio", file: "twilio" },
  { name: "Redis", file: "redis" },
  { name: "Python", file: "python" },
  { name: "Docker", file: "docker" },
  { name: "Cloudflare", file: "cloudflare" },
  { name: "PostgreSQL", file: "postgresql" },
  { name: "Node.js", file: "nodejs" },
  { name: "React", file: "react" },
  { name: "Next.js", file: "nextjs" },
  { name: "TypeScript", file: "typescript" },
];

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Pastilla como en Figma: cristal oscuro con borde azul pulso, disco blanco
 * con el logo original y el nombre en blanco.
 */
function LogoPill({ brand }: { brand: Brand }) {
  return (
    <span className="group/pill mx-2.5 inline-flex shrink-0 cursor-default items-center gap-3.5 rounded-full border border-pulse/40 bg-[linear-gradient(135deg,rgba(238,242,255,0.16),rgba(154,165,192,0.08))] py-2.5 pl-2.5 pr-7 font-display text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_34px_-20px_rgba(0,0,0,0.9)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-pulse/80 hover:bg-[linear-gradient(135deg,rgba(238,242,255,0.24),rgba(154,165,192,0.12))] md:py-3 md:pl-3 md:pr-8 md:text-base">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_rgba(148,178,252,0.25)] transition-transform duration-300 group-hover/pill:scale-105">
        <Image
          src={`${BASE}/logos/${brand.file}.svg`}
          alt=""
          width={40}
          height={40}
          className="h-10 w-10"
          draggable={false}
          // Carga inmediata a propósito: son 19 SVG de 1–2 KB dentro de una
          // cinta que no para de moverse. Con la carga diferida de next/image
          // los discos se quedaban en blanco.
          loading="eager"
        />
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
 * pastillas de cristal sobre el azul noche, en sentidos opuestos.
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
