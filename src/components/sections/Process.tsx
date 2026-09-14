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
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const EASE = [0.16, 1, 0.3, 1] as const;

/* ——— Piezas comunes (medidas en px del Figma a 1920, utilidades *-u-N) ——— */

/** Etiqueta de producto — Figma: 243×72, radio 30, navy→abyss con borde azul y brillo; texto 600 · 18 · #779eff. */
function Tag({ children }: { children: string }) {
  return (
    <span className="tag-pill inline-flex h-u-72 items-center rounded-u-30 px-u-40 font-display fs-u-18 font-semibold text-periwinkle">
      {children}
    </span>
  );
}

/** Viñetas — Figma: chevron lima 25×26 de trazo 3, Montserrat Medium 16/35 blanco; 2ª columna a 336 de la 1ª. */
function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-u-50 grid sm:grid-cols-[max(160px,336*var(--u))_1fr]">
      {items.map((b) => (
        <li key={b} className="flex items-center gap-u-10 fs-u-16 lh-u-35 font-medium text-white">
          <ChevronRight className="size-u-24 shrink-0 text-neon" strokeWidth={3} />
          {b}
        </li>
      ))}
    </ul>
  );
}

/**
 * Nota al pie — Figma: icono lineal de 60 px (#779eff con detalle lima) y texto
 * Montserrat 24/24 en azul de marca, a 58 de las viñetas. Los iconos vectoriales
 * los enviará la diseñadora (D6); de momento, lucide.
 */
