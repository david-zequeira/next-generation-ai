# Plan · Home pixel-perfect contra el Figma «Asenix HOME» (1532:2424)

**Objetivo.** Que `/` (home) reproduzca al píxel el marco `1532:2424` del fichero
`IxRzkKKPa5XStlUI6UnpBv` («Asenix Web»): colores, degradados, bordes, radios,
sombras, tipografía y espaciados. **No se toca ninguna animación ni funcionalidad**
(framer-motion, GSAP/ScrollTrigger, Lenis, rAF, IntersectionObserver, handlers,
hrefs, tracking, diccionarios de copy).

**Fuente de verdad.** El marco mide 1920 de ancho y 11618 de alto. Toda medida
del Figma se escribe como `N*var(--u)` con las utilidades `*-u-N` de
`src/app/globals.css:128-231` (exacta a 1920, proporcional por debajo, con suelo
para móvil). No inventar otra escala.

**Cómo se ejecuta.** Cada fase es autónoma: abre un chat nuevo, lee «Fase 0» y la
fase que toque, y cumple su checklist antes de pasar a la siguiente. Las fases
2–8 son independientes entre sí (se pueden hacer en cualquier orden) pero todas
dependen de la Fase 1.

---

## Decisiones que NO toma este plan (el ejecutor no las decide; se preguntan al dueño si no están resueltas)

| # | Tema | Figma | Código hoy | Acción por defecto |
|---|---|---|---|---|
| D1 | Plan destacado | «Arranque» en azul, Core y Nexus en blanco | «Core» destacado (commit `c1dfe2b`, decisión reciente) y nombres/precios vienen de `src/i18n/pricing.ts` | Solo estilos; **no** cambiar cuál es el destacado ni los nombres |
| D2 | Fondo de «Cómo trabajamos» | Vacío (sin estrellas ni galaxia) | Canvas de galaxia + estrellas animadas (`Ecosystem.tsx:619-804`) | Se conserva (es animación) |
| D3 | «Hablemos» | Sin auroras ni brumas | Aurora animada (`FinalCTA.tsx:41`) + bruma de esquina (`:45`) | Se conserva la aurora (animación); la bruma estática de la esquina se elimina |
| D4 | Nota «projects@asenix.es · Respuesta en menos de 24 h» y enlace «Ver todos los planes al detalle» | No existen | `FinalCTA.tsx:113`, `Plans.tsx:105` | Se conservan (contenido útil), con el estilo más discreto posible |
| D5 | Copys que difieren («Iniciar sesion», «Proyectos», «Ver casos exisitosos», «Ejemplo real de una cuenta») | — | Diccionarios | **No** se cambia copy; solo estilo |
| D6 | Iconos vectoriales de la diseñadora (tiles de Servicios, iconos de las notas de Proceso, iconos de sectores de voz) | Vectores propios | lucide | Siguen pendientes de la diseñadora (ver `docs/figma/home/audit.md:181-188`) |

---

## Fase 0 · Descubrimiento (HECHO en la sesión de planificación; leer, no repetir)

### 0.1 Fuentes consultadas

| Qué | Dónde | Estado |
|---|---|---|
| Árbol completo del marco 1532:2424 (API REST) | `docs/figma/home-1532/raw.json` (695 KB) | descargado 13 sep 2026 |
| Render 1:1 del marco (1920×11618) y recorte por bandas | `docs/figma/home-1532/png/00-home-full.png` + `png/01-header.png … 12-footer.png` | hecho (render vía MCP `get_screenshot`, recorte sin red con `pull-home.mjs --skip-*`) |
| Bandas, meta y spec del marco nuevo | `docs/figma/home-1532/{sections.json,meta.json,spec.md,tokens.md,audit.md}` | hecho (`spec.md`: 12 secciones, textos y contenedores con fill/stroke/radio/efecto por nodo; `audit.md`: plantilla vacía para rellenar en la Fase 9) |
| Extracción anterior (marco viejo 541:168, ya no existe en el fichero) | `docs/figma/home/{spec.md,tokens.md,audit.md,sections.json}` | referencia de método; **sus valores están desfasados** |
| Scripts | `scripts/figma/pull-home.mjs` (REST → raw/png/fills/meta), `scripts/figma/spec-home.mjs` (raw → spec.md/tokens.md/audit.md, sin red), `scripts/figma/lib.mjs` (`paintsToCss`, `effectsToCss`, `radiusOf`, `walk`) | operativos; `FIGMA_TOKEN` en `.env.local`. **Ojo:** el endpoint REST `/images` devolvió `429` con `retry-after` de ~4 días el 13 sep: hasta ~18 sep no se pueden exportar PNG por REST; usar el MCP (`get_screenshot`) como en 1.1 |
| Inventario del código (valores + bloques de animación a preservar) | apartado 0.3 | hecho |

### 0.2 API permitida (lo único que se usa)

- **Escala:** `--u` y utilidades `h-u-* min-h-u-* w-u-* max-w-u-* size-u-* p-u-* px-u-* py-u-* pl-u-* pr-u-* pt-u-* pb-u-* mt-u-* mb-u-* ml-u-* mr-u-* mx-u-* my-u-* top-u-* right-u-* bottom-u-* left-u-* min-w-u-* inset-u-* gap-u-* gap-x-u-* gap-y-u-* rounded-u-* rounded-t-u-* fs-u-* lh-u-*` (`globals.css:134-231`). Para un valor que no tenga utilidad se escribe `[max(Mpx,N*var(--u))]` inline, como hace `Technology.tsx:53-63`.
- **Tokens de color** (`globals.css:15-30`): `void #030617 · abyss #050b21 · space #101a3e · navy #101837 · panel #0a1540 · electric #1a4dff · neon #b8f21e · pulse #94b2fc · cloud #c7d7ff · mint #1cfcb9 · cyan #38d4ff · frost #eceFFF · mist #a7b2d1 · paper #f1f3fe · ink #0b1226 · line rgba(105,148,255,.5)`.
- **Primitivas** (`globals.css:302-609`): `.eyebrow` (+ `-gradient/-light/-white/-muted`), `.h2-section`, `.sub-section`, `.btn-light`, `.btn-light-sm`, `.btn-light-paper`, `.btn-outline`, `.tag-pill`, `.btn-blue`, `.ring-conic` (`--ring-w`, `--ring-bg`), `.glow-inset` (`--gx --gy --gr --go`), `.card-navy`, `.card-blue`, `.glass`, `.display`.
- **Composición de cabecera de sección:** `src/components/ui/SectionHeading.tsx:38-57` (eyebrow → `h2.h2-section mt-u-56` → `p.sub-section mt-u-24`, props `gradientEyebrow`, `subSize`).
- **Lectura del Figma sin red:** `node -e` sobre `raw.json` con los helpers de `lib.mjs` (ver los scripts `extract*.mjs` reproducidos en 0.5).

### 0.3 Bloques que NO se tocan (animación / funcionalidad)

`Hero.tsx:30-84, 93-163` · `Evolution.tsx:8-125` (y `h-[450vh]` de `:128`, atado a 3 etapas) · `Services.tsx:44-56, 113-151, 226-238` · `Ecosystem.tsx:134-157, 293-372, 452-479, 619-804` · `Process.tsx:103-124, 198-207, 289-298` · `Technology.tsx:76-96` · `CaseStudies.tsx:21-43, 73-99` · `Roi.tsx:47-51` · `Plans.tsx:16-29, 51-56` · `FinalCTA.tsx:24-29, 38-46` · `ui/TextReveal.tsx:20-34` · `ui/MagneticButton.tsx:32-48, 76-83` · `providers/SmoothScroll.tsx:14-32` · todos los `--animate-*` y `@keyframes` de `globals.css:32-116` · eventos `ng:open-chat`/`ng:open-voice` · `trackEvent(...)` · `HREFS` y `href`s · `pricingDicts`, `dictionaries.ts`.

