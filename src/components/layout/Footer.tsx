"use client";

import Link from "next/link";
import { useDict, useLocale } from "@/i18n/LocaleContext";
import { LEGAL_SLUGS, legalLinkLabels } from "@/i18n/legal";

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

const HREFS = ["/#future", "/#services", "/#ecosystem", "/#work", "/#process"];
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
 * Pie del Figma: sobre el mismo lavanda claro del cierre, el isotipo en
 * negro, la promesa de la marca, y a la derecha el copyright y los legales.
 */
export default function Footer({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const dict = useDict();
  const { locale } = useLocale();
  const t = dict.footer;
  const links = [
    ...dict.nav.links.map((label, i) => ({ label, href: HREFS[i] })),
    { label: dict.nav.calc, href: "/calculadora" },
    { label: dict.nav.pricing, href: "/precios" },
    { label: t.contact, href: "/contacto" },
  ];

  return (
    <footer className={dark ? "relative bg-[#060e29] text-white" : "relative bg-paper text-ink"}>
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-6 md:pb-16">
        <div className={`flex flex-col gap-10 border-t pt-10 md:flex-row md:items-end md:justify-between ${dark ? "border-white/10" : "border-ink/10"}`}>
          <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE}/isotipo.png`}
              alt="Asenix"
              className={`h-12 w-auto brightness-0 md:h-14 ${dark ? "invert" : ""}`}
            />
            <div>
              <p className={`font-display text-[15px] font-bold ${dark ? "text-white" : "text-ink"}`}>{t.tagline}</p>
              <p className={`mt-1 max-w-sm text-sm leading-relaxed ${dark ? "text-white/65" : "text-ink/65"}`}>{t.sub}</p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-5 md:items-end">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <p className={`font-display text-[12px] font-semibold ${dark ? "text-white" : "text-ink"}`}>
                © {new Date().getFullYear()} Asenix
              </p>
              {/* Legal: obligatorio (LSSI-CE/RGPD) y, de paso, señal de seriedad */}
              <ul className={`flex flex-wrap gap-x-3 font-display text-[12px] font-semibold uppercase tracking-[0.1em] ${dark ? "text-white" : "text-ink"}`}>
                {LEGAL_SLUGS.map((slug, i) => (
                  <li key={slug} className="flex gap-3">
                    {i > 0 && <span aria-hidden>/</span>}
                    <Link href={`/legal/${slug}`} className="transition-colors duration-200 hover:text-electric">
                      {legalLinkLabels[locale][slug]}
                    </Link>
                  </li>
                ))}
              </ul>
              {SOCIALS.length > 0 && (
                <div className="flex gap-2">
                  {SOCIALS.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <nav aria-label={t.navAria}>
              <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-xs ${dark ? "text-white/55" : "text-ink/55"}`}>
                {links.map((item) => (
                  <li key={item.href}>
                    {item.href.startsWith("/#") ? (
                      <a href={item.href} className="transition-colors duration-200 hover:text-electric">
                        {item.label}
                      </a>
                    ) : (
                      <Link href={item.href} className="transition-colors duration-200 hover:text-electric">
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <p className={`mt-8 text-[11px] ${dark ? "text-white/40" : "text-ink/40"}`}>{t.rights}</p>
      </div>
    </footer>
  );
}
