"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";
import { trackEvent } from "@/lib/track";
import { CALC_PLANS, calculate } from "@/i18n/calculadora";

/** El mismo caso que carga el botón «Ver un ejemplo» de /calculadora. */
const EJEMPLO = { ticket: 45, visits: 6, missed: 10, noShows: 12 };

/**
 * La cuenta, en la home (Figma «Calculadora»): tarjeta azul marino de 1196×568
 * con el argumento a la izquierda y, a la derecha, un panel CLARO con el
 * ejemplo ya calculado y el resultado en un bloque azul.
 *
 * Las cifras del ejemplo NO están escritas a mano: salen de `calculate()`, el
 * mismo motor que pinta /calculadora. Si mañana cambia una hipótesis o la
 * tarifa, esta sección la sigue sola en vez de quedarse mintiendo.
 */
export default function Roi() {
  const { locale, dict } = useLocale();
  const t = dict.roi;
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

  // El Figma pone en negrita la primera frase del cuerpo («Ni un folleto ni una promesa:»)
  const colon = t.body.indexOf(":");
  const bodyLead = colon > 0 ? t.body.slice(0, colon + 1) : "";
  const bodyRest = colon > 0 ? t.body.slice(colon + 1) : t.body;

  return (
    <section id="roi" className="relative bg-void pb-u-134 pt-u-120">
      <div className="mx-auto max-w-[1920px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ ["--ring-w" as string]: "1.3px" }}
          // Figma: radio 35, degradado #09112d→#0e1f5c, borde cónico de 1,3 px
          className="ring-conic relative mx-auto max-w-u-1196 rounded-u-35 bg-[linear-gradient(180deg,#09112d_0%,#0e1f5c_100%)] p-6 md:pb-u-35 md:pl-u-50 md:pr-u-37 md:pt-u-35"
        >
          <div className="relative grid gap-12 lg:grid-cols-[1fr_auto] lg:gap-u-40">
            {/* — el argumento — */}
            <div className="lg:pt-u-28">
              <p className="eyebrow eyebrow-gradient">{t.eyebrow}</p>
              {/* Figma: Montserrat SemiBold 35/40, blanco, con «haz la cuenta.» en azul */}
              <h2 className="mt-u-24 max-w-u-462 font-display fs-u-35 lh-u-40 font-semibold text-white">
                {t.titleA}
                <br />
                <span className="text-electric">{t.titleB}</span>
              </h2>
              <p className="mt-u-24 max-w-u-485 fs-u-18 lh-u-25 text-white">
                {bodyLead && <strong className="font-semibold">{bodyLead}</strong>}
                {bodyRest}
              </p>

              {/* Figma: 375×62, radio completo, #c7d7ff, SemiBold 15, flecha azul */}
              <Link
                href="/calculadora"
                onClick={() => trackEvent("cta_calculadora_home")}
                className="btn-light group mt-u-52 inline-flex h-u-62 items-center gap-u-24 rounded-full pl-u-36 pr-u-24 font-display fs-u-15 font-semibold text-void transition-all duration-300 active:scale-[0.97]"
              >
                {t.cta}
                <ArrowRight className="size-u-32 text-electric transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
              </Link>
              <p className="mt-u-40 fs-u-12 lh-u-22 font-medium text-cloud">{t.note}</p>
            </div>

            {/* — el ejemplo, ya calculado — Figma: panel claro 577×498, radio 35, #fff→#c7d7ff */}
            <div className="w-full rounded-u-35 border-[1.3px] border-pulse/50 bg-[linear-gradient(180deg,#ffffff_0%,#c7d7ff_100%)] px-u-37 pb-u-37 pt-u-36 lg:w-u-577">
              <p className="text-center font-display fs-u-22 lh-u-23 font-semibold text-black">{t.exampleLabel}</p>

              <ul className="mt-u-33 grid gap-x-u-9 gap-y-u-37 sm:grid-cols-2">
                {t.inputs.map((line, i) => (
                  <li key={line}>
                    <p className="font-display fs-u-12 font-bold text-black">{t.inputLabels[i]}</p>
                    <p className="mt-u-11 flex min-h-u-60 items-center rounded-u-16 bg-white px-u-23 fs-u-15 lh-u-17 font-medium text-black shadow-[0_1px_4px_rgba(12,12,13,0.05),0_1px_4px_rgba(12,12,13,0.1)]">
                      {line}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Bloque de resultado — Figma: 509×169, radio 16, azul de marca */}
              <div className="mt-u-20 rounded-u-16 bg-electric px-u-23 pb-u-18 pt-u-23">
                <dl className="flex flex-col gap-u-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="fs-u-15 font-medium text-cloud">{t.leakLabel}</dt>
                    <dd className="font-display fs-u-18 font-bold tabular-nums text-cloud">{eur(r.leak)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="fs-u-15 font-medium text-cloud">{t.netLabel}</dt>
                    <dd className="font-display fs-u-18 font-bold tabular-nums text-neon">{eur(r.net)}</dd>
                  </div>
                </dl>
                <div className="mt-u-30 flex items-end justify-between gap-4">
                  <p className="font-display fs-u-18 lh-u-22 font-semibold text-white">{t.paybackLabel}</p>
                  <p className="font-display leading-none text-white">
                    <span className="fs-u-45 font-semibold">{meses}</span>
                    <span className="ml-2 fs-u-25 font-semibold">{t.months}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