Regla práctica: en cada archivo solo cambian **strings de `className`, valores CSS literales y el orden/estructura de nodos estáticos**. Si un cambio exige tocar un `useEffect`, un `motion.*`, un `useTransform`, un `gsap.*` o un handler, se para y se anota como bloqueado.

### 0.4 Hechos del Figma 1532:2424 (px a 1920; y relativo al marco)

**Bandas (para `sections.json`):**

| Sección | y0 | y1 | Componente |
|---|---|---|---|
| Header | 0 | 120 | `layout/Navbar.tsx` |
| Hero | 120 | 1080 | `sections/Hero.tsx` |
| El futuro | 1080 | 2169 | `sections/Evolution.tsx` |
| Servicios | 2169 | 3533 | `sections/Services.tsx` |
| Cómo trabajamos | 3533 | 4570 | `sections/Ecosystem.tsx` |
| Proceso | 4570 | 7585 | `sections/Process.tsx` |
| Tecnología | 7585 | 8389 | `sections/Technology.tsx` |
| Pruebas no promesas | 8389 | 9400 | `sections/CaseStudies.tsx` |
| Calculadora | 9400 | 10070 | `sections/Roi.tsx` |
| Planes 2026 | 10070 | 10824 | `sections/Plans.tsx` |
| Hablemos | 10824 | 11360 | `sections/FinalCTA.tsx` |
| Footer | 11360 | 11618 | `layout/Footer.tsx` |

**Globales nuevos respecto al marco viejo:**

- **Eyebrow** (todas las secciones, incluida Calculadora y El futuro): pill de **28 px de alto**, radio 50, fondo `rgba(213,218,233,0.08)`, borde **0.3 px `#94b2fc`**, texto Montserrat **600 · 12/22 · letter-spacing 0.6 px (0.05em) · UPPER · `#b8f21e`**, padding horizontal ≈ 10. **Sin `//`**, sin brillo interior. (nodos «Frame 239/240/251/292/294»).
- **H2 de sección:** 700 · 52/54 · `#ffffff` (Servicios, Proceso, Pruebas) o `#f1f3fe` (Tecnología, Planes) · ancho máx **704**.
- **Subtítulo de sección:** 400 · 20/28 · `#c7d7ff` · ancho máx **704** (Servicios, Tecnología); Planes 950; Proceso **26/34 `rgba(199,215,255,0.8)`** 705.
- **Ritmo vertical de cabeceras:** línea/inicio de sección → eyebrow **125** (Tecnología 173) · eyebrow → h2 **35** · h2 → sub **25**.
- **Divisores:** `Vector 31` y=3533 y `Vector 17` y=7585: 1920 × 0.5 px `#6994ff`. `Vector 20` en y=3534 y y=4570: 1920 × **2.5–3 px, trazo `radial-gradient(#1a4dff 0% → #030617 100%)`** centrado (línea que brilla en el centro y se apaga hacia los bordes). Entre Tecnología↔Pruebas, Pruebas↔Calculadora, Calculadora↔Planes: **sin línea**.
- **Fondo «Pruebas»:** `Rectangle 162` (y 8389–9216, 827 alto) `linear-gradient(180deg,#030617,#040b24)`.
- **Fondo «El futuro»:** `Rectangle 162` (y 1333–2160) mismo degradado + `Rectangle 2` (y 1080–2160) `linear-gradient(180deg,#000 0%,transparent 100%)` encima.
- **Colores nuevos:** `#779eff` (texto de tag-pills, historias de Pruebas, icono de nota), `#586a96` (© del pie), `#f0f2ff` (fondo de Hablemos/Footer), `#d5dae9` (botón Contactar), `#4977ff` (conic de la barra de tabs).
- **Enlaces «→» verdes:** 500 · 14/24 · `#1cfcb9` (Servicios, Pruebas, Planes). En Hablemos son 500 · 18/24 · `#1a4dff`.

Los valores por sección van en cada fase. Todo sale de `raw.json`; si hay duda, se vuelve a consultar con el script de 0.5, nunca de memoria.

### 0.5 Script de consulta (copiar tal cual, ejecutar desde la raíz)

```bash
cat > /tmp/fig.mjs <<'EOF'
import { readFileSync } from "node:fs";
import { paintsToCss, effectsToCss, radiusOf } from "/Users/davidzequeirazorrilla/projects/next-generation-ai/scripts/figma/lib.mjs";
const raw = JSON.parse(readFileSync("docs/figma/home-1532/raw.json", "utf8"));
const root = Object.values(raw.nodes)[0].document; const R = root.absoluteBoundingBox;
const all = []; const parentOf = new Map();
(function rec(n, p) { all.push(n); parentOf.set(n.id, p); (n.children ?? []).forEach(c => rec(c, n)); })(root, null);
const Y = n => Math.round(n.absoluteBoundingBox.y - R.y), X = n => Math.round(n.absoluteBoundingBox.x - R.x);
const font = n => { const s = n.style; return s ? `${s.fontWeight} ${s.fontSize}/${Math.round(s.lineHeightPx)} ls=${+s.letterSpacing.toFixed(2)} ${s.textCase ?? ""} ${s.textAlignHorizontal}` : ""; };
const desc = n => { const w = n.absoluteBoundingBox?.width, h = n.absoluteBoundingBox?.height; const f = paintsToCss(n.fills, w, h), s = paintsToCss(n.strokes), e = effectsToCss(n.effects), r = radiusOf(n);
  return `${n.type.slice(0,4)} «${n.name.slice(0,26)}» @${X(n)},${Y(n)} ${Math.round(w)}×${Math.round(h)}${f?` fill[${f}]`:""}${s?` stroke[${s} w=${n.strokeWeight}]`:""}${r?` r=${JSON.stringify(r)}`:""}${e?` fx[${e}]`:""}${n.opacity!=null&&n.opacity<1?` op=${n.opacity}`:""}${n.type==="TEXT"?" "+font(n)+" «"+String(n.characters).slice(0,50).replace(/\n/g,"⏎")+"»":""}${n.visible===false?" HIDDEN":""}`; };
function tree(n, depth, ind = "") { console.log(ind + desc(n)); if (depth > 0) for (const c of n.children ?? []) tree(c, depth - 1, ind + "  "); }
const [mode, q, depth = "1"] = process.argv.slice(2);
const hits = mode === "text" ? all.filter(n => n.type === "TEXT" && new RegExp(q).test(n.characters)) : all.filter(n => new RegExp(q).test(n.name));
for (const n of hits) { tree(n, +depth); let p = parentOf.get(n.id); if (p && p !== root) console.log("   ↑ " + desc(p)); }
EOF
# ejemplos:
node /tmp/fig.mjs text "^Hablemos" 0          # texto por contenido
node /tmp/fig.mjs name "^Frame 91$" 2         # capa por nombre, 2 niveles
```

Los `characterStyleOverrides`/`styleOverrideTable` de un TEXT (p. ej. el titular de Hablemos, que es negro por override aunque su fill base sea azul) se leen con `node -e` sobre el nodo.

---

## Fase 1 · Herramientas, spec regenerada y primitivas globales

### 1.1 Documentación del marco nuevo (ya generada; solo mantener)

Ya existen `docs/figma/home-1532/{raw.json,sections.json,meta.json,spec.md,tokens.md,audit.md,png/}`. **`spec.md` es la referencia citable** en las fases 2–8 (secciones `## 01 · Header` … `## 12 · Footer`, cada una con tablas «Textos» y «Contenedores» por nodo). Este plan cita nodos por nombre y posición `@x,y` tal como aparecen allí.

Solo si la diseñadora vuelve a tocar el marco, regenerar así (el REST de imágenes está en cuota agotada, ver 0.1):

