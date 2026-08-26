"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, RotateCcw, Sparkles } from "lucide-react";
import ChatWidget from "@/components/ui/ChatWidget";
import VoiceWidget from "@/components/ui/VoiceWidget";
import { cn } from "@/lib/utils";
import { COMPANY } from "@/lib/company";
import { getSessionId } from "@/lib/session";
import { trackEvent } from "@/lib/track";
import { useLocale } from "@/i18n/LocaleContext";
import { LEGAL_SLUGS, legalLinkLabels } from "@/i18n/legal";
import {
  CALC_PLANS,
  calcDicts,
  calculate,
  type CalcPlanKey,
} from "@/i18n/calculadora";

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "";
const EMAIL = COMPANY.email;

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

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StepHead({ n, hint }: { n: string; hint?: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-neon">{n}</h2>
      {hint && <p className="mt-2 max-w-[52ch] text-[13px] font-light leading-relaxed text-mist">{hint}</p>}
    </div>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  suffix,
  autoFocus,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  suffix: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-frost/85">{label}</span>
      <span className="relative flex items-center">
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.,]/g, ""))}
          placeholder="—"
          className="w-full rounded-xl border border-line bg-space/55 px-4 py-3 pr-16 font-display text-lg font-semibold text-frost outline-none transition-colors duration-200 placeholder:font-light placeholder:text-mist/30 focus:border-neon/50"
        />
        <span className="pointer-events-none absolute right-4 font-display text-xs font-medium uppercase tracking-[0.12em] text-mist/60">
          {suffix}
        </span>
      </span>
      <span className="text-xs font-light leading-relaxed text-mist/70">{hint}</span>
    </label>
  );
}

/**
 * /calculadora — la versión pública de la cuenta de retorno.
 *
 * Deliberadamente distinta de la que se usa en la llamada: cuatro preguntas en
 * vez de doce, hipótesis fijas y visibles en vez de deslizadores, tarifa pública
 * en vez de la de fundador, y ningún guion de venta. El resultado puede ser que
 * no compense, y eso se dice en pantalla.
 *
 * El motor de cálculo vive en `src/i18n/calculadora.ts` para poder probarlo
 * aparte y para que la exportación a Figma pinte cifras reales.
 */
