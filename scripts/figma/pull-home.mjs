import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { findById, loadEnvToken, sleep, slugify, walk } from "./lib.mjs";

/**
 * Descarga el home del Figma «Asenix Web» por la API REST y lo deja en
 * `docs/figma/home/`: el árbol completo (`raw.json`), un PNG por sección y
 * uno del marco entero (`png/`), los rellenos de imagen (`fills/`) y un
 * `meta.json` con la lista de secciones.
 *
 * Por qué REST y no el MCP: el plan Starter da 20 llamadas al MCP al mes y ya
 * están gastadas. La REST va aparte (10 peticiones/min con asiento Full) y este
 * script hace 4 en total.
 *
 *   node scripts/figma/pull-home.mjs [--file KEY] [--node 541:168] [--out docs/figma/home]
 *        [--depth N] [--sections-parent ID] [--skip-raw] [--skip-png] [--skip-fills] [--svg-assets]
 *
 * Necesita FIGMA_TOKEN en `.env.local` (o en el entorno). Nunca lo imprime.
 */

const API = "https://api.figma.com/v1";
const MIN_GAP_MS = 6500; // 10 req/min → una cada 6,5 s como mínimo
const DEFAULTS = { file: "IxRzkKKPa5XStlUI6UnpBv", node: "541:168", out: "docs/figma/home" };

function parseArgs(argv) {
  const o = { ...DEFAULTS, skipRaw: false, skipPng: false, skipFills: false, svgAssets: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === "--file") o.file = next();
    else if (a === "--node") o.node = next().replace("-", ":");
    else if (a === "--out") o.out = next();
    else if (a === "--depth") o.depth = Number(next());
    else if (a === "--sections-parent") o.sectionsParent = next().replace("-", ":");
    else if (a === "--skip-raw") o.skipRaw = true;
    else if (a === "--skip-png") o.skipPng = true;
    else if (a === "--skip-fills") o.skipFills = true;
    else if (a === "--svg-assets") o.svgAssets = true;
    else throw new Error(`Argumento desconocido: ${a}`);
  }
  return o;
}

let lastCallAt = 0;
let apiCalls = 0;

