"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSessionId } from "@/lib/session";
import { CONSENT_EVENT, hasAnalyticsConsent, type Consent } from "@/lib/consent";

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "";

/**
 * Pageview mínimo y sin cookies hacia ng-agent (POST /api/track).
 *
 * Con consentimiento de medición viaja el MISMO sessionId que usa el chat, y
 * así una visita con UTM se une a la conversación que abra ese visitante
 * (atribución real de campañas). Sin consentimiento se cuenta la visita igual,
 * pero con un identificador aleatorio de un solo uso que no se guarda en
 * ningún sitio: números agregados, ninguna persona detrás.
 *
 * `usePathname` como dependencia a propósito: este componente vive en el
 * layout, que NO se remonta en las navegaciones cliente de App Router — sin
 * la dependencia, ir de `/` a `/precios` no contaba como pageview.
 */
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!AGENT_URL) return;

    const send = (linked: boolean) => {
      try {
        const params = new URLSearchParams(window.location.search);
        fetch(`${AGENT_URL}/api/track`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          body: JSON.stringify({
            sessionId: linked ? getSessionId() : crypto.randomUUID(),
            path: pathname,
            referrer: document.referrer || undefined,
            utmSource: params.get("utm_source") ?? undefined,
            utmMedium: params.get("utm_medium") ?? undefined,
            utmCampaign: params.get("utm_campaign") ?? undefined,
          }),
        }).catch(() => {});
      } catch {
        // el tracking jamás rompe la landing
      }
    };

    send(hasAnalyticsConsent());

    // Si el visitante acepta la medición ya dentro de la página, la visita en
    // curso pasa a contar con su sesión: es la que traía la campaña.
    const onConsent = (e: Event) => {
      const c = (e as CustomEvent<Consent>).detail;
      if (c?.analytics) send(true);
    };
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, [pathname]);

  return null;
}
