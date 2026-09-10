"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Cielo de estrellas en un canvas 2D (sin Three.js): estrellas que derivan
 * despacio hacia el visitante, parpadean y siguen ligeramente al cursor.
 * Pensado para tomar el relevo del vídeo del hero cuando termina, de modo
 * que la portada nunca se quede quieta. Respeta `prefers-reduced-motion`.
 */
export default function Starfield({
  className,
  count = 220,
  active = true,
}: {
  className?: string;
  count?: number;
  /** Con `false` el canvas se congela (ahorra CPU mientras no se ve). */
  active?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    type Star = { x: number; y: number; z: number; r: number; tw: number; hue: number };
    const stars: Star[] = [];
    const spawn = (s?: Star): Star => {
      const star = s ?? ({} as Star);
      star.x = (Math.random() * 2 - 1) * w;
      star.y = (Math.random() * 2 - 1) * h;
      star.z = s ? w : Math.random() * w; // profundidad: cerca = grande y rápido
      star.r = 0.7 + Math.random() * 1.6;
      star.tw = Math.random() * Math.PI * 2;
      star.hue = Math.random(); // 0 = blanco frío, 1 = azul pulse
      return star;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (stars.length === 0) for (let i = 0; i < count; i++) stars.push(spawn());
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // El cursor inclina suavemente el campo (solo con puntero fino)
    let tx = 0;
    let ty = 0;
    let px = 0;
    let py = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 30;
      ty = (e.clientY / window.innerHeight - 0.5) * 20;
    };
    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    let raf = 0;
    let last = performance.now();
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!activeRef.current) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      px += (tx - px) * 0.03;
      py += (ty - py) * 0.03;

      ctx.clearRect(0, 0, w, h);
      const cx = w / 2 + px;
      const cy = h / 2 + py;
      const speed = reduced ? 0 : w * 0.035; // px de profundidad por segundo

      for (const s of stars) {
        s.z -= speed * dt;
        if (s.z <= 1) spawn(s);
        const k = w / s.z; // proyección: cuanto más cerca, más lejos del centro
        const x = cx + (s.x * k) / 2;
        const y = cy + (s.y * k) / 2;
        if (x < -4 || x > w + 4 || y < -4 || y > h + 4) {
          spawn(s);
          continue;
        }
        s.tw += dt * (0.8 + s.hue * 1.4);
        const twinkle = reduced ? 1 : 0.55 + 0.45 * Math.sin(s.tw);
        const depth = 1 - s.z / w; // 0 lejos → 1 cerca
        const alpha = (0.3 + depth * 0.7) * twinkle;
        const radius = s.r * (0.5 + depth * 1.2);
        // Blanco frío a azul pulse (#94b2fc); alguna estrella toma el cian de marca
        const color =
          s.hue > 0.92
            ? `rgba(56,212,255,${alpha})`
            : `rgba(${255 - s.hue * 107},${255 - s.hue * 77},255,${alpha})`;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        // Estela sutil en las estrellas cercanas: sensación de avance
        if (depth > 0.75 && !reduced) {
          const k2 = w / (s.z + speed * 0.12);
          ctx.strokeStyle = `rgba(148,178,252,${alpha * 0.35})`;
          ctx.lineWidth = radius * 0.8;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(cx + (s.x * k2) / 2, cy + (s.y * k2) / 2);
          ctx.stroke();
        }
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
