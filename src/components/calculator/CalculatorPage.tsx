"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck, MessageSquare, PlusCircle, RefreshCcw, Workflow } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FinalCTA from "@/components/sections/FinalCTA";
import ChatWidget from "@/components/ui/ChatWidget";
import VoiceWidget from "@/components/ui/VoiceWidget";
import { cn } from "@/lib/utils";
import { COMPANY } from "@/lib/company";
import { getSessionId } from "@/lib/session";
import { trackEvent } from "@/lib/track";
import { useLocale } from "@/i18n/LocaleContext";
import {
  CALC_PLANS,
  calcDicts,
  calculate,
  type CalcPlanKey,
} from "@/i18n/calculadora";

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "";
const EMAIL = COMPANY.email;
const EASE = [0.16, 1, 0.3, 1] as const;

/** Los campos viven como texto: un input vacío no es un 0, y 0 miente. */
type Fields = { ticket: string; visits: string; missed: string; noShows: string };
const EMPTY: Fields = { ticket: "", visits: "", missed: "", noShows: "" };

/** Peluquería de barrio con precios reales. No es el caso bueno: es el normal. */
const EXAMPLE: Fields = { ticket: "45", visits: "6", missed: "10", noShows: "12" };

const toNumber = (v: string): number => {
  const n = parseFloat(v.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

/** `**negrita**` del diccionario → <strong>. Mismo contrato que en /precios. */
function Rich({ text, strongClass = "font-semibold text-white" }: { text: string; strongClass?: string }) {
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

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.85, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Cabecera de cada paso (Figma): icono «plus circle» de 33 px en #779eff y
 * título Montserrat Bold 25 en azul de marca; debajo, si lo hay, el subtítulo.
 */
function StepHead({ title, body }: { title: string; body?: string }) {
  return (
    <div>
      <div className="flex items-center gap-u-15">
        <PlusCircle className="size-u-33 shrink-0 text-[#779eff]" strokeWidth={2} />
        <h2 className="font-display fs-u-25 leading-none font-bold text-electric">{title}</h2>
      </div>
      {body && <p className="mt-u-22 max-w-u-523 fs-u-16 lh-u-23 text-white">{body}</p>}
    </div>
  );
}

/**
 * Campo del Figma: etiqueta SemiBold 16 blanca, caja blanca de 67 px con radio
 * 16 y sombra corta, sufijo a la derecha, y la ayuda en Light 15 azul claro.
 */
function Field({
  label,
  hint,
  value,
  onChange,
  suffix,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  suffix: string;
}) {
  return (
    <label className="block">
      <span className="block font-display fs-u-16 lh-u-30 font-semibold text-white">{label}</span>
      <span className="relative mt-u-13 flex items-center">
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.,]/g, ""))}
          placeholder="..."
          className="h-u-67 w-full rounded-u-16 bg-white pl-u-26 pr-u-90 font-display fs-u-15 font-medium text-void shadow-[0_1px_4px_rgba(12,12,13,0.05),0_1px_4px_rgba(12,12,13,0.1)] outline-none ring-2 ring-transparent transition-shadow duration-200 placeholder:font-normal placeholder:text-void/60 focus:ring-electric"
        />
        <span className="pointer-events-none absolute right-u-25 fs-u-15 font-medium text-black">{suffix}</span>
      </span>
      <span className="mt-u-13 block fs-u-15 lh-u-22 font-light text-cloud/80">{hint}</span>
    </label>
  );
}

/** Tarjeta de paso (Figma): 857 de ancho, radio 25, degradado navy→abyss y borde de 1 px azul en degradado. */
function StepCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      style={{ ["--ring-w" as string]: "1px", ["--ring-bg" as string]: "linear-gradient(0deg, #1a4dff 0%, #102e99 100%)" }}
      className={cn("ring-conic rounded-u-25 bg-[linear-gradient(180deg,#101837_0%,#050b21_61%)] px-u-28 pb-u-32 pt-u-40", className)}
    >
      {children}
    </div>
  );
}

