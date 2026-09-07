/**
 * Consentimiento de cookies y almacenamiento (LSSI-CE art. 22.2 + guía de la
 * AEPD). Aquí no hay cookies de terceros: la única categoría que necesita
 * permiso es la MEDICIÓN, porque une la visita (página, procedencia, campaña)
 * con la conversación que abra ese mismo visitante. Lo necesario (idioma,
 * hilo del chat mientras dura la pestaña, esta misma elección) no se pregunta.
 *
 * La elección vive en localStorage bajo una versión: si mañana cambia lo que
 * se pregunta, se sube VERSION y el aviso vuelve a salir a todo el mundo.
 */

export type Consent = {
  v: number;
  analytics: boolean;
  /** ISO de cuándo se decidió — la AEPD pide poder acreditarlo. */
  at: string;
};

const KEY = "ng-consent";
const VERSION = 1;

/** Se dispara en `window` cada vez que el visitante decide o cambia de opinión. */
export const CONSENT_EVENT = "ng:consent-change";
/** Cualquier sitio (el pie, la página de cookies) puede reabrir el panel. */
export const OPEN_EVENT = "ng:open-cookies";

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Partial<Consent>;
    if (c.v !== VERSION || typeof c.analytics !== "boolean") return null;
    return { v: VERSION, analytics: c.analytics, at: typeof c.at === "string" ? c.at : "" };
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean): Consent {
  const c: Consent = { v: VERSION, analytics, at: new Date().toISOString() };
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    // sin sitio en localStorage: la elección vale para esta página igualmente
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: c }));
  return c;
}

/** `true` solo si el visitante aceptó la medición de forma explícita. */
export function hasAnalyticsConsent(): boolean {
  return readConsent()?.analytics === true;
}

export function openCookiePreferences(): void {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}
