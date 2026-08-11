/**
 * URL pública del sitio, en un único lugar: la usan el metadata de Open Graph,
 * el sitemap y el aviso legal.
 *
 * Al pasar a dominio propio basta con definir NEXT_PUBLIC_SITE_URL (y vaciar
 * NEXT_PUBLIC_BASE_PATH, que solo hace falta bajo /<repo>/ en GitHub Pages).
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? `https://david-zequeira.github.io${BASE_PATH}`
).replace(/\/$/, "");

/** URL absoluta de una ruta del sitio ("/legal/cookies" → "https://…/legal/cookies"). */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
