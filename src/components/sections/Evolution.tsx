"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useDict } from "@/i18n/LocaleContext";

/**
 * Una frase del viaje, atada al scroll («scrub»): no hay estados ni retardos.
 * Cada frase tiene su tramo del recorrido; entra en el primer tercio del tramo,
 * se mantiene en el centro y sale en el último tercio, encadenada con la
 * siguiente. Solo opacidad, un leve desplazamiento y escala: nada de desenfoque. La primera ya está en pantalla al llegar y la última se queda.
 */
function Stage({
  progress,
  index,
  total,
  label,
  sub,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  label: string;
  sub: string;
}) {
  const span = 1 / total;
  const start = index * span;
  const end = start + span;
  const fade = span * 0.3;
  const first = index === 0;
  const last = index === total - 1;

  // Puntos clave del tramo: [entra … llega | se mantiene | se va … fuera]. Siempre
  // crecientes (framer no admite repetidos); la primera y la última frase se
  // distinguen por los valores de salida, no por los puntos.
  const keys = [start, start + fade, end - fade, end];
  const opacity = useTransform(progress, keys, [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const y = useTransform(progress, keys, [first ? 0 : 60, 0, 0, last ? 0 : -60]);
  const scale = useTransform(progress, keys, [first ? 1 : 0.96, 1, 1, last ? 1 : 1.03]);

  return (
    // Sin desenfoque: las frases se funden limpias, no se deshacen en polvo
    <motion.div
      style={{ opacity, y, scale }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center will-change-transform"
    >
      {/* Figma: Montserrat SemiBold 85, tracking -0,05 em, azul de marca; sub 24/28 blanco */}
      <h3 className="max-w-u-1444 font-display fs-u-85 font-semibold leading-none tracking-[-0.05em] text-electric text-balance">
        {label}
      </h3>
      <p className="mt-u-30 max-w-u-1004 fs-u-24 lh-u-28 text-white">{sub}</p>
    </motion.div>
  );
}

/**
 * Sección 2 — «El futuro de los negocios».
 * Viaje de scroll fijado: la cámara avanza por el espacio digital mientras
 * cada una de las tres frases del Figma («Diseñamos la experiencia»,
 * «Automatizamos el sistema», «Construimos la inteligencia») entra en foco en
 * azul de marca y se disuelve en la siguiente. Todo va atado al scroll: cada
 * frase ocupa 100vh de recorrido y el fundido entre dos frases dura 30vh.
 */
export default function Evolution() {
  const ref = useRef<HTMLElement>(null);
  const t = useDict().evolution;
  const total = t.stages.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const starsY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const gridScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const gridOpacity = useTransform(scrollYProgress, [0.7, 0.95], [0.14, 0]);

  return (
    <section ref={ref} id="future" className="relative h-[300vh] bg-void">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        {/* Espacio digital: estrellas en parallax */}
        <motion.div
          style={{ y: starsY }}
          aria-hidden
          className="absolute -inset-y-[15%] inset-x-0 opacity-60"
        >
          {Array.from({ length: 70 }).map((_, i) => (
            <span
              key={i}
              className="animate-twinkle absolute h-px w-px rounded-full bg-frost"
              style={{
                left: `${(i * 137.5) % 100}%`,
                top: `${(i * 61.8) % 100}%`,
                opacity: 0.15 + ((i * 7) % 10) / 18,
                animationDelay: `${(i % 9) * 0.45}s`,
                boxShadow: i % 6 === 0 ? "0 0 6px rgba(148,178,252,0.9)" : undefined,
              }}
            />
          ))}
        </motion.div>
        <motion.div
          style={{ scale: gridScale, opacity: gridOpacity }}
          aria-hidden
          className="absolute inset-0"
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(94,130,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(94,130,255,0.35) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              maskImage: "radial-gradient(ellipse at center, black 25%, transparent 72%)",
            }}
          />
        </motion.div>

        {/* Etiqueta de sección, fija arriba */}
        <div className="absolute left-1/2 top-[12vh] w-full -translate-x-1/2 text-center">
          <p className="eyebrow">{t.eyebrow}</p>
        </div>

        {/* Etapas, atadas al scroll */}
        <div className="relative h-full w-full">
          {t.stages.map((st, i) => (
            <Stage key={st.label} progress={scrollYProgress} index={i} total={total} label={st.label} sub={st.sub} />
          ))}
        </div>

        {/* Raíl de progreso */}
        <div className="absolute bottom-[10vh] left-1/2 w-56 -translate-x-1/2">
          <div className="h-px w-full bg-white/10">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="h-full w-full origin-left bg-gradient-to-r from-electric to-pulse"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
