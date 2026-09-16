/**
 * Medidor de píxeles sobre las capturas del prototipo de Figma.
 *
 *   node measure.mjs <png> px <x> <y> [<x> <y> …]     → color en esos puntos
 *   node measure.mjs <png> row <y> [x0] [x1]          → saltos de color a lo largo de la fila
 *   node measure.mjs <png> col <x> [y0] [y1]          → saltos de color a lo largo de la columna
 *   node measure.mjs <png> box <x0> <y0> <x1> <y1>    → colores únicos de la región, por frecuencia
 *   node measure.mjs <png> bbox <x0> <y0> <x1> <y1> [tol]
 *        → caja de lo que no es fondo dentro de la región (el fondo se toma de
 *          la esquina superior izquierda), y el perfil de filas con tinta
 */
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const argv = process.argv.slice(2);
const outIdx = argv.indexOf("--out");
const flagOut = outIdx < 0 ? null : argv.splice(outIdx, 2)[1];
const [file, mode, ...rest] = argv;
const b64 = readFileSync(resolve(file)).toString("base64");

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
const out = await page.evaluate(
  async ({ b64, mode, rest }) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(img, 0, 0);
    const data = g.getImageData(0, 0, c.width, c.height).data;
    const at = (x, y) => {
      const i = (y * c.width + x) * 4;
      return [data[i], data[i + 1], data[i + 2]];
    };
    const hex = ([r, gg, b]) =>
      "#" + [r, gg, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    const n = (i, d) => (rest[i] === undefined ? d : Number(rest[i]));
    const dist = (a, b) =>
      Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);

    if (mode === "px") {
      const res = [];
      for (let i = 0; i + 1 < rest.length; i += 2)
        res.push(`(${rest[i]},${rest[i + 1]}) ${hex(at(Number(rest[i]), Number(rest[i + 1])))}`);
      return { size: [c.width, c.height], res };
    }

    if (mode === "row" || mode === "col") {
      const along = mode === "row";
      const fixed = n(0, 0);
      const from = n(1, 0);
      const to = n(2, along ? c.width - 1 : c.height - 1);
      const res = [];
      let prev = along ? at(from, fixed) : at(fixed, from);
      for (let v = from + 1; v <= to; v++) {
        const cur = along ? at(v, fixed) : at(fixed, v);
        if (dist(prev, cur) > 12) res.push(`${v}: ${hex(prev)} → ${hex(cur)}`);
        prev = cur;
      }
      return { size: [c.width, c.height], res };
    }

    if (mode === "box") {
      const [x0, y0, x1, y1] = [n(0, 0), n(1, 0), n(2, c.width - 1), n(3, c.height - 1)];
      const tally = new Map();
      for (let y = y0; y <= y1; y++)
        for (let x = x0; x <= x1; x++) {
          const k = hex(at(x, y));
          tally.set(k, (tally.get(k) ?? 0) + 1);
        }
      const res = [...tally.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 14)
        .map(([k, v]) => `${k} ×${v}`);
      return { size: [c.width, c.height], res };
    }
    if (mode === "crop") {
      // Recorte ampliado de una región, para mirarla de cerca.
      const [x0, y0, x1, y1] = [n(0, 0), n(1, 0), n(2, c.width - 1), n(3, c.height - 1)];
      const z = n(4, 4);
      const w = x1 - x0 + 1, h = y1 - y0 + 1;
      const o = document.createElement("canvas");
      o.width = w * z;
      o.height = h * z;
      const og = o.getContext("2d");
      og.imageSmoothingEnabled = false;
      og.drawImage(c, x0, y0, w, h, 0, 0, w * z, h * z);
      return { size: [c.width, c.height], dataUrl: o.toDataURL("image/png"), res: [`recorte ${w}×${h} ×${z}`] };
    }

    if (mode === "bands") {
      // Líneas de texto de una región: filas con tinta agrupadas en bandas
      // consecutivas, y de cada banda su caja. El fondo se toma de (x0,y0).
      const [x0, y0, x1, y1] = [n(0, 0), n(1, 0), n(2, c.width - 1), n(3, c.height - 1)];
      const tol = n(4, 40);
      const bg = at(x0, y0);
      const bands = [];
      let cur = null;
      for (let y = y0; y <= y1; y++) {
        let first = -1, last = -1;
        for (let x = x0; x <= x1; x++)
          if (dist(at(x, y), bg) > tol) {
            if (first < 0) first = x;
            last = x;
          }
        if (first < 0) {
          cur = null;
          continue;
        }
        if (!cur) bands.push((cur = { y0: y, y1: y, x0: first, x1: last }));
        else {
          cur.y1 = y;
          cur.x0 = Math.min(cur.x0, first);
          cur.x1 = Math.max(cur.x1, last);
        }
      }
      const res = [`fondo ${hex(bg)}`];
      let prev = null;
      for (const b of bands) {
        res.push(
          `y${b.y0}…${b.y1} (${b.y1 - b.y0 + 1})  x${b.x0}…${b.x1} (${b.x1 - b.x0 + 1})` +
            (prev ? `  ·  +${b.y0 - prev.y0} desde la anterior` : "")
        );
        prev = b;
      }
      return { size: [c.width, c.height], res };
    }

    if (mode === "bbox") {
      const [x0, y0, x1, y1] = [n(0, 0), n(1, 0), n(2, c.width - 1), n(3, c.height - 1)];
      const tol = n(4, 24);
      const bg = at(x0, y0);
      let minX = Infinity, minY = Infinity, maxX = -1, maxY = -1;
      const rows = [];
      for (let y = y0; y <= y1; y++) {
        let count = 0, first = -1, last = -1;
        for (let x = x0; x <= x1; x++) {
          if (dist(at(x, y), bg) > tol) {
            count++;
            if (first < 0) first = x;
            last = x;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
        if (count) rows.push(`y${y}: ${count}px  x${first}…${last}`);
      }
      const res = [
        `fondo ${hex(bg)}`,
        maxX < 0
          ? "sin tinta en la región"
          : `caja x${minX}…${maxX} (${maxX - minX + 1}) · y${minY}…${maxY} (${maxY - minY + 1})`,
        ...rows,
      ];
      return { size: [c.width, c.height], res };
    }

    return { error: "modo desconocido" };
  },
  { b64, mode, rest }
);
console.log(out.size?.join("×"));
for (const line of out.res ?? []) console.log(line);
if (out.dataUrl) {
  const dest = flagOut ?? "/tmp/crop.png";
  writeFileSync(dest, Buffer.from(out.dataUrl.split(",")[1], "base64"));
  console.log(`→ ${dest}`);
}
await browser.close();
