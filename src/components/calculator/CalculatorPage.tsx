"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck, MessageSquare, Navigation, Plus, PlusCircle, RefreshCcw, Workflow } from "lucide-react";
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
 * Cabecera de cada paso (Figma): icono «plus circle» de 23 px en periwinkle y
 * título Montserrat Bold 25/22 en azul de marca; debajo, si lo hay, el subtítulo.
 */
function StepHead({ title, body, bodyClass }: { title: string; body?: string; bodyClass?: string }) {
  return (
    <div>
      <div className="flex items-center gap-u-20">
        <PlusCircle className="size-u-23 shrink-0 text-periwinkle" strokeWidth={2} />
        <h2 className="font-display fs-u-25 lh-u-22 font-bold text-electric">{title}</h2>
      </div>
      {body && <p className={cn("mt-u-40 max-w-u-523 fs-u-16 lh-u-23 text-white", bodyClass)}>{body}</p>}
    </div>
  );
}

/**
 * Campo del Figma: etiqueta SemiBold 16/30 blanca, caja blanca de 62 px con radio
 * 16 y sombra corta, sufijo a la derecha, y la ayuda en Light 15 azul claro.
 */
function Field({
  label,
  hint,
  value,
  onChange,
  suffix,
  hintClass,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  suffix: string;
  hintClass?: string;
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
          className="h-u-62 w-full rounded-u-16 bg-white pl-u-26 pr-u-90 font-display fs-u-15 font-normal text-void shadow-[0_1px_4px_rgba(12,12,13,0.05),0_1px_4px_rgba(12,12,13,0.1)] outline-none ring-2 ring-transparent transition-shadow duration-200 placeholder:text-void focus:ring-electric"
        />
        <span className="pointer-events-none absolute right-u-26 fs-u-15 font-medium text-black">{suffix}</span>
      </span>
      <span className={cn("mt-u-13 block fs-u-15 lh-u-22 font-light text-cloud/80", hintClass)}>{hint}</span>
    </label>
  );
}

/**
 * Tarjeta de paso (Figma): 857 de ancho, radio 25, degradado navy→abyss y borde
 * de 1 px azul. Cada una lleva el suyo: la 1 en 360°, la 2 plana y la 3 en 180°.
 */
