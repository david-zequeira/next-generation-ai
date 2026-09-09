"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  Cpu,
  Globe,
  MessageSquarePlus,
  MessagesSquare,
  Mic,
  Palette,
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
function Rich({ text, strongClass = "font-semibold text-black" }: { text: string; strongClass?: string }) {
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

/**
 * Cabecera de sección del Figma «Asenix Planes»: pastilla con borde en
 * degradado, título Montserrat Bold 52/52 en negro y subtítulo 18 en negro.
 */
function SectionHead({ eyebrow, title, sub, subClass }: { eyebrow: string; title: string; sub?: ReactNode; subClass?: string }) {
  return (
    <Reveal className="mx-auto flex flex-col items-center text-center">
      <p className="eyebrow eyebrow-light">{eyebrow}</p>
      <h2 className="mt-u-58 max-w-u-736 font-display fs-u-52 lh-u-52 font-bold text-black text-balance">{title}</h2>
      {sub && <p className={cn("mt-u-26 max-w-u-952 fs-u-18 lh-u-27 text-black", subClass)}>{sub}</p>}
    </Reveal>
  );
}

/** La estrella del Figma (capa «i2», 30×29): el mismo destello de los planes del home. */
function PlanStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M19.514 0.351486C19.6876 -0.117162 20.3124 -0.117162 20.486 0.351486L22.3432 5.4719C24.3914 11.1478 28.8522 15.626 34.5281 17.6741L39.6485 19.514C40.1172 19.6876 40.1172 20.3298 39.6485 20.5034L34.5281 22.3432C28.8522 24.3914 24.3914 28.8522 22.3432 34.5281L20.486 39.6485C20.3124 40.1172 19.6876 40.1172 19.514 39.6485L17.6568 34.5281C15.6086 28.8522 11.1478 24.3914 5.4719 22.3432L0.351486 20.5034C-0.117162 20.3298 -0.117162 19.6876 0.351486 19.514L5.4719 17.6741C11.1478 15.626 15.6086 11.1478 17.6568 5.4719L19.514 0.351486Z"
      />
    </svg>
  );
}

/**
 * Celda de la comparativa (Figma): círculo de 24 con el check —en degradado
 * lima en la columna destacada, azul noche en las otras—, guion, o texto.
 */
function CellValue({ value, star }: { value: string; star: boolean }) {
  if (value === "✓")
    return (
      <span
        aria-label="✓"
        className={cn(
          "mx-auto flex size-u-24 items-center justify-center rounded-full",
          star ? "bg-[linear-gradient(180deg,#b8f21e_0%,#97ca0f_100%)] text-space" : "bg-space text-white"
        )}
      >
        <Check className="size-u-12" strokeWidth={3} />
      </span>
    );
  if (value === "—") return <span aria-label="—">–</span>;
  return <>{value}</>;
}

/** Iconos de los módulos, por orden del diccionario. */
const ADDON_ICONS: LucideIcon[] = [Mic, MessageSquarePlus, MessagesSquare, CalendarDays, Globe, Cpu, Palette, Camera];

/** Orden de las formas de pago en el Figma: sin entrada (recomendado), contado, fraccionado, lo mismo. */
const PAY_ORDER = [2, 0, 1, 3];

/**
 * /precios — la tarifa completa con las medidas del Figma «Asenix Planes»
 * (marco 690:14, tema claro): cabecera, tres planes en tarjetas de 377×1169,
 * la banda del Diagnóstico, la comparativa en su tarjeta, los módulos sobre
 * fondo lavanda, las cuatro formas de pago unidas por una línea, las dudas
 * razonables y la tarjeta azul del cierre. Los textos y precios siguen
 * viviendo en `src/i18n/pricing.ts`, ES y EN.
 */
