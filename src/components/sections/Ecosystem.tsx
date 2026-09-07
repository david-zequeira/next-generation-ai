"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/* ───────────────────────── Órbita ───────────────────────── */

const CX = 240;
const CY = 160;
const RX = 220;
const RY = 120;
/** Inclinación de la órbita en grados (la misma que dibuja el SVG). */
const TILT = -18;
/** Trayectoria elíptica de la línea — el punto de luz la recorre por cálculo. */
const ORBIT_PATH = "M 20 160 A 220 120 0 1 1 460 160 A 220 120 0 1 1 20 160";
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
      className="group w-full max-w-[250px]"
    >
      <div
        className={cn(
          "flex items-center justify-between gap-4 border-b pb-2.5 transition-colors duration-700",
          active ? "border-neon/60" : "border-pulse/25"
        )}
      >
        <span
          className={cn(
            "font-display text-[15px] font-medium transition-colors duration-700",
            active ? "text-neon" : "text-white group-hover:text-pulse"
          )}
        >
          {title}
        </span>
        <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
          {active && (
            <span aria-hidden className="animate-ring absolute inset-0 rounded-full border border-neon/70" />
          )}
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full font-display text-[11px] font-bold transition-all duration-700",
              active ? "bg-neon text-ink shadow-[0_0_18px_rgba(184,242,30,0.55)]" : "bg-[#0d1a4d] text-white ring-1 ring-pulse/40"
            )}
          >
            {n}
          </span>
        </span>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-mist">{desc}</p>
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

  return (
    <section
      id="ecosystem"
      ref={sectionRef}
      className="relative overflow-hidden border-y border-line bg-[#02040f] py-28 md:py-36"
    >
      <Galaxy sectionRef={sectionRef} />
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
              <Step n={6} title={s[5].title} desc={s[5].desc} active={active === 5} delay={0.5} />
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
              <Step n={5} title={s[4].title} desc={s[4].desc} active={active === 4} delay={0.4} />
            </ul>
          </div>

          {/* Centro: paso 1, órbita, paso 4 */}
          <div className="flex flex-col items-center gap-6">
            <ul className="flex justify-center">
              <Step n={1} title={s[0].title} desc={s[0].desc} active={active === 0} />
            </ul>
            <Orbit ariaLabel={t.svgAria} onStep={setActive} />
            <ul className="flex justify-center">
              <Step n={4} title={s[3].title} desc={s[3].desc} active={active === 3} delay={0.3} />
            </ul>
          </div>

          {/* Derecha */}
          <div className="flex flex-col items-start gap-10">
            <ul className="flex w-full flex-col items-start gap-10">
              <Step n={2} title={s[1].title} desc={s[1].desc} active={active === 1} delay={0.1} />
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
              <Step n={3} title={s[2].title} desc={s[2].desc} active={active === 2} delay={0.2} />
            </ul>
          </div>
        </div>

        {/* Móvil y tablet: órbita arriba, pasos en lista */}
        <div className="mt-14 lg:hidden">
          <h3 className="display text-center text-2xl font-semibold text-white">
            {t.left} <span className="text-pulse">·</span> {t.right}
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

/**
 * El núcleo: isotipo dentro de un disco blanco que respira, con su órbita y
 * su punto de luz. La luz se mueve por rAF (no por `animateMotion`) para
 * saber en cada instante a qué paso apunta y avisar arriba. Las dos órbitas
 * (escritorio y móvil) comparten reloj, así que nunca discrepan.
 */
function Orbit({ ariaLabel, onStep }: { ariaLabel: string; onStep: (i: number) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const trailRefs = useRef<(SVGCircleElement | null)[]>([]);
  // Hay dos órbitas en el DOM (escritorio y móvil, una oculta): si comparten
  // ids de degradado, la oculta se lleva la referencia y la visible sale sin línea
  const uid = useId();
  const glowId = `core-glow-${uid}`;
  const lineId = `orbit-line-${uid}`;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let visible = false;
    let last = -1;
    let flashAt = -Infinity;

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

      const step = stepAt(p.x, p.y);
      if (step !== last) {
        last = step;
        flashAt = now;
        onStep(step);
      }
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
  }, [onStep]);

  const start = orbitPoint(Math.PI);

  return (
    <motion.svg
      ref={svgRef}
      data-orbit
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
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#94b2fc" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#1a4dff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={lineId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94b2fc" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#1a4dff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#94b2fc" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Halo */}
      <circle cx={CX} cy={CY} r="150" fill={`url(#${glowId})`} />

      {/* Órbita inclinada */}
      <g transform={`rotate(${TILT} ${CX} ${CY})`}>
        <path d={ORBIT_PATH} fill="none" stroke={`url(#${lineId})`} strokeWidth="1.2" />
      </g>

      {/* Disco blanco que respira */}
      <motion.g
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      >
        <circle cx={CX} cy={CY} r="78" fill="#ffffff" opacity="0.08" />
        <circle cx={CX} cy={CY} r="66" fill="#f4f6ff" />
        <image href={`${BASE}/isotipo.png`} x={CX - 40} y={CY - 40} width="80" height="80" />
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
          r={3 - i * 0.6}
          fill="#b8f21e"
          opacity={0.45 - i * 0.1}
        />
      ))}
      <circle ref={glowRef} cx={start.x} cy={start.y} r="9" fill="#b8f21e" opacity="0.25" />
      <circle ref={dotRef} cx={start.x} cy={start.y} r="4" fill="#b8f21e" />
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
  /** 0 = blanco escarcha, 1 = azul pulso. */
  tint: number;
};

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

