"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";

/**
 * Cifras de cada tarjeta — los textos viven en el diccionario, por índice.
 * Tres tarjetas, como pide el diseño; la primera es la destacada (con sombra).
 */
const STATS = [
  { prefix: "+", value: 40, suffix: "%" },
  { prefix: "", value: 40, suffix: "h" },
  { prefix: "", value: 3, suffix: "×" },
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

/** Silueta de persona — la figura del Figma, en degradado verde → cian (#1cfcb9 → #38d4ff). */
function Person() {
  return (
    <svg viewBox="0 0 120 130" className="h-full w-auto" aria-hidden>
      <defs>
        <linearGradient id="personGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1cfcb9" />
          <stop offset="100%" stopColor="#38d4ff" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="40" r="30" fill="url(#personGrad)" />
      <path d="M 8 130 A 52 52 0 0 1 112 130 Z" fill="url(#personGrad)" />
    </svg>
  );
}

/**
 * Sección 7 — «Pruebas no promesas» (Figma). La página se fija y el viaje
 * sigue de lado: tres tarjetas (826×365) con un resultado (+ Clientes, + Tiempo…),
 * su panel azul y su cifra, que cuenta hacia arriba al entrar en escena.
 * Medidas en px del Figma a 1920 (utilidades *-u-N).
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
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 py-24 [scrollbar-width:none] md:snap-none md:gap-u-52 md:overflow-x-visible md:px-[12.5vw] [&::-webkit-scrollbar]:hidden"
        >
          {/* Panel de introducción — Figma: H2 700 52/54, sub 400 18/28 #c7d7ff, enlace verde */}
          <div className="flex w-[82vw] shrink-0 snap-center flex-col justify-center md:w-[24vw]" key={locale}>
            <h2 className="max-w-u-455 font-display fs-u-52 lh-u-54 font-bold text-white text-balance">{t.title}</h2>
            <p className="mt-u-40 max-w-u-390 fs-u-18 lh-u-28 text-cloud">{t.sub}</p>
            <a
              href="#roi"
              className="group mt-u-56 inline-flex items-center gap-u-8 font-display fs-u-18 font-medium text-mint transition-colors hover:text-white"
            >
              {t.link}
              <ArrowRight className="size-u-18 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <p className="mt-u-40 fs-u-12 text-mist/70">{t.disclaimer}</p>
          </div>

          {STATS.map((s, i) => {
            const study = t.studies[i];
            const featured = i === 0;
            return (
              <article
                key={`${study.headline}-${locale}`}
                style={{ ["--ring-w" as string]: "2px" }}
                // Figma: 826×365, radio 25, degradado 247° #101837→#050b21, borde cónico de 2 px;
                // solo la principal proyecta la sombra azul
                className={cn(
                  "ring-conic card-navy group relative w-[86vw] shrink-0 snap-center rounded-u-25 pb-u-38 pl-u-53 pr-u-37 pt-u-38 transition-shadow duration-500 md:w-[43vw]",
                  featured && "shadow-[0_0_150px_rgba(26,77,255,0.5),0_0_80px_3px_rgba(26,77,255,0.5)]"
                )}
              >
                <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
                  <div className="pt-u-73">
                    {/* Figma: «+ Clientes» Montserrat Medium 45/48 azul; historia Light 20/25 #597eff */}
                    <h3 className="font-display fs-u-45 lh-u-48 font-medium text-electric">
                      <span className="mr-2">+</span>
                      {study.headline}
                    </h3>
                    <p className="mt-u-10 max-w-u-254 pl-u-42 fs-u-20 lh-u-25 font-light text-[#597eff]">{study.story}</p>
                  </div>

                  {/* Panel azul — Figma: 376×290, radio 16, degradado #1a4dff 21 % → #03259b */}
                  <motion.div
                    initial={{ opacity: 0, y: 24, rotate: 1.5 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex h-u-290 w-full items-end justify-between overflow-hidden rounded-u-16 bg-[linear-gradient(180deg,#1a4dff_21%,#03259b_100%)] p-u-25 md:w-u-376"
                  >
                    <div className="absolute left-u-25 top-u-28 flex flex-col items-start gap-u-7">
                      {study.chips.map((c, j) => (
                        <motion.span
                          key={c}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.4 + j * 0.2 }}
                          className="flex h-u-45 items-center rounded-u-20 bg-[linear-gradient(180deg,#182a6d_0%,#101837_100%)] px-u-19 fs-u-15 font-medium text-frost"
                        >
                          {c}
                        </motion.span>
                      ))}
                    </div>
                    <div className="relative z-10">
                      <p className="font-display fs-u-35 font-semibold leading-none text-white">
                        <Counter prefix={s.prefix} value={s.value} suffix={s.suffix} />
                      </p>
                      <p className="mt-u-8 fs-u-20 text-mint">{study.statLabel}</p>
                    </div>
                    <div className="absolute -bottom-1 right-u-24 h-u-197">
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
