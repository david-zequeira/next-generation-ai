"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
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

/** Título de paso dentro de la tarjeta azul marino: "1. Tu negocio" en azul. */
function StepHead({ n, hint }: { n: string; hint?: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-display text-[19px] font-semibold text-[#4d7dff]">{n.replace(" · ", ". ")}</h2>
      {hint && <p className="mt-1.5 max-w-[52ch] text-[13px] leading-relaxed text-pulse/80">{hint}</p>}
    </div>
  );
}

/** Campo claro sobre la tarjeta oscura, con el sufijo en azul, como en el Figma. */
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
    <label className="grid gap-2">
      <span className="font-display text-[13px] font-semibold text-white">{label}</span>
      <span className="relative flex items-center">
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.,]/g, ""))}
          placeholder="…"
          className="w-full rounded-xl bg-[#e9edff] px-4 py-3.5 pr-20 font-display text-base font-semibold text-ink outline-none ring-2 ring-transparent transition-shadow duration-200 placeholder:font-normal placeholder:text-ink/40 focus:ring-pulse"
        />
        <span className="pointer-events-none absolute right-4 text-[13px] font-medium text-electric">{suffix}</span>
      </span>
      <span className="text-[12px] leading-relaxed text-pulse/75">{hint}</span>
    </label>
  );
}