export default function PricingPage() {
  const { locale } = useLocale();
  const t = pricingDicts[locale];
  const es = locale === "es";

  return (
    <>
      <div className="relative min-h-screen overflow-x-clip bg-white text-black">
        <Navbar tone="light" />

        <main className="relative">
          {/* ——— Cabecera (Figma): pastilla, título 52/54 en #0b1226, texto de pago y CTA ——— */}
          <header className="relative mx-auto flex max-w-[1920px] flex-col items-center px-5 pt-u-201 text-center md:px-10 xl:px-[12.5%]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-[120px] h-[826px] bg-[linear-gradient(180deg,#ffffff_0%,rgba(240,242,245,0)_65%)]"
            />
            <Reveal className="relative flex flex-col items-center">
              <p className="eyebrow eyebrow-light">{t.header.eyebrow}</p>
              <h1 className="mt-u-57 max-w-u-946 font-display fs-u-52 lh-u-54 font-bold text-ink text-balance">
                {t.header.titleA} {t.header.titleB}
              </h1>
              <p className="mt-u-37 max-w-u-950 fs-u-18 lh-u-22 text-black">
                <Rich text={t.kit.body} strongClass="font-semibold" />
              </p>
              <p className="mt-u-16 max-w-u-950 fs-u-15 lh-u-22 text-black/60">{t.header.lede}</p>
            </Reveal>
            {/* Figma: pastilla de 337×70 en azul noche, Montserrat 500 20 */}
            <Reveal delay={0.1} className="relative mt-u-44">
              <Link
                href="/contacto"
                onClick={() => trackEvent("cta_header_precios")}
                className="inline-flex h-u-70 min-w-u-337 cursor-pointer items-center justify-center rounded-u-25 bg-space px-u-30 font-display fs-u-20 font-medium text-frost transition-colors hover:bg-electric"
              >
                {t.header.cta}
              </Link>
            </Reveal>
          </header>

          {/* ——— Planes (Figma): tres tarjetas de 377×1169, radio 35, con la etiqueta asomando ——— */}
          <section className="mx-auto mt-u-160 max-w-[1920px] px-5 md:px-10">
            <div className="mx-auto grid max-w-u-1190 items-stretch gap-8 min-[680px]:grid-cols-2 xl:grid-cols-3 xl:gap-u-30">
              {t.plans.map((plan, i) => {
                const star = !!plan.star;
                const slug = plan.name.toLowerCase();
                return (
                  <Reveal key={plan.name} delay={(i % 3) * 0.08} className="relative h-full">
                    {plan.tag && (
                      // Figma: 206×33, radio 25, azul de marca, SemiBold 14 — asoma por el borde superior
                      <span className="absolute top-[calc(-1*max(10px,17*var(--u)))] left-u-40 z-10 inline-flex h-u-33 items-center rounded-u-25 bg-electric px-u-21 font-display fs-u-14 font-semibold text-[#eef2ff]">
                        {plan.tag}
                      </span>
                    )}
                    <article className="group flex h-full flex-col overflow-hidden rounded-u-35 bg-white shadow-[0_0_45px_10px_rgba(16,26,62,0.2)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5">
                      {/* Cabecera blanca: estrella de 30, nombre Bold 30, para quién 15/18 */}
                      <div className="min-h-u-164 px-u-38 pb-u-24 pt-u-40">
                        <div className="flex items-center gap-u-24">
                          <PlanStar className={cn("size-u-30 shrink-0", star ? "text-neon" : "text-electric")} />
                          <h3 className="font-display fs-u-30 leading-none font-bold text-black">{plan.name}</h3>
                        </div>
                        <p className="mt-u-16 max-w-u-298 fs-u-15 lh-u-18 text-black">{plan.who}</p>
                      </div>

                      {/* Cuerpo: azul en el destacado, lavanda→blanco en el resto */}
                      <div
                        className={cn(
                          "flex flex-1 flex-col px-u-32 pb-u-58 pt-u-57",
                          star ? "bg-[linear-gradient(180deg,#3b67ff_0%,#29459f_100%)] text-white" : "bg-[linear-gradient(180deg,#d5dae9_0%,#ffffff_62%)] text-black"
                        )}
                      >
                        <div className="text-center">
                          <p className="font-display fs-u-48 font-bold leading-none tracking-[0.02em]">{plan.mrr}</p>
                          <p className="mt-u-10 font-display fs-u-12 font-medium uppercase tracking-[0.07em]">{plan.mrrNote.replace(/^\/?/, "")}</p>
                        </div>

                        <p className="mt-u-45 font-display fs-u-18 leading-none">
                          <span className={cn("font-extrabold", star ? "text-neon" : "text-electric")}>
                            {plan.setupPrefix ? `${plan.setupPrefix} ` : ""}
                            {plan.setup}
                          </span>{" "}
                          <span className={cn("font-medium", star ? "text-neon" : "text-electric")}>{plan.setupNote}</span>
                        </p>
                        {/* Figma: caja blanca 317×70, radio 5, texto 14/16 azul con «0 € de entrada» en negro */}
                        <p className="mt-u-12 rounded-u-5 bg-white px-u-27 py-u-12 fs-u-14 lh-u-16 font-medium text-electric">
                          <Rich text={plan.kitline} strongClass="font-medium text-black" />
                        </p>

                        <ul className="mt-u-20 flex flex-1 flex-col gap-u-14">
                          {plan.features.map((f) => (
                            <li key={f.text} className="flex gap-u-13 fs-u-14 lh-u-17">
                              <Check className={cn("mt-u-2 size-u-14 shrink-0", star ? "text-neon" : i === 0 ? "text-electric" : "text-space")} strokeWidth={3} />
                              <span className={star ? "text-white" : "text-black"}>
                                <Rich text={f.text} strongClass={cn("font-semibold", star ? "text-white" : "text-black")} />
                              </span>
                            </li>
                          ))}
                        </ul>

                        {/* Figma: pastillas de 30 px en azul noche, 12 px blanco */}
                        <div className="mt-u-40 flex flex-wrap gap-u-8">
                          {plan.quota.map((q) => (
                            <span key={q} className="inline-flex h-u-30 items-center rounded-u-25 bg-space px-u-14 fs-u-12 text-white">
                              {q}
                            </span>
                          ))}
                        </div>

                        {/* Figma: 226×57, radio 25, azul de marca, SemiBold 16. El slug del plan viaja a /contacto */}
                        <Link
                          href={`/contacto?plan=${slug === "starter" ? "arranque" : slug}`}
                          onClick={() => trackEvent(`cta_plan_${slug}`)}
                          className={cn(
                            "mx-auto mt-u-40 flex h-u-57 w-u-226 max-w-full items-center justify-center rounded-u-25 font-display fs-u-16 font-semibold transition-all duration-300 hover:-translate-y-0.5",
                            star ? "bg-white text-electric shadow-[0_14px_30px_-14px_rgba(0,0,0,0.5)] hover:bg-[#f2f5ff]" : "bg-electric text-white hover:bg-[#2557ff]"
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

            {/* Figma: «¿Necesitas algo personalizado? Habla con nuestro equipo →», Medium 20 */}
            <Reveal delay={0.2}>
              <p className="mt-u-100 text-center font-display fs-u-20 lh-u-24 font-medium text-black">
                {es ? "¿Necesitas algo personalizado?" : "Need something custom?"}{" "}
                <Link href="/contacto" className="group inline-flex items-center gap-1 text-electric transition-colors hover:text-ink">
                  {es ? "Habla con nuestro equipo" : "Talk to our team"}
                  <ArrowRight className="size-u-18 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </p>
            </Reveal>
          </section>

          {/* ——— Banda del Diagnóstico (Figma): 1268×220 en #d5dae9, radio 25 ——— */}
          <section className="mx-auto mt-u-56 max-w-[1920px] px-5 md:px-10">
            <Reveal>
              <div className="mx-auto grid max-w-u-1268 items-center gap-8 rounded-u-25 bg-[#d5dae9] px-6 py-u-40 md:grid-cols-[minmax(0,320fr)_minmax(0,948fr)] md:px-u-60">
                <div className="flex flex-col items-center text-center">
                  <p className="font-display fs-u-38 font-semibold leading-none text-electric">0 €</p>
                  <p className="mt-u-8 font-display fs-u-15 font-semibold text-black">{es ? "Diagnóstico de IA" : "AI Diagnostic"}</p>
                  {/* Figma: 183×58, radio 50, azul con borde #94b2fc, SemiBold 16 */}
                  <Link
                    href="/contacto"
                    onClick={() => trackEvent("cta_diagnostico_precios")}
                    className="mt-u-20 inline-flex h-u-58 min-w-u-183 items-center justify-center rounded-full border border-pulse bg-electric px-u-30 font-display fs-u-16 font-semibold text-white transition-colors hover:bg-[#2557ff]"
                  >
                    {es ? "Contactar" : "Contact"}
                  </Link>
                </div>
                <p className="max-w-u-675 fs-u-18 lh-u-23 text-black">
                  <Rich text={t.diag.body} strongClass="font-semibold" />
                </p>
              </div>
            </Reveal>

            {/* Dos notas que el Figma no dibuja pero que sostienen decisiones de tarifa:
                la cuenta antes que el precio, y la voz en lista de espera */}
            <div className="mx-auto mt-u-24 grid max-w-u-1268 gap-6 md:grid-cols-2">
              <Reveal delay={0.05}>
                <div
                  style={{ ["--ring-bg" as string]: "linear-gradient(0deg, #94b2fc, #c7d7ff)" }}
                  className="ring-conic flex h-full flex-col rounded-u-25 bg-white px-u-36 py-u-32 shadow-[0_0_15px_rgba(0,0,0,0.12)]"
                >
                  <p className="font-display fs-u-14 font-bold uppercase tracking-[0.1em] text-electric">{t.calc.badge}</p>
                  <p className="mt-u-12 flex-1 fs-u-15 lh-u-22 text-black">
                    <Rich text={t.calc.body} />
                  </p>
                  <Link
                    href="/calculadora"
                    onClick={() => trackEvent("cta_calculadora_precios")}
                    className="group mt-u-16 inline-flex items-center gap-1.5 font-display fs-u-15 font-semibold text-electric"
                  >
                    {t.calc.cta}
                    <ArrowRight className="size-u-16 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div
                  style={{ ["--ring-bg" as string]: "linear-gradient(0deg, #94b2fc, #c7d7ff)" }}
                  className="ring-conic h-full rounded-u-25 bg-white px-u-36 py-u-32 shadow-[0_0_15px_rgba(0,0,0,0.12)]"
                >
                  <p className="font-display fs-u-14 font-bold uppercase tracking-[0.1em] text-black/55">{t.voice.badge}</p>
                  <p className="mt-u-12 fs-u-15 lh-u-22 text-black">
                    <Rich text={t.voice.body} />
                  </p>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ——— Comparativa (Figma): tarjeta de 1440×1128, radio 35, columna Starter destacada ——— */}
          <section className="mx-auto mt-u-96 max-w-[1920px] px-5 md:px-10 xl:px-[12.5%]">
            <SectionHead eyebrow={t.compare.eyebrow} title={t.compare.title} sub={t.compare.sub} subClass="lh-u-22" />
            <Reveal delay={0.1} className="mt-u-121">
              <div
                style={{ ["--ring-w" as string]: "1.3px", ["--ring-bg" as string]: "linear-gradient(0deg, #9babd4, #c7d7ff)" }}
                className="ring-conic overflow-x-auto rounded-u-35 bg-white/50 shadow-[0_0_20px_rgba(0,0,0,0.2)]"
              >
                <table className="w-full min-w-[760px] border-collapse">
                  <thead>
                    <tr>
                      <th className="w-[36%] px-u-86 pb-u-32 pt-u-41 text-left font-display fs-u-24 lh-u-30 font-semibold text-black">
                        {es ? "Característica" : "Feature"}
                      </th>
                      {t.compare.cols.map((col, i) => (
                        <th
                          key={col}
                          className={cn(
                            "px-4 pb-u-32 pt-u-41 text-center font-display fs-u-24 lh-u-30 text-black",
                            i === 0 ? "bg-cloud/20 font-semibold" : "font-bold"
                          )}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                    <tr aria-hidden>
                      <td colSpan={4} className="px-u-86">
                        <div className="h-px bg-[rgba(154,165,192,0.8)]" />
                      </td>
                    </tr>
                  </thead>
                  <tbody className="bg-[linear-gradient(180deg,#ffffff_0%,#ecefff_40%)]">
                    {t.compare.rows.map((row) => (
                      <tr key={row.label} className="transition-colors hover:bg-cloud/10">
                        <th className="h-u-45 px-u-86 text-left font-display fs-u-16 font-bold text-black">
                          {/* Figma: cuadradito de 11 px delante de cada característica */}
                          <span className="mr-u-22 inline-block size-u-11 align-middle border-[1.3px] border-[rgba(115,125,149,0.8)]" aria-hidden />
                          {row.label}
                        </th>
                        {row.cells.map((cell, ci) => (
                          <td
                            key={ci}
                            className={cn(
                              "h-u-45 px-4 text-center fs-u-16",
                              ci === 0 && "bg-cloud/20",
                              row.strong ? "font-bold text-black" : "font-medium text-black",
                              row.accent && "font-bold text-electric"
                            )}
                          >
                            <CellValue value={cell} star={ci === 0} />
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr aria-hidden>
                      <td colSpan={4} className="py-u-24" />
                    </tr>
                  </tbody>
                </table>
              </div>
            </Reveal>
          </section>

          {/* ——— Módulos (Figma): fondo lavanda, tarjetas de 459×244 con icono azul y flecha ——— */}
          <section className="mt-u-153 bg-[linear-gradient(180deg,#f4f6ff_0%,rgba(213,218,233,0.74)_100%)] pb-u-170 pt-u-105">
            <div className="mx-auto max-w-[1920px] px-5 md:px-10 xl:px-[12.5%]">
              <SectionHead eyebrow={t.addons.eyebrow} title={`${t.addons.titleA} ${t.addons.titleB}`} sub={t.addons.sub} />
              <div className="mt-u-90 grid gap-6 min-[680px]:grid-cols-2 lg:grid-cols-3 lg:gap-u-32">
                {t.addons.items.map((addon, i) => {
                  const Icon = ADDON_ICONS[i] ?? Cpu;
                  return (
                    <Reveal key={`${addon.name}-${i}`} delay={(i % 3) * 0.07} className="h-full">
                      <div
                        style={{ ["--ring-bg" as string]: "linear-gradient(0deg, #94b2fc, #c7d7ff)" }}
                        className="ring-conic relative flex h-full min-h-u-244 flex-col rounded-u-25 bg-white px-u-36 pb-u-33 pt-u-41 shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
                      >
                        {/* Figma: icono de 57×57, radio 15, degradado azul, arriba a la derecha */}
                        <span className="absolute right-u-25 top-u-37 flex size-u-57 items-center justify-center rounded-u-15 bg-[linear-gradient(180deg,#1a4dff_0%,#1036ba_100%)] text-white">
                          <Icon className="size-u-25" strokeWidth={2} />
                        </span>
                        <h4 className="max-w-u-297 font-display fs-u-22 lh-u-24 font-bold text-black">
                          {addon.name}
                          {addon.note && <span className="block font-normal">{addon.note.replace(/^·\s*/, "")}</span>}
                        </h4>
                        <p className="mt-u-16 max-w-u-388 flex-1 fs-u-15 lh-u-17 text-black">{addon.desc}</p>
                        <div className="mt-u-20 flex items-end justify-between gap-3">
                          <p className="font-display fs-u-25 lh-u-30 font-semibold text-black">
                            {addon.price && <span>{addon.price} </span>}
                            {addon.tail && <span className="text-electric">{addon.tail.replace(/^·\s*/, "")}</span>}
                          </p>
                          <Link
                            href="/contacto"
                            aria-label={es ? `Agregar ${addon.name}` : `Add ${addon.name}`}
                            className="inline-flex shrink-0 items-center text-[#556a9e] transition-transform hover:translate-x-0.5"
                          >
                            <ArrowRight className="size-u-26" strokeWidth={2} />
                          </Link>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ——— Formas de pago (Figma): cuatro pastillas de 295×92 unidas por una línea azul ——— */}
          <section className="mx-auto max-w-[1920px] px-5 pt-u-146 md:px-10 xl:px-[12.5%]">
            <SectionHead eyebrow={t.pay.eyebrow} title={`${t.pay.titleA} ${t.pay.titleB}`} sub={t.pay.sub} />
            <div className="relative mx-auto mt-u-93 grid max-w-u-1420 gap-10 min-[680px]:grid-cols-2 xl:grid-cols-4 xl:gap-u-73">
              {PAY_ORDER.map((idx, i) => {
                const item = t.pay.items[idx];
                return (
                  <Reveal key={item.k} delay={i * 0.08} className="relative">
                    {i < PAY_ORDER.length - 1 && (
                      <span aria-hidden className="absolute right-[calc(-1*max(44px,73*var(--u)))] top-u-47 hidden h-px w-u-73 bg-electric xl:block" />
                    )}
                    <div className="mx-auto flex h-u-92 w-full max-w-u-295 flex-col items-center justify-center rounded-full border border-electric bg-[#d5dae9] px-4">
                      <p className="font-display fs-u-30 font-bold leading-none text-electric">{item.title}</p>
                      <p className="mt-u-4 fs-u-16 font-medium leading-none text-black">{item.k}</p>
                    </div>
                    <div className="mx-auto mt-u-33 max-w-u-295">
                      {/* Figma: las dos primeras explicaciones en SemiBold, las otras en Regular */}
                      <p className={cn("fs-u-16 lh-u-21 text-black", i < 2 && "font-semibold")}>{item.body}</p>
                      <p className="mt-u-6 font-display fs-u-16 lh-u-21 font-bold text-void">{item.foot}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* ——— Dudas razonables (Figma): filas de 704×80, radio 25, borde en degradado ——— */}
          <section className="mx-auto max-w-[1920px] px-5 pt-u-220 md:px-10 xl:px-[12.5%]">
            <SectionHead eyebrow={t.faq.eyebrow} title={`${t.faq.titleA} ${t.faq.titleB}`} />
            <Reveal delay={0.1} className="mx-auto mt-u-83 flex max-w-u-704 flex-col gap-u-13">
              {t.faq.items.map((item) => (
                <details
                  key={item.q}
                  style={{ ["--ring-w" as string]: "1.3px", ["--ring-bg" as string]: "linear-gradient(0deg, #9babd4, #c7d7ff)" }}
                  className="ring-conic group/faq rounded-u-25 bg-white/50 px-u-41 py-u-20 transition-colors open:bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-display fs-u-16 lh-u-23 font-bold text-black [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span aria-hidden className="shrink-0 fs-u-42 font-medium leading-none text-electric transition-transform duration-300 group-open/faq:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-u-14 max-w-[70ch] fs-u-15 lh-u-22 text-black/80">
                    <Rich text={item.a} />
                  </p>
                </details>
              ))}
            </Reveal>
          </section>

          {/* ——— CTA final (Figma): tarjeta de 1197×460, radio 35, degradado #3b67ff→#29459f ——— */}
          <section id="contacto" className="mx-auto mt-u-85 max-w-[1920px] px-5 pb-u-200 md:px-10">
            <Reveal>
              <div className="mx-auto flex max-w-u-1197 flex-col items-center rounded-u-35 bg-[linear-gradient(180deg,#3b67ff_0%,#29459f_100%)] px-6 pb-u-58 pt-u-52 text-center text-white">
                <p className="eyebrow eyebrow-white">{t.final.eyebrow}</p>
                <h2 className="mt-u-34 max-w-u-766 font-display fs-u-40 lh-u-40 font-bold text-white text-balance">
                  {t.final.titleA} {t.final.titleB}
                </h2>
                <p className="mt-u-46 max-w-u-772 fs-u-18 lh-u-23 text-white">{t.final.sub}</p>
                {/* Figma: 223×69, radio 50, blanco con borde #94b2fc, SemiBold 15 azul */}
                <div className="mt-u-50 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-u-20">
                  <Link
                    href="/contacto"
                    onClick={() => trackEvent("cta_final_precios")}
                    className="inline-flex h-u-69 min-w-u-223 items-center justify-center rounded-full border border-pulse bg-white px-u-30 font-display fs-u-15 font-semibold text-electric shadow-[0_14px_30px_-14px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    {t.final.cta}
                  </Link>
                  <Link
                    href="/calculadora"
                    className="inline-flex h-u-69 min-w-u-223 items-center justify-center rounded-full border border-white/70 px-u-30 font-display fs-u-15 font-semibold text-white transition-colors duration-300 hover:bg-white/10"
                  >
                    {t.calc.cta}
                  </Link>
                </div>
                <p className="mt-u-25 fs-u-14 lh-u-23 text-mint">{t.final.mini}</p>
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
