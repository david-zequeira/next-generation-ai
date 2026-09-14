# Plan · `/calculadora` al píxel contra el Figma «Asenix Calculadora» (984:14321 + 1555:66997)

**Objetivo.** Que `/calculadora` reproduzca al píxel los dos marcos que la diseñadora
mantiene en `IxRzkKKPa5XStlUI6UnpBv` («Asenix Web»): colores, degradados, bordes, radios,
sombras, tipografía, composición y espaciados. **No se toca ni una animación, ni un texto,
ni una función.**

**Fuente de verdad.** Extracción del **14 sep 2026, 07:45**, del fichero modificado ese mismo
día a las **06:45** (`lastModified 2026-09-14T06:45:12Z`). Los dos marcos son los dos estados
de la misma página:

| Marco | Nodo | Tamaño | Qué enseña |
|---|---|---|---|
| **Asenix Calculadora1** | `984:14321` | 1920×**6461** | el panel de la cuenta **vacío** («Rellena tus números») y el FAQ todo cerrado |
| **Asenix Calculadora2** | `1555:66997` | 1920×**6573** | el panel de la cuenta **con datos** (payback, barra, desglose, retorno) y una pregunta abierta |

Salvo eso, son idénticos. Extraídos a `docs/figma/calculadora/` y `docs/figma/calculadora-datos/`.

Toda medida se escribe como `N*var(--u)` con las utilidades `*-u-N` (`src/app/globals.css:130-233`):
`--u: min(1px, calc(100vw / 1920))`, exacta a 1920 y proporcional por debajo. **La página ya
está migrada a esa escala** (118 usos de `-u-`): esto es corrección de desviaciones, no migración.

**Cómo se ejecuta.** Cada fase es autónoma: chat nuevo, leer «Fase 0» + la fase que toque,
cumplir su checklist. Las fases 2–9 dependen de la **Fase 1** y son independientes entre sí.

**Rama.** Partir de `figma/home-1532` (ahí viven las primitivas nuevas y el PR #21 sigue
abierto), rama `figma/calculadora-984`, PR contra `figma/home-1532`.

---

## Historial (por qué este plan se rehízo)

1. El **PR #17** (9 sep) ya ajustó esta página contra este marco y acertó en casi todo.
2. La rama `figma/home-1532` reescribió después las primitivas globales (`.eyebrow`,
   `.sub-section`, `--color-paper`) **sin volver a mirar la calculadora**.
3. La primera versión de este plan se escribió sobre una extracción del **9 sep** y
   **sin un solo render**. Al abrir el fichero real el 14 sep resultó que la diseñadora
   había seguido trabajando: marco partido en dos, pastillas rehechas, FAQ reescrito,
   tarjetas de «cómo se recupera» con sombra y borde nuevos, botones con iconos distintos.
   Tres «correcciones» de aquella versión eran **falsas** (ver «Errores corregidos»).
4. Esta versión sale de la extracción del 14 sep por `GET /v1/files/:key` — el endpoint que
   **sí** responde mientras `/nodes` y `/images` siguen en 429 (ver 0.6).

### Errores corregidos respecto a la versión anterior del plan

| Lo que decía | Lo que es |
|---|---|
| «Las pastillas son azules de 35 con `//`; hay que crear `.eyebrow-calc`» | **Falso.** Son lima de 28 sin `//`, byte por byte el `.eyebrow` que ya existe. Se anula `.eyebrow-calc` |
| «Falta en el código el disco de 176 con flecha del hero» | **Falso.** `Frame 158` es la maqueta del **botón flotante del chat**; el código ya lo tiene (`ChatWidget`, `:768`) |
| «‹Meses› debe subir de 25 a 45» | **Falso.** La tirada « Meses » es **25**; solo «3.9» es 45. El código ya estaba bien |
| «Entre las tarjetas de ‹cómo se recupera› hay flechas ‹→›, no rayas» | **Falso** (me lo pareció en un render al 50 %). Son `Vector 17`/`Vector 18`: rayas de **35×2 px `#354d8e`** |

---

## Decisiones — todas resueltas

| # | Tema | Figma (14 sep) | Código | Resolución |
|---|---|---|---|---|
| **D1** | Pastillas (`eyebrow`) | **Lima `#b8f21e`, 12/22, 0,05 em, UPPER, sin `//`**; sobre fondo oscuro: alto **28**, r50, fondo `rgba(213,218,233,0.08)`, borde `#94b2fc` 0,3 px. Sobre el módulo blanco: alto 28, r50, **relleno sólido `#050b21`, sin borde**, texto a peso **500** | `.eyebrow` global | **El `.eyebrow` actual ya es exacto** para las de fondo oscuro. Solo hace falta una variante `.eyebrow-dark` para las dos del módulo blanco, y **borrar** `before:content-none` de `:661` |
| **D2** | «Hablemos» (banda 08) | Ahora es **idéntico al home**: H1 600 · **60/65** · −0,05 em, botón `#d5dae9`, «Contactar» `#010104`, nav a la derecha 500 · 16/34 · 0,07 em | `FinalCTA.tsx` con la versión del home | **Nada que hacer.** El marco se alineó con el home. No se toca `FinalCTA.tsx` |
| **D3** | Pie (banda 09) | Idéntico al home (`#f0f2ff`, © `#586a96` 14/66 · 0,07 em) | versión del home | **Nada que hacer.** No se toca `Footer.tsx` |
| **D4** | Respuestas del FAQ | `Calculadora2` **sí** tiene una fila abierta (`Frame 298`, 667×**175**) | `<details>` nativo | **Se conserva** el desplegable; la fila abierta del Figma confirma que el patrón es correcto |
| **D5** | Barra fija de móvil (`:742-760`) | No existe (el Figma es solo desktop) | resumen pegado abajo, `lg:hidden` | **Se conserva.** Solo se pasa a tokens y a la escala `--u` (Fase 9) |
| **D6** | Estado activo de las pastillas de sector | No existe: las 6 van en `#779eff` | activa = `bg-electric text-white` + sombra | **Se conserva** (es estado, no diseño) |
| **D7** | Los dos módulos de la derecha | **Dos marcos**, uno por estado | se renderizan según `hasData` | **El código ya hace lo correcto.** Módulo A = `Calculadora1`, módulo B = `Calculadora2` |
| **D8** | Tarjetas de «Cómo se recupera» | Contenido **a la izquierda** (todo en `x = tarjeta + 32`) y **sin raya divisoria** dentro | `items-center text-center` + raya `:598` | **A la izquierda** (confirmado). Y **se elimina la raya**: no existe en el Figma |
| **D9** | Claves muertas del diccionario y aviso de hipótesis | El aviso (`t.assumptions.warning`, `:555`) **no está** en el módulo con datos | se renderiza | **Fuera de alcance de píxeles.** Se conserva el texto y se anota en `audit.md` como deuda de contenido. El hueco ROI→CTA del Figma (122) se reparte contando con él |

---

## Fase 0 · Descubrimiento (HECHO; leer, no repetir)

### 0.1 Fuentes

| Qué | Dónde |
|---|---|
| Árbol del marco vacío | `docs/figma/calculadora/raw.json` (310 KB) + `spec.md`, `tokens.md`, `sections.json`, `meta.json` |
| Árbol del marco con datos | `docs/figma/calculadora-datos/` (328 KB, misma estructura) |
| Plantillas de auditoría | `docs/figma/calculadora/audit.md` y `.../calculadora-datos/audit.md` — vacías, se rellenan en la Fase 10 |
| Precedente y método | `plans/01-home-pixel-perfect-figma-1532.md`, `docs/figma/home-1532/audit.md` |

**No hay PNG**: `/v1/images` sigue en 429. Las capturas de comprobación se hacen de la web
(Fase 1.3), y el diseño se contrasta abriendo el fichero en el navegador.

### 0.2 Bandas del marco (px a 1920, y relativo al marco)

