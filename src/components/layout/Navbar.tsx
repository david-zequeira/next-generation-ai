"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Languages, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";
import { trackEvent } from "@/lib/track";

const HREFS = ["/#future", "/#services", "/#ecosystem", "/#work", "/#process"];
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Cabecera del Figma: isotipo a la izquierda, enlaces centrados, y a la
 * derecha el selector de idioma y una pastilla blanca. Va transparente sobre
 * el hero y gana fondo al bajar; se esconde al hacer scroll hacia abajo y
 * vuelve al subir.
 */
export default function Navbar({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const light = tone === "light";
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const { locale, setLocale, dict } = useLocale();
  const t = dict.nav;

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > prev && latest > 160 && !open);
    setScrolled(latest > 24);
  });

  const otherLocale = locale === "en" ? "es" : "en";

  const langButton = (
    <button
      type="button"
      aria-label={t.ariaLang}
      onClick={() => setLocale(otherLocale)}
      // Figma: 98×46, radio 20, degradado #182557→#050b21, texto Montserrat 500 20 + globo
      className={cn(
        "inline-flex h-u-46 cursor-pointer items-center gap-u-8 rounded-u-20 px-u-16 font-display fs-u-20 font-medium transition-all duration-300",
        light
          ? "border border-ink/15 bg-white/70 text-ink hover:border-electric/50"
          : "border border-transparent bg-gradient-to-b from-[#182557] to-abyss text-white hover:border-electric/60"
      )}
    >
      <Languages className="size-u-18" strokeWidth={1.8} />
      {locale === "es" ? "Es" : "En"}
    </button>
  );

  // Figma: enlaces Montserrat SemiBold 15, blancos, centrados en la página
  const linkClass = cn(
    "group relative rounded-full px-u-14 py-2 font-display fs-u-15 font-semibold transition-colors duration-200",
    light ? "text-ink/85 hover:text-electric" : "text-white hover:text-cloud"
  );
  const underline = (
    <span
      aria-hidden
      className="absolute inset-x-3.5 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-electric to-pulse transition-transform duration-300 ease-out group-hover:scale-x-100"
    />
  );

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
          scrolled
            ? light
              ? "border-b border-ink/10 bg-paper/80 backdrop-blur-xl"
              : "border-b border-line bg-void/75 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <nav
          aria-label="Principal"
          // Figma: barra de 116 px, imago de 55 px a 240 px del borde (12,5 % del ancho)
          className="relative mx-auto flex h-u-116 max-w-[1920px] items-center justify-between px-5 md:px-10 xl:px-[12.5%]"
        >
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BASE}/isotipo.png`} alt="Asenix" className="h-u-55 w-auto" />
          </Link>

          {/* Centrado absoluto: el Figma centra el menú en la página, no entre el logo y los botones */}
          <ul className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-u-22 lg:flex">
            {t.links.map((label, i) => (
              <li key={HREFS[i]}>
                <a href={HREFS[i]} className={linkClass}>
                  {label}
                  {underline}
                </a>
              </li>
            ))}
            <li>
              <Link href="/calculadora" className={linkClass}>
                {t.calc}
                {underline}
              </Link>
            </li>
            <li>
              <Link href="/precios" className={linkClass}>
                {t.pricing}
                {underline}
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-u-10">
            <span className="hidden lg:inline-flex">{langButton}</span>
            {/* Figma: 165×46, radio 20, blanco, Montserrat 500 15 negro */}
            <Link
              href="/contacto"
              onClick={() => trackEvent("cta_navbar")}
              className={cn(
                "hidden h-u-46 cursor-pointer items-center rounded-u-20 px-u-24 font-display fs-u-15 font-medium transition-all duration-300 active:scale-[0.97] lg:inline-flex",
                light ? "bg-ink text-white hover:bg-electric" : "bg-white text-black hover:bg-cloud"
              )}
            >
              {t.cta}
            </Link>
            <button
              type="button"
              aria-label={open ? t.ariaClose : t.ariaOpen}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-colors lg:hidden",
                light ? "text-ink hover:bg-ink/5" : "text-frost hover:bg-white/5"
              )}
            >
              {open ? (
                <X className="h-5 w-5" strokeWidth={1.8} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.8} />
              )}
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
            className={cn(
              "fixed inset-0 z-40 flex flex-col items-center justify-center gap-1 backdrop-blur-2xl lg:hidden",
              light ? "bg-paper/95" : "bg-void/92"
            )}
          >
            {t.links.map((label, i) => (
              <motion.a
                key={HREFS[i]}
                href={HREFS[i]}
                onClick={() => setOpen(false)}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.06 * i, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className={cn("display cursor-pointer py-2.5 text-3xl transition-colors", light ? "text-ink hover:text-electric" : "text-frost hover:text-pulse")}
              >
                {label}
              </motion.a>
            ))}
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.06 * t.links.length, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <Link
                href="/calculadora"
                onClick={() => setOpen(false)}
                className={cn("display block cursor-pointer py-2.5 text-3xl transition-colors", light ? "text-ink hover:text-electric" : "text-frost hover:text-pulse")}
              >
                {t.calc}
              </Link>
              <Link
                href="/precios"
                onClick={() => setOpen(false)}
                className={cn("display block cursor-pointer py-2.5 text-3xl transition-colors", light ? "text-ink hover:text-electric" : "text-frost hover:text-pulse")}
              >
                {t.pricing}
              </Link>
            </motion.div>
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.32, duration: 0.45 }}
              className="mt-4"
            >
              {langButton}
            </motion.div>
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.45 }}
            >
              <Link
                href="/contacto"
                onClick={() => {
                  setOpen(false);
                  trackEvent("cta_navbar");
                }}
                className="btn-light mt-4 block cursor-pointer rounded-full px-8 py-4 font-display text-sm font-semibold"
              >
                {t.ctaLong}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
