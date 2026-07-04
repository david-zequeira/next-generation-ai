"use client";

import { motion } from "framer-motion";
import TextReveal from "@/components/ui/TextReveal";

type Node = { x: number; y: number; label: string };

const NODES: Node[] = [
  { x: 170, y: 130, label: "Sales Agent" },
  { x: 720, y: 105, label: "Support Agent" },
  { x: 110, y: 420, label: "Ops Agent" },
  { x: 760, y: 440, label: "Finance Agent" },
  { x: 300, y: 555, label: "Data Agent" },
  { x: 590, y: 560, label: "Research Agent" },
];

const CENTER = { x: 450, y: 310 };

const LOG_LINES = [
  "agent://sales     → qualified 14 inbound leads",
  "agent://support   → resolved ticket #8241 in 6s",
  "agent://ops       → rerouted supply order · saved €2.1k",
  "agent://finance   → reconciled 312 invoices",
  "agent://data      → anomaly detected · margin +0.8%",
  "agent://research  → competitor brief compiled",
];

function pathTo(n: Node): string {
  const mx = (CENTER.x + n.x) / 2 + (n.y < CENTER.y ? -30 : 30);
  const my = (CENTER.y + n.y) / 2 + (n.x < CENTER.x ? 24 : -24);
  return `M ${CENTER.x} ${CENTER.y} Q ${mx} ${my} ${n.x} ${n.y}`;
}

/**
 * Section 4 — The AI Ecosystem.
 * A living network: intelligent agents orbit the core, lines carry
 * pulses of work between them, and a holographic console narrates
 * what the swarm is doing.
 */
export default function Ecosystem() {
  return (
    <section
      id="ecosystem"
      className="relative overflow-hidden bg-abyss py-32 md:py-44"
    >
      {/* Atmosphere shift: this world is deeper blue */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(20,40,110,0.35),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-void to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-6">AI Ecosystem</p>
          <TextReveal
            text="One intelligence. Every department."
            className="text-[clamp(2.2rem,5.5vw,4.75rem)] text-frost"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-mist md:text-lg"
          >
            Your business becomes a network of intelligent agents — sensing,
            deciding and communicating in real time.
          </motion.p>
        </div>

        <div className="relative mt-10 md:mt-16">
          <motion.svg
            viewBox="0 0 900 640"
            className="mx-auto w-full max-w-4xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            role="img"
            aria-label="Network of AI agents connected to a central core"
          >
            <defs>
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2e6bff" stopOpacity="0.55" />
                <stop offset="55%" stopColor="#2e6bff" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#2e6bff" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5f8dff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#38d4ff" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* Connections */}
            {NODES.map((n, i) => (
              <g key={n.label}>
                <motion.path
                  d={pathTo(n)}
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="1.4"
                  strokeDasharray="6 6"
                  className="animate-dash"
                  variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    visible: {
                      pathLength: 1,
                      opacity: 1,
                      transition: {
                        duration: 1.4,
                        delay: 0.35 + i * 0.14,
                        ease: "easeInOut",
                      },
                    },
                  }}
                />
                {/* Pulse travelling along the line */}
                <circle r="3" fill="#38d4ff" opacity="0.9">
                  <animateMotion
                    dur={`${3.2 + i * 0.55}s`}
                    repeatCount="indefinite"
                    path={pathTo(n)}
                    begin={`${i * 0.6}s`}
                  />
                </circle>
              </g>
            ))}

            {/* Core */}
            <circle cx={CENTER.x} cy={CENTER.y} r="130" fill="url(#coreGlow)" />
            <motion.g
              variants={{
                hidden: { scale: 0, opacity: 0 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
            >
              <circle
                cx={CENTER.x}
                cy={CENTER.y}
                r="46"
                fill="#0b1226"
                stroke="#2e6bff"
                strokeOpacity="0.7"
              />
              <circle
                cx={CENTER.x}
                cy={CENTER.y}
                r="58"
                fill="none"
                stroke="#38d4ff"
                strokeOpacity="0.3"
                strokeDasharray="3 7"
                className="animate-dash"
              />
              <text
                x={CENTER.x}
                y={CENTER.y - 4}
                textAnchor="middle"
                className="fill-frost font-display"
                fontSize="13"
                fontWeight="700"
                letterSpacing="2"
              >
                NG//AI
              </text>
              <text
                x={CENTER.x}
                y={CENTER.y + 14}
                textAnchor="middle"
                fill="#38d4ff"
                fontSize="9"
                letterSpacing="3"
              >
                CORE
              </text>
            </motion.g>

            {/* Agent nodes */}
            {NODES.map((n, i) => (
              <motion.g
                key={n.label}
                variants={{
                  hidden: { scale: 0, opacity: 0 },
                  visible: {
                    scale: 1,
                    opacity: 1,
                    transition: {
                      duration: 0.7,
                      delay: 0.55 + i * 0.14,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              >
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="26"
                  fill="#0d1530"
                  stroke="#94aaff"
                  strokeOpacity="0.35"
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="5"
                  fill="#38d4ff"
                  className="animate-pulse-glow"
                />
                <text
                  x={n.x}
                  y={n.y + 48}
                  textAnchor="middle"
                  fill="#9aa5c0"
                  fontSize="12"
                  letterSpacing="1"
                >
                  {n.label}
                </text>
              </motion.g>
            ))}
          </motion.svg>

          {/* Floating holographic console */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass animate-float-slow mx-auto mt-8 w-full max-w-md rounded-2xl p-5 md:absolute md:bottom-4 md:right-0 md:mt-0"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-neon animate-pulse-glow" />
              <span className="font-display text-[11px] font-semibold uppercase tracking-[0.25em] text-mist">
                Live agent activity
              </span>
            </div>
            <div className="space-y-2 font-mono text-[11px] leading-relaxed text-mist/90">
              {LOG_LINES.map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + i * 0.18, duration: 0.5 }}
                  className="truncate"
                >
                  <span className="text-neon/80">▸</span> {line}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
