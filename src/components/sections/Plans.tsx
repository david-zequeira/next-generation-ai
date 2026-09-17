"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";
import { pricingDicts } from "@/i18n/pricing";
import { trackEvent } from "@/lib/track";

/**
 * La estrella del Figma (capa «i1», 40×40, exportada del propio diseño): un
 * destello de cuatro puntas. Toma el color del texto y late con `animate-sparkle`.
 */
function FigmaSparkle({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden
      className={cn("animate-sparkle origin-center", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      <path
        fill="currentColor"
        d="M19.514 0.351486C19.6876 -0.117162 20.3124 -0.117162 20.486 0.351486L22.3432 5.4719C24.3914 11.1478 28.8522 15.626 34.5281 17.6741L39.6485 19.514C40.1172 19.6876 40.1172 20.3298 39.6485 20.5034L34.5281 22.3432C28.8522 24.3914 24.3914 28.8522 22.3432 34.5281L20.486 39.6485C20.3124 40.1172 19.6876 40.1172 19.514 39.6485L17.6568 34.5281C15.6086 28.8522 11.1478 24.3914 5.4719 22.3432L0.351486 20.5034C-0.117162 20.3298 -0.117162 19.6876 0.351486 19.514L5.4719 17.6741C11.1478 15.626 15.6086 11.1478 17.6568 5.4719L19.514 0.351486Z"
      />
    </svg>
  );
}

/**
 * Sección 9 — «Planes simples que escalan contigo» (Figma): tres tarjetas de
 * 301×88 con radio 30; la recomendada en azul con el precio en lima, las
 * otras blancas con el precio en azul, y una estrella de 41 px asomando por
 * la esquina superior derecha. Los nombres y precios salen del diccionario
 * de /precios: aquí no se escribe ninguna tarifa a mano.
 *
 * ---
 *
 * **Cambio del 17/09/2026 — la cuota manda, la puesta en marcha acompaña.**
 *
 * Hasta hoy la tarjeta enseñaba SOLO «2.900 € de puesta en marcha» y callaba
 * los 349 €/mes. Es el orden exacto al revés de lo que hace el dueño de un
 * negocio al leerla: la cuota la compara con una nómina y la entiende en un
 * segundo; el desembolso inicial le parece una obra y le cierra la página
 * antes de llegar a /precios, que es donde estaba bien resuelto desde el
 * principio. Enseñar el número que asusta y esconder el que convence es
 * regalar la conversión en la única pantalla que ve casi todo el mundo.
 *
 * Ahora la tarjeta repite la jerarquía de /precios: cuota en grande con la
 * etiqueta «servicio gestionado» (la palabra de la tarifa; nunca
 * «mantenimiento»), y la puesta en marcha debajo, en pequeño y sin esconderse.
 * El Figma daba 88 px de alto fijos para dos líneas — pasa a `min-h` para que
 * la tercera quepa sin recortar nada.
 *
 * Los tres textos siguen saliendo del diccionario de /precios (`mrr`,
 * `mrrNote`, `setup`): si mañana cambia un precio, esta sección lo sigue sola
 * en vez de quedarse mintiendo, igual que hace la calculadora.
 */
/**
 * Parte la nota de la cuota («/mes · servicio gestionado») por el punto medio:
 * la unidad va pegada al número y la etiqueta baja a su propia línea.
 *
 * No es cosmética. En 301 px la nota entera cabe tras «349 €» pero no tras
 * «desde 1.900 €», así que el salto lo decidía el ancho: una tarjeta rompía y
 * la de al lado no. Partiéndola aquí, las tres rompen por el mismo sitio.
 *
 * Si algún día la nota deja de llevar «·», se pinta entera y no pasa nada.
 */
function splitMrrNote(note: string): [string, string | null] {
  const i = note.indexOf("·");
  if (i < 0) return [note, null];
  return [note.slice(0, i).trimEnd(), note.slice(i + 1).trimStart()];
}

export default function Plans() {
  const { locale, dict } = useLocale();
  const t = dict.plans;
  const plans = pricingDicts[locale].plans;

  return (
    <section id="plans" className="relative bg-void pt-u-63 pb-u-90">
      <div className="mx-auto max-w-5xl px-6 text-center" key={locale}>
        <SectionHeading eyebrow={t.eyebrow} title={[t.titleA, t.titleB]} sub={t.sub} subClassName="max-w-u-950" />

        <ul className="mt-u-86 flex flex-wrap items-stretch justify-center gap-u-10">
          {plans.map((p, i) => {
            const [unit, tag] = splitMrrNote(p.mrrNote);
            return (
            <motion.li
              key={p.name}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex"
            >
              <Link
                href="/precios"
                onClick={() => trackEvent("cta_plans_home")}
                className={cn(
                  // `h-full` + `items-stretch` en la lista: la cuota de Nexus («desde
                  // 1.900 €/mes · servicio gestionado») ocupa dos líneas y las tres
                  // tarjetas tienen que seguir midiendo lo mismo.
                  "group relative flex h-full min-h-u-88 w-u-301 cursor-pointer flex-col items-center justify-center gap-u-4 rounded-u-30 px-u-16 py-u-14 text-center transition-all duration-300 hover:-translate-y-0.5",
                  p.star
                    ? "border border-electric bg-[linear-gradient(180deg,#1a4dff_0%,#102e99_100%)] text-white"
                    : "bg-white text-black hover:bg-cloud"
                )}
              >
                {/* La estrella (41 px) asoma 20 px por encima del borde, a 48 px de la esquina derecha */}
                <FigmaSparkle
                  delay={i * 0.4}
                  className={cn(
                    "absolute -top-[max(12px,20*var(--u))] right-[max(28px,48*var(--u))] size-u-41",
                    p.star ? "text-neon" : "text-electric"
                  )}
                />
                <span className="font-display fs-u-24 lh-u-30 font-semibold">{p.name}</span>

                {/* La cuota, en grande: es el número que el dueño compara con una nómina */}
                <span className={cn("leading-none", p.star ? "text-neon" : "text-electric")}>
                  <span className="font-display fs-u-20 font-semibold">{p.mrr}</span>
                  <span className="fs-u-12 font-medium">{unit}</span>
                </span>

                {/* «servicio gestionado», la palabra de la tarifa — nunca «mantenimiento» */}
                {tag && (
                  <span className={cn("fs-u-11 font-medium leading-none", p.star ? "text-neon/75" : "text-electric/75")}>
                    {tag}
                  </span>
                )}

                {/* La puesta en marcha, debajo: ni escondida ni de protagonista */}
                <span className={cn("fs-u-12 leading-none", p.star ? "text-white/70" : "text-black/60")}>
                  {p.setupPrefix ? `${p.setupPrefix} ` : ""}
                  {p.setup} {t.setup}
                </span>
              </Link>
            </motion.li>
            );
          })}
        </ul>

        {/* Figma: «¿Necesitas algo personalizado? Habla con nuestro equipo →», Medium 14/24; la pregunta en #ecefff (override del nodo) y el enlace en #1cfcb9 */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="link-mint mt-u-122 font-display text-frost"
        >
          {t.question}{" "}
          <Link
            href="/contacto"
            onClick={() => trackEvent("cta_plans_custom_home")}
            className="group inline-flex items-center gap-1 text-mint underline underline-offset-2 transition-colors hover:text-white"
          >
            {t.link}
            <ArrowRight className="size-u-18 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.p>
        <p className="mt-u-12 fs-u-12 text-mist/70">
          <Link href="/precios" className="transition-colors hover:text-frost">
            {t.all}
          </Link>
        </p>
      </div>
    </section>
  );
}
