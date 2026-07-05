"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TextReveal from "@/components/ui/TextReveal";
import { useLocale } from "@/i18n/LocaleContext";

const ROTATION_MS = 7000;

/**
 * Sección 9 — Testimonios como teatro tipográfico: una sola voz cada vez,
 * a escala monumental, bajo una comilla-arquitectura hueca. Sin cards, sin
 * marquee — la palabra del cliente ES la escena. Rota sola; el visitante
 * puede dirigir con los indicadores.
 */
export default function Testimonials() {
  const { locale, dict } = useLocale();
  const t = dict.testimonials;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % t.items.length),
      ROTATION_MS
    );
    return () => clearInterval(id);
  }, [paused, t.items.length]);

  const item = t.items[index];

  return (
    <section className="relative overflow-hidden bg-void py-32 md:py-44">
      {/* Atmósfera: bruma violeta lateral — mundo de voces */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/3 h-[440px] w-[440px] rounded-full bg-pulse/[0.06] blur-[120px]"
      />

      <div className="mx-auto max-w-5xl px-6" key={locale}>
        <div className="text-center">
          <p className="eyebrow mb-6">{t.eyebrow}</p>
          <TextReveal
            text={t.title}
            className="text-[clamp(2.2rem,5.5vw,4.75rem)] text-frost"
          />
        </div>

        {/* Escenario de la cita */}
        <div
          className="relative mt-14 md:mt-20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Comilla monumental hueca — arquitectura, no decoración */}
          <span
            aria-hidden
            className="text-outline pointer-events-none absolute -top-14 left-0 select-none font-display text-[10rem] font-bold leading-none md:-top-20 md:text-[15rem]"
          >
            &ldquo;
          </span>

          <div className="relative flex min-h-[16rem] items-center md:min-h-[15rem]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
                initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full pl-6 md:pl-16"
              >
                <blockquote className="display max-w-4xl text-[clamp(1.35rem,3.2vw,2.6rem)] font-medium leading-[1.25] tracking-tight text-frost/95">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-8 flex items-baseline gap-3 text-sm">
                  <span className="text-pulse/80">{"//"}</span>
                  <span className="font-display font-semibold text-frost">
                    {item.name}
                  </span>
                  <span className="text-mist">{item.role}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Dirección: indicadores con progreso */}
          <div className="mt-10 flex gap-2.5 pl-6 md:pl-16">
            {t.items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1} / ${t.items.length}`}
                onClick={() => setIndex(i)}
                className="group relative h-4 w-10 cursor-pointer"
              >
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/15 transition-colors duration-300 group-hover:bg-white/30" />
                {i === index && (
                  <motion.span
                    layoutId="quote-progress"
                    className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 origin-left bg-gradient-to-r from-electric to-neon"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={
                      paused
                        ? { duration: 0.3 }
                        : { duration: ROTATION_MS / 1000, ease: "linear" }
                    }
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