1. `node scripts/figma/pull-home.mjs --node 1532:2424 --out docs/figma/home-1532 --skip-png --skip-fills` → `raw.json` nuevo (1 llamada REST).
2. Render 1:1 con el MCP de Figma: `get_screenshot(fileKey IxRzkKKPa5XStlUI6UnpBv, nodeId 1532:2424, maxDimension 11618)` → `curl -L -o docs/figma/home-1532/png/00-home-full.png "<url>"`.
3. Recorte por bandas sin red: `node scripts/figma/pull-home.mjs --node 1532:2424 --out docs/figma/home-1532 --skip-raw --skip-png --skip-fills --png-scale 1` (lee `sections.json`, escribe `meta.json` y `png/NN-*.png`).
4. `node scripts/figma/spec-home.mjs --in docs/figma/home-1532 --force-audit`.

Tarea de esta fase: en `docs/figma/README.md` añadir una línea: «Home: marco vigente `1532:2424` → `docs/figma/home-1532/`; `docs/figma/home/` es el marco anterior (541:168), solo histórico», y añadir `docs/figma/home-1532/` al commit (los PNG pesan ~10 MB; si se prefiere no versionarlos, listar `docs/figma/home-1532/png/` en `.gitignore` y dejar el resto).

### 1.2 Captura reproducible de la web a 1920 (para verificar cada fase)

Crear `scripts/figma/shot-home.mjs` (usa el Chrome instalado vía `playwright-core`, sin descargar navegador):

```js
// node scripts/figma/shot-home.mjs [url] → docs/figma/home-1532/shots/site-stitched-992.png y site2-sliceN.png
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";
const out = "docs/figma/home-1532/shots"; mkdirSync(out, { recursive: true });
const url = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, locale: "es-ES" });
await ctx.addInitScript(() => { try { localStorage.setItem("ng-locale", "es"); } catch {} });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" }); await page.waitForTimeout(2500);
const H = await page.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (let y = 0; y < H; y += 1080) {
  await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(900);
  await page.mouse.wheel(0, 1); await page.waitForTimeout(400);
  writeFileSync(`${out}/shot-${String(i++).padStart(2, "0")}.png`, await page.screenshot({ type: "png" }));
}
await browser.close(); console.log(`${i} capturas en ${out}`);
```

Instalación: `npm i -D playwright-core` (≈ 3 MB; no baja Chromium). Para pegar las capturas y trocearlas a 992 de ancho (misma escala que el render del Figma): script Python con Pillow (`Image.open`, `paste`, `resize((992, …))`, `crop`) o `sips`; guardar como `site-stitched-992.png` y `site2-sliceN.png` (1000 px de alto). **Alternativa sin instalar nada:** panel Browser con `resize_window` a 1920×1080 + `scrollIntoView` de cada `section` + screenshot (recorta a 800×600: sirve para detalles, no para la vista completa).

Comparación: el render del Figma es `docs/figma/home-1532/png/00-home-full@0.5.png` (o troceado por bandas `png/NN-*.png`). Las capturas del sitio a 1080 por pantalla no coinciden 1:1 en alto con el Figma (las secciones con pin ocupan más scroll), se comparan **sección a sección**.

### 1.3 Primitivas globales en `src/app/globals.css`

Copiar de los nodos «Frame 239/240/251/292/294» (0.4) y sustituir la regla `.eyebrow` de `globals.css:405-437`:

```css
.eyebrow {
  display: inline-flex; align-items: center; justify-content: center;
  height: max(22px, 28 * var(--u));
  padding-inline: max(8px, 10 * var(--u));
  border-radius: 999px;
  background: rgba(213, 218, 233, 0.08);
  border: 0.3px solid var(--color-pulse);          /* Figma: 0.3 px #94b2fc */
  font-family: var(--font-montserrat), system-ui, sans-serif;
  font-size: max(10px, 12 * var(--u));
  font-weight: 600; line-height: 1; letter-spacing: 0.05em; text-transform: uppercase;
  color: var(--color-neon);                          /* #b8f21e */
  white-space: nowrap;
}
```
- Eliminar `.eyebrow::before` (el `//`) y `.eyebrow::after` (brillo). Dejar `.eyebrow-gradient`, `.eyebrow-light`, `.eyebrow-white`, `.eyebrow-muted` **solo si** los usa otra página (`grep -rn "eyebrow-" src/`); en la home ya no se usan (Roi pasa al eyebrow normal). No romper `/precios`, `/calculadora`, `/contacto`.
- `.sub-section` (`globals.css:479-485`): `max-width: max(36rem, 704 * var(--u))` (antes 952). Planes pasa 950 por clase propia (Fase 7).
- Tokens nuevos en `@theme` (`globals.css:15-30`), con comentario de origen:
  ```css
  --color-periwinkle: #779eff; /* tag-pills, historias de Pruebas, icono de nota */
  --color-slate: #586a96;      /* © del pie */
  --color-paper: #f0f2ff;      /* Figma «Rectangle 12» de Hablemos/Footer (antes #f1f3fe) */
  ```
  Cambiar `--color-paper` afecta a `/contacto` y legales: aceptable (misma marca), pero anotarlo en el commit.
- `.btn-light` y `.btn-outline` (`globals.css:541-598`): el texto pasa a 18 (Figma «Comenzar»/«Ver Demo» 600 · 18). Esto vive en `MagneticButton.tsx:52` (`fs-u-20` → `fs-u-18`). Altura 72 y radio se quedan.
- Nueva utilidad `.divider-glow` para `Vector 20`:
  ```css
  .divider-glow { height: max(2px, 3 * var(--u)); border: 0; background: radial-gradient(50% 100% at 50% 50%, #1a4dff 0%, #030617 100%); }
  ```
  (Figma: trazo 2.5–3 px con degradado radial centrado; se aplica como `<hr>`/`div` de 1920 de ancho.)
- Utilidad `.link-mint`: `font-weight:500; font-size:max(12px,14*var(--u)); line-height:max(16px,24*var(--u)); color:var(--color-mint)` con `:hover{color:#fff}`.

**Verificación Fase 1**
- `npm run lint && npx tsc --noEmit` limpios.
- `grep -rn "eyebrow" src/ | grep -v globals.css` → cada uso sigue renderizando (home, precios, calculadora, contacto): abrir las cuatro páginas en el panel Browser y comprobar que ningún eyebrow tiene `//`.
- `docs/figma/home-1532/spec.md` existe y contiene «Servicios», «Proceso», «Hablemos».
- `git diff --stat` solo toca `globals.css`, `MagneticButton.tsx`, `docs/figma/**`, `scripts/figma/shot-home.mjs`, `package.json`/`package-lock.json`.

**Anti-patrones**
- No crear una segunda escala (`vw` sueltos, `clamp` nuevos): solo `--u`.
- No borrar keyframes ni `--animate-*`.
- No cambiar `--color-line` (los divisores `.5 px #6994ff` de la Fase 4 lo usan).

---

## Fase 2 · Header, Hero y «El futuro»

### 2.1 Header (`src/components/layout/Navbar.tsx`) — ya coincide

Figma: barra 120 (contenido en y 35–81) · imago 69×55 en x=240 · menú 600 · 15 · blanco centrado · idioma 98×46 r20 `linear-gradient(180deg,#182557,#050b21)` texto 500 · 20 · CTA 165×46 r20 blanco texto 500 · 15 negro. El código (`Navbar.tsx:48-135`) ya lo implementa. **Solo comprobar** con el panel Browser a 1920 que la barra mide 116–120 y el menú queda centrado en x=960. Sin cambios salvo desvío medido.

### 2.2 Hero (`src/components/sections/Hero.tsx`) — nodos «texto Gero», «Texto Subheadline», «Rectangle 20», «Frame 255», «Arrow right», «Play»

