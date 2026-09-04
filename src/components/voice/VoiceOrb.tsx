"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import type { VoiceState } from "./useVoiceCall";

/** El export estático sirve bajo un basePath: las rutas de /public lo llevan delante. */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Paleta por estado. Todo son tokens de `globals.css` (@theme): el orbe es
 * marca, no decoración, y un hex suelto aquí sería el primer color del sitio
 * que deja de seguir al tema. El rojo del error es la única excepción y va
 * en rgb() suave a propósito — no existe token de error y no queremos crear
 * uno solo para el orbe.
 */
type Palette = {
  /** Halo exterior — el que responde al nivel de audio. */
  halo: string;
  /** Capa media, en órbita. */
  mid: string;
  /** Capa interior, en órbita inversa. */
  inner: string;
};

const PALETTES: Record<VoiceState, Palette> = {
  idle: {
    halo: "var(--color-electric)",
    mid: "var(--color-pulse)",
    inner: "var(--color-neon)",
  },
  connecting: {
    halo: "var(--color-electric)",
    mid: "var(--color-neon)",
    inner: "var(--color-pulse)",
  },
  // Escuchando: azul de marca. El nivel viene del micrófono.
  listening: {
    halo: "var(--color-electric)",
    mid: "var(--color-electric)",
    inner: "var(--color-neon)",
  },
  // Pensando / usando una tool: violeta + shimmer, para que se lea "trabajando".
  thinking: {
    halo: "var(--color-pulse)",
    mid: "var(--color-pulse)",
    inner: "var(--color-electric)",
  },
  tool: {
    halo: "var(--color-pulse)",
    mid: "var(--color-pulse)",
    inner: "var(--color-neon)",
  },
  // Hablando: cian. El nivel viene del audio del agente, así que el orbe
  // "articula" lo que se está oyendo.
  speaking: {
    halo: "var(--color-neon)",
    mid: "var(--color-neon)",
    inner: "var(--color-electric)",
  },
  // Colgado: se apaga a gris de marca.
  ended: {
    halo: "var(--color-mist)",
    mid: "var(--color-mist)",
    inner: "var(--color-mist)",
  },
  error: {
    halo: "rgba(248,113,113,0.85)",
    mid: "rgba(248,113,113,0.6)",
    inner: "rgba(248,113,113,0.45)",
  },
};

/** Opacidad global del orbe por estado: apagarse es un estado, no un bug. */
const BODY_OPACITY: Record<VoiceState, number> = {
  idle: 0.7,
  connecting: 0.85,
  listening: 1,
  thinking: 0.95,
  tool: 0.95,
  speaking: 1,
  ended: 0.35,
  error: 0.8,
};

/**
 * Anillos en órbita: el motivo del isotipo, sacado del logo.
 *
 * La elipse que cruza la "A" de Asenix ES una órbita (manual de marca: "la
 * curva es fluidez, del dato a la acción"). Aquí se extiende hacia fuera: dos
 * planos orbitales inclinados, cada uno con un punto de luz que lo RECORRE
 * —no un anillo que gira sobre sí mismo, que se lee como un spinner— y el
 * grosor y el brillo del trazo siguiendo el audio. Es la versión 2D de los dos
 * anillos de `AICore` en el hero: el modo voz es el mismo objeto que el
 * visitante acaba de ver arriba, ahora escuchándole.
 *
 * El recorrido del punto va por CSS `offset-path` sobre el propio trazado de
 * la elipse (`@keyframes orbit-path` en globals.css): así el bloque global de
 * prefers-reduced-motion lo detiene solo, sin lógica aquí.
 */
