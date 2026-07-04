"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import TextReveal from "@/components/ui/TextReveal";

const AICore = dynamic(() => import("@/components/three/AICore"), {
  ssr: false,
});

/**
 * Full-viewport cinematic hero: video atmosphere, floating 3D AI core,
 * staggered headline, magnetic CTAs. Content parallaxes away as you
 * scroll into the next world.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-svh items-center justify-center overflow-hidden"
    >
      {/* Video atmosphere */}
      <motion.div style={{ scale: videoScale }} className="absolute inset-0">
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

      {/* Cinematic grading over the video */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(4,5,10,0.55)_70%,#04050a_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-void/70 via-transparent to-void" />

      {/* The AI Core */}
      <AICore className="z-10 opacity-90" />

      {/* Content */}
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
          Next Generation AI
        </motion.p>

        <h1 className="sr-only">
          NEXT GENERATION AI — Building the Future of Business
        </h1>
        <div aria-hidden>
          <TextReveal
            as="span"
            text="Building the Future"
            delay={0.45}
            className="block text-[clamp(3rem,9.5vw,8.75rem)] text-frost"
          />
          <TextReveal
            as="span"
            text="of Business."
            delay={0.75}
            className="block text-[clamp(3rem,9.5vw,8.75rem)]"
            wordClassName="text-gradient"
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-xl text-balance text-base leading-relaxed text-mist md:text-lg"
        >
          We bring next-generation intelligence and automation to businesses of
          every size — so yours can operate like a billion-dollar company.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton href="#contact">
            Book a Strategy Call
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </MagneticButton>
          <MagneticButton href="#work" variant="ghost">
            <Play className="h-4 w-4 text-neon" />
            Watch Demo
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1.2 }}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[11px] uppercase tracking-[0.35em] text-mist">
          Scroll
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
