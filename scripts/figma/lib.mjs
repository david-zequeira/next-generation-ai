import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Utilidades compartidas por `pull-home.mjs` (red) y `spec-home.mjs` (sin red).
 *
 * La API REST de Figma devuelve colores en 0–1, `letterSpacing` en px y los
 * degradados como posiciones de asas normalizadas al nodo. Aquí se traduce todo
 * a CSS legible para poder compararlo con las clases de Tailwind del sitio.
 */

/** Lee FIGMA_TOKEN del entorno o de `.env.local` (parser mínimo, sin dotenv). */
export async function loadEnvToken(root = process.cwd()) {
  if (process.env.FIGMA_TOKEN) return process.env.FIGMA_TOKEN.trim();
  let text = "";
  try {
    text = await readFile(join(root, ".env.local"), "utf8");
  } catch {
    // sin .env.local: cae al error de abajo
  }
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim().replace(/^export\s+/, "");
    if (key !== "FIGMA_TOKEN") continue;
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (value) return value;
  }
  throw new Error(
    "FIGMA_TOKEN no está en .env.local ni en el entorno. Créalo en Figma → Settings → Security → Personal access tokens (File content: read) y añade FIGMA_TOKEN=… a .env.local"
  );
}

export function slugify(name, fallback = "nodo") {
  const s = String(name ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || fallback;
}

export const round = (n, d = 1) => {
  if (typeof n !== "number" || Number.isNaN(n)) return n;
  const f = 10 ** d;
  return Math.round(n * f) / f;
};

export function toHex({ r, g, b }) {
  return "#" + [r, g, b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
}

/** Color de Figma (0–1) → `#rrggbb` o `rgba(...)` si lleva alfa. */
export function colorToCss(color, opacity = 1) {
  if (!color) return "";
  const a = round((color.a ?? 1) * (opacity ?? 1), 2);
  const hex = toHex(color);
  if (a >= 1) return hex;
  const c = [color.r, color.g, color.b].map((v) => Math.round(v * 255));
  return `rgba(${c.join(",")},${a})`;
}

export function colorKey(color, opacity = 1) {
  if (!color) return "";
  const a = round((color.a ?? 1) * (opacity ?? 1), 2);
  return a >= 1 ? toHex(color) : `${toHex(color)}@${Math.round(a * 100)}%`;
}

/**
 * Ángulo CSS de un degradado lineal a partir de las asas de Figma (normalizadas
 * al ancho/alto del nodo). (0,.5)→(1,.5) = 90deg; (.5,0)→(.5,1) = 180deg.
 */
export function gradientAngle(handles, w = 1, h = 1) {
  if (!handles || handles.length < 2) return 180;
  const [p0, p1] = handles;
  const dx = (p1.x - p0.x) * w;
  const dy = (p1.y - p0.y) * h;
  return Math.round(((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360);
}

function stopsToCss(stops = []) {
  return stops.map((s) => `${colorToCss(s.color)} ${round(s.position * 100, 0)}%`).join(", ");
}

/** Un relleno/borde de Figma → texto CSS. Devuelve "" si está oculto. */
export function paintToCss(paint, w = 1, h = 1) {
  if (!paint || paint.visible === false) return "";
  switch (paint.type) {
    case "SOLID":
      return colorToCss(paint.color, paint.opacity ?? 1);
    case "GRADIENT_LINEAR":
      return `linear-gradient(${gradientAngle(paint.gradientHandlePositions, w, h)}deg, ${stopsToCss(paint.gradientStops)})`;
    case "GRADIENT_RADIAL": {
      const [c, rx, ry] = paint.gradientHandlePositions ?? [];
      const dist = (p) => (p && c ? Math.hypot((p.x - c.x) * w, (p.y - c.y) * h) : 0);
      const at = c ? ` at ${round(c.x * 100, 0)}% ${round(c.y * 100, 0)}%` : "";
      return `radial-gradient(${round(dist(rx), 0)}px ${round(dist(ry), 0)}px${at}, ${stopsToCss(paint.gradientStops)})`;
    }
    case "GRADIENT_ANGULAR":
      return `conic-gradient(${stopsToCss(paint.gradientStops)})`;
    case "GRADIENT_DIAMOND":
      return `diamond-gradient(${stopsToCss(paint.gradientStops)})`;
    case "IMAGE":
      return `image(${String(paint.imageRef ?? "").slice(0, 8)}…, ${paint.scaleMode ?? "FILL"})${paint.opacity != null && paint.opacity < 1 ? ` @${round(paint.opacity * 100, 0)}%` : ""}`;
    default:
      return paint.type ?? "";
  }
}

export function paintsToCss(paints = [], w, h) {
  return paints.map((p) => paintToCss(p, w, h)).filter(Boolean).join(" + ");
}

/** Un efecto de Figma → CSS (box-shadow / filter / backdrop-filter). */
export function effectToCss(effect) {
  if (!effect || effect.visible === false) return "";
  const { x = 0, y = 0 } = effect.offset ?? {};
  switch (effect.type) {
    case "DROP_SHADOW":
      return `${round(x)}px ${round(y)}px ${round(effect.radius)}px ${round(effect.spread ?? 0)}px ${colorToCss(effect.color)}`;
    case "INNER_SHADOW":
      return `inset ${round(x)}px ${round(y)}px ${round(effect.radius)}px ${round(effect.spread ?? 0)}px ${colorToCss(effect.color)}`;
    case "LAYER_BLUR":
      return `filter: blur(${round(effect.radius / 2)}px)`;
    case "BACKGROUND_BLUR":
      return `backdrop-filter: blur(${round(effect.radius / 2)}px)`;
    default:
      return effect.type ?? "";
  }
}

export function effectsToCss(effects = []) {
  const shadows = [];
  const others = [];
  for (const e of effects) {
    const css = effectToCss(e);
    if (!css) continue;
    if (e.type === "DROP_SHADOW" || e.type === "INNER_SHADOW") shadows.push(css);
    else others.push(css);
  }
  const out = [];
  if (shadows.length) out.push(`box-shadow: ${shadows.join(", ")}`);
  out.push(...others);
  return out.join("; ");
}

export function radiusOf(node) {
  const r = node.rectangleCornerRadii;
  if (Array.isArray(r) && r.length === 4 && new Set(r).size > 1) return r.map((v) => round(v, 0)).join(" ");
  const c = node.cornerRadius ?? (Array.isArray(r) ? r[0] : 0) ?? 0;
  return c ? String(round(c, 0)) : "";
}

export function layoutOf(node) {
  if (!node.layoutMode || node.layoutMode === "NONE") return node.clipsContent ? "clip" : "";
  const parts = [node.layoutMode === "HORIZONTAL" ? "H" : "V"];
  if (node.layoutWrap === "WRAP") parts.push("wrap");
  if (node.primaryAxisAlignItems) parts.push(`justify=${node.primaryAxisAlignItems.toLowerCase()}`);
  if (node.counterAxisAlignItems) parts.push(`align=${node.counterAxisAlignItems.toLowerCase()}`);
  const t = round(node.paddingTop ?? 0, 0);
  const r = round(node.paddingRight ?? 0, 0);
  const b = round(node.paddingBottom ?? 0, 0);
  const l = round(node.paddingLeft ?? 0, 0);
  if (t || r || b || l) {
    const pad = t === b && r === l ? (t === r ? `${t}` : `${t} ${r}`) : `${t} ${r} ${b} ${l}`;
    parts.push(`pad=${pad}`);
  }
  if (node.itemSpacing) parts.push(`gap=${round(node.itemSpacing, 0)}`);
  if (node.counterAxisSpacing) parts.push(`rowgap=${round(node.counterAxisSpacing, 0)}`);
  if (node.clipsContent) parts.push("clip");
  return parts.join(" ");
}

/** Recorrido en profundidad. `visit(node, ctx)` devuelve `false` para no bajar. */
export function walk(node, visit, ctx = { depth: 0, path: [], insideInstance: false }, includeHidden = false) {
  if (!node) return;
  if (node.visible === false && !includeHidden) return;
  const go = visit(node, ctx);
  if (go === false || !Array.isArray(node.children)) return;
  const next = {
    ...ctx,
    depth: ctx.depth + 1,
    path: [...ctx.path, node.name ?? node.type],
    insideInstance: ctx.insideInstance || node.type === "INSTANCE",
  };
  for (const child of node.children) walk(child, visit, next, includeHidden);
}

export function findById(node, id) {
  let found = null;
  walk(
    node,
    (n) => {
      if (found) return false;
      if (n.id === id) {
        found = n;
        return false;
      }
    },
    undefined,
    true
  );
  return found;
}

export function escapeCell(s, max = 90) {
  let t = String(s ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, "⏎");
  if (t.length > max) t = t.slice(0, max - 1) + "…";
  return t;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
