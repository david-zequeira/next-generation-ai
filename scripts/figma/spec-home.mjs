import { access, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import {
  colorKey,
  effectsToCss,
  escapeCell,
  layoutOf,
  paintsToCss,
  radiusOf,
  round,
  toHex,
  walk,
} from "./lib.mjs";

/**
 * Convierte `docs/figma/home/raw.json` (salida de `pull-home.mjs`) en tres
 * documentos legibles para la auditoría del home:
 *
 *   spec.md    — por sección: textos (fuente, peso, tamaño, interlínea,
 *                tracking, color) y contenedores (tamaño, radio, relleno, borde,
 *                sombras, layout).
 *   tokens.md  — colores, tipografías, radios, sombras y espaciados únicos del
 *                marco, con el token más cercano de `src/app/globals.css`.
 *   audit.md   — plantilla «Figma vs código» por sección (no se sobrescribe si
 *                ya existe; `--force-audit` la regenera).
 *
 *   node scripts/figma/spec-home.mjs [--in docs/figma/home] [--include-hidden] [--force-audit] [--max-depth N]
 *
 * No hace ninguna llamada de red.
 */

function parseArgs(argv) {
  const o = { in: "docs/figma/home", includeHidden: false, forceAudit: false, maxDepth: 6 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--in") o.in = argv[++i];
    else if (a === "--include-hidden") o.includeHidden = true;
    else if (a === "--force-audit") o.forceAudit = true;
    else if (a === "--max-depth") o.maxDepth = Number(argv[++i]);
    else throw new Error(`Argumento desconocido: ${a}`);
  }
  return o;
}

/** Nombre de capa del Figma → componente del sitio. Se ajusta tras el primer pull. */
const SECTION_MAP = [
  [/nav|barra|header|menu|menú/i, "src/components/layout/Navbar.tsx"],
  [/hero|portada|inicio/i, "src/components/sections/Hero.tsx"],
  [/futuro|evoluci/i, "src/components/sections/Evolution.tsx"],
  [/servicio/i, "src/components/sections/Services.tsx"],
  [/trabajamos|ecosist/i, "src/components/sections/Ecosystem.tsx"],
  [/proceso|capa|inteligencia/i, "src/components/sections/Process.tsx"],
  [/tecnolog/i, "src/components/sections/Technology.tsx"],
  [/prueba|caso|promesa/i, "src/components/sections/CaseStudies.tsx"],
  [/demo/i, "(n/a — sección Demo: no implementar hasta tener diseño)"],
  [/cuenta|roi|retorno|calculadora/i, "src/components/sections/Roi.tsx"],
  [/plan|precio/i, "src/components/sections/Plans.tsx"],
  [/hablemos|cta|contacto/i, "src/components/sections/FinalCTA.tsx"],
  [/pie|footer/i, "src/components/layout/Footer.tsx"],
];
const componentFor = (section) =>
  section.component ?? SECTION_MAP.find(([re]) => re.test(section.name))?.[1] ?? "(asignar)";

const bbox = (n) => n.absoluteBoundingBox ?? { x: 0, y: 0, width: 0, height: 0 };
const rel = (n, s) => `${round(bbox(n).x - bbox(s).x, 0)},${round(bbox(n).y - bbox(s).y, 0)}`;
const size = (n) => `${round(bbox(n).width, 0)}×${round(bbox(n).height, 0)}`;

function textColor(node) {
  const p = (node.fills ?? []).find((f) => f.visible !== false);
  return p ? paintsToCss([p], bbox(node).width, bbox(node).height) : "";
}

function typo(style = {}) {
  const lh = style.lineHeightPx != null ? `${round(style.lineHeightPx)}` : "";
  const lhPct =
    style.lineHeightUnit && style.lineHeightUnit !== "PIXELS" && style.lineHeightPercentFontSize
      ? ` (${round(style.lineHeightPercentFontSize, 0)}%)`
      : "";
  const ls = style.letterSpacing ?? 0;
  const em = style.fontSize ? round(ls / style.fontSize, 3) : 0;
  return {
    family: style.fontFamily ?? "",
    weight: style.fontWeight ?? "",
    size: style.fontSize != null ? round(style.fontSize) : "",
    lineHeight: lh + lhPct,
    tracking: ls ? `${round(ls, 2)}px (${em}em)` : "0",
    textCase: style.textCase && style.textCase !== "ORIGINAL" ? style.textCase : "—",
    align: `${(style.textAlignHorizontal ?? "").toLowerCase()}${style.textAlignVertical ? "/" + style.textAlignVertical.toLowerCase() : ""}`,
    resize: style.textAutoResize ?? "",
  };
}

function overrideRuns(node) {
  const ov = node.characterStyleOverrides ?? [];
  const runs = [];
  let start = -1;
  let cur = 0;
  for (let i = 0; i <= ov.length; i++) {
    const id = ov[i] ?? 0;
    if (id !== cur) {
      if (cur !== 0) runs.push([start, i, cur]);
      cur = id;
      start = i;
    }
  }
  return runs;
}

const TEXT_HEAD =
  "| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |\n|---|---|---|---|---|---|---|---|---|---|---|---|";
const BOX_HEAD =
  "| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |\n|---|---|---|---|---|---|---|---|---|---|";

function sectionSpec(section, node, styles, components, opts, tokens) {
  const texts = [];
  const boxes = [];
  let hidden = 0;
  let deeper = 0;
  const styleName = (n, kind) => styles[n.styles?.[kind]]?.name ?? "";
  const compName = (n) => components[n.componentId]?.name ?? "";

  walk(
    node,
    (n, ctx) => {
      if (n.visible === false) {
        hidden++;
        return false;
      }
      if (n === node) return;
      if (ctx.depth > opts.maxDepth) {
        deeper++;
        return false;
      }
      const w = bbox(n).width;
      const h = bbox(n).height;
      const route =
        ctx.path
          .slice(-2)
          .map((p) => escapeCell(p, 24))
          .join(" › ") + (n.type === "INSTANCE" ? ` ⧉ ${escapeCell(compName(n), 30)}` : "");

      if (n.type === "TEXT") {
        const t = typo(n.style);
        const color = textColor(n);
        tokens.addText(t, color, n.name);
        texts.push(
          `| ${rel(n, node)} | ${escapeCell(n.characters, 70)} | ${escapeCell(styleName(n, "text"), 30)} | ${t.family} | ${t.weight} | ${t.size} | ${t.lineHeight} | ${t.tracking} | ${t.textCase} | ${color} | ${t.align} | ${round(w, 0)} ${t.resize} |`
        );
        for (const [a, b, id] of overrideRuns(n)) {
          const o = n.styleOverrideTable?.[id] ?? {};
          const merged = { ...n.style, ...o };
          const t2 = typo(merged);
          const c2 = o.fills ? paintsToCss(o.fills, w, h) : "=";
          const d = (k) => (t2[k] === t[k] ? "=" : t2[k]);
          texts.push(
            `| ↳ | ${escapeCell(n.characters.slice(a, b), 70)} | | ${d("family")} | ${d("weight")} | ${d("size")} | ${d("lineHeight")} | ${d("tracking")} | ${d("textCase")} | ${c2} | | |`
          );
        }
        return false;
      }

      const fills = paintsToCss(n.fills, w, h);
      const stroke = paintsToCss(n.strokes, w, h);
      const strokeTxt = stroke
        ? `${stroke} ${n.strokeWeight != null ? round(n.strokeWeight) + "px" : ""} ${(n.strokeAlign ?? "").toLowerCase()}`.trim()
        : "";
      const effects = effectsToCss(n.effects);
      const radius = radiusOf(n);
      const layout = layoutOf(n);
      const opacity = n.opacity != null && n.opacity < 1 ? round(n.opacity, 2) : "";
      if (fills || strokeTxt || effects || radius || (layout && layout !== "clip")) {
        tokens.addBox(n, fills, stroke, effects, radius);
        boxes.push(
          `| ${"·".repeat(Math.max(0, ctx.depth - 1))}${route} | ${escapeCell(n.name, 32)} (${n.id}) | ${rel(n, node)} | ${size(n)} | ${radius} | ${escapeCell(fills, 110)} | ${escapeCell(strokeTxt, 60)} | ${escapeCell(effects, 110)} | ${layout} | ${opacity} |`
        );
      }
    },
    undefined,
    opts.includeHidden
  );

  const b = section.bbox;
  const rootFill = paintsToCss(node.fills, b.width, b.height);
  const lines = [
    `## ${section.order} · ${section.name} (${section.id}) — ${round(b.width, 0)}×${round(b.height, 0)} @ y=${round(b.y, 0)}`,
    "",
    section.png ? `![${section.name}](${section.png})` : "",
    "",
    `Componente: \`${componentFor(section)}\`  `,
    `Contenedor: relleno ${rootFill || "—"} · radio ${radiusOf(node) || "0"} · layout ${layoutOf(node) || "—"} · efectos ${effectsToCss(node.effects) || "—"}`,
    "",
    `### Textos (${texts.length})`,
    "",
    texts.length ? `${TEXT_HEAD}\n${texts.join("\n")}` : "_Sin textos_",
    "",
    `### Contenedores (${boxes.length})`,
    "",
    boxes.length ? `${BOX_HEAD}\n${boxes.join("\n")}` : "_Sin contenedores con estilo_",
    "",
    `_Nodos ocultos: ${hidden} · nodos más profundos que ${opts.maxDepth}: ${deeper}_`,
    "",
  ];
  return lines.join("\n");
}

/* ---------- tokens.md ---------- */

function makeTokenCollector() {
  const bump = (map, key, where) => {
    if (!key) return;
    const e = map.get(key) ?? { count: 0, where: [] };
    e.count++;
    if (e.where.length < 3 && where && !e.where.includes(where)) e.where.push(where);
    map.set(key, e);
  };
  const colors = new Map();
  const families = new Map();
  const typos = new Map();
  const radii = new Map();
  const shadows = new Map();
  const blurs = new Map();
  const gaps = new Map();
  const pads = new Map();
  const opacities = new Map();

  const solidKeys = (paints = []) =>
    paints.filter((p) => p.visible !== false && p.type === "SOLID").map((p) => colorKey(p.color, p.opacity ?? 1));
  const gradientKeys = (paints = []) =>
    paints
      .filter((p) => p.visible !== false && p.type?.startsWith("GRADIENT"))
      .flatMap((p) => (p.gradientStops ?? []).map((s) => colorKey(s.color, p.opacity ?? 1)));

  return {
    addText(t, color, name) {
      bump(families, t.family, name);
      bump(typos, `${t.family} ${t.weight} · ${t.size}px / ${t.lineHeight || "auto"} · ${t.tracking}`, name);
      if (color && /^#|^rgba/.test(color)) bump(colors, color.replace(/^rgba\((\d+),(\d+),(\d+),([\d.]+)\)$/, (_, r, g, b, a) => `${toHex({ r: r / 255, g: g / 255, b: b / 255 })}@${Math.round(a * 100)}%`), `texto «${name}»`);
    },
    addBox(n, fills, stroke, effects, radius) {
      for (const k of [...solidKeys(n.fills), ...gradientKeys(n.fills)]) bump(colors, k, n.name);
      for (const k of solidKeys(n.strokes)) bump(colors, k, `borde ${n.name}`);
      for (const e of n.effects ?? []) {
        if (e.visible === false) continue;
        if (e.type === "DROP_SHADOW" || e.type === "INNER_SHADOW") {
          bump(colors, colorKey(e.color), `sombra ${n.name}`);
          bump(shadows, effectsToCss([e]).replace(/^box-shadow: /, ""), n.name);
        } else bump(blurs, effectsToCss([e]), n.name);
      }
      if (radius) bump(radii, radius, n.name);
      if (n.itemSpacing) bump(gaps, String(round(n.itemSpacing, 0)), n.name);
      for (const k of ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"]) if (n[k]) bump(pads, String(round(n[k], 0)), n.name);
      if (n.opacity != null && n.opacity < 1) bump(opacities, String(round(n.opacity, 2)), n.name);
    },
    colors,
    families,
    typos,
    radii,
    shadows,
    blurs,
    gaps,
    pads,
    opacities,
  };
}

function parseCss(color) {
  color = color.trim();
  let m = color.match(/^#([0-9a-f]{3})$/i);
  if (m) return { rgb: [...m[1]].map((c) => parseInt(c + c, 16)), a: 1 };
  m = color.match(/^#([0-9a-f]{6})$/i);
  if (m) return { rgb: [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)), a: 1 };
  m = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/i);
  if (m) return { rgb: [m[1], m[2], m[3]].map(Number), a: m[4] != null ? Number(m[4]) : 1 };
  return null;
}

async function loadThemeTokens() {
  let css = "";
  try {
    css = await readFile(join(process.cwd(), "src/app/globals.css"), "utf8");
  } catch {
    return [];
  }
  const out = [];
  for (const m of css.matchAll(/--color-([\w-]+):\s*([^;]+);/g)) {
    const parsed = parseCss(m[2]);
    if (parsed) out.push({ name: m[1], value: m[2].trim(), ...parsed });
  }
  return out;
}

function nearestToken(key, tokens) {
  const m = key.match(/^(#[0-9a-f]{6})(?:@(\d+)%)?$/i);
  if (!m) return "";
  const rgb = [0, 2, 4].map((i) => parseInt(m[1].slice(1 + i, 3 + i), 16));
  const a = m[2] ? Number(m[2]) / 100 : 1;
  let best = null;
  for (const t of tokens) {
    const d = Math.max(...t.rgb.map((v, i) => Math.abs(v - rgb[i])));
    if (Math.abs(t.a - a) > 0.05 && !(t.a === 1)) continue;
    if (!best || d < best.d) best = { d, t };
  }
  if (!best) return "—";
  const alphaNote = a < 1 && best.t.a === 1 ? ` (alfa ${Math.round(a * 100)}%)` : "";
  if (best.d <= 1) return best.t.name + alphaNote;
  if (best.d <= 12) return `≈ ${best.t.name} (Δ${best.d})${alphaNote}`;
  return "—";
}

function mapToRows(map, head, extra) {
  const rows = [...map.entries()].sort((a, b) => b[1].count - a[1].count);
  if (!rows.length) return `${head}\n\n_Nada_\n`;
  const cols = extra ? "| Valor | Usos | Dónde | Token globals.css |\n|---|---|---|---|" : "| Valor | Usos | Dónde |\n|---|---|---|";
  const body = rows
    .map(([k, v]) => `| ${escapeCell(k, 120)} | ${v.count} | ${escapeCell(v.where.join(", "), 80)} |${extra ? ` ${extra(k)} |` : ""}`)
    .join("\n");
  return `${head}\n\n${cols}\n${body}\n`;
}

async function tokensMd(tk, meta) {
  const theme = await loadThemeTokens();
  const used = new Set();
  const colorRows = mapToRows(tk.colors, "## Colores", (k) => {
    const t = nearestToken(k, theme);
    const plain = t.replace(/^≈ /, "").replace(/ \(.*$/, "");
    if (t && t !== "—") used.add(plain);
    return t;
  });
  const unused = theme.filter((t) => !used.has(t.name)).map((t) => `- \`--color-${t.name}\` (${t.value})`);
  return [
    `# Tokens del home · Figma ${meta.rootId}`,
    "",
    `Fuente: ${meta.fileKey} · «${meta.rootName}» · modificado ${meta.lastModified} · extraído ${meta.fetchedAt}`,
    "",
    colorRows,
    mapToRows(tk.families, "## Familias tipográficas"),
    mapToRows(tk.typos, "## Tipografías (familia peso · tamaño / interlínea · tracking)"),
    mapToRows(tk.radii, "## Radios"),
    mapToRows(tk.shadows, "## Sombras"),
    mapToRows(tk.blurs, "## Desenfoques"),
    mapToRows(tk.gaps, "## Gaps (itemSpacing)"),
    mapToRows(tk.pads, "## Paddings"),
    mapToRows(tk.opacities, "## Opacidades < 1"),
    "## Tokens de globals.css sin uso en el marco",
    "",
    unused.length ? unused.join("\n") : "_Todos los tokens aparecen_",
    "",
  ].join("\n");
}

/* ---------- audit.md ---------- */

const AUDIT_ROWS = [
  "Fondo / degradado",
  "Padding vertical y ancho de contenido",
  "Eyebrow: familia · peso · tamaño · tracking · color",
  "Título: familia · peso · tamaño · interlínea · tracking · color",
  "Subtítulo / texto: tamaño · interlínea · color",
  "Tarjetas: radio · relleno · borde · sombra",
  "Gaps entre elementos",
  "Botón primario: relleno · texto · radio · alto · padding",
  "Botón secundario",
  "Iconos / logos (fills.json, svg/)",
  "Brillos / efectos de luz",
  "Elementos en Figma sin equivalente en código",
  "Elementos en código sin equivalente en Figma",
  "Nota de la diseñadora (Word)",
];

function auditMd(meta) {
  const head = "| Propiedad | Figma | Código (archivo:línea) | Estado | Acción |\n|---|---|---|---|---|";
  const order = meta.sections.filter((s) => s.kind === "section").map((s) => `${s.order} ${s.name}`).join(" → ");
  const out = [
    `# Auditoría Home · Figma ${meta.rootId} vs código`,
    "",
    "Leyenda Estado: `ok` · `desvío` · `n/a` · `pendiente`.  ",
    "Cómo se rellena: la columna Figma se copia de `spec.md`/`tokens.md`; Código = archivo:línea del valor real; Acción = clase Tailwind o CSS destino.",
    "",
    "## 00 · Global",
    "",
    head,
    `| Orden de secciones | ${escapeCell(order, 200)} | src/app/page.tsx:59-68 | pendiente | |`,
    "| Familia tipográfica | | src/app/globals.css:9-10 · src/app/layout.tsx:11-16 | pendiente | |",
    "| Fondo de página | | src/app/globals.css:15 (--color-void) | pendiente | |",
    "| Paleta (tokens.md → @theme) | | src/app/globals.css:13-27 | pendiente | |",
    "| Radios / sombras repetidos | | (sin tokens hoy) | pendiente | |",
    "| Botones (.btn-light/.btn-outline/.btn-blue) | | src/app/globals.css:280-309 · src/components/ui/MagneticButton.tsx:50-56 | pendiente | |",
    "| Cabecera de sección (eyebrow + H2 + sub) | | src/app/globals.css:211-226, 272-277 | pendiente | |",
    "",
  ];
  for (const s of meta.sections) {
    out.push(`## ${s.order} · ${s.name} → \`${componentFor(s)}\`${s.kind === "aux" ? " _(auxiliar)_" : ""}`, "", head);
    for (const r of AUDIT_ROWS) out.push(`| ${r} | | | pendiente | |`);
    out.push("");
  }
  return out.join("\n");
}

/* ---------- main ---------- */

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const dir = resolve(process.cwd(), opts.in);
  const raw = JSON.parse(await readFile(join(dir, "raw.json"), "utf8"));
  const meta = JSON.parse(await readFile(join(dir, "meta.json"), "utf8"));
  const entry = raw.nodes[meta.rootId];
  const doc = entry.document;
  const styles = entry.styles ?? {};
  const components = entry.components ?? {};

  const tk = makeTokenCollector();
  const byId = new Map();
  walk(doc, (n) => void byId.set(n.id, n), undefined, true);

  const rb = meta.rootBBox;
  const sections = [];
  const aux = [];
  for (const s of meta.sections) {
    // Bandas de sections.json: nodo virtual con las capas de primer nivel asignadas.
    const node = s.members
      ? {
          id: s.id,
          name: s.name,
          type: "BAND",
          absoluteBoundingBox: s.bbox,
          fills: [],
          children: s.members.map((id) => byId.get(id)).filter(Boolean),
        }
      : byId.get(s.id);
    if (!node) continue;
    (s.kind === "aux" ? aux : sections).push(sectionSpec(s, node, styles, components, opts, tk));
  }

  const spec = [
    `# Home · ${doc.name} (${meta.rootId}) — spec extraída de Figma`,
    "",
    `Fuente: ${meta.fileKey} «${meta.fileName}» · modificado ${meta.lastModified} · extraído ${meta.fetchedAt} · ${meta.apiCalls} llamadas API`,
    "",
    `Marco: ${round(rb.width, 0)}×${round(rb.height, 0)} · fondo: ${paintsToCss(doc.fills, rb.width, rb.height) || "—"} · layout: ${layoutOf(doc) || "—"}`,
    "",
    meta.fullPng ? `![marco completo](${meta.fullPng})` : "",
    "",
    "Convenciones: posiciones relativas a la sección (x,y en px); colores `#hex` o `rgba`; tracking en px y em (para `tracking-[…em]`); desenfoques CSS = radio Figma / 2 (convención de Dev Mode, confirmar una vez); ángulo de degradado exacto solo si las asas cruzan el nodo en eje.",
    "",
    ...sections,
    aux.length ? "# Elementos auxiliares (anchura < 50 % o altura < 40 px)\n\n" + aux.join("\n") : "",
  ].join("\n");
  await writeFile(join(dir, "spec.md"), spec);

  await writeFile(join(dir, "tokens.md"), await tokensMd(tk, meta));

  const auditPath = join(dir, "audit.md");
  if (opts.forceAudit || !(await exists(auditPath))) {
    await writeFile(auditPath, auditMd(meta));
    console.log("audit.md: plantilla escrita");
  } else {
    console.log("audit.md: ya existe, no se toca (--force-audit para regenerar)");
  }
  console.log(
    `spec-home: ${sections.length} secciones (+${aux.length} aux) · ${tk.colors.size} colores · ${tk.typos.size} tipografías · ${tk.families.size} familia(s): ${[...tk.families.keys()].join(", ")}`
  );
}

main().catch((e) => {
  console.error(`spec-home: ${e.message}`);
  process.exit(1);
});
