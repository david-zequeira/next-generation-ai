/**
 * Datos identificativos de la empresa — la ÚNICA pieza que hay que rellenar para
 * que las páginas legales sean válidas. Vive aquí y no dentro de los textos para
 * poder reutilizar toda la landing como plantilla de otro cliente cambiando
 * un solo archivo.
 *
 * ⚠️ Los valores entre corchetes son marcadores a propósito: si se publican sin
 * rellenar, se ven a simple vista en la web. Es preferible a inventar un NIF o
 * un domicilio, que sería peor que no tener aviso legal.
 *
 * Obligatorio por la LSSI-CE (art. 10) y el RGPD (arts. 13-14).
 */
export const COMPANY = {
  /** Nombre comercial */
  brand: "Next Generation AI",
  /** Razón social o nombre y apellidos si es autónomo */
  legalName: "[COMPLETAR: razón social o nombre y apellidos]",
  /** NIF / CIF */
  taxId: "[COMPLETAR: NIF/CIF]",
  /** Domicilio a efectos de notificaciones */
  address: "[COMPLETAR: domicilio completo]",
  /** Email de contacto y de ejercicio de derechos RGPD */
  email: "hello@nextgeneration.ai",
  /** Datos registrales, si la sociedad está inscrita (dejar vacío si no aplica) */
  registry: "",
  /** Dominio público del sitio */
  site: "https://david-zequeira.github.io/next-generation-ai",
  /** Fecha de última revisión de los textos legales */
  updated: "2026-08-11",
} as const;
