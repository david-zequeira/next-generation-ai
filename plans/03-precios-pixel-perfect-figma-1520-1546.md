# Plan · /precios pixel-perfect contra el Figma `1520:1546`

**Objetivo.** Que `/precios` reproduzca al píxel el marco `1520:1546` del fichero
`IxRzkKKPa5XStlUI6UnpBv` («Asenix Web»): colores, degradados, bordes, radios,
sombras, formas y espaciados. **No se toca copy ni animación ni funcionalidad**
(framer-motion, Lenis, handlers, `href`s, `trackEvent`, `pricingDicts`).

**Fuente de verdad.** [`docs/figma/precios-1520/audit.md`](../docs/figma/precios-1520/audit.md)
y las lonchas de `docs/figma/precios-1520/proto/p-00…p-09.png`. Todo valor de
esa auditoría está **medido** sobre el render a 1920 (muestreo de píxel para el
color, detección de saltos de color para la geometría), no estimado. El marco
mide 1920 de ancho y ≈ 8.200 de alto.

**Escala.** Toda medida del Figma se escribe como `N*var(--u)` con las
utilidades `*-u-N` de `src/app/globals.css:128-231` (exacta a 1920,
proporcional por debajo, con suelo para móvil). No inventar otra escala.

**Cómo se ejecuta.** Cada fase es autónoma: abre un chat nuevo, lee «Fase 0» y
la fase que toque, y cumple su checklist antes de pasar a la siguiente. Las
fases 2–9 son independientes entre sí; todas dependen de la Fase 1.

---

## Aviso: el marco es otro

La página está construida contra `690:14` («Asenix Planes»), documentado en
[`docs/figma/precios/audit.md`](../docs/figma/precios/audit.md). `1520:1546` es
un rediseño posterior. **Los valores de aquel documento están desfasados**: sirve
como referencia de método, no de números. Donde los dos discrepen, manda
`precios-1520`.

---

## Decisiones que NO toma este plan

El ejecutor no las decide. Si no están resueltas, se pregunta al dueño y se deja
la fase bloqueada en ese punto — el resto de la fase sí se aplica.

| # | Tema | Figma `1520:1546` | Código hoy | Acción por defecto |
|---|---|---|---|---|
| D1 | Botón y línea gris de la cabecera | No existen: de la pastilla al párrafo y directo a las tarjetas | Píldora 337×70 «Empezar con el diagnóstico gratis» + lede gris de 15 px | **Se conservan.** Quitarlos es decisión de negocio, no de estilo |
| D2 | Segundo botón del CTA final | Un solo botón | Botón blanco + botón fantasma a `/calculadora` | **Se conserva el segundo.** Solo se restila el primero |
| D3 | Color de icono por módulo | La 1.ª tarjeta en azul vivo, las otras siete en navy | Todas en azul vivo | Se aplica lo medido, **marcándolo para confirmar** con la diseñadora |
| D4 | Copy que difiere («Proyectos» vs «Pruebas», «Iniciar sesion», «Comenzar diagnostico» vs «Contactar», las cifras de Formas de pago) | — | Diccionarios | **No se toca copy.** Solo estilo |
| D5 | Ilustración de Formas de pago | No hay hueco para ella en el marco nuevo | No se monta (pendiente heredado de `690:14`) | Se cierra el pendiente: ya no aplica |

**Sí se aplica sin preguntar** el cambio del check lima de la comparativa (§ 05
de la auditoría): es un error de columna, no una decisión.

---

## Fase 0 · Descubrimiento (HECHO; leer, no repetir)

### 0.1 Fuentes consultadas

| Qué | Dónde | Estado |
|---|---|---|
| Render 1:1 del marco `1520:1546` | `docs/figma/precios-1520/proto/p-00…p-09.png` | hecho, vía prototipo público |
| Auditoría medida Figma vs código | `docs/figma/precios-1520/audit.md` | hecho |
| Script de captura del prototipo | `scripts/figma/proto-shot.mjs` | operativo |
| Árbol del nodo (`raw.json`) | **no disponible** | REST en `429` con `retry-after: 289768` (≈ 3,4 días); MCP de Figma con la cuota Starter agotada |
| Extracción del marco anterior `690:14` | `docs/figma/precios/{spec.md,tokens.md,audit.md}` | referencia de método; **valores desfasados** |