async function figmaGet(path, token, { retries = 3, timeoutMs = 180_000 } = {}) {
  for (let attempt = 0; ; attempt++) {
    const wait = lastCallAt + MIN_GAP_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastCallAt = Date.now();
    apiCalls++;
    const shown = path.replace(/([?&]ids=)[^&]{60,}/, "$1…");
    console.log(`GET ${shown} (${apiCalls})`);
    const res = await fetch(API + path, {
      headers: { "X-Figma-Token": token },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status === 429 && attempt < retries) {
      const s = Number(res.headers.get("retry-after")) || 60;
      console.log(`429 → esperando ${s}s`);
      await sleep(s * 1000 + 500);
      continue;
    }
    if (res.status >= 500 && attempt < retries) {
      const s = [5, 15, 45][attempt] ?? 45;
      console.log(`${res.status} → reintento en ${s}s`);
      await sleep(s * 1000);
      continue;
    }
    if (res.status === 403) throw new Error("403: token inválido o sin el scope file_content:read");
    if (res.status === 404) throw new Error("404: file key o node id incorrecto");
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} en ${shown}: ${(await res.text()).slice(0, 300)}`);
    const json = await res.json();
    if (json.err) throw new Error(`Figma: ${json.err}`);
    return json;
  }
}

async function download(url, dest, retries = 2) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(120_000) });
      if (!res.ok) throw new Error(`${res.status} al descargar`);
      const bytes = Buffer.from(await res.arrayBuffer());
      await writeFile(dest, bytes);
      return bytes;
    } catch (e) {
      if (attempt >= retries) throw e;
      await sleep(2000);
    }
  }
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
      }
    })
  );
  return out;
}

const bbox = (n) => n.absoluteBoundingBox;

async function fetchSubtree(token, { file, node, depth, out }) {
  const q = depth ? `&depth=${depth}` : "";
  let json = await figmaGet(`/files/${file}/nodes?ids=${encodeURIComponent(node)}${q}`, token);
  const root = json.nodes?.[node]?.document;
  if (!root) throw new Error(`La respuesta no trae el nodo ${node}`);

  // Con --depth, las secciones vienen sin hijos: se piden una a una y se cosen.
  if (depth) {
    const kids = root.children ?? [];
    for (const k of kids) {
      const sub = await figmaGet(`/files/${file}/nodes?ids=${encodeURIComponent(k.id)}`, token);
      Object.assign(k, sub.nodes?.[k.id]?.document ?? {});
      Object.assign(json.nodes[node].components, sub.nodes?.[k.id]?.components ?? {});
      Object.assign(json.nodes[node].styles, sub.nodes?.[k.id]?.styles ?? {});
    }
  }
  const text = JSON.stringify(json);
  await writeFile(join(out, "raw.json"), text);
  console.log(`raw.json: ${(text.length / 1e6).toFixed(1)} MB · «${root.name}» · ${json.lastModified ?? "?"}`);
  return json;
}

function pickSections(rootDoc, overrideParentId) {
  let parent = overrideParentId ? findById(rootDoc, overrideParentId) : rootDoc;
  if (!parent) throw new Error(`No existe el nodo ${overrideParentId}`);
  const visible = (n) => n.visible !== false && bbox(n) && bbox(n).height > 0;

  // Si el marco solo tiene un envoltorio que ocupa casi todo, se baja a él.
  let kids = (parent.children ?? []).filter(visible);
  if (kids.length <= 2) {
    const wrapper = kids.find((k) => bbox(k).height >= bbox(parent).height * 0.9 && (k.children ?? []).length >= 3);
    if (wrapper) {
      console.log(`Secciones: descendiendo al envoltorio «${wrapper.name}»`);
      parent = wrapper;
      kids = (parent.children ?? []).filter(visible);
    }
  }
  kids.sort((a, b) => bbox(a).y - bbox(b).y || bbox(a).x - bbox(b).x);

  const rootW = bbox(rootDoc).width;
  const seen = new Map();
  return kids.map((k, i) => {
    let slug = slugify(k.name, k.id.replace(":", "-"));
    const n = (seen.get(slug) ?? 0) + 1;
    seen.set(slug, n);
    if (n > 1) slug += `-${n}`;
    const b = bbox(k);
    return {
      order: String(i + 1).padStart(2, "0"),
      id: k.id,
      name: k.name,
      slug,
      type: k.type,
      kind: b.width < rootW * 0.5 || b.height < 40 ? "aux" : "section",
      bbox: { x: b.x, y: b.y, width: b.width, height: b.height },
    };
  });
}

async function renderPngs(token, { file, out }, sections, rootId) {
  await mkdir(join(out, "png"), { recursive: true });
  const ids = sections.map((s) => s.id);
  const images = {};
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50);
    const json = await figmaGet(
      `/images/${file}?ids=${encodeURIComponent(chunk.join(","))}&format=png&scale=1&use_absolute_bounds=true`,
      token
    );
    Object.assign(images, json.images ?? {});
  }
  const rootJson = await figmaGet(
    `/images/${file}?ids=${encodeURIComponent(rootId)}&format=png&scale=0.5&use_absolute_bounds=true`,
    token
  );

  const jobs = sections.map((s) => ({ url: images[s.id], dest: `png/${s.order}-${s.slug}.png`, name: s.name, s }));
  jobs.push({ url: rootJson.images?.[rootId], dest: "png/00-home-full@0.5.png", name: "marco completo" });
  let ok = 0;
  await mapLimit(jobs, 4, async (j) => {
    if (!j.url) {
      console.warn(`⚠ Figma no pudo renderizar «${j.name}»`);
      return;
    }
    await download(j.url, join(out, j.dest));
    if (j.s) j.s.png = j.dest;
    ok++;
  });
  console.log(`png: ${ok}/${jobs.length} descargados`);
  return jobs[jobs.length - 1].url ? "png/00-home-full@0.5.png" : null;
}

function collectImageRefs(rootDoc, sections) {
  const refs = new Map();
  const sectionOf = (n) => {
    const b = bbox(n);
    if (!b) return "";
    const s = sections.find((x) => b.y >= x.bbox.y && b.y < x.bbox.y + x.bbox.height && x.kind === "section");
    return s?.order ?? "";
  };
  walk(rootDoc, (n) => {
    for (const p of [...(n.fills ?? []), ...(n.strokes ?? [])]) {
      if (p.type !== "IMAGE" || !p.imageRef || p.visible === false) continue;
      const e = refs.get(p.imageRef) ?? { imageRef: p.imageRef, scaleMode: p.scaleMode, nodes: [] };
      e.nodes.push({ id: n.id, name: n.name, section: sectionOf(n) });
      refs.set(p.imageRef, e);
    }
  });
  return [...refs.values()];
}

function sniffExt(bytes) {
  const h = bytes.subarray(0, 12);
  if (h[0] === 0x89 && h[1] === 0x50) return "png";
  if (h[0] === 0xff && h[1] === 0xd8) return "jpg";
  if (h[0] === 0x52 && h[1] === 0x49 && h[8] === 0x57) return "webp";
  if (h[0] === 0x47 && h[1] === 0x49) return "gif";
  return "bin";
}

async function fetchFills(token, { file, out }, refs) {
  if (!refs.length) {
    console.log("fills: el marco no usa rellenos de imagen");
    return [];
  }
  let meta;
  try {
    meta = await figmaGet(`/files/${file}/images`, token);
  } catch (e) {
    console.warn(`⚠ rellenos de imagen no descargados (${e.message}); hace falta el scope file_metadata:read`);
    return refs.map((r) => ({ ...r, file: null }));
  }
  const urls = meta.meta?.images ?? {};
  await mkdir(join(out, "fills"), { recursive: true });
  const manifest = await mapLimit(refs, 4, async (r) => {
    const url = urls[r.imageRef];
    if (!url) return { ...r, file: null };
    const tmp = join(out, "fills", r.imageRef);
    const bytes = await download(url, tmp);
    const ext = sniffExt(bytes);
    const final = `fills/${r.imageRef}.${ext}`;
    await writeFile(join(out, final), bytes);
    const { unlink } = await import("node:fs/promises");
    await unlink(tmp);
    return { ...r, file: final, bytes: bytes.length };
  });
  await writeFile(join(out, "fills.json"), JSON.stringify(manifest, null, 2));
  console.log(`fills: ${manifest.filter((m) => m.file).length}/${refs.length} descargados`);
  return manifest;
}

async function renderSvgAssets(token, { file, out }, rootDoc) {
  const re = /logo|icono?|icon|isotipo|lockup|brand|marca/i;
  const types = new Set(["VECTOR", "BOOLEAN_OPERATION", "INSTANCE", "COMPONENT", "GROUP", "FRAME"]);
  const picks = [];
  walk(rootDoc, (n) => {
    const b = bbox(n);
    if (types.has(n.type) && re.test(n.name ?? "") && b && Math.max(b.width, b.height) <= 400) {
      picks.push(n);
      return false; // solo el ancestro más externo que cumple
    }
  });
  if (!picks.length) return [];
  await mkdir(join(out, "svg"), { recursive: true });
  const files = [];
  for (let i = 0; i < picks.length; i += 50) {
    const chunk = picks.slice(i, i + 50);
    const json = await figmaGet(
      `/images/${file}?ids=${encodeURIComponent(chunk.map((n) => n.id).join(","))}&format=svg`,
      token
    );
    await mapLimit(chunk, 4, async (n) => {
      const url = json.images?.[n.id];
      if (!url) return;
      const dest = `svg/${slugify(n.name)}-${n.id.replace(":", "-")}.svg`;
      await download(url, join(out, dest));
      files.push({ id: n.id, name: n.name, file: dest });
    });
  }
  console.log(`svg: ${files.length}/${picks.length} activos`);
  return files;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const token = await loadEnvToken();
  const out = resolve(process.cwd(), opts.out);
  await mkdir(out, { recursive: true });
  const ctx = { file: opts.file, node: opts.node, depth: opts.depth, out };

  let raw;
  if (opts.skipRaw) {
    raw = JSON.parse(await readFile(join(out, "raw.json"), "utf8"));
  } else {
    raw = await fetchSubtree(token, ctx);
  }
  const rootDoc = raw.nodes[opts.node].document;
  const sections = pickSections(rootDoc, opts.sectionsParent);
  console.log(`secciones: ${sections.filter((s) => s.kind === "section").length} (+${sections.filter((s) => s.kind === "aux").length} aux)`);
  for (const s of sections) console.log(`  ${s.order} ${s.kind === "aux" ? "·" : "■"} ${s.name}  ${s.bbox.width}×${s.bbox.height} @y=${s.bbox.y}`);

  const fullPng = opts.skipPng ? "png/00-home-full@0.5.png" : await renderPngs(token, ctx, sections, opts.node);
  if (opts.skipPng) for (const s of sections) s.png = `png/${s.order}-${s.slug}.png`;

  const refs = collectImageRefs(rootDoc, sections);
  const fills = opts.skipFills ? [] : await fetchFills(token, ctx, refs);
  const svg = opts.svgAssets ? await renderSvgAssets(token, ctx, rootDoc) : [];

  const rb = bbox(rootDoc);
  const meta = {
    fileKey: opts.file,
    rootId: opts.node,
    fileName: raw.name,
    rootName: rootDoc.name,
    lastModified: raw.lastModified,
    fetchedAt: new Date().toISOString(),
    rootBBox: { x: rb.x, y: rb.y, width: rb.width, height: rb.height },
    sections,
    fullPng,
    imageFills: refs.length,
    svgAssets: svg,
    apiCalls,
  };
  await writeFile(join(out, "meta.json"), JSON.stringify(meta, null, 2));
  console.log(
    `pull-home: ${apiCalls} llamadas API · ${sections.length} secciones · ${fills.filter((f) => f.file).length} fills · ${opts.out}/`
  );
}

main().catch((e) => {
  console.error(`pull-home: ${e.message}`);
  process.exit(1);
});
