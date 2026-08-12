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
import { SITE_URL } from "./site";

export const COMPANY = {
  /** Nombre comercial */
  brand: "Asenix",
  /** Tagline de marca (del manual de identidad) */
  tagline: "Digital Evolution",
  /** Razón social o nombre y apellidos si es autónomo */
  legalName: "[COMPLETAR: razón social o nombre y apellidos]",
  /** NIF / CIF */
  taxId: "[COMPLETAR: NIF/CIF]",
  /** Domicilio a efectos de notificaciones */
  address: "[COMPLETAR: domicilio completo]",
  /** Email de contacto y de ejercicio de derechos RGPD */
  email: "projects@asenix.es",
  /** Datos registrales, si la sociedad está inscrita (dejar vacío si no aplica) */
  registry: "",
  /**
   * Dominio público del sitio. Sale de la URL real del despliegue para que el
   * aviso legal no pueda declarar un dominio distinto del que sirve la web:
   * hoy es la de GitHub Pages y pasará a ser asenix.es en cuanto se defina
   * NEXT_PUBLIC_SITE_URL, sin tocar este archivo.
   */
  site: SITE_URL,
  /** Fecha de última revisión de los textos legales */
  updated: "2026-08-12",
} as const;
