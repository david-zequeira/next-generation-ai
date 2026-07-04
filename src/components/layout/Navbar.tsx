"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Vision", href: "#future" },
  { label: "Services", href: "#services" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
];

/**
 * Floating glass navigation. Slides away when scrolling down,
 * returns when scrolling up.
 */
export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > prev && latest > 160 && !open);
  });

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-4 top-4 z-50 md:inset-x-8 md:top-6"
      >
        <nav
          aria-label="Principal"
          className="glass mx-auto flex max-w-5xl items-center justify-between rounded-full py-2.5 pl-6 pr-2.5"
        >
          <a
            href="#top"
            className="font-display text-sm font-bold tracking-[0.22em] text-frost"
          >
            NG<span className="text-neon">{"//"}</span>AI
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-4 py-2 text-[13px] font-medium text-mist transition-colors duration-200 hover:text-frost"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="group hidden cursor-pointer items-center gap-1.5 rounded-full bg-electric px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_0_28px_-8px_rgba(46,107,255,0.9)] transition-all duration-300 hover:bg-[#3d78ff] hover:shadow-[0_0_38px_-6px_rgba(46,107,255,1)] md:inline-flex"
            >
              Book a Call
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-frost transition-colors hover:bg-white/5 md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-void/90 backdrop-blur-2xl md:hidden"
          >
            {LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.06 * i, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "display cursor-pointer py-3 text-4xl text-frost transition-colors hover:text-neon"
                )}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={() => setOpen(false)}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.36, duration: 0.45 }}
              className="mt-6 cursor-pointer rounded-full bg-electric px-8 py-4 font-display text-sm font-semibold text-white shadow-[0_0_40px_-8px_rgba(46,107,255,0.9)]"
            >
              Book a Strategy Call
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
