# Auditoría /precios · Figma «Asenix Planes» (690:14) vs código

Leyenda Estado: `ok` · `desvío corregido` · `n/a` · `pendiente externo`.
Fuente: `spec.md` (bandas de `sections.json`) y `tokens.md`. Todo lo de abajo está aplicado en
`src/components/pricing/PricingPage.tsx` con la unidad `--u` (medidas del Figma a 1920, 0,75 a 1440).

## 00 · Global

| Propiedad | Figma | Código | Estado |
|---|---|---|---|
| Tema | Página clara: fondo blanco, textos negros / #0b1226 | `bg-white text-black`, `Navbar tone="light"` | desvío corregido (antes #eef0f6) |
| Familia | Montserrat 400–800 (Roboto/Inter solo en un botón M3 sin uso) | Montserrat | ok |
| Pastilla de sección | 35 px, borde en degradado #1a4dff→#102e99, texto 700 14 tracking .25em | `.eyebrow.eyebrow-light` (caja blanca) y `.eyebrow-white` sobre la tarjeta azul | desvío corregido |
| Cabeceras H2 | 700 52/52 negro, sub 400 18/27 negro | `SectionHead` local | desvío corregido |
| `max-w-u-*` en móvil | — | ahora con suelo del 60 % (afecta a todas las páginas: los textos ya no se estrechaban a 185 px a 375) | desvío corregido |

## 01 · Header → `Navbar tone="light"`

| Propiedad | Figma | Código | Estado |
|---|---|---|---|
| Enlaces | 500 18 negro | `text-black`, 500 | desvío corregido |
| Botón | 128×41 radio 10 relleno #dfe2ea, texto negro | `h-u-41 rounded-u-10 bg-[#dfe2ea]` | desvío corregido |
| «Iniciar sesión» (borde degradado) | 128×41 | n/a — no hay área de cliente todavía | n/a |

## 02 · Cabecera

| Propiedad | Figma | Código | Estado |
|---|---|---|---|
| Fondo | degradado blanco → rgba(240,242,245,0), 826 alto | idem | ok |
| H1 | 700 52/54 #0b1226, 946 ancho | `fs-u-52 lh-u-54 max-w-u-946 text-ink` | ok |
| Texto | 400 18/22 negro con tramos 600 (contado, 3 plazos, 0 € de entrada) | `Rich` sobre `kit.body` | ok |
| Botón | 337×70 radio 25 #101a3e, texto 500 20 #ecefff «Comenzar gratis por 30 días» | `h-u-70 min-w-u-337 rounded-u-25 bg-space fs-u-20 text-frost`; copy: «Empezar con el diagnóstico gratis» (no existe una prueba de 30 días; el Diagnóstico es lo que es gratis) | ok (copy adaptado) |
| Etiqueta «Funcionando en 7 días» | 206×33 radio 25 #1a4dff 600 14 #eef2ff, asomando sobre la 1.ª tarjeta | idem, `absolute` sobre la tarjeta Starter | ok |

## 03 · Planes

