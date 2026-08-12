"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useDict } from "@/i18n/LocaleContext";

const ANCHORS = ["#top", "#future", "#services", "#ecosystem", "#work", "#process", "#contact"];

/**
 * Raíl de capítulos — la columna vertebral narrativa del sitio.
 * Una línea de luz crece con el scroll; cada nodo es un capítulo y el
 * activo respira en neón. Solo escritorio: en móvil el scroll ES el raíl.
 */
export default function SectionRail() {
  const dict = useDict();
  const labels = ["ASENIX", ...dict.nav.links, dict.footer.contact];
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  useEffect(() => {
    const sections = ANCHORS.map((a) => document.querySelector(a)).filter(
      (el): el is Element => !!el
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = ANCHORS.indexOf(`#${entry.target.id}`);
          if (idx >= 0) setActive(idx);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      aria-label={dict.nav.railAria}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2.8, duration: 1 }}
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative flex flex-col items-center gap-4">
        {/* Línea de progreso */}
        <div className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-white/[0.07]" />
        <motion.div
          style={{ scaleY: progress }}
          className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-electric to-neon"
        />
        {ANCHORS.map((href, i) => (
          <a
            key={href}
            href={href}
            aria-label={labels[i]}
            title={labels[i]}
            className="group relative z-10 flex h-4 w-4 items-center justify-center"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full transition-all duration-400 ${
                active === i
                  ? "scale-[1.8] bg-neon shadow-[0_0_10px_2px_rgba(56,212,255,0.45)]"
                  : "bg-mist/40 group-hover:scale-150 group-hover:bg-frost/70"
              }`}
            />
            {/* Etiqueta al hover */}
            <span className="pointer-events-none absolute right-6 whitespace-nowrap rounded-full border border-line bg-void/90 px-3 py-1 font-display text-[10px] uppercase tracking-[0.25em] text-mist opacity-0 backdrop-blur-sm transition-all duration-300 translate-x-1 group-hover:translate-x-0 group-hover:opacity-100">
              {labels[i]}
            </span>
          </a>
        ))}
      </div>
    </motion.nav>
  );
}
