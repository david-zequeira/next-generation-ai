# Auditoría Home · Figma 541:168 vs código

Leyenda Estado: `ok` · `desvío` · `n/a` · `pendiente`.  
Cómo se rellena: la columna Figma se copia de `spec.md`/`tokens.md`; Código = archivo:línea del valor real; Acción = clase Tailwind o CSS destino.

## 00 · Global

| Propiedad | Figma | Código (archivo:línea) | Estado | Acción |
|---|---|---|---|---|
| Orden de secciones | 01 Header → 02 Hero → 03 El futuro → 04 Servicios → 05 Cómo trabajamos → 06 Proceso → 07 Tecnología → 08 Pruebas no promesas → 09 Demo → 10 Calculadora → 11 Planes 2026 → 12 Hablemos → 13 Footer | src/app/page.tsx:59-68 | pendiente | |
| Familia tipográfica | | src/app/globals.css:9-10 · src/app/layout.tsx:11-16 | pendiente | |
| Fondo de página | | src/app/globals.css:15 (--color-void) | pendiente | |
| Paleta (tokens.md → @theme) | | src/app/globals.css:13-27 | pendiente | |
| Radios / sombras repetidos | | (sin tokens hoy) | pendiente | |
| Botones (.btn-light/.btn-outline/.btn-blue) | | src/app/globals.css:280-309 · src/components/ui/MagneticButton.tsx:50-56 | pendiente | |
| Cabecera de sección (eyebrow + H2 + sub) | | src/app/globals.css:211-226, 272-277 | pendiente | |

## 01 · Header → `src/components/layout/Navbar.tsx`

| Propiedad | Figma | Código (archivo:línea) | Estado | Acción |
|---|---|---|---|---|
| Fondo / degradado | | | pendiente | |
| Padding vertical y ancho de contenido | | | pendiente | |
| Eyebrow: familia · peso · tamaño · tracking · color | | | pendiente | |
| Título: familia · peso · tamaño · interlínea · tracking · color | | | pendiente | |
| Subtítulo / texto: tamaño · interlínea · color | | | pendiente | |
| Tarjetas: radio · relleno · borde · sombra | | | pendiente | |
| Gaps entre elementos | | | pendiente | |
| Botón primario: relleno · texto · radio · alto · padding | | | pendiente | |
| Botón secundario | | | pendiente | |
| Iconos / logos (fills.json, svg/) | | | pendiente | |
| Brillos / efectos de luz | | | pendiente | |
| Elementos en Figma sin equivalente en código | | | pendiente | |
| Elementos en código sin equivalente en Figma | | | pendiente | |
| Nota de la diseñadora (Word) | | | pendiente | |

## 02 · Hero → `src/components/sections/Hero.tsx`

| Propiedad | Figma | Código (archivo:línea) | Estado | Acción |
|---|---|---|---|---|
| Fondo / degradado | | | pendiente | |
| Padding vertical y ancho de contenido | | | pendiente | |
| Eyebrow: familia · peso · tamaño · tracking · color | | | pendiente | |
| Título: familia · peso · tamaño · interlínea · tracking · color | | | pendiente | |
| Subtítulo / texto: tamaño · interlínea · color | | | pendiente | |
| Tarjetas: radio · relleno · borde · sombra | | | pendiente | |
| Gaps entre elementos | | | pendiente | |
| Botón primario: relleno · texto · radio · alto · padding | | | pendiente | |
| Botón secundario | | | pendiente | |
| Iconos / logos (fills.json, svg/) | | | pendiente | |
| Brillos / efectos de luz | | | pendiente | |
| Elementos en Figma sin equivalente en código | | | pendiente | |
| Elementos en código sin equivalente en Figma | | | pendiente | |
| Nota de la diseñadora (Word) | | | pendiente | |

## 03 · El futuro → `src/components/sections/Evolution.tsx`

