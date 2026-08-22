"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, PhoneOff } from "lucide-react";
import type { RetellWebClient } from "retell-client-js-sdk";
import { useDict } from "@/i18n/LocaleContext";
import { getSessionId } from "@/lib/session";
import { trackEvent } from "@/lib/track";

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "";

/**
 * Techo de espera del token. El mismo que REPLY_TIMEOUT_MS en el ChatWidget y
 * por el mismo motivo: el cold start del plan gratuito de Render ronda los
 * 40 s y sin techo el botón se quedaría "conectando" para siempre.
 */
const TOKEN_TIMEOUT_MS = 60_000;

/**
 * Estado de la llamada. "error" muestra el mensaje y vuelve solo a "idle":
 * el visitante siempre tiene el chat como plan B, nunca un error de consola.
 */
type CallState = "idle" | "connecting" | "in-call" | "error";

/**
 * Widget de voz, hermano del ChatWidget: mismo cerebro (ng-agent), misma
 * sessionId (voz, chat y atribución UTM se unen en la misma sesión).
 *
 * El navegador NUNCA ve la API key de Retell: pide a nuestro backend
 * (POST /api/voice/web-call) un access_token de un solo uso y entra en la
 * llamada con el SDK oficial `retell-client-js-sdk`
 * (docs.retellai.com/deploy/web-call: RetellWebClient, startCall({ accessToken }),
 * stopCall(), eventos call_started / call_ended / error).
 */