/** Módulo claro de la derecha (Figma): radio 35, degradado blanco→#c7d7ff. */
function LightModule({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-u-35 bg-[linear-gradient(180deg,#ffffff_0%,#c7d7ff_100%)] text-black", className)}>{children}</div>;
}

const SOLUTION_ICONS = [MessageSquare, CalendarCheck, Workflow];

/**
 * /calculadora — la versión pública de la cuenta de retorno, con las medidas
 * del Figma «Asenix Desktop» (marco 984:14321): el porqué arriba con las tres
 * fugas, la intro «//CALCULADORA», la gran tarjeta azul con los tres pasos y
 * el módulo claro de la cuenta a la derecha, «cómo se recupera», las dudas
 * razonables y la captura del desglose.
 *
 * Deliberadamente distinta de la que se usa en la llamada: cuatro preguntas en
 * vez de doce, hipótesis fijas y visibles en vez de deslizadores, tarifa pública
 * en vez de la de fundador, y ningún guion de venta. El resultado puede ser que
 * no compense, y eso se dice en pantalla. El motor vive en `src/i18n/calculadora.ts`.
 */
export default function CalculatorPage() {
  const { locale } = useLocale();
  const t = calcDicts[locale];

  const [fields, setFields] = useState<Fields>(EMPTY);
  const [sector, setSector] = useState<string>("");
  const [planKey, setPlanKey] = useState<CalcPlanKey>("arranque");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  const plan = CALC_PLANS.find((p) => p.k === planKey) ?? CALC_PLANS[0];
  const planCopy = t.form.plans.find((p) => p.k === planKey) ?? t.form.plans[0];

  const r = useMemo(
    () =>
      calculate(
        {
          ticket: toNumber(fields.ticket),
          visits: toNumber(fields.visits),
          missed: toNumber(fields.missed),
          noShows: toNumber(fields.noShows),
        },
        plan
      ),
    [fields, plan]
  );

  const hasData = r.leak > 0 || r.noShowGain > 0;
  const worksOut = hasData && Number.isFinite(r.payback);

  // Un solo evento la primera vez que la calculadora produce una cifra.
  const tracked = useRef(false);
  useEffect(() => {
    if (hasData && !tracked.current) {
      tracked.current = true;
      trackEvent("calc_completed");
    }
  }, [hasData]);

  const nf = useMemo(() => new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-GB"), [locale]);
  const cf = useMemo(
    () =>
      new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-GB", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
        useGrouping: true,
      }),
    [locale]
  );
  const eur = (n: number) => cf.format(Math.round(n));
  const months = (n: number) =>
    n.toLocaleString(locale === "es" ? "es-ES" : "en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const set = (k: keyof Fields) => (v: string) => setFields((f) => ({ ...f, [k]: v }));

  function pickSector(k: string, visits: number) {
    setSector(k);
    setFields((f) => ({ ...f, visits: String(visits) }));
  }

  function reset() {
    setFields(EMPTY);
    setSector("");
    setStatus("idle");
  }

  /** El desglose que viaja con el lead: el comercial ve lo mismo que vio él. */
  function breakdown(): string {
    const L = locale === "es";
    return [
      t.lead.subjectLine,
      "",
      `${L ? "Plan comparado" : "Plan compared"}: ${planCopy.name} (${eur(plan.setup)} + ${eur(plan.mrr)}${t.form.perMonth})`,
      `${t.form.ticketLabel}: ${eur(toNumber(fields.ticket))}`,
      `${t.form.visitsLabel}: ${nf.format(toNumber(fields.visits))}`,
      `${t.form.missedLabel}: ${nf.format(toNumber(fields.missed))}`,
      `${t.form.noShowsLabel}: ${nf.format(toNumber(fields.noShows))}`,
      "",
      `${t.result.clientValueLabel}: ${eur(r.clientValue)}`,
      `${t.result.rows.leak.label}: ${eur(r.leak)}${t.form.perMonth}`,
      `${t.result.rows.recovered.label}: ${eur(r.recovered)}${t.form.perMonth}`,
      `${t.result.rows.noShows.label}: ${eur(r.noShowGain)}${t.form.perMonth}`,
      `${t.result.rows.gain.label}: ${eur(r.gain)}${t.form.perMonth}`,
      `${t.result.rows.cost.label}: ${eur(r.cost)}${t.form.perMonth}`,
      `${t.result.rows.net.label}: ${eur(r.net)}${t.form.perMonth}`,
      `${t.result.paybackLabel}: ${worksOut ? `${months(r.payback)} ${t.result.months}` : L ? "no sale" : "does not add up"}`,
      `${t.result.roiLabel}: ${Math.round(r.roi)} %`,
    ].join("\n");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      contact: String(data.get("contact") ?? "").trim(),
      message: breakdown(),
      plan: planKey,
      sessionId: getSessionId(),
      website: String(data.get("website") ?? "") || undefined,
    };

    if (!AGENT_URL) {
      const subject = encodeURIComponent(t.lead.subjectLine);
      const body = encodeURIComponent(`${payload.name}\n${payload.contact}\n\n${payload.message}`);
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`${AGENT_URL}/api/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("ok");
      trackEvent("calc_lead_submitted");
    } catch {
      setStatus("error");
    }
  }

  const gainPct = r.leak > 0 ? Math.min(100, (r.recovered / r.leak) * 100) : 0;

  const rows: { k: string; label: string; note: string; value: string; tone?: "gain" | "cost" | "net" }[] = [
    { k: "leak", label: t.result.rows.leak.label, note: t.result.rows.leak.note, value: eur(r.leak) },
    { k: "rec", label: t.result.rows.recovered.label, note: t.result.rows.recovered.note, value: eur(r.recovered), tone: "gain" },
    { k: "ns", label: t.result.rows.noShows.label, note: t.result.rows.noShows.note, value: eur(r.noShowGain), tone: "gain" },
    { k: "gain", label: t.result.rows.gain.label, note: t.result.rows.gain.note, value: eur(r.gain), tone: "gain" },
    { k: "cost", label: t.result.rows.cost.label, note: t.result.rows.cost.note, value: `−${eur(r.cost)}`, tone: "cost" },
    { k: "net", label: t.result.rows.net.label, note: t.result.rows.net.note, value: `${r.net < 0 ? "−" : ""}${eur(Math.abs(r.net))}`, tone: "net" },
  ];

  // Figma: caja blanca de 67 px, radio 15, placeholder Light 16 negro
  const inputCls =
    "h-u-67 w-full rounded-u-15 bg-white pl-u-23 pr-u-16 fs-u-16 font-light text-black shadow-[0_1px_4px_rgba(12,12,13,0.05),0_1px_4px_rgba(12,12,13,0.1)] outline-none ring-2 ring-transparent transition-shadow duration-200 placeholder:text-black/70 focus:ring-electric";

  const loadExample = () => {
    setFields(EXAMPLE);
    setSector("belleza");
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-void">
      <Navbar />

      <main className="relative">
        {/* ——— Cabecera (Figma): titular 52/54, entradilla y las tres fugas ——— */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#030617_0%,#040b24_100%)] pb-u-160 pt-u-215">
          <div className="relative mx-auto max-w-[1920px] px-5 md:px-10 xl:px-[12.5%]">
            <Reveal className="mx-auto flex flex-col items-center text-center">
              <h1 className="max-w-u-768 font-display fs-u-52 lh-u-54 font-bold text-white text-balance">{t.why.headline}</h1>
              <p className="mt-u-35 max-w-u-1002 fs-u-20 lh-u-28 text-cloud">{t.why.lede}</p>
            </Reveal>

            <div className="mt-u-103 grid gap-10 md:grid-cols-3 md:gap-u-100">
              {t.why.leaks.map((item, i) => (
                <Reveal key={item.title} delay={0.08 * i} className="flex gap-u-30">
                  {/* Figma: cuadrado azul de 52 con la cifra en lima */}
                  <span className="flex size-u-52 shrink-0 items-center justify-center rounded-u-10 bg-electric font-display fs-u-28 font-semibold text-neon">
                    {i + 1}
                  </span>
                  <p className="fs-u-20 lh-u-30 text-white">
                    <span className="font-display fs-u-25 font-semibold text-electric">{item.title}</span> {item.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ——— Intro «//CALCULADORA» ——— */}
        <header className="mx-auto flex max-w-[1920px] flex-col items-center px-5 pt-u-157 text-center md:px-10 xl:px-[12.5%]">
          <Reveal className="flex flex-col items-center">
            <p className="eyebrow">{t.intro.eyebrow}</p>
            <h2 className="mt-u-65 max-w-u-946 font-display fs-u-35 lh-u-46 font-normal text-white text-balance">{t.intro.title}</h2>
            <p className="mt-u-25 max-w-u-1007 fs-u-20 lh-u-28 text-cloud">{t.intro.body}</p>
          </Reveal>
        </header>

        {/* ——— Formulario + cuenta (Figma: tarjeta 947 + módulo 462, hueco 33) ——— */}
        <div className="mx-auto mt-u-130 grid max-w-[1920px] gap-8 px-5 md:px-10 lg:grid-cols-[minmax(0,947fr)_minmax(0,462fr)] lg:items-start lg:gap-u-33 xl:px-[12.5%]">
          {/* — la gran tarjeta azul marino con los tres pasos — */}
          <Reveal>
            <div
              style={{ ["--ring-w" as string]: "0.5px" }}
              className="ring-conic rounded-u-35 bg-[linear-gradient(180deg,rgba(16,26,62,0.5)_0%,rgba(26,59,169,0.5)_100%)] p-4 pb-u-56 sm:p-u-46"
            >
              {/* 1 · Tu negocio */}
              <StepCard>
                <StepHead title={t.form.step1Title} />
                <p className="mt-u-40 font-display fs-u-16 lh-u-30 font-semibold text-white">{t.form.sectorLabel}</p>
                <p className="mt-u-2 fs-u-15 lh-u-22 text-white">{t.form.sectorHint}</p>
                {/* Figma: pastillas de 37 px en #779eff con el texto SemiBold 15 negro */}
                <div className="mt-u-28 flex flex-wrap gap-x-u-15 gap-y-u-25">
                  {t.form.sectors.map((s) => (
                    <button
                      key={s.k}
                      type="button"
                      aria-pressed={sector === s.k}
                      onClick={() => pickSector(s.k, s.visits)}
                      className={cn(
                        "h-u-37 cursor-pointer rounded-full px-u-22 font-display fs-u-15 font-semibold transition-all duration-200",
                        sector === s.k ? "bg-electric text-white shadow-[0_10px_24px_-12px_rgba(26,77,255,1)]" : "bg-[#779eff] text-black hover:bg-cloud"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="mt-u-46 grid gap-6 sm:grid-cols-2 sm:gap-x-u-31">
                  <Field label={t.form.ticketLabel} hint={t.form.ticketHint} value={fields.ticket} onChange={set("ticket")} suffix="€" />
                  <Field
                    label={t.form.visitsLabel}
                    hint={t.form.visitsHint}
                    value={fields.visits}
                    onChange={set("visits")}
                    suffix={locale === "es" ? "Al año" : "A year"}
                  />
                </div>
                {r.clientValue > 0 && (
                  <p className="mt-u-24 rounded-u-16 bg-white/[0.08] px-u-20 py-u-14 fs-u-15 text-cloud">
                    {t.result.clientValueLabel}{" "}
                    <strong className="font-display font-semibold text-neon">{eur(r.clientValue)}</strong>
                  </p>
                )}
              </StepCard>

              {/* 2 · Lo que se escapa hoy */}
              <StepCard className="mt-u-30">
                <StepHead title={t.form.step2Title} body={t.form.step2Body} />
                <div className="mt-u-38 grid gap-6 sm:grid-cols-2 sm:gap-x-u-31">
                  <Field
                    label={t.form.missedLabel}
                    hint={t.form.missedHint}
                    value={fields.missed}
                    onChange={set("missed")}
                    suffix={locale === "es" ? "/ Sem" : "/ wk"}
                  />
                  <Field
                    label={t.form.noShowsLabel}
                    hint={t.form.noShowsHint}
                    value={fields.noShows}
                    onChange={set("noShows")}
                    suffix={locale === "es" ? "/ Mes" : "/ mo"}
                  />
                </div>
              </StepCard>

              {/* 3 · Con qué plan lo comparo */}
              <StepCard className="mt-u-30">
                <StepHead title={t.form.step3Title} body={t.form.step3Body} />
                {/* Figma: tarjetas de 246×205, radio 15; la elegida en degradado azul, las otras claras */}
                <div className="mt-u-40 grid gap-u-15 sm:grid-cols-3">
                  {t.form.plans.map((p) => {
                    const data = CALC_PLANS.find((c) => c.k === p.k) ?? CALC_PLANS[0];
                    const active = planKey === p.k;
                    return (
                      <button
                        key={p.k}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setPlanKey(p.k)}
                        className={cn(
                          "min-h-u-205 cursor-pointer rounded-u-15 px-u-22 pb-u-24 pt-u-21 text-left transition-all duration-300",
                          active
                            ? "bg-[linear-gradient(0deg,#0f1f60_0%,#103acf_100%)] text-white shadow-[0_20px_50px_-20px_rgba(26,77,255,0.9)]"
                            : "bg-[linear-gradient(180deg,#ffffff_0%,#c7d7ff_100%)] text-black hover:brightness-105"
                        )}
                      >
                        <p className="font-display fs-u-22 lh-u-30 font-semibold">{p.name}</p>
                        <p className={cn("mt-u-2 fs-u-14 lh-u-16 font-medium", active ? "text-cloud" : "text-void")}>{p.desc}</p>
                        <p className={cn("mt-u-48 font-display fs-u-18 lh-u-21 font-semibold", active ? "text-neon" : "text-electric")}>
                          {eur(data.mrr)}
                          {t.form.perMonth}
                        </p>
                        <p className={cn("fs-u-16 lh-u-21", active ? "text-white" : "text-black")}>
                          + {eur(data.setup)} {t.form.setupNote}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </StepCard>

              {/* Figma: «Ver un ejemplo» 246×66 en #c7d7ff · «Empezar de cero» oscuro con borde azul */}
              <div className="mt-u-50 flex flex-wrap justify-center gap-u-32">
                <button
                  type="button"
                  onClick={loadExample}
                  className="btn-light-sm inline-flex h-u-66 min-w-u-246 cursor-pointer items-center justify-center rounded-full px-u-30 font-display fs-u-15 font-semibold text-black"
                >
                  {t.form.example}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="btn-outline inline-flex h-u-66 min-w-u-246 cursor-pointer items-center justify-center gap-u-10 rounded-full px-u-30 font-display fs-u-15 font-semibold text-white"
                >
                  {t.form.reset}
                  <RefreshCcw className="size-u-18" strokeWidth={2} />
                </button>
              </div>
            </div>
          </Reveal>

          {/* — el módulo claro de la cuenta, pegado arriba — */}
          <div className="grid gap-6 lg:sticky lg:top-24">
            <Reveal delay={0.1}>
              {!hasData && (
                // Figma: módulo de 459×362 con la invitación a rellenar
                <LightModule className="px-u-42 pb-u-40 pt-u-40">
                  <p className="eyebrow">{t.result.eyebrow}</p>
                  <h2 className="mt-u-31 font-display fs-u-25 lh-u-30 font-bold">{t.result.idleTitle}</h2>
                  <p className="mt-u-8 fs-u-16 lh-u-22">{t.result.idleBody}</p>
                  <button
                    type="button"
                    onClick={loadExample}
                    className="mx-auto mt-u-32 flex h-u-66 w-u-298 max-w-full cursor-pointer items-center justify-center rounded-full border border-pulse bg-electric font-display fs-u-15 font-semibold text-white transition-colors hover:bg-[#2557ff]"
                  >
                    {t.form.calcCta}
                  </button>
                </LightModule>
              )}

              {hasData && (
                // Figma: módulo de 462 de ancho con la cuenta completa
                <LightModule className="px-u-39 pb-u-53 pt-u-49">
                  <p className="eyebrow">{t.result.eyebrow}</p>

                  {!worksOut && (
                    <>
                      <h2 className="mt-u-31 font-display fs-u-25 lh-u-30 font-bold">{t.result.negTitle}</h2>
                      <p className="mt-u-8 fs-u-16 lh-u-22">{t.result.negBody}</p>
                    </>
                  )}

                  {worksOut && (
                    <>
                      <p className="mt-u-40 font-display leading-none">
                        <span className="fs-u-20 font-semibold">{t.result.paybackLabel}</span>
                        <span className="ml-u-16 fs-u-45 font-bold">{months(r.payback)}</span>
                        <span className="ml-u-8 fs-u-25 font-bold">{t.result.months}</span>
                      </p>
                      <div className="mt-u-15 h-px bg-[#354d8e]/60" />
                      <p className="mt-u-12 fs-u-16 lh-u-19">{t.result.paybackBody}</p>

                      {/* Barra: cuánto de la fuga se recupera y cuánto no */}
                      <div className="mt-u-70">
                        <div className="flex h-u-11 overflow-hidden rounded-u-15 bg-cloud/50">
                          <div className="h-full rounded-u-15 bg-[linear-gradient(90deg,#779eff_37%,#1a4dff_100%)] transition-[width] duration-500" style={{ width: `${gainPct}%` }} />
                        </div>
                        <div className="mt-u-11 flex justify-between gap-4 fs-u-15 lh-u-19">
                          <span>
                            {t.result.barGain}
                            <strong className="block font-display font-bold text-electric">{eur(r.recovered)}</strong>
                          </span>
                          <span className="text-right">
                            {t.result.barLeak}
                            <strong className="block font-display font-bold text-electric">{eur(r.leak - r.recovered)}</strong>
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Figma: bloque de filas 383×441, radio 15, #c7d7ff al 50 % */}
                  <dl className="mt-u-30 grid gap-u-18 rounded-u-15 bg-cloud/50 px-u-32 py-u-30">
                    {rows.map((row) => (
                      <div key={row.k} className="flex items-start justify-between gap-4">
                        <dt className="min-w-0 fs-u-15 lh-u-18">
                          <span className="block font-display font-semibold">{row.label}</span>
                          <span className="block">{row.note}</span>
                        </dt>
                        <dd
                          className={cn(
                            "shrink-0 font-display fs-u-16 font-bold tabular-nums",
                            row.tone === "net" && r.net < 0 ? "text-[#d0325f]" : "text-black"
                          )}
                        >
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  {worksOut && (
                    // Figma: bloque de retorno 383×105, radio 15, #9aa5c0 al 80 %
                    <div className="mt-u-18 flex items-center justify-between gap-4 rounded-u-15 bg-[rgba(154,165,192,0.8)] px-u-32 py-u-23">
                      <span className="fs-u-14 lh-u-18">
                        <span className="block font-display font-semibold">{t.result.roiLabel}</span>
                        {t.result.roiNote}
                      </span>
                      <span className="font-display fs-u-20 font-bold tabular-nums text-electric">{nf.format(Math.round(r.roi))} %</span>
                    </div>
                  )}

                  <p className="mt-u-30 fs-u-14 lh-u-19">{t.assumptions.warning}</p>

                  <a
                    href="#desglose"
                    className="mx-auto mt-u-36 flex h-u-66 w-u-250 max-w-full cursor-pointer items-center justify-center rounded-full bg-electric font-display fs-u-15 font-semibold text-white transition-colors hover:bg-[#2557ff]"
                  >
                    {!worksOut ? t.result.negCta : t.lead.submit}
                  </a>
                </LightModule>
              )}
            </Reveal>
          </div>
        </div>

        {/* ——— Cómo se recupera (Figma): tres tarjetas con su cifra ——— */}
        <section className="mt-u-87 bg-[linear-gradient(180deg,#030617_0%,#040b24_100%)] pb-u-100 pt-u-71">
          <div className="mx-auto max-w-[1920px] px-5 md:px-10 xl:px-[12.5%]">
            <Reveal className="flex flex-col items-center text-center">
              <p className="eyebrow">{t.solutions.eyebrow}</p>
              <h2 className="mt-u-50 max-w-u-946 font-display fs-u-35 lh-u-46 font-normal text-white text-balance">{t.solutions.title}</h2>
            </Reveal>
            <div className="mx-auto mt-u-150 grid max-w-u-1196 gap-6 md:grid-cols-3 md:gap-u-43">
              {t.solutions.cards.map((c, i) => {
                const Icon = SOLUTION_ICONS[i];
                return (
                  <Reveal
                    key={c.title}
                    delay={0.08 * i}
                    className={cn(
                      "ring-conic relative flex flex-col items-center rounded-u-20 px-u-32 pb-u-28 pt-u-25 text-center",
                      i === 0 ? "bg-electric/10" : "bg-[linear-gradient(237deg,#101837_0%,#050b21_100%)]"
                    )}
                  >
                    {/* Figma: las tres tarjetas van unidas por una línea a la altura del título */}
                    {i < t.solutions.cards.length - 1 && (
                      <span aria-hidden className="absolute right-[calc(-1*max(26px,43*var(--u)))] top-u-132 hidden h-px w-u-43 bg-[#354d8e] md:block" />
                    )}
                    <span className="flex size-u-52 items-center justify-center rounded-u-18 bg-electric">
                      <Icon className="size-u-29 text-[#101837]" strokeWidth={2} />
                    </span>
                    <h3 className="mt-u-15 font-display fs-u-24 lh-u-30 font-semibold text-white">{c.title}</h3>
                    {/* Dos líneas reservadas: así la raya y la cifra quedan a la misma altura en las tres */}
                    <p className="mt-u-9 min-h-u-44 fs-u-15 lh-u-22 text-cloud text-balance">{c.sub}</p>
                    <div className="mt-u-21 h-px w-full bg-[#354d8e]" />
                    <p className="mt-u-19 flex flex-wrap items-baseline justify-center gap-x-u-8">
                      <span className="whitespace-nowrap font-display fs-u-28 font-semibold text-neon">{c.stat}</span>
                      <span className="fs-u-15 text-white">{c.statLabel}</span>
                    </p>
                  </Reveal>
                );
              })}
            </div>
            <Reveal delay={0.2} className="mt-u-119 text-center">
              <p className="font-display fs-u-18 lh-u-24 font-medium text-frost">
                {t.solutions.linkLead}{" "}
                <Link href="/contacto" className="text-mint transition-colors hover:text-white">
                  {t.solutions.link}
                </Link>
              </p>
              <p className="mx-auto mt-u-40 max-w-[80ch] fs-u-13 lh-u-20 text-mist">
                <Rich text={t.assumptions.math} strongClass="font-semibold text-frost/90" />
              </p>
            </Reveal>
          </div>
        </section>

        {/* ——— Dudas razonables (Figma): filas de 703×78 ——— */}
        <section className="mx-auto max-w-[1920px] px-5 pt-u-100 md:px-10 xl:px-[12.5%]">
          <Reveal className="flex flex-col items-center text-center">
            <p className="eyebrow">{t.faq.eyebrow}</p>
            <h2 className="mt-u-74 max-w-u-704 font-display fs-u-48 lh-u-52 font-bold text-white">{t.faq.title}</h2>
          </Reveal>
          <Reveal delay={0.1} className="mx-auto mt-u-65 flex max-w-u-703 flex-col gap-u-14">
            {t.faq.items.map((item) => (
              <details
                key={item.q}
                className="group/faq rounded-u-20 border-[0.5px] border-cloud/25 bg-cloud/5 px-u-31 py-u-18 transition-colors open:bg-cloud/10"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-display fs-u-16 lh-u-23 font-medium text-white [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span aria-hidden className="shrink-0 fs-u-36 font-normal leading-none text-electric transition-transform duration-300 group-open/faq:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-u-14 max-w-[70ch] fs-u-15 lh-u-22 text-cloud">
                  <Rich text={item.a} />
                </p>
              </details>
            ))}
          </Reveal>
        </section>

        {/* ——— Captura (Figma): tarjeta 1196×568 con el formulario en el panel azul de la derecha ——— */}
        <section id="desglose" className="mx-auto mt-u-216 max-w-[1920px] scroll-mt-24 px-5 md:px-10">
          <Reveal>
            <div
              style={{ ["--ring-w" as string]: "1.3px" }}
              className="ring-conic mx-auto grid max-w-u-1196 overflow-hidden rounded-u-35 bg-[linear-gradient(180deg,#09112d_0%,#0e1f5c_100%)] md:grid-cols-[minmax(0,582fr)_minmax(0,614fr)]"
            >
              <div className="px-6 pb-u-40 pt-u-51 md:pl-u-50 md:pr-u-47">
                <h2 className="max-w-u-462 font-display fs-u-35 lh-u-40 font-semibold text-white">{t.lead.figTitle}</h2>
                <p className="mt-u-65 max-w-u-485 fs-u-16 lh-u-22 text-white">{t.lead.figBody}</p>
                {/* Figma: tres pastillas de 35 px con borde en degradado y flechas entre ellas */}
                <p className="mt-u-32 flex flex-wrap items-center gap-u-6">
                  {t.lead.tags.map((tag, i) => (
                    <span key={tag} className="inline-flex items-center gap-u-6">
                      <span className="eyebrow eyebrow-gradient before:content-none">{tag}</span>
                      {i < t.lead.tags.length - 1 && <ArrowRight className="size-u-19 text-electric" strokeWidth={1.5} />}
                    </span>
                  ))}
                </p>

                {/* Figma: caja 485×186, radio 16, degradado #c7d7ff→#778199, texto negro */}
                <div className="mt-u-33 max-w-u-485 rounded-u-16 bg-[linear-gradient(180deg,#c7d7ff_0%,#778199_100%)] px-u-20 pb-u-22 pt-u-20 text-black">
                  <p className="font-display fs-u-18 lh-u-24 font-bold">{t.diag.badge}</p>
                  <p className="mt-u-6 fs-u-15 lh-u-19">
                    <Rich text={t.diag.body} strongClass="font-semibold" />
                  </p>
                </div>
                <Link href="/precios" className="group mt-u-25 inline-flex items-center gap-1.5 font-display fs-u-18 lh-u-24 font-medium text-mint transition-colors hover:text-white">
                  {t.diag.cta}
                  <ArrowRight className="size-u-18 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} />
                </Link>
              </div>

              {/* Panel azul: 614 de ancho, radio solo a la derecha, borde 1,3 azul claro */}
              <div className="border-t border-pulse/50 bg-[linear-gradient(180deg,#1a4dff_0%,#0a1540_100%)] px-6 pb-u-40 pt-u-78 text-white md:border-l md:border-t-0 md:px-u-85">
                {status === "ok" ? (
                  <div className="flex h-full flex-col justify-center text-center">
                    <p className="font-display fs-u-25 font-semibold">{t.lead.okTitle}</p>
                    <p className="mt-3 fs-u-15 lh-u-22 text-white/85">{t.lead.okBody}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="grid">
                    <label className="grid gap-u-10">
                      <span className="font-display fs-u-18 lh-u-25 font-semibold">{t.lead.nameLabel}</span>
                      <input name="name" required maxLength={120} placeholder={t.lead.namePh} className={inputCls} />
                    </label>
                    <label className="mt-u-22 grid gap-u-10">
                      <span className="font-display fs-u-18 lh-u-25 font-semibold">{t.lead.contactLabel}</span>
                      <input name="contact" required maxLength={160} placeholder={t.lead.contactPh} className={inputCls} />
                    </label>

                    {/* Honeypot anti-bots: fuera de pantalla y fuera del tab order */}
                    <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
                      <label>
                        website
                        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                      </label>
                    </div>

                    {status === "error" && (
                      <p className="mt-u-20 rounded-u-15 bg-white/15 px-4 py-3 fs-u-14">
                        {t.lead.errorText}{" "}
                        <a href={`mailto:${EMAIL}`} className="font-semibold underline">
                          {EMAIL}
                        </a>
                      </p>
                    )}

                    {/* Figma: botón 271×66 en #c7d7ff con la flecha azul */}
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="btn-light mx-auto mt-u-54 inline-flex h-u-66 min-w-u-271 cursor-pointer items-center justify-center gap-u-12 rounded-full px-u-30 font-display fs-u-15 font-semibold text-void transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
                    >
                      {status === "sending" ? t.lead.sending : t.lead.submit}
                      <ArrowRight className="size-u-19 text-electric" strokeWidth={3} />
                    </button>
                    <p className="mt-u-44 text-center fs-u-12 lh-u-22 font-medium text-cloud">{t.lead.privacyNote}</p>
                  </form>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 text-center">
            <Link href="/precios" className="group inline-flex items-center gap-1.5 font-display fs-u-15 font-medium text-mint transition-colors hover:text-white">
              {t.toPricing}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </section>

        {/* ——— Resumen fijo en móvil ———
            El hueco de la derecha no es decorativo: ahí aterriza el botón
            flotante del chat, que taparía la cifra. */}
        {hasData && (
          <div className="sticky bottom-0 z-40 mt-16 border-t border-line bg-abyss/90 px-6 py-3 backdrop-blur-xl lg:hidden">
            <div className="pr-[6rem]">
              <p className="truncate text-[10px] uppercase tracking-[0.16em] text-mist/70">{t.result.rows.net.label}</p>
              <p className="flex items-baseline gap-2 leading-tight">
                <span className={cn("font-display text-lg font-bold", r.net < 0 ? "text-[#ff9bb5]" : "text-neon")}>
                  {r.net < 0 ? "−" : ""}
                  {eur(Math.abs(r.net))}
                  {t.form.perMonth}
                </span>
                {worksOut && (
                  <span className="truncate text-[11px] text-mist/70">
                    · {months(r.payback)} {t.result.months}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        <div className="mt-u-277">
          <FinalCTA />
        </div>
      </main>
      <Footer />

      <ChatWidget />
      <VoiceWidget />
    </div>
  );
}
