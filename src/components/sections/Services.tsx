"use client";

import { useRef, type MouseEvent } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  Compass,
  Cpu,
  Database,
  Layers,
  MessageSquare,
  Route,
  Terminal,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import TextReveal from "@/components/ui/TextReveal";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";

/** Estructura (iconos y anchos) — los textos viven en el diccionario, por índice. */
const STRUCTURE: { icon: LucideIcon; wide?: boolean }[] = [
  { icon: Bot, wide: true },
  { icon: Cpu },
  { icon: Workflow },
  { icon: Route },
  { icon: Terminal },
  { icon: Compass, wide: true },
  { icon: Layers },
  { icon: MessageSquare },
  { icon: Database },
  { icon: Wrench },
];

function ServiceModule({
  icon: Icon,
  wide,
  title,
  desc,
  index,
}: {
  icon: LucideIcon;
  wide?: boolean;
  title: string;
  desc: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Luz interior que sigue al cursor + inclinación 3D sutil hacia él
  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    const rect = el?.getBoundingClientRect();
    if (!el || !rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    el.style.setProperty("--rx", `${(0.5 - py) * 5}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 5}deg`);
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 44, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.9,
        delay: (index % 3) * 0.09,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(wide && "lg:col-span-2")}
      style={{ perspective: "900px" }}
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
          transformStyle: "preserve-3d",
        }}
        className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-line bg-panel/30 p-8 transition-[border-color,box-shadow,transform] duration-300 will-change-transform hover:border-[rgba(94,140,255,0.4)] hover:shadow-[0_24px_70px_-30px_rgba(46,107,255,0.45)] md:p-10"
      >
        {/* Numeral gigante hueco — marca de agua de la casa */}
        <span
          aria-hidden
          className="text-outline pointer-events-none absolute -right-3 -top-7 select-none font-display text-[7rem] font-bold leading-none transition-all duration-500 group-hover:-translate-y-1 group-hover:[-webkit-text-stroke-color:rgba(94,160,255,0.32)] md:text-[8.5rem]"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Luz interior que sigue al cursor */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(46,107,255,0.14), transparent 55%)",
          }}
        />
        {/* Barrido superior de neón */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="relative flex h-full flex-col">
          <div className="mb-8 flex items-start justify-between">
            <div className="conic-ring flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-space/70 text-neon transition-all duration-300 group-hover:shadow-[0_0_24px_-4px_rgba(56,212,255,0.6)]">
              <Icon className="h-5 w-5" strokeWidth={1.6} />
            </div>
          </div>
          <h3 className="font-display text-xl font-semibold tracking-tight text-frost md:text-2xl">
            {title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-mist">{desc}</p>

          {/* Flecha que llega — el módulo invita a la conversación */}
          <div className="mt-auto flex justify-end pt-6">
            <ArrowUpRight
              className="h-4 w-4 -translate-x-2 translate-y-2 text-neon/0 transition-all duration-400 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-neon/80"
              strokeWidth={1.6}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Sección 3 — Servicios como módulos de producto premium: numerados como
 * piezas de una máquina, con material propio (anillo cónico), profundidad
 * real (tilt 3D) y una luz que responde a la mano del visitante.
 */
export default function Services() {
  const { locale, dict } = useLocale();
  const t = dict.services;

  return (
    <section id="services" className="relative bg-void py-32 md:py-44">
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-line to-transparent"
      />
      {/* Atmósfera propia de la sección: bruma eléctrica en la esquina */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-40 h-[480px] w-[480px] rounded-full bg-electric/[0.07] blur-[120px]"
      />
      <div className="mx-auto max-w-7xl px-6">
        <p className="eyebrow mb-6">{t.eyebrow}</p>
        <div className="max-w-4xl" key={locale}>
          <TextReveal
            text={t.title}
            className="text-[clamp(2.4rem,6vw,5.5rem)] text-frost"
          />
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-mist md:text-lg"
        >
          {t.sub}
        </motion.p>

        <div className="mt-16 grid gap-4 md:mt-24 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {STRUCTURE.map((s, i) => (
            <ServiceModule
              key={i}
              icon={s.icon}
              wide={s.wide}
              title={t.items[i].title}
              desc={t.items[i].desc}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
