"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/i18n/LocaleContext";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Trayectoria elíptica del punto de luz — la misma que dibuja la órbita. */
const ORBIT_PATH = "M 20 160 A 220 120 0 1 1 460 160 A 220 120 0 1 1 20 160";

function Step({
  n,
  title,
  desc,
  align = "left",
  accent = false,
  delay = 0,
}: {
  n: number;
  title: string;
  desc: string;
  align?: "left" | "right";
  accent?: boolean;
  delay?: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group w-full max-w-[250px]"
    >
      <div className="flex items-center justify-between gap-4 border-b border-pulse/25 pb-2.5">
        <span
          className={`font-display text-[15px] font-medium transition-colors duration-300 ${
            accent ? "text-neon" : "text-white group-hover:text-pulse"
          }`}
        >
          {title}
        </span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-[11px] font-bold ${
            accent ? "bg-white text-ink" : "bg-[#0d1a4d] text-white ring-1 ring-pulse/40"
          }`}
        >
          {n}
        </span>
      </div>
      <p className={`mt-3 text-[13px] leading-relaxed text-mist ${align === "right" ? "" : ""}`}>{desc}</p>
    </motion.li>
  );
}

/**
 * Sección 4 — «Cómo trabajamos» (Figma): el método como sistema en órbita.
 * El isotipo late en el centro, un punto de luz recorre la órbita y los
 * seis pasos se reparten alrededor; a los lados, las dos frases que
 * resumen la idea. En móvil los pasos se apilan en lista.
 */
export default function Ecosystem() {
  const { locale, dict } = useLocale();
  const t = dict.howWeWork;
  const s = t.steps;

  return (
    <section
      id="ecosystem"
      className="relative overflow-hidden border-y border-line bg-[#02040f] py-28 md:py-36"
    >
      {/* Cielo estrellado */}
      <div aria-hidden className="absolute inset-0">
        {Array.from({ length: 90 }).map((_, i) => (
          <span
            key={i}
            className="animate-twinkle absolute rounded-full bg-frost"
            style={{
              width: i % 7 === 0 ? 2 : 1,
              height: i % 7 === 0 ? 2 : 1,
              left: `${(i * 137.5) % 100}%`,
              top: `${(i * 73.3) % 100}%`,
              opacity: 0.2 + ((i * 7) % 10) / 20,
              animationDelay: `${(i % 11) * 0.4}s`,
            }}
          />
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/[0.12] blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-6" key={locale}>
        <p className="eyebrow text-center">{t.eyebrow}</p>

        {/* Escritorio: rejilla orbital */}
        <div className="mt-20 hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8">
          {/* Izquierda */}
          <div className="flex flex-col items-end gap-10">
            <ul className="flex w-full flex-col items-end gap-10">
              <Step n={6} title={s[5].title} desc={s[5].desc} delay={0.5} />
            </ul>
            <motion.h3
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="display w-full text-right text-[clamp(1.6rem,2.4vw,2.2rem)] font-semibold text-white"
            >
              {t.left}
            </motion.h3>
            <ul className="flex w-full flex-col items-end gap-10">
              <Step n={5} title={s[4].title} desc={s[4].desc} accent delay={0.4} />
            </ul>
          </div>

          {/* Centro: paso 1, órbita, paso 4 */}
          <div className="flex flex-col items-center gap-6">
            <ul className="flex justify-center">
              <Step n={1} title={s[0].title} desc={s[0].desc} />
            </ul>
            <Orbit ariaLabel={t.svgAria} />
            <ul className="flex justify-center">
              <Step n={4} title={s[3].title} desc={s[3].desc} delay={0.3} />
            </ul>
          </div>

          {/* Derecha */}
          <div className="flex flex-col items-start gap-10">
            <ul className="flex w-full flex-col items-start gap-10">
              <Step n={2} title={s[1].title} desc={s[1].desc} delay={0.1} />
            </ul>
            <motion.h3
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="display w-full text-left text-[clamp(1.6rem,2.4vw,2.2rem)] font-semibold text-white"
            >
              {t.right}
            </motion.h3>
            <ul className="flex w-full flex-col items-start gap-10">
              <Step n={3} title={s[2].title} desc={s[2].desc} delay={0.2} />
            </ul>
          </div>
        </div>

        {/* Móvil y tablet: órbita arriba, pasos en lista */}
        <div className="mt-14 lg:hidden">
          <h3 className="display text-center text-2xl font-semibold text-white">
            {t.left} <span className="text-pulse">·</span> {t.right}
          </h3>
          <div className="mx-auto mt-8 max-w-sm">
            <Orbit ariaLabel={t.svgAria} />
          </div>
          <ul className="mx-auto mt-10 grid max-w-2xl gap-8 sm:grid-cols-2">
            {s.map((step, i) => (
              <Step key={step.title} n={i + 1} title={step.title} desc={step.desc} accent={i === 4} delay={i * 0.06} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** El núcleo: isotipo dentro de un disco blanco que respira, con su órbita y su punto de luz. */
function Orbit({ ariaLabel }: { ariaLabel: string }) {
  return (
    <motion.svg
      viewBox="0 0 480 320"
      role="img"
      aria-label={ariaLabel}
      className="w-full max-w-[480px]"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <defs>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#94b2fc" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#1a4dff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="orbitLine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94b2fc" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#1a4dff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#94b2fc" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Halo */}
      <circle cx="240" cy="160" r="150" fill="url(#coreGlow)" />

      {/* Órbita inclinada */}
      <g transform="rotate(-18 240 160)">
        <path d={ORBIT_PATH} fill="none" stroke="url(#orbitLine)" strokeWidth="1.2" />
        <circle r="4" fill="#b8f21e">
          <animateMotion dur="9s" repeatCount="indefinite" path={ORBIT_PATH} />
        </circle>
        <circle r="9" fill="#b8f21e" opacity="0.25">
          <animateMotion dur="9s" repeatCount="indefinite" path={ORBIT_PATH} />
        </circle>
      </g>

      {/* Disco blanco que respira */}
      <motion.g
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "240px 160px" }}
      >
        <circle cx="240" cy="160" r="78" fill="#ffffff" opacity="0.08" />
        <circle cx="240" cy="160" r="66" fill="#f4f6ff" />
        <image href={`${BASE}/isotipo.png`} x="200" y="120" width="80" height="80" />
      </motion.g>
    </motion.svg>
  );
}
