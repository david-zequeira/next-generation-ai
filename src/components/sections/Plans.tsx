"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";
import { pricingDicts } from "@/i18n/pricing";
import { trackEvent } from "@/lib/track";

/**
 * La estrella del Figma (capa «i1», 40×40, exportada del propio diseño): un
 * destello de cuatro puntas. Toma el color del texto y late con `animate-sparkle`.
 */
function FigmaSparkle({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden
      className={cn("animate-sparkle origin-center", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      <path
        fill="currentColor"
        d="M19.514 0.351486C19.6876 -0.117162 20.3124 -0.117162 20.486 0.351486L22.3432 5.4719C24.3914 11.1478 28.8522 15.626 34.5281 17.6741L39.6485 19.514C40.1172 19.6876 40.1172 20.3298 39.6485 20.5034L34.5281 22.3432C28.8522 24.3914 24.3914 28.8522 22.3432 34.5281L20.486 39.6485C20.3124 40.1172 19.6876 40.1172 19.514 39.6485L17.6568 34.5281C15.6086 28.8522 11.1478 24.3914 5.4719 22.3432L0.351486 20.5034C-0.117162 20.3298 -0.117162 19.6876 0.351486 19.514L5.4719 17.6741C11.1478 15.626 15.6086 11.1478 17.6568 5.4719L19.514 0.351486Z"
      />
    </svg>
  );
}

/**
 * Sección 9 — «Planes simples que escalan contigo» (Figma): tres tarjetas de
 * 296×86 con radio 30; la recomendada en azul con el precio en lima, las
 * otras blancas con el precio en azul, y una estrella de 40 px asomando por
 * la esquina superior derecha. Los nombres y precios salen del diccionario
 * de /precios: aquí no se escribe ninguna tarifa a mano.
 */
export default function Plans() {
  const { locale, dict } = useLocale();
  const t = dict.plans;
  const plans = pricingDicts[locale].plans;

  return (
    <section id="plans" className="relative bg-void pb-u-120 pt-u-63">
      <div className="mx-auto max-w-5xl px-6 text-center" key={locale}>
        <SectionHeading eyebrow={t.eyebrow} title={[t.titleA, t.titleB]} sub={t.sub} gradientEyebrow subSize={18} />

        <ul className="mt-u-113 flex flex-wrap items-stretch justify-center gap-u-20">
          {plans.map((p, i) => (
            <motion.li
              key={p.name}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <Link
                href="/precios"
                onClick={() => trackEvent("cta_plans_home")}
                className={cn(
                  "group relative flex h-u-86 w-u-296 cursor-pointer flex-col items-center justify-center rounded-u-30 text-center transition-all duration-300 hover:-translate-y-0.5",
                  p.star
                    ? "border border-electric bg-[linear-gradient(180deg,#1a4dff_0%,#102e99_100%)] text-white"
                    : "bg-white text-black hover:bg-cloud"
                )}
              >
                {/* La estrella asoma 20 px por encima del borde, a 52 px de la esquina derecha */}
                <FigmaSparkle
                  delay={i * 0.4}
                  className={cn(
                    "absolute -top-[max(12px,20*var(--u))] right-[max(31px,52*var(--u))] size-u-40",
                    p.star ? "text-neon" : "text-electric"
                  )}
                />
                <span className="font-display fs-u-22 lh-u-30 font-semibold">{p.name}</span>
                <span className={cn("fs-u-15 leading-none", p.star ? "font-medium text-neon" : "font-semibold text-electric")}>
                  {p.setupPrefix ? `${p.setupPrefix} ` : ""}
                  {p.setup} {t.setup}
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Figma: «¿Necesitas algo personalizado? Habla con nuestro equipo →», Medium 18, enlace verde */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-u-118 font-display fs-u-18 lh-u-24 font-medium text-frost"
        >
          {t.question}{" "}
          <Link
            href="/contacto"
            onClick={() => trackEvent("cta_plans_custom_home")}
            className="group inline-flex items-center gap-1 text-mint transition-colors hover:text-white"
          >
            {t.link}
            <ArrowRight className="size-u-18 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.p>
        <p className="mt-u-12 fs-u-12 text-mist/70">
          <Link href="/precios" className="transition-colors hover:text-frost">
            {t.all}
          </Link>
        </p>
      </div>
    </section>
  );
}
