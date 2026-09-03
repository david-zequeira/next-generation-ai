"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { VoiceState } from "./useVoiceCall";

/**
 * Luz en los bordes de la pantalla (el patrón de Siri en iOS 18, que cambió
 * el orbe flotante por luz recorriendo el marco del dispositivo).
 *
 * Por qué: un orbe en el centro de una pantalla negra es un widget; una
 * pantalla cuyos bordes respiran con la voz es un dispositivo vivo. Es la
 * diferencia entre "una ventana con un logo" y "estás dentro".
 *
 * Dos capas, y solo dos:
 *  1. Un resplandor interior (`box-shadow: inset`) cuya OPACIDAD sigue el
 *     nivel de audio. La sombra es estática — animar la sombra en sí
 *     re-rasteriza cada frame; animar la opacidad es solo composición.
 *  2. Mientras el agente trabaja (conecta, piensa, consulta la agenda), un
 *     punto de luz recorre el marco: un `conic-gradient` enmascarado a 2 px
 *     cuyo ángulo de partida avanza cada frame. Se apaga al terminar: la luz
 *     que da vueltas siempre es ruido a los treinta segundos.
 *
 * Todo son tokens de `globals.css`. El rojo del error es la misma excepción
 * documentada en `VoiceOrb`.
 */

const EDGE_COLOR: Record<VoiceState, string> = {
  idle: "var(--color-electric)",
  connecting: "var(--color-electric)",
  listening: "var(--color-electric)",
  thinking: "var(--color-pulse)",
  tool: "var(--color-pulse)",
  speaking: "var(--color-neon)",
  ended: "var(--color-mist)",
  error: "rgba(248,113,113,0.85)",
};

/** Máscara que deja solo el borde de la caja: `padding` es el grosor. */
const BORDER_MASK = {
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude" as const,
};

type EdgeGlowProps = {
  state: VoiceState;
  /** 0–1, la misma fuente que pinta el orbe (micro o agente). */
  level: MotionValue<number>;
};

export default function EdgeGlow({ state, level }: EdgeGlowProps) {
  // Muelle más blando que el del orbe: el marco es grande, y si latiera con
  // cada consonante marearía. Sigue la voz, no la sílaba.
  const smooth = useSpring(level, { stiffness: 140, damping: 28 });
  const glowOpacity = useTransform(smooth, [0, 1], [0.16, 0.62]);

  const working = state === "connecting" || state === "thinking" || state === "tool";

  const color = EDGE_COLOR[state];

  // Ángulo del punto de luz. Framer reescribe el `background` entero cada
  // frame a partir del ángulo: es la vía idiomática (un MotionValue<string> en
  // una propiedad conocida) y evita registrar una variable CSS que el tipado
  // de MotionStyle no admite. No hace falta @property ni que el navegador
  // interpole nada.
  const angle = useMotionValue(0);
  useAnimationFrame((t) => {
    if (working) angle.set(((t / 4200) * 360) % 360);
  });
  const sweep = useTransform(
    angle,
    (a) => `conic-gradient(from ${a.toFixed(1)}deg, transparent 0%, ${color} 6%, transparent 14%)`
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      {/* Capa 1 — respiración del marco con el audio */}
      <motion.div
        className="absolute inset-0 transition-[box-shadow] duration-700"
        style={{
          opacity: glowOpacity,
          boxShadow: `inset 0 0 120px 14px ${color}`,
        }}
      />

      {/* Capa 2 — luz recorriendo el marco mientras trabaja */}
      {working && (
        <motion.div
          className="absolute inset-0"
          style={{
            ...BORDER_MASK,
            padding: "2px",
            background: sweep,
            filter: "blur(3px)",
            opacity: 0.95,
          }}
        />
      )}
    </div>
  );
}