| # | Banda | y0 | y1 | Componente |
|---|---|---|---|---|
| 01 | Header | 0 | 120 | `layout/Navbar.tsx` |
| 02 | Hero | 120 | 827 | `calculator/CalculatorPage.tsx` (cabecera) |
| 03 | Intro calculadora | 827 | 1336 | ídem (intro) |
| 04 | Formulario y cuenta | 1336 | 3091 | ídem (pasos + panel) |
| 05 | Qué lo resuelve | 3091 | 3918 | ídem (soluciones) |
| 06 | Preguntas y respuestas | 3918 | 4874 | ídem (FAQ) |
| 07 | Te enviamos los resultados | 4874 | 5667 | ídem (captura) |
| 08 | Hablemos y pie | 5667 | 6461 | `sections/FinalCTA.tsx` + `layout/Footer.tsx` |

Divisores a todo el ancho, `#6994ff` **0,5 px**: `Vector 32` en **y=827** y `Vector 31` en **y=3918**.
Hoy el código no pinta ninguno de los dos.

### 0.3 API permitida

- **Escala:** `--u` (`globals.css:130-132`) y las utilidades `*-u-N` (`:136-233`):
  `fs-u-* lh-u-* h-u-* min-h-u-* w-u-* max-w-u-* size-u-* p-u-* px-u-* py-u-* pl-u-* pr-u-*
  ml-u-* mr-u-* pt-u-* pb-u-* mt-u-* mb-u-* mx-u-* my-u-* top-u-* right-u-* bottom-u-* left-u-*
  min-w-u-* inset-u-* gap-u-* gap-x-u-* gap-y-u-* rounded-u-* rounded-t-u-*`.
  Suelos: tipografía `max(12px, N*0.62px, N*var(--u))`; `lh-u-*` **sin suelo absoluto**; el
  resto `max(N*0.6px, N*var(--u))`.
- **No existen:** `border-u-*`, `tracking-u-*`, `space-y-u-*`, `rounded-b-u-*`, `inset-x/y-u-*`,
  `scroll-mt-u-*`. Lo que falte se añade en la Fase 1 con su `@utility` **y al menos un uso**.
  Para un valor suelto: `[max(Mpx,N*var(--u))]` inline (como `Technology.tsx:53-63`).
- **Tokens de color** (`globals.css:15-32`): `void #030617 · abyss #050b21 · space #101a3e ·
  navy #101837 · panel #0a1540 · electric #1a4dff · neon #b8f21e · pulse #94b2fc · cloud #c7d7ff ·
  mint #1cfcb9 · cyan #38d4ff · frost #eceFFF · mist #a7b2d1 · periwinkle #779eff · slate #586a96 ·
  paper #f0f2ff · ink #0b1226 · line rgba(105,148,255,.5)`.
- **Colores del marco sin token**: `#081248` (fondo de los iconos de la banda 05), `#354d8e`
  (rayas), `#6994ff` (divisores y tiradas cónicas), `#102e99` (tiradas lineales), `#0f1f60`/`#103acf`
  (tarjeta de plan activa), `#0044ff` (un icono), `rgba(6,11,40,0.72)` (filas del FAQ),
  `rgba(154,165,192,0.8)` (panel de retorno). Se escriben como literales.
- **Primitivas** (`globals.css:293-604`): `.ring-conic` (`--ring-w`, `--ring-bg`; por defecto
  `conic-gradient(#6994ff 26%, #1a4dff 50%, #6994ff 74%)`), `.eyebrow`, `.btn-light`,
  `.btn-light-sm`, `.btn-outline`, `.link-mint`, `.h2-section`, `.sub-section`, `.btn-blue`.

### 0.4 Bloques que NO se tocan (animación / estado / función)

Solo pueden cambiar **cadenas de `className`, valores CSS literales y la estructura de nodos
estáticos**. En `src/components/calculator/CalculatorPage.tsx`:

- `:1-33` imports y constantes (`AGENT_URL`, `EMAIL`, `EASE`, `Fields`, `EMPTY`, `EXAMPLE`).
- `:35-55` `toNumber`; `Rich` (su `split("**")` / `i % 2` es funcional; solo `strongClass` es estilo).
- `:57-69` `Reveal` — `motion.div` con `whileInView`, `viewport={{once:true,margin:"-8%"}}`,
  `transition={{duration:0.85, delay, ease:EASE}}`. **Única animación del fichero**: no hay
  `useTransform`, ni `AnimatePresence`, ni GSAP, ni `IntersectionObserver`. Su `className` sí
  se puede editar; convertirlo en `div`, no.
- `:156-219` `useLocale`, los cuatro `useState`, el `useMemo` de `calculate(...)`,
  `hasData`/`worksOut` (gobiernan los condicionales de `:378, 467, 483, 488, 495, 544, 552, 742`),
  el `useEffect` de `trackEvent("calc_completed")`, los `Intl`, `set`, `pickSector`, `reset`.
- `:221-277` `breakdown()` y `handleSubmit` (`preventDefault`, `FormData`, `getSessionId`,
  `mailto` de respaldo `:257-262`, `fetch(AGENT_URL/api/lead)`, `trackEvent("calc_lead_submitted")`).
- `:279-297` `gainPct`, `rows[]`, `loadExample`. `inputCls` (`:291-292`) es una **cadena de
  clases**: editable como cadena, usada en `:691` y `:695`.
- **`style` inline funcionales:** `--ring-w`/`--ring-bg` en `:128, 342, 651`; `width:${gainPct}%` en `:508`.
- **Handlers:** `:113`, `:357`, `:420`, `:447`, `:454`, `:475`, `:688`, `:718`; honeypot `:699-704`
  (su posición fuera de pantalla es antibot, **no** estilo); `<details>/<summary>` `:629-642` con
  `group/faq` + `group-open/faq:rotate-45`.
- **Enlaces:** `:558` `#desglose` ↔ `:648` `id="desglose"` + `scroll-mt-24`; `:610` `/contacto`;
  `:674` y `:732` `/precios`; `:260` y `:709` `mailto:`.
- **Ajenos:** `Navbar` `:301`, `FinalCTA` `:763`, `Footer` `:766`, `ChatWidget` `:768`,
  `VoiceWidget` `:769` — **no se tocan** (D2, D3).
- **Diccionarios:** `src/i18n/calculadora.ts` no se toca (D9). `git diff main -- src/i18n` vacío.

### 0.5 Mapa del código

| Bloque | Líneas | className actual (resumen) |
|---|---|---|
| `StepHead` | 75-85 | `flex items-center gap-u-15`; icono `size-u-33 text-[#779eff]`; h2 `fs-u-25 leading-none font-bold text-electric`; cuerpo `mt-u-22 max-w-u-523 fs-u-16 lh-u-23` |
| `Field` | 91-122 | etiqueta `fs-u-16 lh-u-30 font-semibold`; caja `mt-u-13`; input `h-u-67 rounded-u-16 pl-u-26 pr-u-90 fs-u-15 font-medium`; sufijo `right-u-25`; pista `mt-u-13 fs-u-15 lh-u-22 font-light text-cloud/80` |
| `StepCard` | 125-134 | `--ring-w:1px` + `--ring-bg:linear-gradient(0deg,#1a4dff,#102e99)`; `ring-conic rounded-u-25 bg-[…#101837→#050b21 61%] px-u-28 pb-u-32 pt-u-40` |
| `LightModule` | 137-139 | `rounded-u-35 bg-[linear-gradient(180deg,#ffffff,#c7d7ff)] text-black` |
| Hero | 305-326 | `section … bg-[…#030617→#040b24] pb-u-160 pt-u-215` |
| Intro | 329-335 | `header … pt-u-157` |
| Rejilla | 338-567 | `mt-u-130 grid … lg:grid-cols-[minmax(0,947fr)_minmax(0,462fr)] lg:gap-u-33` |
| · panel izq. | 340-462 | `--ring-w:0.5px`; `ring-conic rounded-u-35 bg-[…rgba(16,26,62,.5)→rgba(26,59,169,.5)] p-4 pb-u-56 sm:p-u-46` |
| · pasos 1/2/3 | 346-384 / 387-405 / 408-441 | `StepCard` + `mt-u-30` |
| · botones | 444-460 | `mt-u-50 … gap-u-32`; `h-u-66 min-w-u-246` |
| · col. derecha | 465-566 | `grid gap-6 lg:sticky lg:top-24` |
| · módulo vacío | 467-481 | `px-u-42 pb-u-40 pt-u-40` |
| · módulo con datos | 483-564 | `px-u-39 pb-u-53 pt-u-49` |
| Qué lo resuelve | 570-619 | `section mt-u-87 bg-[…] pb-u-100 pt-u-71` |
| FAQ | 622-645 | `section … pt-u-100` |
| Captura | 648-737 | `section id="desglose" mt-u-216`; tarjeta `--ring-w:1.3px` + `max-w-u-1196 rounded-u-35 md:grid-cols-[minmax(0,582fr)_minmax(0,614fr)]` |
| Barra fija móvil | 742-760 | `sticky bottom-0 … mt-16 px-6 py-3` (**único bloque sin migrar**) |

