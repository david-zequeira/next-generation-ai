"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  Copy,
  FileSpreadsheet,
  Mail,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { useDict } from "@/i18n/LocaleContext";

/** Posición/estética de los chips de caos — los textos, en el diccionario por índice. */
const CHAOS_POS: { icon: LucideIcon; top: string; left: string; tilt: string; delay: string }[] = [
  { icon: Mail, top: "16%", left: "12%", tilt: "-4deg", delay: "0s" },
  { icon: FileSpreadsheet, top: "30%", left: "58%", tilt: "3deg", delay: "0.4s" },
  { icon: Clock, top: "52%", left: "18%", tilt: "-2deg", delay: "0.8s" },
  { icon: AlertTriangle, top: "66%", left: "62%", tilt: "5deg", delay: "0.2s" },
  { icon: Copy, top: "44%", left: "40%", tilt: "-5deg", delay: "0.6s" },
  { icon: Phone, top: "76%", left: "34%", tilt: "2deg", delay: "1s" },
  { icon: Mail, top: "22%", left: "36%", tilt: "6deg", delay: "1.2s" },
];

/** Clean automated flow shown on the "after" side. */
function FlowDiagram({
  inputs,
  outputs,
  engine,
}: {
  inputs: string[];
  outputs: string[];
  engine: string;
}) {
  return (
    <svg viewBox="0 0 720 360" className="w-full max-w-2xl" aria-hidden>
      <defs>
        <linearGradient id="flowLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2e6bff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#38d4ff" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {inputs.map((label, i) => {
        const y = 80 + i * 100;
        const path = `M 150 ${y} C 240 ${y}, 260 180, 330 180`;
        return (
          <g key={label}>
            <rect x="20" y={y - 22} width="130" height="44" rx="12" fill="#0d1530" stroke="rgba(148,170,255,0.25)" />
            <text x="85" y={y + 5} textAnchor="middle" fill="#9aa5c0" fontSize="13">{label}</text>
            <path d={path} fill="none" stroke="url(#flowLine)" strokeWidth="1.2" strokeDasharray="5 5" className="animate-dash" />
            <circle r="3.5" fill="#38d4ff">
              <animateMotion dur={`${2.4 + i * 0.5}s`} repeatCount="indefinite" path={path} />
            </circle>
          </g>
        );
      })}

      {/* Core */}
      <circle cx="360" cy="180" r="42" fill="#0b1226" stroke="#2e6bff" strokeOpacity="0.8" />
      <circle cx="360" cy="180" r="54" fill="none" stroke="#38d4ff" strokeOpacity="0.35" strokeDasharray="3 7" className="animate-dash" />
      <text x="360" y="176" textAnchor="middle" fill="#eef2ff" fontSize="12" fontWeight="700" letterSpacing="2">NG//AI</text>
      <text x="360" y="192" textAnchor="middle" fill="#38d4ff" fontSize="8" letterSpacing="2">{engine}</text>

      {outputs.map((label, i) => {
        const y = 80 + i * 100;
        const path = `M 390 180 C 460 180, 480 ${y}, 570 ${y}`;
        return (
          <g key={label}>
            <path d={path} fill="none" stroke="url(#flowLine)" strokeWidth="1.2" strokeDasharray="5 5" className="animate-dash" />
            <circle r="3.5" fill="#7c5cff">
              <animateMotion dur={`${2.8 + i * 0.4}s`} repeatCount="indefinite" path={path} />
            </circle>
            <rect x="570" y={y - 22} width="130" height="44" rx="12" fill="#0d1530" stroke="rgba(56,212,255,0.35)" />
            <text x="635" y={y + 5} textAnchor="middle" fill="#c9d6ff" fontSize="13">{label}</text>
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Section 6 — The AI Transformation.
 * A scroll-driven wipe: chaotic manual work is swept away by a beam of
 * light, revealing the automated flow underneath.
 */
export default function Transformation() {
  const ref = useRef<HTMLElement>(null);
  const t = useDict().transformation;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const clip = useTransform(
    scrollYProgress,
    [0.22, 0.78],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]
  );
  const beamLeft = useTransform(scrollYProgress, [0.22, 0.78], ["0%", "100%"]);
  const beamOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.25, 0.75, 0.85],
    [0, 1, 1, 0]
  );
  const beforeOpacity = useTransform(scrollYProgress, [0.6, 0.85], [1, 0.25]);
  const afterLabel = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const beforeLabel = useTransform(scrollYProgress, [0.45, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative h-[280vh] bg-void">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-[10vh] text-center">
          <p className="eyebrow mb-4">{t.eyebrow}</p>
          <div className="display relative h-[1.2em] text-[clamp(2rem,5vw,4rem)]">
            <motion.span style={{ opacity: beforeLabel }} className="absolute inset-x-0 text-mist">
              {t.before}
            </motion.span>
            <motion.span style={{ opacity: afterLabel }} className="text-gradient absolute inset-x-0">
              {t.after}
            </motion.span>
          </div>
        </div>

        {/* BEFORE: chaos */}
        <motion.div
          style={{ opacity: beforeOpacity }}
          className="relative h-[52vh] w-full max-w-4xl"
          aria-hidden
        >
          {CHAOS_POS.map((chip, i) => {
            const Icon = chip.icon;
            return (
              <div
                key={i}
                className="animate-jitter absolute flex items-center gap-2.5 rounded-xl border border-red-400/15 bg-[#160d12]/80 px-4 py-2.5 text-[13px] text-[#d8a5a5] shadow-lg backdrop-blur-sm"
                style={{
                  top: chip.top,
                  left: chip.left,
                  ["--tilt" as string]: chip.tilt,
                  animationDelay: chip.delay,
                }}
              >
                <Icon className="h-4 w-4 opacity-70" strokeWidth={1.6} />
                {t.chaos[i]}
              </div>
            );
          })}
        </motion.div>

        {/* AFTER: order, revealed by the wipe */}
        <motion.div
          style={{ clipPath: clip }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-abyss"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_50%,rgba(20,45,120,0.4),transparent_70%)]"
          />
          <div className="relative flex flex-col items-center px-6">
            <FlowDiagram inputs={t.inputs} outputs={t.outputs} engine={t.engine} />
            <p className="mt-8 font-display text-lg font-medium tracking-tight text-frost md:text-2xl">
              {t.doneA} <span className="text-mist">{t.doneB}</span>
            </p>
          </div>
        </motion.div>

        {/* The wipe beam */}
        <motion.div
          style={{ left: beamLeft, opacity: beamOpacity }}
          aria-hidden
          className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-neon to-transparent shadow-[0_0_40px_6px_rgba(56,212,255,0.5)]"
        />
      </div>
    </section>
  );
}
