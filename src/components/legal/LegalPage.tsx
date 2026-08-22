"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";
import { LEGAL_SLUGS, legalDocs, legalLinkLabels, type LegalSlug } from "@/i18n/legal";

/**
 * Páginas legales: sobrias a propósito. El resto del sitio es cinematográfico;
 * aquí lo único que importa es que se lea sin fricción y que quede claro quién
 * responde de qué. Comparten el idioma activo con la landing (mismo contexto).
 */
export default function LegalPage({ slug }: { slug: LegalSlug }) {
  const { locale } = useLocale();
  const doc = legalDocs[locale][slug];
  const labels = legalLinkLabels[locale];
  const back = locale === "es" ? "Volver al inicio" : "Back to home";
  const updated = locale === "es" ? "Última actualización" : "Last updated";

  return (
    <main className="min-h-screen bg-void">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-mist transition-colors duration-200 hover:text-frost"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
          {back}
        </Link>

        <header className="mt-10 border-b border-line pb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo-lockup.png`}
            alt="Asenix"
            className="h-8 w-auto"
          />
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-frost md:text-5xl">
            {doc.title}
          </h1>
          <p className="mt-3 text-sm text-mist/70">
            {updated}: {doc.updated}
          </p>
        </header>

        <p className="mt-8 text-lg leading-relaxed text-mist">{doc.intro}</p>

        <div className="mt-12 space-y-10">
          {doc.sections.map((section) => (
            // scroll-mt: que el ancla (#agente-de-voz desde el widget de voz)
            // no aterrice con el título pegado al borde superior.
            <section key={section.heading} id={section.id} className="scroll-mt-24">
              <h2 className="font-display text-xl font-bold text-frost">{section.heading}</h2>
              {section.body?.map((paragraph) => (
                <p key={paragraph} className="mt-4 leading-relaxed text-mist">
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="mt-4 space-y-2.5">
                  {section.list.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed text-mist">
                      <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-neon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <nav
          aria-label={locale === "es" ? "Otras páginas legales" : "Other legal pages"}
          className="mt-16 flex flex-wrap gap-x-7 gap-y-3 border-t border-line pt-8"
        >
          {LEGAL_SLUGS.filter((s) => s !== slug).map((s) => (
            <Link
              key={s}
              href={`/legal/${s}`}
              className="text-sm text-mist transition-colors duration-200 hover:text-frost"
            >
              {labels[s]}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
