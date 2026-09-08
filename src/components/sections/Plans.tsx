"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkle } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";
import { pricingDicts } from "@/i18n/pricing";
import { trackEvent } from "@/lib/track";

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
                <Sparkle
                  className={cn(
                    "absolute -top-[max(12px,20*var(--u))] right-[max(31px,52*var(--u))] size-u-40",
                    p.star ? "fill-neon text-neon" : "fill-electric text-electric"
                  )}
                  strokeWidth={1}
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
