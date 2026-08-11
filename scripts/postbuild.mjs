import { writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";
import { OG_SIZE, ogCard } from "./og-card.mjs";

// `next/og` se publica como CommonJS y sin mapa de exports, así que el import
// ESM directo no lo resuelve; con createRequire se carga tal cual.
const { ImageResponse } = createRequire(import.meta.url)("next/og");

/**
 * Remate del export estático: genera `out/og.png`, la tarjeta que se ve al
 * compartir el enlace. Sin ella, el enlace de una agencia de IA aparece como un
 * recuadro gris — la peor primera impresión y la más fácil de evitar.
 *
 * Se hace aquí, y no con la convención `app/opengraph-image.tsx`, para que el
 * archivo salga con extensión `.png`: GitHub Pages sirve los archivos sin
 * extensión como binario genérico y varios previsualizadores los descartan.
 */
const OUT = join(process.cwd(), "out");

const image = new ImageResponse(ogCard(), OG_SIZE);
const bytes = Buffer.from(await image.arrayBuffer());
await writeFile(join(OUT, "og.png"), bytes);

console.log(`postbuild: out/og.png generado (${OG_SIZE.width}×${OG_SIZE.height}, ${bytes.length} bytes)`);
