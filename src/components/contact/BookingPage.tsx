"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Mail, MapPin, Phone } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FinalCTA from "@/components/sections/FinalCTA";
import ChatWidget from "@/components/ui/ChatWidget";
import VoiceWidget from "@/components/ui/VoiceWidget";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";
import { bookingDicts } from "@/i18n/booking";
import { availability, book, bookingConfigured, isoDay, type Availability } from "@/lib/booking";
import { getSessionId } from "@/lib/session";
import { trackEvent } from "@/lib/track";

/**
 * /contacto — la reserva de llamada del Figma `1643:2250`.
 *
 * Todas las medidas de aquí salen de `docs/figma/contacto-1643/spec.md` y se
 * escriben en unidades del marco (`*-u-N` = N px a 1920, proporcional por
 * debajo). Las referencias `y NNN` de los comentarios son coordenadas del
 * marco, para poder volver a comprobarlas contra `proto/p-00.png`.
 *
 * La pantalla del formulario de mensaje que vivía aquí no se ha tirado: está
 * en `/contacto/mensaje`, enlazada al pie de la tarjeta.
 */

/** Slugs estables de plan — coinciden con los ids de ng-agent (`src/plans.ts`). */
const PLANS = ["arranque", "core", "nexus"] as const;
const EMAIL = "projects@asenix.es";

const ICONS = { email: Mail, phone: Phone, place: MapPin } as const;

/** Pastillas de hora por página: las seis del marco (rejilla de 3×2). */
const SLOTS_PER_PAGE = 6;

/* ————————————————————————————————————————————————————————————————
   Calendario · Figma: caja 306×297 en (762, 767), relleno #081248,
   radio 16, padding 10. Rejilla de 7×5 celdas de 40 con 1 de hueco
   (paso 41). Cabecera de 29 con los dos desplegables de borde azul.
   ———————————————————————————————————————————————————————————————— */

