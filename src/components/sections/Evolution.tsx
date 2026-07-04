"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";

const STAGES = [
  { label: "Manual Business", sub: "People doing everything by hand." },
  { label: "Automation", sub: "Rules take over the repetitive." },
  { label: "AI", sub: "Systems that understand and decide." },
  { label: "Autonomous Company", sub: "Operations that run themselves." },
  { label: "Next Generation Business", sub: "Where we take you." },
];

/**
 * Section 2 — "The Future of Business".
 * A 500vh scroll journey: the camera drifts through digital space while
 * each era of business comes into focus, then dissolves into the next.
 * Scroll position selects the active stage; Framer tweens the transition
 * (opacity + scale + blur) so each hand-off feels like a camera refocus.
 */
export default function Evolution() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(
      STAGES.length - 1,
      Math.max(0, Math.floor(v * STAGES.length))
    );
    setActive(idx);
  });

  const starsY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const gridScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);

  return (
    <section ref={ref} id="future" className="relative h-[500vh] bg-void">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        {/* Digital space backdrop */}
        <motion.div
          style={{ y: starsY }}
          aria-hidden
          className="absolute -inset-y-[15%] inset-x-0 opacity-60"
        >
          {Array.from({ length: 70 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-px w-px rounded-full bg-frost"
              style={{
                left: `${(i * 137.5) % 100}%`,
                top: `${(i * 61.8) % 100}%`,
                opacity: 0.15 + ((i * 7) % 10) / 18,
                boxShadow: i % 6 === 0 ? "0 0 6px rgba(56,212,255,0.8)" : undefined,
              }}
            />
          ))}
        </motion.div>
        <motion.div
          style={{ scale: gridScale }}
          aria-hidden
          className="absolute inset-0 opacity-[0.14]"
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(94,130,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(94,130,255,0.35) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              maskImage:
                "radial-gradient(ellipse at center, black 25%, transparent 72%)",
            }}
          />
        </motion.div>

        {/* Section header, pinned at top */}
        <div className="absolute top-[12vh] left-1/2 w-full -translate-x-1/2 text-center">
          <p className="eyebrow">The Future of Business</p>
        </div>

        {/* Stages: the active one focuses in, the rest dissolve away */}
        <div className="relative h-full w-full">
          {STAGES.map((s, i) => {
            const isActive = i === active;
            const isPast = i < active;
            const isLast = i === STAGES.length - 1;
            return (
              <motion.div
                key={s.label}
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : isPast ? 1.16 : 0.84,
                  y: isActive ? 0 : isPast ? -48 : 48,
                  filter: isActive ? "blur(0px)" : "blur(16px)",
                }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
              >
                <span className="eyebrow mb-6">
                  {String(i + 1).padStart(2, "0")} / 05
                </span>
                <h3
                  className={`display text-[clamp(2.5rem,7.5vw,6.5rem)] ${
                    isLast ? "text-gradient" : "text-frost"
                  }`}
                >
                  {s.label}
                </h3>
                <p className="mt-6 max-w-md text-base text-mist md:text-lg">{s.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Progress rail */}
        <div className="absolute bottom-[10vh] left-1/2 w-56 -translate-x-1/2">
          <div className="h-px w-full bg-white/10">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="h-full w-full origin-left bg-gradient-to-r from-electric to-neon"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
