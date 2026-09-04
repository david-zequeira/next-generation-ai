"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";
import type { RetellWebClient } from "retell-client-js-sdk";

/**
 * Suavizado exponencial (EMA). Con α = 0,2 el nivel tarda ~5 frames en llegar
 * al 67 % del valor nuevo: suficiente para que el orbe "respire" con la voz
 * sin temblar con cada pico de la forma de onda. Más alto y parpadea; más
 * bajo y el orbe va por detrás de lo que se oye.
 */
const EMA_ALPHA = 0.2;

/**
 * SUELO ABSOLUTO de silencio. Solo manda en salas realmente calladas; en las
 * demás manda el suelo de ruido ADAPTATIVO (ver `tick`). La primera versión
 * usaba únicamente este umbral fijo y falló en la primera prueba real: con el
 * control automático de ganancia (`autoGainControl`) el navegador amplifica
 * el ruido ambiente de cualquier habitación normal por encima de 0,04, así
 * que el detector creía que el visitante no callaba NUNCA, "pensando" no se
 * disparaba jamás y la interfaz se quedaba en "Te escucho" para siempre.
 *
 * Se compara con el valor YA suavizado: la cola del EMA añade ~200 ms de
 * decaimiento, y el medio segundo de silencio real acaba siendo ~700 ms de
 * reloj. Deliberado — cortar antes convertiría cualquier pausa entre dos
 * palabras en un cambio de estado.
 */
export const SILENCE_FLOOR = 0.04;

/**
 * Cuánto tiene que sobresalir la voz POR ENCIMA del ruido de la sala para
 * contar como habla. El ruido se estima en marcha (mínimo con fuga lenta), así
 * que el detector funciona igual en un estudio silencioso que en una oficina
 * con el aire acondicionado puesto — que es donde se hacen las demos.
 */
const SPEECH_DELTA = 0.07;

/**
 * Fuga del suelo de ruido, por frame (~0,012/s a 60 fps). Sube despacio para
 * que un monólogo largo no "contamine" la estimación (10 s de habla la suben
 * solo 0,12) y baja al instante vía `min()` en cuanto la sala calla.
 */
const NOISE_RISE = 0.0002;

/** Silencio continuado (ms) que hace falta para dar el turno por terminado. */
const SILENCE_MS = 500;

/**
 * Ventana en dBFS con la que se mapea el micrófono a 0..1. Voz normal de
 * sobremesa vive entre −45 y −20 dBFS; por debajo de −55 es ruido de sala.
 * Se usa escala logarítmica y no el RMS crudo porque el oído (y por tanto la
 * expectativa visual de quien mira el orbe) es logarítmico: con escala lineal
 * el orbe apenas se movería salvo al gritar.
 */
const USER_DB_FLOOR = -55;
const USER_DB_CEIL = -18;

const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n);

/** RMS (0..1) del micrófono → 0..1 perceptual. */
function normalizeUserRms(rms: number): number {
  if (!(rms > 0)) return 0; // también descarta NaN
  const db = 20 * Math.log10(rms);
  return clamp01((db - USER_DB_FLOOR) / (USER_DB_CEIL - USER_DB_FLOOR));
}

/** RMS de un bloque de muestras en el dominio del tiempo. */
function rmsOf(samples: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i];
  return samples.length > 0 ? Math.sqrt(sum / samples.length) : 0;
}

export type AudioLevels = {
  /** 0..1 suavizado del audio del AGENTE. */
  agentLevel: MotionValue<number>;
  /** 0..1 suavizado del MICRÓFONO del visitante. */
  userLevel: MotionValue<number>;
  /**
   * Abre el micrófono propio. Rechaza con la `DOMException` original del
   * navegador (`NotAllowedError` si el visitante deniega), que es justo lo que
   * `useVoiceCall` necesita para dar un mensaje distinto al genérico.
   */
  openMic: () => Promise<void>;
  /** Engancha el analizador del agente y arranca el bucle. Llamar en `call_ready`. */
  attach: (client: RetellWebClient) => void;
  /** Alimenta el camino de respaldo con las muestras del evento `audio` del SDK. */
  pushAgentSamples: (samples: Float32Array) => void;
  /** Con `false` el nivel del micro se lee como 0 (silenciado). */
  setMicMeasuring: (on: boolean) => void;
  /** Cierra TODO: rAF, pistas del micro y AudioContext. */
  stop: () => void;
};

