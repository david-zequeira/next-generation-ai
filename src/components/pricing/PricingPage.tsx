"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Check, Minus } from "lucide-react";
import ChatWidget from "@/components/ui/ChatWidget";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";
import { trackEvent } from "@/lib/track";
import { pricingDicts } from "@/i18n/pricing";
import { LEGAL_SLUGS, legalLinkLabels } from "@/i18n/legal";

/** Convierte `**negrita**` del diccionario en <strong>. */
function Rich({ text, strongClass = "font-semibold text-frost" }: { text: string; strongClass?: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className={strongClass}>
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/** Entrada en escena de la casa: subir + desemborronar, una sola vez. */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34, filter: "blur(9px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({
  eyebrow,
  titleA,
  titleB,
  sub,
}: {
  eyebrow: string;
  titleA: string;
  titleB?: string;
  sub?: string;
}) {
  return (
    <Reveal className="max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 font-display text-[clamp(1.9rem,3.9vw,3rem)] font-semibold leading-[1.1] tracking-tight text-frost">
        {titleA}
        {titleB && (
          <>
            <br />
            {titleB}
          </>
        )}
      </h2>
      {sub && <p className="mt-4 font-light leading-relaxed text-mist">{sub}</p>}
    </Reveal>
  );
}

function Rule() {
  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-line to-transparent" />
    </div>
  );
}

function CellValue({ value }: { value: string }) {
  if (value === "✓")
    return <Check aria-label="✓" className="mx-auto h-4 w-4 text-neon" strokeWidth={2.2} />;
  if (value === "—")
    return <Minus aria-label="—" className="mx-auto h-4 w-4 text-mist/25" strokeWidth={1.6} />;
  return <>{value}</>;
}

/**
 * /precios — la tarifa completa: planes, diagnóstico, comparativa, módulos,
 * formas de pago y FAQ. Página propia (la landing es one-page) con el mismo
 * sistema visual; los textos viven en `src/i18n/pricing.ts`, ES y EN.
 */