export default function VoiceWidget() {
  const t = useDict().voice;
  const [state, setState] = useState<CallState>("idle");
  const [errorText, setErrorText] = useState("");
  const clientRef = useRef<RetellWebClient | null>(null);
  const startedRef = useRef(false); // solo se mide voice_call_ended si hubo llamada

  /**
   * Generación de la llamada: cada start() y cada hangup() la incrementan.
   * Un flujo de start() en vuelo comprueba tras CADA await que su generación
   * sigue siendo la actual; si no, se retira sin tocar nada. Es lo que hace
   * imposible que dos start() solapados conecten dos llamadas, o que un
   * hangup() durante "conectando" deje una llamada viva en segundo plano.
   */
  const genRef = useRef(0);
  /** Aborta el fetch del token si el visitante cuelga mientras viaja. */
  const abortRef = useRef<AbortController | null>(null);
  /** Import del SDK cacheado: se paga una sola vez por pestaña. */
  const sdkRef = useRef<Promise<typeof import("retell-client-js-sdk")> | null>(null);

  // Al desmontar (navegación a otra página), la llamada no puede quedar viva.
  useEffect(() => {
    return () => {
      // Las refs aquí no apuntan a nodos de React: son el estado de la llamada
      // y mutarlas al desmontar es exactamente la intención (retirar el flujo
      // en vuelo y colgar), de ahí el disable.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      genRef.current++;
      abortRef.current?.abort();
      try {
        clientRef.current?.stopCall();
      } catch {
        // colgar en el desmontaje es best-effort
      }
    };
  }, []);

  if (!AGENT_URL) return null;

  const fail = (message: string) => {
    setErrorText(message);
    setState("error");
    // El aviso se retira solo: el botón vuelve a estar disponible.
    setTimeout(() => setState((s) => (s === "error" ? "idle" : s)), 8000);
  };

  const hangup = () => {
    genRef.current++; // retira cualquier start() aún en vuelo
    abortRef.current?.abort(); // corta el fetch del token si aún viaja
    abortRef.current = null;
    try {
      clientRef.current?.stopCall();
    } catch {
      // si el SDK ya cerró por su cuenta, no hay nada que colgar
    }
    clientRef.current = null;
    setState("idle");
  };

  const start = async () => {
    if (state !== "idle") return;
    abortRef.current?.abort(); // por si quedara un fetch huérfano de otro flujo
    genRef.current++;
    const gen = genRef.current;
    const cancelled = () => genRef.current !== gen;
    setState("connecting");

    // Un solo AbortController para colgar Y para el techo de espera, con el
    // mismo idioma (y el mismo techo) que el ChatWidget: cold start de Render.
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = setTimeout(() => controller.abort(), TOKEN_TIMEOUT_MS);

    try {
      // 1. El import del SDK arranca ANTES de pedir el token: el token es de
      //    un solo uso y caduca a los 30 s, así que no puede gastarse esperando
      //    la descarga del bundle de audio/WebRTC. Sigue siendo un import
      //    dinámico (no entra en el bundle de la página) y queda cacheado para
      //    que las llamadas siguientes no lo re-importen.
      sdkRef.current ??= import("retell-client-js-sdk");
      const sdkPromise = sdkRef.current;

      // 2. Token de un solo uso desde nuestro backend (valida plan y cuota).
      const res = await fetch(`${AGENT_URL}/api/voice/web-call`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: getSessionId() }),
        signal: controller.signal,
      });
      const data: { accessToken?: string; reply?: string } = await res.json().catch(() => ({}));
      if (cancelled()) return; // el visitante colgó mientras viajaba el token
      if (!res.ok || !data.accessToken) {
        // 429 (cuota) y 503 (sin voz / pausado) traen un texto humano del
        // backend que invita a seguir por el chat — ese es el que se muestra.
        fail(data.reply || t.error);
        return;
      }

      const { RetellWebClient: Client } = await sdkPromise;
      if (cancelled()) return;

      const client = new Client();
      clientRef.current = client;

      client.on("call_started", () => {
        if (cancelled()) {
          // El SDK conectó DESPUÉS de colgar: la llamada no puede quedar viva.
          try {
            client.stopCall();
          } catch {
            // ya estaba cerrada
          }
          return;
        }
        startedRef.current = true;
        setState("in-call");
        trackEvent("voice_call_started");
      });
      client.on("call_ended", () => {
        if (startedRef.current) {
          startedRef.current = false;
          trackEvent("voice_call_ended");
        }
        if (cancelled()) return; // ya hay otro flujo al mando del estado
        clientRef.current = null;
        setState("idle");
      });
      client.on("error", () => {
        // Sin esto, un error sin call_ended posterior dejaría startedRef
        // armado y la llamada SIGUIENTE mediría un voice_call_ended fantasma.
        startedRef.current = false;
        try {
          client.stopCall();
        } catch {
          // ya estaba cerrada
        }
        if (cancelled()) return;
        clientRef.current = null;
        fail(t.error);
      });

      // 3. Entrar en la llamada (pide permiso de micrófono al navegador).
      await client.startCall({ accessToken: data.accessToken });
      if (cancelled()) {
        // Colgaron mientras el SDK negociaba: se corta también aquí por si
        // el evento call_started de arriba no llegara a dispararse.
        try {
          client.stopCall();
        } catch {
          // ya estaba cerrada
        }
      }
    } catch {
      if (cancelled()) return; // colgar aborta el fetch: no es un error
      clientRef.current = null;
      fail(t.error);
    } finally {
      clearTimeout(timer);
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  const active = state === "connecting" || state === "in-call";

  return (
    <>
      {/* Botón flotante, a la izquierda del botón del chat */}
      <motion.button
        type="button"
        aria-label={active ? t.ariaHangup : t.ariaStart}
        onClick={() => (active ? hangup() : void start())}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed bottom-5 right-[5.5rem] z-[60] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-105 active:scale-95 ${
          active
            ? "bg-red-500/90 shadow-[0_0_40px_-6px_rgba(239,68,68,0.8)]"
            : "bg-gradient-to-br from-electric to-pulse shadow-[0_0_40px_-6px_rgba(46,107,255,0.9)] hover:shadow-[0_0_60px_-4px_rgba(46,107,255,1)]"
        }`}
      >
        {active ? (
          <PhoneOff className="h-6 w-6" strokeWidth={1.8} />
        ) : (
          <Phone className="h-6 w-6" strokeWidth={1.8} />
        )}
      </motion.button>

      {/* Tarjeta de estado: conectando / en llamada / error */}
      <AnimatePresence>
        {state !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass fixed bottom-[5.5rem] right-5 z-[61] w-[min(340px,calc(100vw-2.5rem))] overflow-hidden rounded-2xl"
            role="dialog"
            aria-label={t.ariaDialog}
          >
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-electric to-pulse font-display text-xs font-bold text-white">
                AI
                {state === "in-call" && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-abyss bg-emerald-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold text-frost">{t.headerName}</p>
                <p className="text-[11px] leading-snug text-mist">
                  {state === "connecting" && t.connecting}
                  {state === "in-call" && t.inCall}
                  {state === "error" && errorText}
                </p>
              </div>
              {/* Animación sutil de "en llamada": tres barras respirando */}
              {state === "in-call" && (
                <div className="flex items-end gap-1" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ scaleY: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
                      className="h-4 w-1 origin-bottom rounded-full bg-neon"
                    />
                  ))}
                </div>
              )}
              {state === "connecting" && (
                <div className="flex gap-1.5" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
                      className="h-1.5 w-1.5 rounded-full bg-neon"
                    />
                  ))}
                </div>
              )}
            </div>

            {active && (
              <div className="px-5 pb-3">
                <button
                  type="button"
                  onClick={hangup}
                  aria-label={t.ariaHangup}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition-colors hover:bg-red-500/20"
                >
                  <PhoneOff className="h-4 w-4" strokeWidth={1.8} />
                  {t.hangup}
                </button>
              </div>
            )}

            {/* Transparencia RGPD, como en el chat, con la grabación explícita.
                El texto definitivo lo cierra la Fase 7 (legal). */}
            <p className="border-t border-line px-4 py-2.5 text-[11px] leading-snug text-mist/60">
              {t.privacyNote}{" "}
              <Link
                href="/legal/privacidad"
                className="underline decoration-mist/30 underline-offset-2 transition-colors hover:text-frost"
              >
                {t.privacyLink}
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