/**
 * /calculadora — la versión pública de la cuenta de retorno, en el tema del
 * Figma «Asenix Desktop»: el porqué arriba, el formulario en una tarjeta azul
 * marino a la izquierda y el resultado en tarjetas claras a la derecha.
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

  const inputCls =
    "w-full rounded-xl border border-white/40 bg-white/15 px-4 py-3.5 text-sm text-white outline-none transition-colors duration-200 placeholder:text-white/60 focus:border-white";

  return (
    <div className="relative min-h-screen overflow-x-clip bg-void">
      <Navbar />

      <main className="relative">
        {/* ——— El porqué, como apertura: dónde se pierde el dinero ——— */}
        <section className="relative overflow-hidden border-b border-line bg-[#040816] pb-20 pt-36 md:pt-44">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] bg-[radial-gradient(70%_80%_at_50%_100%,rgba(26,77,255,0.35),transparent_70%)]"
          />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal className="mx-auto max-w-3xl text-center">
              <h1 className="font-display text-[clamp(2rem,4.6vw,3.4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
                {t.why.title}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-mist md:text-lg">{t.why.body}</p>
            </Reveal>

            <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
              {t.why.items.map((item, i) => (
                <Reveal key={item.title} delay={0.08 * i} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-electric font-display text-xl font-medium text-neon">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-[17px] font-semibold leading-snug text-[#4d7dff]">{item.title}</h3>
                    <p className="mt-3 text-[13px] leading-relaxed text-mist">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* El isotipo en su orbe — el detalle del Figma a la derecha */}
            <div aria-hidden className="pointer-events-none absolute -right-24 bottom-4 hidden 2xl:block">
              <span className="relative flex h-40 w-40 items-center justify-center rounded-full bg-electric/25">
                <span className="animate-float flex h-28 w-28 items-center justify-center rounded-full bg-electric shadow-[0_0_60px_-10px_rgba(26,77,255,0.9)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${BASE}/isotipo.png`} alt="" className="h-12 w-12 brightness-0 invert" />
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* ——— Cabecera de la calculadora ——— */}
        <header className="mx-auto max-w-3xl px-6 pb-14 pt-24 text-center md:pt-28">
          <Reveal>
            <p className="eyebrow">{t.header.eyebrow}</p>
            <h2 className="mx-auto mt-5 font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-light leading-[1.2] text-white">
              {t.header.titleA} {t.header.titleB}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-mist">{t.header.lede}</p>
          </Reveal>
        </header>

        {/* ——— Formulario + resultado ——— */}
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1fr_minmax(320px,380px)] lg:items-start">
          {/* — columna izquierda: la tarjeta azul marino — */}
          <Reveal className="rounded-[26px] border border-pulse/30 bg-gradient-to-b from-[#0e2a8c] via-[#0c1d5e] to-[#0a1440] p-6 shadow-[0_50px_100px_-50px_rgba(26,77,255,0.7)] md:p-9">
            <StepHead n={t.form.step1} />
            <p className="font-display text-[13px] font-semibold text-white">{t.form.sectorLabel}</p>
            <p className="mt-1 text-[12px] text-pulse/75">{t.form.sectorHint}</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {t.form.sectors.map((s) => (
                <button
                  key={s.k}
                  type="button"
                  aria-pressed={sector === s.k}
                  onClick={() => pickSector(s.k, s.visits)}
                  className={cn(
                    "cursor-pointer rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200",
                    sector === s.k ? "bg-electric text-white shadow-[0_10px_24px_-12px_rgba(26,77,255,1)]" : "bg-[#dfe6ff] text-ink hover:bg-white"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
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
              <p className="mt-5 rounded-xl bg-white/[0.08] px-4 py-3 text-sm text-pulse">
                {t.result.clientValueLabel}{" "}
                <strong className="font-display font-semibold text-neon">{eur(r.clientValue)}</strong>
              </p>
            )}

            <div className="my-10 h-px bg-pulse/25" />

            <StepHead n={t.form.step2} hint={t.form.step2Hint} />
            <div className="grid gap-6 sm:grid-cols-2">
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

            <div className="my-10 h-px bg-pulse/25" />

            <StepHead n={t.form.step3} hint={t.form.planHint} />
            <div className="grid gap-4 sm:grid-cols-2">
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
                      "cursor-pointer rounded-2xl p-5 text-left transition-all duration-300",
                      active
                        ? "card-blue text-white shadow-[0_20px_50px_-20px_rgba(26,77,255,0.9)] ring-2 ring-pulse"
                        : "bg-[#e9edff] text-ink hover:bg-white"
                    )}
                  >
                    <p className="font-display text-lg font-semibold">{p.name}</p>
                    <p className={cn("mt-1 text-[12.5px] leading-relaxed", active ? "text-white/85" : "text-ink/70")}>{p.desc}</p>
                    <p className={cn("mt-4 font-display text-[17px] font-semibold", active ? "text-white" : "text-electric")}>
                      {eur(data.mrr)}
                      {t.form.perMonth}
                    </p>
                    <p className={cn("text-[12px]", active ? "text-white/80" : "text-ink/70")}>
                      + {eur(data.setup)} {t.form.setupNote}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setFields(EXAMPLE);
                  setSector("belleza");
                }}
                className="btn-blue inline-flex cursor-pointer items-center rounded-full px-8 py-3 font-display text-sm font-semibold"
              >
                {t.form.example}
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex cursor-pointer items-center rounded-full border border-pulse/60 px-8 py-3 font-display text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10"
              >
                {t.form.reset}
              </button>
            </div>
          </Reveal>

          {/* — columna derecha: el resultado, pegado arriba — */}
          <div className="grid gap-6 lg:sticky lg:top-24">
            <Reveal delay={0.1} className="rounded-[26px] bg-[#eef1fe] p-7 text-ink">
              <p className="eyebrow">{t.result.eyebrow}</p>
              {!hasData && (
                <>
                  <h2 className="mt-4 font-display text-[22px] font-bold tracking-tight text-ink">{t.result.idleTitle}</h2>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink/70">{t.result.idleBody}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFields(EXAMPLE);
                      setSector("belleza");
                    }}
                    className="btn-blue mt-6 w-full cursor-pointer rounded-full py-3.5 font-display text-sm font-semibold"
                  >
                    {t.form.example}
                  </button>
                </>
              )}

              {hasData && !worksOut && (
                <>
                  <h2 className="mt-4 font-display text-[22px] font-bold tracking-tight text-ink">{t.result.negTitle}</h2>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink/70">{t.result.negBody}</p>
                </>
              )}

              {worksOut && (
                <>
                  <p className="mt-4 font-display text-[13px] font-semibold text-ink">{t.result.paybackLabel}</p>
                  <p className="mt-1 font-display text-[clamp(2.4rem,5vw,3rem)] font-bold leading-none tracking-[-0.03em] text-ink">
                    {months(r.payback)}
                    <span className="ml-2 font-display text-xl font-semibold tracking-normal">{t.result.months}</span>
                  </p>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink/70">{t.result.paybackBody}</p>

                  {/* Barra: cuánto de la fuga se recupera y cuánto no */}
                  <div className="mt-6">
                    <div className="flex h-2 overflow-hidden rounded-full bg-[#d5dae9]">
                      <div className="h-full bg-electric transition-[width] duration-500" style={{ width: `${gainPct}%` }} />
                    </div>
                    <div className="mt-2 flex justify-between text-[11px] text-ink/65">
                      <span>
                        {t.result.barGain} · <strong className="font-semibold text-electric">{eur(r.recovered)}</strong>
                      </span>
                      <span>
                        {t.result.barLeak} · <strong className="font-semibold text-ink">{eur(r.leak - r.recovered)}</strong>
                      </span>
                    </div>
                  </div>
                </>
              )}

              {hasData && (
                <dl className="mt-7 grid gap-3.5 rounded-2xl bg-[#e2e7fb] p-5">
                  {rows.map((row) => (
                    <div key={row.k} className="flex items-start justify-between gap-4">
                      <dt className="min-w-0">
                        <span className={cn("block font-display text-[12.5px] font-semibold", row.tone === "net" ? "text-ink" : "text-ink")}>
                          {row.label}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-snug text-ink/60">{row.note}</span>
                      </dt>
                      <dd
                        className={cn(
                          "shrink-0 font-display text-[13px] font-semibold tabular-nums",
                          row.tone === "cost" && "text-ink/70",
                          row.tone === "net" && (r.net < 0 ? "text-[#d0325f]" : "text-electric"),
                          (!row.tone || row.tone === "gain") && "text-ink"
                        )}
                      >
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {worksOut && (
                <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-[#c9d0e6] px-5 py-4">
                  <span className="text-[12.5px] font-semibold text-ink">
                    {t.result.roiLabel}
                    <span className="mt-0.5 block text-[11px] font-normal text-ink/65">{t.result.roiNote}</span>
                  </span>
                  <span className="font-display text-[15px] font-bold tabular-nums text-ink">{nf.format(Math.round(r.roi))} %</span>
                </div>
              )}

              {hasData && <p className="mt-5 text-[12px] leading-relaxed text-ink/70">{t.assumptions.warning}</p>}

              {hasData && (
                <a href="#desglose" className="btn-blue mt-6 flex w-full cursor-pointer items-center justify-center rounded-full py-3.5 font-display text-sm font-semibold">
                  {!worksOut ? t.result.negCta : t.lead.submit}
                </a>
              )}
            </Reveal>
          </div>
        </div>

        {/* ——— Cómo hacemos los cálculos ——— */}
        <section className="mx-auto max-w-4xl px-6 pt-28 text-center md:pt-36">
          <Reveal>
            <p className="eyebrow">{locale === "es" ? "Cómo hacemos los cálculos" : "How we do the maths"}</p>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,3.8vw,2.8rem)] font-bold leading-[1.15] tracking-[-0.02em] text-white">
              {t.assumptions.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-mist">{t.assumptions.body}</p>
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {t.assumptions.stats.map((s, i) => (
              <Reveal key={s.label} delay={0.08 * i}>
                <p className="font-display text-[clamp(2.4rem,4.5vw,3.2rem)] font-bold leading-none text-electric">{s.value}</p>
                <p className="mt-2 text-[13px] text-frost/85">{s.label}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2} className="mt-12 grid gap-4 text-left md:grid-cols-3">
            {t.assumptions.items.map((item, i) => (
              <div key={i} className="rounded-2xl border border-pulse/25 bg-[#070f2c] p-5 text-[13px] leading-relaxed text-mist">
                <Rich text={item} />
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mx-auto mt-6 max-w-[80ch] text-[12.5px] leading-relaxed text-mist/80">
              <Rich text={t.assumptions.math} strongClass="font-semibold text-frost/90" />
            </p>
          </Reveal>
        </section>

        {/* ——— Preguntas ——— */}
        <section className="mx-auto max-w-3xl px-6 pt-28 md:pt-36">
          <Reveal className="text-center">
            <p className="eyebrow">{t.faq.eyebrow}</p>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,3.8vw,2.8rem)] font-bold leading-tight tracking-[-0.02em] text-white">
              {t.faq.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 space-y-3">
            {t.faq.items.map((item) => (
              <details key={item.q} className="group/faq rounded-[22px] border border-pulse/30 bg-[#0b1435]/70 px-6 py-4 transition-colors open:bg-[#0e1a44]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-[13px] font-medium text-white [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span aria-hidden className="shrink-0 text-xl font-medium leading-none text-[#4d7dff] transition-transform duration-300 group-open/faq:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-mist">
                  <Rich text={item.a} />
                </p>
              </details>
            ))}
          </Reveal>
        </section>

        {/* ——— Captura: el desglose por escrito ——— */}
        <section id="desglose" className="mx-auto mt-28 max-w-5xl scroll-mt-24 px-6 md:mt-36">
          <Reveal className="grid overflow-hidden rounded-[26px] border border-pulse/40 md:grid-cols-2">
            <div className="bg-[#070f2c] p-8 md:p-10">
              <h2 className="font-display text-[clamp(1.6rem,3vw,2.1rem)] font-semibold leading-tight text-white">{t.lead.title}</h2>
              <p className="mt-4 text-[13.5px] leading-relaxed text-mist">{t.lead.body}</p>
              <p className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-[#4d7dff]">
                {t.lead.tags.map((tag, i) => (
                  <span key={tag} className="inline-flex items-center gap-2">
                    {tag}
                    {i < t.lead.tags.length - 1 && <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />}
                  </span>
                ))}
              </p>

              <div className="mt-8 rounded-2xl border border-pulse/40 bg-[#0e1a44]/60 p-5">
                <p className="font-display text-[17px] font-medium text-white">{t.diag.badge}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-mist">
                  <Rich text={t.diag.body} />
                </p>
              </div>
              <Link href="/precios" className="group mt-8 inline-flex items-center gap-1.5 font-display text-sm font-medium text-mint transition-colors hover:text-white">
                {t.diag.cta}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
              </Link>
            </div>

            <div className="card-blue p-8 text-white md:p-10">
              {status === "ok" ? (
                <div className="flex h-full flex-col justify-center text-center">
                  <p className="font-display text-2xl font-semibold">{t.lead.okTitle}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/85">{t.lead.okBody}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-5">
                  <label className="grid gap-2">
                    <span className="font-display text-[13px] font-semibold">{t.lead.nameLabel}</span>
                    <input name="name" required maxLength={120} placeholder={t.lead.namePh} className={inputCls} />
                  </label>
                  <label className="grid gap-2">
                    <span className="font-display text-[13px] font-semibold">{t.lead.contactLabel}</span>
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
                    <p className="rounded-xl bg-white/15 px-4 py-3 text-sm">
                      {t.lead.errorText}{" "}
                      <a href={`mailto:${EMAIL}`} className="font-semibold underline">
                        {EMAIL}
                      </a>
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="mx-auto mt-2 cursor-pointer rounded-full bg-white px-9 py-3.5 font-display text-sm font-semibold text-ink shadow-[0_14px_30px_-14px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
                  >
                    {status === "sending" ? t.lead.sending : t.lead.submit}
                  </button>
                  <p className="text-center text-[11px] leading-relaxed text-white/75">{t.lead.privacyNote}</p>
                </form>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 text-center">
            <Link href="/precios" className="group inline-flex items-center gap-1.5 font-display text-[15px] font-medium text-mint transition-colors hover:text-white">
              {t.toPricing}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </section>

        {/* ——— Resumen fijo en móvil ———
            El hueco de la derecha no es decorativo: ahí aterrizan los dos
            botones flotantes de chat y voz, que taparían la cifra. */}
        {hasData && (
          <div className="sticky bottom-0 z-40 mt-16 border-t border-line bg-abyss/90 px-6 py-3 backdrop-blur-xl lg:hidden">
            <div className="pr-[9.25rem]">
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

        <div className="mt-28 md:mt-36">
          <FinalCTA />
        </div>
      </main>
      <Footer />

      <ChatWidget />
      <VoiceWidget />
    </div>
  );
}
