import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement as h } from "react";

/**
 * Tarjeta que se ve al compartir el enlace en WhatsApp, LinkedIn o X.
 *
 * Vive aquí y no en `app/opengraph-image.tsx` a propósito: esa convención de
 * Next exporta el archivo SIN extensión (`out/opengraph-image`), GitHub Pages
 * lo sirve como binario genérico y varios previsualizadores descartan la imagen
 * por el content-type. Generándola desde el postbuild controlamos el nombre
 * final (`og.png`) — y el metadata del layout puede apuntar a él con confianza.
 *
 * Lleva el lockup real de la marca (el del manual de identidad, versión clara
 * sobre fondo oscuro), incrustado como data URI porque el renderizador no hace
 * peticiones de red.
 *
 * Se escribe con createElement en vez de JSX porque el script corre en Node
 * directamente, sin paso de compilación.
 */

const VOID = "#05060A";
const FROST = "#E8ECF5";
const MIST = "#8A93A8";
const ELECTRIC = "#2E6BFF";
const NEON = "#38D4FF";

const lockup =
  "data:image/png;base64," +
  readFileSync(join(process.cwd(), "public", "logo-lockup.png")).toString("base64");

const headline = (text, color) =>
  h(
    "div",
    { style: { fontSize: 82, fontWeight: 800, lineHeight: 1.04, letterSpacing: -3, color } },
    text
  );

export const OG_SIZE = { width: 1200, height: 630 };

export function ogCard() {
  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: VOID,
        padding: 80,
        // Halo azul eléctrico: el mismo gesto que el hero de la landing
        backgroundImage:
          "radial-gradient(900px 420px at 15% 0%, rgba(46,107,255,0.30), transparent 65%)," +
          "radial-gradient(700px 380px at 100% 100%, rgba(56,212,255,0.18), transparent 60%)",
      },
    },
    h("img", { src: lockup, width: 300, style: { objectFit: "contain" } }),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column" } },
      headline("Building the Future", FROST),
      headline("of Business.", ELECTRIC)
    ),
    h(
      "div",
      { style: { display: "flex", alignItems: "center", gap: 20 } },
      h("div", { style: { width: 64, height: 3, background: NEON } }),
      h(
        "div",
        { style: { fontSize: 26, color: MIST } },
        "AI agents · Automation · Custom AI software"
      )
    )
  );
}
