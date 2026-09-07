"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDict } from "@/i18n/LocaleContext";
import { OPEN_EVENT, readConsent, saveConsent } from "@/lib/consent";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Aviso de cookies. Sale una vez, abajo a la izquierda (los botones de chat y
 * voz viven a la derecha), con «Aceptar» y «Rechazar» al mismo nivel — la AEPD
 * exige que rechazar cueste lo mismo que aceptar — y un panel para elegir por
 * categoría. Se puede reabrir desde «Preferencias de cookies» en el pie.
 */
export default function CookieBanner() {
  const t = useDict().cookies;
  const [open, setOpen] = useState(false);
  const [configure, setConfigure] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const current = readConsent();
    if (!current) {
      // Un respiro tras la entrada del hero: el aviso no compite con el titular
      const id = setTimeout(() => setOpen(true), 1600);
      return () => clearTimeout(id);
    }
  }, []);

  useEffect(() => {
    const onOpen = () => {
      setAnalytics(readConsent()?.analytics ?? false);
      setConfigure(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const decide = (value: boolean) => {
    saveConsent(value);
    setOpen(false);
    setConfigure(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-title"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="card-navy fixed inset-x-4 bottom-24 z-[70] rounded-[22px] p-5 text-frost shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] md:inset-x-auto md:bottom-6 md:left-6 md:w-[440px] md:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-electric/20 text-pulse">
                <Cookie className="h-4.5 w-4.5" strokeWidth={1.8} />
              </span>
              <h2 id="cookie-title" className="font-display text-[15px] font-semibold text-white">
                {t.title}
              </h2>
            </div>
            {configure && readConsent() && (
              <button
                type="button"
                aria-label={t.close}
                onClick={() => {
                  setOpen(false);
                  setConfigure(false);
                }}
                className="cursor-pointer rounded-full p-1 text-mist transition-colors hover:text-white"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            )}
          </div>

          {!configure ? (
            <>
              <p className="mt-3 text-[13px] leading-relaxed text-mist">
                {t.body}{" "}
                <Link href="/legal/cookies" className="text-pulse underline decoration-pulse/40 underline-offset-2 hover:text-white">
                  {t.more}
                </Link>
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => decide(false)}
                  className="btn-outline cursor-pointer rounded-full py-2.5 font-display text-[13px] font-semibold"
                >
                  {t.reject}
                </button>
                <button
                  type="button"
                  onClick={() => decide(true)}
                  className="btn-light cursor-pointer rounded-full py-2.5 font-display text-[13px] font-semibold"
                >
                  {t.accept}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setConfigure(true)}
                className="mt-3 w-full cursor-pointer text-center text-[12px] text-mist underline decoration-mist/30 underline-offset-2 transition-colors hover:text-white"
              >
                {t.configure}
              </button>
            </>
          ) : (
            <>
              <ul className="mt-4 space-y-3">
                <li className="rounded-2xl border border-pulse/20 bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-[13px] font-semibold text-white">{t.necessaryTitle}</p>
                    <span className="text-[11px] font-medium text-neon">{t.always}</span>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-mist">{t.necessaryDesc}</p>
                </li>
                <li className="rounded-2xl border border-pulse/20 bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-display text-[13px] font-semibold text-white">{t.analyticsTitle}</p>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={analytics}
                      aria-label={t.analyticsTitle}
                      onClick={() => setAnalytics((v) => !v)}
                      className={cn(
                        "relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-300",
                        analytics ? "bg-electric" : "bg-white/15"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300",
                          analytics ? "translate-x-[22px]" : "translate-x-0.5"
                        )}
                      />
                    </button>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-mist">{t.analyticsDesc}</p>
                </li>
              </ul>
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => decide(false)}
                  className="btn-outline cursor-pointer rounded-full py-2.5 font-display text-[13px] font-semibold"
                >
                  {t.reject}
                </button>
                <button
                  type="button"
                  onClick={() => decide(analytics)}
                  className="btn-light cursor-pointer rounded-full py-2.5 font-display text-[13px] font-semibold"
                >
                  {t.save}
                </button>
              </div>
              <p className="mt-3 text-center text-[11px] text-mist/70">
                <Link href="/legal/cookies" className="underline decoration-mist/30 underline-offset-2 hover:text-white">
                  {t.more}
                </Link>
              </p>
            </>
          )}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
