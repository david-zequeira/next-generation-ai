"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mic, MicOff, MessageCircle, PhoneOff, X } from "lucide-react";
import { useDict } from "@/i18n/LocaleContext";
import EdgeGlow from "./EdgeGlow";
import VoiceOrb from "./VoiceOrb";
import type { VoiceCall } from "./useVoiceCall";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Selector de lo enfocable dentro del diálogo. Lo usa la trampa de foco: sin
 * ella, tabular desde el overlay lleva al fondo (navbar, CTAs de la página)
 * que sigue montado detrás y es invisible — con lector de pantalla, el
 * visitante se pierde en una página que ya no está mirando.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

type VoiceOverlayProps = {
  call: VoiceCall;
  /** Cierra el overlay. No cuelga: de eso se encarga quien lo monta. */
  onClose: () => void;
};

/**
 * Modo voz a pantalla completa. NO es un chat: no hay historial, ni scroll,
 * ni caja de texto. Solo el orbe, en qué está el agente y cómo colgar — el
 * momento estrella de la demo comercial se juega en la atención, y una lista
 * de mensajes la reparte.
 *
 * Nada de la llamada se guarda en el navegador (ni audio, ni transcripción):
 * lo que se ve es la última intervención del agente y desaparece con ella.
 */
export default function VoiceOverlay({ call, onClose }: VoiceOverlayProps) {
  const t = useDict().voice;
  const rootRef = useRef<HTMLDivElement>(null);
  const hangupRef = useRef<HTMLButtonElement>(null);

  const { state, error, tool, transcript } = call;
  const finished = state === "ended" || state === "error";

  // El foco entra en "Colgar": es la acción que el visitante puede necesitar
  // con urgencia (está sonando su micrófono) y debe estar a un Enter.
  useEffect(() => {
    hangupRef.current?.focus();
  }, []);

  // El fondo no debe poder desplazarse detrás de un diálogo a pantalla
  // completa: en iOS el "rubber band" arrastraría la página bajo el overlay.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // El handler de teclado se registra UNA vez y lee siempre la última versión
  // por ref: `call` es un objeto nuevo en cada render, y meterlo en las deps
  // re-suscribiría el listener del documento a 60 fps mientras habla el orbe.
  const onKeyRef = useRef<(e: KeyboardEvent) => void>(() => {});
  useEffect(() => {
    onKeyRef.current = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        // Escape cuelga. Si ya no hay llamada que colgar, cierra: pedir dos
        // pulsaciones para salir de una pantalla completa es una trampa.
        if (finished) onClose();
        else call.hangup();
        return;
      }
      if (e.key !== "Tab") return;

      const root = rootRef.current;
      if (!root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const outside = !active || !root.contains(active);

      if (e.shiftKey && (outside || active === first)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (outside || active === last)) {
        e.preventDefault();
        first.focus();
      }
    };
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => onKeyRef.current(e);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /**
   * Línea de estado. El caso `error` enseña el texto que ya trae el hook (el
   * backend manda mensajes humanos en 429/503 e invitan al chat); nunca un
   * código ni un "algo salió mal".
   */
  const status = (() => {
    switch (state) {
      case "connecting":
        return t.statusConnecting;
      case "listening":
        return t.statusListening;
      case "thinking":
        return t.statusThinking;
      case "tool":
        // Sin el `metadata` del backend, `tool` no llega nunca y esto degrada
        // solo a "Pensando…" — el overlay no depende de esa fase.
        if (tool === "agenda") return t.statusToolAgenda;
        if (tool === "reserva") return t.statusToolReserva;
        return t.statusThinking;
      case "speaking":
        return t.statusSpeaking;
      case "ended":
        return t.statusEnded;
      case "error":
        return error ?? t.error;
      default:
        return t.statusConnecting;
    }
  })();

  // El nivel que pinta el orbe cambia de fuente según quién tiene la palabra:
  // escuchando late con el micro del visitante, hablando con el audio del
  // agente. Es lo que hace que el orbe se sienta "vivo" y no un spinner.
  const level = state === "listening" ? call.userLevel : call.agentLevel;

  return (
    <motion.div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.ariaOverlay}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      // 100dvh y no 100vh: en iOS Safari la barra de direcciones se come los
      // últimos 60 px de 100vh y los controles quedarían fuera de pantalla.
      className="fixed inset-0 z-[70] flex h-[100dvh] flex-col bg-void/95 backdrop-blur-2xl"
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      {/* Etalonaje: la misma viñeta radial del hero, para que el modo voz se
          sienta parte del sitio y no una ventana del sistema. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,107,255,0.10)_0%,transparent_62%)]"
      />

      {/* Los bordes de la pantalla respiran con la voz (patrón Siri iOS 18).
          Va detrás de todo lo interactivo (z-0 frente a z-10). */}
      <EdgeGlow state={state} level={level} />

      {/* Cabecera: el lockup manda: "estás hablando CON Asenix", no con un
          widget genérico. <img> + basePath, como el Navbar (sin next/image:
          el sitio es export estático). */}
      <header className="relative z-10 flex items-center justify-between px-2 md:px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${BASE_PATH}/logo-lockup.png`}
          alt="Asenix"
          className="h-7 w-auto"
        />
        {finished && (
          <button
            type="button"
            onClick={onClose}
            aria-label={t.ariaClose}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-line text-mist transition-colors hover:border-neon/40 hover:text-frost"
          >
            <X className="h-5 w-5" strokeWidth={1.8} />
          </button>
        )}
      </header>

      {/* Cuerpo: orbe + estado + subtítulo, centrados */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        <VoiceOrb state={state} level={level} />

        {/* aria-live: quien no ve el orbe se entera igual de que el agente
            está pensando o consultando la agenda. */}
        <p
          aria-live="polite"
          className="font-display text-lg font-medium tracking-tight text-frost md:text-xl"
        >
          {status}
        </p>

        {/* Subtítulo: SOLO la última intervención del agente. Sin historial:
            esto no es un chat. */}
        <p
          aria-live="polite"
          className="min-h-[3.5rem] max-w-xl text-balance text-sm leading-relaxed text-mist md:text-base"
        >
          {state === "speaking" ? transcript : null}
        </p>
      </div>

      {/* Controles */}
      <footer className="relative z-10 flex flex-col items-center gap-5 px-4 pb-2">
        <div className="flex items-center gap-4">
          {!finished && (
            <button
              type="button"
              onClick={call.toggleMute}
              aria-label={call.muted ? t.ariaUnmute : t.ariaMute}
              aria-pressed={call.muted}
              className={`flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border transition-colors ${
                call.muted
                  ? "border-neon/40 bg-neon/10 text-neon"
                  : "border-line bg-space/60 text-frost hover:border-neon/40"
              }`}
            >
              {call.muted ? (
                <MicOff className="h-5 w-5" strokeWidth={1.8} />
              ) : (
                <Mic className="h-5 w-5" strokeWidth={1.8} />
              )}
            </button>
          )}

          <button
            ref={hangupRef}
            type="button"
            onClick={finished ? onClose : call.hangup}
            aria-label={finished ? t.ariaClose : t.ariaHangup}
            className="flex h-14 cursor-pointer items-center justify-center gap-2.5 rounded-full border border-red-500/40 bg-red-500/15 px-7 text-sm font-medium text-red-200 transition-colors hover:bg-red-500/25"
          >
            <PhoneOff className="h-5 w-5" strokeWidth={1.8} />
            {finished ? t.close : t.hangup}
          </button>

          {/* La voz puede fallar (cuota, plan, micrófono): el chat es el plan B
              y tiene que estar a un clic, no en el botón flotante de detrás. */}
          {state === "error" && (
            <button
              type="button"
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent("ng:open-chat"));
              }}
              aria-label={t.openChat}
              className="flex h-14 cursor-pointer items-center justify-center gap-2.5 rounded-full border border-line bg-space/60 px-7 text-sm font-medium text-frost transition-colors hover:border-neon/40"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
              {t.openChat}
            </button>
          )}
        </div>

        {/* Transparencia RGPD, palabra por palabra la del widget anterior: la
            grabación es explícita y el enlace apunta a la sección del agente
            de voz de la política. */}
        <p className="max-w-md text-center text-[11px] leading-snug text-mist/60">
          {t.privacyNote}{" "}
          <Link
            href="/legal/privacidad#agente-de-voz"
            className="underline decoration-mist/30 underline-offset-2 transition-colors hover:text-frost"
          >
            {t.privacyLink}
          </Link>
        </p>
      </footer>
    </motion.div>
  );
}
