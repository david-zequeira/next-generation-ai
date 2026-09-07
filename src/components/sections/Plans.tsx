"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkle } from "lucide-react";
import TextReveal from "@/components/ui/TextReveal";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";
import { pricingDicts } from "@/i18n/pricing";
import { trackEvent } from "@/lib/track";

/**
 * Sección 9 — «Planes simples que escalan contigo» (Figma): los planes como
 * pastillas azules, con el recomendado en lima. Los nombres y precios salen
 * del diccionario de /precios: aquí no se escribe ninguna tarifa a mano.
 */
export default function Plans() {
  const { locale, dict } = useLocale();
  const t = dict.plans;
  const plans = pricingDicts[locale].plans;

  return (
    <section id="plans" className="relative bg-void pb-32 pt-8 md:pb-44">
      <div className="mx-auto max-w-5xl px-6 text-center" key={locale}>
        <p className="eyebrow mb-6">{t.eyebrow}</p>
        <TextReveal text={t.titleA} className="block text-[clamp(2rem,4.6vw,3.4rem)] text-white" />
        <TextReveal text={t.titleB} delay={0.2} className="block text-[clamp(2rem,4.6vw,3.4rem)] text-white" />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-mist md:text-lg"
        >
          {t.sub}
        </motion.p>

        <ul className="mt-14 flex flex-wrap items-stretch justify-center gap-4 md:gap-5">
          {plans.map((p, i) => (
            <motion.li
              key={p.name}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/precios"
                onClick={() => trackEvent("cta_plans_home")}
                className={cn(
                  "group flex min-w-[210px] cursor-pointer items-center gap-4 rounded-full border px-6 py-3.5 text-left transition-all duration-300 hover:-translate-y-0.5",
                  p.star
                    ? "border-neon bg-gradient-to-r from-[#1a3fd6] to-[#0f2a99] shadow-[0_18px_44px_-18px_rgba(184,242,30,0.5)]"
                    : "border-pulse/50 bg-gradient-to-r from-[#1a3fd6] to-[#0f2a99] hover:border-pulse"
                )}
              >
                <Sparkle
                  className={cn("h-6 w-6 shrink-0", p.star ? "fill-neon text-neon" : "fill-pulse/70 text-pulse")}
                  strokeWidth={1.2}
                />
                <span>
                  <span className="block font-display text-lg font-medium text-white">{p.name}</span>
                  <span className="block text-[11px] text-white/70">
                    {p.setupPrefix ? `${p.setupPrefix} ` : ""}
                    {p.setup} {t.setup}
                  </span>
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 text-sm text-frost/85"
        >
          {t.question}{" "}
          <Link
            href="/contacto"
            onClick={() => trackEvent("cta_plans_custom_home")}
            className="group inline-flex items-center gap-1 text-neon underline decoration-neon/40 underline-offset-4 transition-colors hover:text-white"
          >
            {t.link}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.p>
        <p className="mt-3 text-xs text-mist/70">
          <Link href="/precios" className="transition-colors hover:text-frost">
            {t.all}
          </Link>
        </p>
      </div>
    </section>
  );
}
