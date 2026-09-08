"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/* ───────────────────────── Órbita ───────────────────────── */

/*
 * Geometría del Figma en px a 1920: la elipse ocupa 464×385 ya inclinada, lo
 * que corresponde a semiejes 237×186 girados −20°; el planeta mide 185 y el
 * isotipo unos 100. El viewBox (520×440) deja aire para el halo.
 */
const CX = 260;
const CY = 220;
const RX = 237;
const RY = 186;
/** Inclinación de la órbita en grados (la misma que dibuja el SVG). */
const TILT = -20;
/** Radio del planeta (185 px de diámetro en el Figma). */
const PLANET_R = 92.5;
/** Trayectoria elíptica de la línea — el punto de luz la recorre por cálculo. */
const ORBIT_PATH = `M ${CX - RX} ${CY} A ${RX} ${RY} 0 1 1 ${CX + RX} ${CY} A ${RX} ${RY} 0 1 1 ${CX - RX} ${CY}`;
/** Una vuelta completa. Lenta a propósito: hay que poder leer cada paso al pasar. */
const ORBIT_PERIOD_MS = 18_000;
/** Cuántos pasos rodean el núcleo y a qué ángulo visual (0 = derecha, 90 = abajo) está el primero. */
const STEPS = 6;
const FIRST_STEP_ANGLE = 270;

/** Punto de la órbita para un ángulo paramétrico θ, en coordenadas ya inclinadas. */
function orbitPoint(theta: number) {
  const x = RX * Math.cos(theta);
  const y = RY * Math.sin(theta);
  const t = (TILT * Math.PI) / 180;
  return {
    x: CX + x * Math.cos(t) - y * Math.sin(t),
    y: CY + x * Math.sin(t) + y * Math.cos(t),
  };
}

/** A qué paso «apunta» el punto de luz: sectores de 60° alrededor del núcleo. */
function stepAt(x: number, y: number) {
  const deg = ((Math.atan2(y - CY, x - CX) * 180) / Math.PI + 360) % 360;
  const half = 360 / STEPS / 2;
  return Math.floor((((deg - FIRST_STEP_ANGLE + half) % 360) + 360) % 360 / (360 / STEPS));
}

/* ───────────────────────── Paso ───────────────────────── */

function Step({
  n,
  title,
  desc,
  active,
  delay = 0,
}: {
  n: number;
  title: string;
  desc: string;
  active: boolean;
  delay?: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group w-full max-w-u-300"
    >
      {/* Figma: título Montserrat SemiBold 20/23 con el número (círculo #101a3e de 42) a la derecha,
          y una línea de 0,5 px #c7d7ff debajo; el paso activo pasa a lima */}
      <div
        className={cn(
          "flex items-center justify-between gap-u-16 border-b-[0.5px] pb-u-12 transition-colors duration-700",
          active ? "border-neon/70" : "border-cloud"
        )}
      >
        <span
          className={cn(
            "font-display fs-u-20 lh-u-23 font-semibold transition-colors duration-700",
            active ? "text-neon" : "text-white group-hover:text-cloud"
          )}
        >
          {title}
        </span>
        <span className="relative flex size-u-42 shrink-0 items-center justify-center">
          {active && (
            <span aria-hidden className="animate-ring absolute inset-0 rounded-full border border-neon/70" />
          )}
          <span
            className={cn(
              "flex size-u-42 items-center justify-center rounded-full bg-space font-display fs-u-20 font-semibold transition-all duration-700",
              active ? "text-neon shadow-[0_0_18px_rgba(184,242,30,0.35)]" : "text-white"
            )}
          >
            {n}
          </span>
        </span>
      </div>
      <p
        className={cn(
          "mt-u-18 fs-u-18 lh-u-23 font-light transition-colors duration-700",
          active ? "text-mist" : "text-cloud"
        )}
      >
        {desc}
      </p>
    </motion.li>
  );
}

/* ───────────────────────── Sección ───────────────────────── */

/**
 * Sección 4 — «Cómo trabajamos» (Figma): el método como sistema en órbita.
 * Asenix es el planeta en el centro de una galaxia que gira despacio; un
 * punto de luz recorre la órbita y, al pasar frente a cada paso, ese paso
 * se enciende en verde. En móvil los pasos se apilan en lista, pero se
 * encienden igual al ritmo de la órbita.
 */