### 0.2 Por qué no hay `raw.json` y cómo se suple

Sin REST ni MCP no se puede leer el árbol de capas, así que **no hay nombres de
nodo que citar**. Se cita por loncha y coordenada: «`p-04.png`, icono de la 1.ª
tarjeta, columna x=652». Las medidas se rehacen con estos tres ayudantes
(reproducibles, sin red):

```bash
# 1. Regenerar las lonchas del Figma (idempotente, ~1 min)
node scripts/figma/proto-shot.mjs "https://www.figma.com/proto/IxRzkKKPa5XStlUI6UnpBv/Asenix-Web?node-id=1520-1546&t=zbjTqq6zvjsfetI0-0&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1" --slices 9
```

El scroll del prototipo es **determinista**: dos ejecuciones dan las mismas
coordenadas al píxel, así que las referencias `p-NN.png @x,y` de la auditoría
siguen valiendo.

```python
# 2. px.py — color exacto de un punto, una fila o una columna
#    python3 px.py img.png 918,176 "col:375,690,1075,15" "row:800,260,1700,20"
# 3. edges.py — saltos de color a lo largo de una fila/columna (bordes, anchos, huecos)
#    python3 edges.py img.png row 800 200 1750 6
# 4. lines.py — líneas de texto de un bloque: alto de glifo, interlínea y ancho
#    python3 lines.py img.png 300,150,1620,500 150
```

Los tres caben en 15 líneas de Pillow; el ejecutor los reescribe en `/tmp` si no
están. `bbox` de un glifo + regla de tres contra un tamaño conocido del código
es la forma fiable de deducir un cuerpo de letra: **nunca a ojo**.

### 0.3 API permitida (lo único que se usa)

- **Escala:** `--u` y las utilidades `h-u-* min-h-u-* w-u-* max-w-u-* size-u-* p-u-* px-u-* py-u-* pt-u-* pb-u-* pl-u-* pr-u-* mt-u-* mx-u-* top-u-* right-u-* left-u-* min-w-u-* gap-u-* rounded-u-* fs-u-* lh-u-*` (`globals.css:128-231`). Para un valor sin utilidad, `[max(Mpx,N*var(--u))]` inline.
- **Tokens de color** (`globals.css:15-30`) que hacen falta aquí: `abyss #050b21 · space #101a3e · electric #1a4dff · neon #b8f21e · pulse #94b2fc · cloud #c7d7ff · periwinkle #779eff · ink #0b1226 · mint #1cfcb9`.
- **Colores del marco sin token** (se escriben inline): `#e7ebf6` (fondo de Módulos y del panel de Pago) · `#91b1ff` (borde del FAQ) · `#fbfcff` (fondo del FAQ) · `#dde7ff`/`#c7d7ff` (borde de las tarjetas de módulo) · `#091a75`→`#08134d` (icono navy).
- **Primitivas** (`globals.css:407-450`): `.eyebrow` y sus variantes `-gradient/-light/-white/-dark`, `.ring-conic` (`--ring-w`, `--ring-bg`).
- **Componentes locales de la página:** `Rich`, `Reveal`, `SectionHead`, `PlanStar`, `CellValue`, `ADDON_ICONS`, `PAY_ORDER` (`src/components/pricing/PricingPage.tsx:31-116`).

### 0.4 Bloques que NO se tocan

En `PricingPage.tsx`: el componente `Reveal` (`:49-61`) y todos sus `motion.div`,
los `onClick={() => trackEvent(...)}`, los `href`, `useLocale`, `pricingDicts`,
`ChatWidget`, `VoiceWidget`, `FinalCTA`, `Footer`.

Regla práctica: solo cambian **strings de `className`, valores CSS literales y el
orden/estructura de nodos estáticos**. Si un cambio exige tocar un `useEffect`,
un `motion.*` o un handler, se para y se anota como bloqueado.

**`src/i18n/pricing.ts` no se modifica en ninguna fase.** La Fase 7 rehace la
maquetación de Formas de pago y encaja con el diccionario tal cual está:
`item.title` es la cifra grande, `item.k` la etiqueta, `item.body` el párrafo y
`item.foot` el pie. `PAY_ORDER = [2, 0, 1, 3]` ya da el orden del Figma.