### 0.6 Restricciones

1. **`/v1/files/:key` funciona; `/v1/files/:key/nodes` y `/v1/images` siguen en 429**
   (`retry-after` ≈ 3,8 días desde el 13 sep → ~18 sep). Por eso esta extracción se hizo
   pidiendo el fichero entero y recortando los dos marcos. Para repetirla:
   ```bash
   curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
     "https://api.figma.com/v1/files/IxRzkKKPa5XStlUI6UnpBv" -o /tmp/file-full.json
   # y recortar los nodos 984:14321 y 1555:66997 al formato {nodes:{id:{document}}}
   npm run figma:spec -- --in docs/figma/calculadora
   npm run figma:spec -- --in docs/figma/calculadora-datos
   ```
   Cuando vuelva `/images`, traer los PNG: `node scripts/figma/pull-home.mjs --node 984:14321
   --out docs/figma/calculadora --skip-raw --skip-fills`.
2. **No hay auto-layout**: cero `itemSpacing`, cero padding (solo los `Extended FAB`, sin
   valores). **Todos los huecos de este plan están restados de cajas absolutas.** Donde el
   copy real envuelva distinto que en el Figma, **manda la medición en pantalla**.
3. **Nodos ocultos**: el `image` de cabecera (`984:14986` / `1555:66998`) y las capas
   `State-layer` de cada `Extended FAB`. **Cada `Extended FAB` es solo una caja blanca
   redondeada**; su icono y su `Label` de Material están ocultos.
4. **Duplicados del Figma** (implementar **uno**): `Rectangle 138` + `Rectangle 181` (tarjeta
   de plan «Arranque», misma posición y mismo relleno); las dos etiquetas «Ver un ejemplo»
   (`1308:5882` @458,1484 y `1308:5883` @453,1487); y en el FAQ, **«Mi negocio no se parece al
   del ejemplo. ¿Me sirve igual?» aparece dos veces** (filas 2 y 3). Preguntar a la diseñadora.
5. **Ángulos de degradado** derivados de las asas: exactos solo si están alineadas con el eje.
   Sospechosos: `211/206/205deg` (pastillas de la captura), `0deg`/`360deg`/`180deg` (bordes de
   las tarjetas de paso). Comprobar a ojo.
6. **Bordes cónicos**: `.ring-conic` los aproxima con máscara. Los porcentajes sí son exactos.
7. **Geometría vectorial**: `GET /files` no trae `fillGeometry`, así que para los vectores solo
   hay la caja. Donde importa (los cuadrados numerados del hero) se resolvió **mirando el render**.
8. **`lh-u-*` no tiene suelo absoluto**: vigilar `lh-u-16`, `lh-u-18`, `lh-u-19` en móvil.

### 0.7 Script de consulta (copiar tal cual, desde la raíz)

```bash
cat > /tmp/calc.mjs <<'EOF'
import { readFileSync } from "node:fs";
import { paintsToCss, effectsToCss, radiusOf } from "/Users/davidzequeirazorrilla/projects/next-generation-ai/scripts/figma/lib.mjs";
const dir = process.env.DIR ?? "docs/figma/calculadora";
const raw = JSON.parse(readFileSync(`${dir}/raw.json`, "utf8"));
const root = Object.values(raw.nodes)[0].document; const R = root.absoluteBoundingBox;
const all = []; const parentOf = new Map();
(function rec(n, p) { all.push(n); parentOf.set(n.id, p); (n.children ?? []).forEach(c => rec(c, n)); })(root, null);
const Y = n => Math.round(n.absoluteBoundingBox.y - R.y), X = n => Math.round(n.absoluteBoundingBox.x - R.x);
const runs = n => { const ov = n.characterStyleOverrides ?? [], tb = n.styleOverrideTable ?? {}; const segs = []; let cur = null;
  for (let i = 0; i < n.characters.length; i++) { const k = ov[i] || 0; if (!cur || cur.k !== k) { cur = { k, a: i, b: i + 1 }; segs.push(cur); } else cur.b = i + 1; }
  return segs.filter(s => s.k).map(s => { const o = tb[s.k] || {}; const bits = [];
    if (o.fontWeight) bits.push("w" + o.fontWeight); if (o.fontSize) bits.push(o.fontSize + "px");
    if (o.lineHeightPx) bits.push("lh" + Math.round(o.lineHeightPx)); if (o.fills?.length) bits.push(paintsToCss(o.fills));
    return `\n      ↳ «${n.characters.slice(s.a, s.b).replace(/\n/g, "⏎")}» ${bits.join(" ")}`; }).join(""); };
const desc = n => { const b = n.absoluteBoundingBox; if (!b) return `${n.type} ${n.id} «${n.name}» (sin caja)`;
  const f = paintsToCss(n.fills, b.width, b.height), s = paintsToCss(n.strokes), e = effectsToCss(n.effects), r = radiusOf(n);
  let t = ""; if (n.type === "TEXT") { const st = n.style;
    t = ` | ${st.fontWeight} ${st.fontSize}/${Math.round(st.lineHeightPx)} ls=${+st.letterSpacing.toFixed(2)} ${st.textCase ?? ""} ${st.textAlignHorizontal}/${st.textAlignVertical} caja=${Math.round(b.width)} «${String(n.characters).replace(/\n/g, "⏎").slice(0, 60)}»` + runs(n); }
  return `${n.type.slice(0,5).padEnd(5)} ${n.id.padEnd(12)} @${X(n)},${Y(n)} ${Math.round(b.width)}×${Math.round(b.height)}${r?` r=${JSON.stringify(r)}`:""}${f?` fill[${f}]`:""}${s?` stroke[${s} ${n.strokeWeight}${n.strokeAlign}]`:""}${e?` fx[${e}]`:""}${n.opacity<1?` op=${n.opacity}`:""}${n.visible===false?" OCULTO":""}${t}`; };
function tree(n, depth, ind = "") { console.log(ind + desc(n)); if (depth > 0) for (const c of n.children ?? []) tree(c, depth - 1, ind + "  "); }
const [mode, q, depth = "1"] = process.argv.slice(2);
const hits = mode === "text" ? all.filter(n => n.type === "TEXT" && new RegExp(q).test(n.characters))
          : mode === "band" ? (() => { const [a, b] = q.split("-").map(Number); return all.filter(n => n.absoluteBoundingBox && Y(n) >= a && Y(n) < b); })()
          : all.filter(n => new RegExp(q).test(n.name) || n.id === q);
for (const n of hits) { tree(n, +depth); const p = parentOf.get(n.id); if (p && p !== root) console.log("   ↑ " + desc(p)); }
EOF
node /tmp/calc.mjs name "1619:1877" 2                    # un nodo y dos niveles
node /tmp/calc.mjs text "^Tu negocio" 0                  # por contenido
node /tmp/calc.mjs band "3091-3918" 0                    # una banda entera
DIR=docs/figma/calculadora-datos node /tmp/calc.mjs name "1555:67649" 2   # el módulo con datos
```

---

## Fase 1 · Primitivas globales

### 1.1 `.eyebrow-dark` (D1)

`.eyebrow` **no se toca**: ya coincide exactamente con las pastillas de fondo oscuro del marco
(28 de alto, r50, `rgba(213,218,233,0.08)`, borde `#94b2fc` 0,3 px, texto 600 · 12/22 · 0,05 em
UPPER `#b8f21e`). Comprobado contra `1463:619` (130×28), `1463:608` (162×28) y `1427:197` (168×28).

Las **dos del módulo blanco** (`1543:5205` en el marco vacío, `1555:67668` en el de datos) son
distintas: **114×28, r50, relleno sólido `#050b21`, sin borde**, texto a peso **500**. Añadir en
`globals.css` junto a las otras variantes (`:422-441`):