| Propiedad | Figma | Código (`Hero.tsx`) | Cambio |
|---|---|---|---|
| Título | 700 · **55/57** · `#fff` · ancho 702 · top y=400 (280 bajo la barra) | `fs-u-52 lh-u-54` `:179,185` | `fs-u-55 lh-u-57`, `max-w-u-704` |
| Subtítulo | 400 · 20/28 · `#c7d7ff` · ancho 704 · **46** bajo el título | `.sub-section mt-u-32` `:193` | `mt-u-46` (el ancho 704 lo da `.sub-section` nuevo) |
| Botones | 213×72 · **225** bajo el subtítulo · hueco 32 | `mt-u-180 gap-u-32` `:202` | `mt-u-225` |
| «Comenzar» | fondo `#c7d7ff` · r47 · texto 600 · **18** · `#010104` · flecha **32×32 trazo `#1a4dff` grosor 2** | icono `size-u-24 strokeWidth={3}` `:207` | `size-u-32 strokeWidth={2}` (texto 18 viene de Fase 1) |
| «Ver Demo» | `linear-gradient(180deg,#101837,#050b21)` · borde 1 `#1a4dff` · r50 · texto 600 · 18 · `#ecefff` · play **24×24 trazo `#1a4dff` grosor 2 sin relleno** | `size-u-20 fill-electric text-electric strokeWidth={1.5}` `:221` | `size-u-24 text-electric strokeWidth={2}` sin `fill-electric` |
| Posición del bloque | el bloque título→botones ocupa y 400–892 en un hero de 1080 (centro en 646, **106 por debajo del centro**) | `items-center` + `pt-16` `:90,168` | `pt-16` → `pt-[max(64px,212*var(--u))]` y medir: a 1920×1080 el `h1`/primera línea debe empezar en y≈400 |

No tocar: `useScroll`/`useTransform` (`:30-37`), vídeo/poster (`:95-121`), Starfield, barrido de luz, parallax, `TextReveal`, `MagneticButton`, `warmUpVoice`, `ng:open-voice`.

### 2.3 «El futuro» (`src/components/sections/Evolution.tsx`) — nodos «El futuro», «Rectangle 2», «Rectangle 162», «Vertical Divider», «Frame 240»

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Eyebrow | pill nuevo (Fase 1) a 126 del inicio | `top-[12vh]` `:167` (=130 a 1080) | ok |
| Fondo | base `#030617`; `Rectangle 162` desde y+253 (827 alto) `linear-gradient(180deg,#030617,#040b24)`; encima `Rectangle 2` `linear-gradient(180deg,#000,transparent)` en toda la etapa | `bg-void` + rejilla + estrellas `:128-163` | Añadir bajo la rejilla un `div absolute inset-x-0 top-[max(150px,253*var(--u))] h-[max(500px,827*var(--u))] bg-[linear-gradient(180deg,#030617_0%,#040b24_100%)]` y un `div absolute inset-0 bg-[linear-gradient(180deg,#000_0%,transparent_100%)] opacity-…` (medir contra el render; la rejilla y las estrellas se quedan) |
| Título de etapa | 600 · 85 · ls −0.05em · `#1a4dff` · ancho 1444 | `fs-u-85 font-semibold tracking-[-0.05em] text-electric max-w-u-1444` `:95` | ok |
| Subtítulo de etapa | 400 · 24/28 · `#fff` · ancho 1004 · **16** bajo el título | `mt-u-30` `:98` | `mt-u-16` |
| Raíl de progreso | 278×2 · centrado · a 139 del final | `w-56 h-px bottom-[10vh]` `:179-186` | `w-u-278 h-[2px] bottom-[max(80px,139*var(--u))]` |

No tocar: `DustText`, `Stage`, `useScroll`, `starsY/gridScale/gridOpacity`, `h-[450vh]`.

**Verificación Fase 2:** capturas a 1920 (1.2) del hero y de la primera etapa; el título del hero empieza en y≈400±6, los botones en y≈820±6; el subtítulo de etapa a 16 del título. `git diff` de los tres archivos solo toca `className`. `npm run lint`.

**Anti-patrones:** no cambiar `min-h-svh`; no mover el `VoiceWidget`; no cambiar el poster/vídeo.

---

## Fase 3 · Servicios (`src/components/sections/Services.tsx`) — nodos «Frame 248», «Rectangle 29», «Frame 249», «Frame 91», «Rectangle 35», «Servicio Digital experience @944,2874», «Rectangle 21/22», tiles 159×159, «Frame 222-225», «Cotizar proyectos», «Explorar Asenix Copilot →»

### Cabecera y tabs

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Sección | `border-t` .5 `#6994ff` no (la línea de arriba pertenece al final de El futuro: no hay) · eyebrow a **125** del inicio | `pt-u-40` `:108` | `pt-u-125` (y quitar el `border-b`: el divisor lo pone la Fase 4) |
| H2 | 700 · 52/54 · `#fff` · **ancho 704 (dos líneas)** | `SectionHeading` | pasar `className="max-w-u-704 mx-auto"` al h2 (añadir prop `h2ClassName` a `SectionHeading` si no existe) |
| Sub | 20/28 · `#c7d7ff` · 704 | `.sub-section` | ok (Fase 1) |
| Barra de tabs | **711×90 · r55** · trazo 0.5 `conic-gradient(#4977ff 63%, #1a4dff 75%, #6994ff 88%)` · a **86** del sub | `ring-conic mt-u-63 h-u-95 rounded-full px-u-16` `:119` | `mt-u-86 h-u-90 rounded-u-55 w-u-711 max-w-full justify-center px-u-16`, `style={{"--ring-w":"0.5px","--ring-bg":"conic-gradient(#4977ff 63%,#1a4dff 75%,#6994ff 88%)"}}` |
| Tab activo | **212×66 · r47 · blanco** · texto 600 · 18 · negro | `h-u-64 px-u-44` `:128`, pill `:138` | `h-u-66 w-u-212 px-0 rounded-u-47` (el `motion.span layoutId` se queda) |
| Tab inactivo | texto 600 · 18 · blanco | ok | — |

