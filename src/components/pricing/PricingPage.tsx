"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  Cpu,
  Globe,
  MessageSquarePlus,
  MessagesSquare,
  Mic,
  Palette,
  Sparkle,
  X,
  type LucideIcon,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FinalCTA from "@/components/sections/FinalCTA";
import ChatWidget from "@/components/ui/ChatWidget";
import VoiceWidget from "@/components/ui/VoiceWidget";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";
import { trackEvent } from "@/lib/track";
import { pricingDicts } from "@/i18n/pricing";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Convierte `**negrita**` del diccionario en <strong>. */
function Rich({ text, strongClass = "font-semibold text-ink" }: { text: string; strongClass?: string }) {
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
function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Cabecera de sección centrada, como en el Figma: etiqueta azul, título tinta, sub. */
function SectionHead({ eyebrow, titleA, titleB, sub }: { eyebrow: string; titleA: string; titleB?: string; sub?: ReactNode }) {
  return (
    <Reveal className="mx-auto max-w-3xl text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-5 font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
        {titleA}
        {titleB && (
          <>
            <br />
            {titleB}
          </>
        )}
      </h2>
      {sub && <p className="mt-4 text-base leading-relaxed text-ink/75 md:text-[17px]">{sub}</p>}
    </Reveal>
  );
}

/** Celda de la comparativa: check redondo (lima en la columna destacada), aspa, o texto. */
function CellValue({ value, star }: { value: string; star: boolean }) {
  if (value === "✓")
    return (
      <span
        aria-label="✓"
        className={cn(
          "mx-auto flex h-5 w-5 items-center justify-center rounded-full",
          star ? "bg-neon text-ink" : "bg-electric text-white"
        )}
      >
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    );
  if (value === "—") return <X aria-label="—" className="mx-auto h-3.5 w-3.5 text-ink/70" strokeWidth={2.4} />;
  return <>{value}</>;
}

/** Iconos de los módulos, por orden del diccionario. */
const ADDON_ICONS: LucideIcon[] = [Mic, MessageSquarePlus, MessagesSquare, CalendarDays, Globe, Cpu, Palette, Camera];

/**
 * /precios — la tarifa completa en el tema claro del Figma «Asenix Planes»:
 * planes, diagnóstico, comparativa, módulos, formas de pago, FAQ y cierre. Los
 * textos siguen viviendo en `src/i18n/pricing.ts`, ES y EN.
 */
export default function PricingPage() {
  const { locale } = useLocale();
  const t = pricingDicts[locale];

  return (
    <>
      <div className="relative min-h-screen overflow-x-clip bg-[#eef0f6] text-ink">
        {/* Bruma azul muy tenue arriba, como el degradado del Figma */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(60%_50%_at_50%_0%,rgba(148,178,252,0.35),transparent_70%)]"
        />
        <Navbar tone="light" />

        <main className="relative">
          {/* ——— Cabecera ——— */}
          <header className="mx-auto max-w-4xl px-6 pb-16 pt-36 text-center md:pt-44">
            <Reveal>
              <p className="eyebrow">{t.header.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mx-auto mt-5 font-display text-[clamp(2.2rem,4.8vw,3.6rem)] font-bold leading-[1.08] tracking-[-0.025em] text-ink">
                {t.header.titleA} {t.header.titleB}
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-ink/80 md:text-[17px]">
                <Rich text={t.kit.body} />
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">{t.header.lede}</p>
            </Reveal>
          </header>

          {/* ——— Planes ——— */}
          <section className="mx-auto max-w-6xl px-6">
            <div className="grid items-stretch gap-6 min-[680px]:grid-cols-2 xl:grid-cols-3">
              {t.plans.map((plan, i) => {
                const star = !!plan.star;
                const slug = plan.name.toLowerCase();
                return (
                  <Reveal key={plan.name} delay={(i % 3) * 0.08} className="h-full">
                    <article
                      className={cn(
                        "group relative flex h-full flex-col rounded-[26px] border bg-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5",
                        star
                          ? "border-[#cad3ec] shadow-[0_40px_90px_-40px_rgba(26,77,255,0.55)]"
                          : "border-[#cad3ec] shadow-[0_30px_70px_-45px_rgba(11,18,38,0.35)] hover:shadow-[0_40px_90px_-45px_rgba(26,77,255,0.35)]"
                      )}
                    >
                      {plan.tag && (
                        <span className="btn-blue absolute right-6 top-0 -translate-y-1/2 rounded-full px-4 py-1.5 font-display text-[11px] font-semibold">
                          {plan.tag}
                        </span>
                      )}

                      {/* Cabecera de la tarjeta */}
                      <div className="px-7 pb-6 pt-8">
                        <div className="flex items-center gap-3">
                          <Sparkle
                            className={cn(
                              "h-7 w-7",
                              star ? "fill-neon text-neon" : i === 1 ? "fill-[#a7b2d1] text-[#a7b2d1]" : "fill-electric text-electric"
                            )}
                            strokeWidth={1.2}
                          />
                          <h3 className="font-display text-[26px] font-bold text-ink">{plan.name}</h3>
                        </div>
                        <p className="mt-3 min-h-10 text-[13px] leading-relaxed text-ink/70">{plan.who}</p>
                      </div>

                      {/* Bloque de precio: azul en el destacado, gris azulado en el resto */}
                      <div
                        className={cn(
                          "flex flex-1 flex-col rounded-b-[26px] px-7 pb-8 pt-7",
                          star ? "card-blue text-white" : "bg-[#eef1fa] text-ink"
                        )}
                      >
                        <div className="text-center">
                          <p className="font-display text-[42px] font-bold leading-none tracking-[-0.02em]">
                            {plan.mrr}
                          </p>
                          <p className={cn("mt-2 font-display text-[10px] font-medium uppercase tracking-[0.2em]", star ? "text-white/85" : "text-ink/60")}>
                            {plan.mrrNote.replace(/^\/?/, "")}
                          </p>
                        </div>

                        <p className={cn("mt-6 text-[15px]", star ? "text-white" : "text-ink")}>
                          <span className={cn("font-display font-bold", star ? "text-white" : "text-electric")}>
                            {plan.setupPrefix ? `${plan.setupPrefix} ` : ""}
                            {plan.setup}
                          </span>{" "}
                          <span className={star ? "text-white/85" : "text-ink/70"}>{plan.setupNote}</span>
                        </p>
                        <p className="mt-3 rounded-lg bg-white px-3.5 py-2.5 text-[12px] leading-snug text-electric">
                          <Rich text={plan.kitline} strongClass="font-semibold text-electric" />
                        </p>

                        <ul className="mt-6 flex flex-1 flex-col gap-3">
                          {plan.features.map((f) => (
                            <li key={f.text} className="flex gap-2.5 text-[13px] leading-snug">
                              <Check
                                className={cn("mt-0.5 h-4 w-4 shrink-0", star ? "text-neon" : "text-electric")}
                                strokeWidth={3}
                              />
                              <span className={star ? "text-white/90" : "text-ink/75"}>
                                <Rich text={f.text} strongClass={cn("font-semibold", star ? "text-white" : "text-ink")} />
                              </span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-7 flex flex-wrap gap-1.5">
                          {plan.quota.map((q) => (
                            <span key={q} className="rounded-full bg-[#101a3e] px-3 py-1 text-[11px] text-white">
                              {q}
                            </span>
                          ))}
                        </div>

                        {/* El slug del plan viaja en la URL: /contacto lo preselecciona */}
                        <Link
                          href={`/contacto?plan=${slug === "starter" ? "arranque" : slug}`}
                          onClick={() => trackEvent(`cta_plan_${slug}`)}
                          className={cn(
                            "mt-7 block rounded-full py-3.5 text-center font-display text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5",
                            star
                              ? "bg-white text-electric shadow-[0_14px_30px_-14px_rgba(0,0,0,0.5)] hover:bg-[#f2f5ff]"
                              : "btn-blue"
                          )}
                        >
                          {plan.cta}
                        </Link>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.2}>
              <p className="mt-14 text-center text-[15px] text-ink">
                {locale === "es" ? "¿Necesitas algo personalizado?" : "Need something custom?"}{" "}
                <Link
                  href="/contacto"
                  className="group inline-flex items-center gap-1 text-electric underline decoration-electric/40 underline-offset-4 hover:decoration-electric"
                >
                  {locale === "es" ? "Habla con nuestro equipo" : "Talk to our team"}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </p>
            </Reveal>
          </section>

          {/* ——— Diagnóstico ——— */}
          <section className="mx-auto max-w-6xl px-6 pt-10">
            <Reveal>
              <div className="grid gap-8 rounded-[26px] bg-[#d5dae9] px-8 py-10 md:grid-cols-[240px_1fr] md:items-center md:px-12">
                <div className="text-center">
                  <p className="font-display text-[34px] font-bold leading-none text-electric">0 €</p>
                  <p className="mt-1 font-display text-[13px] font-semibold text-ink">
                    {locale === "es" ? "Diagnóstico de IA" : "AI Diagnostic"}
                  </p>
                  <Link
                    href="/contacto"
                    onClick={() => trackEvent("cta_diagnostico_precios")}
                    className="btn-blue mt-4 inline-flex rounded-full px-7 py-2.5 font-display text-sm font-semibold"
                  >
                    {locale === "es" ? "Contactar" : "Contact"}
                  </Link>
                </div>
                <div>
                  <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-electric">{t.diag.badge}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/80">
                    <Rich text={t.diag.body} />
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Dos notas: la cuenta antes que la tarifa, y la voz en lista de espera */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <Reveal delay={0.05}>
                <div className="flex h-full flex-col rounded-[22px] border border-[#cad3ec] bg-white p-6">
                  <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-electric">{t.calc.badge}</p>
                  <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink/75">
                    <Rich text={t.calc.body} />
                  </p>
                  <Link
                    href="/calculadora"
                    onClick={() => trackEvent("cta_calculadora_precios")}
                    className="group mt-4 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-electric"
                  >
                    {t.calc.cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="h-full rounded-[22px] border border-[#cad3ec] bg-white p-6">
                  <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/55">{t.voice.badge}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink/75">
                    <Rich text={t.voice.body} />
                  </p>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ——— Comparativa ——— */}
          <section className="mx-auto max-w-6xl px-6 pt-28 md:pt-36">
            <SectionHead eyebrow={t.compare.eyebrow} titleA={t.compare.title} sub={t.compare.sub} />
            <Reveal delay={0.1} className="mt-12">
              <div className="overflow-x-auto rounded-[26px] border border-pulse bg-white shadow-[0_30px_80px_-50px_rgba(26,77,255,0.5)]">
                <table className="w-full min-w-[760px] border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="w-[36%] px-8 py-6 text-left font-display text-[17px] font-semibold text-ink">
                        {locale === "es" ? "Característica" : "Feature"}
                      </th>
                      {t.compare.cols.map((col, i) => (
                        <th
                          key={col}
                          className={cn(
                            "px-4 py-6 text-center font-display text-[17px] font-semibold text-ink",
                            i === 0 && "bg-[#eef1ff]"
                          )}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                    <tr aria-hidden>
                      <td colSpan={4} className="px-8">
                        <div className="h-px bg-pulse" />
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {t.compare.rows.map((row) => (
                      <tr key={row.label} className="transition-colors hover:bg-[#f6f7fd]">
                        <th className="px-8 py-2.5 text-left font-display text-[13px] font-semibold text-ink">{row.label}</th>
                        {row.cells.map((cell, ci) => (
                          <td
                            key={ci}
                            className={cn(
                              "px-4 py-2.5 text-center text-[13px]",
                              ci === 0 && "bg-[#eef1ff]",
                              row.strong ? "font-semibold text-ink" : "text-ink/75",
                              row.accent && "font-semibold text-electric"
                            )}
                          >
                            <CellValue value={cell} star={ci === 0} />
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr aria-hidden>
                      <td colSpan={4} className="py-3" />
                    </tr>
                  </tbody>
                </table>
              </div>
            </Reveal>
          </section>

          {/* ——— Módulos ——— */}
          <section className="mt-28 bg-gradient-to-b from-[#ecefff] to-[#d5dae9] py-24 md:mt-36 md:py-28">
            <div className="mx-auto max-w-6xl px-6">
              <SectionHead eyebrow={t.addons.eyebrow} titleA={`${t.addons.titleA} ${t.addons.titleB}`} sub={t.addons.sub} />
              <div className="mt-14 grid gap-5 min-[680px]:grid-cols-2 lg:grid-cols-3">
                {t.addons.items.map((addon, i) => {
                  const Icon = ADDON_ICONS[i] ?? Sparkle;
                  return (
                    <Reveal key={`${addon.name}-${i}`} delay={(i % 3) * 0.07} className="h-full">
                      <div className="flex h-full flex-col rounded-[22px] border border-[#cad3ec] bg-white p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(26,77,255,0.5)]">
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-display text-[17px] font-bold leading-tight text-ink">
                            {addon.name}
                            {addon.note && <span className="block text-sm font-normal text-ink/60">{addon.note.replace(/^·\s*/, "")}</span>}
                          </h4>
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-electric text-white">
                            <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                          </span>
                        </div>
                        <p className="mt-3 flex-1 text-[12.5px] leading-relaxed text-ink/70">{addon.desc}</p>
                        <div className="mt-5 flex items-end justify-between gap-3">
                          <p className="font-display text-[18px] font-semibold text-ink">
                            {addon.price && <span>{addon.price} </span>}
                            {addon.tail && <span className="text-electric">{addon.tail.replace(/^·\s*/, "")}</span>}
                          </p>
                          <Link
                            href="/contacto"
                            className="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-medium text-electric hover:underline"
                          >
                            {locale === "es" ? "Agregar" : "Add"}
                            <ChevronRight className="h-3 w-3" strokeWidth={2.2} />
                          </Link>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ——— Formas de pago: cuatro nodos unidos por una línea ——— */}
          <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <SectionHead eyebrow={t.pay.eyebrow} titleA={t.pay.titleA} titleB={t.pay.titleB} sub={t.pay.sub} />
            <div className="relative mt-14 grid gap-8 min-[680px]:grid-cols-2 xl:grid-cols-4 xl:gap-6">
              <div aria-hidden className="absolute left-[12%] right-[12%] top-[30px] hidden h-px bg-pulse xl:block" />
              {t.pay.items.map((item, i) => (
                <Reveal key={item.k} delay={(i % 4) * 0.08} className="relative">
                  <div className="relative mx-auto flex h-[60px] max-w-[250px] flex-col items-center justify-center rounded-full border border-electric bg-[#d5dae9] px-6">
                    <p className="font-display text-[19px] font-bold leading-none text-electric">{item.title}</p>
                    <p className="mt-1 text-[11px] text-ink/80">{item.k}</p>
                  </div>
                  <div className="mx-auto mt-6 max-w-[250px]">
                    <p className="text-[12.5px] leading-relaxed text-ink/70">{item.body}</p>
                    <p className="mt-2 font-display text-[12.5px] font-bold text-ink">{item.foot}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ——— FAQ ——— */}
          <section className="mx-auto max-w-3xl px-6 pb-24">
            <SectionHead eyebrow={t.faq.eyebrow} titleA={`${t.faq.titleA} ${t.faq.titleB}`} />
            <Reveal delay={0.1} className="mt-10 space-y-3">
              {t.faq.items.map((item) => (
                <details
                  key={item.q}
                  className="group/faq rounded-[22px] border border-pulse bg-[#e9ecf4] px-6 py-4 transition-colors open:bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-display text-[13px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span aria-hidden className="shrink-0 text-xl font-medium leading-none text-electric transition-transform duration-300 group-open/faq:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-ink/75">
                    <Rich text={item.a} />
                  </p>
                </details>
              ))}
            </Reveal>
          </section>

          {/* ——— CTA final: la tarjeta azul ——— */}
          <section id="contacto" className="mx-auto max-w-5xl px-6 pb-28">
            <Reveal>
              <div className="card-blue rounded-[28px] px-8 py-14 text-center text-white shadow-[0_50px_100px_-50px_rgba(26,77,255,0.8)] md:py-16">
                <h2 className="mx-auto font-display text-[clamp(1.8rem,3.6vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.02em]">
                  {t.final.titleA} {t.final.titleB}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-white/80">{t.final.sub}</p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/contacto"
                    onClick={() => trackEvent("cta_final_precios")}
                    className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-white px-8 py-3.5 font-display text-sm font-semibold text-electric shadow-[0_14px_30px_-14px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    {t.final.cta}
                  </Link>
                  <Link
                    href="/calculadora"
                    className="inline-flex min-w-[200px] items-center justify-center rounded-full border border-white/70 px-8 py-3.5 font-display text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10"
                  >
                    {t.calc.cta}
                  </Link>
                </div>
                <p className="mt-8 text-[11px] text-white/70">{t.final.mini}</p>
              </div>
            </Reveal>
          </section>
        </main>

        <FinalCTA tone="dark" />
        <Footer tone="dark" />
      </div>
      <ChatWidget />
      <VoiceWidget />
    </>
  );
}
