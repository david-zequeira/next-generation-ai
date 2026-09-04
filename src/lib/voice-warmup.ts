const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "";

/** Una sola vez por pestaña: calentar dos veces no calienta más. */
let warmed = false;

/**
 * Calentamiento del modo voz, en `pointerenter`/`focus` de cualquier CTA de
 * voz. Dos cosas que hoy se pagan EN el clic y ahí duelen:
 *
 * 1. El bundle del SDK de Retell (arrastra livekit-client). Descargarlo
 *    después de pedir el token quemaría parte de los 30 s de vida del token.
 * 2. El backend en el plan gratuito de Render, que se duerme: el primer
 *    request tras la siesta tarda ~40 s. Es el mismo ping que hace el
 *    ChatWidget, por el mismo motivo.
 *
 * El token NO se pide aquí: caduca en 30 s y pasar el ratón por encima de un
 * botón no es intención de llamar.
 *
 * Best-effort absoluto: cualquier fallo se traga: esto no puede romper una
 * página por adelantar trabajo.
 */
export function warmUpVoice(): void {
  if (warmed || !AGENT_URL) return;
  warmed = true;
  // Import dinámico a propósito: uno estático metería livekit-client en el
  // bundle inicial de la home.
  void import("retell-client-js-sdk").catch(() => {});
  fetch(`${AGENT_URL}/api/health`).catch(() => {});
}
