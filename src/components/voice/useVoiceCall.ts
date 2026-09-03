"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";
import type { RetellWebClient } from "retell-client-js-sdk";
import { useDict } from "@/i18n/LocaleContext";
import type { Dict } from "@/i18n/dictionaries";
import { getSessionId } from "@/lib/session";
import { trackEvent } from "@/lib/track";
import { useAudioLevels } from "./useAudioLevels";

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "";

/**
 * Techo de espera del token. El mismo que REPLY_TIMEOUT_MS en el ChatWidget y
 * por el mismo motivo: el cold start del plan gratuito de Render ronda los
 * 40 s y sin techo el overlay se quedaría "conectando" para siempre.
 */
const TOKEN_TIMEOUT_MS = 60_000;

/** El aviso de error se retira solo: el visitante siempre puede reintentar. */
const ERROR_RESET_MS = 8_000;

/**
 * Estados de la llamada (Fase 5.2). `thinking` y `tool` no existen como tales
 * en el SDK: el primero se infiere del micrófono y el segundo llega por el
 * evento `metadata` que manda nuestro backend. Sin ese metadata la interfaz
 * degrada sola a `thinking`, que es exactamente lo que está pasando.
 */
export type VoiceState =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "tool"
  | "speaking"
  | "ended"
  | "error";

/** Herramientas que tienen etiqueta propia en la interfaz. */
export type VoiceTool = "agenda" | "reserva";

/**
 * Causa del fallo. Se guarda el CÓDIGO y no el texto: así el mensaje se
 * resuelve en el render (y cambia si el visitante cambia de idioma), y quien
 * consume el hook puede distinguir "el micro está denegado" —que el visitante
 * puede arreglar— del resto sin comparar cadenas traducidas.
 */
export type VoiceErrorCode =
  // Códigos del backend (`{ error }` de POST /api/voice/web-call)
  | "rate_limited"
  | "quota_exhausted"
  | "voice_unconfigured"
  | "voice_not_in_plan"
  | "tenant_suspended"
  | "retell_error"
  // Derivados del status HTTP
  | "bad_request"
  | "not_found"
  | "unavailable"
  // Del navegador y del SDK
  | "network"
  | "sdk_error"
  | "mic_denied"
  | "insecure_context";

export type VoiceCall = {
  state: VoiceState;
  /** Mensaje ya listo para enseñar al usuario, o null. */
  error: string | null;
  /** Causa del fallo, para medir o ramificar sin mirar el texto. */
  errorCode: VoiceErrorCode | null;
  /** Herramienta en curso cuando state === "tool". */
  tool: VoiceTool | null;
  /** Última intervención del AGENTE, para el subtítulo. */
  transcript: string | null;
  muted: boolean;
  /** 0..1 suavizados, para animar el orbe. */
  agentLevel: MotionValue<number>;
  userLevel: MotionValue<number>;
  start: () => void;
  hangup: () => void;
  toggleMute: () => void;
};

/** Respuesta de POST /api/voice/web-call (contrato del backend). */
type WebCallResponse = {
  accessToken?: string;
  callId?: string;
  reply?: string;
  error?: string;
};

/** Códigos que el backend puede devolver en `error`. */
const BACKEND_CODES = [
  "rate_limited",
  "quota_exhausted",
  "voice_unconfigured",
  "voice_not_in_plan",
  "tenant_suspended",
  "retell_error",
] as const;

const isBackendCode = (value: string): value is VoiceErrorCode =>
  (BACKEND_CODES as readonly string[]).includes(value);

/** Status + `error` del backend → código propio. Nunca lanza. */
function codeFromResponse(status: number, raw: string | undefined): VoiceErrorCode {
  if (raw && isBackendCode(raw)) return raw;
  if (status === 400) return "bad_request";
  if (status === 404) return "not_found";
  if (status === 429) return "rate_limited"; // 429 sin código = límite de ritmo
  return "unavailable";
}

/**
 * Mensaje local por código. Solo se usa cuando el backend NO manda `reply`:
 * su texto ya viene redactado y en el idioma del tenant, así que siempre gana.
 */
function localMessage(t: Dict["voice"], code: VoiceErrorCode): string {
  switch (code) {
    case "mic_denied":
      return t.err.micDenied;
    case "insecure_context":
      return t.err.insecure;
    case "rate_limited":
      return t.err.rateLimited;
    case "sdk_error":
      // La llamada estaba en marcha y se ha cortado: no es "no puedo empezar".
      return t.err.generic;
    default:
      // El resto invita al chat, que es el plan B que siempre funciona.
      return t.error;
  }
}