| Propiedad | Figma | Código (archivo:línea) | Estado | Acción |
|---|---|---|---|---|
| Fondo / degradado | | | pendiente | |
| Padding vertical y ancho de contenido | | | pendiente | |
| Eyebrow: familia · peso · tamaño · tracking · color | | | pendiente | |
| Título: familia · peso · tamaño · interlínea · tracking · color | | | pendiente | |
| Subtítulo / texto: tamaño · interlínea · color | | | pendiente | |
| Tarjetas: radio · relleno · borde · sombra | | | pendiente | |
| Gaps entre elementos | | | pendiente | |
| Botón primario: relleno · texto · radio · alto · padding | | | pendiente | |
| Botón secundario | | | pendiente | |
| Iconos / logos (fills.json, svg/) | | | pendiente | |
| Brillos / efectos de luz | | | pendiente | |
| Elementos en Figma sin equivalente en código | | | pendiente | |
| Elementos en código sin equivalente en Figma | | | pendiente | |
| Nota de la diseñadora (Word) | | | pendiente | |

## 04 · Servicios → `src/components/sections/Services.tsx`

| Propiedad | Figma | Código (archivo:línea) | Estado | Acción |
|---|---|---|---|---|
| Fondo / degradado | | | pendiente | |
| Padding vertical y ancho de contenido | | | pendiente | |
| Eyebrow: familia · peso · tamaño · tracking · color | | | pendiente | |
| Título: familia · peso · tamaño · interlínea · tracking · color | | | pendiente | |
| Subtítulo / texto: tamaño · interlínea · color | | | pendiente | |
| Tarjetas: radio · relleno · borde · sombra | | | pendiente | |
| Gaps entre elementos | | | pendiente | |
| Botón primario: relleno · texto · radio · alto · padding | | | pendiente | |
| Botón secundario | | | pendiente | |
| Iconos / logos (fills.json, svg/) | | | pendiente | |
| Brillos / efectos de luz | | | pendiente | |
| Elementos en Figma sin equivalente en código | | | pendiente | |
| Elementos en código sin equivalente en Figma | | | pendiente | |
| Nota de la diseñadora (Word) | | | pendiente | |

## 05 · Cómo trabajamos → `src/components/sections/Ecosystem.tsx`

| Propiedad | Figma | Código (archivo:línea) | Estado | Acción |
|---|---|---|---|---|
| Fondo / degradado | | | pendiente | |
| Padding vertical y ancho de contenido | | | pendiente | |
| Eyebrow: familia · peso · tamaño · tracking · color | | | pendiente | |
| Título: familia · peso · tamaño · interlínea · tracking · color | | | pendiente | |
| Subtítulo / texto: tamaño · interlínea · color | | | pendiente | |
| Tarjetas: radio · relleno · borde · sombra | | | pendiente | |
| Gaps entre elementos | | | pendiente | |
| Botón primario: relleno · texto · radio · alto · padding | | | pendiente | |
| Botón secundario | | | pendiente | |
| Iconos / logos (fills.json, svg/) | | | pendiente | |
| Brillos / efectos de luz | | | pendiente | |
| Elementos en Figma sin equivalente en código | | | pendiente | |
| Elementos en código sin equivalente en Figma | | | pendiente | |
| Nota de la diseñadora (Word) | | | pendiente | |

## 06 · Proceso → `src/components/sections/Process.tsx`

| Propiedad | Figma | Código (archivo:línea) | Estado | Acción |
|---|---|---|---|---|
| Fondo / degradado | | | pendiente | |
| Padding vertical y ancho de contenido | | | pendiente | |
| Eyebrow: familia · peso · tamaño · tracking · color | | | pendiente | |
| Título: familia · peso · tamaño · interlínea · tracking · color | | | pendiente | |
| Subtítulo / texto: tamaño · interlínea · color | | | pendiente | |
| Tarjetas: radio · relleno · borde · sombra | | | pendiente | |
| Gaps entre elementos | | | pendiente | |
| Botón primario: relleno · texto · radio · alto · padding | | | pendiente | |
| Botón secundario | | | pendiente | |
| Iconos / logos (fills.json, svg/) | | | pendiente | |
| Brillos / efectos de luz | | | pendiente | |
| Elementos en Figma sin equivalente en código | | | pendiente | |
| Elementos en código sin equivalente en Figma | | | pendiente | |
| Nota de la diseñadora (Word) | | | pendiente | |

