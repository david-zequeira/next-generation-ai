"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Metric = { value: number; suffix: string; decimals?: number; label: string };

type Study = {
  client: string;
  sector: string;
  headline: string;
  story: string;
  metrics: Metric[];
  accent: string;
};

const STUDIES: Study[] = [
  {
    client: "Atlas Logistics",
    sector: "Global freight",
    headline: "Dispatch that runs itself.",
    story:
      "An autonomous dispatch brain now routes every shipment, negotiates carrier capacity and handles exceptions before humans notice them.",
    metrics: [
      { value: 87, suffix: "%", label: "Faster fulfilment ops" },
      { value: 24, suffix: "/7", label: "Autonomous dispatch" },
      { value: 32, suffix: "%", label: "Margin uplift" },
    ],
    accent: "#2e6bff",
  },
  {
    client: "Meridian Capital",
    sector: "Financial services",
    headline: "A back office with zero backlog.",
    story:
      "Document agents read, reconcile and file everything that used to sit in inboxes — with an audit trail humans actually trust.",
    metrics: [
      { value: 40, suffix: "h", label: "Saved per analyst / week" },
      { value: 99.2, suffix: "%", decimals: 1, label: "Reconciliation accuracy" },
      { value: 11, suffix: "×", label: "Faster reporting cycle" },
    ],
    accent: "#38d4ff",
  },
  {
    client: "Nova Retail Group",
    sector: "E-commerce",
    headline: "Support that scales like software.",
    story:
      "Intelligent support agents resolve the routine and escalate the rare — so human teams only touch conversations that matter.",
    metrics: [
      { value: 3.4, suffix: "×", decimals: 1, label: "Support capacity" },
      { value: 61, suffix: "%", label: "Cost reduction" },
      { value: 92, suffix: "%", label: "CSAT maintained" },
    ],
    accent: "#7c5cff",
  },
  {
    client: "Helios Manufacturing",
    sector: "Industrial",
    headline: "12,000 hours, returned to people.",
    story:
      "Procurement, quality reporting and maintenance planning now run as a single intelligent workflow across four plants.",
    metrics: [
      { value: 12, suffix: "k", label: "Hours automated / year" },
      { value: 4, suffix: "", label: "Plants orchestrated" },
      { value: 28, suffix: "%", label: "Downtime reduction" },
    ],
    accent: "#5f8dff",
  },
];

function Counter({ value, suffix, decimals = 0 }: Omit<Metric, "label">) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

/** Stylised product screenshot built in CSS — no external images. */
function ScreenMock({ accent }: { accent: string }) {
  return (
    <div className="glass overflow-hidden rounded-xl">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-3 h-2 w-24 rounded-full bg-white/10" />
      </div>
      <div className="grid grid-cols-3 gap-3 p-4">
        <div className="col-span-2 space-y-3">
          <div
            className="h-20 rounded-lg"
            style={{
              background: `linear-gradient(120deg, ${accent}33, transparent 70%)`,
              border: "1px solid rgba(148,170,255,0.12)",
            }}
          >
            <div className="flex h-full items-end gap-1.5 px-3 pb-2">
              {[38, 62, 45, 78, 56, 90, 70, 96].map((h, i) => (
                <div
                  key={i}
                  className="w-full rounded-sm"
                  style={{
                    height: `${h}%`,
                    background: `linear-gradient(to top, ${accent}cc, ${accent}44)`,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="h-2 w-3/4 rounded-full bg-white/10" />
          <div className="h-2 w-1/2 rounded-full bg-white/[0.07]" />
        </div>
        <div className="space-y-3">
          <div className="h-10 rounded-lg border border-line bg-white/[0.04]" />
          <div className="h-10 rounded-lg border border-line bg-white/[0.04]" />
          <div
            className="h-10 rounded-lg"
            style={{ background: `${accent}22`, border: `1px solid ${accent}55` }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Section 5 — Case studies as a horizontal cinematic track.
 * The page pins and the journey continues sideways; numbers count up
 * as each story enters the frame.
 */
export default function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const track = trackRef.current;
        const section = sectionRef.current;
        if (!track || !section) return;

        const amount = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -amount(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${amount()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section id="work" ref={sectionRef} className="relative overflow-hidden bg-void">
      <div className="flex min-h-svh items-center">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 py-24 [scrollbar-width:none] md:snap-none md:gap-10 md:overflow-x-visible md:px-[12vw] [&::-webkit-scrollbar]:hidden"
        >
          {/* Intro panel */}
          <div className="flex w-[82vw] shrink-0 snap-center flex-col justify-center md:w-[36vw]">
            <p className="eyebrow mb-6">Selected Work</p>
            <h2 className="display text-[clamp(2.4rem,5.5vw,5rem)] text-frost">
              Proof,
              <br />
              <span className="text-gradient-dim">not promises.</span>
            </h2>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-mist">
              Real systems, in production, moving real numbers. Keep scrolling —
              the journey continues sideways.
            </p>
          </div>

          {STUDIES.map((study) => (
            <article
              key={study.client}
              className="group relative w-[86vw] shrink-0 snap-center overflow-hidden rounded-3xl border border-line bg-panel/30 p-7 transition-colors duration-500 hover:border-[rgba(94,140,255,0.35)] md:w-[58vw] md:p-12"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl transition-opacity duration-700 group-hover:opacity-45"
                style={{ background: study.accent }}
              />
              <div className="relative grid gap-8 md:grid-cols-2 md:gap-10">
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="mb-8 flex items-center gap-3">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: study.accent }}
                      />
                      <span className="font-display text-sm font-semibold text-frost">
                        {study.client}
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] text-mist/60">
                        {study.sector}
                      </span>
                    </div>
                    <h3 className="display text-3xl text-frost md:text-4xl">
                      {study.headline}
                    </h3>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-mist">
                      {study.story}
                    </p>
                  </div>
                  <div className="mt-10 grid grid-cols-3 gap-4">
                    {study.metrics.map((m) => (
                      <div key={m.label}>
                        <p
                          className="font-display text-2xl font-bold tracking-tight md:text-4xl"
                          style={{ color: study.accent }}
                        >
                          <Counter
                            value={m.value}
                            suffix={m.suffix}
                            decimals={m.decimals}
                          />
                        </p>
                        <p className="mt-1.5 text-[11px] leading-snug text-mist/80">
                          {m.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 30, rotate: 1.5 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="self-center"
                >
                  <ScreenMock accent={study.accent} />
                </motion.div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
