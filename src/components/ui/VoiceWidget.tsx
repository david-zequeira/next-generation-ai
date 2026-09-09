"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import VoiceOverlay from "@/components/voice/VoiceOverlay";
import { useVoiceCall } from "@/components/voice/useVoiceCall";
import { trackEvent } from "@/lib/track";

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "";

/**
 * Puerta de entrada al modo voz. Aquí ya no vive nada de la llamada: el
 * flujo (token, SDK, eventos, niveles de audio) está en `useVoiceCall` y lo
 * que se ve está en `VoiceOverlay`. Este componente solo hace dos cosas:
 * escuchar el evento `ng:open-voice` (lo lanzan «Ver demo» del hero y el
 * cierre) y arrancar la llamada DENTRO del gesto del usuario. No hay botón
 * flotante: el chat es el único lanzador fijo de la página.
 *
 * Ese último punto no es un detalle de estilo: `startAudioPlayback()` del
 * SDK y `getUserMedia` solo cuentan con el permiso de autoplay si se llaman
 * en la misma tarea que el clic. Si `start()` se disparase desde un efecto
 * del overlay recién montado, Safari e iOS podrían negar el audio.
 */
export default function VoiceWidget() {
  const [open, setOpen] = useState(false);
  const call = useVoiceCall();

  /**
   * Espejo síncrono de `open`. El guard NO puede ir dentro del updater de
   * `setOpen`: React puede ejecutar un updater dos veces (StrictMode), y ahí
   * dentro acabaríamos abriendo dos llamadas y midiendo dos aperturas.
   */
  const openRef = useRef(false);

  const openVoice = useCallback(() => {
    if (openRef.current) return;
    openRef.current = true;
    setOpen(true);
    trackEvent("voice_overlay_opened");
    call.start();
  }, [call]);

  // Espejo de `ng:open-chat`: cualquier CTA de la página puede abrir la voz
  // sin conocer este componente. Se despacha síncronamente desde el clic del
  // CTA, así que `start()` sigue dentro del gesto del usuario.
  //
  // El listener se registra UNA vez y llega a `openVoice` por ref: durante la
  // llamada este componente re-renderiza con cada transcripción, y con
  // `[openVoice]` en las deps estaríamos quitando y poniendo un listener del
  // window en cada una de ellas.
  const openVoiceRef = useRef(openVoice);
  useEffect(() => {
    openVoiceRef.current = openVoice;
  }, [openVoice]);
  useEffect(() => {
    const onOpen = () => openVoiceRef.current();
    window.addEventListener("ng:open-voice", onOpen);
    return () => window.removeEventListener("ng:open-voice", onOpen);
  }, []);

  // Medición del fallo, por CÓDIGO y no por texto: el mensaje está traducido
  // y cambia con el idioma y con cada retoque del diccionario; el código no.
  // `voice_call_failed_<código>` permite ver en el panel qué falla de verdad
  // (cuota, micro, backend caído…), y `voice_mic_denied` aparte porque es el
  // único caso con arreglo por parte del visitante: es la diferencia entre
  // "la voz no funciona" y "hay que explicar mejor el permiso".
  const failedRef = useRef(false);
  useEffect(() => {
    if (call.state !== "error") {
      failedRef.current = false;
      return;
    }
    if (failedRef.current) return;
    failedRef.current = true;
    trackEvent(`voice_call_failed_${call.errorCode ?? "unknown"}`);
    if (call.errorCode === "mic_denied") trackEvent("voice_mic_denied");
  }, [call.state, call.errorCode]);

  // Sin backend configurado no hay voz: el botón no existe (regla del sitio).
  // El return va DESPUÉS de los hooks para no alterar su orden entre renders.
  if (!AGENT_URL) return null;

  const close = () => {
    openRef.current = false;
    setOpen(false);
    call.hangup(); // idempotente: colgar dos veces no rompe nada
  };

  return (
    <>
      {/* Sin botón flotante: la voz se abre desde «Ver demo» del hero y desde el
          cierre («o llámanos»), que lanzan el evento ng:open-voice. */}
      <AnimatePresence>
        {open && <VoiceOverlay call={call} onClose={close} />}
      </AnimatePresence>
    </>
  );
}
