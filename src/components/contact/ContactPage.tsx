"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";
import { getSessionId } from "@/lib/session";
import { trackEvent } from "@/lib/track";
import ChatWidget from "@/components/ui/ChatWidget";
import VoiceWidget from "@/components/ui/VoiceWidget";

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "";
const EMAIL = "projects@asenix.es";

/** Slugs estables de plan — coinciden con los ids de ng-agent (`src/plans.ts`). */
// Los planes que /precios publica hoy. Signal y Orbit salieron de la página el
// 23/08/2026 (Orbit vuelve con la voz), así que tampoco se ofrecen aquí: un
// desplegable que nombra planes que no están en la tarifa genera leads que hay
// que desdecir en la primera llamada.
const PLANS = ["arranque", "core", "nexus"] as const;

/**
 * /contacto — el primer camino de conversión real de la web: hasta ahora todos
 * los CTA acababan en un `mailto:`. Envía a `POST /api/lead` de ng-agent, que
 * guarda el lead en el CRM y avisa por Telegram. El plan llega preseleccionado
 * desde los CTA de /precios (`/contacto?plan=arranque`).
 */
export default function ContactPage() {
  const { locale, dict, setLocale } = useLocale();
  const t = dict.contact;
  const otherLocale = locale === "en" ? "es" : "en";

  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  // El plan viene en la query (?plan=arranque) desde los CTA de /precios. Se lee en
  // efecto y no con useSearchParams para no necesitar Suspense en export estático.
  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("plan") ?? "";
    if ((PLANS as readonly string[]).includes(fromQuery)) setPlan(fromQuery);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      contact: String(data.get("contact") ?? "").trim(),
      message: String(data.get("message") ?? "").trim() || undefined,
      plan: plan || undefined,
      sessionId: getSessionId(),
      // Honeypot: invisible para humanos; los bots que rellenan todo se delatan.
      website: String(data.get("website") ?? "") || undefined,
    };

    if (!AGENT_URL) {
      // Sin backend configurado: el correo sigue siendo mejor que perder el lead.
      const subject = encodeURIComponent(`Contacto web${plan ? ` · plan ${plan}` : ""}`);
      const body = encodeURIComponent(`${payload.name}\n${payload.contact}\n\n${payload.message ?? ""}`);
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
      trackEvent("lead_submitted");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-void">
      {/* Atmósfera: misma bruma que /precios para continuidad visual */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div className="absolute -left-44 -top-40 h-[620px] w-[620px] rounded-full bg-electric/10 blur-[130px]" />
        <div className="absolute -right-52 top-[38%] h-[520px] w-[520px] rounded-full bg-neon/[0.06] blur-[130px]" />
      </div>

      <main className="relative">
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

        <header className="mx-auto max-w-2xl px-6 pb-10 pt-16 text-center md:pt-24">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mx-auto mt-5 font-display text-[clamp(2.4rem,5.5vw,4.4rem)] font-bold leading-[1.04] tracking-[-0.035em] text-frost">
            {t.titleA}
            <br />
            <span className="bg-gradient-to-r from-frost via-[#5f8dff] to-neon bg-clip-text text-transparent">
              {t.titleB}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base font-light leading-relaxed text-mist">
            {t.sub}
          </p>
        </header>

        <section className="mx-auto max-w-xl px-6 pb-28">
          {status === "ok" ? (
            <div className="rounded-[22px] border border-neon/30 bg-panel/40 p-8 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neon/15">
                <Check className="h-6 w-6 text-neon" strokeWidth={2.2} />
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold text-frost">{t.successTitle}</h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-mist">{t.successText}</p>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("ng:open-chat"))}
                className="mt-6 inline-flex cursor-pointer items-center rounded-xl border border-line bg-panel/60 px-5 py-2.5 font-display text-sm font-semibold text-frost transition-all duration-300 hover:border-neon hover:bg-electric/[0.17]"
              >
                {t.successChat}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-[22px] border border-line bg-panel/30 p-7 md:p-9">
              <div className="grid gap-5">
                <label className="grid gap-2">
                  <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                    {t.nameLabel}
                  </span>
                  <input
                    name="name"
                    required
                    minLength={2}
                    maxLength={120}
                    autoComplete="name"
                    placeholder={t.namePh}
                    className="rounded-xl border border-line bg-space/55 px-4 py-3 text-sm text-frost outline-none transition-colors duration-200 placeholder:text-mist/40 focus:border-neon/50"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                    {t.contactLabel}
                  </span>
                  <input
                    name="contact"
                    required
                    minLength={3}
                    maxLength={200}
                    autoComplete="email"
                    placeholder={t.contactPh}
                    className="rounded-xl border border-line bg-space/55 px-4 py-3 text-sm text-frost outline-none transition-colors duration-200 placeholder:text-mist/40 focus:border-neon/50"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                    {t.planLabel}
                  </span>
                  <select
                    name="plan"
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className="cursor-pointer rounded-xl border border-line bg-space/55 px-4 py-3 text-sm text-frost outline-none transition-colors duration-200 focus:border-neon/50"
                  >
                    <option value="">{t.planNone}</option>
                    {PLANS.map((p) => (
                      <option key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-mist">
                    {t.messageLabel}
                  </span>
                  <textarea
                    name="message"
                    rows={4}
                    maxLength={1500}
                    placeholder={t.messagePh}
                    className="resize-y rounded-xl border border-line bg-space/55 px-4 py-3 text-sm leading-relaxed text-frost outline-none transition-colors duration-200 placeholder:text-mist/40 focus:border-neon/50"
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
                    {t.errorText}{" "}
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
                  {status === "sending" ? t.sending : t.submit}
                </button>

                <p className="text-center text-xs leading-relaxed text-mist/60">{t.privacyNote}</p>
              </div>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-mist">
            {t.or}{" "}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("ng:open-chat"))}
              className="cursor-pointer font-semibold text-frost underline decoration-neon/50 underline-offset-4 transition-colors duration-200 hover:text-neon"
            >
              {t.orChat}
            </button>
          </p>
        </section>
      </main>

      <ChatWidget />
      <VoiceWidget />
    </div>
  );
}
