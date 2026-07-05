"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  children: ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
  className?: string;
  onClick?: () => void;
};

/**
 * A button that leans toward the cursor with a springy magnetic pull.
 * Primary variant carries the signature electric glow.
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
    "group relative inline-flex min-h-[52px] cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-full px-8 py-3.5 font-display text-sm font-semibold tracking-wide transition-[background-color,box-shadow] duration-300",
    // Sombra en dos capas: contacto (ambiente oscuro) + emisión (glow) — luz física
    variant === "primary"
      ? "bg-electric text-white shadow-[0_10px_28px_-14px_rgba(0,0,0,0.7),0_0_40px_-8px_rgba(46,107,255,0.8)] hover:bg-[#3d78ff] hover:shadow-[0_14px_32px_-14px_rgba(0,0,0,0.7),0_0_60px_-6px_rgba(46,107,255,1)]"
      : "glass text-frost hover:border-[rgba(148,170,255,0.35)] hover:bg-[rgba(30,44,90,0.5)]",
    className
  );

  const inner = (
    <>
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2.5">
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
