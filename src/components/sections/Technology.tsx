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
 * Pastilla del Figma 1532:2424 («Rectangle 168…», «Ellipse 63…»): 55 px de
 * alto, radio completo, blanco al 10 %, trazo de 0,5 px rgba(148,178,252,.61),
 * disco blanco de 37 px a 9 del borde con el logo (≈ 26 px) y el nombre en
 * Montserrat Medium 16; padding derecho 27, hueco entre pastillas 10.
 * Medidas a 1920 (*-u-N).
 */
function LogoPill({ brand }: { brand: Brand }) {
  return (
    <span
      style={{ ["--ring-bg" as string]: "rgba(148,178,252,.61)", ["--ring-w" as string]: "0.5px" }}
      // Suelos más altos que el resto (44 / 30 / 20 / 13 px): a 1440 la escala 0,75 las dejaba diminutas
      className="ring-conic group/pill mx-[max(4px,5*var(--u))] inline-flex h-[max(44px,55*var(--u))] shrink-0 cursor-default items-center gap-[max(7px,9*var(--u))] rounded-full bg-white/10 pl-[max(7px,9*var(--u))] pr-[max(20px,27*var(--u))] font-display text-[max(13px,16*var(--u))] font-medium text-frost backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15"
    >
      <span className="flex size-[max(30px,37*var(--u))] items-center justify-center rounded-full bg-frost transition-transform duration-300 group-hover/pill:scale-105">
        <Image
          src={`${BASE}/logos/${brand.file}.svg`}
          alt=""
          width={36}
          height={36}
          className="size-[max(20px,26*var(--u))]"
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
    <section id="technology" className="relative overflow-hidden border-t border-line bg-void pb-u-87 pt-u-173">
      <div className="relative mx-auto max-w-[1920px] px-5 md:px-10 xl:px-[12.5%]">
        <SectionHeading key={locale} eyebrow={t.eyebrow} title={[t.titleA, t.titleB]} sub={t.sub} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.2 }}
        className="relative mt-u-123 flex flex-col gap-u-29"
      >
        <MarqueeRow items={ROW_A} />
        <MarqueeRow items={ROW_B} reverse />
      </motion.div>
    </section>
  );
}