/** Nombre de tool del backend → etiqueta de la interfaz. */
const TOOL_LABELS: Record<string, VoiceTool | undefined> = {
  consultar_disponibilidad: "agenda",
  crear_reserva: "reserva",
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;

/**
 * Última intervención del agente en el `transcript` del evento `update`
 * (últimos 5 turnos `{role, content}`). Todo llega por la red: cualquier forma
 * inesperada se ignora en silencio en vez de tumbar la llamada.
 */
/**
 * ¿La ÚLTIMA intervención del `update` es del visitante? Mientras habla, Retell
 * manda parciales con su turno al final; cuando el agente contesta, el final
 * pasa a ser del agente. Es la señal de "el visitante está hablando" según el
 * ASR DE VERDAD (el que oye el agente) — independiente de nuestro micrófono.
 */
function endsWithUserLine(payload: unknown): boolean {
  const turns = asRecord(payload)?.transcript;
  if (!Array.isArray(turns) || turns.length === 0) return false;
  const last = asRecord(turns[turns.length - 1]);
  return last?.role === "user" && typeof last.content === "string" && last.content.trim() !== "";
}

function lastAgentLine(payload: unknown): string | null {
  const turns = asRecord(payload)?.transcript;
  if (!Array.isArray(turns)) return null;
  for (let i = turns.length - 1; i >= 0; i--) {
    const turn = asRecord(turns[i]);
    if (!turn) continue;
    const { role, content } = turn;
    if ((role === "agent" || role === "assistant") && typeof content === "string") {
      const text = content.trim();
      if (text) return text;
    }
  }
  return null;
}

type VoiceMeta = { state: "tool"; tool: VoiceTool | null } | { state: "answering" };

/**
 * Evento `metadata`: nuestro backend manda `{state:"tool", tool:"<nombre>"}` al
 * empezar una herramienta y `{state:"answering"}` al acabarla
 * (`voice-retell.ts`, Fase 2.5). Retell reenvía el objeto al navegador; el
 * envoltorio exacto no está documentado, así que se acepta tanto anidado bajo
 * `metadata` como en la raíz. Una tool desconocida entra igual en el estado
 * `tool` pero sin etiqueta: mejor "trabajando" genérico que mentir.
 */
function readMeta(payload: unknown): VoiceMeta | null {
  const outer = asRecord(payload);
  if (!outer) return null;
  const inner = asRecord(outer.metadata) ?? outer;
  if (inner.state === "answering") return { state: "answering" };
  if (inner.state === "tool") {
    const name = typeof inner.tool === "string" ? inner.tool : "";
    return { state: "tool", tool: TOOL_LABELS[name] ?? null };
  }
  return null;
}

/**
 * Todo el flujo de una llamada de voz web: token, SDK, máquina de estados,
 * niveles de audio y limpieza. La interfaz (orbe, overlay, botones) no sabe
 * nada de Retell; solo lee este objeto.
 *
 * El navegador NUNCA ve la API key de Retell: pide a nuestro backend
 * (POST /api/voice/web-call) un access_token de un solo uso y entra en la
 * llamada con el SDK oficial `retell-client-js-sdk`
 * (docs.retellai.com/deploy/web-call).
 */
export function useVoiceCall(): VoiceCall {
  const t = useDict().voice;

  const [state, setStateRaw] = useState<VoiceState>("idle");
  const [errorCode, setErrorCode] = useState<VoiceErrorCode | null>(null);
  const [errorReply, setErrorReply] = useState<string | null>(null);
  const [tool, setTool] = useState<VoiceTool | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  /**
   * Espejo síncrono del estado. Los eventos del SDK llegan fuera del ciclo de
   * React y necesitan saber el estado ACTUAL, no el del render en el que se
   * registró el listener. Con una sola función que escribe los dos, no pueden
   * separarse.
   */
  const stateRef = useRef<VoiceState>("idle");
  const setState = useCallback((next: VoiceState) => {
    stateRef.current = next;
    setStateRaw(next);
  }, []);

  const clientRef = useRef<RetellWebClient | null>(null);
  /**
   * Temporizador de "el ASR dejó de transcribir al visitante" (segunda señal
   * de `thinking`, además del silencio del micro). Cada parcial de usuario lo
   * re-arma; si pasa un momento sin parciales nuevos y el agente sigue sin
   * hablar, el visitante ha terminado. Existe porque la señal del micrófono
   * puede fallar entera (analizador que no se pudo crear, sala imposible) y
   * la primera prueba real se quedó clavada en "Te escucho": esta señal viene
   * del ASR que de verdad oyó al visitante, así que no depende de nada local.
   */
  const asrPauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Solo se mide voice_call_ended si de verdad hubo llamada. */
  const startedRef = useRef(false);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  /**
   * El micrófono se ha callado medio segundo tras haber hablado y el agente
   * todavía no ha abierto la boca: eso es "pensando". Solo se acepta desde
   * `listening` — durante `speaking`, `tool` o `connecting` el silencio del
   * visitante no significa nada.
   */
  const onUserPause = useCallback(() => {
    if (stateRef.current === "listening") setState("thinking");
  }, [setState]);

  const {
    agentLevel,
    userLevel,
    openMic,
    attach: attachLevels,
    pushAgentSamples,
    setMicMeasuring,
    stop: stopLevels,
  } = useAudioLevels(onUserPause);

  const fail = useCallback(
    (code: VoiceErrorCode, reply?: string) => {
      setErrorCode(code);
      setErrorReply(reply?.trim() || null);
      setState("error");
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => {
        if (stateRef.current === "error") setState("idle");
      }, ERROR_RESET_MS);
    },
    [setState],
  );

  const hangup = useCallback(() => {
    genRef.current++; // retira cualquier start() aún en vuelo
    if (asrPauseTimerRef.current) clearTimeout(asrPauseTimerRef.current);
    abortRef.current?.abort(); // corta el fetch del token si aún viaja
    abortRef.current = null;
    const client = clientRef.current;
    clientRef.current = null;
    // El `call_ended` de este cliente ya no nos va a llegar (se retiran los
    // listeners justo debajo), así que la medición se cierra aquí mismo.
    if (startedRef.current) {
      startedRef.current = false;
      trackEvent("voice_call_ended");
    }
    // Sin esto, el cliente descartado sigue emitiendo hasta que el GC lo
    // recoja y sus listeners retienen el flujo entero de la llamada vieja
    // (fetch, temporizadores, closures) mientras tanto.
    client?.removeAllListeners();
    try {
      client?.stopCall();
    } catch {
      // si el SDK ya cerró por su cuenta, no hay nada que colgar
    }
    // Se para SIEMPRE, aunque no hubiera llegado a haber llamada: si el
    // visitante cuelga mientras conectaba, el micro ya estaba abierto y el
    // indicador de grabación del navegador se quedaría encendido.
    stopLevels();
    setTool(null);
    setMuted(false);
    // "ended" y no "idle": el overlay enseña "Llamada terminada" con su botón
    // de cerrar en vez de apagarse de golpe. Desde "idle" no hay nada que
    // terminar, y un error ya tiene su propio mensaje en pantalla.
    if (stateRef.current !== "idle" && stateRef.current !== "error") setState("ended");
  }, [setState, stopLevels]);

  const run = useCallback(async () => {
    // Se puede reintentar tras terminar o fallar; durante la llamada, no.
    const from = stateRef.current;
    if (from !== "idle" && from !== "ended" && from !== "error") return;

    if (!AGENT_URL) {
      fail("unavailable");
      return;
    }
    // Sin contexto seguro el navegador no da micrófono, punto: mejor decirlo
    // que dejar que el SDK falle con un genérico.
    if (!window.isSecureContext) {
      fail("insecure_context");
      return;
    }

    abortRef.current?.abort(); // por si quedara un fetch huérfano de otro flujo
    genRef.current++;
    const gen = genRef.current;
    const cancelled = () => genRef.current !== gen;

    setErrorCode(null);
    setErrorReply(null);
    setTool(null);
    setTranscript(null);
    setMuted(false);
    setState("connecting");

    // Un solo AbortController para colgar Y para el techo de espera, con el
    // mismo idioma (y el mismo techo) que el ChatWidget: cold start de Render.
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = setTimeout(() => controller.abort(), TOKEN_TIMEOUT_MS);

    try {
      // 1. El import del SDK arranca ANTES de nada: el token es de un solo uso
      //    y caduca a los 30 s, así que no puede gastarse esperando la descarga
      //    del bundle de audio/WebRTC. Sigue siendo un import dinámico (no
      //    entra en el bundle de la página) y queda cacheado para que las
      //    llamadas siguientes no lo re-importen.
      sdkRef.current ??= import("retell-client-js-sdk");
      const sdkPromise = sdkRef.current;

      // 2. Micrófono ANTES del token, por dos motivos. Uno: el diálogo de
      //    permiso lo contesta una persona y puede tardar más que los 30 s de
      //    vida del token. Dos: pedirlo nosotros es la única forma de saber que
      //    lo han DENEGADO — el SDK se traga el NotAllowedError de getUserMedia
      //    y emite su `error` genérico. Como el permiso ya queda concedido,
      //    la petición posterior del SDK no vuelve a preguntar.
      try {
        await openMic();
      } catch (err) {
        const name = err instanceof DOMException ? err.name : "";
        if (name === "NotAllowedError" || name === "SecurityError") {
          fail("mic_denied");
          return;
        }
        // Cualquier otro fallo (sin micro, dispositivo ocupado) no cancela: el
        // SDK lo intentará por su cuenta y, si tampoco puede, emitirá `error`.
        // Solo perdemos el nivel del micro para el orbe.
      }
      if (cancelled()) return;

      // 3. Token de un solo uso desde nuestro backend (valida plan y cuota).
      const res = await fetch(`${AGENT_URL}/api/voice/web-call`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: getSessionId() }),
        signal: controller.signal,
      });
      const data: WebCallResponse = await res.json().catch(() => ({}));
      if (cancelled()) return; // el visitante colgó mientras viajaba el token
      if (!res.ok || !data.accessToken) {
        // El `reply` del backend ya está redactado para una persona y en el
        // idioma del tenant: gana siempre al texto local.
        fail(codeFromResponse(res.status, data.error), data.reply);
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
        trackEvent("voice_call_started");
        // Sigue en "connecting": hasta `call_ready` no hay audio del agente y
        // enseñar "te escucho" antes sería mentir.
      });

      // `call_ready` = la pista de audio del agente está suscrita. Es el evento
      // que el propio SDK documenta para quitar la animación de carga.
      client.on("call_ready", () => {
        if (cancelled()) return;
        attachLevels(client);
        setState("listening");
      });

      client.on("agent_start_talking", () => {
        if (cancelled()) return;
        setTool(null);
        setState("speaking");
      });

      client.on("agent_stop_talking", () => {
        if (cancelled()) return;
        setState("listening");
      });

      client.on("update", (payload: unknown) => {
        if (cancelled()) return;
        const line = lastAgentLine(payload);
        // Solo la última del agente y sin historial: esto es un subtítulo, no
        // un chat. Nada se guarda en el navegador.
        if (line) setTranscript(line);

        // Señal 2 de "pensando": los parciales del ASR. Mientras el visitante
        // habla llegan updates acabados en su turno; cada uno re-arma el
        // plazo. 900 ms sin parcial nuevo y sin que el agente haya empezado a
        // hablar = ha terminado. Los 900 ms son más largos que el medio
        // segundo del micro a propósito: el ASR agrupa palabras y sus
        // parciales llegan más espaciados que los frames de audio.
        if (endsWithUserLine(payload) && stateRef.current === "listening") {
          if (asrPauseTimerRef.current) clearTimeout(asrPauseTimerRef.current);
          asrPauseTimerRef.current = setTimeout(() => {
            if (stateRef.current === "listening") setState("thinking");
          }, 900);
        }
      });

      client.on("metadata", (payload: unknown) => {
        if (cancelled()) return;
        const meta = readMeta(payload);
        if (!meta) return; // clave desconocida: se ignora, jamás rompe
        if (meta.state === "tool") {
          setTool(meta.tool);
          setState("tool");
        } else {
          setTool(null);
          // La tool terminó y el modelo está redactando la respuesta.
          if (stateRef.current === "tool") setState("thinking");
        }
      });

      // Camino de respaldo del nivel del agente (ver useAudioLevels).
      client.on("audio", (samples: Float32Array) => {
        // Un cliente viejo que siga emitiendo no puede mover el orbe de la
        // llamada nueva: el nivel del agente es una ref compartida.
        if (cancelled()) return;
        pushAgentSamples(samples);
      });

      client.on("call_ended", () => {
        if (startedRef.current) {
          startedRef.current = false;
          trackEvent("voice_call_ended");
        }
        stopLevels();
        if (cancelled()) return; // ya hay otro flujo al mando del estado
        clientRef.current = null;
        setTool(null);
        setState("ended");
      });

      client.on("error", () => {
        // Sin esto, un error sin call_ended posterior dejaría startedRef
        // armado y la llamada SIGUIENTE mediría un voice_call_ended fantasma.
        startedRef.current = false;
        client.removeAllListeners();
        try {
          client.stopCall();
        } catch {
          // ya estaba cerrada
        }
        stopLevels();
        if (cancelled()) return;
        clientRef.current = null;
        // El string del SDK es de depuración ("Error starting call") y no se
        // enseña: no está traducido y no le dice nada a quien llama.
        fail("sdk_error");
      });

      // 4. Entrar en la llamada. `emitRawAudioSamples` es lo que hace que el
      //    SDK cree su analizador del agente (y, de paso, emita `audio`): sin
      //    él no hay nivel con el que animar el orbe.
      await client.startCall({ accessToken: data.accessToken, emitRawAudioSamples: true });
      if (cancelled()) {
        // Colgaron mientras el SDK negociaba: se corta también aquí por si
        // el evento call_started de arriba no llegara a dispararse.
        try {
          client.stopCall();
        } catch {
          // ya estaba cerrada
        }
        return;
      }

      // 5. Desbloquear la reproducción. Va DESPUÉS de startCall porque por
      //    dentro es `room.startAudio()` y la sala no existe hasta entonces.
      //    Sigue estando en la misma tarea que el clic, que es lo que exige la
      //    política de autoplay — crítico en Safari/iOS, donde sin esto la
      //    llamada conecta y no se oye nada.
      try {
        await client.startAudioPlayback();
      } catch {
        // Best-effort: si el navegador lo niega, la llamada sigue en pie y el
        // audio suele desbloquearse al primer toque del visitante.
      }
    } catch (err) {
      if (cancelled()) return; // colgar aborta el fetch: no es un error
      clientRef.current = null;
      stopLevels();
      // AbortError aquí solo puede ser el techo de espera (colgar ya salió por
      // `cancelled`): el backend no contestó a tiempo.
      const aborted = err instanceof DOMException && err.name === "AbortError";
      fail(aborted ? "unavailable" : "network");
    } finally {
      clearTimeout(timer);
      if (abortRef.current === controller) abortRef.current = null;
    }
  }, [attachLevels, fail, openMic, pushAgentSamples, setState, stopLevels]);

  // `start` es síncrono a propósito: se llama desde el onClick y el flujo
  // asíncrono arranca dentro del mismo gesto del usuario.
  const start = useCallback(() => {
    void run();
  }, [run]);

  const toggleMute = useCallback(() => {
    const client = clientRef.current;
    if (!client) return;
    const next = !muted;
    try {
      if (next) client.mute();
      else client.unmute();
    } catch {
      return; // si el SDK no puede, el botón no miente sobre su estado
    }
    setMuted(next);
    // El nivel del micro deja de medirse: el orbe no puede reaccionar a una
    // voz que el agente ya no oye, ni inferir "pensando" con ella.
    setMicMeasuring(!next);
  }, [muted, setMicMeasuring]);

  // Al desmontar (navegación a otra página), la llamada no puede quedar viva.
  useEffect(() => {
    return () => {
      // Las refs aquí no apuntan a nodos de React: son el estado de la llamada
      // y mutarlas al desmontar es exactamente la intención (retirar el flujo
      // en vuelo y colgar), de ahí el disable.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      genRef.current++;
      abortRef.current?.abort();
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      if (asrPauseTimerRef.current) clearTimeout(asrPauseTimerRef.current);
      if (startedRef.current) {
        startedRef.current = false;
        trackEvent("voice_call_ended");
      }
      clientRef.current?.removeAllListeners();
      try {
        clientRef.current?.stopCall();
      } catch {
        // colgar en el desmontaje es best-effort
      }
      clientRef.current = null;
      stopLevels();
    };
  }, [stopLevels]);

  // El mensaje se resuelve en el render, no al fallar: si el visitante cambia
  // de idioma con el aviso en pantalla, el aviso cambia con él.
  const error =
    state === "error" && errorCode ? (errorReply ?? localMessage(t, errorCode)) : null;

  // Se memoiza el objeto entero porque quien consume el hook lo mete en las
  // dependencias de sus propios efectos y callbacks (`[call]`): un literal
  // nuevo en cada render le obligaría a re-suscribir listeners por nada.
  return useMemo<VoiceCall>(
    () => ({
      state,
      error,
      errorCode: state === "error" ? errorCode : null,
      tool,
      transcript,
      muted,
      agentLevel,
      userLevel,
      start,
      hangup,
      toggleMute,
    }),
    [
      state,
      error,
      errorCode,
      tool,
      transcript,
      muted,
      agentLevel,
      userLevel,
      start,
      hangup,
      toggleMute,
    ],
  );
}