/**
 * Niveles de audio de la llamada, listos para animar.
 *
 * Dos fuentes, las dos a 0..1 y suavizadas igual para que el orbe se comporte
 * igual hable quien hable:
 *
 * - **Agente**: `client.analyzerComponent.calculateVolume()` (propiedad pública
 *   del SDK 2.0.8, que por debajo es `createAudioAnalyser` de livekit-client y
 *   ya devuelve 0..1). Se relee EN CADA FRAME, no una vez al engancharse: el
 *   SDK emite `call_ready` una línea ANTES de asignar `analyzerComponent`, así
 *   que en el instante del evento la propiedad todavía es `undefined`. Si al
 *   frame siguiente sigue sin estar (deriva de versión del SDK), se cae al RMS
 *   del evento `audio`.
 * - **Usuario**: `getUserMedia` + `AnalyserNode` propios. El SDK no expone el
 *   nivel del micro por ningún sitio, y la pista local de LiveKit está en una
 *   propiedad privada que no vamos a tocar.
 *
 * Los valores se escriben en `MotionValue`s y NUNCA en estado de React: un
 * `setState` por frame re-renderizaría el overlay entero 60 veces por segundo
 * para mover un halo. Framer lee el `MotionValue` fuera del ciclo de React.
 *
 * Nada de esto sale del navegador: no se graba, no se envía, no se guarda.
 *
 * @param onUserPause se invoca UNA vez cada vez que el visitante deja de hablar
 *   (≥ 500 ms por debajo del umbral tras haber hablado). Es la señal con la que
 *   `useVoiceCall` infiere el estado "pensando", que el SDK no reporta.
 */