| Propiedad | Figma | Código | Estado |
|---|---|---|---|
| Tarjeta | 377×1169 radio 35 blanco, sombra 0 0 45 10 rgba(16,26,62,.2) | `rounded-u-35 shadow-[0_0_45px_10px_rgba(16,26,62,0.2)]`, alto según contenido | ok |
| Cabecera | 164 alto: estrella 30 + nombre 700 30 + para quién 400 15/18 (298) | `min-h-u-164`, `PlanStar size-u-30`, `fs-u-30`, `fs-u-15 lh-u-18 max-w-u-298` | ok |
| Panel inferior | Arranque #3b67ff→#29459f blanco; resto #d5dae9→#fff 62 % | idem por `plan.star` | ok |
| Precio | 700 48 + «MES · SERVICIO GESTIONADO» 500 12 mayúsculas .07em | `fs-u-48`, `fs-u-12 uppercase tracking-[0.07em]` | ok |
| Puesta en marcha | 800 18 (lima / azul) + 500 «de puesta en marcha»; caja blanca 317×69 radio 5 con texto 500 14 azul | idem (`rounded-u-5`, «0 € de entrada» en negro) | ok |
| Features | 400 14/17 con check 14×11 (lima / azul / #101a3e) | `fs-u-14 lh-u-17`, `Check size-u-14` | ok |
| Cuotas | pastillas 30 alto radio 25 #101a3e texto 12 blanco | `h-u-30 rounded-u-25 bg-space fs-u-12` | ok |
| CTA | 226×57 radio 25 azul 600 16 blanco (blanco sobre Arranque) | `h-u-57 w-u-226 rounded-u-25` | ok |
| Enlace | 500 20 negro + azul | `fs-u-20` | ok |

## 04 · Banda Diagnóstico

| Propiedad | Figma | Código | Estado |
|---|---|---|---|
| Banda | 1268×220 radio 25 #d5dae9 | `max-w-u-1268 rounded-u-25 bg-[#d5dae9]` | ok |
| Precio | «490 €» 600 38 azul + «Diagnóstico de IA» 15 | «0 €» — decisión de negocio del 25/08 (Diagnóstico gratis); mismas medidas | ok (dato distinto a propósito) |
| Botón | «Contactar» 183×58 radio 50 azul borde #94b2fc | `h-u-58 min-w-u-183 rounded-full border-pulse bg-electric` | ok |
| Nota «Antes de mirar precios» | no está en el Figma | tarjeta blanca con borde en degradado, mismo lenguaje que los módulos; la nota del agente de voz «en pruebas» se retiró (ya está disponible) | añadido |

## 05 · Comparativa

| Propiedad | Figma | Código | Estado |
|---|---|---|---|
| Tarjeta | 1440×1128 radio 35 rgba(255,255,255,.5) borde 1,3 #9babd4→#c7d7ff sombra 0 0 20 rgba(0,0,0,.2) | `ring-conic --ring-w 1.3px`, `rounded-u-35 bg-white/50` | ok |
| Cabecera | 103 alto, 600/700 24 negro; cuerpo #fff→#ecefff 40 % | `pt-u-41 pb-u-32 fs-u-24`, `tbody` con el degradado | ok |
| Filas | etiquetas 700 16/45 con cuadradito 11 px; celdas 400/700 16 centradas; columna Arranque rgba(199,215,255,.21) | `h-u-45`, `size-u-11 border-[1.3px]`, `bg-cloud/20` | ok |
| Checks | círculos 24 lima (Arranque) / #101a3e; guiones «-» | `CellValue` | ok |

## 06 · Módulos

| Propiedad | Figma | Código | Estado |
|---|---|---|---|
| Fondo | #f4f6ff → rgba(213,218,233,.74) | idem | ok |
| Tarjeta | 459×244 radio 25 blanca, borde #94b2fc→#c7d7ff, sombra 0 0 15 rgba(0,0,0,.2); gaps 32 | `min-h-u-244 rounded-u-25 ring-conic`, `gap-u-32` | ok |
| Icono | 57×57 radio 15 #1a4dff→#1036ba arriba a la derecha; la descripción empieza a 98 px, por debajo del icono | idem, glifos lucide (el Figma no tiene SVG propios); el título reserva `min-h-u-57 pr-u-70` para que el texto no pise el icono | ok |
| Textos | título 700 22/24; desc 400 15/17 (388); precio 600 25/30 negro/azul; flecha #556a9e | idem | ok |

## 07 · Formas de pago

| Propiedad | Figma | Código | Estado |
|---|---|---|---|
| H2 / sub | 700 52/50 #0b1226 (950) · 400 18/27 | `SectionHead` | ok |
| Pastillas | 4 × 295×92 radio 47 #d5dae9 borde azul; título 700 30 azul + etiqueta 500 16; líneas de 73 px azules entre ellas | `h-u-92 max-w-u-295 rounded-full border-electric`, líneas `w-u-73` en ≥ xl | ok |
| Orden | Sin entrada (Recomendado) · Contado · Fraccionado · Lo mismo | `PAY_ORDER` | ok |
| Explicaciones | 600 16/21 las dos primeras, 400 las otras; pie 700 #030617 | idem | ok |
| Tarjeta ilustración 336×303 (azul, a la izquierda) | sin contenido en el Figma | no se monta hasta que la diseñadora pase la ilustración | pendiente externo |

## 08 · Dudas razonables

| Propiedad | Figma | Código | Estado |
|---|---|---|---|
| Filas | 704×80 radio 25 rgba(255,255,255,.5) borde 1,3 en degradado; pregunta 700 16/23; «+» 500 42 azul | `details` con `ring-conic`, `max-w-u-704`, `fs-u-42` | ok |

## 09 · CTA final

| Propiedad | Figma | Código | Estado |
|---|---|---|---|
| Tarjeta | 1197×460 radio 35 #3b67ff→#29459f | idem | ok |
| Pastilla | borde y texto blancos «//SIGUIENTE PASO» | `.eyebrow-white` | ok |
| Título / sub | 700 40/40 blanco (766) · 400 18/23 blanco (772) | idem | ok |
| Botón | «Reservar llamada» 223×69 radio 50 blanco borde #94b2fc texto 600 15 azul; nota 400 14 #1cfcb9 | idem + segundo botón fantasma a la calculadora | ok |

## 10 · Hablemos y pie

Comparten `FinalCTA` y `Footer` con `tone="dark"` (fondo #060e29): se mantiene la versión del home.
