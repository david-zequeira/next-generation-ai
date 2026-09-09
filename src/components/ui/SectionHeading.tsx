import type { ReactNode } from "react";
import TextReveal from "@/components/ui/TextReveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Etiqueta «//…» dentro de la pastilla. */
  eyebrow: string;
  /** Una o dos líneas de titular; cada una se revela por separado. */
  title: string | [string, string];
  sub?: ReactNode;
  /** Pastilla con borde en degradado (tecnología, calculadora, planes). */
  gradientEyebrow?: boolean;
  /** Alineación: el Figma centra todas las cabeceras salvo la de pruebas. */
  align?: "center" | "left";
  /** Tamaño del subtítulo: 20/28 por defecto; 24/32 en Proceso; 18/28 en Tecnología y Planes. */
  subSize?: 18 | 20 | 24;
  className?: string;
  titleClassName?: string;
};

/**
 * Cabecera de sección del Figma «Asenix Web»: pastilla-eyebrow, titular
 * Montserrat Bold 52/54 y subtítulo #c7d7ff de hasta 952 px, todo centrado.
 * Los tamaños salen de las utilidades `*-u-N` (px del Figma a 1920).
 */
export default function SectionHeading({
  eyebrow,
  title,
  sub,
  gradientEyebrow = false,
  align = "center",
  subSize = 20,
  className,
  titleClassName,
}: SectionHeadingProps) {
  const lines = Array.isArray(title) ? title : [title];
  const centered = align === "center";
  return (
    <div className={cn("flex flex-col", centered ? "items-center text-center" : "items-start text-left", className)}>
      <p className={cn("eyebrow", gradientEyebrow && "eyebrow-gradient")}>{eyebrow}</p>
      <h2 className={cn("h2-section mt-u-56", titleClassName)}>
        {lines.map((line, i) => (
          <TextReveal key={line} as="span" text={line} delay={i * 0.2} className="block font-bold" />
        ))}
      </h2>
      {sub && (
        <p
          className={cn(
            "sub-section mt-u-24",
            subSize === 24 && "fs-u-24 lh-u-32 text-cloud/80",
            subSize === 18 && "fs-u-18 lh-u-28"
          )}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