function OrbitRings({
  level,
  palette,
  frozen,
}: {
  level: MotionValue<number>;
  palette: Palette;
  frozen: boolean;
}) {
  const width = useTransform(level, [0, 1], [0.9, 2.6]);
  const ringOpacity = useTransform(level, [0, 1], [0.35, 0.85]);
  const satR = useTransform(level, [0, 1], [1.9, 3.6]);

  /** Elipse centrada en (50,50) como path, para que `offset-path` la recorra. */
  const ellipsePath = (rx: number, ry: number): string =>
    `M ${50 - rx} 50 a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`;

  const rings: { tilt: number; rx: number; ry: number; dur: string; reverse: boolean }[] = [
    { tilt: -24, rx: 46, ry: 15, dur: "5.2s", reverse: false },
    { tilt: 54, rx: 43, ry: 9, dur: "7.8s", reverse: true },
  ];

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className="absolute inset-[-10%] h-[120%] w-[120%] overflow-visible"
    >
      {rings.map((r) => (
        <g key={r.tilt} transform={`rotate(${r.tilt} 50 50)`}>
          <motion.ellipse
            cx="50"
            cy="50"
            rx={r.rx}
            ry={r.ry}
            fill="none"
            stroke={palette.inner}
            style={{
              strokeWidth: frozen ? 1.2 : width,
              opacity: frozen ? 0.5 : ringOpacity,
            }}
            className="transition-[stroke] duration-700"
          />
          {/* El punto de luz. `offsetPath` en user units del <g> inclinado:
              recorre la elipse ya rotada. Bajo reduced motion se queda quieto
              en el arranque del trazado, sin desaparecer. */}
          <motion.circle
            r={frozen ? 2.2 : satR}
            fill={palette.halo}
            className="animate-orbit-path"
            style={{
              offsetPath: `path("${ellipsePath(r.rx, r.ry)}")`,
              offsetRotate: "0deg",
              animationDuration: r.dur,
              animationDirection: r.reverse ? "reverse" : "normal",
              filter: `drop-shadow(0 0 5px ${palette.halo})`,
            }}
          />
        </g>
      ))}
    </svg>
  );
}

type VoiceOrbProps = {
  state: VoiceState;
  /** 0–1 ya normalizado por `useAudioLevels` (micro o agente, según el estado). */
  level: MotionValue<number>;
  className?: string;
};

/**
 * El orbe: "Asenix en versión IA". 2D a propósito — el overlay se abre en
 * móviles viejos y en la pantalla compartida de una demo, y ahí un canvas
 * WebGL es un riesgo (el orbe 3D sobre `AICore` queda diferido en el plan).
 *
 * Tres capas de `radial-gradient` desenfocadas, desfasadas y en órbita lenta,
 * más un disco nítido central con el isotipo: el desenfoque es lo que hace
 * que tres círculos parezcan una sola masa de luz viva.
 *
 * El audio entra por `level` como MotionValue y NUNCA pasa por el estado de
 * React: un `setState` a 60 fps re-renderizaría el overlay entero. Es el
 * mismo patrón que `AICore` con `dissolve`.
 */
