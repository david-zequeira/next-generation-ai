"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone } from "lucide-react";
import VoiceOverlay from "@/components/voice/VoiceOverlay";
import { useVoiceCall } from "@/components/voice/useVoiceCall";
import { useDict } from "@/i18n/LocaleContext";
import { trackEvent } from "@/lib/track";
import { warmUpVoice } from "@/lib/voice-warmup";

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "";

/**
 * Lanzador flotante del modo voz. Aquí ya no vive nada de la llamada: el
 * flujo (token, SDK, eventos, niveles de audio) está en `useVoiceCall` y lo
 * que se ve está en `VoiceOverlay`. Este componente solo hace tres cosas:
 * el botón, el evento `ng:open-voice`, y arrancar la llamada DENTRO del
 * gesto del usuario.
 *
 * Ese último punto no es un detalle de estilo: `startAudioPlayback()` del
 * SDK y `getUserMedia` solo cuentan con el permiso de autoplay si se llaman
 * en la misma tarea que el clic. Si `start()` se disparase desde un efecto
 * del overlay recién montado, Safari e iOS podrían negar el audio.
 */
export default function VoiceWidget() {
  const t = useDict().voice;
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
      {/* Botón flotante, a la izquierda del botón del chat */}
      <motion.button
        type="button"
        aria-label={t.ariaStart}
        onClick={openVoice}
        onPointerEnter={warmUpVoice}
        onFocus={warmUpVoice}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-5 right-[5.5rem] z-[60] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-electric to-pulse text-white shadow-[0_0_40px_-6px_rgba(46,107,255,0.9)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_-4px_rgba(46,107,255,1)] active:scale-95"
      >
        <Phone className="h-6 w-6" strokeWidth={1.8} />
      </motion.button>

      <AnimatePresence>
        {open && <VoiceOverlay call={call} onClose={close} />}
      </AnimatePresence>
    </>
  );
}