### Tarjeta

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Tarjeta | 1440×752 · a **78** de la barra · r **35 35 0 0** · `linear-gradient(180deg,#101a3e,#1a3ba9)` · trazo 0.5 `conic-gradient(#6994ff 32%,#1a4dff 50%,#6994ff 68%)` · sombra `0 0 150px rgba(26,77,255,.5)` | `:152-154` | `mt-u-78`; `--ring-bg` con ese conic; resto ok |
| Padding | izq 91 · top **104** · bottom **108** | `pt-u-92 pb-u-87 md:px-u-91` | `pt-u-104 pb-u-108` |
| h3 | 600 · 38/47 · `#fff` · 569 | `:166` | ok |
| Descripción | **300** · 20/28 · `#c7d7ff` · 569 · a **31** del h3 | `mt-u-26 font-light` `:169` | `mt-u-31` |
| Lista de ventajas | a **64** de la descripción · 2 columnas de 285 con paso **289** · filas con paso **103** · check **24 círculo `#b8f21e`** con tick blanco 15×11 · título 600 · 18/24 blanco · texto 400 · 15/**24** blanco a 33 del título | `mt-u-56 gap-x-u-48 gap-y-u-40` `:171`, check `size-u-24 fill-neon text-space` `:174`, desc `mt-u-8 lh-u-22` `:177` | `mt-u-64 gap-x-u-4 gap-y-u-… ` → mejor `grid-cols-[repeat(2,max(200px,285*var(--u)))] gap-x-u-4`; `lh-u-24`; el tick de lucide `CheckCircle2` con `fill-neon text-white` (Figma: tick blanco sobre lima) |
| Fila CTA | a **46** de la lista · **botón a la izquierda, enlace a la derecha** (hueco 20) | `pt-u-64` `:183`, enlace primero `:187`, botón después `:196` | invertir el orden de los dos hijos (los `onClick`/`href`/`trackEvent` viajan con su nodo); `pt-u-46 gap-u-20` |
| Botón «Cotizar proyecto» | **194×53 · r50 · `linear-gradient(180deg,#101837,#050b21 61%)` · borde 1 `#1a4dff`** · texto 600 · **14** · blanco | `btn-light-sm h-u-49 rounded-u-16 fs-u-15` `:196` | `tag-pill h-u-53 min-w-u-194 rounded-full px-u-24 fs-u-14 font-semibold text-white` (quitar `btn-light-sm`) |
| Enlace «Explorar…» | 500 · **14/24** · `#1cfcb9` | `fs-u-18 font-medium text-mint` `:187` | `link-mint` (Fase 1) |
| Panel azul | 645×573 · r25 · `linear-gradient(180deg,#1a4dff 28%,#294296)` · brillos: uno `blur(40px)` 703×711 centrado en (+482,+88) del panel; otro `blur(7.3px)` 1088×1015 centrado en (−34,+364) | `:208-217` | ajustar `blur-[20px]`→`blur-[40px]` y `blur-[4px]`→`blur-[7px]`; posiciones ya aproximadas (75%/15% y −5%/63%): comprobar contra el render |
| Dispositivo | 399×511 · r 20 20 0 0 · `linear-gradient(180deg,#fff,#94b2fc 47%,#7a93d0)` · borde 0.5 blanco · sombra `0 0 50px -13px rgba(255,255,255,.59)` · a 125 del borde izq y 75 del top del panel · barra 74 `rgba(255,255,255,.5)` · cámara 15/9 | `:219-223` | ok |
| Tiles | 159×159 · r15 · `linear-gradient(180deg,#101a3e,#050b21 61%)` · rejilla a 30 de los lados y **114** del top del dispositivo (barra 74 + 40) · hueco 18 · etiqueta 400 · 12/14 · `#ecefff` | `:70-89, :232` | ok (`pt-u-40` tras la barra ✓) |

No tocar: `useState(tab)`, `AnimatePresence`, tilt 3D (`:44-56`), `layoutId`, `ng:open-chat`, `trackEvent("cta_services_home")`, `SectionHeading key={locale}`.

**Verificación Fase 3:** captura a 1920: barra de tabs 711×90, tarjeta arranca a 78 de la barra, botón oscuro a la izquierda y enlace lima a la derecha; `grep -n "btn-light-sm" src/components/sections/Services.tsx` → 0 resultados; lint.

**Anti-patrones:** no reordenar los `AnimatePresence` ni sus `key`; no cambiar los iconos de las pestañas 1 y 2 (pendiente diseñadora, D6).

---

## Fase 4 · «Cómo trabajamos» (`src/components/sections/Ecosystem.tsx`) y divisores

### Divisores (afecta a `Services.tsx`, `Ecosystem.tsx`, `Process.tsx`, `Technology.tsx`)

| Límite | Figma | Código | Cambio |
|---|---|---|---|
| Servicios → Cómo trabajamos (y=3533) | `.5 px #6994ff` (Vector 31) **+** línea brillante 2.5 px (Vector 20) | `Services` `border-b border-line`, `Ecosystem` `border-y border-line` | `Ecosystem`: `border-t border-line` + un `div.divider-glow absolute inset-x-0 top-0` (Fase 1); `Services` sin `border-b` |
| Cómo trabajamos → Proceso (y=4570) | **solo** línea brillante 3 px (Vector 20), sin la de .5 | `Process` `border-t border-line` | `Process`: quitar `border-t`, poner `div.divider-glow` arriba; `Ecosystem` sin `border-b` |
| Proceso → Tecnología (y=7585) | `.5 px #6994ff` (Vector 17) | `Technology` `border-t border-line` | ok |
| Tecnología → Pruebas, Pruebas → Calculadora, Calculadora → Planes | sin línea | sin línea | ok |

### Sección — nodos «Frame 223/218-222/25», «Vector 10-15», orbit «Vector @728,3897», planeta «Vector @869,3996», slogans, «Rectangle 40»

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Fondo | `#030617` (base); sin estrellas (D2) | `bg-[#02040f]` `:163` + galaxia | `bg-void`; galaxia se queda |
| Padding | eyebrow a **125** del inicio · último texto (y 4384) → fin 4570 = **186** | `pt-u-116 pb-u-140` | `pt-u-125 pb-u-186` |
| Eyebrow → primer paso | **132** | `mt-u-130` `:176` | ok |
| Paso: título | 600 · 20/23 · blanco; **activo `#1a4dff`** | `text-neon` activo `:84` | activo `text-electric` |
| Paso: línea | 278 × **0.5** `#c7d7ff`; **activa `#1a4dff`** | `border-b-[0.5px] border-cloud` / `border-neon/70` `:78` | activa `border-electric` |
| Paso: número | círculo 42 `#101a3e` · 600 · 20 · blanco; **activo `#b8f21e`** | `bg-space fs-u-20 font-semibold` + activo `text-neon` `:96` | ok (el anillo `animate-ring` se queda) |
| Paso: descripción | **300 · 16/24** · `#c7d7ff` · a 18 de la línea; activa igual (no cambia a mist) | `fs-u-18 lh-u-23 font-light`, activa `text-mist` `:106` | `fs-u-16 lh-u-24`, activa también `text-cloud` |
| Columnas | izq x=421 · centro x=821 · dcha x=1221 (ancho 278–307) | `pl-u-110`/`pr-u-110` `:179,216`, `max-w-u-300` | medir: el paso izquierdo debe empezar en x=421±4 a 1920 |
| Órbita | elipse **464×385** trazo 1 `conic-gradient(#1a4dff 12%,#94b2fc 58%,#1a4dff 87%,#b8f21e 100%)` · planeta 185×189 `radial(#fff→#ecefff)` borde 2 `#c7d7ff` sombra `0 0 200px rgba(26,77,255,.49)` | SVG `RX 237 RY 186` `:17-31`, `lineId` `:397`, planeta r 92.5 `:459` | `RX 232`, `RY 192.5` (solo las dos constantes geométricas; el bucle rAF no cambia) y paradas del `lineId` a 12/58/87/100 % |
| Eslóganes | 600 · 38/36 · `#f1f3fe` | `:192,225` | ok |
| «Rectangle 40» | franja `#04071a` 1349×59 tras los eslóganes | no existe | opcional: `div absolute` bajo la fila central (`bg-[#04071a]`); comprobar en el render si se percibe; si no, omitir |

No tocar: `Orbit` (`:267-498` salvo las 2 constantes y las paradas del gradiente), `Galaxy`, `onPoint`/`letters()`, `Step` motions, `data-orbit`.

**Verificación Fase 4:** captura: paso activo en azul con número lima; divisor brillante bajo Servicios y bajo Cómo trabajamos; ninguna línea de .5 px entre Cómo trabajamos y Proceso. `git diff` de `Ecosystem.tsx` no toca líneas 293-372 ni 619-804 (comprobar con `git diff -U0 | grep "^@@"`).

---

## Fase 5 · Proceso (`src/components/sections/Process.tsx`) — nodos «Frame 251», «Diseño Web» ×3 (tag-pills), mocks «Servicio Digital experience» @1065,5176 (chat) · @331,5997 (voz) · @1065,6831 (reservas)

### Cabecera y ritmo

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Padding | eyebrow a **125** · última nota (y 7335) → fin 7585 = **250** | `pt-u-117 pb-u-120` `:356` | `pt-u-125 pb-u-250` (el `border-t` se va en Fase 4) |
| Sub | **400 · 26/34 · `rgba(199,215,255,.8)`** · 705 | `subSize={24}` → `fs-u-24 lh-u-32 text-cloud/80` (`SectionHeading.tsx:48-52`) | añadir variante `subSize={26}` → `fs-u-26 lh-u-34 text-cloud/80 max-w-u-705` |
| Sub → primera fila | **115** | `mt-u-180` `:360` | `mt-u-115` |
| Entre filas (fin de tarjeta → siguiente pill) | **176** | `gap-u-190` `:360` | `gap-u-176` |
| Columnas | texto x=240 (ancho 704) · tarjeta 524 pegada a x=1065–1589 (91 del borde dcho del contenedor) | `lg:grid-cols-2 lg:gap-u-100` `:361` | `lg:grid-cols-[704fr_524fr]`→ mejor `lg:grid-cols-[minmax(0,704*var(--u))_minmax(0,524*var(--u))] lg:justify-between lg:gap-0`; la fila de voz mantiene el `order` invertido `:367,370` |

### Texto de cada fila

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Tag-pill | 243×72 (auto ancho) · r30 · `linear-gradient(180deg,#101837,#050b21 61%)` · borde 1 `#1a4dff` · brillo interior `blur(24px)` · texto 600 · 18 · **`#779eff`** | `.tag-pill … fs-u-18 font-semibold` `:35` (texto frost) | `text-periwinkle` |
| h3 | 400 · 45/49 · `#f1f3fe` · 704 · a 53 del pill | `:95` | ok |
| Descripción | 400 · 20/**28** · `rgba(199,215,255,.8)` · a 15 del h3 | `mt-u-14 lh-u-30 text-cloud/80` `:96` | `lh-u-28` |
| Viñetas | 500 · 16/35 · blanco · a **50** de la descripción · 2 columnas: x=281 y x=617 (2ª columna a 377 del inicio) · chevron 25×26 trazo `#b8f21e` grosor 3 | `mt-u-40 gap-x-u-24` `:44`, `size-u-14 strokeWidth={3}` `:47` | `mt-u-50`, `grid-cols-[max(160px,336*var(--u))_1fr]`, chevron `size-u-24` |
| Nota | icono 60 · texto 400 · 24/24 · `#1a4dff` · a **58** de las viñetas · el icono lleva `#779eff` + detalle `#b8f21e` | `mt-u-44` `:62`, icono `text-neon` `:64` | `mt-u-58`; icono `text-periwinkle` (los vectores reales siguen pendientes, D6) |

### Mock del chat (`ChatMock` `:130-176`)

Figma: 524×573 · r **30 30 30 39** · `linear-gradient(180deg,#0a1540,#1a4dff)` · trazo 1.5 `linear-gradient(0deg,#6994ff,#1a4dff)` · cabecera 109 `rgba(26,77,255,.75)` r 30 30 0 0 · nombre 500 · 24 · blanco · estado 300 · 15 · `#ecefff` · «Hola» 95×62 `#1a4dff` r 25 25 5 25 texto 400 · 18 `#ecefff` · texto bot 437 · 18/24 · usuario 320×62 r 25 25 5 25 texto 18/21 alineado dcha · input 437×73 r25 borde 1 `#c7d7ff` a 47 del fondo, placeholder 400 · 18 blanco · disco 43 blanco con brillo 35. **Sin «×»** de cierre. Código: ya casi idéntico. Cambios: `rounded-u-30` + `rounded-br-u-39`; quitar el `X` (`:145-148`); confirmar `pb-u-47` y `px-u-45`. Las burbujas escalonadas (`bubble(i)`) no se tocan.

### Mock de voz (`VoiceMock` `:191-244`)

Figma: 522×573 · r25 · `radial-gradient(55% 45% at 50% 50%,#1a4dff,#101837)` · trazo 1.5 · chips `#101a3e` r25 · 55 alto · texto 400 · 16/18 blanco · icono «ondas» 42×44 · **tres discos concéntricos centrados: 332 (opacidad .25), 290 (opacidad .25), 207 (núcleo) + teléfono 50×54**. Colores medidos en `png/00-home-full.png` (fila y=6285): exterior ≈ `#1a4dff` al 25 % sobre la tarjeta (píxel `#133b86`), medio ≈ `#38d4ff` al 25 % (píxel `#1770a8`), núcleo `#1cfcb9` sólido; teléfono `#1a4dff` · línea 434×1 `#c7d7ff` a 436 del top · lista de sectores 400 · 16/28 blanco en dos columnas (x=371 y x=608) con iconos 22.
Código: los anillos `animate-ring` y el latido del orbe **se quedan**; se añaden **detrás** dos `div` estáticos redondos (332 y 290, `bg-…/25`) y el núcleo pasa a `size-u-207` (hoy `size-u-200`), teléfono `size-u-50`. Chips ok. Separador `border-t border-cloud` ok (mover a 436 del top ⇒ `pt`/`mb` medidos).

### Mock de reservas (`BookingMock` `:287-345`)

Figma: 524×573 · r 30 30 30 39 · `linear-gradient(180deg,#1a4dff,#0a1540)` · trazo 1.5 · chips 55 alto r25 («Cliente» `#ecefff` texto 500 · 18 `#294296`; resto `#1a4dff` texto `#ecefff`) · líneas blancas 1 px · orbe 251×158 (Frame) en (136,113) del top-left. Código: ya coincide salvo `rounded-br-u-39`. Comprobar posiciones de los chips (`BOOK` `:257-270`) contra el render; ajustar solo coordenadas estáticas.

**Verificación Fase 5:** captura de las tres filas: pill con texto `#779eff`, chat sin «×», voz con tres discos, reservas con esquina inferior derecha 39. `git diff -U0 Process.tsx | grep "^@@"` no incluye 103-124, 198-207, 289-298.

**Anti-patrones:** no cambiar `EASE`, `reveal()`, `bubble()`, `animateMotion`; no cambiar el `order` de la fila de voz en móvil.

---

## Fase 6 · Tecnología (`Technology.tsx`) y Pruebas (`CaseStudies.tsx`)

### Tecnología — nodos «Frame 246/247», «Rectangle 168…», «Ellipse 63…»

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Padding | eyebrow a **173** · fila B (8302) → fin 8389 = **87** | `pt-u-130 pb-u-160` `:107` | `pt-u-173 pb-u-87` |
| Contenedor | igual que el resto (1920 / 12.5 %) | `max-w-7xl px-6` `:108` | `max-w-[1920px] px-5 md:px-10 xl:px-[12.5%]` |
| Sub | 20/28 · `#c7d7ff` · 705 | `subSize={18}` `:109` | quitar `subSize` (20/28 por defecto) |
| Sub → filas | **123** · hueco entre filas **29** | `mt-u-130 gap-u-24` `:117` | `mt-u-123 gap-u-29` |
| Pill | **55** alto · r47 · `rgba(255,255,255,.1)` · trazo 0.5 `rgba(148,178,252,.61)` · hueco entre pills **10** · disco **37×38** blanco a 9 del borde · logo ≈ 26 · texto 500 · **16** blanco a 55 del borde izq · padding dcho ≈ 27 | `h-[max(58px,70*var(--u))]`, `mx-u-6`, disco 48, logo 36, texto 18 (`:53-69`) | `h-[max(44px,55*var(--u))] mx-[max(4px,5*var(--u))] pl-[max(7px,9*var(--u))] pr-[max(20px,27*var(--u))] gap-[max(7px,9*var(--u))] text-[max(13px,16*var(--u))]`; disco `size-[max(30px,37*var(--u))]`; `Image` `className="size-[max(20px,26*var(--u))]"`; `--ring-bg: rgba(148,178,252,.61)` (sólido) |

No tocar: `animate-marquee`, `[...items,...items]`, `hover:[animation-play-state:paused]`, `loading="eager"`.

### Pruebas — nodos «Rectangle 162 @−4,8389», «Frame 300», «Frame 90», «Frame 87», tarjeta «Servicio Digital experience @731,8633», panel @1144,8671, «Rectangle 104», «Frame @1317,8765», «Ver casos…»

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Fondo de sección | `linear-gradient(180deg,#030617,#040b24)` en 827 de alto | `bg-void` `:102` | `bg-[linear-gradient(180deg,#030617_0%,#040b24_100%)]` |
| Intro | h2 700 · 52/54 · blanco · 455 · sub 20/28 `#c7d7ff` 390 a **28** · enlace 500 · **14/24** `#1cfcb9` a **60** · nota 12 `mist/70` | `mt-u-40` `:111`, `fs-u-18 mt-u-56` `:114` | `mt-u-28`; enlace `link-mint mt-u-60` |
| Tarjeta | 826×365 · r25 · `linear-gradient(247deg,#101837,#050b21)` **a opacidad .5** · destacada: trazo **2** `conic-gradient(#6994ff 12%,#1a4dff 50%,#6994ff 85%)` + sombra `0 0 150px rgba(26,77,255,.5)` (+ `0 0 81.8px 25px rgba(26,77,255,.5)` en la capa interior) · no destacada: trazo **1** `conic(#6994ff 26%,#1a4dff 50%,#6994ff 74%)` sin sombra · hueco 52 | `card-navy`, `--ring-w 2px` todas `:128-134` | destacada `--ring-w:2px` + `--ring-bg` con 12/50/85 %; resto `--ring-w:1px`; añadir `bg-opacity`: usar `card-navy` con `opacity` del fondo vía pseudo o `bg-[linear-gradient(247deg,rgba(16,24,55,.5),rgba(5,11,33,.5))]` |
| «+ Clientes» | 500 · 45/48 · `#1a4dff` · top 111 · izq 53 | `pt-u-73`+`pt-u-38` ✓, `font-medium` ✓ | ok |
| Historia | **300 · 20/25 · `#779eff`** · 254 · sangría 42 | `text-[#597eff] font-light` `:143` | `text-periwinkle` |
| Panel azul | 376×290 · r16 · `linear-gradient(180deg,#1a4dff 21%,#03259b)` · top 38 · dcha 37 | `:152` | ok |
| Chips | 45 alto · r20 · `linear-gradient(180deg,#182a6d,#101837)` · 500 · 15 `#ecefff` · izq 25 · top 28 · hueco 7 | `:154-162` | ok |
| Cifra / etiqueta | 600 · 35 blanco · **400** · 20 `#1cfcb9` · a 25 del fondo | `:169-172` | etiqueta `font-normal` |
| Persona | 179×197 pegada abajo, a 24 de la dcha, degradado `#1cfcb9→#38d4ff` | `:174` ✓ | ok |

No tocar: GSAP pin (`:73-99`), `Counter`, `STATS`, `featured = i===0`, snap en móvil.

**Verificación Fase 6:** pills de tecnología de 55 px a 1920 (medir con `getBoundingClientRect`), fondo de Pruebas con degradado, historia en `#779eff`. Lint. Diff sin tocar `:73-99` de CaseStudies.

---

## Fase 7 · Calculadora (`Roi.tsx`) y Planes (`Plans.tsx`)

### Calculadora — nodos «Rectangle 141/144/140», «Frame 294», «Frame 236», «Extended FAB»

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Sección | tarjeta a 9436 (Pruebas termina 9216: sin línea, 220 de aire) · tarjeta → eyebrow de Planes **126** | `pb-u-134 pt-u-120` `:45` | `pt-u-120 pb-u-63` (Planes pone `pt-u-63`) |
| Contenedor | tarjeta 1196 centrada (x 362) | `max-w-[1920px] px-5 md:px-10` | ok |
| Tarjeta | 1196×568 · r35 · `linear-gradient(180deg,#09112d,#0e1f5c)` · trazo 1.3 `conic(#6994ff 26%,#1a4dff 50%,#6994ff 72%)` · padding izq 50 · top **71** · dcha 37 · bottom 35 | `md:pt-u-35 lg:pt-u-28` `:52-58` | `pt-u-71` en el contenedor y quitar el `lg:pt-u-28` de la columna |
| Eyebrow | pill nuevo lima «CALCULADORA» | `eyebrow eyebrow-gradient` `:59` | `eyebrow` (el copy lo da el diccionario; si dice «La cuenta» se deja, D5) |
| H2 | 600 · 35/40 · blanco · 462 · a 23 · segunda línea `#1a4dff` | `mt-u-24 …` `:61-64` | ok |
| Cuerpo | 400 · 18/**27** · blanco · 485 · a **12** | `mt-u-24 lh-u-25` `:66` | `mt-u-12 lh-u-27` |
| CTA | 375×**66** · r47 · `#c7d7ff` · 600 · 15 · `#030617` · a 51 · flecha a la dcha | `h-u-62` `:75` | `h-u-66` |
| Nota | **500** · 12/22 · `#c7d7ff` · a 44 | `mt-u-40 font-medium` `:80` | `mt-u-44` |
| Panel claro | 577×498 · r35 · `linear-gradient(180deg,#fff,#c7d7ff)` · trazo 1.3 `rgba(148,178,252,.5)` · padding 37/36 | `:84` | ok |
| Título panel | 600 · 22/23 · negro · centrado | `:85` | ok |
| Etiquetas / campos | 700 · 12 negro · campo 250×60 r16 blanco sombra `0 1px 4px rgba(12,12,13,.05), 0 1px 4px rgba(12,12,13,.1)` · valor 500 · 15 negro · etiqueta a **27** del título · paso de fila **99** (hueco entre campo y etiqueta siguiente 16) · hueco columnas 9 | `mt-u-33 gap-y-u-37` `:87` | `mt-u-27 gap-y-u-16` |
| Caja resultado | 509×169 · r16 · `#1a4dff` · a 20 · dt 500 · 15 `#c7d7ff` · dd 700 · 18 (`#c7d7ff` / `#b8f21e`) · «Se paga solo en» 600 · 18/22 blanco · cifra «3.9» **600 · 45** blanco y «meses» **600 · 25** (por `styleOverrideTable` del nodo «3.9 meses») | `fs-u-45 font-semibold` `:113`, `fs-u-25 font-semibold` `:114` | ok |

No tocar: `calculate(EJEMPLO, …)`, formateadores, `trackEvent("cta_calculadora_home")`, reveal.

### Planes — nodos «Frame 292», tarjetas «Servicio Digital experience @498/809/1120,10498», estrellas «i1», enlace «¿Necesitas…»

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Sección | eyebrow a 126 de la tarjeta de Calculadora · enlace (10734) → fin 10824 = **90** | `pt-u-63 pb-u-120` `:45` | `pb-u-90` |
| Sub | 20/28 · `#c7d7ff` · **950** | `subSize={18}` `:47` | quitar `subSize`; `max-w-u-950` |
| Tarjetas | 301×88 · r30 · a **86** del sub · hueco **10** · destacada `linear-gradient(180deg,#1a4dff,#102e99)` + borde 1 `#1a4dff` · resto blanca | `mt-u-113 gap-u-20` `:49`, `h-u-86 w-u-296` `:62` | `mt-u-86 gap-u-10 h-u-88 w-u-301` |
| Nombre | 600 · **24**/30 (blanco / negro) | `fs-u-22` `:77` | `fs-u-24` |
| Precio | destacada **500 · 16 `#b8f21e`** · resto 600 · 16 `#1a4dff` | `fs-u-15` `:78` | `fs-u-16` |
| Estrella | 41×41 · top −20 · **48** del borde dcho · destacada `#b8f21e`, resto `#1a4dff` | `-top-[…15u] right-[…56u] size-u-32` `:72-75` | `-top-[max(12px,20*var(--u))] right-[max(28px,48*var(--u))] size-u-41` |
| Enlace final | **toda la línea** 500 · 14/24 · `#1cfcb9` · a 122 | `fs-u-18 text-frost` + link `text-mint` `:93-102` | `link-mint` en el `<p>` y el `<a>` hereda; `mt-u-122` |
| «Ver todos los planes…» | no existe (D4) | `:105` | se deja, `mt-u-12 fs-u-12 text-mist/70` |

