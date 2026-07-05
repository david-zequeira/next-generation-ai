"use client";

import dynamic from "next/dynamic";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import TextReveal from "@/components/ui/TextReveal";
import { useLocale } from "@/i18n/LocaleContext";

const AICore = dynamic(() => import("@/components/three/AICore"), {
  ssr: false,
});

/**
 * Hero cinematográfico: el mundo llega desde el desenfoque, un barrido de
 * luz firma la apertura, y el titular flota en parallax OPUESTO al núcleo
 * 3D — dos capas de profundidad que responden al ratón en direcciones
 * contrarias, como una cámara con foco.
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

  // Parallax del titular: se mueve suavemente al contrario que el núcleo
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const headX = useSpring(useTransform(mx, [-1, 1], [10, -10]), {
    stiffness: 50,
    damping: 20,
  });
  const headY = useSpring(useTransform(my, [-1, 1], [6, -6]), {
    stiffness: 50,
    damping: 20,
  });

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
      {/* Video: llega desde el desenfoque, como una cámara enfocando */}
      <motion.div
        style={{ scale: videoScale }}
        initial={{ opacity: 0, filter: "blur(24px) brightness(0.4)", scale: 1.12 }}
        animate={{ opacity: 1, filter: "blur(0px) brightness(1)", scale: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          className="h-full w-full object-cover opacity-55"
        >
          <source
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/hero.mp4`}
            type="video/mp4"
          />
        </video>
      </motion.div>

      {/* Etalonaje cinematográfico */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(4,5,10,0.55)_70%,#04050a_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-void/70 via-transparent to-void" />

      {/* Barrido de luz de apertura — la firma lumínica de la marca */}
      <motion.div
        aria-hidden
        initial={{ x: "-120%", opacity: 0 }}
        animate={{ x: "120%", opacity: [0, 0.7, 0] }}
        transition={{ delay: 0.9, duration: 2.4, ease: [0.6, 0, 0.2, 1] }}
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3 -skew-x-12"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(126,166,255,0.13) 45%, rgba(56,212,255,0.18) 50%, rgba(126,166,255,0.13) 55%, transparent)",
        }}
      />

      {/* Núcleo 3D — se disuelve en partículas conforme el visitante avanza */}
      <AICore className="z-10 opacity-90" dissolve={scrollYProgress} />

      {/* Marcas de esquina — detalle de composición propio */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.4 }}
        className="pointer-events-none absolute inset-x-6 top-24 z-20 hidden items-start justify-between font-display text-[10px] tracking-[0.35em] text-mist/45 md:flex lg:inset-x-10"
      >
        <span>{"//"} 40.4168°N</span>
        <span>3.7038°W {"//"}</span>
      </motion.div>

      {/* Contenido */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 mx-auto flex max-w-6xl flex-col items-center px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="eyebrow mb-8"
        >
          {t.eyebrow}
        </motion.p>

        <h1 className="sr-only">
          NEXT GENERATION AI — {t.titleA} {t.titleB}
        </h1>
        {/* key={locale}: relanza la animación del titular al cambiar idioma */}
        <motion.div aria-hidden key={locale} style={{ x: headX, y: headY }}>
          <TextReveal
            as="span"
            text={t.titleA}
            delay={0.45}
            className="block text-[clamp(3rem,9.5vw,8.75rem)] text-frost"
          />
          <TextReveal
            as="span"
            text={t.titleB}
            delay={0.75}
            className="-mt-[0.08em] block text-[clamp(3rem,9.5vw,8.75rem)]"
            wordClassName="text-gradient"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-xl text-balance text-base leading-relaxed text-mist md:text-lg"
        >
          {t.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton href="#contact">
            {t.ctaPrimary}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </MagneticButton>
          <MagneticButton href="#work" variant="ghost">
            <Play className="h-4 w-4 text-neon" />
            {t.ctaSecondary}
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1.2 }}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[11px] uppercase tracking-[0.35em] text-mist">
          {t.scroll}
        </span>
        <div className="h-12 w-px overflow-hidden bg-white/10">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1/2 w-full bg-gradient-to-b from-transparent via-neon to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