function makeStars(): Star[] {
  const rnd = mulberry32(20260907);
  // Dos tiradas sumadas: la dispersión se concentra en el eje del brazo
  const bell = () => (rnd() + rnd() - 1) * 0.5;
  const stars: Star[] = [];
  const ARMS = 3;
  const WIND = Math.PI * 1.7; // cuánto se enrosca cada brazo de dentro a fuera

  // Brazos en espiral, más densos hacia el centro
  for (let i = 0; i < 520; i++) {
    const arm = i % ARMS;
    const r = 0.13 + 0.87 * Math.pow(rnd(), 0.75);
    const spread = bell() * (0.28 + 0.55 * r); // los brazos se abren hacia fuera
    const a = (arm * Math.PI * 2) / ARMS + r * WIND + spread;
    const bright = rnd() < 0.1;
    stars.push({
      r,
      a,
      size: bright ? 1.5 + rnd() * 0.9 : 0.6 + rnd() * 0.8,
      base: bright ? 0.7 + rnd() * 0.3 : 0.35 + rnd() * 0.55,
      phase: rnd() * Math.PI * 2,
      speed: 0.4 + rnd() * 1.1,
      tint: rnd() < 0.3 ? 1 : 0,
    });
  }
  // Polvo de fondo, repartido sin patrón
  for (let i = 0; i < 160; i++) {
    stars.push({
      r: 0.16 + 0.84 * Math.sqrt(rnd()),
      a: rnd() * Math.PI * 2,
      size: 0.4 + rnd() * 0.6,
      base: 0.15 + rnd() * 0.3,
      phase: rnd() * Math.PI * 2,
      speed: 0.3 + rnd() * 0.8,
      tint: rnd() < 0.5 ? 1 : 0,
    });
  }
  return stars;
}

/** Una vuelta completa de la galaxia. Casi imperceptible: se nota, no se ve. */
const GALAXY_PERIOD_MS = 240_000;

/**
 * Cielo de fondo dibujado en canvas: una galaxia espiral que gira muy despacio
 * alrededor del núcleo de Asenix (se mide la posición real del SVG de la
 * órbita para que el centro coincida). Las estrellas del interior giran algo
 * más deprisa que las del borde, como en una galaxia de verdad. Se para
 * cuando la sección no está en pantalla y con prefers-reduced-motion queda
 * como un fotograma fijo.
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
    const stars = makeStars();
    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let radius = 0;
    let dpr = 1;
    let raf = 0;
    let visible = false;

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

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const spin = (now / GALAXY_PERIOD_MS) * Math.PI * 2;
      const t = now / 1000;
      for (const s of stars) {
        // Rotación diferencial: dentro más rápido, fuera más lento
        const a = s.a + spin * (1.5 - 0.8 * s.r);
        const d = s.r * radius;
        const x = cx + Math.cos(a) * d;
        const y = cy + Math.sin(a) * d;
        if (x < -4 || y < -4 || x > w + 4 || y > h + 4) continue;
        const tw = 0.6 + 0.4 * Math.sin(t * s.speed + s.phase);
        const alpha = s.base * tw;
        ctx.fillStyle = s.tint ? `rgba(148,178,252,${alpha})` : `rgba(236,239,255,${alpha})`;
        if (s.size > 1.2) {
          ctx.beginPath();
          ctx.arc(x, y, s.size, 0, Math.PI * 2);
          ctx.fill();
          // Halo tenue: las estrellas grandes «brillan» sin usar shadowBlur (caro)
          ctx.fillStyle = s.tint ? `rgba(148,178,252,${alpha * 0.18})` : `rgba(236,239,255,${alpha * 0.18})`;
          ctx.beginPath();
          ctx.arc(x, y, s.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(x - s.size / 2, y - s.size / 2, s.size, s.size);
        }
      }
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    measure();
    if (reduced) {
      draw(0);
    }

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