---

## Fase 1 · Primitivas globales

Es la fase con más alcance por línea tocada: la pastilla de sección sale seis
veces en la página.

### 1.1 Pastilla de sección → `.eyebrow-ink` · **HECHA**

El Figma pinta la pastilla con **relleno `#050b21` sólido, sin borde, texto lima
`#b8f21e` y 14 px de aire a los lados** (auditoría § 01).

Se intentó primero reutilizar `.eyebrow-dark`, que ya existía y parecía la misma
pastilla. **No lo era:** usa 18 px de relleno y conserva el borde transparente
de `.eyebrow`, y con eso da exactamente los 114 px que pide *su* marco, el de
`/calculadora`. Cambiarla habría roto esa página. Así que `/precios` tiene
variante propia en `globals.css`:

```css
.eyebrow-ink     { background: var(--color-abyss);   border-width: 0; padding-inline: max(11px, 14 * var(--u)); font-weight: 500; }
.eyebrow-ink-40  { background: rgba(5,11,33,0.4);    border-width: 0; padding-inline: max(11px, 14 * var(--u)); font-weight: 500; }
```

`.eyebrow-ink` en `PricingPage.tsx:70` (dentro de `SectionHead`, que la reparte
a Comparativa, Módulos, Formas de pago y Dudas) y `:142` (la cabecera).
`.eyebrow-ink-40` en `:468` — ver 1.2.

`.eyebrow-light` y `.eyebrow-white` se quedaron sin usos y se borraron.

### 1.2 Pastilla sobre la tarjeta azul del cierre · **HECHA**

La del CTA final no es opaca. Medido sobre `p-07.png`: sale `#243e9c` sobre un
fondo `#3861ee`, que es `#050b21` al **40 %** — `0,4·5 + 0,6·56 = 36 = 0x24`,
`0,4·11 + 0,6·97 = 63 = 0x3f`, `0,4·33 + 0,6·238 = 156 = 0x9c`. Y el texto
también es **lima**, no blanco, así que `.eyebrow-white` no servía.

La caja mide **140×28** (`890…1029`, `514…541`); la nuestra, 141×28.

**Verificación Fase 1 — pasada:**

- Las seis pastillas: `background` `rgb(5,11,33)` (la del CTA, `rgba(5,11,33,.4)`), `color` `rgb(184,242,30)`, alto 28, sin borde. ✅
- Ancho: «Comparativa» 126 contra 124 del Figma, «Módulos» 98 contra 96. El residuo de +2 px es métrica de fuente entre Figma y Chrome sobre la misma cadena, no un valor de estilo; **no se fuerza con un `letter-spacing` a medida**. ✅
- `/calculadora` intacta: «Tu cuenta» sigue en 114, las otras tres en 125/163/167. ✅
- `grep -rn "eyebrow-light\|eyebrow-white" src/` → 0, y las dos reglas borradas de `globals.css`. ✅
- `npx tsc --noEmit` limpio · `npm run lint` 0 errores (9 avisos previos, en `docs/`) · `npm run build` limpio. ✅

**Anti-patrones:** no tocar `.eyebrow` base (la usan home y calculadora) ni
`.eyebrow-dark` (es de la calculadora, con su propio marco y su propio ancho).

---

## Fase 2 · Cabecera

Auditoría § 03. El cuerpo del H1 **ya está bien** (≈ 50 en el Figma contra 52 en
el código, la «E» de «Elige» mide 41×37 y 39×39): no se toca `fs-u-52`. Lo que
falla es el ancho de caja, el párrafo y los huecos.

| Propiedad | Figma (medido) | Código (`PricingPage.tsx`) | Cambio |
|---|---|---|---|
| Ancho del H1 | texto en 2 líneas dentro de 619 (`653…1271`) | `max-w-u-946` `:143` | `max-w-u-700` (fuerza el mismo salto sin fijar el punto de corte) |
| Interlínea del H1 | pitch 57 | `lh-u-54` `:143` | `lh-u-57` |
| Párrafo | **20/28**, 5 líneas, caja 694 | `fs-u-18 lh-u-22 max-w-u-950` `:146` | `fs-u-20 lh-u-28 max-w-u-700` |
| Hueco pastilla → H1 | 38 | `mt-u-57` `:143` | `mt-u-38` |
| Hueco H1 → párrafo | 32 | `mt-u-37` `:146` | `mt-u-32` |

