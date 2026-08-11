/**
 * URL pública del sitio, en un único lugar: la usan el metadata de Open Graph,
 * el sitemap y el aviso legal.
 *
 * Al pasar a dominio propio basta con definir NEXT_PUBLIC_SITE_URL (y vaciar
 * NEXT_PUBLIC_BASE_PATH, que solo hace falta bajo /<repo>/ en GitHub Pages).
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Ojo: aquí NO vale `??`. Una variable de repo sin definir llega al workflow
// como CADENA VACÍA, no como undefined, y `??` la daría por buena — dejando
// SITE_URL a "" y reventando el build en `new URL("")`. Con `||` cae al
// valor por defecto tanto si falta como si viene vacía.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || `https://david-zequeira.github.io${BASE_PATH}`
).replace(/\/$/, "");

/** URL absoluta de una ruta del sitio ("/legal/cookies" → "https://…/legal/cookies"). */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
