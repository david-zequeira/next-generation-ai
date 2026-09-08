"use client";

import { motion } from "framer-motion";
import {
  AudioLines,
  Building2,
  CalendarDays,
  ChevronRight,
  Headset,
  HeartPulse,
  MessagesSquare,
  Phone,
  Receipt,
  Repeat,
  ShoppingBag,
  Sparkles,
  UserRound,
  Users,
  UtensilsCrossed,
  X,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const EASE = [0.16, 1, 0.3, 1] as const;

/* ——— Piezas comunes (medidas en px del Figma a 1920, utilidades *-u-N) ——— */

/** Etiqueta de producto — Figma: 243×72, radio 30, navy→abyss con borde azul y brillo. */
function Tag({ children }: { children: string }) {
  return (
    <span className="tag-pill inline-flex h-u-72 items-center rounded-u-30 px-u-40 font-display fs-u-18 font-semibold">
      {children}
    </span>
  );
}

/** Viñetas — Figma: chevron lima de trazo grueso, Montserrat Medium 16/35 blanco. */
function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-u-40 grid gap-x-u-24 sm:grid-cols-2">
      {items.map((b) => (
        <li key={b} className="flex items-center gap-u-10 fs-u-16 lh-u-35 font-medium text-white">
          <ChevronRight className="size-u-14 shrink-0 text-neon" strokeWidth={3} />
          {b}
        </li>
      ))}
    </ul>
  );
}

/**
 * Nota al pie — Figma: icono lineal de 60 px (lima y azul claro) y texto
 * Montserrat 24/24 en azul de marca. Los iconos animados los enviará la
 * diseñadora; de momento, lucide.
 */
function Note({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <p className="mt-u-44 flex items-center gap-u-16 font-display fs-u-24 lh-u-24 text-electric">
      <span className="flex size-u-60 shrink-0 items-center justify-center">
        <Icon className="size-u-44 text-neon" strokeWidth={1.4} />
      </span>
      <span className="max-w-u-340 text-balance">{children}</span>
    </p>
  );
}

function Copy({
  tag,
  title,
  desc,
  bullets,
  note,
  noteIcon,
}: {
  tag: string;
  title: string;
  desc: string;
  bullets: string[];
  note: string;
  noteIcon: LucideIcon;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <Tag>{tag}</Tag>
      {/* Figma: Montserrat Regular 45/49, #f1f3fe, ancho 704 */}
      <h3 className="mt-u-53 max-w-u-704 font-display fs-u-45 lh-u-49 font-normal text-paper text-balance">{title}</h3>
      <p className="mt-u-14 max-w-u-704 fs-u-20 lh-u-30 text-cloud/80">{desc}</p>
      <Bullets items={bullets} />
      <Note icon={noteIcon}>{note}</Note>
    </motion.div>
  );
}

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 36, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-12%" },
  transition: { duration: 1, delay, ease: EASE },
});

/** Borde de 1,5 px en degradado azul (Figma: #6994ff → #1a4dff) para las tres maquetas. */
const ringStyle = (angle: number) => ({
  ["--ring-w" as string]: "1.5px",
  ["--ring-bg" as string]: `linear-gradient(${angle}deg, #6994ff 0%, #1a4dff 100%)`,
});

/* ——— 1. AI Concierge: el chat, escribiéndose solo ——— */