El lede gris (`:149`) y el botón (`:152-158`) se conservan (D1). Al lede se le
pone `max-w-u-700` para que no sea más ancho que el párrafo que tiene encima.

**Verificación Fase 2:** capturar y pasar `lines.py` sobre la cabecera. Esperado:
pastilla 28 de alto; H1 en **2 líneas** con pitch ≈ 57; párrafo en 5 líneas con
pitch 28 y ancho ≤ 700. Comparar con `p-00.png` mismo recorte.

**Anti-patrones:** no meter un `<br>` ni un `text-balance` distinto para forzar el
salto — se consigue con el ancho; no bajar el `fs-u-52` del H1.

---

## Fase 3 · Tarjetas de plan

Auditoría § 09 y § 00. Casi todo coincide (377 de ancho, hueco ≈ 30, sombra,
`linear-gradient(180deg,#d5dae9,#ffffff 62%)`). Un solo cambio:

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Radio del botón del plan | **píldora completa** — 227×60, y a 3 px del borde abarca 28 en vertical (radio 30; con 25 saldrían 34) | `rounded-u-25` sobre `h-u-57 w-u-226` `:236` | `rounded-full` |

Opcional, de bajo riesgo: el hueco de la rejilla es 32 en el Figma y `gap-u-30`
en el código (`:165`) → `gap-u-32`.

**Verificación Fase 3:** `edges.py` en columna a 3 px del borde izquierdo del
botón → extensión vertical ≈ 26-28, no ≈ 34. La sombra y el degradado del cuerpo
no cambian: `git diff` no debe tocar `shadow-[...]` ni `bg-[linear-gradient(180deg,#3b67ff...`.

---

## Fase 4 · Banda del Diagnóstico y tarjeta «¿Te compensa?»

Auditoría § 04.

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Ancho de la banda | 1313 (`304…1616`) | `max-w-u-1268` `:264` | `max-w-u-1313` |
| Alto | 242 | 227 | sale solo al subir el padding: `py-u-40` → `py-u-48` |
| Botón | **blanco, texto negro, 276×65, píldora** | `h-u-58 min-w-u-183 rounded-full border-pulse bg-electric ... text-white` `:272` | `h-u-65 min-w-u-276 rounded-full bg-white text-black`, sin borde |

La píldora está comprobada: el botón va de `363` a `638` a media altura y de
`254` a `318` en vertical; a 8 px del borde superior el lado izquierdo ya se ha
desplazado a `372`, que es lo que da un radio de 32,5.

El fondo `#d5dae9` y el «0 €» azul **no se tocan**.

### Tarjeta «¿Te compensa?» (`:284-300`)

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Borde | **1 px sólido `#779eff`** | `ring-conic` con `--ring-bg: linear-gradient(0deg,#94b2fc,#c7d7ff)` | `border border-periwinkle`, quitar `ring-conic` y el `style` |
| Fondo | degradado `#fafaff → #f4f6ff` | `bg-white` | `bg-[linear-gradient(180deg,#fafaff_0%,#f4f6ff_100%)]` |
| Alto | 158 | ≈ 130 | `py-u-32` → `py-u-40` |
| Título | caja baja | `uppercase tracking-[0.1em]` `:290` | quitar `uppercase` y el `tracking` |
| Enlace | **abajo a la derecha**, bajo el texto | centrado vertical a la derecha (`md:flex-row md:items-center`) | columna siempre + `self-end` en el enlace |

**Verificación Fase 4:** `px.py` sobre el borde de la tarjeta → `#779eff` en 1 px.
`edges.py` en la fila central del botón → blanco de `363` a `638`. El «0 €» sigue
en `#1a4dff`.

---

## Fase 5 · Comparativa

