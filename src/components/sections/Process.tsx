"use client";

import { motion } from "framer-motion";
import {
  AudioLines,
  Building2,
  CalendarDays,
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
import TextReveal from "@/components/ui/TextReveal";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const EASE = [0.16, 1, 0.3, 1] as const;

/* ——— Piezas comunes ——— */

function Tag({ children }: { children: string }) {
  return (
    <span className="btn-blue inline-flex rounded-full px-6 py-2.5 font-display text-sm font-semibold">
      {children}
    </span>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {items.map((b) => (
        <li key={b} className="flex items-start gap-3 text-[13px] text-frost/90">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon shadow-[0_0_8px_1px_rgba(184,242,30,0.6)]" />
          {b}
        </li>
      ))}
    </ul>
  );
}

function Note({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <p className="mt-10 flex items-center gap-3 font-display text-sm font-semibold text-electric">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-electric/50">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <span className="max-w-[180px] leading-tight">{children}</span>
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
      <h3 className="mt-7 font-display text-[clamp(1.7rem,3.2vw,2.5rem)] font-light leading-[1.15] text-white">
        {title}
      </h3>
      <p className="mt-5 max-w-lg text-base leading-relaxed text-mist">{desc}</p>
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
      className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-[26px] border border-pulse/40 bg-gradient-to-b from-[#0b1a52] to-[#0a1440] shadow-[0_50px_100px_-40px_rgba(26,77,255,0.7)]"
    >
      <div className="card-blue flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BASE}/isotipo.png`} alt="" className="h-6 w-6" />
          </span>
          <div>
            <p className="font-display text-base font-medium text-white">{t.name}</p>
            <p className="flex items-center gap-1.5 text-[11px] text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse-glow" />
              {t.status}
            </p>
          </div>
        </div>
        <X className="h-5 w-5 text-white/80" strokeWidth={1.6} />
      </div>
      <div className="space-y-4 px-5 pb-5 pt-6">
        <motion.p {...bubble(0)} className="ml-auto w-fit rounded-xl bg-electric px-4 py-2.5 text-sm text-white">
          {t.msgs[0]}
        </motion.p>
        <motion.p {...bubble(1)} className="max-w-[85%] text-sm leading-relaxed text-frost">
          {t.msgs[1]}
        </motion.p>
        <motion.p {...bubble(2)} className="ml-auto w-fit max-w-[80%] rounded-xl bg-electric px-4 py-2.5 text-right text-sm text-white">
          {t.msgs[2]}
        </motion.p>
        <motion.div
          {...bubble(3)}
          className="mt-8 flex items-center justify-between rounded-2xl border border-pulse/60 bg-white/[0.06] py-2 pl-5 pr-2"
        >
          <span className="text-sm text-frost/70">{t.placeholder}</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-electric">
            <Sparkles className="h-4 w-4 text-white" strokeWidth={1.8} />
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ——— 2. Voz: el orbe con sus anillos y las etiquetas flotando ——— */

const SECTOR_ICONS: LucideIcon[] = [ShoppingBag, Building2, UtensilsCrossed, HeartPulse];

function VoiceMock({ t }: { t: { chips: string[]; sectors: string[] } }) {
  return (
    <motion.div
      {...reveal(0.15)}
      className="relative mx-auto w-full max-w-[400px] rounded-[26px] border border-pulse/35 bg-gradient-to-b from-[#0b1640] to-[#0c1a4e] p-6 shadow-[0_50px_100px_-40px_rgba(26,77,255,0.6)]"
    >
      <div className="relative flex flex-col items-center">
        {/* Etiquetas flotando: en fila que se parte, así nunca se pisan en móvil */}
        <div className="relative z-10 -mb-8 flex flex-wrap justify-center gap-2">
          {t.chips.map((c, i) => (
            <motion.span
              key={c}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.2, ease: EASE }}
              className={cn(
                "animate-float flex items-center gap-2 rounded-full bg-[#0e2050]/90 px-3.5 py-2 text-[11px] font-medium text-white ring-1 ring-pulse/30 backdrop-blur-sm",
                i === 0 && "sm:-translate-y-3"
              )}
              style={{ animationDelay: `${i * 0.7}s` }}
            >
              <AudioLines className="h-3.5 w-3.5 text-pulse" strokeWidth={2} />
              {c}
            </motion.span>
          ))}
        </div>
        {/* El orbe */}
        <div className="relative mb-2 flex h-[230px] w-[230px] items-center justify-center">
          <span className="animate-ring absolute inset-0 rounded-full bg-mint/20" />
          <span className="animate-ring absolute inset-0 rounded-full bg-mint/15" style={{ animationDelay: "1.4s" }} />
          <span className="absolute inset-[18px] rounded-full bg-mint/15" />
          <span className="absolute inset-[38px] rounded-full bg-mint/20" />
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex h-[110px] w-[110px] items-center justify-center rounded-full bg-mint shadow-[0_0_60px_-10px_rgba(125,227,195,0.8)]"
          >
            <Phone className="h-9 w-9 fill-electric text-electric" strokeWidth={1.5} />
          </motion.span>
        </div>
      </div>
      <div className="mt-2 border-t border-pulse/25 pt-4">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          {t.sectors.map((s, i) => {
            const Icon = SECTOR_ICONS[i];
            return (
              <li key={s} className="flex items-center gap-2 text-[12px] text-neon">
                <Icon className="h-3.5 w-3.5 shrink-0 text-frost" strokeWidth={1.8} />
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

function BookingMock({ t }: { t: { client: string; nodes: string[] } }) {
  // Trayectorias que dibujan los pulsos (coordenadas del viewBox 400×340)
  const paths = [
    "M 200 58 L 200 128",
    "M 200 200 C 200 240, 80 220, 80 262",
    "M 200 200 L 200 262",
    "M 200 200 C 200 240, 320 220, 320 262",
    "M 200 262 L 200 312",
  ];
  return (
    <motion.div
      {...reveal(0.15)}
      className="card-blue relative mx-auto w-full max-w-[420px] overflow-hidden rounded-[26px] border border-pulse/40 p-5 shadow-[0_50px_100px_-40px_rgba(26,77,255,0.7)]"
    >
      <svg viewBox="0 0 400 340" className="w-full" aria-hidden>
        <defs>
          <linearGradient id="bookingOrb" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7de3c3" />
            <stop offset="50%" stopColor="#94b2fc" />
            <stop offset="100%" stopColor="#c58bff" />
          </linearGradient>
        </defs>
        {paths.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeDasharray="4 5" className="animate-dash" />
            <circle r="3.5" fill="#ffffff">
              <animateMotion dur={`${2.2 + i * 0.4}s`} repeatCount="indefinite" path={d} begin={`${i * 0.3}s`} />
            </circle>
          </g>
        ))}
        {/* Orbe central */}
        <circle cx="200" cy="164" r="44" fill="url(#bookingOrb)" opacity="0.95" />
        <circle cx="200" cy="164" r="44" fill="none" stroke="#ffffff" strokeOpacity="0.5" />
        <circle cx="200" cy="164" r="22" fill="#0b1435" opacity="0.85" />
        <circle cx="200" cy="164" r="8" fill="#ffffff" />
      </svg>

      {/* Chips en HTML por encima del SVG, para tipografía real */}
      <div className="pointer-events-none absolute inset-5">
        <Chip icon={UserRound} className="left-1/2 top-[6%] -translate-x-1/2">{t.client}</Chip>
        <Chip icon={NODE_ICONS[0]} className="left-[3%] top-[70%]">{t.nodes[0]}</Chip>
        <Chip icon={NODE_ICONS[1]} className="left-1/2 top-[70%] -translate-x-1/2">{t.nodes[1]}</Chip>
        <Chip icon={NODE_ICONS[2]} className="right-[3%] top-[70%]">{t.nodes[2]}</Chip>
        <Chip icon={NODE_ICONS[3]} className="left-1/2 top-[88%] -translate-x-1/2">{t.nodes[3]}</Chip>
      </div>
    </motion.div>
  );
}

function Chip({ icon: Icon, className, children }: { icon: LucideIcon; className: string; children: string }) {
  return (
    <span
      className={cn(
        "absolute flex -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-xl bg-white/[0.14] px-3.5 py-2 text-[12px] font-medium text-white ring-1 ring-white/30 backdrop-blur-md",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
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
    <section id="process" className="relative bg-void py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center" key={locale}>
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

        <div className="mt-24 space-y-28 md:mt-32 md:space-y-40">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <Copy {...t.concierge} noteIcon={MessagesSquare} />
            <ChatMock t={t.concierge} />
          </div>

          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="order-2 lg:order-1">
              <VoiceMock t={t.voice} />
            </div>
            <div className="order-1 lg:order-2">
              <Copy {...t.voice} noteIcon={Headset} />
            </div>
          </div>

          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <Copy {...t.booking} noteIcon={CalendarDays} />
            <BookingMock t={t.booking} />
          </div>
        </div>
      </div>
    </section>
  );
}
