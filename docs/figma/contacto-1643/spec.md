# /contacto · Figma `1643:2250` — medidas

Marco **`1643:2250`** («Contacto») del fichero
[«Asenix Web»](https://www.figma.com/design/IxRzkKKPa5XStlUI6UnpBv/Asenix-Web).
Ancho de marco **1920**, así que cada medida de aquí se escribe en código como
`N*var(--u)` — las utilidades `*-u-N` de `globals.css`.

## De dónde salen estos números

La API REST de Figma está **sin cuota**: devuelve `429` con
`retry-after: 150696` (≈ 1,7 días) y `x-figma-plan-tier: starter`. El MCP de
Figma pide OAuth y esta sesión no puede abrirlo. La vía que sí funciona es la
misma que se usó en `/precios` — renderizar el prototipo público, que se ve sin
token, a 1920 px, donde sale 1:1:

```bash
node scripts/figma/proto-shot.mjs "https://www.figma.com/proto/IxRzkKKPa5XStlUI6UnpBv/Asenix-Web?node-id=1643-2250&t=ihuUxlBK08EHAJJQ-0&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1" --out docs/figma/contacto-1643/proto --slices 8
```

→ `proto/p-00…p-08.png` (no se versionan). El scroll es determinista: **cada
loncha baja 900 px**, así que `p-01` = `p-00` + 900 y `p-02` = `p-00` + 1800.
Todas las `y` de este documento están en coordenadas de `p-00`, que coinciden
con las del marco.

Las medidas se sacan con [`scripts/figma/measure.mjs`](../../../scripts/figma/measure.mjs)
(nuevo), que muestrea píxeles sobre esas capturas:

```bash
node scripts/figma/measure.mjs <png> px   <x> <y> …          # color en un punto
node scripts/figma/measure.mjs <png> row  <y> [x0] [x1]      # saltos de color en una fila
node scripts/figma/measure.mjs <png> col  <x> [y0] [y1]      # ídem en una columna
node scripts/figma/measure.mjs <png> box  <x0> <y0> <x1> <y1> # colores de la región
node scripts/figma/measure.mjs <png> bands <x0> <y0> <x1> <y1> # líneas de texto y su caja
node scripts/figma/measure.mjs <png> bbox <x0> <y0> <x1> <y1> # caja de lo que no es fondo
node scripts/figma/measure.mjs <png> crop <x0> <y0> <x1> <y1> <zoom> --out f.png
```

### Cómo se deduce la tipografía, y por qué es fiable

De cada línea se mide la caja de tinta (ancho y alto). Luego se busca qué
combinación de `(peso, tamaño, tracking)` de Montserrat reproduce esa caja,
pintando el texto en un `<canvas>` del navegador con la misma fuente que sirve
el sitio. El tracking se restringe a los tres valores que usa el fichero
(`0`, `±0.05em`), que es lo que sale al vaciar `docs/figma/home-1532/spec.md`:
de 150 nodos de texto, todos llevan `0` salvo los rótulos en versalitas
(`0.05em`) y dos titulares de display (`-0.05em`).

El método está **calibrado** contra un bloque cuyo valor ya se conocía de otro
marco: el titular del cierre («Hablemos. Nos encantaría conocer tu proyecto»,
Montserrat 600 + 400, 60/65, `-0.05em`, según `home-1532/spec.md`). Medido en
esta captura contra lo que pinta el canvas:

| Línea | Figma | Canvas | Δ |
| --- | --- | --- | --- |
| `Hablemos. Nos` | 418 | 418 | 0 |
| `encantaría conocer` | 524 | 524 | 0 |
| `tu proyecto` | 311 | 312 | +1 |

Sin sesgo sistemático, así que los ajustes de abajo valen al píxel. (Ojo: el
`≈8 % más ancha` que menciona `FinalCTA.tsx` no es un sesgo de medida — sale de
comparar el **ancho del nodo** de Figma con el del texto renderizado, que son
cosas distintas.)

---

## Estructura

La página deja de ser un formulario de mensaje y pasa a ser una **reserva de
llamada**. De arriba abajo:

```
01 · Barra superior   logo · miga «Hogar › Contacto» · pastilla de idioma
02 · Cabecera         pastilla «RESERVAR LLAMADA» · H1 · subtítulo
03 · Tarjeta          exterior: ventajas + datos de contacto
                      interior: calendario, franjas, formulario y «Reservar llamada»
04 · Cierre           «Hablemos.» + navegación   → ya existe (`FinalCTA`)
05 · Pie              logo, promesa, redes, legales → ya existe (`Footer`)
```

El bloque oscuro termina en **y 1269**; de ahí abajo es `#f0f2ff` (`paper`).

---

## 01 · Barra superior

Misma caja que el `Navbar` del resto del sitio: alto **116**, márgenes
laterales del **12,5 %** (240 px a 1920).

| Qué | Medida |
| --- | --- |
| Isotipo | x 240, centrado en la barra |
| Miga «Hogar › Contacto» | empieza en x 385, color `#96a3c5` |
| Pastilla de idioma | x 1582…1680 (**98×46**), y 35…81, degradado `#182456` → `#050b21` |

La pastilla coincide al píxel con la que ya pinta `Navbar` («Figma: 98×46,
radio 20, degradado #182557→#050b21»). **No hay enlaces de navegación ni botón
de «Iniciar sesion»** — la barra de esta pantalla es logo + miga + idioma.

## 02 · Cabecera

| Qué | Medida |
| --- | --- |
| Pastilla «RESERVAR LLAMADA» | x 880…1040 (**160×28**), y 160…188, radio pill |
| — relleno | `#141728` = exactamente `rgba(213,218,233,.08)` sobre `void` → es la clase `.eyebrow` |
| — borde | `#343d5d` (0,3 px `#94b2fc`), texto `#b8f21e` (`neon`) |
| H1 línea 1 | y 221…260, x 701…1217 |
| H1 línea 2 | y 273…324, x 809…1108 |
| H1 tipografía | **Montserrat 700 · 52 · tracking 0**, interlínea ≈ **54** |
| H1 color | «Obten una » en `#ffffff`, «llamada estrategica» en `#1a4dff` (`electric`) |
| Subtítulo | y 369…387 y 397…415 (paso **28**), x 641…1272 |
| Subtítulo tipografía | **Montserrat 400 · 20/28 · tracking 0**, color `#c7d7ff` (`cloud`) |

Tanto la pastilla como el subtítulo salen clavados de las clases que ya
existen: `.eyebrow` y `.sub-section` (20/28, `cloud`). El H1 es el tamaño de
`.h2-section` (52).

## 03 · Tarjeta exterior

| Qué | Medida |
| --- | --- |
| Caja | x **364**, y **472**, **1192 × 654**, radio **30** |
| Borde | 1 px, `#1d306b` arriba, `#192d6b` en el lateral |
| Relleno | brillo elíptico: máximo `#081546` hacia (450, 760), apagándose a `#030920` en las esquinas |
| Relleno interior | 32 px por todos los lados |

### Viñetas (columna izquierda)

Tres líneas con paso **27**, check `#b8f21e` (`neon`) y texto `#ffffff`.

| Línea | Banda | Tinta |
| --- | --- | --- |
| 30 minutos de tu tiempo | y 541…554 | x 439…616 (178) |
| Recomendaciones personalizadas | y 568…581 | x 440…683 (244) |
| Sin compromiso | y 595…608 | x 439…555 (117) |

Check: x 409…426, y 539…551. Texto a x 439 → **20 px** de separación.
Tipografía: **Montserrat 600 · 14 · tracking 0**.

### Datos de contacto (columna izquierda, abajo)

Tres bloques con paso **86**. Cada uno: azulejo de icono **62×62** en x 393,
radio ≈ 16, relleno `#0d1e75`, icono `#1a4dff`; texto a x 475 (**20 px** de
separación).

| Bloque | Azulejo | Etiqueta | Valor |
| --- | --- | --- | --- |
| Correo Electronico | y 830…892 | y 845…856 | y 864…880 |
| Telefono | y 916…978 | y 931…942 | y 951…963 |
| Ubicacion | y 1002…1064 | y 1017…1028 | y 1037…1049 |

- Etiqueta: **Montserrat 400 · 15 · tracking 0**, color `#94b2fc` (`pulse`).
- Valor: **Montserrat 500 · 17 · tracking 0**, color `#ffffff`.
- De la etiqueta al valor, **+19** de paso.

## 03b · Tarjeta interior (la reserva)

| Qué | Medida |
| --- | --- |
| Caja | x **732**, y **504**, **792 × 590**, radio **20** |
| Encaje | 32 px respecto al borde superior, derecho e inferior de la exterior |
| Borde | 1 px azul, de `#1339bb` arriba a `#1743de` abajo |
| Relleno | `linear-gradient(180deg, #101837 0%, #050b21 65%)` (`navy` → `abyss`) |
| Relleno interior | 28 px a la izquierda |

### Columna izquierda de la tarjeta interior

| Qué | Medida | Tipografía |
| --- | --- | --- |
| «Reserva una llamada» | y 541…560, x 766…1030 | **600 · 25**, paso **28**, `#ffffff` |
| «con nuestro equipo» | y 569…593, x 765…1013 | ídem |
| Párrafo azul (3 líneas) | y 609…656, x 759…1032, paso **18** | **400 · 15**, `#1a4dff` |
| «Selecciona una fecha» | y 736…745, x 761…890 | **600 · 12**, `#ffffff` |
| Calendario | x **762…1068** (306), y **767…1063** (297) | relleno `#081248` |

### Columna derecha de la tarjeta interior

| Qué | Medida |
| --- | --- |
| «Horario disponible» | y ≈ 541, x 1115 |
| Franjas | rejilla de 3 columnas, cada una **125 × 40**, hueco **8**; bloque x 1115…1505 (390) |
| — seleccionada | relleno `#1a4dff`, texto blanco |
| — normal | relleno `#1f2642`, texto `#d2d4d9` |
| «Tu informacion» | y ≈ 694 |
| Campos | Nombre + Telefono en dos columnas; Correo, Plan y objetivos a ancho completo |
| Botón «Reservar llamada» | y **985…1039** (alto **54**), relleno `#1a4dff` |
| Nota «Sin spam…» | debajo del botón, cursiva |

## 04 · Cierre y 05 · Pie

Son los componentes que ya existen y que este marco reutiliza sin cambios:
`FinalCTA` (fondo `paper`, titular 600+400 60/65 `-0.05em`) y `Footer`. La
calibración de arriba lo confirma al píxel.

---

## Comprobación: la web contra el marco

La página se captura a 1920 con `node scripts/figma/shot-home.mjs
http://localhost:3000/contacto --out docs/figma/contacto-1643/shots` y se mide
con las mismas órdenes. Estado al cerrar el trabajo (tinta, no cajas):

| Elemento | Figma | Web | Δ |
| --- | --- | --- | --- |
| Pastilla de cabecera | y160…187 · 160 | y160…187 · 164 | +4 de ancho |
| H1 línea 1 | y221…260 · x701…1217 (517) | y220…260 · x701…1217 (517) | **exacto** |
| H1 línea 2 | y273…324 · x809…1108 (300) | y273…324 · x809…1108 (300) | **exacto** |
| Subtítulo | y369…387 · x641…1272 (632) | y369…387 · x643…1275 (633) | +2 de x |
| Tarjeta exterior | x364 y472 · 1192×654 | x364 y472 · 1192×657 | +3 de alto |
| Viñetas | y539 · paso 28 · x410 | y538 · paso 28 · x409 | 1 px |
| Azulejos de contacto | x393 y830 · 62×62 · paso 86 | x393 y831 · 62×62 · paso 86 | 1 px |
| Tarjeta interior | x732 y504 · 792×590 | x732 y504 · 792×591 | 1 px |
| Título interior | y541…560 · 265 | y541…560 · 265 | **exacto** |
| Párrafo azul | y609 · paso 18 · 203 | y608 · paso 18 · 203 | 1 px |
| «Selecciona una fecha» | y736…745 · 130 | y736…745 · 131 | **exacto** |
| Calendario | y767 · 306×297 | y767 · 306×298 | 1 px |
| — cabecera de mes | y787…815 | y786…814 | 1 px |
| — días de la semana | y840…849 | y840…850 | **exacto** |
| — primera fila | y869 · paso 41 | y868 · paso 41 | 1 px |
| «Horario disponible» | y542…554 · 113 | y542…554 · 112 | **exacto** |
| Franjas | y567 y y618 · 3×125, hueco 8/9 | y567 y y618 · ídem | **exacto** |
| «Tu información» | y690…699 · 94 | y690…699 · 93 | **exacto** |
| Campos | 715 · 766 · 818 · 870 | 715 · 766 · 818 · 870 | **exacto** |
| Botón | y985…1039 · 391×54 | y986…1040 · 391×54 | 1 px |

## Lo que no se ha copiado del marco, y por qué

1. **El logo de la barra.** En este marco el imago cae en y 35…89, es decir 4 px
   por debajo del centro de la barra, mientras la pastilla de idioma sí está
   centrada (y 35…81). El `Navbar` es el mismo en todo el sitio y está cuadrado
   contra el marco del home; moverlo 4 px aquí lo movería en todas las páginas.
   Se deja centrado.
2. **La pastilla «RESERVAR LLAMADA» mide 164 y no 160.** La clase `.eyebrow` es
   compartida (home, precios, calculadora) y su relleno lateral es de 10; con 8
   saldrían los 160 del marco. Cambiarla movería las pastillas de las otras
   páginas, que sí están cuadradas.
3. **La nota «Sin spam» va en 12 px y no en 10.** `fs-u-*` tiene un suelo de
   12 px a propósito, por legibilidad. Se respeta el suelo y se fija la caja de
   línea en los 15 del marco para que no desplace nada.
4. **El título y el párrafo de la tarjeta interior se alinean entre sí.** En el
   marco el párrafo empieza en x 759 y el título en x 766: seis píxeles de
   desalineación entre dos nodos que deberían compartir margen. Aquí los dos
   cuelgan de x 762.
5. **Los datos de contacto son los reales, no los del marco.** El marco publica
   `asenix@asenix.com` (el dominio real es `.es`) y `+91 76810 12153`, que es un
   número de India. Se publican el correo `.es` y el teléfono de España. Los
   tres bloques, su orden y sus posiciones sí son los del marco: azulejos de
   62×62 en x 393, en y 830, 916 y 1002.
6. **El enlace «¿Prefieres escribirnos sin reservar?» va fuera de la tarjeta.**
   No está en el marco; dentro, la tarjeta dejaría de medir 654 de alto.
7. **Ninguna franja viene preseleccionada.** El marco enseña las 9:00 elegidas;
   preseleccionar una hora que el visitante no ha mirado invita a reservar sin
   querer. El botón se activa al elegir.
8. **La rejilla de horas se pagina.** El marco dibuja seis pastillas en 3×2,
   pero un día de 9 a 19 tiene veinte huecos: enseñar solo los seis primeros
   deja media tarde sin reservar. La rejilla conserva su geometría exacta y se
   pagina de seis en seis con dos flechas que caben en el hueco que el marco
   deja a la derecha del rótulo «Horario disponible»; con seis huecos o menos
   no se pintan, así que **en reposo la pantalla es la del Figma**. Y como la
   hora elegida puede quedar en otra página, el botón la dice
   («Reservar llamada · 18:30») en cuanto hay uno elegido — sin elegir, el
   texto es el del marco, tal cual.
9. **El relleno de la tarjeta exterior es una aproximación.** El marco tiene un
   brillo elíptico cuyo máximo (`#081546`) cae hacia (450, 760) y que se apaga
   antes por arriba que por abajo; un `radial-gradient` simétrico no reproduce
   esa asimetría. El actual queda dentro de ±6 por canal en los cinco puntos de
   muestra, sobre un fondo casi negro.

## Lo que la pantalla hace

La reserva es real y va contra ng-agent, no es una maqueta:

- `GET /api/booking/availability?from=&to=` — huecos libres del mes agrupados
  por día local. Alimenta a la vez qué días se encienden en la rejilla y qué
  franjas salen del día elegido.
- `POST /api/booking` — revalida el hueco con `isValidSlot` y crea la reserva
  con `registerBooking`: misma tabla, mismo Google Calendar y mismo aviso al
  dueño que las reservas del agente. Si el hueco se ocupó entre medias responde
  `409` y la pantalla pide otro. El plan y los objetivos, que no caben en la
  reserva, van al CRM como lead de la misma conversación.

Los dos viven en `ng-agent/src/booking-form.ts`.

El formulario de mensaje que ocupaba `/contacto` sigue vivo en
**`/contacto/mensaje`**, sin tocar.
