/**
 * Identidad de sesión compartida entre el web-chat y el tracking de visitas.
 * Al usar el MISMO sessionId, ng-agent puede unir la visita (con sus UTM) con
 * la conversación que abra ese visitante — atribución real de campañas.
 */
const KEY = "ng-chat-session";

export function getSessionId(): string {
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(KEY, id);
  }
  return id;
}
