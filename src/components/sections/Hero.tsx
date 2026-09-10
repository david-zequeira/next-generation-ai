"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import TextReveal from "@/components/ui/TextReveal";
import Starfield from "@/components/ui/Starfield";
import { useLocale } from "@/i18n/LocaleContext";
import { warmUpVoice } from "@/lib/voice-warmup";

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "";

/**
 * Hero del Figma: titular centrado en Montserrat Bold, subtítulo y dos
 * pastillas (clara + contorno). Debajo siguen viviendo el vídeo y el barrido
 * de luz: el diseño deja ese hueco entre el titular y los botones a propósito
 * para que el vídeo (la película de marca) se vea.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { locale, dict } = useLocale();
  const t = dict.hero;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);

  // Rendimiento percibido: el póster pinta al instante y el vídeo funde encima.
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // La película se reproduce una sola vez al cargar (sin bucle). Al terminar
  // se queda en su último fotograma respirando despacio y el cielo de
  // estrellas toma el relevo para que la portada nunca quede quieta.
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if ((videoRef.current?.readyState ?? 0) >= 2) setVideoReady(true);
  }, []);

  // Sonido: el autoplay solo se permite en silencio, así que activamos el
  // audio con el primer clic, toque o tecla del visitante (un gesto real),
  // siempre que la película siga en marcha.
  useEffect(() => {
    const unmute = () => {
      const v = videoRef.current;
      if (v && !v.paused && !v.ended) v.muted = false;
      window.removeEventListener("pointerdown", unmute);
      window.removeEventListener("keydown", unmute);
    };
    window.addEventListener("pointerdown", unmute, { passive: true });
    window.addEventListener("keydown", unmute);
    return () => {
      window.removeEventListener("pointerdown", unmute);
      window.removeEventListener("keydown", unmute);
    };
  }, []);

  // Parallax del titular: se mueve suavemente al contrario que el núcleo
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const headX = useSpring(useTransform(mx, [-1, 1], [8, -8]), { stiffness: 50, damping: 20 });
  const headY = useSpring(useTransform(my, [-1, 1], [5, -5]), { stiffness: 50, damping: 20 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-svh items-center justify-center overflow-hidden"
    >
      {/* Vídeo: llega desde el desenfoque, como una cámara enfocando */}
      <motion.div
        style={{ scale: videoScale }}
        initial={{ opacity: 0, filter: "blur(24px) brightness(0.4)", scale: 1.12 }}
        animate={{ opacity: 1, filter: "blur(0px) brightness(1)", scale: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/hero-poster.jpg`}
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-70"
        />
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="metadata"
          aria-hidden
          onLoadedData={() => setVideoReady(true)}
          onEnded={() => setEnded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            videoReady ? "opacity-70" : "opacity-0"
          } ${ended ? "animate-breathe" : ""}`}
        >
          <source src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/hero.mp4`} type="video/mp4" />
        </video>
      </motion.div>

      {/* Etalonaje: el vídeo se funde con el azul noche del Figma */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,6,23,0.6)_65%,#030617_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-void/80 via-void/20 to-void" />

      {/* Cielo de estrellas: entra en fundido cuando la película termina.
          Va por encima del etalonaje para que el viñeteado no lo apague. */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: ended ? 1 : 0 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute inset-0 z-[5]"
      >
        <Starfield active={ended} count={260} />
      </motion.div>

      {/* Barrido de luz de apertura — la firma lumínica de la marca */}
      <motion.div
        aria-hidden
        initial={{ x: "-120%", opacity: 0 }}
        animate={{ x: "120%", opacity: [0, 0.7, 0] }}
        transition={{ delay: 0.9, duration: 2.4, ease: [0.6, 0, 0.2, 1] }}
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3 -skew-x-12"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(148,178,252,0.12) 45%, rgba(26,77,255,0.2) 50%, rgba(148,178,252,0.12) 55%, transparent)",
        }}
      />

      {/* Marcas de esquina — detalle de composición propio */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.4 }}
        className="pointer-events-none absolute inset-x-6 top-28 z-20 hidden items-start justify-between font-display text-[10px] font-light tracking-[0.35em] text-mist/50 md:flex lg:inset-x-10"
      >
        <span>{"//"} 40.4168°N</span>
        <span>3.7038°W {"//"}</span>
      </motion.div>

      {/* Contenido */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 mx-auto flex max-w-5xl flex-col items-center px-6 pt-16 text-center"
      >
        <h1 className="sr-only">
          ASENIX — {t.titleA} {t.titleB}
        </h1>
        {/* key={locale}: relanza la animación del titular al cambiar idioma */}
        <motion.div aria-hidden key={locale} style={{ x: headX, y: headY }}>
          <TextReveal
            as="span"
            text={t.titleA}
            delay={0.45}
            className="block fs-u-52 lh-u-54 text-white"
          />
          <TextReveal
            as="span"
            text={t.titleB}
            delay={0.7}
            className="block fs-u-52 lh-u-54 text-white"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
          className="sub-section mt-u-32 text-balance"
        >
          {t.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-u-180 flex flex-col items-center gap-u-32 sm:flex-row"
        >
          <MagneticButton href="/contacto">
            {t.ctaPrimary}
            <ArrowRight
              className="size-u-24 text-electric transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={3}
            />
          </MagneticButton>
          {/* La "demo" no es un vídeo: es hablar con el agente. El CTA
              desaparece si no hay backend de agente. El span calienta el SDK
              al acercarse (onFocus burbujea, así que Tab también cuenta). */}
          {AGENT_URL && (
            <span onPointerEnter={warmUpVoice} onFocus={warmUpVoice}>
              <MagneticButton
                variant="ghost"
                onClick={() => window.dispatchEvent(new CustomEvent("ng:open-voice"))}
              >
                {t.ctaSecondary}
                <Play className="size-u-20 fill-electric text-electric" strokeWidth={1.5} />
              </MagneticButton>
            </span>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
