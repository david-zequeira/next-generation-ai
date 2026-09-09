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
  Plug,
  Receipt,
  Repeat,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";
import { trackEvent } from "@/lib/track";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Iconos de las cuatro fichas de cada pestaña — los textos, en el diccionario.
 * La pestaña «Diseño web» usa los SVG del Figma (public/icons/services, exportados
 * del propio diseño: azul #1a4dff con acentos lima). Las otras dos pestañas no
 * tienen diseño todavía y siguen con lucide.
 */
type TileIcon = LucideIcon | string;
const TILE_ICONS: TileIcon[][] = [
  ["brand-experience", "luxury-design", "high-performance", "conversion-growth"],
  [Contact, CalendarDays, Receipt, Repeat],
  [Bot, Plug, BarChart3, ShieldCheck],
];

/** Ficha del Figma: 159×159, radio 15, degradado navy→abyss con brillo arriba a la derecha. */
function Tile({ icon, label, index }: { icon: TileIcon; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  // Inclinación sutil hacia el cursor
  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    const rect = el?.getBoundingClientRect();
    if (!el || !rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
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
          ["--gx" as string]: "88%",
          ["--gy" as string]: "8%",
          ["--gr" as string]: "56%",
          ["--go" as string]: "0.5",
        }}
        className="glow-inset group flex aspect-square flex-col items-center justify-between rounded-u-15 bg-[linear-gradient(180deg,#101a3e_0%,#050b21_61%)] px-u-12 pb-u-14 pt-u-30 text-center transition-shadow duration-300 hover:shadow-[0_18px_44px_-20px_rgba(26,77,255,0.8)]"
      >
        {typeof icon === "string" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${BASE}/icons/services/${icon}.svg`} alt="" className="size-u-50" draggable={false} />
        ) : (
          (() => {
            const Icon = icon;
            return <Icon className="size-u-46 text-pulse transition-colors duration-300 group-hover:text-neon" strokeWidth={1.3} />;
          })()
        )}
        <span className="fs-u-12 lh-u-14 text-frost">{label}</span>
      </div>
    </motion.div>
  );
}

/**
 * Sección 3 — Servicios (Figma): cabecera centrada, selector de pestañas en
 * pastilla con borde cónico y una gran tarjeta azul marino de base recta con
 * el argumento a la izquierda y la "tableta" con las cuatro fichas a la derecha.
 * Medidas en px del Figma a 1920 (utilidades *-u-N).
 */
export default function Services() {
  const { locale, dict } = useLocale();
  const t = dict.services;
  const [tab, setTab] = useState(0);
  const current = t.tabs[tab];

  return (
    <section id="services" className="relative border-b border-line bg-void pt-u-40">
      <div className="relative mx-auto max-w-[1920px] px-5 md:px-10 xl:px-[12.5%]">
        <SectionHeading key={locale} eyebrow={t.eyebrow} title={t.title} sub={t.sub} />

        {/* Selector de pestañas — Figma: 798×95, borde cónico de 0,5 px, activa blanca 227×64 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          role="tablist"
          className="ring-conic mx-auto mt-u-63 flex h-u-95 w-fit max-w-full items-center gap-u-8 overflow-x-auto rounded-full px-u-16 [scrollbar-width:none]"
        >
          {t.tabs.map((item, i) => (
            <button
              key={item.label}
              role="tab"
              type="button"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
              className={cn(
                "relative h-u-64 shrink-0 cursor-pointer rounded-full px-u-44 font-display fs-u-18 font-semibold transition-colors duration-300",
                tab === i ? "text-black" : "text-white hover:text-cloud"
              )}
            >
              {tab === i && (
                <motion.span
                  layoutId="services-tab"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-full bg-white"
                />
              )}
              <span className="relative">{item.label}</span>
            </button>
          ))}
        </motion.div>

        {/* La tarjeta — Figma: 1440×752, radio 35 solo arriba, degradado #101a3e→#1a3ba9,
            borde cónico de 0,5 px y sombra azul de 150 px */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ ["--ring-w" as string]: "0.5px" }}
          // Figma: texto a 91 del borde, tableta a 92 arriba y 87 abajo (no toca la base de la tarjeta)
          className="ring-conic relative mt-u-68 rounded-t-u-35 bg-[linear-gradient(180deg,#101a3e_0%,#1a3ba9_100%)] px-6 pb-u-87 pt-u-92 shadow-[0_0_150px_rgba(26,77,255,0.5)] md:px-u-91"
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_1.13fr] lg:items-start lg:gap-u-44">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${locale}-${tab}`}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col lg:pt-u-12"
              >
                <h3 className="max-w-u-569 font-display fs-u-38 lh-u-47 font-semibold text-white text-balance">
                  {current.title}
                </h3>
                <p className="mt-u-26 max-w-u-569 fs-u-20 lh-u-28 font-light text-cloud">{current.desc}</p>

                <ul className="mt-u-56 grid gap-x-u-48 gap-y-u-40 sm:grid-cols-2">
                  {current.features.map((f) => (
                    <li key={f.title} className="flex gap-u-16">
                      <CheckCircle2 className="mt-px size-u-24 shrink-0 fill-neon text-space" strokeWidth={2} />
                      <div>
                        <p className="font-display fs-u-18 lh-u-24 font-semibold text-white">{f.title}</p>
                        <p className="mt-u-8 fs-u-15 lh-u-22 text-white">{f.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col gap-5 pt-u-64 sm:flex-row sm:items-center sm:gap-u-40">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("ng:open-chat"))}
                    className="group inline-flex cursor-pointer items-center gap-u-8 font-display fs-u-18 font-medium text-mint transition-colors hover:text-white"
                  >
                    {t.link}
                    <ArrowRight className="size-u-18 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                  {/* Figma «Cotizar proyecto»: 176×49, radio 16, #c7d7ff, SemiBold 15 */}
                  <Link
                    href="/contacto"
                    onClick={() => trackEvent("cta_services_home")}
                    className="btn-light-sm inline-flex h-u-49 cursor-pointer items-center justify-center rounded-u-16 px-u-24 font-display fs-u-15 font-semibold transition-all duration-300 active:scale-[0.97]"
                  >
                    {t.cta}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* La "tableta" azul — Figma: 645×573, radio 25, degradado #1a4dff 28 % → #294296,
                dos brillos radiales (uno arriba a la derecha con blur 40, otro grande a la
                izquierda) y dentro el dispositivo claro (399×511, radio 20 arriba) que
                asoma recortado por la base */}
            <div className="relative flex h-u-573 w-full items-start justify-center overflow-hidden rounded-u-25 bg-[linear-gradient(180deg,#1a4dff_28%,#294296_100%)] px-u-60 pt-u-75 md:px-u-123">
              <div
                aria-hidden
                className="pointer-events-none absolute aspect-square w-[109%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#1a4dff_0%,rgba(46,107,255,0.12)_66%,rgba(46,107,255,0)_100%)] blur-[20px]"
                style={{ left: "75%", top: "15%" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute aspect-square w-[169%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#1a4dff_0%,rgba(46,107,255,0.12)_66%,rgba(46,107,255,0)_100%)] blur-[4px]"
                style={{ left: "-5%", top: "63%" }}
              />
              <div className="relative min-h-u-511 w-full max-w-u-399 rounded-t-u-20 border-[0.5px] border-white bg-[linear-gradient(180deg,#ffffff_0%,#94b2fc_47%,#7a93d0_100%)] shadow-[0_0_50px_-13px_rgba(255,255,255,0.59)]">
                {/* Barra superior con la cámara */}
                <div className="flex h-u-74 items-center justify-center rounded-t-u-20 bg-white/50">
                  <span className="flex size-u-15 items-center justify-center rounded-full border border-electric">
                    <span className="size-u-9 rounded-full bg-electric" />
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`tiles-${locale}-${tab}`}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="grid grid-cols-2 gap-u-18 px-u-30 pb-u-30 pt-u-40"
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
