/**
 * Datos identificativos de la empresa — la ÚNICA pieza que hay que rellenar para
 * que las páginas legales sean válidas. Vive aquí y no dentro de los textos para
 * poder reutilizar toda la landing como plantilla de otro cliente cambiando
 * un solo archivo.
 *
 * ⚠️ Un campo VACÍO se omite de las páginas legales (no se publica ningún
 * marcador). La sociedad está en constitución: en cuanto existan razón social,
 * NIF y domicilio, rellenarlos aquí y las líneas aparecen solas. Hasta
 * entonces la identificación mínima es el email de contacto. Nunca inventar
 * un NIF o un domicilio: eso sí es peor que la omisión temporal.
 *
 * Obligatorio por la LSSI-CE (art. 10) y el RGPD (arts. 13-14).
 */
import { SITE_URL } from "./site";

export const COMPANY = {
  /** Nombre comercial */
  brand: "Asenix",
  /** Tagline de marca (del manual de identidad) */
  tagline: "Digital Evolution",
  /** Razón social o nombre y apellidos si es autónomo (vacío = se omite) */
  legalName: "",
  /** NIF / CIF (vacío = se omite) */
  taxId: "",
  /** Domicilio a efectos de notificaciones (vacío = se omite) */
  address: "",
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
  updated: "2026-08-18",
} as const;
