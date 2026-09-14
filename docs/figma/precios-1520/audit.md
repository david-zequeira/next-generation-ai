# Auditoría /precios · Figma `1520:1546` vs código

Comparación al píxel entre el marco **`1520:1546`** del fichero
[«Asenix Web»](https://www.figma.com/design/IxRzkKKPa5XStlUI6UnpBv/Asenix-Web)
y `src/components/pricing/PricingPage.tsx` tal y como se sirve hoy.

Solo estilo: color, degradado, forma, borde, sombra, tamaño y espaciado. **Los
textos que faltan o no coinciden quedan fuera** — se anotan cuando cambian la
forma (un botón menos, una línea de más), no cuando cambia la redacción.

---

## De dónde salen estos números

La API REST de Figma devolvió `429` con `retry-after: 289768` (≈ 3,4 días) y el
MCP de Figma tiene la cuota del plan Starter agotada, así que no se pudo leer el
árbol del nodo. La vía que sí funcionó:

1. **El diseño** — el prototipo público renderizado en Chrome headless a
   1920 px de ancho, donde sale 1:1 (el lienzo mide 1920×1015):

   ```bash
   node scripts/figma/proto-shot.mjs "https://www.figma.com/proto/IxRzkKKPa5XStlUI6UnpBv/Asenix-Web?node-id=1520-1546&t=zbjTqq6zvjsfetI0-0&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1" --slices 9
   ```

   → `docs/figma/precios-1520/proto/p-00…p-09.png`. El marco mide ≈ 8.200 px de
   alto. Las capturas van por CDP y no por `page.screenshot()`: el lienzo de
   Figma nunca queda quieto y Playwright espera estabilidad hasta agotar el
   tiempo.

2. **La web** — `/precios` del servidor de desarrollo al mismo ancho, con el
   consentimiento de cookies ya resuelto para que el aviso no tape nada.

3. **Las medidas** — los colores por muestreo de píxel sobre las dos capturas,
   las geometrías por detección de saltos de color a lo largo de una fila o una
   columna, y del lado del código directamente por `getBoundingClientRect()` y
   `getComputedStyle()`.

Todo valor de este documento está medido, no estimado, salvo donde diga
«aproximado».

---

## El marco es otro

La página **no** está construida contra este marco. Se construyó contra
`690:14` («Asenix Planes»), que es lo que documenta
[`docs/figma/precios/audit.md`](../precios/audit.md). `1520:1546` es un rediseño
posterior: comparten estructura y paleta, pero hay una sección entera redibujada
y un cambio de lenguaje en las pastillas de sección que afecta a toda la página.

Por eso esto no es una lista de retoques. El punto 2 de abajo es trabajo de
maquetación nueva.

---

## 00 · Lo que ya está bien

No hay que tocarlo, y conviene no romperlo al aplicar el resto:

| Qué | Valor |
|---|---|
| Rejilla de planes | 3 tarjetas de 377 px, hueco ≈ 30 (Figma 32) — Figma `363…1557`, web `365…1554` |
| Sombra de la tarjeta de plan | presente en los dos, mismo desparrame |
| Cuerpo de la tarjeta de plan | `linear-gradient(180deg, #d5dae9 0%, #ffffff 62%)` |
| Alto de la tarjeta de módulo | 244 px |
| Ancho de la comparativa | 1440 px (`240…1680`) |
| Verde del check de la comparativa | `#a7dd16` — el `linear-gradient(180deg,#b8f21e,#97ca0f)` del código cae justo ahí |
| Azul oscuro del check | `#101a3e` (`--color-space`) |
| Banda del Diagnóstico | fondo `#d5dae9` |
| Tarjeta del CTA final | ≈ 1194×460, radio 35, `linear-gradient(180deg,#3b67ff,#29459f)` |
| Nota final | verde menta |
| Tamaño del H2 de sección | **52 px**. La «Q» de «Que incluye cada nivel?» mide 61×45 en el Figma y 59×45 en la web. Parecía más grande por el salto de línea, no por el cuerpo. |
| Tamaño del H1 | ≈ 50 px contra los 52 del código: la «E» de «Elige» mide 41×37 y 39×39. Se da por bueno; lo que sí falla es el ancho de caja (§ 03). |

---

## 01 · Pastilla de sección · **alta** · afecta a 6 sitios

Aparece en cabecera, comparativa, módulos, formas de pago, dudas y CTA final.

| | Figma | Código |
|---|---|---|
| Relleno | `#050b21` sólido (`--color-abyss`) | caja blanca |
| Borde | ninguno | degradado `#1a4dff → #102e99` |
| Texto | lima `#b8f21e` | azul `#1a4dff` |
| Caja | 114×28 | 119×28 |

El relleno lateral es de **14 px**, medido sobre la caja: «COMPARATIVA» ocupa de
`898` a `1021` (124 exactos, sin rampa de antialias) y su texto de `912` a
`1007`. Y no lleva borde.

**Estado: corregido** (Fase 1). Se creó `.eyebrow-ink` / `.eyebrow-ink-40` en
`globals.css` en vez de reutilizar `.eyebrow-dark`: esa clase usa 14 px de
relleno lateral y conserva el borde transparente de `.eyebrow`, y con eso da
exactamente los 114 px que pide **su** marco, el de `/calculadora`. Tocarla
habría roto esa página. Las reglas `.eyebrow-light` y `.eyebrow-white` se
quedaron sin usos y se borraron.

Queda un residuo de **+2 px** por pastilla (126 contra 124 en «Comparativa»,
98 contra 96 en «Módulos»): es la misma cadena con el mismo cuerpo, peso y
tracking, así que es diferencia de métrica entre el motor de Figma y Chrome, no
un valor de estilo. No se fuerza con un `letter-spacing` a medida.

En el CTA final la pastilla no es opaca: sale `#243e9c` sobre un fondo
`#3861ee`, que es exactamente `#050b21` al **40 %**. Y el texto también es lima,
no blanco — `.eyebrow-white` no sirve ahí.

---

## 01b · Cabecera de sección · **encontrado al aplicar**

No estaba en la primera lectura. `SectionHead` reparte pastilla, H2 y subtítulo a
cuatro secciones, y el ritmo vertical y el subtítulo estaban los dos mal:

| Propiedad | Figma | Código | Estado |
|---|---|---|---|
| Hueco pastilla → H2 | **32** (pastilla `653…680`, H2 desde `712`; en Módulos, `455` → `487`) | 62 (`mt-u-58`) | corregido a `mt-u-28`, medido: 32 |
| Hueco H2 → subtítulo | **12** (H2 hasta `763`, sub desde `775`) | 22 (`mt-u-26`) | corregido a `mt-u-8`, medido: 12 |
| Subtítulo | **20/28**, caja ≤ 697 | 18/27, caja 952 | corregido a `fs-u-20 lh-u-28 max-w-u-700` |
| Caja del H2 | ≤ 700 (el más ancho, «El desembolso…», mide 651) | 736 | corregido a `max-w-u-700` |

El subtítulo resultó tener el mismo cuerpo e interlínea que el párrafo de la
cabecera: 20/28.

---

## 02 · Formas de pago · **rediseño completo**

**Estado: corregido** (Fase 7). Fuera las cápsulas y las líneas; el panel mide
1299 de ancho empezando en 311, igual que el marco. Sigue siendo 106 px más
alto (401 contra 295) porque los párrafos del diccionario son más largos que los
del Figma — eso es copy.

Queda un detalle de copy que **sí afecta a la forma**: el diccionario guarda
«0 € de entrada» en el campo de la cifra, así que esa columna parte en dos
líneas donde el Figma pone «0€» arriba y «de entrada» como etiqueta. Lo mismo
con «Lo mismo, no más caro». Repartir esas cadenas entre cifra y etiqueta
arreglaría la alineación, pero es una decisión de texto (D4).

Es el cambio grande. No es un ajuste de valores: la sección está dibujada de
otra manera.

**Figma** — un solo panel `#e7ebf6`, 1299×295, radio ≈ 25, con cuatro columnas
dentro. Cada columna:

```
0€                 ← ~48 px, Bold, azul #1a4dff
de entrada         ← ~20 px, Bold, negro
La puesta en marcha se divide en 18 meses;   ← ~15/21, regular, negro
luego pagas solo la cuota del plan.
510 €/mes → 349 €/mes                        ← ~15, Bold, negro
```

Las cuatro cifras, por orden: `0€` / `-5€` / `3 plazos` / `+0.4%`, con las
etiquetas `de entrada` / `al contado` / `fraccionado` / `flexible`.

**Código** — cuatro cápsulas sueltas de 295×92, `rounded-full`, fondo `#d5dae9`,
borde `#1a4dff`, unidas por líneas de 73 px, y el texto colgando debajo de cada
una.

No hay forma de llegar de lo uno a lo otro tocando clases. Hay que rehacer el
bloque: fuera las cápsulas, fuera las líneas, y montar el panel con la rejilla
de cuatro columnas dentro.

---

## 03 · Cabecera · **alta**

**Estado: corregido** (Fase 2). Además de los valores de la tabla hubo que
**quitar `text-balance` del H1**: repartía las dos líneas por igual y el Figma
parte en seco al final de «quieres». Sin él, el salto cae en el mismo sitio.

El cuerpo del H1 está bien. Lo que falla es el ancho de caja, el párrafo y los
huecos verticales. Línea a línea:

| | Figma | Código |
|---|---|---|
| H1 | ~50 px, **2 líneas**, pitch 57, caja de texto 619 (`653…1271`) | 52/54, **1 sola línea** a 1920, `max-w-u-946` (`513…1409`) |
| Párrafo | **~20 px, interlínea 28**, 5 líneas, caja 694 (`613…1306`) | **18/22**, 3 líneas, `max-w-u-950` (`488…1431`) |
| Hueco pastilla → H1 | **38 px** | 62 px (`mt-u-57`) |
| Hueco H1 → párrafo | **32 px** | 39 px (`mt-u-37`) |
| Línea gris de apoyo | no existe | `fs-u-15 text-black/60`, debajo del párrafo |
| Botón | **no existe** | píldora 337×70, `bg-space`, «Empezar con el diagnóstico gratis» |

El Figma va de la pastilla al párrafo y de ahí directo a las tarjetas. Quitar el
botón y la línea gris es una decisión de negocio, no de estilo: **se anota, no
se aplica sin que lo confirmes.** Lo demás (anchos, cuerpo del párrafo y huecos)
sí es estilo puro.

---

## 04 · Banda del Diagnóstico · **alta**

**Estado: corregido** (Fase 4). La banda mide 1313 empezando en 304, exacto.
Al compararlo se vieron dos cosas que no estaban en la primera lectura: la
etiqueta «Diagnóstico de IA» va en **azul**, no en negro, y la columna de texto
mide **846**, no 675.

| | Figma | Código |
|---|---|---|
| Ancho de la banda | 1313 (`304…1616`) | 1268 |
| Alto | 242 | 227 |
| Botón | **blanco**, texto negro, **276×65 en píldora completa** | azul `#1a4dff`, texto blanco, 183×58, borde `#94b2fc` |

La píldora está comprobada, no supuesta: el botón va de `363` a `638` a media
altura y de `254` a `318` en vertical; a 8 px del borde superior el lado
izquierdo ya se ha desplazado a `372`, que es justo lo que da un radio de 32,5
(`32,5 − √(32,5² − 24,5²) = 11`).

El fondo `#d5dae9` y el «0 €» en azul coinciden.

### Tarjeta «¿Te compensa?» · baja

Existe en los dos. En el Figma: 158 px de alto, borde **1 px sólido `#779eff`**
(`--color-periwinkle`), fondo en degradado `#fafaff → #f4f6ff`, el título en
caja baja y el enlace «Hacer la cuenta →» **abajo a la derecha**, debajo del
texto. En el código: anillo cónico en degradado, blanco sólido, título en
versalitas con `tracking-[0.1em]` y el enlace centrado verticalmente a la
derecha.

---

## 05 · Comparativa · **alta**

**Estado: corregido** (Fase 5). 1438 de ancho contra 1440. La columna de
características se quedó en `pl-u-86 pr-u-8` (antes `px-u-86` a los dos lados):
con 86 de relleno a la derecha, «Recordatorios y cancelación en un clic» partía
en dos líneas y en el marco entra en una.

| | Figma | Código |
|---|---|---|
| Borde de la tarjeta | **1 px sólido `#779eff`** | `ring-conic` 1,3 px `#9babd4 → #c7d7ff` |
| Fondo | degradado continuo `#fcfdff → #f5f7ff` de arriba abajo | `bg-white/50` + degradado solo en `tbody`, `#ffffff → #ecefff` al 40 % |
| Columna destacada | `#f2f5ff → #ebefff`, 315 px de ancho | `bg-cloud/20` |
| Cabeceras | **subrayadas** | sin subrayar |
| Línea bajo la cabecera | no hay | `1px` `rgba(154,165,192,.8)` |
| Marca de fila | chevron `›` | cuadradito de 11 px con borde |
| Ausencia | `✕` | guion `–` |
| Radio | ≈ 25 | 35 |

### El check lima está en la columna equivocada

En el Figma los círculos lima (`#a7dd16`) están en la columna **Arranque**, y
los azul noche (`#101a3e`) en Core y Nexus. El código se los da a Core, porque
`CellValue` recibe `star={ci === 1}`.

Ojo al detalle: la columna con fondo destacado sí es Core. O sea, en el diseño
**el resalte de fondo y el check lima van en columnas distintas.** No es un
descuido de lectura, está así en el marco.

---

## 06 · Módulos · **media**

**Estado: corregido** (Fase 6). Tarjetas de 457×244, exacto. Dos cosas que
salieron al comparar: el subrayado del título **no se puede quitar en un
descendiente** (`text-decoration` se propaga y `no-underline` no lo deshace), así
que va sobre un `<span>` que envuelve solo el nombre; y el título necesitaba
`pr-u-90` en vez de `max-w-u-297 pr-u-70`, que dejaba 227 px de hueco para un
texto de 246.

| | Figma | Código |
|---|---|---|
| Fondo de sección | **plano `#e7ebf6`** | `linear-gradient(180deg,#f4f6ff,rgba(213,218,233,.74))` |
| Borde de tarjeta | 1 px, `#dde7ff` arriba → `#c7d7ff` abajo | `ring-conic` `#c7d7ff` arriba → `#94b2fc` abajo (invertido y más oscuro) |
| Sombra | no se aprecia | `0 0 15px rgba(0,0,0,.2)` |
| Título | **subrayado** | sin subrayar |
| Flecha | `↳` (codo), oscura | `→` de lucide, `#556a9e` |
| Hueco de la rejilla | **≈ 13 px** (tarjetas de ≈ 457, total 1393: `266…1658`) | 32 px (tarjetas de 459, total 1441: `240…1680`) |
| Iconos | **dos familias** (ver abajo) | todos azul `#1a4dff → #1036ba` |

El alto de 244 sí coincide.

### Los iconos van en dos colores

Muestreados uno a uno en las dos lonchas de módulos:

- **Solo la primera tarjeta** («La web, después») lleva el azul vivo,
  `#1a4dff → #1233a6` — que es prácticamente el `#1a4dff → #1036ba` del código.
- **Las otras siete** llevan un navy mucho más oscuro,
  `#091a75 → #08134d`.

Encaja con que esa primera tarjeta es la distinta también en el precio (negro y
sin `/mes`), así que parece intención y no descuido. Aun así conviene
confirmarlo con la diseñadora antes de codificar la excepción.

---

## 07 · Dudas razonables · **media**

**Estado: corregido** (Fase 8). Filas de 663×62, exacto. Al comparar se vieron
dos más: el relleno lateral es de **20**, no 41 (el texto del marco empieza en
647 y la fila en 627), y la pregunta va en **600**, no en 700.

| | Figma | Código |
|---|---|---|
| Fila | 663×62 | 704×82 |
| Hueco | 10 | 13 |
| Fondo | `#fbfcff` | `bg-white/50` |
| Borde | **1 px sólido `#91b1ff`** | `ring-conic` 1,3 px en degradado |
| `+` | fino, azul, ≈ 24 px | `fs-u-42 font-medium` |

---

## 08 · CTA final · **alta**

**Estado: corregido** (Fase 9), salvo el segundo botón, que se conserva (D2).
La pastilla mide 141×28 contra 140×28 del marco.

| | Figma | Código |
|---|---|---|
| Tarjeta | ≈ 1194×460, radio 35, `#3b67ff → #29459f` | igual ✅ |
| Pastilla | `#050b21` al 40 % sobre el azul, texto **lima** | `.eyebrow-white`: borde y texto blancos |
| Botón | **uno solo**: navy `#050b21 → #101a3e`, píldora ≈ 275×60, texto blanco + icono de teléfono azul | blanco con texto azul, 223×69, **más un segundo botón fantasma** a la calculadora |
| Nota | verde menta | igual ✅ |

El segundo botón es, otra vez, decisión de negocio. **Se anota, no se aplica sin
que lo confirmes.**

---

## 09 · Botón de plan · **baja**

**Estado: corregido** (Fase 3). Y apareció una desviación que no estaba en la
primera lectura: **la etiqueta del plan va alineada a la derecha**, no a la
izquierda. Medido: la de «Arranque» ocupa 498…693 en una tarjeta de 363…739
(46 desde el borde derecho) y la de «Core» 956…1099 en 772…1148 (49). El código
la ponía en `left-u-40`. El voladizo de 17 px por arriba sí era correcto.

Radio. En el Figma es una píldora completa: el botón mide ≈ 227×60 (`434…660`,
`703…762`) y a 3 px del borde izquierdo abarca 28 px en vertical. Eso es un
radio de 30 — `2·√(30² − 27²) = 26` — y no 25, que daría
`(60 − 50) + 2·√(25² − 22²) = 34`. El código usa `rounded-u-25` sobre 226×57.

---

## 10 · Hablemos y pie

Se mantienen: el Figma enseña el mismo `FinalCTA` + `Footer` en tono oscuro que
ya está en el código.

---

## Estado final

Todas las fases aplicadas. Geometría medida contra el marco:

| Elemento | Figma | Web | |
|---|---|---|---|
| Tarjeta de plan | x363, 377 | x363, 377 | exacto |
| Banda del Diagnóstico | x304, 1313×242 | x304, 1313×250 | exacto en ancho |
| Comparativa | x240, 1440 | x241, 1438 | ±2 |
| Tarjeta de módulo | 457×244 | 457×244 | exacto |
| Panel de Formas de pago | x311, 1299×295 | x311, 1299×401 | exacto en ancho; el alto lo marca el copy |
| Fila del FAQ | 667×62 | 663×62 | ±4 |
| Tarjeta del CTA final | x363, 1194×460 | x362, 1197×502 | +42 de alto por el 2.º botón (D2) |
| Cabecera de sección | huecos 32 y 12 | 32 y 12 | exacto |

`src/i18n` sin tocar. El filtro mecánico de animación y funcionalidad
(`motion.*`, `useScroll`, `Lenis`, `IntersectionObserver`, `addEventListener`,
`trackEvent`, `href=`, `@keyframes`, `--animate-*`) sobre el diff devuelve cero
líneas. `tsc` y `build` limpios; `lint` sin errores. A 375 px no se desborda
ninguna de las tres páginas afectadas.

**Sigue pendiente de ti:** D1 (el botón y la línea gris de la cabecera, que el
marco no tiene), D2 (el segundo botón del cierre), D3 (confirmar con la
diseñadora que solo el primer módulo lleva el icono azul vivo) y el reparto de
«0 € de entrada» entre cifra y etiqueta en Formas de pago.

---

## Resumen por gravedad

**Alta** — 01 pastillas de sección · 02 formas de pago · 03 cabecera (anchos,
párrafo y huecos) ·
04 botón del Diagnóstico · 05 comparativa (borde, subrayados, `✕`, chevron, y el
lima en la columna correcta) · 08 pastilla y botón del CTA final.

**Media** — 06 módulos (fondo plano, borde, sombra, flecha, hueco, iconos) ·
07 dudas razonables.

**Baja** — 09 radio del botón de plan · 04 ancho de la banda · 04 tarjeta
«¿Te compensa?» · 06 hueco de la rejilla.

**No se aplica sin confirmación** — quitar el botón y la línea gris de la
cabecera; quitar el segundo botón del CTA final; qué módulos llevan el icono
navy y cuáles el azul vivo.
