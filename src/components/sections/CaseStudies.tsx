"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Ilustración de cada tarjeta — el texto vive en el diccionario, por índice.
 *
 * `icon`: figura del Figma exportada desde su geometría a `public/icons/proof/`
 * (degradado #1cfcb9→#38d4ff), con su sitio dentro del panel azul de 376×290:
 *  - 179×197 pegada abajo, a 24 del borde derecho.
 *  - reloj de 104 centrado en vertical, a 62 del borde.
 *  - 162×197 pegada arriba, a 33 del borde.
 * `flip`: en la del medio el Figma pone la cifra arriba y los chips abajo.
 *
 * ---
 *
 * **Aquí vivían tres cifras inventadas (17/09/2026).** `+40 %` de conversión,
 * `−70 %` de trabajo manual y `3x` de capacidad, escritas a mano en este array
 * y animadas contando hacia arriba con `<Counter>` para que el ojo fuera justo
 * ahí — bajo un titular que las llamaba «Pruebas, no promesas» y con cero
 * clientes de pago de los que sacarlas.
 *
 * Se fueron con el contador. Lo que se pinta ahora sale del diccionario y es
 * comprobable sin salir de la página, así que no hay nada que animar: es un
 * rótulo, no un resultado.
 */
const CARDS: { icon: string; iconClass: string; flip?: boolean }[] = [
  { icon: "clientes", iconClass: "absolute -bottom-1 right-u-24 h-u-197 w-auto" },
  { icon: "tiempo", iconClass: "absolute right-u-62 top-1/2 size-u-104 -translate-y-1/2", flip: true },
  { icon: "eficacia", iconClass: "absolute right-u-33 top-0 h-u-197 w-auto" },
];

/**
 * Qué hace cada tarjeta al pulsarla. `chat` y `voice` lanzan los mismos eventos
 * globales que el hero y el cierre, así que la sección no describe el asistente:
 * lo abre. Es la única prueba que Asenix puede dar hoy, y no hace falta creerse
 * ninguna cifra para comprobarla.
 */
function runAction(action: string) {
  if (action === "chat") window.dispatchEvent(new CustomEvent("ng:open-chat"));
  else if (action === "voice") window.dispatchEvent(new CustomEvent("ng:open-voice"));
  // El salto a la calculadora va por hash, como todos los enlaces internos del
  // sitio (`/#services`, el «Haz la cuenta» de esta misma sección…). Ojo con la
  // alternativa evidente: `scrollIntoView({ behavior: "smooth" })` NO funciona
  // aquí — Lenis controla el scroll de la página con su propio rAF y se come el
  // desplazamiento suave nativo. Sin `behavior` sí iría, pero el hash es lo que
  // ya usa el resto y además deja la sección en la URL.
  else window.location.hash = "roi";
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
    <section id="work" ref={sectionRef} className="relative overflow-hidden bg-[linear-gradient(180deg,#030617_0%,#040b24_100%)]">
      <div className="flex min-h-svh items-center">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 py-24 [scrollbar-width:none] md:snap-none md:gap-u-52 md:overflow-x-visible md:px-[12.5vw] [&::-webkit-scrollbar]:hidden"
        >
          {/* Panel de introducción — Figma: H2 700 52/54, sub 400 20/28 #c7d7ff a 28, enlace verde 500 14/24 a 60 */}
          <div className="flex w-[82vw] shrink-0 snap-center flex-col justify-center md:w-[24vw]" key={locale}>
            <h2 className="max-w-u-455 font-display fs-u-52 lh-u-54 font-bold text-white text-balance">{t.title}</h2>
            <p className="mt-u-28 max-w-u-390 fs-u-20 lh-u-28 text-cloud">{t.sub}</p>
            <a
              href="#roi"
              className="link-mint group mt-u-60 inline-flex items-center gap-u-8 font-display transition-colors"
            >
              {t.link}
              <ArrowRight className="size-u-18 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <p className="mt-u-40 fs-u-12 text-mist/70">{t.disclaimer}</p>
          </div>

          {CARDS.map((s, i) => {
            const study = t.studies[i];
            // Las tres tarjetas con el mismo anillo de 2 px y el brillo azul de la destacada del Figma
            const featured = true;
            return (
              // La tarjeta entera es el botón: pulsarla abre el chat, la voz o
              // la calculadora. `text-left` porque <button> centra por defecto.
              <motion.button
                type="button"
                onClick={() => runAction(study.action)}
                aria-label={`${study.headline} — ${study.stat} ${study.statLabel}`}
                whileTap={{ scale: 0.995 }}
                key={`${study.headline}-${locale}`}
                style={{
                  ["--ring-w" as string]: featured ? "2px" : "1px",
                  ["--ring-bg" as string]: featured
                    ? "conic-gradient(#6994ff 12%, #1a4dff 50%, #6994ff 85%)"
                    : "conic-gradient(#6994ff 26%, #1a4dff 50%, #6994ff 74%)",
                }}
                // Figma: 826×365, radio 25, degradado 247° #101837→#050b21 a opacidad .5;
                // la destacada lleva borde cónico de 2 px (12/50/85 %) y la sombra azul,
                // el resto 1 px (26/50/74 %) sin sombra
                className={cn(
                  "ring-conic group relative cursor-pointer bg-[linear-gradient(247deg,rgba(16,24,55,.5),rgba(5,11,33,.5))] w-[86vw] shrink-0 snap-center rounded-u-25 pb-u-38 pl-u-53 pr-u-37 pt-u-38 text-left transition-shadow duration-500 md:w-[43vw]",
                  featured && "shadow-[0_0_150px_rgba(26,77,255,0.5),0_0_80px_3px_rgba(26,77,255,0.5)]"
                )}
              >
                <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
                  <div className="pt-u-73">
                    {/* Figma: Montserrat Medium 45/48 azul; historia Light 20/25 #779eff.
                        El «+» del diseño se fue con las cifras: encabezaba «+ Clientes»,
                        y delante de un verbo («Escríbele») no significa nada. */}
                    <h3 className="font-display fs-u-45 lh-u-48 font-medium text-electric">
                      {study.headline}
                    </h3>
                    <p className="mt-u-10 max-w-u-254 pl-u-42 fs-u-20 lh-u-25 font-light text-periwinkle">{study.story}</p>
                  </div>

                  {/* Panel azul — Figma: 376×290, radio 16, degradado #1a4dff 21 % → #03259b */}
                  <motion.div
                    initial={{ opacity: 0, y: 24, rotate: 1.5 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex h-u-290 w-full items-end justify-between overflow-hidden rounded-u-16 bg-[linear-gradient(180deg,#1a4dff_21%,#03259b_100%)] p-u-25 md:w-u-376"
                  >
                    <div className={cn("absolute left-u-25 flex flex-col items-start gap-u-7", s.flip ? "bottom-u-31" : "top-u-28")}>
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
                    <div className={cn("z-10", s.flip ? "absolute left-u-25 top-u-29" : "relative")}>
                      <p className="font-display fs-u-35 font-semibold leading-none text-white">
                        {study.stat}
                      </p>
                      <p className="mt-u-8 fs-u-20 font-normal text-mint">{study.statLabel}</p>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${BASE}/icons/proof/${s.icon}.svg`} alt="" className={s.iconClass} />
                  </motion.div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