No tocar: `pricingDicts`, `p.star`, sparkle `animate-sparkle`, delays, `trackEvent`.

**Verificación Fase 7:** tarjetas 301×88 con hueco 10; estrella a 48 del borde; eyebrow de Calculadora lima; lint.

---

## Fase 8 · Hablemos (`FinalCTA.tsx`) y Footer (`Footer.tsx`) — nodo «Frame 254» y sus hijos

### Hablemos

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Fondo | `#f0f2ff` (Rectangle 12) · sin brumas (D3) | `bg-paper` + aurora + bruma esquina `:35-46` | `bg-paper` (token ya `#f0f2ff`, Fase 1); eliminar la bruma estática `:45`; la aurora `:41` se queda |
| Padding | titular a **151** del inicio | `pt-u-171` `:50` | `pt-u-151` |
| Titular | **«Hablemos.» 600 · 60/65 · negro `#000`; resto 400 · 60/65 · negro; ls −0.05em; ancho 580**; empieza en x=240 | `fs-u-65 lh-u-62 text-electric` `:54` | `fs-u-60 lh-u-65 text-black max-w-u-580` (tracking −0.05em ✓). Es el fill por `characterStyleOverrides`, no el fill base azul |
| Lista de navegación | columna derecha (x 1481–1680, top = top del titular) · alineada a la derecha · 500 · **16/34** · ls 0.07em · negro · Plataforma · Servicios · Ecosistema · Pruebas · Proceso · Calculadora · Precios · Contacto | vive en `Footer.tsx:129-144` como fila pequeña | mover el `<nav aria-label={t.navAria}>` con sus `HREFS` y la rama `Link`/`<a>` a `FinalCTA.tsx` como columna derecha (`hidden lg:flex flex-col items-end gap-0 font-medium fs-u-16 lh-u-34 tracking-[0.07em] text-black`) y quitarlo del pie. Mismos hrefs, mismo `aria-label` |
| Botón «Contactar» | 213×66 · r47 · **`#d5dae9`** · texto 600 · 18 · `#010104` · **sin flecha** · a **91** del titular | `btn-light-paper min-w-u-244` + flecha `:72-75`, `mt-u-54` `:65` | `min-w-u-213 min-h-u-66` (MagneticButton usa `min-h-u-72`: pasar `className="min-h-u-66"`), quitar el `<ArrowRight>`; `mt-u-91`; `.btn-light-paper` ya es `#d5dae9` |
| Enlaces | dos, **apilados** a la derecha del botón (x 485 = botón + 32): «Pregunta a nuestra AI →» / «Hablale en voz alta →» · 500 · **18/24** · `#1a4dff` · **subrayados** (`textDecoration: UNDERLINE`) · paso 27 | `text-sm text-ink/70` con `//` y `Mic` `:85-104` | envolver los dos en `div.flex.flex-col.gap-u-3` con `font-medium fs-u-18 lh-u-24 text-electric`; quitar el `//` y el icono `Mic`; el texto termina en «→» (usar el copy del diccionario + `→`; si el diccionario ya lleva «→» no duplicar). Los `onClick` (`ng:open-chat`, `ng:open-voice`, `warmUpVoice`) **se conservan** |
| Nota email | no existe (D4) | `:113` | se deja: `mt-u-24 fs-u-12 text-ink/50` |