function monthMatrix(year: number, month: number): Date[] {
  // Empieza en domingo, como el marco (Su Mo Tu We Th Fr Sa).
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  return Array.from({ length: 35 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function Calendar({
  year,
  month,
  selected,
  freeDays,
  months,
  weekdays,
  labels,
  onPick,
  onMonth,
}: {
  year: number;
  month: number;
  selected: string | null;
  freeDays: Set<string>;
  months: string[];
  weekdays: string[];
  labels: { prev: string; next: string };
  onPick: (day: string) => void;
  onMonth: (year: number, month: number) => void;
}) {
  const cells = useMemo(() => monthMatrix(year, month), [year, month]);
  const years = useMemo(() => {
    const now = new Date().getFullYear();
    return [now, now + 1];
  }, []);

  const selectClass =
    "h-u-29 cursor-pointer appearance-none rounded-u-8 border border-electric bg-transparent pl-u-14 pr-u-30 font-display fs-u-15 font-medium text-white outline-none transition-colors duration-200 hover:bg-electric/10 focus-visible:ring-2 focus-visible:ring-electric/60";
  // Las flechas de mes van a 44 px en móvil. Con `size-u-24` caían al suelo del
  // 60 % de la unidad —14,4 px— y no hay forma de acertarles con el dedo.
  const arrowClass =
    "flex size-11 cursor-pointer items-center justify-center text-white transition-opacity duration-200 hover:opacity-60 md:size-u-24";

  const step = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    onMonth(d.getFullYear(), d.getMonth());
  };

  return (
    <div className="rounded-u-16 bg-[#081248] px-u-10 pb-u-4 pt-u-20">
      {/* Cabecera: y 787…815 en el marco */}
      <div className="flex h-u-29 items-center justify-between">
        <button type="button" aria-label={labels.prev} onClick={() => step(-1)} className={arrowClass}>
          <ChevronLeft className="size-5 md:size-u-20" strokeWidth={2.2} />
        </button>

        <div className="flex items-center gap-u-8">
          <div className="relative">
            <select
              aria-label={labels.prev}
              value={month}
              onChange={(e) => onMonth(year, Number(e.target.value))}
              className={selectClass}
            >
              {months.map((m, i) => (
                <option key={m} value={i} className="bg-abyss">
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute right-u-10 top-1/2 size-u-14 -translate-y-1/2 text-white"
              strokeWidth={2}
            />
          </div>
          <div className="relative">
            <select
              aria-label={labels.next}
              value={year}
              onChange={(e) => onMonth(Number(e.target.value), month)}
              className={selectClass}
            >
              {years.map((y) => (
                <option key={y} value={y} className="bg-abyss">
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute right-u-10 top-1/2 size-u-14 -translate-y-1/2 text-white"
              strokeWidth={2}
            />
          </div>
        </div>

        <button type="button" aria-label={labels.next} onClick={() => step(1)} className={arrowClass}>
          <ChevronRight className="size-5 md:size-u-20" strokeWidth={2.2} />
        </button>
      </div>

      {/* Días de la semana: tinta en y 840…849, en electric */}
      <div className="mt-u-23 grid grid-cols-7 gap-u-1 font-display fs-u-14 font-medium text-electric">
        {weekdays.map((w, i) => (
          <span key={i} className="flex h-5 items-center justify-center md:h-u-16">
            {w}
          </span>
        ))}
      </div>

      {/* Rejilla: primera celda en y 855, paso 41 */}
      <div className="mt-u-2 grid grid-cols-7 gap-u-1">
        {cells.map((d) => {
          const key = isoDay(d);
          const outside = d.getMonth() !== month;
          const free = freeDays.has(key);
          const isSelected = selected === key;
          return (
            <button
              key={key}
              type="button"
              disabled={!free}
              aria-pressed={isSelected}
              onClick={() => onPick(key)}
              className={cn(
                // En móvil la celda llena su columna y garantiza 44 px de alto.
                // Con `size-u-40` quedaba clavada en 24 px dentro de una columna
                // de 39: desperdiciaba el hueco y no llegaba al mínimo táctil.
                "flex w-full min-h-11 items-center justify-center rounded-u-8 font-display text-[15px] font-medium transition-colors duration-200 md:size-u-40 md:min-h-0 md:fs-u-17",
                isSelected
                  ? "bg-electric text-white"
                  : free
                    ? "bg-[#1c2658] text-white hover:bg-electric/40"
                    : outside
                      ? "cursor-default text-[#5d6785]"
                      : "cursor-default text-white/85"
              )}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ———————————————————————————————————————————————————————————————— */

export default function BookingPage() {
  const { locale } = useLocale();
  const t = bookingDicts[locale];

  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [slots, setSlots] = useState<Availability>({});
  const [agenda, setAgenda] = useState<"idle" | "loading" | "error">("idle");
  const [day, setDay] = useState<string | null>(null);
  const [startUtc, setStartUtc] = useState<string | null>(null);
  const [slotPage, setSlotPage] = useState(0);
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error" | "taken">("idle");
  const [code, setCode] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // El plan llega preseleccionado desde los CTA de /precios (?plan=core). Se lee
  // en efecto y no con useSearchParams para no necesitar Suspense en export estático.
  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("plan") ?? "";
    if ((PLANS as readonly string[]).includes(fromQuery)) setPlan(fromQuery);
  }, []);

  // Un mes entero por petición: el calendario tiene que saber qué días encender
  // antes de que nadie pulse nada.
  useEffect(() => {
    if (!bookingConfigured) return;
    const ctrl = new AbortController();
    const from = isoDay(new Date(view.year, view.month, 1));
    const to = isoDay(new Date(view.year, view.month + 1, 0));
    setAgenda("loading");
    availability(from, to, ctrl.signal)
      .then((days) => {
        setSlots((prev) => ({ ...prev, ...days }));
        setAgenda("idle");
      })
      .catch((err) => {
        if (err?.name !== "AbortError") setAgenda("error");
      });
    return () => ctrl.abort();
  }, [view.year, view.month]);

  const freeDays = useMemo(
    () => new Set(Object.keys(slots).filter((k) => slots[k]?.length)),
    [slots]
  );

  // Primer día con hueco del mes que se está viendo, para no dejar la columna
  // de horarios vacía nada más entrar.
  useEffect(() => {
    if (day && freeDays.has(day)) return;
    const prefix = `${view.year}-${String(view.month + 1).padStart(2, "0")}`;
    const first = [...freeDays].filter((k) => k.startsWith(prefix)).sort()[0];
    setDay(first ?? null);
    setStartUtc(null);
  }, [freeDays, view.year, view.month, day]);

  const daySlots = day ? (slots[day] ?? []) : [];
  const slotPages = Math.max(1, Math.ceil(daySlots.length / SLOTS_PER_PAGE));
  // Si la agenda encoge (alguien reservó mientras mirabas), la página en la que
  // estabas puede dejar de existir: se cae a la última que sí existe.
  const page = Math.min(slotPage, slotPages - 1);
  const pageSlots = daySlots.slice(page * SLOTS_PER_PAGE, (page + 1) * SLOTS_PER_PAGE);

  const pickDay = useCallback((key: string) => {
    setDay(key);
    setStartUtc(null);
    setSlotPage(0);
  }, []);

  const timeLabel = useCallback(
    (iso: string) =>
      new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso)),
    [locale]
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!startUtc) return;
    const data = new FormData(e.currentTarget);
    setStatus("sending");
    const res = await book({
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim() || undefined,
      goals: String(data.get("goals") ?? "").trim() || undefined,
      plan: plan || undefined,
      startUtc,
      sessionId: getSessionId(),
      website: String(data.get("website") ?? "") || undefined,
    });
    if (res.ok) {
      setCode(res.code);
      setStatus("ok");
      trackEvent("booking_created");
      return;
    }
    if (res.reason === "slot_taken") {
      // El hueco se ocupó entre la consulta y el envío: quitarlo y pedir otro.
      setSlots((prev) => ({ ...prev, [day!]: (prev[day!] ?? []).filter((s) => s !== startUtc) }));
      setStartUtc(null);
      setStatus("taken");
      return;
    }
    setStatus("error");
  }

  /* Campos: 42 de alto, radio 10, relleno blanco al 7 % sobre el degradado de
     la tarjeta, borde de 1 px. Figma: y 715, 766, 818 y el área de texto en 870. */
  /* Flechas de la paginación de horas: las mismas del calendario, un punto más
     pequeñas, y apagadas en los extremos. */
  const pagerClass =
    "flex size-11 cursor-pointer items-center justify-center text-white transition-opacity duration-200 hover:opacity-60 disabled:cursor-default disabled:opacity-25 md:size-u-18";

  const fieldClass =
    "h-u-42 w-full rounded-u-10 border border-white/25 bg-white/[0.07] px-u-16 font-display fs-u-15 text-white outline-none transition-colors duration-200 placeholder:text-white/45 focus:border-electric";

  return (
    <div className="relative min-h-screen overflow-x-clip bg-void">
      <Navbar breadcrumb={t.breadcrumbHere} />

      <main className="relative pt-u-116">
        {/* 02 · Cabecera — pastilla en y 160, H1 en y 221, subtítulo en y 369 */}
        <header className="flex flex-col items-center px-5 text-center">
          <p className="eyebrow mt-u-45">{t.eyebrow}</p>
          {/* El marco parte el titular en dos: «Obten una llamada» / «estrategica».
              Lo que fuerza el corte es el ancho del nodo, no un <br>. */}
          <h1 className="mt-u-27 max-w-u-620 font-display fs-u-52 lh-u-54 font-bold text-white">
            {t.titleA}
            <span className="text-electric">{t.titleB}</span>
          </h1>
          <p className="sub-section mt-u-40 max-w-u-660">{t.sub}</p>
        </header>

        {/* 03 · Tarjeta — 1192×654 en (364, 472), radio 30, padding 32 */}
        <section className="mt-u-52 px-5 pb-u-143">
          {/* El relleno no es simétrico en el marco: por la izquierda son 30
              (los azulejos empiezan en x 393) y 32 por los otros tres lados,
              que es lo que deja la tarjeta interior encajada a 732. */}
          {/* En móvil los laterales bajan a 10 px. Los valores del Figma (28/31)
              son de 1920 y al escalarlos quedan ~17 por lado; sumados a los del
              marco de dentro y a los de la sección, el calendario se quedaba con
              273 px de rejilla y celdas de 24. */}
          <div className="relative mx-auto max-w-u-1192 overflow-hidden rounded-u-30 border border-[#1d306b] px-u-10 pb-u-32 pt-u-32 md:pl-u-28 md:pr-u-31">
            {/* Relleno: brillo elíptico con el máximo hacia (450, 760) del marco,
                es decir un 7 % a la derecha y un 44 % hacia abajo de la tarjeta. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(112%_64%_at_7%_44%,#081546_0%,#091338_38%,#060f2b_68%,#04091e_88%,#030714_100%)]"
            />

            {/* Sin hueco entre columnas: la tarjeta interior arranca justo donde
                acaba la columna de 338 (x 732 en el marco). */}
            <div className="relative flex flex-col gap-10 lg:flex-row lg:gap-0">
              {/* Columna izquierda: 338 de ancho */}
              <div className="w-full lg:w-u-339 lg:shrink-0">
                {/* Ventajas: tinta en y 541, paso 27 */}
                {/* En el marco la lista va sangrada 16 respecto a los azulejos
                    (el check empieza en x 409 y los azulejos en 393), con paso 28. */}
                <ul className="mt-u-27 flex flex-col pl-u-14">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-center gap-u-14 lh-u-28">
                      <Check className="size-u-18 shrink-0 text-neon" strokeWidth={3} />
                      <span className="font-display fs-u-14 font-semibold text-white">{p}</span>
                    </li>
                  ))}
                </ul>

                {/* Datos de contacto: azulejos de 62 en y 830, paso 86 */}
                {/* Los 215 solo valen en escritorio: en el marco separan las viñetas de
                    los datos porque la columna tiene que llegar hasta abajo. Apilado no
                    hay nada que igualar, y el suelo de `mt-u-*` dejaría 129 px de vacío. */}
                <ul className="mt-10 flex flex-col gap-u-24 lg:mt-u-215">
                  {t.channels.map((c) => {
                    const Icon = ICONS[c.kind];
                    const body = (
                      <>
                        <span className="flex size-u-62 shrink-0 items-center justify-center rounded-u-16 bg-[#0d1e75]">
                          <Icon className="size-u-28 text-electric" strokeWidth={2} />
                        </span>
                        <span className="flex flex-col justify-center">
                          <span className="fs-u-15 text-pulse">{c.label}</span>
                          <span className="mt-u-4 font-display fs-u-17 font-medium text-white">{c.value}</span>
                        </span>
                      </>
                    );
                    return (
                      <li key={c.label}>
                        {c.href ? (
                          <a
                            href={c.href}
                            className="flex gap-u-20 transition-opacity duration-200 hover:opacity-80"
                          >
                            {body}
                          </a>
                        ) : (
                          <div className="flex gap-u-20">{body}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* 03b · Tarjeta interior: 792×590, radio 20, navy → abyss al 65 % */}
              <div className="min-w-0 flex-1 rounded-u-20 border border-[#1339bb] bg-[linear-gradient(180deg,#101837_0%,#050b21_65%)] px-u-14 pb-u-28 pt-u-32 md:pl-u-29 md:pr-u-18">
                {status === "ok" ? (
                  <div className="flex min-h-u-534 flex-col items-center justify-center text-center">
                    <span className="flex size-u-62 items-center justify-center rounded-full bg-neon/15">
                      <Check className="size-u-30 text-neon" strokeWidth={2.4} />
                    </span>
                    <h2 className="mt-u-24 font-display fs-u-25 lh-u-28 font-semibold text-white">{t.okTitle}</h2>
                    <p className="mt-u-12 max-w-u-420 fs-u-15 text-cloud">{t.okText}</p>
                    {code && (
                      <p className="mt-u-16 font-display fs-u-15 text-white">
                        {t.okCode} <strong className="text-neon">{code}</strong>
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent("ng:open-chat"))}
                      className="mt-u-24 h-u-46 cursor-pointer rounded-u-10 border border-white/25 bg-white/[0.07] px-u-24 font-display fs-u-15 font-semibold text-white transition-colors duration-300 hover:border-electric"
                    >
                      {t.okChat}
                    </button>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-u-46 lg:flex-row">
                    {/* Columna del calendario: 306 */}
                    <div className="w-full lg:w-u-306 lg:shrink-0">
                      <h2 className="font-display fs-u-25 lh-u-28 font-semibold text-white">{t.panelTitle}</h2>
                      <p className="mt-u-13 fs-u-15 lh-u-18 text-electric">{t.panelSub}</p>
                      <p className="mt-u-73 font-display fs-u-12 font-semibold text-white">{t.pickDate}</p>
                      <div className="mt-u-15">
                        <Calendar
                          year={view.year}
                          month={view.month}
                          selected={day}
                          freeDays={freeDays}
                          months={t.months}
                          weekdays={t.weekdays}
                          labels={{ prev: t.prevMonth, next: t.nextMonth }}
                          onPick={pickDay}
                          onMonth={(year, month) => setView({ year, month })}
                        />
                      </div>
                    </div>

                    {/* Columna de horarios y datos: 391 */}
                    <div className="min-w-0 flex-1">
                      {/* El marco dibuja seis pastillas en 3×2, pero un día de 9 a 19
                          tiene veinte huecos: enseñar solo los seis primeros deja sin
                          reservar toda la tarde. La rejilla se queda igual y se pagina
                          de seis en seis con las flechas, que caben en el hueco que el
                          marco deja a la derecha del rótulo. Con seis huecos o menos no
                          se pintan: en reposo la pantalla es la del Figma. */}
                      <div className="mt-u-2 flex min-h-11 items-center justify-between md:h-u-18 md:min-h-0">
                        <p className="font-display fs-u-12 font-semibold text-white">{t.slotsTitle}</p>
                        {slotPages > 1 && (
                          <div className="flex items-center gap-u-4">
                            <button
                              type="button"
                              aria-label={t.prevSlots}
                              disabled={page === 0}
                              onClick={() => setSlotPage(Math.max(0, page - 1))}
                              className={pagerClass}
                            >
                              <ChevronLeft className="size-5 md:size-u-16" strokeWidth={2.2} />
                            </button>
                            <button
                              type="button"
                              aria-label={t.nextSlots}
                              disabled={page >= slotPages - 1}
                              onClick={() => setSlotPage(Math.min(slotPages - 1, page + 1))}
                              className={pagerClass}
                            >
                              <ChevronRight className="size-5 md:size-u-16" strokeWidth={2.2} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="mt-u-10 min-h-u-93">
                        {agenda === "error" ? (
                          <p className="fs-u-14 text-[#ffd7e0]">{t.slotsError}</p>
                        ) : agenda === "loading" && !daySlots.length ? (
                          <p className="fs-u-14 text-mist">{t.slotsLoading}</p>
                        ) : daySlots.length ? (
                          <div className="grid grid-cols-3 gap-x-u-8 gap-y-u-9">
                            {pageSlots.map((iso) => (
                              <button
                                key={iso}
                                type="button"
                                aria-pressed={startUtc === iso}
                                onClick={() => setStartUtc(iso)}
                                className={cn(
                                  // Los huecos de hora son el segundo toque de la
                                  // reserva: en móvil van a 44 px, no a los 25 a
                                  // los que caía `h-u-42`.
                                  "h-11 cursor-pointer rounded-u-10 border font-display text-[15px] font-medium transition-colors duration-200 md:h-u-42 md:fs-u-15",
                                  startUtc === iso
                                    ? "border-electric bg-electric text-white"
                                    : "border-white/25 bg-white/[0.075] text-[#d2d4d9] hover:border-electric/60"
                                )}
                              >
                                {timeLabel(iso)}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="fs-u-14 text-mist">{t.slotsEmpty}</p>
                        )}
                      </div>

                      <p className="mt-u-27 font-display fs-u-12 font-semibold text-white">{t.infoTitle}</p>

                      <div className="mt-u-10 grid grid-cols-1 gap-u-8 sm:grid-cols-2">
                        <input name="name" required minLength={2} maxLength={120} autoComplete="name" placeholder={t.namePh} className={fieldClass} />
                        <input name="phone" maxLength={40} autoComplete="tel" placeholder={t.phonePh} className={fieldClass} />
                      </div>
                      <input
                        name="email"
                        type="email"
                        required
                        maxLength={200}
                        autoComplete="email"
                        placeholder={t.emailPh}
                        className={cn(fieldClass, "mt-u-9")}
                      />
                      <div className="relative mt-u-10">
                        <select
                          name="plan"
                          aria-label={t.planPh}
                          value={plan}
                          onChange={(e) => setPlan(e.target.value)}
                          className={cn(fieldClass, "cursor-pointer appearance-none pr-u-40", !plan && "text-white/45")}
                        >
                          <option value="" className="bg-abyss">{t.planPh}</option>
                          {PLANS.map((p) => (
                            <option key={p} value={p} className="bg-abyss">
                              {p.charAt(0).toUpperCase() + p.slice(1)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          aria-hidden
                          className="pointer-events-none absolute right-u-16 top-1/2 size-u-18 -translate-y-1/2 text-white"
                          strokeWidth={2}
                        />
                      </div>
                      <textarea
                        name="goals"
                        maxLength={1500}
                        placeholder={t.goalsPh}
                        className={cn(fieldClass, "mt-u-10 block h-u-100 resize-none py-u-12 leading-relaxed")}
                      />

                      {/* Honeypot anti-bots: fuera de pantalla y fuera del tab order */}
                      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                        <label>
                          website
                          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                        </label>
                      </div>

                      {(status === "error" || status === "taken") && (
                        <p className="mt-u-12 fs-u-14 text-[#ffd7e0]">
                          {status === "taken" ? (
                            t.errNoSlot
                          ) : (
                            <>
                              {t.errText}{" "}
                              <a href={`mailto:${EMAIL}`} className="font-semibold underline">
                                {EMAIL}
                              </a>
                            </>
                          )}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={!startUtc || status === "sending"}
                        className="mt-u-15 h-u-54 w-full cursor-pointer rounded-u-10 bg-electric font-display fs-u-17 font-semibold text-white transition-colors duration-300 hover:bg-[#2f5cff] disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {/* Con la rejilla paginada, la hora elegida puede quedar en otra
                            página: el botón la dice para que nadie reserve a ciegas. En
                            reposo (sin hora elegida) el texto es el del marco, tal cual. */}
                        {status === "sending"
                          ? t.sending
                          : startUtc
                            ? `${t.submit} · ${timeLabel(startUtc)}`
                            : t.submit}
                      </button>

                      {/* El marco pone esta nota en 10 px; `fs-u-*` tiene un suelo de 12 px a
                          propósito (legibilidad), así que se respeta el suelo y se fija la
                          caja de línea en los 15 del marco para no desplazar el fondo. */}
                      <p className="mt-u-12 text-center fs-u-12 lh-u-15 italic text-white/70">{t.note}</p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Fuera de la tarjeta a propósito: el marco no tiene este enlace, y
              metiéndolo dentro la tarjeta dejaría de medir los 654 del Figma. */}
          <p className="mx-auto mt-u-24 max-w-u-1192 text-center fs-u-13 text-mist">
            {t.messageInstead}{" "}
            <Link
              href="/contacto/mensaje"
              className="font-semibold text-white underline decoration-electric/60 underline-offset-4 transition-colors duration-200 hover:text-electric"
            >
              {t.messageInsteadCta}
            </Link>
          </p>
        </section>
      </main>

      <FinalCTA />
      <Footer />

      <ChatWidget />
      <VoiceWidget />
    </div>
  );
}