export default function PricingPage() {
  const { locale, setLocale } = useLocale();
  const t = pricingDicts[locale];
  const otherLocale = locale === "en" ? "es" : "en";

  return (
    <>
      <div className="relative min-h-screen overflow-x-clip bg-void">
        {/* Atmósfera fija: brumas de color + rejilla desvanecida */}
        <div aria-hidden className="pointer-events-none fixed inset-0">
          <div className="absolute -left-44 -top-40 h-[620px] w-[620px] rounded-full bg-electric/10 blur-[130px]" />
          <div className="absolute -right-52 top-[38%] h-[520px] w-[520px] rounded-full bg-pulse/[0.09] blur-[130px]" />
          <div className="absolute -bottom-52 left-[30%] h-[560px] w-[560px] rounded-full bg-neon/[0.06] blur-[130px]" />
          <div
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,170,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(148,170,255,.045) 1px,transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage:
                "radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 75%)",
            }}
          />
        </div>

        <main className="relative">
          {/* Barra propia: la navbar global navega por anclas de la home */}
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-mist transition-colors duration-200 hover:text-frost"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
              {t.back}
            </Link>
            <Link href="/" className="hidden sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo-lockup.png`}
                alt="Asenix"
                className="h-7 w-auto"
              />
            </Link>
            <button
              type="button"
              aria-label={otherLocale === "es" ? "Cambiar a español" : "Switch to English"}
              onClick={() => setLocale(otherLocale)}
              className="inline-flex h-9 cursor-pointer items-center rounded-full border border-line px-3 font-display text-[11px] font-bold tracking-[0.2em] text-mist transition-all duration-300 hover:border-neon/40 hover:text-frost"
            >
              {otherLocale.toUpperCase()}
            </button>
          </div>

          {/* ——— Cabecera ——— */}
          <header className="mx-auto max-w-7xl px-6 pb-16 pt-20 text-center md:pt-28">
            <Reveal>
              <p className="eyebrow">{t.header.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mx-auto mt-5 font-display text-[clamp(2.6rem,6.4vw,5.2rem)] font-bold leading-[1.02] tracking-[-0.035em] text-frost">
                {t.header.titleA}
                <br />
                <span className="bg-gradient-to-r from-frost via-[#5f8dff] to-neon bg-clip-text text-transparent">
                  {t.header.titleB}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-mist">
                {t.header.lede}
              </p>
            </Reveal>

            {/* Aviso 0 € de entrada */}
            <Reveal delay={0.24}>
              <div className="relative mx-auto mt-11 flex max-w-4xl flex-col items-start gap-4 overflow-hidden rounded-2xl border border-neon/30 bg-gradient-to-r from-electric/15 to-neon/[0.07] p-6 text-left sm:flex-row sm:items-center md:px-7">
                <span className="shrink-0 rounded-full bg-neon px-3.5 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-void">
                  {t.kit.badge}
                </span>
                <p className="text-sm leading-relaxed text-[#cfe3ff]">
                  <Rich text={t.kit.body} strongClass="font-semibold text-white" />
                </p>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 animate-sheen bg-[linear-gradient(100deg,transparent_30%,rgba(255,255,255,0.09)_50%,transparent_70%)] bg-[length:200%_100%]"
                />
              </div>
            </Reveal>
          </header>

          {/* ——— Planes ——— */}
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-stretch gap-5 min-[680px]:grid-cols-2 xl:grid-cols-4">
              {t.plans.map((plan, i) => (
                <Reveal key={plan.name} delay={(i % 4) * 0.08} className="h-full">
                  <article
                    className={cn(
                      "group relative flex h-full flex-col rounded-[22px] border p-7 pt-9 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2",
                      plan.star
                        ? "border-neon/40 bg-gradient-to-b from-[rgba(20,34,78,0.75)] to-[rgba(9,14,30,0.5)] shadow-[0_26px_70px_-36px_rgba(56,212,255,0.55)]"
                        : "border-line bg-gradient-to-b from-panel/60 to-abyss/40 hover:border-[rgba(94,140,255,0.42)] hover:shadow-[0_30px_80px_-34px_rgba(46,107,255,0.5)]"
                    )}
                  >
                    <span
                      aria-hidden
                      className="text-outline pointer-events-none absolute -top-3.5 right-3.5 select-none font-display text-[5.4rem] font-bold leading-none transition-all duration-500 group-hover:[-webkit-text-stroke-color:rgba(94,160,255,0.3)]"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {plan.tag && (
                      <span className="absolute -top-2.5 left-7 rounded-full bg-gradient-to-r from-electric to-neon px-3.5 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-void">
                        {plan.tag}
                      </span>
                    )}

                    <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl border border-line bg-space/75 text-lg text-neon transition-shadow duration-300 group-hover:shadow-[0_0_26px_-5px_rgba(56,212,255,0.6)]">
                      {plan.glyph}
                    </div>
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-frost">
                      {plan.name}
                    </h3>
                    <p className="mt-2 min-h-10 text-[13px] font-light text-mist">{plan.who}</p>

                    <div className="mt-6 border-t border-line pt-5">
                      <div className="font-display text-[2.15rem] font-bold tracking-tight">
                        {plan.setupPrefix && (
                          <span className="mr-1.5 text-base font-normal text-mist">
                            {plan.setupPrefix}
                          </span>
                        )}
                        <span className="bg-gradient-to-r from-frost to-[#7fb0ff] bg-clip-text text-transparent">
                          {plan.setup}
                        </span>
                        <span className="ml-1.5 text-sm font-normal text-mist">
                          {plan.setupNote}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-neon">
                        {plan.mrr} <span className="font-light text-mist">{plan.mrrNote}</span>
                      </p>
                      <p className="mt-3 rounded-lg border border-neon/[0.18] bg-neon/[0.08] px-2.5 py-1.5 text-xs text-[#8fd6ff]">
                        <Rich text={plan.kitline} strongClass="font-semibold text-[#c8ecff]" />
                      </p>
                    </div>

                    <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                      {plan.features.map((f) => (
                        <li
                          key={f.text}
                          className={cn(
                            "relative pl-6 text-[13px] font-light leading-relaxed",
                            f.inherited ? "text-mist" : "text-[#c3cde6]"
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "absolute left-0 top-[7px] h-[9px] w-[9px] rounded-full border",
                              f.inherited
                                ? "border-pulse/40 bg-[radial-gradient(circle,var(--color-pulse)_30%,transparent_62%)]"
                                : "border-neon/40 bg-[radial-gradient(circle,var(--color-neon)_30%,transparent_62%)]"
                            )}
                          />
                          <Rich text={f.text} />
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-1.5 border-t border-line pt-4">
                      {plan.quota.map((q) => (
                        <span
                          key={q}
                          className="rounded-md border border-line bg-space/55 px-2 py-1 text-[11px] text-mist"
                        >
                          {q}
                        </span>
                      ))}
                    </div>

                    {/* El slug del plan viaja en la URL: /contacto lo preselecciona
                        y el evento distingue QUÉ plan generó el clic. */}
                    <Link
                      href={`/contacto?plan=${plan.name.toLowerCase()}`}
                      onClick={() => trackEvent(`cta_plan_${plan.name.toLowerCase()}`)}
                      className={cn(
                        "mt-6 block rounded-xl py-3 text-center font-display text-sm font-semibold transition-all duration-300",
                        plan.star
                          ? "bg-gradient-to-r from-electric to-neon text-void shadow-[0_14px_40px_-14px_rgba(56,212,255,0.65)] hover:shadow-[0_20px_52px_-14px_rgba(56,212,255,0.85)]"
                          : "border border-[rgba(148,170,255,0.24)] bg-panel/60 text-frost hover:-translate-y-0.5 hover:border-neon hover:bg-electric/[0.17]"
                      )}
                    >
                      {plan.cta}
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>

          {/* ——— Diagnóstico ——— */}
          <section className="mx-auto max-w-7xl px-6 py-24">
            <Reveal>
              <div className="flex flex-col items-start gap-4 rounded-2xl border border-pulse/30 bg-gradient-to-r from-pulse/[0.13] to-electric/[0.07] p-6 sm:flex-row sm:items-center md:px-7">
                <span className="shrink-0 rounded-full bg-pulse px-3.5 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                  {t.diag.badge}
                </span>
                <p className="text-sm leading-relaxed text-[#cfe3ff]">
                  <Rich text={t.diag.body} strongClass="font-semibold text-white" />
                </p>
              </div>
            </Reveal>
          </section>

          <Rule />

          {/* ——— Comparativa ——— */}
          <section className="mx-auto max-w-7xl px-6 py-24">
            <SectionHead eyebrow={t.compare.eyebrow} titleA={t.compare.title} sub={t.compare.sub} />
            <Reveal delay={0.1} className="mt-12">
              <div className="overflow-x-auto rounded-2xl border border-line bg-abyss/50">
                <table className="w-full min-w-[820px] border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="w-[32%] border-b border-line bg-panel/70 px-4 py-4" />
                      {t.compare.cols.map((col, i) => (
                        <th
                          key={col}
                          className={cn(
                            "border-b border-line bg-panel/70 px-4 py-4 text-center font-display text-[13px] font-semibold text-frost",
                            i === 1 && "bg-electric/[0.12]"
                          )}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.compare.rows.map((row, ri) => (
                      <tr
                        key={row.label}
                        className="transition-colors hover:bg-electric/5"
                      >
                        <th
                          className={cn(
                            "px-4 py-3.5 text-left text-[13px] font-normal text-[#c3cde6]",
                            ri < t.compare.rows.length - 1 && "border-b border-line"
                          )}
                        >
                          {row.label}
                        </th>
                        {row.cells.map((cell, ci) => (
                          <td
                            key={ci}
                            className={cn(
                              "px-4 py-3.5 text-center text-[13px]",
                              ri < t.compare.rows.length - 1 && "border-b border-line",
                              ci === 1 && "bg-electric/[0.06]",
                              row.strong ? "font-semibold text-frost" : "text-mist",
                              row.accent && "font-semibold text-neon"
                            )}
                          >
                            <CellValue value={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </section>

          <Rule />

          {/* ——— Add-ons ——— */}
          <section className="mx-auto max-w-7xl px-6 py-24">
            <SectionHead
              eyebrow={t.addons.eyebrow}
              titleA={t.addons.titleA}
              titleB={t.addons.titleB}
              sub={t.addons.sub}
            />
            <div className="mt-12 grid gap-4 min-[680px]:grid-cols-2 lg:grid-cols-3">
              {t.addons.items.map((addon, i) => (
                <Reveal key={`${addon.name}-${i}`} delay={(i % 3) * 0.08} className="h-full">
                  <div className="h-full rounded-2xl border border-line bg-panel/35 p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[rgba(94,140,255,0.4)] hover:bg-panel/60">
                    <h4 className="font-display text-base font-semibold text-frost">
                      {addon.name}
                      {addon.note && (
                        <span className="ml-1.5 text-xs font-normal text-mist">{addon.note}</span>
                      )}
                    </h4>
                    <p className="mt-2 text-[13px] font-light leading-relaxed text-mist">
                      {addon.desc}
                    </p>
                    <p className="mt-4 font-display text-[15px] font-semibold text-frost">
                      {addon.price && <span>{addon.price} </span>}
                      {addon.tail && <span className="font-medium text-neon">{addon.tail}</span>}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <Rule />

          {/* ——— Formas de pago ——— */}
          <section className="mx-auto max-w-7xl px-6 py-24">
            <SectionHead
              eyebrow={t.pay.eyebrow}
              titleA={t.pay.titleA}
              titleB={t.pay.titleB}
              sub={t.pay.sub}
            />
            <div className="mt-12 grid gap-4 min-[680px]:grid-cols-2 xl:grid-cols-4">
              {t.pay.items.map((item, i) => (
                <Reveal key={item.k} delay={(i % 4) * 0.08} className="h-full">
                  <div
                    className={cn(
                      "h-full rounded-2xl border p-6 transition-all duration-500 hover:-translate-y-1",
                      i === 0
                        ? "border-neon/40 bg-gradient-to-br from-[rgba(20,34,78,0.6)] to-[rgba(9,14,30,0.4)]"
                        : "border-line bg-panel/35 hover:border-[rgba(94,140,255,0.4)]"
                    )}
                  >
                    <p className="font-display text-[11px] font-medium uppercase tracking-[0.2em] text-neon">
                      {item.k}
                    </p>
                    <h4 className="mt-3.5 font-display text-2xl font-semibold tracking-tight text-frost">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-[13px] font-light leading-relaxed text-mist">
                      {item.body}
                    </p>
                    <p
                      className={cn(
                        "mt-4 font-display text-sm font-semibold",
                        i === 0 ? "text-neon" : "text-frost"
                      )}
                    >
                      {item.foot}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <Rule />

          {/* ——— FAQ ——— */}
          <section className="mx-auto max-w-7xl px-6 py-24">
            <SectionHead eyebrow={t.faq.eyebrow} titleA={t.faq.titleA} titleB={t.faq.titleB} />
            <Reveal delay={0.1} className="mt-10 max-w-3xl">
              {t.faq.items.map((item, i) => (
                <details
                  key={item.q}
                  open={i === 0}
                  className="group/faq border-b border-line py-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-display text-base font-medium text-frost transition-colors hover:text-neon [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span
                      aria-hidden
                      className="shrink-0 text-xl font-light text-neon transition-transform duration-300 group-open/faq:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[70ch] text-sm font-light leading-relaxed text-mist">
                    <Rich text={item.a} />
                  </p>
                </details>
              ))}
            </Reveal>
          </section>

          {/* ——— CTA final ——— */}
          <section id="contacto" className="mx-auto max-w-7xl px-6 pb-24">
            <Reveal>
              <div className="rounded-[26px] border border-line bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(46,107,255,0.16),transparent_68%)] px-8 py-16 text-center md:py-20">
                <p className="eyebrow">{t.final.eyebrow}</p>
                <h2 className="mx-auto mt-5 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.08] tracking-tight text-frost">
                  {t.final.titleA}
                  <br />
                  {t.final.titleB}
                </h2>
                <p className="mx-auto mt-5 max-w-lg font-light leading-relaxed text-mist">
                  {t.final.sub}
                </p>
                <Link
                  href="/contacto"
                  onClick={() => trackEvent("cta_final_precios")}
                  className="group mt-9 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-electric to-neon px-10 py-4 font-display text-base font-semibold text-void shadow-[0_18px_52px_-16px_rgba(56,212,255,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_66px_-16px_rgba(56,212,255,0.9)]"
                >
                  {t.final.cta}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <p className="mt-4 text-xs text-mist">{t.final.mini}</p>
              </div>
            </Reveal>
          </section>

          {/* ——— Pie compacto ——— */}
          <footer className="border-t border-line py-14 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo-lockup.png`}
              alt="Asenix — Digital Evolution"
              className="mx-auto h-9 w-auto"
            />
            <nav
              aria-label={locale === "es" ? "Páginas legales" : "Legal pages"}
              className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2"
            >
              {LEGAL_SLUGS.map((slug) => (
                <Link
                  key={slug}
                  href={`/legal/${slug}`}
                  className="text-xs text-mist transition-colors duration-200 hover:text-frost"
                >
                  {legalLinkLabels[locale][slug]}
                </Link>
              ))}
            </nav>
          </footer>
        </main>
      </div>
      <ChatWidget />
    </>
  );
}