function ChatMock({ t }: { t: { name: string; status: string; msgs: string[]; placeholder: string } }) {
  const bubble = (i: number) => ({
    initial: { opacity: 0, y: 12, scale: 0.96 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true },
    transition: { duration: 0.5, delay: 0.5 + i * 0.55, ease: EASE },
  });
  return (
    <motion.div
      {...reveal(0.15)}
      style={ringStyle(0)}
      // Figma: 524×573, radio 30, degradado #0a1540→#1a4dff
      className="ring-conic relative mx-auto w-full max-w-u-524 overflow-hidden rounded-u-30 bg-[linear-gradient(180deg,#0a1540_0%,#1a4dff_100%)] shadow-[0_50px_100px_-40px_rgba(26,77,255,0.7)]"
    >
      {/* Cabecera: 109 px, azul al 75 %, avatar blanco de 68 */}
      <div className="flex h-u-109 items-center justify-between rounded-t-u-30 bg-electric/75 px-u-33">
        <div className="flex items-center gap-u-22">
          <span className="flex size-u-68 items-center justify-center rounded-full bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BASE}/isotipo.png`} alt="" className="size-u-36" />
          </span>
          <div>
            <p className="font-display fs-u-24 font-medium leading-none text-white">{t.name}</p>
            <p className="mt-u-6 flex items-center gap-u-8 fs-u-15 font-light text-frost">
              <span className="size-u-8 rounded-full bg-neon animate-pulse-glow" />
              {t.status}
            </p>
          </div>
        </div>
        <X className="size-u-16 text-white" strokeWidth={2} />
      </div>
      {/* Conversación: burbujas azules con la esquina inferior derecha recta (25 25 5 25) */}
      <div className="flex flex-col gap-u-30 px-u-45 pb-u-47 pt-u-48">
        <motion.p
          {...bubble(0)}
          className="ml-auto w-fit rounded-u-25 rounded-br-[5px] bg-electric px-u-24 py-u-20 fs-u-18 leading-none text-frost"
        >
          {t.msgs[0]}
        </motion.p>
        <motion.p {...bubble(1)} className="max-w-u-437 fs-u-18 lh-u-24 text-frost">
          {t.msgs[1]}
        </motion.p>
        <motion.p
          {...bubble(2)}
          className="ml-auto w-fit max-w-u-320 rounded-u-25 rounded-br-[5px] bg-electric px-u-24 py-u-14 text-right fs-u-18 lh-u-21 text-frost"
        >
          {t.msgs[2]}
        </motion.p>
        {/* Campo de texto: 437×73, radio 25, borde #c7d7ff, botón blanco de 43 */}
        <motion.div
          {...bubble(3)}
          className="mt-u-30 flex h-u-73 items-center justify-between rounded-u-25 border border-cloud pl-u-32 pr-u-15"
        >
          <span className="fs-u-18 text-white/80">{t.placeholder}</span>
          <span className="flex size-u-43 items-center justify-center rounded-full bg-white">
            <Sparkles className="size-u-20 fill-electric text-electric" strokeWidth={1.8} />
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ——— 2. Voz: el orbe verde con sus anillos y las etiquetas flotando ——— */

const SECTOR_ICONS: LucideIcon[] = [ShoppingBag, Building2, UtensilsCrossed, HeartPulse];

function VoiceMock({ t }: { t: { chips: string[]; sectors: string[] } }) {
  return (
    <motion.div
      {...reveal(0.15)}
      style={ringStyle(180)}
      // Figma: 522×573, radio 25, radial #1a4dff → #101837
      className="ring-conic relative mx-auto w-full max-w-u-522 rounded-u-25 bg-[radial-gradient(55%_45%_at_50%_50%,#1a4dff_0%,#101837_100%)] px-u-44 pb-u-40 pt-u-45 shadow-[0_50px_100px_-40px_rgba(26,77,255,0.6)]"
    >
      <div className="relative flex flex-col items-center">
        {/* Etiquetas flotando — Figma: 55 px de alto, radio 25, #101a3e, Montserrat 16 */}
        <div className="relative z-10 -mb-[max(24px,40*var(--u))] flex flex-wrap justify-center gap-u-12">
          {t.chips.map((c, i) => (
            <motion.span
              key={c}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.2, ease: EASE }}
              className={cn(
                "animate-float flex h-u-55 items-center gap-u-10 rounded-u-25 bg-space px-u-20 fs-u-16 leading-tight text-white",
                i === 0 && "sm:-translate-y-3"
              )}
              style={{ animationDelay: `${i * 0.7}s` }}
            >
              <AudioLines className="size-u-20 text-white" strokeWidth={2} />
              {c}
            </motion.span>
          ))}
        </div>
        {/* El orbe: verde #1cfcb9 con halos azules */}
        <div className="relative mb-u-30 flex size-u-300 items-center justify-center">
          <span className="animate-ring absolute inset-0 rounded-full bg-electric/25" />
          <span className="animate-ring absolute inset-0 rounded-full bg-electric/20" style={{ animationDelay: "1.4s" }} />
          <span className="absolute inset-[8%] rounded-full bg-electric/25 blur-md" />
          <span className="absolute inset-[16%] rounded-full bg-electric/40 blur-sm" />
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex size-u-200 items-center justify-center rounded-full bg-mint shadow-[0_0_60px_-10px_rgba(28,252,185,0.6)]"
          >
            <Phone className="size-u-56 fill-electric text-electric" strokeWidth={1.5} />
          </motion.span>
        </div>
      </div>
      {/* Sectores — Figma: línea #c7d7ff, iconos blancos de 22, Montserrat 16/28 */}
      <div className="border-t border-cloud pt-u-24">
        <ul className="grid grid-cols-2 gap-x-u-16">
          {t.sectors.map((s, i) => {
            const Icon = SECTOR_ICONS[i];
            return (
              <li key={s} className="flex items-center gap-u-10 fs-u-16 lh-u-28 text-white">
                <Icon className="size-u-22 shrink-0 text-white" strokeWidth={1.8} />
                {s}
              </li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}

/* ——— 3. Reservas: el flujo del cliente al sistema, con pulsos de luz ——— */

const NODE_ICONS: LucideIcon[] = [Users, Receipt, CalendarDays, Repeat];

/**
 * Coordenadas del Figma dentro de la tarjeta de 524×573 (en %): el cliente
 * arriba, el orbe de marca, la facturación debajo, CRM y agenda a los lados
 * una fila más abajo, y el seguimiento al pie. Las líneas blancas unen todo.
 */
const BOOK = {
  client: { x: 50, y: 9 },
  orb: { x: 50, y: 33.5, size: 25.6 },
  billing: { x: 50, y: 49.6 },
  crm: { x: 32.6, y: 62.8 },
  calendar: { x: 79.6, y: 62.8 },
  followup: { x: 50, y: 80.6 },
};
// Trazos en el viewBox 524×573 (mismas coordenadas que el Figma)
const BOOK_PATHS = [
  "M 262 100 L 262 137", // cliente → orbe
  "M 262 245 L 262 284", // orbe → facturación
  "M 220 312 L 171 359", // facturación → CRM
  "M 304 312 L 355 359", // facturación → agenda
  "M 171 385 L 355 385", // CRM — agenda
  "M 262 385 L 262 462", // → seguimiento
];

function BookingMock({ t }: { t: { client: string; nodes: string[] } }) {
  const at = (p: { x: number; y: number }) => ({ left: `${p.x}%`, top: `${p.y}%` });
  return (
    <motion.div
      {...reveal(0.15)}
      style={ringStyle(180)}
      // Figma: 524×573, radio 30, degradado #1a4dff→#0a1540
      className="ring-conic relative mx-auto aspect-[524/573] w-full max-w-u-524 overflow-hidden rounded-u-30 bg-[linear-gradient(180deg,#1a4dff_0%,#0a1540_100%)] shadow-[0_50px_100px_-40px_rgba(26,77,255,0.7)]"
    >
      <svg viewBox="0 0 524 573" className="absolute inset-0 h-full w-full" aria-hidden>
        {BOOK_PATHS.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="#ffffff" strokeWidth="1" />
            <circle r="3.5" fill="#b8f21e">
              <animateMotion dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite" path={d} begin={`${i * 0.35}s`} />
            </circle>
          </g>
        ))}
      </svg>

      {/* Orbe de marca: la imagen del Figma, 134 px */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}/orb.png`}
        alt=""
        style={{ ...at(BOOK.orb), width: `${BOOK.orb.size}%` }}
        className="absolute aspect-square -translate-x-1/2 -translate-y-1/2"
      />

      {/* Nodos en HTML por encima del SVG, para tipografía real */}
      <Chip icon={UserRound} light style={at(BOOK.client)}>
        {t.client}
      </Chip>
      <Chip icon={NODE_ICONS[1]} style={at(BOOK.billing)}>{t.nodes[1]}</Chip>
      <Chip icon={NODE_ICONS[0]} style={at(BOOK.crm)}>{t.nodes[0]}</Chip>
      <Chip icon={NODE_ICONS[2]} style={at(BOOK.calendar)}>{t.nodes[2]}</Chip>
      <Chip icon={NODE_ICONS[3]} style={at(BOOK.followup)}>{t.nodes[3]}</Chip>
    </motion.div>
  );
}

/** Nodo del flujo — Figma: 55 px de alto, radio 25, azul con texto #ecefff (el cliente, claro con texto #294296). */
function Chip({
  icon: Icon,
  style,
  light = false,
  children,
}: {
  icon: LucideIcon;
  style: React.CSSProperties;
  light?: boolean;
  children: string;
}) {
  return (
    <span
      style={style}
      className={cn(
        "absolute flex h-u-55 -translate-x-1/2 -translate-y-1/2 items-center gap-u-10 whitespace-nowrap rounded-u-25 px-u-20 font-display fs-u-18 font-medium",
        light ? "bg-frost text-[#294296]" : "bg-electric text-frost"
      )}
    >
      <Icon className="size-u-22" strokeWidth={1.8} />
      {children}
    </span>
  );
}

/**
 * Sección 5 — «La inteligencia artificial detrás de tu negocio» (Figma):
 * tres productos de la capa de IA, cada uno con su maqueta viva al lado.
 */
export default function Process() {
  const { locale, dict } = useLocale();
  const t = dict.aiLayer;

  return (
    <section id="process" className="relative border-t border-line bg-void pb-u-120 pt-u-117">
      <div className="mx-auto max-w-[1920px] px-5 md:px-10 xl:px-[12.5%]">
        <SectionHeading key={locale} eyebrow={t.eyebrow} title={[t.titleA, t.titleB]} sub={t.sub} subSize={24} />

        <div className="mt-u-180 flex flex-col gap-u-190">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-u-100">
            <Copy {...t.concierge} noteIcon={MessagesSquare} />
            <ChatMock t={t.concierge} />
          </div>

          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-u-100">
            <div className="order-2 lg:order-1">
              <VoiceMock t={t.voice} />
            </div>
            <div className="order-1 lg:order-2">
              <Copy {...t.voice} noteIcon={Headset} />
            </div>
          </div>

          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-u-100">
            <Copy {...t.booking} noteIcon={CalendarDays} />
            <BookingMock t={t.booking} />
          </div>
        </div>
      </div>
    </section>
  );
}