function StepCard({ children, className, ringBg }: { children: ReactNode; className?: string; ringBg: string }) {
  return (
    <div
      style={{ ["--ring-w" as string]: "1px", ["--ring-bg" as string]: ringBg }}
      className={cn("ring-conic rounded-u-25 bg-[linear-gradient(180deg,#101837_0%,#050b21_61%)] px-u-33 pb-u-32 pt-u-53", className)}
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
 * del Figma «Asenix Calculadora1/2» (marcos 984:14321 y 1555:66997): el porqué
 * arriba con las tres fugas, la intro «CALCULADORA», la tarjeta azul de pasos y
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
    "h-u-62 w-full rounded-u-15 bg-white pl-u-23 pr-u-16 fs-u-16 font-light text-black shadow-[0_1px_4px_rgba(12,12,13,0.05),0_1px_4px_rgba(12,12,13,0.1)] outline-none ring-2 ring-transparent transition-shadow duration-200 placeholder:text-black/70 focus:ring-electric";

  const loadExample = () => {
    setFields(EXAMPLE);
    setSector("belleza");
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-void">
      <Navbar />

      <main className="relative">
        {/* ——— Cabecera (Figma): titular 52/54, entradilla y las tres fugas ——— */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#030617_0%,#040b24_100%)] pb-u-183 pt-u-224">
          <div className="relative mx-auto max-w-[1920px] px-5 md:px-10 xl:px-[12.5%]">
            <Reveal className="mx-auto flex flex-col items-center text-center">
              <h1 className="max-w-u-704 font-display fs-u-52 lh-u-54 font-bold text-white text-balance">{t.why.headline}</h1>
              <p className="mt-u-43 max-w-u-704 fs-u-20 lh-u-28 text-cloud">{t.why.lede}</p>
            </Reveal>

            {/* Figma: los iconos arrancan en x=281, 41 por dentro del contenedor */}
            <div className="mt-u-78 grid gap-10 md:grid-cols-3 md:gap-u-88 md:pl-u-41">
              {t.why.leaks.map((item, i) => (
                <Reveal key={item.title} delay={0.08 * i} className="flex gap-u-30">
                  {/* Figma: cuadrado de contorno azul de 52 con la cifra en lima */}
                  <span className="flex size-u-52 shrink-0 items-center justify-center rounded-u-10 border border-electric font-display fs-u-28 font-semibold text-neon">
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

        {/* Figma «Vector 32»: raya de 0,5 px a todo el ancho al cerrar la cabecera */}
        <div aria-hidden className="divider-hair w-full" />

        {/* ——— Intro «CALCULADORA» ——— */}
        <header className="mx-auto flex max-w-[1920px] flex-col items-center px-5 pt-u-167 text-center md:px-10 xl:px-[12.5%]">
          <Reveal className="flex flex-col items-center">
            <p className="eyebrow">{t.intro.eyebrow}</p>
            <h2 className="mt-u-35 max-w-u-708 font-display fs-u-35 lh-u-46 font-normal text-white text-balance">{t.intro.title}</h2>
            <p className="mt-u-25 max-w-u-703 fs-u-20 lh-u-28 text-cloud">{t.intro.body}</p>
          </Reveal>
        </header>

        {/* ——— Formulario + cuenta (Figma: tarjeta 947 + módulo 462, hueco 33) ——— */}
        <div className="mx-auto mt-u-74 grid max-w-[1920px] gap-8 px-5 md:px-10 lg:grid-cols-[minmax(0,947fr)_minmax(0,462fr)] lg:items-start lg:gap-u-33 xl:px-[12.5%]">
          {/* — la gran tarjeta azul marino con los tres pasos — */}
          <Reveal>
            <div
              style={{
                ["--ring-w" as string]: "0.5px",
                ["--ring-bg" as string]: "conic-gradient(#6994ff 15%, #1a4dff 50%, #6994ff 86%, #1a4dff 100%)",
              }}
              className="ring-conic relative isolate overflow-hidden rounded-u-25 bg-[linear-gradient(180deg,#101837_0%,#050b21_61%)] p-4 pb-u-56 sm:p-u-46"
            >
              {/* Figma «1619:1878/1879»: los dos brillos radiales que dan volumen al panel */}
              <div
                aria-hidden
                style={{ top: "calc(-298 * var(--u))", left: "calc(534 * var(--u))", width: "calc(714 * var(--u))", height: "calc(683 * var(--u))" }}
                className="pointer-events-none absolute -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,#1a4dff_0%,rgba(46,107,255,0)_100%)] blur-[7.3px]"
              />
              <div
                aria-hidden
                style={{ top: "calc(873 * var(--u))", left: "calc(-231 * var(--u))", width: "calc(1328 * var(--u))", height: "calc(1193 * var(--u))" }}
                className="pointer-events-none absolute -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,#1a4dff_0%,rgba(46,107,255,0)_100%)] blur-[7.3px]"
              />
              {/* 1 · Tu negocio */}
              <StepCard ringBg="linear-gradient(360deg, #1a4dff 0%, #102e99 100%)">
                <StepHead title={t.form.step1Title} />
                <p className="mt-u-40 max-w-u-280 font-display fs-u-16 lh-u-30 font-semibold text-white">{t.form.sectorLabel}</p>
                <p className="mt-u-2 max-w-u-522 fs-u-15 lh-u-22 text-white">{t.form.sectorHint}</p>
                {/* Figma: pastillas de 37 px en periwinkle con el texto SemiBold 15 negro */}
                <div className="mt-u-28 flex flex-wrap gap-x-u-15 gap-y-u-25">
                  {t.form.sectors.map((s) => (
                    <button
                      key={s.k}
                      type="button"
                      aria-pressed={sector === s.k}
                      onClick={() => pickSector(s.k, s.visits)}
                      className={cn(
                        "h-u-37 cursor-pointer rounded-full px-u-22 font-display fs-u-15 font-semibold transition-all duration-200",
                        sector === s.k ? "bg-electric text-white shadow-[0_10px_24px_-12px_rgba(26,77,255,1)]" : "bg-periwinkle text-black hover:bg-cloud"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="mt-u-40 grid gap-6 sm:grid-cols-2 sm:gap-x-u-31">
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
              <StepCard className="mt-u-30" ringBg="linear-gradient(0deg, #1a4dff 0%, #1a4dff 100%)">
                <StepHead title={t.form.step2Title} body={t.form.step2Body} bodyClass="max-w-u-491" />
                <div className="mt-u-58 grid gap-6 sm:grid-cols-2 sm:gap-x-u-31">
                  <Field
                    label={t.form.missedLabel}
                    hint={t.form.missedHint}
                    hintClass="text-cloud"
                    value={fields.missed}
                    onChange={set("missed")}
                    suffix={locale === "es" ? "/ Sem" : "/ wk"}
                  />
                  <Field
                    label={t.form.noShowsLabel}
                    hint={t.form.noShowsHint}
                    hintClass="text-cloud"
                    value={fields.noShows}
                    onChange={set("noShows")}
                    suffix={locale === "es" ? "/ Mes" : "/ mo"}
                  />
                </div>
              </StepCard>

              {/* 3 · Con qué plan lo comparo */}
              <StepCard className="mt-u-30" ringBg="linear-gradient(180deg, #1a4dff 0%, #102e99 100%)">
                <StepHead title={t.form.step3Title} body={t.form.step3Body} bodyClass="lh-u-22" />
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
                  <RefreshCcw className="size-u-20" strokeWidth={2} />
                </button>
              </div>
            </div>
          </Reveal>

          {/* — el módulo claro de la cuenta, pegado arriba — */}
          <div className="grid gap-6 lg:sticky lg:top-24">
            <Reveal delay={0.1}>
              {!hasData && (
                // Figma: módulo de 459×362 con la invitación a rellenar
                <LightModule className="px-u-42 pb-u-40 pt-u-46">
                  <p className="eyebrow eyebrow-dark">{t.result.eyebrow}</p>
                  <h2 className="mt-u-26 font-display fs-u-25 lh-u-22 font-bold">{t.result.idleTitle}</h2>
                  <p className="mt-u-15 max-w-u-371 fs-u-16 lh-u-22">{t.result.idleBody}</p>
                  <button
                    type="button"
                    onClick={loadExample}
                    className="mx-auto mt-u-24 flex h-u-66 w-u-298 max-w-full cursor-pointer items-center justify-center rounded-full border border-pulse bg-electric font-display fs-u-15 font-semibold text-white transition-colors hover:bg-[#2557ff]"
                  >
                    {t.form.calcCta}
                  </button>
                </LightModule>
              )}

              {hasData && (
                // Figma: módulo de 462 de ancho con la cuenta completa
                <LightModule className="px-u-39 pb-u-53 pt-u-46">
                  <p className="eyebrow eyebrow-dark">{t.result.eyebrow}</p>

                  {!worksOut && (
                    <>
                      <h2 className="mt-u-26 font-display fs-u-25 lh-u-22 font-bold">{t.result.negTitle}</h2>
                      <p className="mt-u-15 fs-u-16 lh-u-22">{t.result.negBody}</p>
                    </>
                  )}

                  {worksOut && (
                    <>
                      {/* Figma: la etiqueta a la izquierda y la cifra pegada al borde derecho */}
                      <p className="mt-u-40 flex items-baseline justify-between font-display leading-none">
                        <span className="fs-u-20 font-semibold">{t.result.paybackLabel}</span>
                        <span className="whitespace-nowrap">
                          <span className="fs-u-45 font-bold">{months(r.payback)}</span>
                          <span className="ml-u-8 fs-u-25 font-bold">{t.result.months}</span>
                        </span>
                      </p>
                      <p className="mt-u-17 fs-u-16 lh-u-19">{t.result.paybackBody}</p>

                      {/* Barra: cuánto de la fuga se recupera y cuánto no */}
                      <div className="mt-u-53">
                        <div className="flex h-u-11 overflow-hidden rounded-u-15 bg-cloud/50">
                          <div className="h-full rounded-u-15 bg-[linear-gradient(90deg,#779eff_0%,#1a4dff_100%)] transition-[width] duration-500" style={{ width: `${gainPct}%` }} />
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
                  <dl className="mt-u-33 grid gap-u-18 rounded-u-15 bg-cloud/50 px-u-32 py-u-42">
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
                    <div className="mt-u-22 flex items-center justify-between gap-4 rounded-u-15 bg-[rgba(154,165,192,0.8)] px-u-32 py-u-23">
                      <span className="fs-u-14 lh-u-18">
                        <span className="block font-display font-semibold">{t.result.roiLabel}</span>
                        {t.result.roiNote}
                      </span>
                      <span className="font-display fs-u-20 font-bold tabular-nums text-electric">{nf.format(Math.round(r.roi))} %</span>
                    </div>
                  )}

                  <p className="mt-u-36 fs-u-14 lh-u-19">{t.assumptions.warning}</p>

                  {/* Figma 1555:67661: 282×66 con el icono de envío en blanco */}
                  <a
                    href="#desglose"
                    className="mx-auto mt-u-48 flex h-u-66 w-u-282 max-w-full cursor-pointer items-center justify-center gap-u-12 rounded-full bg-electric font-display fs-u-15 font-semibold text-white transition-colors hover:bg-[#2557ff]"
                  >
                    {!worksOut ? t.result.negCta : t.lead.submit}
                    <Navigation className="size-u-19" strokeWidth={2} />
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
              <h2 className="mt-u-35 max-w-u-696 font-display fs-u-30 lh-u-38 font-normal text-white text-balance">{t.solutions.title}</h2>
            </Reveal>
            <div className="mx-auto mt-u-115 grid max-w-u-1196 gap-6 md:grid-cols-3 md:gap-u-45">
              {t.solutions.cards.map((c, i) => {
                const Icon = SOLUTION_ICONS[i];
                return (
                  <Reveal key={c.title} delay={0.08 * i} className="relative">
                    <div className="ring-conic relative isolate flex h-full flex-col overflow-hidden rounded-u-20 bg-electric/5 px-u-32 pb-u-34 pt-u-25 shadow-[0_0_45px_4px_rgba(26,77,255,0.25)] [--ring-w:2px]">
                      {/* Figma 1555:66418: el brillo radial recortado por la tarjeta */}
                      <span
                        aria-hidden
                        style={{ top: "calc(-134 * var(--u))", left: "calc(170 * var(--u))", width: "calc(291 * var(--u))", height: "calc(257 * var(--u))" }}
                        className="pointer-events-none absolute -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,#1a4dff_0%,rgba(46,107,255,0.12)_81%,rgba(46,107,255,0)_100%)] blur-[17.5px]"
                      />
                      <span className="flex size-u-52 items-center justify-center rounded-u-18 bg-[#081248] shadow-[0_0_10px_0_#1a4dff]">
                        <Icon className="size-u-24 text-electric" strokeWidth={2} />
                      </span>
                      <h3 className="mt-u-15 font-display fs-u-24 lh-u-30 font-semibold text-white">{c.title}</h3>
                      {/* Dos líneas reservadas: así la cifra queda a la misma altura en las tres */}
                      <p className="mt-u-9 min-h-u-44 fs-u-15 lh-u-22 text-cloud">{c.sub}</p>
                      <p className="mt-u-35 flex flex-wrap items-baseline gap-x-u-8">
                        <span className="whitespace-nowrap font-display fs-u-28 font-semibold text-neon">{c.stat}</span>
                        <span className="fs-u-15 text-white">{c.statLabel}</span>
                      </p>
                    </div>
                    {/* Figma «Vector 17/18»: flecha de 35×2 px #354d8e que encadena las tarjetas.
                        Va fuera de la tarjeta porque esta recorta el brillo. */}
                    {i < t.solutions.cards.length - 1 && (
                      <svg
                        aria-hidden
                        viewBox="0 0 35 10"
                        fill="none"
                        preserveAspectRatio="none"
                        style={{ left: "100%", top: "calc(131 * var(--u))", width: "calc(35 * var(--u))", height: "calc(10 * var(--u))" }}
                        className="absolute hidden md:block"
                      >
                        <path d="M0 5H33M28.5 1.5 33 5l-4.5 3.5" stroke="#354d8e" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                      </svg>
                    )}
                  </Reveal>
                );
              })}
            </div>
            <Reveal delay={0.2} className="mt-u-148 text-center">
              <p className="mx-auto max-w-u-704 font-display fs-u-14 lh-u-24 font-medium text-frost">
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

        {/* Figma «Vector 31»: raya de 0,5 px al cerrar «cómo se recupera» */}
        <div aria-hidden className="divider-hair w-full" />

        {/* ——— Preguntas y respuestas (Figma): filas de 667×62 ——— */}
        <section className="mx-auto max-w-[1920px] px-5 pt-u-166 md:px-10 xl:px-[12.5%]">
          <Reveal className="flex flex-col items-center text-center">
            <p className="eyebrow">{t.faq.eyebrow}</p>
            <h2 className="mt-u-34 max-w-u-696 font-display fs-u-52 lh-u-52 font-bold text-white">{t.faq.title}</h2>
          </Reveal>
          <Reveal delay={0.1} className="mx-auto mt-u-44 flex max-w-u-667 flex-col gap-u-10">
            {t.faq.items.map((item) => (
              <details
                key={item.q}
                className="group/faq rounded-u-15 border-[0.5px] border-[rgba(119,158,255,0.2)] bg-[rgba(6,11,40,0.72)] px-u-25 py-u-19 transition-colors open:bg-[rgba(6,11,40,0.85)]"
              >
                <summary className="flex min-h-u-24 cursor-pointer list-none items-center justify-between gap-5 font-display fs-u-15 lh-u-23 font-semibold text-white [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <Plus
                    aria-hidden
                    className="size-u-12 shrink-0 text-electric transition-transform duration-300 group-open/faq:rotate-45"
                    strokeWidth={2}
                  />
                </summary>
                <p className="mt-u-14 max-w-[70ch] fs-u-15 lh-u-22 text-cloud">
                  <Rich text={item.a} />
                </p>
              </details>
            ))}
          </Reveal>
        </section>

        {/* ——— Captura (Figma): tarjeta 1196×568 con el formulario en el panel azul de la derecha ——— */}
        <section id="desglose" className="mx-auto mt-u-210 max-w-[1920px] scroll-mt-24 px-5 md:px-10">
          <Reveal>
            <div
              style={{ ["--ring-w" as string]: "1.3px" }}
              className="ring-conic mx-auto grid max-w-u-1196 overflow-hidden rounded-u-35 bg-[linear-gradient(180deg,#09112d_0%,#0e1f5c_100%)] md:grid-cols-[minmax(0,582fr)_minmax(0,614fr)]"
            >
              <div className="px-6 pb-u-40 pt-u-51 md:pl-u-50 md:pr-u-47">
                <h2 className="max-w-u-462 font-display fs-u-35 lh-u-40 font-semibold text-white">{t.lead.figTitle}</h2>
                <p className="mt-u-65 max-w-u-485 fs-u-16 lh-u-22 text-white">{t.lead.figBody}</p>
                {/* Figma 1353:83: pastillas de 35 rellenas de lima→azul, texto blanco, con flechas entre ellas */}
                {/* Una sola fila: se lee como un proceso. Por debajo de 1920 las tres
                    pastillas se encogen con el ancho en vez de partirse. */}
                <p className="mt-u-32 flex flex-nowrap items-center gap-[max(3px,7*var(--u))]">
                  {t.lead.tags.map((tag, i) => (
                    <span key={tag} className="inline-flex min-w-0 items-center gap-[max(3px,7*var(--u))]">
                      <span className="inline-flex h-[max(24px,35*var(--u))] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(211deg,#b8f21e_0%,#1a4dff_59%)] px-[max(8px,16*var(--u))] font-display text-[max(9px,12*var(--u))] leading-none font-bold tracking-[0.08em] whitespace-nowrap text-white uppercase">
                        {tag}
                      </span>
                      {i < t.lead.tags.length - 1 && (
                        <ArrowRight className="size-[max(12px,20*var(--u))] shrink-0 text-electric" strokeWidth={1} />
                      )}
                    </span>
                  ))}
                </p>

                {/* Figma 1353:100: caja 485×166, radio 16, degradado blanco→#c7d7ff, texto negro */}
                <div className="mt-u-43 max-w-u-485 rounded-u-16 bg-[linear-gradient(180deg,#ffffff_0%,#c7d7ff_100%)] px-u-20 pb-u-22 pt-u-25 text-black">
                  <p className="font-display fs-u-18 lh-u-24 font-bold">{t.diag.badge}</p>
                  <p className="mt-u-6 fs-u-15 lh-u-19">
                    <Rich text={t.diag.body} strongClass="font-semibold" />
                  </p>
                </div>
                <Link href="/precios" className="group mt-u-25 inline-flex items-center gap-1.5 font-display fs-u-14 lh-u-24 font-medium text-mint transition-colors hover:text-white">
                  {t.diag.cta}
                  <ArrowRight className="size-u-18 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} />
                </Link>
              </div>

              {/* Panel azul: 614 de ancho, radio solo a la derecha, borde 1,3 azul claro */}
              <div className="border-t border-pulse/50 bg-[linear-gradient(180deg,#1a4dff_0%,#0a1540_100%)] px-6 pb-u-76 pt-u-86 text-white md:border-l md:border-t-0 md:px-u-83">
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
                    <label className="mt-u-30 grid gap-u-10">
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
                      <Navigation className="size-u-19 text-electric" strokeWidth={2} />
                    </button>
                    <p className="mt-u-44 text-center fs-u-12 lh-u-22 font-medium text-cloud">{t.lead.privacyNote}</p>
                  </form>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-u-40 text-center">
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
          <div className="sticky bottom-0 z-40 mt-u-64 border-t border-line bg-abyss/90 px-6 py-3 backdrop-blur-xl lg:hidden">
            <div className="pr-[6rem]">
              <p className="truncate fs-u-10 uppercase tracking-[0.16em] text-mist/70">{t.result.rows.net.label}</p>
              <p className="flex items-baseline gap-2 leading-tight">
                <span className={cn("font-display fs-u-25 font-bold", r.net < 0 ? "text-[#ff9bb5]" : "text-neon")}>
                  {r.net < 0 ? "−" : ""}
                  {eur(Math.abs(r.net))}
                  {t.form.perMonth}
                </span>
                {worksOut && (
                  <span className="truncate fs-u-11 text-mist/70">
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