```css
/* La misma pastilla sobre un módulo claro (la cuenta de /calculadora): caja
   sólida #050b21 sin borde, para que la lima se lea. Figma 1543:5205. */
.eyebrow-dark {
  background: var(--color-abyss);
  border-color: transparent;
  font-weight: 500;
}
```

Y **borrar** `before:content-none` de `:661`: el `::before` con `//` ya no existe.

### 1.2 Divisores de banda

`Vector 32` (y=827) y `Vector 31` (y=3918): **1920 × 0,5 px, `#6994ff`**, a todo el ancho. Hoy no
existen en el código. Se pintan como `<div aria-hidden className="h-[max(0.5px,0.5*var(--u))] w-full bg-[#6994ff]" />`
o reutilizando `--color-line` si el tono cuadra (`rgba(105,148,255,.5)` ≈ `#6994ff` al 50 %:
**no es lo mismo**, el del marco es opaco).

### 1.3 Utilidades que falten

Solo si alguna fase las necesita de verdad (`grep` antes; **nada de utilidades muertas**):

```css
@utility border-u-* { border-width: max(calc(--value(integer) * 0.6px), calc(--value(integer) * var(--u))); }
@utility scroll-mt-u-* { scroll-margin-top: max(calc(--value(integer) * 0.6px), calc(--value(integer) * var(--u))); }
```

### 1.4 Captura reproducible

Parametrizar la salida de `scripts/figma/shot-home.mjs` (o clonarlo a `shot-calc.mjs`) hacia
`docs/figma/calculadora/shots/` (sin versionar). Y lo que de verdad cierra cada fase: panel
Browser a **1920×1080** y `getBoundingClientRect()` sobre los nodos citados, **en los dos
estados** — el vacío y el de «Ver un ejemplo».

**Verificación Fase 1.** `.eyebrow-dark` con ≥1 uso; `grep -rc "before:content-none" src` = 0;
los dos divisores visibles a 1920; `git diff` de `globals.css` **solo** añade la variante (el
home y `/precios` sin cambios); `npm run lint` y `npx tsc --noEmit` limpios.

---

## Fase 2 · Hero (banda 02, y 120–827) — `CalculatorPage.tsx:305-326`

Fondo `Rectangle 121` 1920×827 `linear-gradient(180deg,#030617 0%,#040b24 100%)` desde el borde
superior del marco (cubre cabecera + hero). El código ya lo pinta así. **ok**

| Propiedad | Figma (nodo) | Código | Cambio |
|---|---|---|---|
| `pt` de la sección | H1 en **y=224** del marco | `pt-u-215` `:305` | **`pt-u-224`** si la barra es fija (medir: si ocupa flujo, el valor es 104) |
| H1 | `984:14342` 700 · 52/54 · `#ffffff` · caja **704** · centrado | `max-w-u-768 fs-u-52 lh-u-54 font-bold` `:308` | **`max-w-u-704`** |
| H1 → entradilla | caja del H1 104–195 → entradilla 238 = **43** | `mt-u-35` `:309` | **`mt-u-43`** |
| Entradilla | `984:14341` 400 · 20/28 · `#c7d7ff` · caja **704** · centrada | `max-w-u-1002` `:309` | **`max-w-u-704`** |
| Entradilla → fugas | 311 → 389 = **78** | `mt-u-103` `:312` | **`mt-u-78`** (medir: el Figma la da a 2 líneas) |
| **Cuadrado numerado** | `1003:15737/15731/15725` 52×52 `#1a4dff` — **es un vector en forma de anillo: se ve como cuadrado de CONTORNO**, no relleno (confirmado en el render). Cifra `#b8f21e` dentro | `size-u-52 rounded-u-10 bg-electric fs-u-28 font-semibold text-neon` `:316` | **quitar `bg-electric`** y poner borde: `border border-electric` (o `ring-1 ring-electric`). El radio (`rounded-u-10`) y el grosor salen del render, no del JSON (0.6.7): ajustar a ojo contra el fichero |
| Columnas de las fugas | iconos x **281 / 734 / 1179**; textos x **363 / 821 / 1260** (pasos 453/445 y 458/439, **no uniformes**) | `grid gap-10 md:grid-cols-3 md:gap-u-100` `:312` ⇒ 3 columnas iguales de 413 desde x=240 | **simplificación consciente**: la asimetría de 3 px es descuido del Figma. Ajustar `md:gap-u-100` para que la primera columna arranque en **281** (envolver la fila en `max-w-u-1358 mx-auto` o `pl-u-41`) y anotarlo |
| Icono → texto | 30 / 35 / 29 | `:316-320` | ok (media 31) |
| Titulares de fuga | `782:28434`, `990:15648`, `990:15643` · **600 · 25/30 `#1a4dff`** + cuerpo **400 · 20/30 `#ffffff`** · cajas 336/329/329 | `:319-320` | verificar. La primera está a **700** en el Figma y las otras a **600**: unificar a **600** |
| `Frame 158` (disco de 176) | maqueta del botón del chat | `ChatWidget` `:768` | **nada que hacer** |
| Divisor inferior | `Vector 32` y=827 · 1920 × 0,5 px `#6994ff` | no existe | añadir (Fase 1.2) |

**Verificación Fase 2.** A 1920: H1 caja **704** a 52/54; entradilla **704**; cuadrados de 52 **de
contorno** con la cifra lima; raya de 0,5 px al final de la banda.

---

## Fase 3 · Intro (banda 03, y 827–1336) — `CalculatorPage.tsx:329-335`

Sin fondo propio (se ve el `#030617` del marco). **ok**

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| `pt` | pastilla en **y=994** (167 bajo el divisor) | `pt-u-157` `:329` | **`pt-u-167`** |
| Pastilla | `1463:619` **130×28** · `.eyebrow` exacto | `.eyebrow` `:331` | **sin cambio** |
| Pastilla → H2 | 1022 → 1057 = **35** | `mt-u-65` `:332` | **`mt-u-35`** |
| H2 | `1062:305` 400 · **35/46** · `#ffffff` · caja **708** · centrado | `max-w-u-946 fs-u-35 lh-u-46 font-normal` `:332` | **`max-w-u-708`** |
| H2 → subtítulo | 1170 → 1195 = **25** | `mt-u-25` `:333` | **ok** |
| Subtítulo | `1068:308` 400 · 20/28 · `#c7d7ff` · caja **703** | `max-w-u-1007` `:333` | **`max-w-u-703`** |
| Subtítulo → rejilla | 1262 → 1336 = **74** | `mt-u-130` `:338` | **`mt-u-74`** |

---

## Fase 4 · Panel del formulario (banda 04 izquierda) — `:338-462`

### 4.1 Rejilla y panel

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Rejilla | izquierda **947** (x 241–1188) · derecha **459/462** (x 1218/1221–1680) · hueco **30–33** | `lg:grid-cols-[minmax(0,947fr)_minmax(0,462fr)] lg:gap-u-33` `:338` | **ok** |
| **Panel izquierdo** | `1619:1877` 947×1585, **radio 25**, `linear-gradient(180deg, #101837 0%, #050b21 61%)` **sin opacidad de nodo**, borde cónico `conic-gradient(#6994ff 15%, #1a4dff 50%, #6994ff 86%, #1a4dff 100%)`, clip | `--ring-w:0.5px` + `ring-conic rounded-u-35 bg-[linear-gradient(180deg,rgba(16,26,62,0.5),rgba(26,59,169,0.5))] p-4 pb-u-56 sm:p-u-46` `:341-343` | **tres cambios**: `rounded-u-35` → **`rounded-u-25`**; el relleno → **`bg-[linear-gradient(180deg,#101837_0%,#050b21_61%)]`** (el degradado azul translúcido ya no existe); y pasarle `--ring-bg` con las paradas **15/50/86/100 %** (el de `.ring-conic` por defecto es 26/50/74) |
| **Brillos del panel** | dos radiales recortados, `blur(7.3px)`: `1619:1878` 714×683 @821,−298 y `1619:1879` 1328×1193 @10,873, ambos `radial-gradient(… #1a4dff 0%, rgba(46,107,255,0) 100%)` | no existen | **añadir** dos `<div aria-hidden>` absolutos dentro del panel (que ya recorta), o usar `.glow-inset` con `--gx/--gy/--gr`. Son los que dan el volumen al panel |
| Padding del panel | tarjetas en x 287 (izq **46**), fin en 1144 (der **44**) | `sm:p-u-46` `:343` | ok |