export default function VoiceOrb({ state, level, className }: VoiceOrbProps) {
  // `MotionConfig reducedMotion="user"` ya frena los transforms animados de
  // Framer, pero necesitamos saberlo aquí para no *derivar* escala del audio:
  // eso no es una animación declarativa, es un valor que Framer no filtra.
  //
  // OJO con la hidratación: `useReducedMotion()` vale `null` en el servidor y
  // un booleano en el cliente. Si el render dependiera de él directamente, el
  // HTML del servidor y el primer render del cliente NO coincidirían para
  // quien tenga "reducir movimiento" activado, y React avisa de que el árbol
  // se hidrató con atributos distintos. Por eso se espera a estar montado: el
  // primer render del cliente es idéntico al del servidor y la preferencia se
  // aplica justo después, sin que nadie llegue a ver la escala animada.
  const reduced = useReducedMotion();
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  const congelarEscala = montado && reduced === true;

  // Muelle idéntico al del plan: 220/22 suaviza el RMS (que es ruidoso por
  // naturaleza) sin meter retardo perceptible entre voz e imagen.
  const smooth = useSpring(level, { stiffness: 220, damping: 22 });
  const scale = useTransform(smooth, [0, 1], [1, 1.18]);
  const haloOpacity = useTransform(smooth, [0, 1], [0.35, 0.9]);

  const palette = PALETTES[state];
  const shimmering = state === "thinking" || state === "tool";
  const connecting = state === "connecting";

  // Inclinación del disco con el puntero, como el núcleo del hero sigue al
  // ratón: pocos grados, con muelle. En táctil no hay puntero y se queda
  // plano, que es lo correcto. Bajo reduced motion no se escucha el evento.
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 120, damping: 18 });
  const rotateY = useSpring(tiltY, { stiffness: 120, damping: 18 });
  useEffect(() => {
    if (congelarEscala) return;
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      tiltY.set(nx * 7);
      tiltX.set(-ny * 7);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [congelarEscala, tiltX, tiltY]);

  return (
    <motion.div
      aria-hidden
      animate={{ opacity: BODY_OPACITY[state] }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative h-[200px] w-[200px] shrink-0 md:h-[240px] md:w-[240px]",
        className
      )}
    >
      {/* Todo el cuerpo late con el audio. Bajo reduced motion la escala se
          congela en 1: solo cambia la opacidad, que es lo que pide el plan. */}
      <motion.div
        style={{ scale: congelarEscala ? 1 : scale }}
        className="absolute inset-0"
      >
        {/* Capa 1 — halo exterior. Es la que responde al nivel. */}
        <motion.div
          style={{
            opacity: haloOpacity,
            background: `radial-gradient(circle at 50% 50%, ${palette.halo} 0%, transparent 68%)`,
            filter: "blur(40px)",
          }}
          className="absolute -inset-[12%] rounded-full transition-[background] duration-700"
        />

        {/* Capa 2 — masa media en órbita. Desplazada del centro para que el
            giro se note: una capa centrada rotando sería invisible. */}
        <div
          style={{
            background: `radial-gradient(circle at 38% 34%, ${palette.mid} 0%, transparent 62%)`,
            filter: "blur(28px)",
            animationDuration: "40s",
          }}
          className="absolute inset-[4%] animate-orbit rounded-full opacity-70 transition-[background] duration-700"
        />

        {/* Capa 3 — interior, órbita inversa y más rápida: el contraste de
            direcciones es lo que da sensación de volumen sin 3D. */}
        <div
          style={{
            background: `radial-gradient(circle at 64% 66%, ${palette.inner} 0%, transparent 58%)`,
            filter: "blur(18px)",
            animationDirection: "reverse",
            animationDuration: "16s",
          }}
          className="absolute inset-[10%] animate-orbit rounded-full opacity-60 transition-[background] duration-700"
        />

        {/* Shimmer de "estoy trabajando" (thinking / tool). Barre el
            background-position, no un transform, así el bloque global de
            prefers-reduced-motion de globals.css lo neutraliza solo. */}
        {shimmering && (
          <div
            className="absolute inset-[6%] animate-shimmer rounded-full opacity-60 mix-blend-screen"
            style={{
              background:
                "linear-gradient(110deg, transparent 35%, var(--color-neon) 50%, transparent 65%)",
              backgroundSize: "220% auto",
              filter: "blur(14px)",
            }}
          />
        )}

        {/* Anillo cónico girando mientras conecta. No se reutiliza la clase
            `.conic-ring` de globals.css porque allí solo gira en :hover; aquí
            hace falta girando siempre, y Framer respeta el reduced motion. */}
        {connecting && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2.4, ease: "linear", repeat: Infinity }}
            className="absolute inset-[2%] rounded-full"
            style={{
              padding: "2px",
              background:
                "conic-gradient(from 0deg, transparent 0%, var(--color-neon) 12%, var(--color-electric) 25%, transparent 40%)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
        )}

        <OrbitRings level={smooth} palette={palette} frozen={congelarEscala} />

        {/* Disco nítido central: el ancla de marca. Sin desenfoque, para que
            el isotipo se lea a 200 px en una pantalla compartida. Se inclina
            con el puntero (perspectiva) para que sea un objeto, no un icono. */}
        <motion.div
          style={{
            rotateX: congelarEscala ? 0 : rotateX,
            rotateY: congelarEscala ? 0 : rotateY,
            transformPerspective: 700,
            x: "-50%",
            y: "-50%",
          }}
          className="absolute left-1/2 top-1/2 flex h-[46%] w-[46%] items-center justify-center rounded-full border border-line bg-[radial-gradient(circle_at_50%_28%,var(--color-space)_0%,var(--color-void)_78%)] shadow-[0_10px_40px_-12px_rgba(0,0,0,0.9)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE_PATH}/isotipo.png`}
            alt=""
            className="h-[86%] w-[86%] object-contain"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
