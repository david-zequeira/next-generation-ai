"use client";

import Link from "next/link";
import { useDict, useLocale } from "@/i18n/LocaleContext";
import { LEGAL_SLUGS, legalLinkLabels } from "@/i18n/legal";
import { openCookiePreferences } from "@/lib/consent";

type IconProps = { className?: string };

/* Brand marks (Simple Icons paths) — lucide no longer ships brand logos. */
function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Sin perfiles sociales reales todavía: la lista queda vacía a propósito (tres
 * botones que llevaban a x.com/linkedin.com/github.com a secas eran peor señal
 * que no tenerlos). Al crear los perfiles, añadir aquí las URL completas.
 */
const SOCIALS: { label: string; href: string; icon: (p: IconProps) => React.JSX.Element }[] = [];
void XIcon;
void LinkedInIcon;
void GitHubIcon;

/**
 * Pie del Figma (1532:2424, «Frame 254»): sobre el mismo lavanda claro del
 * cierre, el isotipo en negro, la promesa de la marca, y a la derecha las
 * redes, los legales y el copyright. La lista de navegación vive arriba, en
 * «Hablemos» (FinalCTA).
 */
export default function Footer({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const dict = useDict();
  const { locale } = useLocale();
  const t = dict.footer;

  return (
    <footer className={dark ? "relative bg-[#060e29] text-white" : "relative bg-paper text-ink"}>
      {/* Figma: isotipo negro de 68 px, promesa en Montserrat 16/24 (la primera frase en SemiBold, ancho 459),
          y a la derecha, apilados: redes, legales (600 · 14 · UPPER) y «© 2026 Asenix» + derechos en 14; sin línea superior */}
      <div className="mx-auto max-w-[1920px] px-5 pb-u-110 pt-u-40 md:px-10 xl:px-[12.5%]">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-u-23">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE}/isotipo.png`}
              alt="Asenix"
              className={`h-u-68 w-auto brightness-0 ${dark ? "invert" : ""}`}
            />
            <div className={`max-w-u-459 fs-u-16 lh-u-24 ${dark ? "text-white/90" : "text-[#04050a]/90"}`}>
              <p className="font-display font-semibold">{t.tagline}</p>
              <p className="text-pretty">{t.sub}</p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end">
            {/* Figma: redes (y 587) → legales (centro y 678) → © (centro y 706): filas de texto a 28 px de paso */}
            <div className="flex flex-col items-start md:items-end">
              {SOCIALS.length > 0 && (
                <div className="mb-u-36 flex gap-2">
                  {SOCIALS.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      // Figma: círculos de 41 px en #161614 con el icono en blanco
                      className="flex size-u-41 items-center justify-center rounded-full bg-[#161614] text-white transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <Icon className="size-u-20" />
                    </a>
                  ))}
                </div>
              )}
              {/* Legal: obligatorio (LSSI-CE/RGPD) y, de paso, señal de seriedad */}
              <ul className={`flex flex-wrap justify-start gap-x-3 font-display fs-u-14 lh-u-28 font-semibold uppercase tracking-[0.07em] md:justify-end ${dark ? "text-white" : "text-black"}`}>
                {LEGAL_SLUGS.map((slug, i) => (
                  <li key={slug} className="flex gap-3">
                    {i > 0 && <span aria-hidden>/</span>}
                    <Link href={`/legal/${slug}`} className="transition-colors duration-200 hover:text-electric">
                      {legalLinkLabels[locale][slug]}
                    </Link>
                  </li>
                ))}
                <li className="flex gap-3">
                  <span aria-hidden>/</span>
                  {/* Retirar el consentimiento tiene que ser tan fácil como darlo */}
                  <button
                    type="button"
                    onClick={openCookiePreferences}
                    className="cursor-pointer uppercase tracking-[0.07em] transition-colors duration-200 hover:text-electric"
                  >
                    {dict.cookies.footerLink}
                  </button>
                </li>
              </ul>
              {/* Figma: «© 2026 Asenix» 700 negro (override) + «Todos los derechos reservados.» 500 #586a96 · 14 · ls 0,07 em, una línea */}
              <p className="font-display fs-u-14 lh-u-28 tracking-[0.07em] md:text-right">
                <span className={`font-bold ${dark ? "text-white" : "text-black"}`}>© {new Date().getFullYear()} Asenix</span>{" "}
                <span className={`font-medium ${dark ? "text-white/60" : "text-slate"}`}>{t.rights}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