function Note({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <p className="mt-u-58 flex items-center gap-u-16 font-display fs-u-24 lh-u-24 text-electric">
      <span className="flex size-u-60 shrink-0 items-center justify-center">
        <Icon className="size-u-44 text-periwinkle" strokeWidth={1.4} />
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
      <p className="mt-u-14 max-w-u-704 fs-u-20 lh-u-28 text-cloud/80">{desc}</p>
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
      // Figma: 524×573, radio 30 30 30 39, degradado #0a1540→#1a4dff
      className="ring-conic relative mx-auto w-full max-w-u-524 overflow-hidden rounded-u-30 rounded-br-[max(23.4px,39*var(--u))] bg-[linear-gradient(180deg,#0a1540_0%,#1a4dff_100%)] shadow-[0_50px_100px_-40px_rgba(26,77,255,0.7)]"
    >
      {/* Cabecera: 109 px, azul al 75 %, avatar de 68 en lima (#b8f21e, «Ellipse 1»)
          con el isotipo en negro («Vector» 36×30 fill #000); el Figma no lleva «×» de cierre */}
      <div className="flex h-u-109 items-center rounded-t-u-30 bg-electric/75 px-u-33">
        <div className="flex items-center gap-u-22">
          <span className="flex size-u-68 items-center justify-center rounded-full bg-neon">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BASE}/isotipo.png`} alt="" className="size-u-36 brightness-0" />
          </span>
          <div>
            <p className="font-display fs-u-24 font-medium leading-none text-white">{t.name}</p>
            <p className="mt-u-6 flex items-center gap-u-8 fs-u-15 font-light text-frost">
              <span className="size-u-8 rounded-full bg-neon animate-pulse-glow" />
              {t.status}
            </p>
          </div>
        </div>
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
      className="ring-conic relative mx-auto w-full max-w-u-522 rounded-u-25 bg-[radial-gradient(55%_45%_at_50%_50%,#1a4dff_0%,#101837_100%)] px-u-44 pb-u-43 pt-u-45 shadow-[0_50px_100px_-40px_rgba(26,77,255,0.6)]"
    >
      <div className="relative flex flex-col items-center">
        {/* Etiquetas flotando — Figma: 55 px de alto, radio 25, #101a3e, Montserrat 16 */}
        <div className="relative z-10 -mb-[max(18px,30*var(--u))] flex flex-wrap justify-center gap-u-12">
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
        {/* El orbe — Figma «Untitled file 1»: tres discos concéntricos centrados en (261,287) de la
            tarjeta: exterior 398 (nodo «i3», #1a4dff al 25 %), medio 290 (#38d4ff al 25 %) y núcleo 207
            #1cfcb9 con el teléfono de 50. Los dos exteriores son estáticos; los anillos siguen animados. */}
        <div className="relative flex size-u-300 items-center justify-center">
          <div className="absolute left-1/2 top-1/2 size-u-398 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/25" />
          <div className="absolute left-1/2 top-1/2 size-u-290 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/25" />
          <span className="animate-ring absolute inset-0 rounded-full bg-electric/25" />
          <span className="animate-ring absolute inset-0 rounded-full bg-electric/20" style={{ animationDelay: "1.4s" }} />
          <span className="absolute inset-[8%] rounded-full bg-electric/25 blur-md" />
          <span className="absolute inset-[16%] rounded-full bg-electric/40 blur-sm" />
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex size-u-207 items-center justify-center rounded-full bg-mint shadow-[0_0_60px_-10px_rgba(28,252,185,0.6)]"
          >
            <Phone className="size-u-50 fill-electric text-electric" strokeWidth={1.5} />
          </motion.span>
        </div>
      </div>
      {/* Sectores — Figma: línea #c7d7ff a 436 del borde superior, iconos blancos de 22 a 37 de la línea, Montserrat 16/28 */}
      <div className="border-t border-cloud pt-u-36">
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
 * Disposición del gráfico dentro de la tarjeta de 524×573, en coordenadas del
 * viewBox (las mismas que usa el HTML en %). Simétrica respecto al eje central:
 * cliente arriba, orbe, facturación, CRM y agenda espejados una fila más abajo,
 * seguimiento al pie. Todos los nodos miden lo mismo (160×55).
 */
const BOOK = {
  w: 524,
  h: 573,
  node: { w: 160, h: 55 },
  orbR: 67,
  // Centros medidos en el Figma 1532:2424 (chips «Cliente» 152×55 @186,45 ·
  // «Facturacion» 183×55 @171,284 · «CRM» 132×55 @39,360 · «Agenda» 152×55
  // @341,360 · «Seguimiento» 196×55 @164,462 · orbe 134 @195,125).
  client: { x: 262, y: 72 },
  orb: { x: 262, y: 192 },
  billing: { x: 262, y: 311 },
  crm: { x: 105, y: 387 },
  calendar: { x: 417, y: 387 },
  followup: { x: 262, y: 489 },
};
const BOOK_PATHS = [
  `M 262 ${BOOK.client.y + BOOK.node.h / 2} L 262 ${BOOK.orb.y - BOOK.orbR}`, // cliente → orbe
  `M 262 ${BOOK.orb.y + BOOK.orbR} L 262 ${BOOK.billing.y - BOOK.node.h / 2}`, // orbe → facturación
  // Figma «Vector 29» ×2: en «L», del lateral de facturación al centro del nodo de abajo
  `M ${BOOK.billing.x - BOOK.node.w / 2} ${BOOK.billing.y} L ${BOOK.crm.x} ${BOOK.billing.y} L ${BOOK.crm.x} ${BOOK.crm.y - BOOK.node.h / 2}`, // → CRM
  `M ${BOOK.billing.x + BOOK.node.w / 2} ${BOOK.billing.y} L ${BOOK.calendar.x} ${BOOK.billing.y} L ${BOOK.calendar.x} ${BOOK.calendar.y - BOOK.node.h / 2}`, // → agenda
  `M ${BOOK.crm.x + BOOK.node.w / 2} ${BOOK.crm.y} L ${BOOK.calendar.x - BOOK.node.w / 2} ${BOOK.calendar.y}`, // CRM — agenda
  `M 262 ${BOOK.crm.y} L 262 ${BOOK.followup.y - BOOK.node.h / 2}`, // → seguimiento
];

function BookingMock({ t }: { t: { client: string; nodes: string[] } }) {
  const at = (p: { x: number; y: number }) => ({ left: `${(p.x / BOOK.w) * 100}%`, top: `${(p.y / BOOK.h) * 100}%` });
  return (
    <motion.div
      {...reveal(0.15)}
      style={ringStyle(180)}
      // Figma: 524×573, radio 30 30 30 39, degradado #1a4dff→#0a1540
      className="ring-conic relative mx-auto aspect-[524/573] w-full max-w-u-524 overflow-hidden rounded-u-30 rounded-br-[max(23.4px,39*var(--u))] bg-[linear-gradient(180deg,#1a4dff_0%,#0a1540_100%)] shadow-[0_50px_100px_-40px_rgba(26,77,255,0.7)]"
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
        style={{ ...at(BOOK.orb), width: `${((BOOK.orbR * 2) / BOOK.w) * 100}%` }}
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
        "absolute flex h-u-55 w-u-160 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-u-10 whitespace-nowrap rounded-u-25 px-u-12 font-display fs-u-18 font-medium",
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
    <section id="process" className="relative bg-void pb-u-250 pt-u-125">
      {/* Figma «Vector 20» @y=4570: solo la línea brillante de 3 px, sin la de 0,5 */}
      <div className="divider-glow absolute inset-x-0 top-0" aria-hidden />
      <div className="mx-auto max-w-[1920px] px-5 md:px-10 xl:px-[12.5%]">
        <SectionHeading key={locale} eyebrow={t.eyebrow} title={[t.titleA, t.titleB]} sub={t.sub} subSize={26} />

        {/* Figma: texto de 704 en x=240 y tarjeta de 524 a 91 del borde derecho del contenedor
            (x=1065–1589); en la fila de voz, tarjeta a 91 del borde izquierdo (x=331) y texto en x=976. */}
        <div className="mt-u-115 flex flex-col gap-u-176">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,calc(704*var(--u)))_minmax(0,calc(524*var(--u)))] lg:justify-between lg:gap-0 lg:pr-u-91">
            <Copy {...t.concierge} noteIcon={MessagesSquare} />
            <ChatMock t={t.concierge} />
          </div>

          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,calc(524*var(--u)))_minmax(0,calc(704*var(--u)))] lg:justify-between lg:gap-0 lg:pl-u-91">
            <div className="order-2 lg:order-1">
              <VoiceMock t={t.voice} />
            </div>
            <div className="order-1 lg:order-2">
              <Copy {...t.voice} noteIcon={Headset} />
            </div>
          </div>

          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,calc(704*var(--u)))_minmax(0,calc(524*var(--u)))] lg:justify-between lg:gap-0 lg:pr-u-91">
            <Copy {...t.booking} noteIcon={CalendarDays} />
            <BookingMock t={t.booking} />
          </div>
        </div>
      </div>
    </section>
  );
}