Auditoría § 05. El ancho de 1440 ya coincide; cambia el envoltorio y las marcas.

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Borde | **1 px sólido `#779eff`** | `ring-conic` 1,3 px `#9babd4 → #c7d7ff` `:311-313` | `border border-periwinkle`, fuera `ring-conic` y su `style` |
| Radio | ≈ 25 | `rounded-u-35` | `rounded-u-25` |
| Fondo | degradado continuo `#fcfdff → #f5f7ff` en **toda** la tarjeta | `bg-white/50` + degradado solo en `tbody` (`#ffffff → #ecefff` al 40 %) | el degradado pasa al contenedor; el `tbody` se queda sin `bg` |
| Columna destacada | `#f2f5ff → #ebefff`, 315 de ancho | `bg-cloud/20` | `bg-[linear-gradient(180deg,#f2f5ff_0%,#ebefff_100%)]` |
| Cabeceras | **subrayadas** | sin subrayar | `underline underline-offset-[0.25em]` en los cuatro `th` |
| Línea bajo la cabecera | no hay | `<tr aria-hidden>` con `h-px bg-[rgba(154,165,192,.8)]` `:333-336` | eliminar ese `<tr>` |
| Marca de fila | chevron `›` | `<span>` cuadrado de 11 px con borde `:344` | `ChevronRight` de lucide, `size-u-14`, color `#9aa5c0` |
| Ausencia | `✕` | `–` en `CellValue` `:106` | devolver una `X` de lucide del mismo tamaño que el check |

### El check lima está en la columna equivocada

En el Figma los círculos lima (`#a7dd16`) están en **Arranque** y los azul noche
(`#101a3e`) en Core y Nexus. El código se los da a Core porque `CellValue`
recibe `star={ci === 1}` (`:357`).

Ojo: la columna con **fondo** destacado sí es Core. En el diseño el resalte de
fondo y el check lima van en columnas distintas — está así en el marco, no es un
error de lectura. Así que hay que **separar las dos condiciones**:

```tsx
<CellValue value={cell} star={ci === 0} />   // lima en Arranque
```

y dejar el `ci === 1` solo donde pinta el fondo. Renombrar el prop de `star` a
`lime` para que no se vuelva a confundir con el plan destacado.

El verde no se toca: el `linear-gradient(180deg,#b8f21e,#97ca0f)` del código cae
justo en el `#a7dd16` medido.

**Verificación Fase 5:** `px.py` en el centro de un check de la columna Arranque
→ ≈ `#a7dd16`; en Core y Nexus → `#101a3e`. Borde de la tarjeta `#779eff` en
1 px. `grep -n "aria-hidden" ` sobre la tabla → una ocurrencia menos.

---

## Fase 6 · Módulos

Auditoría § 06. El alto de 244 ya coincide.

| Propiedad | Figma | Código | Cambio |
|---|---|---|---|
| Fondo de sección | **plano `#e7ebf6`** | `linear-gradient(180deg,#f4f6ff,rgba(213,218,233,.74))` `:372` | `bg-[#e7ebf6]` |
| Borde de tarjeta | `#dde7ff` arriba → `#c7d7ff` abajo | `--ring-bg: linear-gradient(0deg,#94b2fc,#c7d7ff)` `:379` | `linear-gradient(180deg,#dde7ff,#c7d7ff)` (ojo: el código va en `0deg`, que es de abajo a arriba) |
| Sombra | no se aprecia | `shadow-[0_0_15px_rgba(0,0,0,0.2)]` `:382` | quitarla |
| Título | **subrayado** | sin subrayar | `underline underline-offset-[0.2em]` |
| Flecha | `↳` (codo), oscura | `ArrowRight` en `#556a9e` `:401-403` | `CornerDownRight` de lucide, color `#101a3e` |
| Hueco de la rejilla | **≈ 13** (tarjetas ≈ 457, total 1393) | `lg:gap-u-32` (tarjetas 459, total 1441) `:375` | `lg:gap-u-13` |

### Iconos: dos colores (D3 — confirmar)

Muestreados uno a uno sobre `p-04.png` y `p-05.png`:

- **Solo la 1.ª tarjeta** («La web, después») lleva el azul vivo `#1a4dff → #1233a6`, que es prácticamente el `#1a4dff → #1036ba` que ya usa el código.
- **Las otras siete** llevan navy `#091a75 → #08134d`.

Encaja con que esa tarjeta es la distinta también en el precio (negro, sin
`/mes`), así que parece intención. Implementación:

```tsx
i === 0
  ? "bg-[linear-gradient(180deg,#1a4dff_0%,#1036ba_100%)]"
  : "bg-[linear-gradient(180deg,#091a75_0%,#08134d_100%)]"
```

