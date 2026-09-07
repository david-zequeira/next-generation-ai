"use client";

import { useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarDays,
  CheckCircle2,
  Contact,
  Gauge,
  Gem,
  PenTool,
  Plug,
  Receipt,
  Repeat,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import TextReveal from "@/components/ui/TextReveal";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";
import { trackEvent } from "@/lib/track";

/** Iconos de las cuatro fichas de cada pestaña — los textos, en el diccionario. */
const TILE_ICONS: LucideIcon[][] = [
  [PenTool, Gem, Gauge, TrendingUp],
  [Contact, CalendarDays, Receipt, Repeat],
  [Bot, Plug, BarChart3, ShieldCheck],
];

function Tile({ icon: Icon, label, index }: { icon: LucideIcon; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  // Luz interior que sigue al cursor + inclinación sutil hacia él
  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    const rect = el?.getBoundingClientRect();
    if (!el || !rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    el.style.setProperty("--rx", `${(0.5 - py) * 8}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 8}deg`);
  };
  const onMouseLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ duration: 0.55, delay: 0.08 * index, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: "700px" }}
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
          transformStyle: "preserve-3d",
        }}
        className="group relative flex aspect-square flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-pulse/25 bg-[#070f2c]/90 p-4 text-center transition-[border-color,box-shadow] duration-300 hover:border-pulse/60 hover:shadow-[0_18px_44px_-20px_rgba(26,77,255,0.8)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(180px circle at var(--mx, 50%) var(--my, 50%), rgba(148,178,252,0.22), transparent 60%)",
          }}
        />
        <div className="conic-ring relative flex h-12 w-12 items-center justify-center rounded-xl">
          <Icon className="h-7 w-7 text-pulse transition-colors duration-300 group-hover:text-neon" strokeWidth={1.4} />
        </div>
        <span className="relative text-[11px] leading-snug text-frost/85 md:text-xs">{label}</span>
      </div>
    </motion.div>
  );
}

/**
 * Sección 3 — Servicios (Figma): cabecera centrada, selector de pestañas en
 * pastilla y una gran tarjeta azul marino con el argumento a la izquierda y
 * la "tableta" con las cuatro fichas a la derecha.
 */
export default function Services() {
  const { locale, dict } = useLocale();
  const t = dict.services;
  const [tab, setTab] = useState(0);
  const current = t.tabs[tab];

  return (
    <section id="services" className="relative overflow-hidden bg-void pb-28 pt-8 md:pb-40">
      {/* Bruma azul detrás de la tarjeta — el brillo del Figma */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[45%] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-electric/[0.09] blur-[140px]"
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center" key={locale}>
          <p className="eyebrow mb-6">{t.eyebrow}</p>
          <TextReveal text={t.title} className="text-[clamp(2rem,4.6vw,3.4rem)] text-white" />
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

        {/* Selector de pestañas */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          role="tablist"
          className="mx-auto mt-12 flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full border border-pulse/30 bg-gradient-to-r from-[#0a1440] to-[#050a1f] p-1.5 [scrollbar-width:none]"
        >
          {t.tabs.map((item, i) => (
            <button
              key={item.label}
              role="tab"
              type="button"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
              className={cn(
                "relative shrink-0 cursor-pointer rounded-full px-6 py-3 font-display text-sm font-semibold transition-colors duration-300 md:px-9",
                tab === i ? "text-white" : "text-frost/80 hover:text-white"
              )}
            >
              {tab === i && (
                <motion.span
                  layoutId="services-tab"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-full border border-pulse/50 bg-gradient-to-b from-[#0b1a52] to-[#0a1440] shadow-[0_10px_30px_-14px_rgba(26,77,255,0.9)]"
                />
              )}
              <span className="relative">{item.label}</span>
            </button>
          ))}
        </motion.div>

        {/* La tarjeta */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="card-navy relative mt-10 overflow-hidden rounded-[28px] p-6 md:mt-14 md:p-12"
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${locale}-${tab}`}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col"
              >
                <h3 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-white">
                  {current.title}
                </h3>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-mist md:text-lg">
                  {current.desc}
                </p>

                <ul className="mt-8 grid gap-x-6 gap-y-6 sm:grid-cols-2">
                  {current.features.map((f) => (
                    <li key={f.title} className="flex gap-3">
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 fill-neon text-[#0d1739]"
                        strokeWidth={2}
                      />
                      <div>
                        <p className="font-display text-sm font-semibold text-white">{f.title}</p>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-mist">{f.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col gap-5 pt-10 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("ng:open-chat"))}
                    className="group inline-flex cursor-pointer items-center gap-2 font-display text-sm font-medium text-neon transition-colors hover:text-white"
                  >
                    {t.link}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                  <Link
                    href="/contacto"
                    onClick={() => trackEvent("cta_services_home")}
                    className="btn-light inline-flex h-12 cursor-pointer items-center justify-center rounded-full px-7 font-display text-sm font-semibold transition-all duration-300 active:scale-[0.97]"
                  >
                    {t.cta}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* La "tableta" azul con las cuatro fichas */}
            <div className="card-blue relative flex items-center justify-center overflow-hidden rounded-3xl p-6 md:p-10">
              <div
                aria-hidden
                className="animate-float-slow pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/20 blur-[90px]"
              />
              <div className="relative w-full max-w-[380px] rounded-[26px] border border-pulse/50 bg-[#0b1435]/85 p-4 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur-md md:p-5">
                <div className="mb-4 flex justify-center border-b border-pulse/25 pb-3">
                  <span className="h-2.5 w-2.5 rounded-full border border-pulse/70 bg-pulse/20" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`tiles-${locale}-${tab}`}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="grid grid-cols-2 gap-3 md:gap-4"
                  >
                    {current.tiles.map((label, i) => (
                      <Tile key={label} icon={TILE_ICONS[tab][i]} label={label} index={i} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
