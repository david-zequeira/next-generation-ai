"use client";

import { useEffect } from "react";
import { getSessionId } from "@/lib/session";

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "";

/**
 * Pageview mínimo y sin cookies hacia ng-agent (POST /api/track).
 * Envía el mismo sessionId que usa el chat, la ruta, el referrer y los UTM de
 * la URL, para que el panel de growth tenga visitantes reales y atribución de
 * campañas. Best-effort: si el backend no responde, la landing ni se entera.
 */
export default function Analytics() {
  useEffect(() => {
    if (!AGENT_URL) return;
    try {
      const params = new URLSearchParams(window.location.search);
      fetch(`${AGENT_URL}/api/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          sessionId: getSessionId(),
          path: window.location.pathname,
          referrer: document.referrer || undefined,
          utmSource: params.get("utm_source") ?? undefined,
          utmMedium: params.get("utm_medium") ?? undefined,
          utmCampaign: params.get("utm_campaign") ?? undefined,
        }),
      }).catch(() => {});
    } catch {
      // el tracking jamás rompe la landing
    }
  }, []);

  return null;
}
