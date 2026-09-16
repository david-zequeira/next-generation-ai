/**
 * Cliente de la agenda pública de ng-agent.
 *
 * Dos llamadas y nada más:
 *
 * - `availability(from, to)` — qué días del rango tienen hueco y a qué horas.
 *   Se pide un mes entero de una vez porque el calendario necesita saber qué
 *   días encender antes de que nadie haga clic; pedir día a día serían treinta
 *   peticiones para pintar una rejilla.
 * - `book(payload)` — crea la reserva. El backend revalida el hueco contra el
 *   calendario, así que un hueco que se ocupe entre la consulta y el envío se
 *   rechaza con `slot_taken` en vez de reservar dos veces.
 *
 * Sin `NEXT_PUBLIC_AGENT_URL` no hay agenda: la página lo detecta y manda a la
 * pantalla de mensaje en vez de enseñar un calendario que no puede reservar.
 */

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "";

export const bookingConfigured = Boolean(AGENT_URL);

/** Huecos libres por día local: `{ "2026-09-09": ["…T07:00:00.000Z", …] }`. */
export type Availability = Record<string, string[]>;

export type BookingPayload = {
  name: string;
  email: string;
  phone?: string;
  plan?: string;
  goals?: string;
  /** Instante UTC exacto del hueco elegido, tal cual lo devolvió la agenda. */
  startUtc: string;
  sessionId?: string;
  /** Honeypot: relleno solo por bots. */
  website?: string;
};

export type BookingOk = { ok: true; code: string };
export type BookingErr = { ok: false; reason: "slot_taken" | "invalid" | "network" };

async function json(res: Response): Promise<unknown> {
  return res.json().catch(() => ({}));
}

export async function availability(from: string, to: string, signal?: AbortSignal): Promise<Availability> {
  if (!AGENT_URL) return {};
  const url = `${AGENT_URL}/api/booking/availability?from=${from}&to=${to}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(String(res.status));
  const body = (await json(res)) as { days?: Availability };
  return body.days ?? {};
}

export async function book(payload: BookingPayload): Promise<BookingOk | BookingErr> {
  if (!AGENT_URL) return { ok: false, reason: "network" };
  try {
    const res = await fetch(`${AGENT_URL}/api/booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await json(res)) as { ok?: boolean; code?: string; error?: string };
    if (res.status === 409) return { ok: false, reason: "slot_taken" };
    if (!res.ok || !body.code) return { ok: false, reason: res.status === 400 ? "invalid" : "network" };
    return { ok: true, code: body.code };
  } catch {
    return { ok: false, reason: "network" };
  }
}

/** "YYYY-MM-DD" de una fecha, en hora local del visitante. */
export function isoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