## 07 · Tecnología → `src/components/sections/Technology.tsx`

| Propiedad | Figma | Código (archivo:línea) | Estado | Acción |
|---|---|---|---|---|
| Fondo / degradado | | | pendiente | |
| Padding vertical y ancho de contenido | | | pendiente | |
| Eyebrow: familia · peso · tamaño · tracking · color | | | pendiente | |
| Título: familia · peso · tamaño · interlínea · tracking · color | | | pendiente | |
| Subtítulo / texto: tamaño · interlínea · color | | | pendiente | |
| Tarjetas: radio · relleno · borde · sombra | | | pendiente | |
| Gaps entre elementos | | | pendiente | |
| Botón primario: relleno · texto · radio · alto · padding | | | pendiente | |
| Botón secundario | | | pendiente | |
| Iconos / logos (fills.json, svg/) | | | pendiente | |
| Brillos / efectos de luz | | | pendiente | |
| Elementos en Figma sin equivalente en código | | | pendiente | |
| Elementos en código sin equivalente en Figma | | | pendiente | |
| Nota de la diseñadora (Word) | | | pendiente | |

## 08 · Pruebas no promesas → `src/components/sections/CaseStudies.tsx`

| Propiedad | Figma | Código (archivo:línea) | Estado | Acción |
|---|---|---|---|---|
| Fondo / degradado | | | pendiente | |
| Padding vertical y ancho de contenido | | | pendiente | |
| Eyebrow: familia · peso · tamaño · tracking · color | | | pendiente | |
| Título: familia · peso · tamaño · interlínea · tracking · color | | | pendiente | |
| Subtítulo / texto: tamaño · interlínea · color | | | pendiente | |
| Tarjetas: radio · relleno · borde · sombra | | | pendiente | |
| Gaps entre elementos | | | pendiente | |
| Botón primario: relleno · texto · radio · alto · padding | | | pendiente | |
| Botón secundario | | | pendiente | |
| Iconos / logos (fills.json, svg/) | | | pendiente | |
| Brillos / efectos de luz | | | pendiente | |
| Elementos en Figma sin equivalente en código | | | pendiente | |
| Elementos en código sin equivalente en Figma | | | pendiente | |
| Nota de la diseñadora (Word) | | | pendiente | |

## 09 · Demo → `(n/a — sin diseño todavía: no implementar)`

| Propiedad | Figma | Código (archivo:línea) | Estado | Acción |
|---|---|---|---|---|
| Fondo / degradado | | | pendiente | |
| Padding vertical y ancho de contenido | | | pendiente | |
| Eyebrow: familia · peso · tamaño · tracking · color | | | pendiente | |
| Título: familia · peso · tamaño · interlínea · tracking · color | | | pendiente | |
| Subtítulo / texto: tamaño · interlínea · color | | | pendiente | |
| Tarjetas: radio · relleno · borde · sombra | | | pendiente | |
| Gaps entre elementos | | | pendiente | |
| Botón primario: relleno · texto · radio · alto · padding | | | pendiente | |
| Botón secundario | | | pendiente | |
| Iconos / logos (fills.json, svg/) | | | pendiente | |
| Brillos / efectos de luz | | | pendiente | |
| Elementos en Figma sin equivalente en código | | | pendiente | |
| Elementos en código sin equivalente en Figma | | | pendiente | |
| Nota de la diseñadora (Word) | | | pendiente | |

## 10 · Calculadora → `src/components/sections/Roi.tsx`

