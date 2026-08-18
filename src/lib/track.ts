import { getSessionId } from "@/lib/session";

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "";

/**
 * Evento de conversión hacia ng-agent (POST /api/track con `event`): clic en el
 * CTA de un plan, apertura del chat, envío del formulario… Es lo que separa
 * "cuánta gente pasó" de "cuánta gente hizo algo que vale dinero".
 * Best-effort, como el pageview: jamás rompe ni frena la página.
 */
export function trackEvent(event: string): void {
  if (!AGENT_URL) return;
  try {
    fetch(`${AGENT_URL}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        sessionId: getSessionId(),
        path: window.location.pathname,
        event,
      }),
    }).catch(() => {});
  } catch {
    // la medición jamás rompe la página
  }
}
