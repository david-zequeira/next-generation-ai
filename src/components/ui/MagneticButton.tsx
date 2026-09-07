"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  children: ReactNode;
  /**
   * `primary`: pastilla clara con texto tinta (Figma «Comenzar»).
   * `ghost`: pastilla oscura con borde azul claro (Figma «Ver demo»).
   * `blue`: pastilla azul eléctrico, para CTAs sobre fondo claro.
   */
  variant?: "primary" | "ghost" | "blue";
  href?: string;
  className?: string;
  onClick?: () => void;
};

/**
 * A button that leans toward the cursor with a springy magnetic pull.
 * Los tres acabados salen de globals.css (.btn-light / .btn-outline /
 * .btn-blue) para que el resto del sitio pueda usarlos sin el imán.
 */
export default function MagneticButton({
  children,
  variant = "primary",
  href,
  className,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 16, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 180, damping: 16, mass: 0.6 });

  const onMouseMove = (e: MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.32);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.32);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const baseClasses = cn(
    "group relative inline-flex min-h-[54px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full px-9 py-3.5 font-display text-[15px] font-semibold transition-[background,box-shadow,border-color] duration-300",
    variant === "primary" && "btn-light",
    variant === "ghost" && "btn-outline",
    variant === "blue" && "btn-blue",
    className
  );

  const inner = (
    <>
      {/* Barrido de luz al pasar — la firma lumínica de la marca */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full",
          variant === "primary" ? "via-white/60" : "via-white/15"
        )}
      />
      <span className="relative z-10 inline-flex items-center gap-3">
        {children}
      </span>
    </>
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.965 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      className="inline-block"
    >
      {href ? (
        <a href={href} className={baseClasses} onClick={onClick}>
          {inner}
        </a>
      ) : (
        <button type="button" className={baseClasses} onClick={onClick}>
          {inner}
        </button>
      )}
    </motion.div>
  );
}
