"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useDict } from "@/i18n/LocaleContext";

/**
 * Sección 2 — «El futuro de los negocios».
 * Viaje de scroll fijado: la cámara avanza por el espacio digital mientras
 * cada era del negocio entra en foco y se disuelve en la siguiente. El viaje
 * termina en la frase del Figma («Diseñamos la experiencia.») en azul, que es
 * lo que queda en pantalla cuando el visitante suelta el scroll.
 */
export default function Evolution() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const t = useDict().evolution;
  // Las etapas + el cierre comparten el mismo carrusel de scroll
  const total = t.stages.length + 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(total - 1, Math.max(0, Math.floor(v * total))));
  });

  const starsY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const gridScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const gridOpacity = useTransform(scrollYProgress, [0.7, 0.95], [0.14, 0]);

  const stageState = (i: number) => {
    const isActive = i === active;
    const isPast = i < active;
    return {
      opacity: isActive ? 1 : 0,
      scale: isActive ? 1 : isPast ? 1.16 : 0.84,
      y: isActive ? 0 : isPast ? -48 : 48,
      filter: isActive ? "blur(0px)" : "blur(16px)",
    };
  };

  return (
    <section ref={ref} id="future" className="relative h-[500vh] bg-void">
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
          <p className="eyebrow eyebrow-muted">{t.eyebrow}</p>
        </div>

        {/* Etapas: la activa enfoca; el resto se disuelve */}
        <div className="relative h-full w-full">
          {t.stages.map((s, i) => (
            <motion.div
              key={s.label}
              initial={false}
              animate={stageState(i)}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            >
              <span className="mb-6 font-display text-xs font-light tracking-[0.4em] text-mist">
                {String(i + 1).padStart(2, "0")} / {String(t.stages.length).padStart(2, "0")}
              </span>
              {/* La etapa "IA" rompe la escala: dos letras del tamaño del mundo */}
              <h3
                className={`display text-white ${
                  i === 2 ? "text-[clamp(6rem,24vw,20rem)]" : "text-[clamp(2.4rem,6.5vw,5.5rem)]"
                }`}
              >
                {s.label}
              </h3>
              <p className="mt-6 max-w-md text-base font-light text-mist md:text-lg">{s.sub}</p>
            </motion.div>
          ))}

          {/* Cierre — la frase del Figma, en el azul de la marca */}
          <motion.div
            initial={false}
            animate={stageState(total - 1)}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <h2 className="display text-gradient text-[clamp(2.4rem,6.5vw,5.6rem)] font-semibold tracking-[-0.03em]">
              {t.finalTitle}
            </h2>
            <p className="mt-7 max-w-xl text-balance text-base leading-relaxed text-frost/85 md:text-lg">
              {t.finalSub}
            </p>
          </motion.div>
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
