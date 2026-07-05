"use client";

import { useEffect, useRef } from "react";

/**
 * Sistema de cursor de la marca (solo puntero fino, sin reduced-motion):
 *  1. Halo ambiental que arrastra luz eléctrica tras el cursor.
 *  2. Anillo de firma que persigue el puntero con inercia y se expande
 *     sobre elementos interactivos — el "tacto" reconocible del sitio.
 * El cursor nativo nunca se oculta: el anillo es un acento, no un sustituto.
 */
export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const ring = ringRef.current;
    if (!glow || !ring) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let gx = targetX, gy = targetY;
    let rx = targetX, ry = targetY;
    let scale = 1;
    let targetScale = 1;

    const isInteractive = (el: Element | null): boolean =>
      !!el?.closest("a, button, [role='button'], input, textarea, select");

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      targetScale = isInteractive(e.target as Element) ? 2.2 : 1;
      glow.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const onLeave = () => {
      glow.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const tick = () => {
      gx += (targetX - gx) * 0.08;
      gy += (targetY - gy) * 0.08;
      rx += (targetX - rx) * 0.22;
      ry += (targetY - ry) * 0.22;
      scale += (targetScale - scale) * 0.16;
      glow.style.transform = `translate3d(${gx - 350}px, ${gy - 350}px, 0)`;
      ring.style.transform = `translate3d(${rx - 14}px, ${ry - 14}px, 0) scale(${scale})`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[5] h-[700px] w-[700px] opacity-0 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(circle at center, rgba(46,107,255,0.09) 0%, rgba(56,212,255,0.04) 35%, transparent 65%)",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[95] h-7 w-7 rounded-full border border-neon/50 opacity-0"
        style={{ boxShadow: "0 0 12px -2px rgba(56,212,255,0.35) inset" }}
      />
    </>
  );
}
