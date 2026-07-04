"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import TextReveal from "@/components/ui/TextReveal";

const AICore = dynamic(() => import("@/components/three/AICore"), {
  ssr: false,
});

/**
 * Section 10 — Final CTA. The world darkens, time slows, and the AI Core
 * returns for a last word. Only mounted (WebGL and all) once in view.
 */
export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "40% 0px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const darken = useTransform(scrollYProgress, [0, 0.6], [0.9, 0]);
  const rise = useTransform(scrollYProgress, [0.1, 0.7], [80, 0]);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-void"
    >
      {/* The core returns, dimmer and slower */}
      {inView && <AICore className="opacity-50" particles={600} />}

      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#04050a_78%)]"
      />
      <motion.div
        aria-hidden
        style={{ opacity: darken }}
        className="absolute inset-0 bg-void"
      />

      <motion.div
        style={{ y: rise }}
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 py-32 text-center"
      >
        <p className="eyebrow mb-8">The Future Is Already Here</p>
        <TextReveal
          text="Ready for the"
          className="block text-[clamp(2.8rem,8vw,7.5rem)] text-frost"
        />
        <TextReveal
          text="Next Generation?"
          delay={0.25}
          className="block text-[clamp(2.8rem,8vw,7.5rem)]"
          wordClassName="text-gradient"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-8 max-w-lg text-balance text-base leading-relaxed text-mist md:text-lg"
        >
          One conversation is enough to see what your company looks like
          running on intelligence.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12"
        >
          <MagneticButton
            href="mailto:hello@nextgeneration.ai"
            className="px-12 py-5 text-base shadow-[0_0_80px_-10px_rgba(46,107,255,1)]"
          >
            Book a Strategy Call
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </MagneticButton>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 1.4 }}
          className="mt-8 text-sm text-mist/70"
        >
          hello@nextgeneration.ai · Response within 24 hours
        </motion.p>
      </motion.div>
    </section>
  );
}
