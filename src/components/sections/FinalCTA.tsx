"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Mic } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import TextReveal from "@/components/ui/TextReveal";
import { useLocale } from "@/i18n/LocaleContext";
import { trackEvent } from "@/lib/track";
import { warmUpVoice } from "@/lib/voice-warmup";

/**
 * Sección 10 — «Hablemos.» (Figma): el sitio se abre a la luz. Fondo lavanda
 * claro, el titular en azul de marca (SemiBold 65/62, tracking −0,05 em, con
 * la segunda frase en Regular) y una única pastilla de contacto de 72 px.
 * El cambio de oscuro a claro se hace con el scroll, como una persiana.
 */
export default function FinalCTA({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const ref = useRef<HTMLElement>(null);
  const { locale, dict } = useLocale();
  const t = dict.finalCta;

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
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(148,178,252,0.35),transparent)]"
      />

      <motion.div
        style={{ y: rise }}
        className="relative mx-auto max-w-[1920px] px-5 pb-u-80 pt-u-171 md:px-10 xl:px-[12.5%]"
        key={locale}
      >
        <h2
          className={`max-w-u-640 font-display fs-u-65 lh-u-62 font-semibold tracking-[-0.05em] text-balance ${dark ? "text-[#2f5cff]" : "text-electric"}`}
        >
          <TextReveal as="span" text={t.titleA} className="inline font-semibold" />{" "}
          <TextReveal as="span" text={t.titleB} delay={0.2} className="inline font-normal" />
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-u-54 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8"
        >
          {/* Figma «Contactar»: 244×72, radio completo, #d5dae9, SemiBold 20 con flecha oscura */}
          <MagneticButton
            href="/contacto"
            variant={dark ? "ghost" : "primary"}
            onClick={() => trackEvent("cta_final_home")}
            className={dark ? "min-w-u-244 border-white/20 bg-gradient-to-r from-[#3a4a7a] to-[#1c2a55]" : "btn-light-paper min-w-u-244"}
          >
            {t.cta}
            <ArrowRight className={`size-u-22 ${dark ? "text-white" : "text-void"}`} strokeWidth={3} />
          </MagneticButton>

          {/* Segundo permiso: la demo está a un clic — el chat ES el producto.
              Y al lado, la voz: lo que más impresiona en una demo en vivo. */}
          {process.env.NEXT_PUBLIC_AGENT_URL && (
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("ng:open-chat"))}
                className={`group cursor-pointer text-left text-sm transition-colors duration-300 ${dark ? "text-white/70 hover:text-pulse" : "text-ink/70 hover:text-electric"}`}
              >
                <span className="text-electric">{"//"} </span>
                <span className="underline decoration-ink/20 underline-offset-4 transition-colors duration-300 group-hover:decoration-electric/60">
                  {t.orChat}
                </span>
              </button>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("ng:open-voice"))}
                onPointerEnter={warmUpVoice}
                onFocus={warmUpVoice}
                className={`group inline-flex cursor-pointer items-center gap-2 text-sm transition-colors duration-300 ${dark ? "text-white/70 hover:text-pulse" : "text-ink/70 hover:text-electric"}`}
              >
                <Mic className="h-3.5 w-3.5 text-electric" strokeWidth={1.8} />
                <span className="underline decoration-ink/20 underline-offset-4 transition-colors duration-300 group-hover:decoration-electric/60">
                  {t.orVoice}
                </span>
              </button>
            </div>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 1 }}
          className={`mt-u-32 fs-u-12 tracking-wide ${dark ? "text-white/50" : "text-ink/50"}`}
        >
          {t.note}
        </motion.p>
      </motion.div>
    </section>
  );
}
