"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";
import { trackEvent } from "@/lib/track";
import { CALC_PLANS, calculate } from "@/i18n/calculadora";
import { pricingDicts } from "@/i18n/pricing";

/** El mismo caso que carga el botón «Ver un ejemplo» de /calculadora. */
const EJEMPLO = { ticket: 45, visits: 6, missed: 10, noShows: 12 };

/**
 * La cuenta, en la home — el argumento que convierte "349 €/mes" en "te
 * devuelve X". Va antes del CTA final: primero la razón, luego la decisión.
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
      // es-ES no agrupa 4 cifras por defecto: sin esto salía "2338 €" aquí y
      // "2.338 €" en /calculadora, para el mismo cálculo.
      useGrouping: true,
    }).format(Math.round(n));
  const meses = r.payback.toLocaleString(locale === "es" ? "es-ES" : "en-GB", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <section id="roi" className="relative overflow-hidden bg-void py-28 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_75%_40%,rgba(46,107,255,0.12),transparent_70%)]"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* — el argumento — */}
        <motion.div
          initial={{ opacity: 0, y: 32, filter: "blur(9px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.08] tracking-tight text-frost">
            {t.titleA}
            <br />
            <span className="bg-gradient-to-r from-frost via-[#5f8dff] to-neon bg-clip-text text-transparent">
              {t.titleB}
            </span>
          </h2>
          <p className="mt-6 max-w-[52ch] font-light leading-relaxed text-mist">{t.body}</p>

          <Link
            href="/calculadora"
            onClick={() => trackEvent("cta_calculadora_home")}
            className="group mt-9 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-electric to-neon px-8 py-4 font-display text-base font-semibold text-void shadow-[0_18px_52px_-16px_rgba(56,212,255,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_66px_-16px_rgba(56,212,255,0.9)]"
          >
            {t.cta}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <p className="mt-4 text-xs text-mist">{t.note}</p>
        </motion.div>

        {/* — el ejemplo, ya calculado — */}
        <motion.div
          initial={{ opacity: 0, y: 32, filter: "blur(9px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[26px] border border-line bg-panel/35 p-7 md:p-9"
        >
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-neon">
            {t.exampleLabel}
          </p>

          <p className="mt-6 font-display text-xs font-semibold uppercase tracking-[0.14em] text-mist">
            {t.inputsLabel}
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {t.inputs.map((line) => (
              <li
                key={line}
                className="rounded-xl border border-line bg-space/40 px-3.5 py-2.5 text-[13px] font-light text-frost/85"
              >
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-7 h-px bg-gradient-to-r from-transparent via-line to-transparent" />

          <dl className="mt-7 grid gap-4">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[13px] text-mist">{t.leakLabel}</dt>
              <dd className="font-display text-lg font-semibold tabular-nums text-frost">
                {eur(r.leak)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[13px] text-mist">{t.netLabel}</dt>
              <dd className="font-display text-lg font-semibold tabular-nums text-neon">
                {eur(r.net)}
              </dd>
            </div>
          </dl>

          <div className="mt-7 rounded-2xl border border-neon/25 bg-gradient-to-r from-neon/[0.09] to-electric/[0.05] px-5 py-5 text-center">
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-mist">
              {t.paybackLabel}
            </p>
            <p className="mt-1 font-display text-[clamp(2.2rem,4vw,3rem)] font-bold leading-none tracking-[-0.04em] text-frost">
              {meses}
              <span className="ml-2 font-display text-base font-medium tracking-normal text-neon">
                {t.months}
              </span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ——— El Diagnóstico, al alcance desde la home ———
          Va después de la cuenta a propósito: primero el visitante ve el número
          estimado, y justo entonces se le ofrece la versión medida. El texto sale
          del diccionario de /precios para no tener dos versiones de la promesa. */}
      <motion.div
        initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto mt-14 max-w-7xl px-6"
      >
        <div className="flex flex-col items-start gap-5 rounded-2xl border border-pulse/30 bg-gradient-to-r from-pulse/[0.13] to-electric/[0.07] p-6 md:flex-row md:items-center md:px-8">
          <span className="shrink-0 rounded-full bg-pulse px-3.5 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-white">
            {diag.badge}
          </span>
          <p className="text-sm leading-relaxed text-[#cfe3ff]">
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
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-pulse/50 bg-void/40 px-5 py-3 font-display text-[13px] font-semibold text-frost transition-all duration-300 hover:bg-pulse/20"
          >
            {t.diagCta}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
