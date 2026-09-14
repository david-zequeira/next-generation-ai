"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import TextReveal from "@/components/ui/TextReveal";
import { useLocale } from "@/i18n/LocaleContext";
import { trackEvent } from "@/lib/track";
import { warmUpVoice } from "@/lib/voice-warmup";

const HREFS = ["/#future", "/#services", "/#ecosystem", "/#work", "/#process"];

/**
 * Sección 10 — «Hablemos.» (Figma 1532:2424, «Frame 254»): el sitio se abre a
 * la luz. Fondo lavanda claro, el titular en negro (SemiBold 60/65, tracking
 * −0,05 em, con la segunda frase en Regular), la pastilla de contacto de 66 px
 * con los dos enlaces azules apilados a su derecha y, en la columna derecha,
 * la lista de navegación del sitio (500 · 16/34, alineada a la derecha).
 * El cambio de oscuro a claro se hace con el scroll, como una persiana.
 */
export default function FinalCTA({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const ref = useRef<HTMLElement>(null);
  const { locale, dict } = useLocale();
  const t = dict.finalCta;
  const links = [
    ...dict.nav.links.map((label, i) => ({ label, href: HREFS[i] })),
    { label: dict.nav.calc, href: "/calculadora" },
    { label: dict.nav.pricing, href: "/precios" },
    { label: dict.footer.contact, href: "/contacto" },
  ];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const rise = useTransform(scrollYProgress, [0.2, 0.9], [60, 0]);
  const glow = useTransform(scrollYProgress, [0.3, 1], [0, 1]);

  return (
    <section
      id="contact"
      ref={ref}
      className={dark ? "relative overflow-hidden bg-[#060e29] text-white" : "relative overflow-hidden bg-paper text-ink"}
    >
      {/* Aurora azul muy tenue a la derecha — respira lentamente */}
      <motion.div
        aria-hidden
        style={{ opacity: glow }}
        className="animate-float-slow pointer-events-none absolute -right-40 top-1/2 h-[520px] w-[720px] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(26,77,255,0.16),transparent)]"
      />

      <motion.div
        style={{ y: rise }}
        className="relative mx-auto max-w-[1920px] px-5 pb-u-80 pt-u-151 md:px-10 xl:px-[12.5%] lg:grid lg:grid-cols-[1fr_auto] lg:items-start"
        key={locale}
      >
        {/* Figma: «Hablemos.» 600 + resto 400, 60/65, negro por override de caracteres. El nodo mide 580,
            pero Montserrat en web sale ≈8 % más ancha y con 580 el titular cae en 4 líneas; 610 reproduce
            las 3 líneas del Figma. */}
        <h2
          className={`max-w-u-610 font-display fs-u-60 lh-u-65 font-semibold tracking-[-0.05em] ${dark ? "text-[#2f5cff]" : "text-black"}`}
        >
          <TextReveal as="span" text={t.titleA} className="inline font-semibold" />{" "}
          <TextReveal as="span" text={t.titleB} delay={0.2} className="inline font-normal" />
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-u-91 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-u-32"
        >
          {/* Figma «Rectangle 146»/«Contactar»: 213×66, radio 47, #d5dae9, SemiBold 18, sin flecha */}
          <MagneticButton
            href="/contacto"
            variant={dark ? "ghost" : "primary"}
            onClick={() => trackEvent("cta_final_home")}
            className={dark ? "min-w-u-213 min-h-u-66! border-white/20 bg-gradient-to-r from-[#3a4a7a] to-[#1c2a55]" : "btn-light-paper min-w-u-213 min-h-u-66!"}
          >
            {t.cta}
          </MagneticButton>

          {/* Segundo permiso: la demo está a un clic — el chat ES el producto.
              Y debajo, la voz: lo que más impresiona en una demo en vivo.
              Figma: dos enlaces apilados a 32 del botón, 500 · 18/24 · #1a4dff · subrayados, paso 27 */}
          {process.env.NEXT_PUBLIC_AGENT_URL && (
            <div className="flex flex-col gap-u-3 font-medium fs-u-18 lh-u-24">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("ng:open-chat"))}
                className={`cursor-pointer text-left underline underline-offset-4 transition-opacity duration-300 hover:opacity-70 ${dark ? "text-white/70" : "text-electric"}`}
              >
                {t.orChat} →
              </button>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("ng:open-voice"))}
                onPointerEnter={warmUpVoice}
                onFocus={warmUpVoice}
                className={`cursor-pointer text-left underline underline-offset-4 transition-opacity duration-300 hover:opacity-70 ${dark ? "text-white/70" : "text-electric"}`}
              >
                {t.orVoice} →
              </button>
            </div>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 1 }}
          className={`mt-u-24 fs-u-12 ${dark ? "text-white/50" : "text-ink/50"}`}
        >
          {t.note}
        </motion.p>

        {/* Figma: lista de navegación en la columna derecha (x 1481–1680), 500 · 16/34 · ls 0,07 em · negro,
            alineada a la derecha y al top del titular (misma y=151). Por debajo de lg sigue visible como
            la fila envolvente que antes vivía en el pie (13 px, tinta al 55 %), bajo el bloque del botón. */}
        <nav aria-label={dict.footer.navAria} className="mt-u-40 lg:col-start-2 lg:row-start-1 lg:row-span-3 lg:mt-0">
          <ul
            className={`flex flex-wrap gap-x-5 gap-y-2 fs-u-13 lg:flex-col lg:items-end lg:gap-0 lg:fs-u-16 lg:lh-u-34 lg:tracking-[0.07em] lg:font-medium ${
              dark ? "text-white/55 lg:text-white" : "text-ink/55 lg:text-black"
            }`}
          >
            {links.map((item) => (
              <li key={item.href}>
                {item.href.startsWith("/#") ? (
                  <a href={item.href} className="transition-colors duration-200 hover:text-electric">
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} className="transition-colors duration-200 hover:text-electric">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </motion.div>
    </section>
  );
}
