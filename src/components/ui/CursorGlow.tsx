"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient light that trails the cursor — a soft electric-blue halo
 * rendered behind all content. Pointer-only; skipped on touch devices
 * and for reduced-motion users.
 */
export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      el.style.opacity = "1";
    };

    const tick = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      el.style.transform = `translate3d(${x - 350}px, ${y - 350}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[5] h-[700px] w-[700px] opacity-0 transition-opacity duration-700"
      style={{
        background:
          "radial-gradient(circle at center, rgba(46,107,255,0.09) 0%, rgba(56,212,255,0.04) 35%, transparent 65%)",
      }}
    />
  );
}