**Marcarlo en el PR como pendiente de confirmar con la diseñadora.**

**Verificación Fase 6:** `px.py` en el centro de los ocho iconos → uno azul vivo
y siete navy. `edges.py` en una fila sin texto de la rejilla → tarjetas de ≈ 457
con huecos de ≈ 13. El fondo de la sección devuelve `#e7ebf6` tanto arriba como
abajo (antes cambiaba con la altura).

---

## Fase 7 · Formas de pago · **rediseño**

Auditoría § 02. Es el único bloque que se rehace, no se ajusta.

**Fuera:** las cuatro cápsulas de 295×92 con borde azul, las líneas de 73 px que
las unen y el texto colgando debajo (`PricingPage.tsx:415-439`: las cápsulas en `:425`, las líneas en `:423`).

**Dentro:** un solo panel, con las cuatro columnas dentro.

```
panel   1299 × 295, radio 25, fondo #e7ebf6, centrado
  └ rejilla de 4 columnas
      ├ cifra      ~48 px, Bold, #1a4dff        ← item.title
      ├ etiqueta   ~20 px, Bold, negro          ← item.k
      ├ párrafo    ~15/21, Regular, negro       ← item.body
      └ pie        ~15, Bold, negro             ← item.foot
```

El diccionario **encaja tal cual**: `item.title` es la cifra, `item.k` la
etiqueta, y `PAY_ORDER = [2, 0, 1, 3]` ya da el orden del Figma
(`0€ de entrada · -5€ al contado · 3 plazos fraccionado · +0.4% flexible`).
**No se toca `src/i18n/pricing.ts`.**

En móvil el panel apila las cuatro columnas; mantener el patrón de la página
(`min-[680px]:grid-cols-2 xl:grid-cols-4`).

**Verificación Fase 7:** `px.py` en tres puntos del panel → `#e7ebf6` en los tres.
`edges.py` en una fila central → panel de ≈ 1299 empezando en ≈ 311. `grep -n
"h-u-92\|w-u-73" src/components/pricing/PricingPage.tsx` → 0 (no quedan restos de
las cápsulas ni de las líneas). `git diff src/i18n` vacío. A 375 px de ancho las
cuatro columnas se apilan sin desbordar.

**Anti-patrones:** no conservar las cápsulas «por si acaso» detrás de un
`hidden`; no añadir campos al diccionario — la forma actual basta.

---

## Fase 8 · Dudas razonables

Auditoría § 07.

| Propiedad | Figma | Código (`:441-465`) | Cambio |
|---|---|---|---|
| Ancho de fila | 663 | `max-w-u-704` | `max-w-u-663` |
| Alto de fila | 62 | 82 | `py-u-20` → `py-u-14` |
| Hueco | 10 | `gap-u-13` | `gap-u-10` |
| Fondo | `#fbfcff` | `bg-white/50` | `bg-[#fbfcff]` |
| Borde | **1 px sólido `#91b1ff`** | `ring-conic` 1,3 px en degradado | `border border-[#91b1ff]`, fuera `ring-conic` y su `style` |
| `+` | fino, azul, ≈ 24 | `fs-u-42 font-medium` | `fs-u-24 font-normal` |

El `open:bg-white` y el giro del `+` al abrir se conservan (son estado, y el
Figma solo enseña el cerrado).

**Verificación Fase 8:** `edges.py` en una columna que cruce dos filas → filas de
62 con huecos de 10, borde `#91b1ff` de 1 px, relleno `#fbfcff`. Abrir una
pregunta sigue funcionando (es `<details>`, no hay JS que romper).

---

## Fase 9 · CTA final

Auditoría § 08. La tarjeta ya está bien: ≈ 1194×460, radio 35,
`linear-gradient(180deg,#3b67ff,#29459f)`. Y la nota en menta también.