### Footer

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Fondo | `#f0f2ff` · sin borde superior | `bg-paper` `:65` | ok |
| Redes | tres círculos **41** `#161614` en x 1539/1589/1639 (hueco 9), y = 11411 (**131** bajo el último enlace de Hablemos), iconos blancos 20 | `SOCIALS = []` `:43` (estilo listo `:120`) | sin cambio (D6: faltan URLs); el estilo `size-u-41 bg-[#161614]` ya coincide |
| Logo | 83×68 negro en x=240, y=11440 · tagline a **21** del logo · 459 · **400 · 16/24** · `rgba(4,5,10,.9)`; primera línea semibold | `h-u-68 gap-u-23` ✓, `fs-u-20 lh-u-24` `:77` | `fs-u-16` |
| Legal | fila derecha, y=11469 · **14** · negro · separadores « / » (el nodo dice 400 sin `textCase`; el render se lee en mayúsculas y seminegrita: mantener `uppercase` y 600, bajar a 14) | `fs-u-16 font-semibold uppercase tracking-[0.07em]` `:89` | `fs-u-14` |
| © | «© 2026 Asenix» **700 negro** (override) + «Todos los derechos reservados.» 500 · `#586a96`, todo a 14 · ls 0.07em · una sola línea · y=11497 | `fs-u-16 font-semibold text-black` `:85` + «Todos los derechos» aparte `:148` | `fs-u-14 tracking-[0.07em]`; unir en una línea: `<span class="font-bold text-black">© 2026 Asenix</span> <span class="font-medium text-slate">Todos los derechos reservados.</span>`; eliminar la línea `:148` |
| Nav pequeña | no existe (se movió arriba) | `:129-144` | eliminar de aquí (ver Hablemos) |
| Padding | pie termina 110 bajo el © | `pb-u-70` `:68` | `pb-u-110` |