export function useAudioLevels(onUserPause?: () => void): AudioLevels {
  const agentLevel = useMotionValue(0);
  const userLevel = useMotionValue(0);

  const clientRef = useRef<RetellWebClient | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  // El genérico es obligatorio: desde TS 5.7 los TypedArray lo llevan y
  // `getFloatTimeDomainData` exige un buffer NO compartido, así que un
  // `Float32Array` a secas (= ArrayBufferLike) no vale como argumento.
  const bufRef = useRef<Float32Array<ArrayBuffer> | null>(null);

  /** Último RMS del evento `audio` — solo se usa si falta `calculateVolume`. */
  const agentRawRef = useRef(0);
  const agentEmaRef = useRef(0);
  const userEmaRef = useRef(0);
  const micMeasuringRef = useRef(true);

  /** Estado de la inferencia de pausa: ¿había hablado? ¿desde cuándo calla? */
  const spokeRef = useRef(false);
  const silenceSinceRef = useRef(0);
  /** Suelo de ruido estimado de la sala. `null` = aún sin primera medida. */
  const noiseRef = useRef<number | null>(null);

  // El callback se guarda en una ref para que el bucle de animación no
  // dependa de la identidad que React le dé en cada render (si no, habría que
  // recrear el rAF en cada render del overlay).
  const onPauseRef = useRef(onUserPause);
  useEffect(() => {
    onPauseRef.current = onUserPause;
  }, [onUserPause]);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    clientRef.current = null;
    analyserRef.current = null;
    bufRef.current = null;
    // Parar las pistas es lo que apaga el indicador de grabación del
    // navegador. Una pista huérfana tras colgar deja el punto rojo encendido,
    // que en una demo comercial se lee como software espía.
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    // close() devuelve una promesa; si el contexto ya estaba cerrado rechaza.
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    agentRawRef.current = 0;
    agentEmaRef.current = 0;
    userEmaRef.current = 0;
    spokeRef.current = false;
    silenceSinceRef.current = 0;
    noiseRef.current = null;
    micMeasuringRef.current = true;
    agentLevel.set(0);
    userLevel.set(0);
  }, [agentLevel, userLevel]);

  /** Un frame: lee las dos fuentes, suaviza, publica y vigila el silencio. */
  const tick = useCallback(() => {
    rafRef.current = requestAnimationFrame(tick);

    // --- Agente -------------------------------------------------------------
    // El typing del SDK declara `analyzerComponent` como si existiera siempre;
    // en realidad solo se crea al suscribirse la pista del agente (y solo con
    // `emitRawAudioSamples: true`). De ahí el tipo explícito con `undefined`.
    const comp: RetellWebClient["analyzerComponent"] | undefined =
      clientRef.current?.analyzerComponent;
    const agentRaw =
      comp && typeof comp.calculateVolume === "function"
        ? comp.calculateVolume() // ya viene normalizado 0..1
        : agentRawRef.current; // respaldo: RMS del evento `audio`
    agentEmaRef.current += EMA_ALPHA * (clamp01(agentRaw) - agentEmaRef.current);
    agentLevel.set(agentEmaRef.current);

    // --- Usuario ------------------------------------------------------------
    const analyser = analyserRef.current;
    const buf = bufRef.current;
    let userRaw = 0;
    if (micMeasuringRef.current && analyser && buf) {
      analyser.getFloatTimeDomainData(buf);
      userRaw = normalizeUserRms(rmsOf(buf));
    }
    userEmaRef.current += EMA_ALPHA * (userRaw - userEmaRef.current);
    userLevel.set(userEmaRef.current);

    // --- Inferencia de "ha terminado de hablar" -----------------------------
    // No hay evento del SDK para esto: Retell nos dice cuándo habla el AGENTE,
    // nunca cuándo calla el usuario. Se deduce del propio micro, CONTRA el
    // ruido de la sala y no contra un umbral fijo: el suelo de ruido es un
    // mínimo con fuga lenta (baja al instante cuando la sala calla, sube
    // despacio mientras se habla), y "hablar" es sobresalir SPEECH_DELTA por
    // encima de él. Con umbral fijo, el AGC del navegador ponía el ruido
    // ambiente por encima y el silencio no se detectaba nunca.
    const ema = userEmaRef.current;
    noiseRef.current = noiseRef.current === null ? ema : Math.min(ema, noiseRef.current + NOISE_RISE);
    const umbralHabla = Math.max(SILENCE_FLOOR, noiseRef.current + SPEECH_DELTA);
    if (ema > umbralHabla) {
      spokeRef.current = true;
      silenceSinceRef.current = 0;
    } else if (spokeRef.current) {
      const now = performance.now();
      if (silenceSinceRef.current === 0) {
        silenceSinceRef.current = now;
      } else if (now - silenceSinceRef.current >= SILENCE_MS) {
        // Se arma de nuevo solo cuando el visitante vuelva a hablar: así el
        // aviso sale una vez por turno y no una vez por frame.
        spokeRef.current = false;
        silenceSinceRef.current = 0;
        onPauseRef.current?.();
      }
    }
  }, [agentLevel, userLevel]);

  const openMic = useCallback(async () => {
    if (streamRef.current) return; // ya abierto: no se pide dos veces
    // En contexto no seguro `mediaDevices` ni siquiera existe. No es un error
    // que deba tumbar la llamada aquí: `useVoiceCall` ya avisa antes de llegar,
    // y sin medición del micro la llamada sigue siendo perfectamente usable.
    if (!navigator.mediaDevices?.getUserMedia) return;

    // Mismas restricciones que usa LiveKit para su propia captura. La
    // cancelación de eco es obligatoria: sin ella, la voz del agente que sale
    // por los altavoces vuelve a entrar por el micro y el nivel del "usuario"
    // se enciende justo cuando habla el agente.
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
      },
    });
    streamRef.current = stream;

    try {
      const Ctor =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) throw new Error("AudioContext no soportado");
      const ctx = new Ctor();
      ctxRef.current = ctx;
      // Los navegadores crean el contexto suspendido hasta que hay gesto del
      // usuario. Esto se llama desde el click, así que resume() sale gratis.
      void ctx.resume().catch(() => {});
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024; // ~21 ms de ventana a 48 kHz: reactivo sin ruido
      analyser.smoothingTimeConstant = 0; // el suavizado lo hacemos nosotros (EMA)
      ctx.createMediaStreamSource(stream).connect(analyser);
      analyserRef.current = analyser;
      bufRef.current = new Float32Array(analyser.fftSize);
    } catch {
      // Sin analizador no hay nivel de micro, pero la llamada no se cancela por
      // eso. Se sueltan las pistas para no dejar el indicador de grabación
      // encendido midiendo nada.
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      analyserRef.current = null;
      bufRef.current = null;
    }
  }, []);

  const attach = useCallback(
    (client: RetellWebClient) => {
      clientRef.current = client;
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
    },
    [tick],
  );

  const pushAgentSamples = useCallback((samples: Float32Array) => {
    // El evento `audio` NO es un flujo PCM continuo: es una instantánea del
    // analizador por animation frame (SDK 2.0.8, `captureAudioSamples`). Solo
    // vale para sacar un RMS puntual, nunca para reconstruir la señal.
    agentRawRef.current = clamp01(rmsOf(samples) * 4);
  }, []);

  const setMicMeasuring = useCallback((on: boolean) => {
    micMeasuringRef.current = on;
    if (!on) {
      // Silenciado: el orbe no debe seguir reaccionando a una voz que el
      // agente ya no oye, y la inferencia de pausa se desarma.
      spokeRef.current = false;
      silenceSinceRef.current = 0;
    }
  }, []);

  // Al desmontar (navegación), ni rAF ni micro pueden sobrevivir a la página.
  useEffect(() => stop, [stop]);

  return { agentLevel, userLevel, openMic, attach, pushAgentSamples, setMicMeasuring, stop };
}