| Propiedad | Figma | Código (`:472-500`) | Cambio |
|---|---|---|---|
| Pastilla | `#050b21` al 40 %, texto lima | `.eyebrow-white` `:468` | `.eyebrow-ink-40` (Fase 1.2) |
| Botón principal | **navy `#050b21 → #101a3e`**, píldora ≈ 275×60, texto blanco + icono de teléfono azul | blanco con texto azul, `h-u-69 min-w-u-223` `:474-480` | `h-u-60 min-w-u-275 bg-[linear-gradient(180deg,#050b21_0%,#101a3e_100%)] text-white`, sin borde, con `PhoneOutgoing` de lucide en `text-electric` |
| Segundo botón | no existe | botón fantasma a `/calculadora` `:482-486` | **se conserva** (D2), restilado como fantasma sobre el nuevo primario |

**Verificación Fase 9:** `px.py` dentro de la pastilla → ≈ `#243e9c` sobre el azul
de la tarjeta; el texto, lima. `px.py` en el botón → `#0a112c` a la izquierda y
`#111f4f` a la derecha-arriba. El degradado de la tarjeta **no ha cambiado**:
`px.py` arriba ≈ `#3b67ff`, abajo ≈ `#29459f`.

---

## Estado: todas las fases aplicadas

Fases 1–9 hechas y verificadas contra el marco. El detalle de cada una, con las
desviaciones que solo aparecieron al comparar, está en
[`docs/figma/precios-1520/audit.md`](../docs/figma/precios-1520/audit.md)
(apartado «Estado final» y el «Estado: corregido» de cada sección).

---

## Fase 10 · Verificación final

1. `npm run lint && npx tsc --noEmit && npm run build` limpios.
2. **Copy intacto:** `git diff main -- src/i18n` vacío.
3. **Animación y funcionalidad intactas** (prueba mecánica):
   ```bash
   git diff main -- src | grep -E "^[-+]" | grep -vE "^(\+\+\+|---)" \
     | grep -E "motion\.|useScroll|useTransform|useInView|Lenis|requestAnimationFrame|IntersectionObserver|addEventListener|onClick|dispatchEvent|trackEvent|href=|@keyframes|--animate-"
   ```
   Debe devolver **solo** líneas movidas literalmente (las de Formas de pago, que
   cambia de estructura). Cualquier otra coincidencia es un cambio de
   comportamiento y se revierte.
4. **Recaptura y comparación loncha a loncha:**
   ```bash
   node scripts/figma/proto-shot.mjs "<url del proto>" --slices 9   # el Figma
   # y la web a 1920 con el mismo recorte de 1080
   ```
   Repasar `p-00…p-08` contra las capturas de la web y anotar el resultado en
   `docs/figma/precios-1520/audit.md`, columna «Estado»: `ok` · `corregido` ·
   `n/a` · `pendiente externo`.
5. **Lista de comprobación al píxel**, con `px.py`/`edges.py`:
   - Seis pastillas navy con texto lima, 114×28 (la del CTA, al 40 %).
   - Cabecera: H1 en 2 líneas, párrafo 20/28 en 5 líneas ≤ 700.
   - Botón del Diagnóstico blanco, 276×65, píldora.
   - Comparativa: borde `#779eff` 1 px, radio 25, cabeceras subrayadas, `✕` en vez de `–`, **lima en Arranque**.
   - Módulos: fondo plano `#e7ebf6`, sin sombra, títulos subrayados, flecha en codo, 1 icono azul + 7 navy.
   - Formas de pago: un panel de 1299×295 en `#e7ebf6`, sin cápsulas ni líneas.
   - FAQ: filas de 663×62, borde `#91b1ff`, fondo `#fbfcff`.
   - CTA final: botón navy con icono; tarjeta y nota sin cambios.
6. **Móvil no roto:** panel Browser preset `mobile` (375) sobre `/precios`; y
   repasar `/`, `/calculadora` y `/contacto` por si el cambio de `.eyebrow-light`
   o `.eyebrow-white` les afecta.
7. Commit en rama `figma/precios-1520` con mensaje en el estilo del repo
   (español, una línea que dice qué queda como en el Figma), PR a `main`.
   Anotar en el PR los pendientes: **D3** (colores de icono por módulo) y las
   decisiones D1/D2 con su resolución.

**Anti-patrones finales:** no hacer «ajustes de ojo» sin una medida que lo
respalde; no cambiar valores que ya coinciden (§ 00 de la auditoría lista cuáles
son); no dejar utilidades muertas en `globals.css` — `grep` de cada clase nueva
debe dar ≥ 1 uso.
