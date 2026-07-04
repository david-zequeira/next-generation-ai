"use client";

import { useRef, type MouseEvent } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Compass,
  Cpu,
  Database,
  Layers,
  MessageSquare,
  Route,
  Terminal,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import TextReveal from "@/components/ui/TextReveal";
import { cn } from "@/lib/utils";

type Service = {
  icon: LucideIcon;
  title: string;
  desc: string;
  wide?: boolean;
};

const SERVICES: Service[] = [
  {
    icon: Bot,
    title: "AI Automation",
    desc: "Autonomous systems that execute entire workstreams end-to-end — no hand-offs, no waiting.",
    wide: true,
  },
  {
    icon: Cpu,
    title: "AI Agents",
    desc: "Digital workers that think, decide and act inside your operation.",
  },
  {
    icon: Workflow,
    title: "Business Process Automation",
    desc: "Every repetitive process, identified and eliminated.",
  },
  {
    icon: Route,
    title: "Workflow Optimization",
    desc: "Operations redesigned around intelligence, not habit.",
  },
  {
    icon: Terminal,
    title: "Custom AI Software",
    desc: "Bespoke systems engineered for your competitive edge.",
  },
  {
    icon: Compass,
    title: "AI Consulting",
    desc: "A precise roadmap from where you are to what's next — strategy, stack and sequencing.",
    wide: true,
  },
  {
    icon: Layers,
    title: "Enterprise Integrations",
    desc: "AI woven into the tools your teams already run on.",
  },
  {
    icon: MessageSquare,
    title: "Intelligent Customer Support",
    desc: "Support that never sleeps, never queues, never forgets.",
  },
  {
    icon: Database,
    title: "Data Intelligence",
    desc: "Your data, refined into foresight and leverage.",
  },
  {
    icon: Wrench,
    title: "Internal AI Tools",
    desc: "In-house superpowers, purpose-built for every team.",
  },
];

function ServiceModule({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = service.icon;

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    ref.current!.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    ref.current!.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.8,
        delay: (index % 3) * 0.09,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(service.wide && "lg:col-span-2")}
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-line bg-panel/30 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(94,140,255,0.4)] hover:shadow-[0_24px_70px_-30px_rgba(46,107,255,0.45)] md:p-10"
      >
        {/* Cursor-tracked inner glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(46,107,255,0.14), transparent 55%)",
          }}
        />
        {/* Glowing top border sweep */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="relative flex h-full flex-col">
          <div className="mb-8 flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-space/70 text-neon transition-all duration-300 group-hover:scale-110 group-hover:border-neon/40 group-hover:shadow-[0_0_24px_-4px_rgba(56,212,255,0.6)]">
              <Icon className="h-5 w-5" strokeWidth={1.6} />
            </div>
            <span className="font-display text-xs tracking-[0.3em] text-mist/50">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="font-display text-xl font-semibold tracking-tight text-frost md:text-2xl">
            {service.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-mist">
            {service.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Section 3 — Services as premium product modules.
 * Each capability is presented like hardware: numbered, engineered,
 * lit by a cursor-tracked glow.
 */
export default function Services() {
  return (
    <section id="services" className="relative bg-void py-32 md:py-44">
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-line to-transparent"
      />
      <div className="mx-auto max-w-7xl px-6">
        <p className="eyebrow mb-6">Capabilities</p>
        <div className="max-w-4xl">
          <TextReveal
            text="Not services. Systems."
            className="text-[clamp(2.4rem,6vw,5.5rem)] text-frost"
          />
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-mist md:text-lg"
        >
          Every engagement ships as a working product: designed, engineered and
          deployed inside your business.
        </motion.p>

        <div className="mt-16 grid gap-4 md:mt-24 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <ServiceModule key={s.title} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