### 4.2 Las tres tarjetas de paso

Base: **x 287, ancho 857, r25**, `linear-gradient(180deg, #101837 0%, #050b21 61%)`, clip.

| Tarjeta | Nodo | y (panel-rel) | alto | Borde |
|---|---|---|---|---|
| 1 · Tu negocio | `1308:6285` | 46 | **484** | `linear-gradient(360deg,#1a4dff,#102e99)` 1 px dentro |
| 2 · Lo que se escapa hoy | `1308:6284` | 560 | **398** | **`#1a4dff` plano** 1 px dentro |
| 3 · Con qué plan lo comparo | `1308:6282` | 988 | **425** | `linear-gradient(180deg,#1a4dff,#102e99)` 1 px dentro |

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Hueco entre tarjetas | **30** | `mt-u-30` `:387, 408` | **ok** |
| Borde | los tres distintos | `StepCard` da el mismo a las tres | pasar el borde por prop a la 2 (plano) y la 3 (`180deg`), o anotarlo como simplificación |
| `pt` de la tarjeta | icono en y = tarjeta + **53** | `pt-u-40` `:129` | **`pt-u-53`** |
| `px` de la tarjeta | icono en x = tarjeta + **33** | `px-u-28` `:129` | **`px-u-33`** |
| **Icono `+`** | **23×23**, sin relleno, trazo `#779eff` **2 px** | `size-u-33 text-[#779eff]` `:79` | **`size-u-23`** y `text-periwinkle` |
| Icono → título | icono acaba en 343, título en 363 | `gap-u-15` `:76` | **`gap-u-20`** |
| Título | tarjeta 1 **600 · 25/22**; tarjetas 2 y 3 **700 · 25/22**; `#1a4dff` | `fs-u-25 leading-none font-bold` `:80` | **`lh-u-22`**; peso a **700** (dos de tres) y anotar |

### 4.3 Tarjeta 1 «Tu negocio» (panel-rel 46–530)

| Elemento | Figma | Código | Cambio |
|---|---|---|---|
| «¿A qué te dedicas?» | `1308:6228` **600 · 16/30** `#ffffff`, caja **280**, y 142 (título + 40) | `StepHead` cuerpo `mt-u-22 max-w-u-523 fs-u-16 lh-u-23` `:82` | `mt-u-40 lh-u-30 max-w-u-280` en esta tarjeta |
| Pista | `1308:6243` **400 · 15/22** `#ffffff`, caja **522**, y 174 | — | verificar (hueco 32) |
| Pastillas de sector | 6 uds · **h37, r50, `#779eff`**, etiqueta **600 · 15/36 `#000000`** centrada (la de «Clinica dental» es `#030617`), inset vertical 13. Anchos **208/232/193 · 142/154/94**. Hueco **15**, entre filas **25**. Cada una lleva dentro un resplandor radial azul recortado (`blur(7.3px)`) | `h-u-37 rounded-full px-u-22 fs-u-15 font-semibold`, inactiva `bg-[#779eff] text-black` `:359` | tamaños y huecos **ok** (`gap-x-u-15 gap-y-u-25` ✓). Usar **`bg-periwinkle`**. **Falta el resplandor interior**: añadirlo o anotarlo como omisión (son 6 y es sutil) |
| Pastillas → campos | 323 → 363 = **40** | `mt-u-46` `:368` | **`mt-u-40`** |
| Rejilla de campos | x **330/732**, ancho 367–369, hueco **31** | `sm:gap-x-u-31` `:368` | **ok** |
| Etiqueta de campo | **600 · 16/30** `#ffffff` | `fs-u-16 lh-u-30 font-semibold` `:105` | **ok** |
| Etiqueta → caja | 363 → **402** | `mt-u-13` `:106` | **medir**: el hueco efectivo lo da la interlínea 30 de la etiqueta. Objetivo: caja en y = etiqueta + 39 |
| **Caja** | `Extended FAB` **367×62**, r16, `#ffffff`, `0 1px 4px rgba(12,12,13,.05), 0 1px 4px rgba(12,12,13,.1)` | `h-u-67 rounded-u-16 shadow-[…]` `:115` | **`h-u-62`** |
| Placeholder | **400 · 15/22**, `#030617` (tarjeta 1) / `#000000` (tarjeta 2), inset x+26, y+21 | `pl-u-26 fs-u-15 font-medium` + `placeholder:font-normal placeholder:text-void/60` `:115` | el valor escrito también a **400**; placeholder a `text-void` sin `/60` |
| Sufijo `/ Sem`, `/ Mes` | **500 · 15/16 `#000000`**, derecha, a **26** del borde | `right-u-25 fs-u-15 font-medium text-black` `:118` | **ok** |
| Pista | **300 · 15/22**, `rgba(199,215,255,0.8)` en la tarjeta 1 y **`#c7d7ff`** en la 2, a **13** de la caja | `mt-u-13 fs-u-15 lh-u-22 font-light text-cloud/80` `:120` | **ok** en la 1; la 2 a `text-cloud` |

### 4.4 Tarjeta 2 «Lo que se escapa hoy» (560–958)

