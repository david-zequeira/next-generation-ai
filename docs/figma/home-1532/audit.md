# Auditoría Home · Figma 1532:2424 vs código · 14 sep 2026 · rama figma/home-1532

Leyenda Estado: `ok` · `desvío` · `n/a` · `pendiente` (depende de la diseñadora).

**Estado (14 sep 2026):** todas las fases del plan `plans/01-home-pixel-perfect-figma-1532.md` aplicadas
en la rama `figma/home-1532`. Valores del Figma en px **a 1920 de ancho** (el marco mide 1920 × 11618);
el código los aplica como `N*var(--u)` con suelo para móvil, igual que en `docs/figma/home/audit.md`.
Medidas tomadas con `getBoundingClientRect` a viewport 1920×1080. Lint, `tsc --noEmit` y `next build` limpios.

## Decisiones

| # | Tema | Resolución |
|---|---|---|
| D1 | Plan destacado | **Core** sigue destacado (commit `c1dfe2b`); nombres y precios vienen de `src/i18n/pricing.ts`. Solo cambian estilos. |
| D2 | Fondo de «Cómo trabajamos» | La galaxia y las estrellas animadas (`Ecosystem.tsx`) se **conservan**; el Figma las omite pero es animación, no diseño. |
| D3 | «Hablemos» | La **aurora** animada se conserva; la **bruma estática** de la esquina se **elimina** (el Figma no tiene brumas). |
| D4 | Nota «projects@asenix.es · Respuesta en menos de 24 h» y «Ver todos los planes al detalle» | Se **conservan** (contenido útil) con el estilo más discreto posible (`text-ink/50`, `text-mist/70`). |
| D5 | Copys que difieren («Iniciar sesion», «Proyectos», «Ver casos exisitosos», «Ejemplo real de una cuenta») | **Copys intactos**: `git diff main -- src/i18n` vacío. Solo estilo. |
| D6 | Iconos vectoriales de la diseñadora | **Pendientes** de la diseñadora; se mantiene lucide (ver «Pendientes externos»). |

## Medido a 1920×1080

| Sección | Propiedad | Figma | Medido | Estado |
|---|---|---|---|---|
| Header | Alto de la barra | 116–120 | 117 | ok |
| Hero | Caja del titular (y) | 400 | 380 (glifos 390 vs 390) | ok |
| Hero | Botones (y) | 820 | 821 | ok |
| Hero | Botones (tamaño) | 213×72 | 221×72 y 208×72 | ok |
| Eyebrows | Pill alto · lima · sin «//» | 28 | 28 | ok |
| Eyebrows | Eyebrow → h2 | 35 | 35 | ok |
| Eyebrows | h2 → sub | 25 | 25 | ok |
| Servicios | Barra de tabs | 711×90 | 711×90 | ok |
| Servicios | Tarjeta (alto) | 752 | 752 | ok |
| Servicios | Panel | 645 | 645 | ok |
| Servicios | Botón oscuro | 194×53 · a la izquierda del enlace | 194×53 · izquierda | ok |
| Cómo trabajamos | Paso activo | azul + número lima | azul + número lima | ok |
| Cómo trabajamos | Paso izquierdo (x) | 421 | 421 | ok |
| Cómo trabajamos | Divisores brillantes | radial `#1a4dff → #030617` | igual | ok |
| Proceso | Subtítulo | 26/34 | 26/34 | ok |
| Proceso | Tarjetas | 524×573 en x 1065–1589 | 524×573 en x 1065–1589 | ok |
| Proceso | Tarjeta de voz | 522×573 | 573 de alto | ok |
| Proceso | Chat | sin «×» | sin «×» | ok |
| Tecnología | Pill · disco · texto | 55 · 37 · 16 | 55 · 37 · 16 | ok |
| Tecnología | Hueco entre filas | 29 | 29 | ok |
| Pruebas | Tarjeta | 826×365 | 826×366 | ok |
| Pruebas | Historia | `#779eff` | `#779eff` | ok |
| Calculadora | Tarjeta | 1196×568 | 1196×589 | ok (título del panel a 2 líneas por copy, D5) |
| Calculadora | CTA | 375×66 | 377×66 | ok |
| Planes | Tarjetas · hueco | 301×88 · 10 | 301×88 · 10 | ok |
| Planes | Estrella | 41 → 48 | 41 → 48 | ok |
| Hablemos | Titular | negro 60/65 · 3 líneas | negro 60/65 · 3 líneas | ok (max-w 610 en vez de 580 por métrica de Montserrat) |
| Hablemos | Botón | 213×66 | 213×66 | ok |
| Hablemos | Enlaces | 18 · subrayados | 18 · subrayados | ok |
| Pie | Tagline · legales · © | 16 · 14 · 14 en una línea | 16 · 14 · 14 en una línea | ok |
| Móvil | 375 sin desbordes | — | sin desbordes | ok |
| Consola | Errores | 0 | 0 | ok |

## Pendientes externos

- Iconos vectoriales de la diseñadora (D6): tiles de Servicios, iconos de las notas de Proceso, iconos de los sectores de voz. Hoy, lucide.
- Avatar lima del chat de Proceso.
- URLs de las redes del pie (`SOCIALS = []`; el estilo `size-u-41 bg-[#161614]` ya coincide).
- Pasos 1/4 escalonados en «Cómo trabajamos» (no está en el plan).
- Copys «Ver casos» y «Proyectos» (D5: no se toca copy).