| Propiedad | Figma | Código (archivo:línea) | Estado | Acción |
|---|---|---|---|---|
| Fondo / degradado | | | pendiente | |
| Padding vertical y ancho de contenido | | | pendiente | |
| Eyebrow: familia · peso · tamaño · tracking · color | | | pendiente | |
| Título: familia · peso · tamaño · interlínea · tracking · color | | | pendiente | |
| Subtítulo / texto: tamaño · interlínea · color | | | pendiente | |
| Tarjetas: radio · relleno · borde · sombra | | | pendiente | |
| Gaps entre elementos | | | pendiente | |
| Botón primario: relleno · texto · radio · alto · padding | | | pendiente | |
| Botón secundario | | | pendiente | |
| Iconos / logos (fills.json, svg/) | | | pendiente | |
| Brillos / efectos de luz | | | pendiente | |
| Elementos en Figma sin equivalente en código | | | pendiente | |
| Elementos en código sin equivalente en Figma | | | pendiente | |
| Nota de la diseñadora (Word) | | | pendiente | |

## 11 · Planes 2026 → `src/components/sections/Plans.tsx`

| Propiedad | Figma | Código (archivo:línea) | Estado | Acción |
|---|---|---|---|---|
| Fondo / degradado | | | pendiente | |
| Padding vertical y ancho de contenido | | | pendiente | |
| Eyebrow: familia · peso · tamaño · tracking · color | | | pendiente | |
| Título: familia · peso · tamaño · interlínea · tracking · color | | | pendiente | |
| Subtítulo / texto: tamaño · interlínea · color | | | pendiente | |
| Tarjetas: radio · relleno · borde · sombra | | | pendiente | |
| Gaps entre elementos | | | pendiente | |
| Botón primario: relleno · texto · radio · alto · padding | | | pendiente | |
| Botón secundario | | | pendiente | |
| Iconos / logos (fills.json, svg/) | | | pendiente | |
| Brillos / efectos de luz | | | pendiente | |
| Elementos en Figma sin equivalente en código | | | pendiente | |
| Elementos en código sin equivalente en Figma | | | pendiente | |
| Nota de la diseñadora (Word) | | | pendiente | |

## 12 · Hablemos → `src/components/sections/FinalCTA.tsx`

| Propiedad | Figma | Código (archivo:línea) | Estado | Acción |
|---|---|---|---|---|
| Fondo / degradado | | | pendiente | |
| Padding vertical y ancho de contenido | | | pendiente | |
| Eyebrow: familia · peso · tamaño · tracking · color | | | pendiente | |
| Título: familia · peso · tamaño · interlínea · tracking · color | | | pendiente | |
| Subtítulo / texto: tamaño · interlínea · color | | | pendiente | |
| Tarjetas: radio · relleno · borde · sombra | | | pendiente | |
| Gaps entre elementos | | | pendiente | |
| Botón primario: relleno · texto · radio · alto · padding | | | pendiente | |
| Botón secundario | | | pendiente | |
| Iconos / logos (fills.json, svg/) | | | pendiente | |
| Brillos / efectos de luz | | | pendiente | |
| Elementos en Figma sin equivalente en código | | | pendiente | |
| Elementos en código sin equivalente en Figma | | | pendiente | |
| Nota de la diseñadora (Word) | | | pendiente | |

## 13 · Footer → `src/components/layout/Footer.tsx`

| Propiedad | Figma | Código (archivo:línea) | Estado | Acción |
|---|---|---|---|---|
| Fondo / degradado | | | pendiente | |
| Padding vertical y ancho de contenido | | | pendiente | |
| Eyebrow: familia · peso · tamaño · tracking · color | | | pendiente | |
| Título: familia · peso · tamaño · interlínea · tracking · color | | | pendiente | |
| Subtítulo / texto: tamaño · interlínea · color | | | pendiente | |
| Tarjetas: radio · relleno · borde · sombra | | | pendiente | |
| Gaps entre elementos | | | pendiente | |
| Botón primario: relleno · texto · radio · alto · padding | | | pendiente | |
| Botón secundario | | | pendiente | |
| Iconos / logos (fills.json, svg/) | | | pendiente | |
| Brillos / efectos de luz | | | pendiente | |
| Elementos en Figma sin equivalente en código | | | pendiente | |
| Elementos en código sin equivalente en Figma | | | pendiente | |
| Nota de la diseñadora (Word) | | | pendiente | |