Cuerpo `1308:5951` **400 · 16/23**, caja **491**, y 654. Etiquetas `1308:5949` («Consultas
perdidas», 600 · 16/**25**, y 758) y `1308:5950` («Citas perdidas», 600 · 16/**30**, y 755) —
incoherencia del diseño: unificar a **30**. Cajas en y **796** (367×62), placeholders `#000000`,
sufijos y pistas como la tarjeta 1 pero con `#c7d7ff` opaco. Cuerpo → etiquetas: **medir**
(`mt-u-38` hoy en `:389`).

### 4.5 Tarjeta 3 «Con qué plan lo comparo» (988–1413)

| Elemento | Figma | Código | Cambio |
|---|---|---|---|
| Cuerpo | `1308:6273` 400 · **16/22**, caja **523** | `:82` | `lh-u-22` en esta tarjeta |
| Cuerpo → tarjetas | ~1125 → 1165 = **40** | `mt-u-40` `:411` | **ok** |
| Tarjetas de plan | **246×205/206, r15**, x **330 / 591 / 851** (huecos 15 y 14) | `min-h-u-205 rounded-u-15`, `gap-u-15 sm:grid-cols-3` `:411, 422` | **ok**. Ojo: `Rectangle 138` y `Rectangle 181` son la **misma** tarjeta duplicada (0.6.4) |
| Seleccionada | Arranque `linear-gradient(0deg,#0f1f60,#103acf)` | ídem `:422` | **ok** |
| No seleccionadas | `linear-gradient(180deg,#ffffff,#c7d7ff)` | ídem | **ok** |
| Padding | contenido en x = tarjeta + **22**, título en y = tarjeta + **21** | `px-u-22 pt-u-21` `:422` | **ok** |
| Título | **600 · 22/30**, caja 201 · `#ffffff` (activa) / `#000000` | `:428` | verificar |
| Subtítulo | **500 · 14/16**, caja 205 · `#c7d7ff` (activa) / `#030617` | `:429` | verificar |
| Precio | tirada **600 · 18/21** · `#b8f21e` (Arranque) / `#1a4dff` (Core y Nexus), y **1286** (subtítulo + 69) | `:430` | verificar los dos colores y el **18/21** |
| Puesta en marcha | tirada **400 · 16/21**, caja 224 · `#ffffff` / `#000000` | `:434` | verificar |

### 4.6 Fila de botones (panel-rel 1463)

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Posición y tamaño | ambos **246×66** en y 1463 (tarjeta 3 acaba en 1413 ⇒ **50**), hueco **32**, centrados en el panel | `mt-u-50`, `h-u-66 min-w-u-246`, `gap-u-32 justify-center` `:444-455` | **ok** |
| «Ver un ejemplo» | `Rectangle 160` r**47** `#c7d7ff`, etiqueta **600 · 15/36 `#000000`** | `.btn-light-sm rounded-full fs-u-15 font-semibold text-black` `:448` | **ok** |
| «Empezar de cero» | `1308:5876` r50 `linear-gradient(180deg,#101837,#050b21 61%)`, borde **`#1a4dff` 0,3 px**, resplandor `linear-gradient(90deg,…)` **`blur(22.3px)`** por la izquierda, icono refresh **20×16** trazo blanco 2 px | `.btn-outline` + `RefreshCcw size-u-18` `:455` | **ok** (`.btn-outline` ya trae degradado, borde y resplandor). Icono → **`size-u-20`** |

**Verificación Fase 4.** A 1920 con «Ver un ejemplo» pulsado: panel **947×1585 con radio 25** y
los dos brillos; tarjetas 857 con hueco 30 y el `+` de **23**; pastillas de 37 en `#779eff`;
cajas **367×62**; planes 246×205 con Arranque en azul y el precio en lima; botones 246×66.
`grep -c "text-\[#779eff\]" src/components/calculator/CalculatorPage.tsx` = **0**.

---

## Fase 5 · La cuenta (banda 04 derecha) — `:465-566`

`LightModule` = r35 + `linear-gradient(180deg,#ffffff,#c7d7ff)` ✓ correcto para los dos.

### 5.1 Módulo vacío · `1068:309` (x 1221, **459×362**) — `:467-481`

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Padding | izq **42–44**, sup **46**, inf **40** | `px-u-42 pb-u-40 pt-u-40` `:468` | **`pt-u-46`** |
| Pastilla | `1543:5205` **114×28**, r50, **`#050b21` sólido sin borde**, texto **500** | `.eyebrow` `:470` | **`eyebrow eyebrow-dark`** (Fase 1.1) |
| Pastilla → H3 | 74 → 100 = **26** | `mt-u-31` `:471` | **`mt-u-26`** |
| H3 | `1068:317` **700 · 25/22** `#000000`, caja 349 | `fs-u-25 lh-u-30 font-bold` `:471` | **`lh-u-22`** |
| H3 → cuerpo | 122 → 137 = **15** | `:472` | verificar |
| Cuerpo | `1068:316` **400 · 16/22** `#000000`, caja 371 | `:472` | verificar |
| Cuerpo → CTA | 232 → 256 = **24** | `mt-u-32` `:476` | **`mt-u-24`** (medir; el cuerpo son 4 líneas) |
| CTA | `1068:313` **298×66** r50 `#1a4dff` borde **`#94b2fc` 1 px**, centrado; etiqueta **600 · 15/36 `#ffffff`** | `mx-auto h-u-66 w-u-298 rounded-full border border-pulse bg-electric fs-u-15 font-semibold` `:476` | **ok** |

### 5.2 Módulo con datos · `1555:67649` (x 1218, **462×1177**) — `:483-564`

Posiciones **relativas al módulo**. Padding: izq **39**, sup **46**, inf **53**.
Código `px-u-39 pb-u-53 pt-u-49` `:484` → **`pt-u-46`**.

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Pastilla | `1555:67668` @44,46 **114×28** `#050b21` sólido, texto 500 | `.eyebrow` `:486` | **`eyebrow eyebrow-dark`** |
| **Titular** | **dos nodos, no una línea**: «Se paga solo en» @39,131 **600 · 20/40** izquierda, caja 168; «3.9 Meses» @265,115 caja 157 **alineado a la derecha**, con tiradas «3.9» **700 · 45 · lh40** y « Meses » **700 · 25 · lh40**. El bloque ocupa los 383 de ancho útil | `<p>` con tres `<span>` en línea y `ml-u-16`/`ml-u-8` `:497-501` | **pasar a `flex items-baseline justify-between`**: izquierda `fs-u-20 font-semibold`, derecha `fs-u-45 font-bold` + `ml-u-8 fs-u-25 font-bold`. Los tamaños **ya son correctos** |
| **Raya bajo el titular** | **no existe** | `mt-u-15 h-px bg-[#354d8e]/60` `:502` | **eliminar** |
| Cuerpo | `1555:67658` @39,174 **400 · 16/19**, caja 383 | `mt-u-12 fs-u-16 lh-u-19` `:503` | **ok** (tras quitar la raya, el hueco titular→cuerpo es ~3; medir) |
| Cuerpo → barra | 217 → 270 = **53** | `mt-u-70` `:506` | **`mt-u-53`** |
| Barra | pista `1555:67651` **383×11 r15** `rgba(199,215,255,.5)`; relleno `1555:67652` `linear-gradient(90deg, #779eff 0%, #1a4dff 100%)` | `h-u-11 rounded-u-15 bg-cloud/50` + `bg-[linear-gradient(90deg,#779eff_37%,#1a4dff_100%)]` `:507-508` | **paradas a `0%`/`100%`** (hoy 37 %) |
| Cifras bajo la barra | **400 · 15/19**, valor en tirada **700 `#1a4dff`**, a **11** de la barra | `mt-u-11 fs-u-15 lh-u-19` `:510` | **ok** |
| Panel de desglose | `1555:67650` @39,368 **383×441 r15** `rgba(199,215,255,.5)`; etiquetas inset **32**, **42** desde arriba; valores alineados a la derecha con inset **29** | `mt-u-30 … rounded-u-15 bg-cloud/50 px-u-32 py-u-30` `:525` | **`mt-u-33`** y **`py-u-42`** (medir el reparto de las 6 filas) |
| Filas | etiquetas **400 · 15/18** con el título en **600**; valores **700 · 16/18** a la derecha | `dt fs-u-15 lh-u-18` + `dd fs-u-16 font-bold` `:528-536` | **ok** |
| Panel de retorno | `1555:67653` @39,831 **383×105 r15 `rgba(154,165,192,0.8)`**, a **22** del desglose; etiqueta **400 · 14/18** con «Retorno a 12 meses» en **600**, inset 32/23; valor **700 · 20/18 `#1a4dff`** a la derecha | `mt-u-18 … px-u-32 py-u-23` `:546` | **`mt-u-22`**; el resto **ok** |
| Aviso de hipótesis | **no existe en el Figma** (D9) | `mt-u-30 fs-u-14 lh-u-19` `:555` | se conserva; el hueco del Figma entre el retorno (936) y el CTA (1058) es **122** y se reparte con él |
| **CTA** | `1555:67661` @89,1058 **282×66** r50 `#1a4dff` **sin borde**, con resplandor radial `blur(7.3px)`; etiqueta **600 · 15/36 `#ffffff`**; **icono de envío** 19×19 trazo **blanco 2 px** a su derecha | `mx-auto mt-u-36 h-u-66 w-u-250 rounded-full bg-electric` **sin icono** `:557-559` | **`w-u-282`** y **añadir el icono** (`Navigation`/`Send` de lucide, `size-u-19 strokeWidth={2}`) |
| Color del negativo | el Figma no tiene estado negativo | `text-[#d0325f]` `:535` | se conserva (estado); anotar |

**Verificación Fase 5.** Con datos, a 1920: módulo **462×1177**; pastilla oscura legible;
«3.9» a 45 y «Meses» a 25 **alineados a la derecha**, sin raya; barra 383×11 con el degradado
de 0 a 100 %; desglose 383×441; retorno 383×105; CTA **282×66 con icono**.

---

## Fase 6 · «Cómo se recupera» (banda 05, y 3091–3918) — `:570-619`

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Fondo | `Rectangle 162` **1920×827** = exactamente la banda | `bg-[…] pb-u-100 pt-u-71` `:570` | **ok** (ya no sobra) |
| `mt` / `pt` | panel acaba en 2921 → pastilla en **3079** = 158; banda en 3091 | `mt-u-87 pt-u-71` `:570` | recalcular para que la pastilla caiga en **3079** |
| Pastilla | `1463:608` **162×28** `.eyebrow` exacto | `.eyebrow` `:573` | **sin cambio** |
| Pastilla → H2 | 3107 → 3142 = **35** | `mt-u-50` `:574` | **`mt-u-35`** |
| **H2** | `1334:6740` **400 · 30/38** `#ffffff`, caja **696**, centrado | `mt-u-50 max-w-u-946 fs-u-35 lh-u-46 font-normal` `:574` | **`fs-u-30 lh-u-38 max-w-u-696`** |
| H2 → tarjetas | 3277 → 3392 = **115** | `mt-u-150` `:576` | **`mt-u-115`** (medir: el H2 son 4 líneas) |
| **Tarjetas** | **369×243, r20, opacidad 0,5**, relleno **`rgba(26,77,255,0.1)` las TRES**, borde cónico `conic-gradient(#6994ff 26%, #1a4dff 50%, #6994ff 74%)` **2 px**, sombra **`0 0 45px 4px rgba(26,77,255,0.5)`**, clip; x **362 / 778 / 1189** (huecos **47** y **42**), total **1196** | `ring-conic rounded-u-20 … max-w-u-1196 md:gap-u-43`; primera `bg-electric/10`, resto `bg-[linear-gradient(237deg,…)]` `:576, 584` | **cuatro cambios**: las tres a **`bg-electric/10`** (el degradado navy ya no existe); añadir **`opacity-50`**; `--ring-w: 2px`; añadir la **sombra azul** `shadow-[0_0_45px_4px_rgba(26,77,255,0.5)]` |
| Brillo interior | `1555:66418/66427/66430` 291×257 radial, **`blur(17.5px)`** | no existe | **añadir** (la tarjeta ya recorta) |
| **Alineación** | **izquierda**: icono, título, texto y cifra en `x = tarjeta + 32` | `items-center text-center` `:584` | **quitar `items-center` y `text-center`** (`:584`) y el `justify-center` de la cifra (`:599`). D8 |
| **Icono** | `1349:6886/6881/6891` **52×52 r18 fill `#081248`** con **sombra `0 0 10px 0 #1a4dff`**; el glifo es un icono de trazo **`#1a4dff` 2 px** (21–27 px) | `size-u-52 rounded-u-18 bg-electric` + `Icon size-u-29` `:592` | **`bg-[#081248]`** + `shadow-[0_0_10px_#1a4dff]`; el icono a **`text-electric`** con `strokeWidth={2}` |
| Icono → título | 378 → 393 = **15** | `mt-u-15` `:595` | **ok** |
| Título | **600 · 24/30** `#ffffff`, caja 245 | `fs-u-24 lh-u-30 font-semibold` `:595` | **ok** |
| Título → subtítulo | 423 → 432 = **9** | `mt-u-9` `:597` | **ok** |
| Subtítulo | **400 · 15/22**; `#c7d7ff` en la 1 y la 3, **`#ffffff`** en la 2 | `text-cloud` `:597` | unificar a `text-cloud` y anotar |
| **Raya dentro de la tarjeta** | **no existe** | `mt-u-21 h-px w-full bg-[#354d8e]` `:598` | **eliminar** |
| Subtítulo → cifra | 454 → 489 = **35** | `mt-u-19` `:599` | **`mt-u-35`** (tras quitar la raya) |
| Cifra | raíz **400 · 15/21** `#b8f21e`; tirada grande **600 · 28**; cola 15 (`#ffffff` / `#c7d7ff` / `#ffffff`) | `fs-u-28 font-semibold text-neon` + `fs-u-15 text-white` `:599-601` | **ok** |
| Raya que une las tarjetas | `1338:6781` y `1390:115`: **35 × 2 px `#354d8e`** en x 731/1147, y **432** (tarjeta + 131) | `right-[…43…] top-u-132 h-px w-u-43 bg-[#354d8e]` `:590` | **`w-u-35`**, grosor **2 px**, y el desplazamiento a **`-w-u-47`/`-w-u-42`** según el hueco real |
| Enlace de cierre | `1329:6717` **500 · 14/24**, caja **704**, centrado, a **148** de las tarjetas; `#ecefff` + «→» en `#1cfcb9` | `mt-u-119 fs-u-18 lh-u-24 font-medium text-frost` `:607-612` | **`mt-u-148 fs-u-14`** (`.link-mint` ya es 14/24) |
| Fórmula de hipótesis | no existe en el Figma | `:613-615` | se conserva (las preguntas la citan); anotar |
| Divisor inferior | `Vector 31` y=3918 · 1920 × 0,5 px `#6994ff` | no existe | añadir (Fase 1.2) |

---

## Fase 7 · Preguntas y respuestas (banda 06, y 3918–4874) — `:622-645`

Sin fondo. **ok**

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Pastilla | `1427:197` **168×28** `.eyebrow` exacto, en **y=4084** (166 bajo el divisor) | `.eyebrow`, `pt-u-100` `:622, 624` | pastilla **sin cambio**; `pt` para que caiga en 4084 |
| **H2** | `1019:179` **700 · 52/52** `#ffffff`, caja **696**, centrado, a **34** de la pastilla | `mt-u-74 max-w-u-704 fs-u-48 lh-u-52 font-bold` `:625` | **`mt-u-34 max-w-u-696 fs-u-52`** |
| H2 → primera fila | 4198 → 4242 = **44** | `mt-u-65` `:627` | **`mt-u-44`** |
| **Filas** | `Plan Centro` **667×62, r15**, `rgba(6,11,40,0.72)`, borde **`rgba(119,158,255,0.2)` 0,5 px**, clip; x **626**, paso **72** ⇒ hueco **10** | `max-w-u-703 gap-u-14 rounded-u-20 border-[0.5px] border-cloud/25 bg-cloud/5 px-u-31 py-u-18 open:bg-cloud/10` `:627, 631` | **`max-w-u-667 gap-u-10 rounded-u-15`**, `bg-[rgba(6,11,40,0.72)]`, `border-[rgba(119,158,255,0.2)]`, **`px-u-25`**, **`min-h-u-62`** con `py-u-19` |
| Pregunta | **600 · 15/23** `#ffffff`, caja **537**, inset izq **25**, centrada en vertical | `:633` | **`fs-u-15 font-semibold`** (hoy 16 y 500) |
| **«+»** | **icono** `Plus` **12×12**, trazo `#1a4dff` **2 px**, a **26** del borde derecho | `fs-u-36 text-electric` (glifo de texto) `:635` | cambiar a `<Plus className="size-u-12 text-electric" strokeWidth={2} />`; el `group-open/faq:rotate-45` se conserva |
| Fila abierta | `Calculadora2` `Frame 298` **667×175** (D4) | `<details>` | se conserva |
| Duplicado | las filas 2 y 3 tienen **el mismo texto** (0.6.4) | — | preguntar a la diseñadora; no tocar copy |

---

## Fase 8 · Captura (banda 07, y 4874–5667) — `:648-737`

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| `mt` | última fila del FAQ acaba en 4664 → tarjeta **4874** = **210** | `mt-u-216` `:648` | **`mt-u-210`** |
| Tarjeta | `1353:78` **1196×568 r35** `linear-gradient(180deg,#09112d,#0e1f5c)`, cónico **1,3 px** paradas 26/50/72 | `--ring-w:1.3px` + `max-w-u-1196 rounded-u-35 bg-[…]` `:650-652` | **ok** (el cónico por defecto, 26/50/74, está a 2 puntos: no tocar) |
| Reparto | izquierda **582** (361→943) · derecha **614** (943→1557) | `md:grid-cols-[minmax(0,582fr)_minmax(0,614fr)]` `:652` | **ok** |
| Mitad derecha | `1353:86` r **`0 35 35 0`**, `linear-gradient(180deg,#1a4dff,#0a1540)`, borde `rgba(148,178,252,0.5)` 1,3 px | `border-t border-pulse/50 bg-[…] md:border-l md:border-t-0` `:681` | **ok** |

### Panel izquierdo (contenido en x 411 = tarjeta + **50**)

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Padding | izq **50**, der 47, sup **51**, inf 37 | `md:pl-u-50 md:pr-u-47 pt-u-51 pb-u-40` `:654` | **ok** |
| H2 | `1353:81` **600 · 35/40** `#ffffff`, caja **462** | `max-w-u-462 fs-u-35 lh-u-40 font-semibold` `:655` | **ok** |
| Cuerpo | `1353:79` **400 · 16/22**, caja **485**, y 156 | `:656` | verificar el hueco |
| **Pastillas de etiqueta** | y **226**, **h35, r50**, **rellenas** `linear-gradient(211deg, #b8f21e 0%, #1a4dff 59%)` (y 206deg, 205deg), anchos **163 / 131 / 122**, hueco **34**, texto **700 · 12/22 `#ffffff`** (la 1.ª con tracking 0, las otras 0,1 em), con resplandor radial recortado `blur(7.3px)`. Entre ellas, `Arrow right` **20×20** trazo `#1a4dff` **1 px** | `eyebrow eyebrow-gradient before:content-none` + `ArrowRight size-u-19` `:658-665` | **rehacer**: nada de `.eyebrow`. Pastilla propia `h-u-35 rounded-full bg-[linear-gradient(211deg,#b8f21e_0%,#1a4dff_59%)] fs-u-12 lh-u-22 font-bold text-white` (+ `tracking-[0.1em]` en las dos últimas); flecha a **`size-u-20`** con `strokeWidth={1}` |
| **Caja de nota** | `Rectangle 165` @411,**304** **485×166 r16**, `linear-gradient(180deg, #ffffff 0%, #c7d7ff 100%)`; inset 20/25; título **700 · 18/24** `#000000`; cuerpo **400 · 15/19**, caja 445 | `mt-u-33 max-w-u-485 rounded-u-16 bg-[linear-gradient(180deg,#c7d7ff_0%,#778199_100%)] px-u-20 pb-u-22 pt-u-20` `:668` | **el degradado cambia a `#ffffff → #c7d7ff`** (es el mismo de `LightModule`); **`mt-u-43`**; `pt-u-25` |
| Enlace | `1358:1656` **500 · 14/24** `#1cfcb9`, caja 368, y **505** | `fs-u-15 font-medium text-mint` `:674` | **`fs-u-14 lh-u-24`** (o `.link-mint`, que ya es eso) |

### Panel derecho (contenido en x 1026 = mitad + **83**)

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Padding | izq **83**, sup **86** | `md:px-u-85 pt-u-78` `:681` | **`pt-u-86`**, `md:px-u-83` |
| Etiquetas | **600 · 18/25** `#ffffff` | `fs-u-18 lh-u-25 font-semibold`, `gap-u-10` `:689, 693` | hueco etiqueta→caja **7** (medir) |
| **Cajas** | `Extended FAB` **439×62 r15** `#ffffff`, misma sombra doble; placeholder **300 · 16/16 `#000000`**, inset x+**23**, y+21 | `inputCls`: `h-u-67 rounded-u-15 pl-u-23 pr-u-16 fs-u-16 font-light` `:291-292` | **`h-u-62`** |
| Entre campos | caja 1 acaba en 180 → etiqueta 2 en **210** = **30** | `mt-u-22` `:693` | **`mt-u-30`** |
| Botón | `Rectangle 145` **271×66 r47 `#c7d7ff`**, sin sombra; etiqueta **600 · 15/16 `#030617`**; icono **`Navigation`** (avión de papel) **19×19** trazo `#1a4dff` **2 px**; a **54** de la caja 2 | `.btn-light mt-u-54 h-u-66 min-w-u-271 …` + `ArrowRight size-u-19 strokeWidth={3}` `:716-723` | **ok** el botón. Icono: **`Navigation`** en vez de `ArrowRight`, `strokeWidth={2}` |
| Letra pequeña | **500 · 12/22 `#c7d7ff`**, centrada, caja 409, a **44** del botón | `mt-u-44 fs-u-12 lh-u-22 font-medium text-cloud` `:724` | **ok** |
| Cierre del panel | letra pequeña acaba en 492 → tarjeta 568 = **76** | `pb-u-40` `:681` | **`pb-u-76`** |
| Enlace «ver tarifa» | no existe en el Figma | `mt-10 … fs-u-15 text-mint` `:731-736` | se conserva; `mt-10` → `mt-u-40` |

---

## Fase 9 · Móvil y barra fija — `:742-760`

No hay marco de móvil (D5). Objetivo: que nada se desborde y que este bloque hable el mismo idioma.

| Propiedad | Hoy | Cambio |
|---|---|---|
| Envoltorio | `sticky bottom-0 z-40 mt-16 border-t border-line bg-abyss/90 px-6 py-3 backdrop-blur-xl lg:hidden` | `mt-u-64`; el resto se queda (`px-6 py-3` es padding de móvil) |
| Hueco del botón del chat | `pr-[6rem]` `:744` | **se queda** (evita que el botón flotante tape la cifra) |
| Etiqueta | `text-[10px] uppercase tracking-[0.16em] text-mist/70` `:745` | `fs-u-10` (el suelo lo deja en 12) |
| Cifra | `font-display text-lg font-bold`, `text-[#ff9bb5]` / `text-neon` `:747` | `fs-u-25`; `#ff9bb5` no está en el marco: se queda y se anota |
| Payback | `text-[11px] text-mist/70` `:753` | `fs-u-11` |

Repaso a **375** y **768**: ningún `max-w-u-*`/`min-w-u-*` desborda; `lh-u-16/18/19` no recortan
(0.6.8); pastillas de sector y tarjetas de plan siguen apiladas y legibles.

---

## Fase 10 · Verificación final

1. `npm run lint && npx tsc --noEmit && npm run build` limpios.
2. **Animaciones y funciones intactas** (prueba mecánica):
   ```bash
   git diff main -- src/components/calculator | grep -E "^[-+]" | grep -vE "^(\+\+\+|---)" \
     | grep -E "motion\.|useState|useMemo|useEffect|useRef|calculate\(|trackEvent|getSessionId|fetch\(|onClick|onChange|onSubmit|href=|aria-|disabled|style=\{\{"
   ```
   Debe devolver **solo** líneas donde lo único que cambia es un `className`.
3. **Copy intacto:** `git diff main -- src/i18n` **vacío**.
4. **Medición a 1920×1080** con `getBoundingClientRect`, en los **dos estados**, y volcado a
   `docs/figma/calculadora/audit.md` (+ `calculadora-datos/audit.md`), con una tabla
   «Medido a 1920×1080» como la de `docs/figma/home-1532/audit.md:36-70`. Mínimos:
   - Hero: H1 **704** · 52/54; entradilla **704**; cuadrados de 52 **de contorno**.
   - Intro: H2 **708** · 35/46; subtítulo **703**; pastilla **130×28**.
   - Formulario: panel **947×1585 r25**; tarjetas **857** con hueco 30; `+` de **23**;
     pastillas **37**; cajas **367×62**; planes **246×205**; botones **246×66**.
   - Cuenta: módulos **459×362** y **462×1177**; «3.9» 45 / «Meses» 25 **a la derecha**;
     barra **383×11**; desglose **383×441**; retorno **383×105**; CTA **282×66**.
   - Resuelve: tarjetas **369×243** al **50 %** con borde de 2 y sombra azul; iconos `#081248`;
     H2 **30/38**; sin raya interior.
   - FAQ: filas **667×62**, hueco **10**, r15; H2 **52/52**; «+» de **12**.
   - Captura: tarjeta **1196×568**; pastillas **rellenas** de lima→azul; nota `#ffffff→#c7d7ff`;
     cajas **439×62**; botón **271×66**.
   - Divisores de 0,5 px en y **827** y **3918**.
5. **Móvil:** 375 y 768 sin desbordes.
6. **Consola:** 0 errores, 0 avisos de hidratación.
7. Anotar en `audit.md` las decisiones **D1–D9**, los duplicados del Figma (0.6.4) y las
   simplificaciones conscientes (rejilla del hero, bordes distintos de las tarjetas de paso,
   resplandor de las pastillas de sector).
8. Commit en `figma/calculadora-984`, mensaje en español al estilo del repo, PR contra
   `figma/home-1532` (**no** contra `main` mientras el PR #21 siga abierto).

**Anti-patrones:**

- **Nada de «ajustes de ojo»**: todo cambio cita un nodo (`1308:6285`) o una línea de `spec.md`.
- **No cambiar lo que ya coincide**: el `.eyebrow`, la tarjeta de captura, los planes de
  246×205 y buena parte de la banda 07 ya están bien.
- **No inventar utilidades `*-u-*`**; lo que falte se añade en la Fase 1 con al menos un uso.
- **No implementar nodos ocultos ni duplicados** (0.6.3, 0.6.4).
- **No tocar `FinalCTA.tsx`, `Footer.tsx` ni `Navbar.tsx`** (D2, D3) ni `src/i18n/calculadora.ts` (D9).
- **No convertir `Reveal` en un `div`** ni tocar sus `viewport`/`transition`.
- **Si la medición en pantalla contradice un número de este plan, manda la medición**: los
  huecos están restados de cajas absolutas, no autorizados por la diseñadora (0.6.2).
