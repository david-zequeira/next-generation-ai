"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useDict } from "@/i18n/LocaleContext";

function Word({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.13, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}

/**
 * Puente narrativo entre capítulos: una sola frase-manifiesto cuyas
 * palabras se encienden una a una conforme el scroll las atraviesa.
 * El lector "escribe" la frase con su propio movimiento — el momento
 * de respiración que convierte secciones en historia.
 */
export default function Bridge({ id }: { id: "era" | "proof" | "leap" }) {
  const dict = useDict();
  const text = dict.bridges[id];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.4"],
  });
  const words = text.split(" ");

  return (
    <div
      ref={ref}
      className="relative mx-auto flex max-w-4xl items-center justify-center px-6 py-32 md:py-56"
    >
      <p className="display text-center text-[clamp(1.5rem,3.4vw,2.9rem)] leading-snug text-frost">
        <span className="text-pulse/80">{"//"} </span>
        {words.map((w, i) => (
          <Word
            key={`${id}-${i}`}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
          >
            {w}
          </Word>
        ))}
      </p>
    </div>
  );
}
