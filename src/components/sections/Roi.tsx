"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";
import { trackEvent } from "@/lib/track";
import { CALC_PLANS, calculate } from "@/i18n/calculadora";
import { pricingDicts } from "@/i18n/pricing";

/** El mismo caso que carga el botón «Ver un ejemplo» de /calculadora. */
const EJEMPLO = { ticket: 45, visits: 6, missed: 10, noShows: 12 };

/**
 * La cuenta, en la home — vive dentro de la gran tarjeta azul marino que el
 * Figma deja entre las pruebas y los planes. Primero la razón, luego la decisión.
 *
 * Las cifras del ejemplo NO están escritas a mano: salen de `calculate()`, el
 * mismo motor que pinta /calculadora. Si mañana cambia una hipótesis o la
 * tarifa, esta sección la sigue sola en vez de quedarse mintiendo.
 */
export default function Roi() {
  const { locale, dict } = useLocale();
  const t = dict.roi;
  // El Diagnóstico se lee del diccionario de /precios, no se copia: un cambio de
  // precio o de promesa no puede quedar contado de dos maneras distintas.
  const diag = pricingDicts[locale].diag;
  const r = calculate(EJEMPLO, CALC_PLANS[0]);

  const eur = (n: number) =>
    new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-GB", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
      useGrouping: true,
    }).format(Math.round(n));
  const meses = r.payback.toLocaleString(locale === "es" ? "es-ES" : "en-GB", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <section id="roi" className="relative bg-void py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="card-navy relative overflow-hidden rounded-[28px] p-7 md:p-12 lg:p-16"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-electric/25 blur-[120px]"
          />
          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            {/* — el argumento — */}
            <div>
              <p className="eyebrow">{t.eyebrow}</p>
              <h2 className="display mt-6 text-[clamp(1.9rem,3.8vw,3rem)] text-white">
                {t.titleA}
                <br />
                <span className="text-gradient">{t.titleB}</span>
              </h2>
              <p className="mt-6 max-w-[52ch] leading-relaxed text-mist">{t.body}</p>

              <Link
                href="/calculadora"
                onClick={() => trackEvent("cta_calculadora_home")}
                className="btn-light group mt-9 inline-flex h-[54px] items-center gap-3 rounded-full px-8 font-display text-[15px] font-semibold transition-all duration-300 active:scale-[0.97]"
              >
                {t.cta}
                <ArrowRight className="h-5 w-5 text-electric transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
              </Link>
              <p className="mt-4 text-xs text-mist">{t.note}</p>
            </div>

            {/* — el ejemplo, ya calculado — */}
            <div className="rounded-3xl border border-pulse/30 bg-[#070f2c]/70 p-6 backdrop-blur-sm md:p-8">
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-neon">
                {t.exampleLabel}
              </p>

              <p className="mt-6 font-display text-xs font-medium uppercase tracking-[0.14em] text-mist">
                {t.inputsLabel}
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {t.inputs.map((line) => (
                  <li
                    key={line}
                    className="rounded-xl border border-pulse/20 bg-white/[0.04] px-3.5 py-2.5 text-[13px] text-frost/90"
                  >
                    {line}
                  </li>
                ))}
              </ul>

              <div className="mt-7 h-px bg-gradient-to-r from-transparent via-pulse/40 to-transparent" />

              <dl className="mt-7 grid gap-4">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[13px] text-mist">{t.leakLabel}</dt>
                  <dd className="font-display text-lg font-semibold tabular-nums text-white">{eur(r.leak)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[13px] text-mist">{t.netLabel}</dt>
                  <dd className="font-display text-lg font-semibold tabular-nums text-neon">{eur(r.net)}</dd>
                </div>
              </dl>

              <div className="card-blue mt-7 rounded-2xl px-5 py-5 text-center">
                <p className="font-display text-[11px] font-medium uppercase tracking-[0.16em] text-white/80">
                  {t.paybackLabel}
                </p>
                <p className="mt-1 font-display text-[clamp(2.2rem,4vw,3rem)] font-bold leading-none tracking-[-0.03em] text-white">
                  {meses}
                  <span className="ml-2 font-display text-base font-medium tracking-normal text-neon">
                    {t.months}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* ——— El Diagnóstico, al alcance desde la home ———
              Va después de la cuenta a propósito: primero el visitante ve el
              número estimado, y justo entonces se le ofrece la versión medida. */}
          <div className="relative mt-10 flex flex-col items-start gap-5 rounded-2xl border border-pulse/30 bg-white/[0.04] p-6 md:flex-row md:items-center md:px-8">
            <span className="btn-blue shrink-0 rounded-full px-3.5 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.16em]">
              {diag.badge}
            </span>
            <p className="text-sm leading-relaxed text-frost/85">
              {diag.body.split("**").map((part, i) =>
                i % 2 === 1 ? (
                  <strong key={i} className="font-semibold text-white">
                    {part}
                  </strong>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </p>
            <Link
              href="/contacto"
              onClick={() => trackEvent("cta_diagnostico_home")}
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-pulse/50 px-5 py-3 font-display text-[13px] font-semibold text-white transition-all duration-300 hover:bg-white/10"
            >
              {t.diagCta}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
