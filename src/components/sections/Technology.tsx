"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
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
 * Pastilla del Figma: 70 px de alto, radio completo, blanco al 10 %, borde de
 * 0,5 px en degradado #94b2fc→#586a96, disco #ecefff de 48 px con el logo
 * (≈ 36 px) y el nombre en Montserrat Medium 18. Medidas a 1920 (*-u-N).
 */
function LogoPill({ brand }: { brand: Brand }) {
  return (
    <span
      style={{ ["--ring-bg" as string]: "linear-gradient(90deg, #94b2fc, #586a96)", ["--ring-w" as string]: "0.5px" }}
      className="ring-conic group/pill mx-u-6 inline-flex h-u-70 shrink-0 cursor-default items-center gap-u-14 rounded-full bg-white/10 pl-u-11 pr-u-28 font-display fs-u-18 font-medium text-frost backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15"
    >
      <span className="flex size-u-48 items-center justify-center rounded-full bg-frost transition-transform duration-300 group-hover/pill:scale-105">
        <Image
          src={`${BASE}/logos/${brand.file}.svg`}
          alt=""
          width={36}
          height={36}
          className="size-u-36"
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
    <section id="technology" className="relative overflow-hidden border-t border-line bg-void pb-u-160 pt-u-130">
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading key={locale} eyebrow={t.eyebrow} title={[t.titleA, t.titleB]} sub={t.sub} gradientEyebrow subSize={18} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.2 }}
        className="relative mt-u-130 flex flex-col gap-u-24"
      >
        <MarqueeRow items={ROW_A} />
        <MarqueeRow items={ROW_B} reverse />
      </motion.div>
    </section>
  );
}