export default function CalculatorPage() {
  const { locale, setLocale } = useLocale();
  const t = calcDicts[locale];
  const otherLocale = locale === "en" ? "es" : "en";

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

  // Un solo evento la primera vez que la calculadora produce una cifra: mide
  // cuánta gente la usa de verdad, sin convertir cada tecla en una petición.
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
        // es-ES no agrupa 4 cifras por defecto: sin esto la puesta en marcha se
        // escribía "2900 €" aquí y "2.900 €" en /precios. Un precio publicado no
        // puede tener dos grafías.
        useGrouping: true,
      }),
    [locale]
  );
  const eur = (n: number) => cf.format(Math.round(n));
  const months = (n: number) =>
    n.toLocaleString(locale === "es" ? "es-ES" : "en-GB", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

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

  return (
    <div className="relative min-h-screen overflow-x-clip bg-void">
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div className="absolute -left-44 -top-40 h-[620px] w-[620px] rounded-full bg-electric/10 blur-[130px]" />
        <div className="absolute -right-52 top-[38%] h-[520px] w-[520px] rounded-full bg-neon/[0.06] blur-[130px]" />
        <div className="absolute -bottom-52 left-[30%] h-[560px] w-[560px] rounded-full bg-pulse/[0.07] blur-[130px]" />
      </div>

      <main className="relative">
        {/* ——— Barra propia ——— */}
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
        <header className="mx-auto max-w-3xl px-6 pb-12 pt-14 text-center md:pt-20">
          <p className="eyebrow">{t.header.eyebrow}</p>
          <h1 className="mx-auto mt-5 font-display text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.035em] text-frost">
            {t.header.titleA}
            <br />
            <span className="bg-gradient-to-r from-frost via-[#5f8dff] to-neon bg-clip-text text-transparent">
              {t.header.titleB}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-light leading-relaxed text-mist">{t.header.lede}</p>
        </header>

        {/* ——— Por qué se pierde dinero: el porqué antes de pedir cifras ———
            Va ANTES del formulario a propósito. A un dueño que entra frío por
            Google, cuatro casillas en blanco no le dicen nada; lo que le hace
            rellenarlas es reconocerse en el goteo. */}
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{t.why.eyebrow}</p>
            <h2 className="mt-4 font-display text-[clamp(1.5rem,3vw,2.1rem)] font-semibold leading-[1.15] tracking-tight text-frost">
              {t.why.title}
            </h2>
            <p className="mt-4 font-light leading-relaxed text-mist">{t.why.body}</p>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {t.why.items.map((item, i) => (
              <Reveal key={item.title} delay={0.06 * i}>
                <div className="h-full rounded-2xl border border-line bg-panel/25 p-6">
                  <span
                    aria-hidden
                    className="font-display text-[11px] font-bold tracking-[0.2em] text-neon"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-base font-semibold leading-snug text-frost">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[13px] font-light leading-relaxed text-mist">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="mt-8 max-w-[60ch] text-sm font-light leading-relaxed text-mist/80">
              {t.why.foot}
            </p>
          </Reveal>
        </section>

        {/* ——— Formulario + resultado ——— */}
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_minmax(360px,420px)] lg:items-start">
          {/* — columna izquierda: las preguntas — */}
          <div className="grid gap-6">
            <Reveal className="rounded-[22px] border border-line bg-panel/30 p-6 md:p-8">
              <StepHead n={t.form.step1} />

              <p className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-frost/85">
                {t.form.sectorLabel}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {t.form.sectors.map((s) => (
                  <button
                    key={s.k}
                    type="button"
                    aria-pressed={sector === s.k}
                    onClick={() => pickSector(s.k, s.visits)}
                    className={cn(
                      "cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-all duration-200",
                      sector === s.k
                        ? "border-neon/50 bg-neon/10 text-frost"
                        : "border-line text-mist hover:border-[rgba(94,140,255,0.4)] hover:text-frost"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs font-light text-mist/70">{t.form.sectorHint}</p>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <Field
                  label={t.form.ticketLabel}
                  hint={t.form.ticketHint}
                  value={fields.ticket}
                  onChange={set("ticket")}
                  suffix="€"
                />
                <Field
                  label={t.form.visitsLabel}
                  hint={t.form.visitsHint}
                  value={fields.visits}
                  onChange={set("visits")}
                  suffix={locale === "es" ? "al año" : "a year"}
                />
              </div>

              {r.clientValue > 0 && (
                <p className="mt-6 rounded-xl border border-line bg-space/40 px-4 py-3 text-sm text-mist">
                  {t.result.clientValueLabel}{" "}
                  <strong className="font-display font-semibold text-neon">{eur(r.clientValue)}</strong>
                </p>
              )}
            </Reveal>

            <Reveal delay={0.05} className="rounded-[22px] border border-line bg-panel/30 p-6 md:p-8">
              <StepHead n={t.form.step2} hint={t.form.step2Hint} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label={t.form.missedLabel}
                  hint={t.form.missedHint}
                  value={fields.missed}
                  onChange={set("missed")}
                  suffix={locale === "es" ? "/sem" : "/wk"}
                />
                <Field
                  label={t.form.noShowsLabel}
                  hint={t.form.noShowsHint}
                  value={fields.noShows}
                  onChange={set("noShows")}
                  suffix={t.form.perMonth}
                />
              </div>
            </Reveal>

            <Reveal delay={0.1} className="rounded-[22px] border border-line bg-panel/30 p-6 md:p-8">
              <StepHead n={t.form.step3} hint={t.form.planHint} />
              <div className="grid gap-3 sm:grid-cols-2">
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
                        "cursor-pointer rounded-2xl border p-5 text-left transition-all duration-200",
                        active
                          ? "border-neon/45 bg-gradient-to-br from-[rgba(20,34,78,0.6)] to-[rgba(9,14,30,0.4)]"
                          : "border-line bg-space/30 hover:border-[rgba(94,140,255,0.4)]"
                      )}
                    >
                      <p className="font-display text-lg font-semibold text-frost">{p.name}</p>
                      <p className="mt-1 text-[13px] font-light leading-relaxed text-mist">{p.desc}</p>
                      <p className="mt-4 font-display text-sm font-semibold text-neon">
                        {eur(data.mrr)}
                        {t.form.perMonth}
                      </p>
                      <p className="text-xs text-mist/70">
                        + {eur(data.setup)} {t.form.setupNote}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFields(EXAMPLE);
                    setSector("belleza");
                  }}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-[13px] text-mist transition-colors duration-200 hover:border-neon/40 hover:text-frost"
                >
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
                  {t.form.example}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-[13px] text-mist transition-colors duration-200 hover:border-neon/40 hover:text-frost"
                >
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.8} />
                  {t.form.reset}
                </button>
              </div>
            </Reveal>
          </div>

          {/* — columna derecha: el resultado, pegado arriba — */}
          <div className="lg:sticky lg:top-8">
            <div
              className={cn(
                "rounded-[22px] border p-6 md:p-8",
                hasData && !worksOut
                  ? "border-pulse/35 bg-[radial-gradient(ellipse_80%_100%_at_50%_0%,rgba(124,92,255,0.14),transparent_70%)]"
                  : "border-line bg-[radial-gradient(ellipse_80%_100%_at_50%_0%,rgba(46,107,255,0.16),transparent_70%)]"
              )}
            >
              <p className="eyebrow">{t.result.eyebrow}</p>

              {!hasData && (
                <>
                  <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-frost">
                    {t.result.idleTitle}
                  </h2>
                  <p className="mt-3 text-sm font-light leading-relaxed text-mist">{t.result.idleBody}</p>
                </>
              )}

              {hasData && !worksOut && (
                <>
                  <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-frost">
                    {t.result.negTitle}
                  </h2>
                  <p className="mt-3 text-sm font-light leading-relaxed text-mist">{t.result.negBody}</p>
                </>
              )}

              {worksOut && (
                <>
                  <p className="mt-4 font-display text-xs font-semibold uppercase tracking-[0.16em] text-mist">
                    {t.result.paybackLabel}
                  </p>
                  <p className="mt-1 font-display text-[clamp(2.6rem,6vw,3.6rem)] font-bold leading-none tracking-[-0.04em] text-frost">
                    {months(r.payback)}
                    <span className="ml-2 font-display text-base font-medium tracking-normal text-neon">
                      {t.result.months}
                    </span>
                  </p>
                  <p className="mt-3 text-sm font-light leading-relaxed text-mist">{t.result.paybackBody}</p>

                  {/* Barra: cuánto de la fuga se recupera y cuánto no */}
                  <div className="mt-7">
                    <div className="flex h-2.5 overflow-hidden rounded-full bg-space/70">
                      <div
                        className="h-full bg-gradient-to-r from-electric to-neon transition-[width] duration-500"
                        style={{ width: `${gainPct}%` }}
                      />
                      <div className="h-full flex-1 bg-pulse/25" />
                    </div>
                    <div className="mt-2.5 flex justify-between text-xs text-mist">
                      <span>
                        {t.result.barGain} · <strong className="font-semibold text-neon">{eur(r.recovered)}</strong>
                      </span>
                      <span>
                        {t.result.barLeak} ·{" "}
                        <strong className="font-semibold text-frost/80">{eur(r.leak - r.recovered)}</strong>
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Desglose: siempre visible, para que el titular no vaya solo */}
              {hasData && (
                <dl className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-line bg-line">
                  {rows.map((row) => (
                    <div
                      key={row.k}
                      className={cn(
                        "flex items-baseline justify-between gap-4 px-4 py-3.5",
                        row.tone === "net" ? "bg-space/80" : "bg-abyss/80"
                      )}
                    >
                      <dt className="min-w-0">
                        <span
                          className={cn(
                            "block text-[13px]",
                            row.tone === "net" ? "font-display font-semibold text-frost" : "text-frost/85"
                          )}
                        >
                          {row.label}
                        </span>
                        <span className="mt-0.5 block text-[11px] font-light leading-snug text-mist/65">
                          {row.note}
                        </span>
                      </dt>
                      <dd
                        className={cn(
                          "shrink-0 font-display text-sm font-semibold tabular-nums",
                          row.tone === "gain" && "text-neon",
                          row.tone === "cost" && "text-mist",
                          row.tone === "net" && (r.net < 0 ? "text-[#ff9bb5] text-lg" : "text-lg text-neon"),
                          !row.tone && "text-frost"
                        )}
                      >
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {worksOut && (
                <div className="mt-5 flex items-baseline justify-between gap-4 rounded-xl border border-line bg-space/40 px-4 py-3">
                  <span className="text-[13px] text-frost/85">
                    {t.result.roiLabel}
                    <span className="mt-0.5 block text-[11px] font-light text-mist/65">{t.result.roiNote}</span>
                  </span>
                  <span className="font-display text-lg font-bold tabular-nums text-neon">
                    {nf.format(Math.round(r.roi))} %
                  </span>
                </div>
              )}

              {hasData && (
                <p className="mt-5 text-[11px] font-light leading-relaxed text-mist/60">{t.assumptions.warning}</p>
              )}

              <a
                href="#desglose"
                className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-electric to-neon py-3.5 text-center font-display text-sm font-semibold text-void shadow-[0_14px_40px_-14px_rgba(56,212,255,0.65)] transition-all duration-300 hover:shadow-[0_20px_52px_-14px_rgba(56,212,255,0.85)]"
              >
                {hasData && !worksOut ? t.result.negCta : t.lead.submit}
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>

        {/* ——— Las hipótesis, escritas ——— */}
        <section className="mx-auto mt-20 max-w-7xl px-6">
          <Reveal className="rounded-[22px] border border-line bg-panel/25 p-7 md:p-10">
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.1rem)] font-semibold tracking-tight text-frost">
              {t.assumptions.title}
            </h2>
            <p className="mt-4 max-w-[62ch] font-light leading-relaxed text-mist">{t.assumptions.body}</p>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {t.assumptions.items.map((item, i) => (
                <li key={i} className="rounded-2xl border border-line bg-space/35 p-5 text-sm font-light leading-relaxed text-mist">
                  <Rich text={item} />
                </li>
              ))}
            </ul>
            <p className="mt-7 max-w-[80ch] text-[13px] font-light leading-relaxed text-mist/80">
              <Rich text={t.assumptions.math} strongClass="font-semibold text-frost/90" />
            </p>
          </Reveal>
        </section>

        {/* ——— Preguntas: las objeciones de la llamada, ya respondidas ——— */}
        <section className="mx-auto mt-20 max-w-7xl px-6">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{t.faq.eyebrow}</p>
            <h2 className="mt-4 font-display text-[clamp(1.5rem,3vw,2.1rem)] font-semibold leading-tight tracking-tight text-frost">
              {t.faq.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 max-w-3xl">
            {t.faq.items.map((item, i) => (
              <details key={item.q} open={i === 0} className="group/faq border-b border-line py-5">
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

        {/* ——— Captura: el desglose por escrito ——— */}
        <section id="desglose" className="mx-auto mt-16 max-w-7xl scroll-mt-8 px-6">
          <Reveal className="grid gap-8 rounded-[26px] border border-line bg-[radial-gradient(ellipse_70%_100%_at_20%_0%,rgba(46,107,255,0.14),transparent_68%)] p-7 md:grid-cols-2 md:p-10">
            <div>
              <p className="eyebrow">{t.lead.eyebrow}</p>
              <h2 className="mt-4 font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold leading-tight tracking-tight text-frost">
                {t.lead.title}
              </h2>
              <p className="mt-4 max-w-[46ch] font-light leading-relaxed text-mist">{t.lead.body}</p>

              <div className="mt-8 rounded-2xl border border-line bg-space/40 p-5">
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-neon">
                  {t.diag.badge}
                </p>
                <p className="mt-3 text-[13px] font-light leading-relaxed text-mist">
                  <Rich text={t.diag.body} />
                </p>
                <Link
                  href="/precios"
                  className="mt-4 inline-flex items-center gap-1.5 font-display text-[13px] font-semibold text-frost transition-colors duration-200 hover:text-neon"
                >
                  {t.diag.cta}
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                </Link>
              </div>
            </div>

            {status === "ok" ? (
              <div className="flex flex-col justify-center rounded-[22px] border border-neon/30 bg-panel/40 p-7 text-center">
                <p className="font-display text-2xl font-semibold text-frost">{t.lead.okTitle}</p>
                <p className="mt-3 text-sm font-light leading-relaxed text-mist">{t.lead.okBody}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-[22px] border border-line bg-panel/40 p-6 md:p-7">
                <div className="grid gap-5">
                  <label className="grid gap-2">
                    <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                      {t.lead.nameLabel}
                    </span>
                    <input
                      name="name"
                      required
                      maxLength={120}
                      placeholder={t.lead.namePh}
                      className="rounded-xl border border-line bg-space/55 px-4 py-3 text-sm text-frost outline-none transition-colors duration-200 placeholder:text-mist/40 focus:border-neon/50"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                      {t.lead.contactLabel}
                    </span>
                    <input
                      name="contact"
                      required
                      maxLength={160}
                      placeholder={t.lead.contactPh}
                      className="rounded-xl border border-line bg-space/55 px-4 py-3 text-sm text-frost outline-none transition-colors duration-200 placeholder:text-mist/40 focus:border-neon/50"
                    />
                  </label>

                  {/* Honeypot anti-bots: fuera de pantalla y fuera del tab order */}
                  <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
                    <label>
                      website
                      <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>

                  {status === "error" && (
                    <p className="rounded-xl border border-pulse/40 bg-pulse/[0.08] px-4 py-3 text-sm text-[#ffd7e0]">
                      {t.lead.errorText}{" "}
                      <a href={`mailto:${EMAIL}`} className="font-semibold underline">
                        {EMAIL}
                      </a>
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="mt-1 cursor-pointer rounded-xl bg-gradient-to-r from-electric to-neon py-3.5 text-center font-display text-sm font-semibold text-void shadow-[0_14px_40px_-14px_rgba(56,212,255,0.65)] transition-all duration-300 hover:shadow-[0_20px_52px_-14px_rgba(56,212,255,0.85)] disabled:cursor-wait disabled:opacity-60"
                  >
                    {status === "sending" ? t.lead.sending : t.lead.submit}
                  </button>

                  <p className="text-center text-xs leading-relaxed text-mist/60">{t.lead.privacyNote}</p>
                </div>
              </form>
            )}
          </Reveal>
        </section>

        {/* ——— Resumen fijo en móvil ———
            El hueco de la derecha (pr-[9.75rem]) no es decorativo: ahí aterrizan
            los dos botones flotantes de chat y voz, que van en z-60 y taparían
            la cifra. La barra les cede el sitio en vez de pelearse con ellos. */}
        {hasData && (
          <div className="sticky bottom-0 z-40 mt-12 border-t border-line bg-abyss/90 px-6 py-3 backdrop-blur-xl lg:hidden">
            <div className="pr-[9.25rem]">
              <p className="truncate text-[10px] uppercase tracking-[0.16em] text-mist/70">
                {t.result.rows.net.label}
              </p>
              <p className="flex items-baseline gap-2 leading-tight">
                <span
                  className={cn(
                    "font-display text-lg font-bold",
                    r.net < 0 ? "text-[#ff9bb5]" : "text-neon"
                  )}
                >
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

        {/* ——— Pie compacto ——— */}
        <footer className="mt-16 border-t border-line py-14 text-center">
          <Link href="/precios" className="font-display text-sm font-semibold text-frost transition-colors hover:text-neon">
            {t.toPricing}
          </Link>
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

      <ChatWidget />
      <VoiceWidget />
    </div>
  );
}
