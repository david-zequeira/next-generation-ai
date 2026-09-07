"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";

/** Cifras de cada tarjeta — los textos viven en el diccionario, por índice. */
const STATS = [
  { prefix: "+", value: 40, suffix: "%" },
  { prefix: "", value: 40, suffix: "h" },
  { prefix: "", value: 3, suffix: "×" },
  { prefix: "", value: 100, suffix: "%" },
];

function Counter({ prefix, value, suffix }: { prefix: string; value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v.toFixed(0)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/** Silueta de persona en verde menta — la figura del Figma, en SVG. */
function Person() {
  return (
    <svg viewBox="0 0 120 130" className="h-full w-auto" aria-hidden>
      <defs>
        <linearGradient id="personGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7de3c3" />
          <stop offset="100%" stopColor="#4fb6a0" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="40" r="30" fill="url(#personGrad)" />
      <path d="M 8 130 A 52 52 0 0 1 112 130 Z" fill="url(#personGrad)" />
      <path d="M 22 130 A 38 38 0 0 1 98 130 Z" fill="#1a4dff" opacity="0.9" />
    </svg>
  );
}

/**
 * Sección 7 — «Pruebas, no promesas» (Figma). La página se fija y el viaje
 * sigue de lado: cada tarjeta trae un resultado (+ Clientes, + Tiempo…) con
 * su panel azul y su cifra, que cuenta hacia arriba al entrar en escena.
 */
export default function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { locale, dict } = useLocale();
  const t = dict.work;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const amount = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -amount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${amount()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="work" ref={sectionRef} className="relative overflow-hidden bg-void">
      <div className="flex min-h-svh items-center">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 py-24 [scrollbar-width:none] md:snap-none md:gap-8 md:overflow-x-visible md:px-[10vw] [&::-webkit-scrollbar]:hidden"
        >
          {/* Panel de introducción */}
          <div className="flex w-[82vw] shrink-0 snap-center flex-col justify-center md:w-[30vw]" key={locale}>
            <h2 className="display text-[clamp(2.2rem,4.2vw,3.2rem)] text-white">{t.title}</h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-frost/85 md:text-lg">{t.sub}</p>
            <a
              href="#roi"
              className="group mt-8 inline-flex items-center gap-2 font-display text-sm font-medium text-neon transition-colors hover:text-white"
            >
              {t.link}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <p className="mt-10 text-[11px] text-mist/70">{t.disclaimer}</p>
          </div>

          {STATS.map((s, i) => {
            const study = t.studies[i];
            return (
              <article
                key={`${study.headline}-${locale}`}
                className="card-navy group relative w-[86vw] shrink-0 snap-center overflow-hidden rounded-[26px] p-6 transition-shadow duration-500 hover:shadow-[0_0_120px_-30px_rgba(125,227,195,0.35)] md:w-[46vw] md:p-9"
              >
                {/* Halo menta que se enciende al acercarse — el brillo del Figma */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-mint/20 opacity-30 blur-3xl transition-opacity duration-700 group-hover:opacity-70"
                />
                <div className="relative grid gap-8 md:grid-cols-[1fr_1.15fr] md:items-center">
                  <div>
                    <h3 className="font-display text-[clamp(1.8rem,2.8vw,2.3rem)] font-semibold text-neon">
                      <span className="mr-2">+</span>
                      {study.headline}
                    </h3>
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">{study.story}</p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 24, rotate: 1.5 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="card-blue relative flex min-h-[220px] items-end justify-between overflow-hidden rounded-2xl p-5"
                  >
                    <div className="absolute left-5 top-5 flex flex-col items-start gap-2">
                      {study.chips.map((c, j) => (
                        <motion.span
                          key={c}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.4 + j * 0.2 }}
                          className="rounded-full bg-[#0b1435]/85 px-3.5 py-1.5 text-[11px] font-medium text-white ring-1 ring-white/15"
                        >
                          {c}
                        </motion.span>
                      ))}
                    </div>
                    <div className="relative z-10">
                      <p className="font-display text-[clamp(2rem,3.2vw,2.6rem)] font-medium leading-none text-white">
                        <Counter prefix={s.prefix} value={s.value} suffix={s.suffix} />
                      </p>
                      <p className="mt-1.5 text-sm text-neon">{study.statLabel}</p>
                    </div>
                    <div className="absolute -bottom-2 right-4 h-[150px]">
                      <Person />
                    </div>
                  </motion.div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