No tocar: `openCookiePreferences`, `LEGAL_SLUGS`, `new Date().getFullYear()`, `tone`, `useScroll` de FinalCTA, `TextReveal`, `MagneticButton`.

**Verificación Fase 8:** captura: titular negro de 60 px, lista de navegación a la derecha, botón gris sin flecha con dos enlaces azules apilados, pie con © en gris. `grep -n "Mic" src/components/sections/FinalCTA.tsx` → 0. `git diff` de `Footer.tsx` solo quita el `<nav>` y cambia clases.

---

## Fase 9 · Verificación final

1. `npm run lint && npx tsc --noEmit && npm run build` limpios.
2. **Animaciones intactas** (prueba mecánica):
   ```bash
   git diff main -- src | grep -E "^[-+]" | grep -vE "^(\+\+\+|---)" | grep -E "motion\.|useScroll|useTransform|useSpring|useInView|gsap|ScrollTrigger|Lenis|requestAnimationFrame|IntersectionObserver|addEventListener|onClick|onMouseMove|dispatchEvent|trackEvent|href=|@keyframes|--animate-" 
   ```
   Debe devolver **solo** las líneas movidas literalmente (los enlaces de Hablemos y el `<nav>` del pie); cualquier otra coincidencia es un cambio de comportamiento y se revierte.
3. **Copy intacto:** `git diff main -- src/i18n` vacío.
4. **Captura completa a 1920** con `scripts/figma/shot-home.mjs` (Fase 1.2) y comparación sección a sección con `docs/figma/home-1532/png/`. Para cada sección, medir en el panel Browser (viewport 1920×1080, `getBoundingClientRect`) y anotar en `docs/figma/home-1532/audit.md` (tabla `Propiedad | Figma | Medido | Estado`):
   - Header 116–120; hero: título y≈400, botones y≈820, 213×72.
   - Eyebrows: 28 de alto, texto lima, sin `//`.
   - Servicios: tabs 711×90; tarjeta 1440×752 a 78; botón oscuro 194×53 a la izquierda.
   - Cómo trabajamos: paso activo azul; divisores brillantes.
   - Proceso: pills `#779eff`; tres discos de voz; chat sin «×».
   - Tecnología: pills 55; hueco 29 entre filas.
   - Pruebas: fondo degradado; historia `#779eff`; tarjeta 826×365.
   - Calculadora: tarjeta 1196×568; CTA 375×66.
   - Planes: 301×88, hueco 10, estrella 41.
   - Hablemos: titular negro 60/65; nav derecha; botón 213×66 sin flecha.
   - Pie: tagline 16; © 14.
5. **Móvil no roto:** panel Browser preset `mobile` (375): recorrer la home; nada desaparece ni se desborda (los suelos de `*-u-*` siguen activos). Comprobar `/precios`, `/calculadora`, `/contacto` por el cambio de `.eyebrow`, `.sub-section` y `--color-paper`.
6. Marcar en `docs/figma/home-1532/audit.md` los pendientes externos heredados (D6) y las decisiones D1–D5 con su resolución.
7. Commit en rama `figma/home-1532` con mensaje en el estilo del repo (español, una línea que dice qué queda como en el Figma), PR a `main`.

**Anti-patrones finales:** no hacer «ajustes de ojo» sin cita de nodo; no cambiar valores que ya coinciden; no dejar utilidades muertas en `globals.css` (`grep` de cada clase nueva ⇒ ≥1 uso).