export default function Ecosystem() {
  const { locale, dict } = useLocale();
  const t = dict.howWeWork;
  const s = t.steps;
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  // Las letras del eslogan se encienden cuando la bolita de la órbita pasa a su lado
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const onPoint = useCallback((x: number, y: number) => {
    for (const el of lettersRef.current) {
      const r = el.getBoundingClientRect();
      if (!r.width) continue;
      const dx = Math.abs(r.left + r.width / 2 - x);
      const dy = Math.abs(r.top + r.height / 2 - y);
      const k = Math.max(0, 1 - Math.hypot(dx, dy * 0.6) / (r.height * 2.2));
      el.style.color = k > 0 ? `color-mix(in srgb, #b8f21e ${Math.round(k * 100)}%, #f1f3fe)` : "";
    }
  }, []);
  const letters = (text: string, offset: number) =>
    [...text].map((ch, i) => (
      <span
        key={`${offset}-${i}`}
        ref={(el) => {
          if (el) lettersRef.current[offset + i] = el;
        }}
        className="inline-block transition-colors duration-300"
      >
        {ch === " " ? "\u00a0" : ch}
      </span>
    ));

  return (
    <section
      id="ecosystem"
      ref={sectionRef}
      className="relative overflow-hidden border-y border-line bg-[#02040f] pb-u-140 pt-u-116"
    >
      <Galaxy sectionRef={sectionRef} />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/[0.12] blur-[120px]"
      />

      <div className="relative mx-auto max-w-[1920px] px-5 md:px-10 xl:px-[12.5%]" key={locale}>
        <p className="eyebrow mx-auto flex w-fit">{t.eyebrow}</p>

        {/* Escritorio: rejilla orbital. El eslogan va en una sola fila, centrado en la altura
            del planeta, sobre una banda oscura (Figma: 1349×59, #04071a) */}
        <div className="relative mt-u-130 hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-stretch lg:gap-x-u-30">
          <div aria-hidden className="absolute inset-x-0 top-1/2 z-0 h-u-59 -translate-y-1/2 bg-[#04071a]" />

          {/* Izquierda: paso 6 arriba, eslogan en el centro, paso 5 abajo */}
          <div className="relative z-10 grid grid-rows-[1fr_auto_1fr] justify-items-start pl-u-110">
            <ul className="flex w-full">
              <Step n={6} title={s[5].title} desc={s[5].desc} active={active === 5} delay={0.5} />
            </ul>
            <motion.h3
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="w-full self-center whitespace-nowrap text-right font-display fs-u-38 lh-u-36 font-semibold text-paper"
            >
              {letters(t.left, 0)}
            </motion.h3>
            <ul className="flex w-full self-end">
              <Step n={5} title={s[4].title} desc={s[4].desc} active={active === 4} delay={0.4} />
            </ul>
          </div>

          {/* Centro: paso 1, órbita, paso 4 */}
          <div className="relative z-10 flex flex-col items-center gap-u-10">
            <ul className="flex justify-center">
              <Step n={1} title={s[0].title} desc={s[0].desc} active={active === 0} />
            </ul>
            <Orbit ariaLabel={t.svgAria} onStep={setActive} onPoint={onPoint} />
            <ul className="flex justify-center">
              <Step n={4} title={s[3].title} desc={s[3].desc} active={active === 3} delay={0.3} />
            </ul>
          </div>

          {/* Derecha: paso 2 arriba, eslogan en el centro, paso 3 abajo */}
          <div className="relative z-10 grid grid-rows-[1fr_auto_1fr] justify-items-end pr-u-110">
            <ul className="flex w-full justify-end">
              <Step n={2} title={s[1].title} desc={s[1].desc} active={active === 1} delay={0.1} />
            </ul>
            <motion.h3
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="w-full self-center whitespace-nowrap text-left font-display fs-u-38 lh-u-36 font-semibold text-paper"
            >
              {letters(t.right, 100)}
            </motion.h3>
            <ul className="flex w-full justify-end self-end">
              <Step n={3} title={s[2].title} desc={s[2].desc} active={active === 2} delay={0.2} />
            </ul>
          </div>
        </div>

        {/* Móvil y tablet: órbita arriba, pasos en lista */}
        <div className="mt-14 lg:hidden">
          <h3 className="text-center font-display text-2xl font-semibold text-paper text-balance">
            {t.left} <span className="text-electric">·</span> {t.right}
          </h3>
          <div className="mx-auto mt-8 max-w-sm">
            <Orbit ariaLabel={t.svgAria} onStep={setActive} />
          </div>
          <ul className="mx-auto mt-10 grid max-w-2xl gap-8 sm:grid-cols-2">
            {s.map((step, i) => (
              <Step key={step.title} n={i + 1} title={step.title} desc={step.desc} active={active === i} delay={i * 0.06} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Núcleo y órbita ───────────────────────── */

/** Estela: cuántos puntos van detrás de la luz y a qué distancia angular. */
const TRAIL = [0.05, 0.1, 0.16, 0.23];
const VIEW_W = 520;
const VIEW_H = 440;

/**
 * El núcleo: isotipo dentro de un disco blanco que respira, con su órbita y
 * su punto de luz. La luz se mueve por rAF (no por `animateMotion`) para
 * saber en cada instante a qué paso apunta y avisar arriba. Las dos órbitas
 * (escritorio y móvil) comparten reloj, así que nunca discrepan.
 */
function Orbit({
  ariaLabel,
  onStep,
  onPoint,
}: {
  ariaLabel: string;
  onStep: (i: number) => void;
  /** Posición de la bolita en coordenadas de pantalla, cada fotograma (para el eslogan). */
  onPoint?: (x: number, y: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const trailRefs = useRef<(SVGCircleElement | null)[]>([]);
  // Hay dos órbitas en el DOM (escritorio y móvil, una oculta): si comparten
  // ids de degradado, la oculta se lleva la referencia y la visible sale sin línea
  const uid = useId();
  const glowId = `core-glow-${uid}`;
  const lineId = `orbit-line-${uid}`;
  const sphereId = `sphere-${uid}`;
  const shadeId = `shade-${uid}`;
  const atmoId = `atmo-${uid}`;
  const sweepId = `sweep-${uid}`;
  const blurId = `blur-${uid}`;
  const waveRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let visible = false;
    let last = -1;
    let flashAt = -Infinity;
    let wave = 0;
    const waveAt = [-Infinity, -Infinity];

    const place = (el: SVGCircleElement | null, p: { x: number; y: number }) => {
      if (!el) return;
      el.setAttribute("cx", p.x.toFixed(2));
      el.setAttribute("cy", p.y.toFixed(2));
    };

    const draw = (now: number) => {
      const theta = Math.PI + ((now % ORBIT_PERIOD_MS) / ORBIT_PERIOD_MS) * Math.PI * 2;
      const p = orbitPoint(theta);
      place(dotRef.current, p);
      place(glowRef.current, p);
      TRAIL.forEach((d, i) => place(trailRefs.current[i], orbitPoint(theta - d)));

      if (onPoint) {
        // Del viewBox a la pantalla: el SVG conserva la proporción, así que basta una escala
        const box = svg.getBoundingClientRect();
        const k = box.width / VIEW_W;
        onPoint(box.left + p.x * k, box.top + p.y * k);
      }

      const step = stepAt(p.x, p.y);
      if (step !== last) {
        last = step;
        flashAt = now;
        // Cada paso alimenta el núcleo: sale una onda hacia fuera
        waveAt[wave] = now;
        wave = (wave + 1) % waveAt.length;
        onStep(step);
      }
      waveAt.forEach((t0, i) => {
        const el = waveRefs.current[i];
        if (!el) return;
        const q = (now - t0) / 1400;
        if (q < 0 || q > 1) {
          el.setAttribute("opacity", "0");
          return;
        }
        const e = 1 - Math.pow(1 - q, 3);
        el.setAttribute("r", (PLANET_R + 10 + 110 * e).toFixed(2));
        el.setAttribute("opacity", (0.55 * (1 - e)).toFixed(3));
      });
      // Al cambiar de paso, la luz «respira»: el halo crece y se apaga en medio segundo
      const k = Math.max(0, 1 - (now - flashAt) / 600);
      glowRef.current?.setAttribute("r", (9 + 10 * k).toFixed(2));
      glowRef.current?.setAttribute("opacity", (0.25 + 0.35 * k).toFixed(3));
    };

    if (reduced) {
      // Sin movimiento: la luz se queda frente al primer paso
      draw(0);
      return;
    }

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(svg);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [onStep, onPoint]);

  const start = orbitPoint(Math.PI);

  return (
    <motion.svg
      ref={svgRef}
      data-orbit
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label={ariaLabel}
      className="w-full max-w-u-520"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <defs>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#94b2fc" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#1a4dff" stopOpacity="0" />
        </radialGradient>
        {/* Figma: trazo cónico #1a4dff → #94b2fc → #1a4dff → #b8f21e */}
        <linearGradient id={lineId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a4dff" />
          <stop offset="50%" stopColor="#94b2fc" />
          <stop offset="85%" stopColor="#1a4dff" />
          <stop offset="100%" stopColor="#b8f21e" />
        </linearGradient>
        {/* Figma: planeta radial #ffffff → #ecefff con borde de 2 px #c7d7ff */}
        <radialGradient id={sphereId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ecefff" />
        </radialGradient>
        <radialGradient id={shadeId} cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="#1a4dff" stopOpacity="0" />
          <stop offset="100%" stopColor="#1a4dff" stopOpacity="0.28" />
        </radialGradient>
        <radialGradient id={atmoId} cx="50%" cy="50%" r="50%">
          <stop offset="76%" stopColor="#94b2fc" stopOpacity="0" />
          <stop offset="88%" stopColor="#94b2fc" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#1a4dff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={sweepId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b8f21e" stopOpacity="0" />
          <stop offset="60%" stopColor="#b8f21e" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>
        <filter id={blurId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Halo — Figma: sombra 0 0 200 rgba(26,77,255,.49) alrededor del planeta */}
      <circle cx={CX} cy={CY} r="215" fill={`url(#${glowId})`} />

      {/* Órbita inclinada */}
      <g transform={`rotate(${TILT} ${CX} ${CY})`}>
        <path d={ORBIT_PATH} fill="none" stroke={`url(#${lineId})`} strokeWidth="1.5" />
      </g>

      {/* Ondas que salen del núcleo cada vez que la órbita pasa por un paso */}
      {[0, 1].map((i) => (
        <circle
          key={i}
          ref={(el) => {
            waveRefs.current[i] = el;
          }}
          cx={CX}
          cy={CY}
          r={PLANET_R + 10}
          fill="none"
          stroke="#b8f21e"
          strokeWidth="1.2"
          opacity="0"
        />
      ))}

      {/* Planeta: atmósfera, esfera con volumen, haz de luz en el borde e isotipo */}
      <motion.g
        animate={{ scale: [1, 1.035, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      >
        <circle cx={CX} cy={CY} r={PLANET_R + 22} fill={`url(#${atmoId})`} />
        <circle cx={CX} cy={CY} r={PLANET_R + 8} fill="none" stroke="#94b2fc" strokeWidth="5" opacity="0.3" filter={`url(#${blurId})`} />
        <circle cx={CX} cy={CY} r={PLANET_R} fill={`url(#${sphereId})`} stroke="#c7d7ff" strokeWidth="2" />
        <circle cx={CX} cy={CY} r={PLANET_R} fill={`url(#${shadeId})`} />
        {/* Haz que recorre el borde del planeta */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          <circle
            cx={CX}
            cy={CY}
            r={PLANET_R + 1.5}
            fill="none"
            stroke={`url(#${sweepId})`}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="200 400"
          />
        </motion.g>
        <image href={`${BASE}/isotipo.png`} x={CX - 50} y={CY - 50} width="100" height="100" />
      </motion.g>

      {/* Luz en órbita, con estela — va por encima del disco para que pase por delante */}
      {TRAIL.map((d, i) => (
        <circle
          key={d}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          cx={start.x}
          cy={start.y}
          r={3.5 - i * 0.7}
          fill="#b8f21e"
          opacity={0.45 - i * 0.1}
        />
      ))}
      <circle ref={glowRef} cx={start.x} cy={start.y} r="10" fill="#b8f21e" opacity="0.25" />
      <circle ref={dotRef} cx={start.x} cy={start.y} r="5" fill="#b8f21e" />
    </motion.svg>
  );
}

/* ───────────────────────── Galaxia ───────────────────────── */

type Star = {
  /** Radio normalizado (0–1) y ángulo inicial en radianes. */
  r: number;
  a: number;
  size: number;
  base: number;
  phase: number;
  speed: number;
  /** 0 = blanco escarcha, 1 = azul pulso, 2 = lima (muy raras). */
  tint: 0 | 1 | 2;
  /** Las más brillantes llevan destello en cruz. */
  sparkle: boolean;
};

type Cloud = {
  r: number;
  a: number;
  /** Radio del manchón como fracción del radio de la galaxia. */
  size: number;
  alpha: number;
  color: string;
};

type Meteor = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  len: number;
  t0: number;
  dur: number;
};

const TINTS = ["236,239,255", "148,178,252", "184,242,30"] as const;

/** Generador determinista: mismas estrellas en cada visita, sin sorpresas. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ARMS = 3;
/** Cuánto se enrosca cada brazo de dentro a fuera. */
const WIND = Math.PI * 1.7;

function makeGalaxy() {
  const rnd = mulberry32(20260907);
  // Dos tiradas sumadas: la dispersión se concentra en el eje del brazo
  const bell = () => (rnd() + rnd() - 1) * 0.5;
  const armAngle = (arm: number, r: number, spread: number) => (arm * Math.PI * 2) / ARMS + r * WIND + spread;

  const stars: Star[] = [];
  // Brazos en espiral, más densos hacia el centro
  for (let i = 0; i < 560; i++) {
    const r = 0.13 + 0.87 * Math.pow(rnd(), 0.75);
    const bright = rnd() < 0.1;
    const tintRoll = rnd();
    stars.push({
      r,
      a: armAngle(i % ARMS, r, bell() * (0.28 + 0.55 * r)),
      size: bright ? 1.5 + rnd() * 1 : 0.6 + rnd() * 0.8,
      base: bright ? 0.7 + rnd() * 0.3 : 0.35 + rnd() * 0.55,
      phase: rnd() * Math.PI * 2,
      speed: 0.4 + rnd() * 1.1,
      tint: tintRoll < 0.04 ? 2 : tintRoll < 0.34 ? 1 : 0,
      sparkle: bright && rnd() < 0.5,
    });
  }
  // Polvo de fondo, repartido sin patrón
  for (let i = 0; i < 180; i++) {
    stars.push({
      r: 0.16 + 0.84 * Math.sqrt(rnd()),
      a: rnd() * Math.PI * 2,
      size: 0.4 + rnd() * 0.6,
      base: 0.15 + rnd() * 0.3,
      phase: rnd() * Math.PI * 2,
      speed: 0.3 + rnd() * 0.8,
      tint: rnd() < 0.5 ? 1 : 0,
      sparkle: false,
    });
  }

  // Nebulosas: manchones de color que siguen los brazos
  const clouds: Cloud[] = [];
  for (let i = 0; i < 18; i++) {
    const r = 0.18 + 0.7 * rnd();
    const roll = rnd();
    clouds.push({
      r,
      a: armAngle(i % ARMS, r, bell() * 0.3),
      size: 0.1 + rnd() * 0.16,
      alpha: 0.05 + rnd() * 0.07,
      color: roll < 0.55 ? "26,77,255" : roll < 0.9 ? "148,178,252" : "125,227,195",
    });
  }
  return { stars, clouds };
}

/** Una vuelta completa de la galaxia. Casi imperceptible: se nota, no se ve. */
const GALAXY_PERIOD_MS = 240_000;

/**
 * Cielo de fondo dibujado en canvas: una galaxia espiral que gira muy despacio
 * alrededor del núcleo de Asenix (se mide la posición real del SVG de la
 * órbita para que el centro coincida). Nebulosas de color en los brazos,
 * estrellas con halo y destello, alguna estrella fugaz cada pocos segundos y
 * un poco de paralaje con el scroll. Las estrellas del interior giran algo
 * más deprisa que las del borde, como en una galaxia de verdad. Se para
 * cuando la sección no está en pantalla y con prefers-reduced-motion queda
 * como un fotograma fijo, sin fugaces.
 */
function Galaxy({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { stars, clouds } = makeGalaxy();
    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let radius = 0;
    let dpr = 1;
    let raf = 0;
    let visible = false;
    let meteor: Meteor | null = null;
    let nextMeteor = performance.now() + 2500;

    const measure = () => {
      const rect = section.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      // El centro de la galaxia es el núcleo de la órbita que esté visible
      cx = w / 2;
      cy = h / 2;
      section.querySelectorAll<SVGSVGElement>("[data-orbit]").forEach((svg) => {
        const r = svg.getBoundingClientRect();
        if (r.width > 0) {
          cx = r.left - rect.left + r.width / 2;
          cy = r.top - rect.top + r.height / 2;
        }
      });
      radius = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy));
    };

    const spawnMeteor = (now: number) => {
      const fromLeft = Math.random() < 0.5;
      const speed = 0.9 + Math.random() * 0.5; // px por ms
      const angle = (Math.random() * 0.35 + 0.35) * (fromLeft ? 1 : -1); // en diagonal, hacia abajo
      meteor = {
        x: fromLeft ? Math.random() * w * 0.5 : w * 0.5 + Math.random() * w * 0.5,
        y: Math.random() * h * 0.4,
        dx: Math.cos(angle) * speed * (fromLeft ? 1 : -1),
        dy: Math.abs(Math.sin(angle)) * speed,
        len: 120 + Math.random() * 120,
        t0: now,
        dur: 550 + Math.random() * 350,
      };
      nextMeteor = now + 3500 + Math.random() * 5500;
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const spin = (now / GALAXY_PERIOD_MS) * Math.PI * 2;
      const t = now / 1000;
      // Paralaje: el cielo se desplaza un poco menos que la página
      const py = reduced ? 0 : -section.getBoundingClientRect().top * 0.06;

      // Nebulosas, sumadas en luz para que se fundan entre sí
      ctx.globalCompositeOperation = "lighter";
      for (const c of clouds) {
        const a = c.a + spin * (1.5 - 0.8 * c.r);
        const d = c.r * radius;
        const x = cx + Math.cos(a) * d;
        const y = cy + Math.sin(a) * d + py * 0.5;
        const rad = c.size * radius;
        const breathe = 0.85 + 0.15 * Math.sin(t * 0.25 + c.a);
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, `rgba(${c.color},${c.alpha * breathe})`);
        g.addColorStop(1, `rgba(${c.color},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      }
      ctx.globalCompositeOperation = "source-over";

      for (const s of stars) {
        // Rotación diferencial: dentro más rápido, fuera más lento
        const a = s.a + spin * (1.5 - 0.8 * s.r);
        const d = s.r * radius;
        const x = cx + Math.cos(a) * d;
        const y = cy + Math.sin(a) * d + py * (0.6 + 0.8 * s.r);
        if (x < -6 || y < -6 || x > w + 6 || y > h + 6) continue;
        const tw = 0.6 + 0.4 * Math.sin(t * s.speed + s.phase);
        const alpha = s.base * tw;
        const rgb = TINTS[s.tint];
        ctx.fillStyle = `rgba(${rgb},${alpha})`;
        if (s.size > 1.2) {
          ctx.beginPath();
          ctx.arc(x, y, s.size, 0, Math.PI * 2);
          ctx.fill();
          // Halo tenue: las estrellas grandes «brillan» sin usar shadowBlur (caro)
          ctx.fillStyle = `rgba(${rgb},${alpha * 0.18})`;
          ctx.beginPath();
          ctx.arc(x, y, s.size * 3.2, 0, Math.PI * 2);
          ctx.fill();
          if (s.sparkle) {
            // Destello en cruz que crece y se apaga con el parpadeo
            const L = s.size * (3 + 5 * tw);
            ctx.strokeStyle = `rgba(${rgb},${alpha * 0.5})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(x - L, y);
            ctx.lineTo(x + L, y);
            ctx.moveTo(x, y - L);
            ctx.lineTo(x, y + L);
            ctx.stroke();
          }
        } else {
          ctx.fillRect(x - s.size / 2, y - s.size / 2, s.size, s.size);
        }
      }

      // Estrella fugaz
      if (!reduced) {
        if (!meteor && now >= nextMeteor) spawnMeteor(now);
        if (meteor) {
          const q = (now - meteor.t0) / meteor.dur;
          if (q >= 1) {
            meteor = null;
          } else {
            const hx = meteor.x + meteor.dx * (now - meteor.t0);
            const hy = meteor.y + meteor.dy * (now - meteor.t0);
            const norm = Math.hypot(meteor.dx, meteor.dy);
            const tx = hx - (meteor.dx / norm) * meteor.len;
            const ty = hy - (meteor.dy / norm) * meteor.len;
            const fade = Math.sin(q * Math.PI); // entra y sale suave
            const g = ctx.createLinearGradient(tx, ty, hx, hy);
            g.addColorStop(0, "rgba(236,239,255,0)");
            g.addColorStop(1, `rgba(236,239,255,${0.9 * fade})`);
            ctx.strokeStyle = g;
            ctx.lineWidth = 1.4;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(hx, hy);
            ctx.stroke();
            ctx.fillStyle = `rgba(255,255,255,${fade})`;
            ctx.beginPath();
            ctx.arc(hx, hy, 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    measure();
    if (reduced) draw(0);

    const ro = new ResizeObserver(() => {
      measure();
      if (reduced || !visible) draw(reduced ? 0 : performance.now());
    });
    ro.observe(section);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduced) raf = requestAnimationFrame(loop);
    });
    io.observe(section);

    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [sectionRef]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0" />;
}
