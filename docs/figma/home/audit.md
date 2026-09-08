# Auditoría Home · Figma 541:168 vs código

Leyenda Estado: `ok` · `desvío` · `n/a` · `hecho`. Valores del Figma en px **a 1920 de ancho**
(el marco mide 1920 y la columna de contenido 1440, de x=240 a x=1680).

## Escala

Las cuatro quejas de la diseñadora que hablan de tamaño (títulos grandes, menú bajo, imago pequeño,
tecnologías grandes) cuadran si la web se mira a 1440 px y el diseño se lee a escala 0,75
(1440/1920). Decisión: cada medida del Figma se aplica como `N*var(--u)` con
`--u: min(1px, 100vw/1920)` → exacta a 1920, 0,75× a 1440, y con un mínimo para móvil
(`max(Mpx, N*var(--u))`). Definido en `src/app/globals.css`.

## 00 · Global

| Propiedad | Figma | Código (archivo:línea) | Estado | Acción |
|---|---|---|---|---|
| Orden de secciones | Header → Hero → El futuro → Servicios → Cómo trabajamos → Proceso → Tecnología → Pruebas → Demo → Calculadora → Planes → Hablemos → Footer | `src/app/page.tsx:58-69` | ok | igual (Demo no existe: n/a) |
| Familia | Montserrat (Inter solo en el glifo ◇ de planes) | `src/app/layout.tsx:11-16` | ok | — |
| Fondo de página | `#030617` | `globals.css` `--color-void` | ok | — |
| Texto secundario | `#c7d7ff` (35 usos; a veces al 80 %) | `--color-mist #9aa5c0` (no existe #c7d7ff) | desvío | nuevo token `--color-cloud: #c7d7ff`; usarlo en subtítulos y descripciones |
| Texto principal | `#ffffff` / `#ecefff` / `#f1f3fe` | `frost #eceFFF`, `paper #f1f3fe` | ok | — |
| Verde de enlaces «→» | `#1cfcb9` («Explorar Asenix Copilot →», «Ver casos →», «Habla con nuestro equipo →») | `neon #b8f21e` en enlaces | desvío | `--color-mint: #1cfcb9` (antes #7de3c3) y enlaces en `text-mint` |
| Cian de degradados | `#38d4ff` (persona de Pruebas) | no existe | desvío | `--color-cyan: #38d4ff` |
| Tarjetas oscuras | `#101a3e`, `#101837`, `#050b21`, `#0a1540` | `space #0b1435`, `abyss #050a1f` | desvío | `--color-space: #101a3e`, `--color-abyss: #050b21`, nuevo `--color-navy: #101837`, `--color-panel: #0a1540` |
| Línea divisoria entre secciones | `0.5px #6994ff` (Vector 8/20/17/30) | `--color-line rgba(148,178,252,.18)` | desvío | `--color-line: rgba(105,148,255,.6)` y `border-t` de 1px |
| Eyebrow | pill 35 px alto · radio 50 · borde 1px `#1a4dff` (o degradado `#1a4dff→#102e99`) · brillo radial azul difuminado dentro · texto Montserrat **700** 14px · tracking 0.25em · UPPER · `#1a4dff` · precedido de `//` | `.eyebrow` `globals.css:211-226`: .78rem 400 .34em sin pill | desvío | `.eyebrow` = pill con borde + brillo; 14u/700/0.25em |
| H2 de sección | Montserrat 700 · 50–52px / 54 · tracking 0 · centrado · `#fff`/`#f1f3fe` | `TextReveal` + `.display` (700, -0.02em, lh 1.06) `text-[clamp(2rem,4.6vw,3.4rem)]` | desvío | `.h2-section`: 52u, lh 1.04, tracking 0 |
| Subtítulo de sección | Montserrat 400 · 20px / 28 (Servicios, Hero) · 18/28 (Tecnología, Planes) · 24/32 (Proceso) · `#c7d7ff` · ancho ≤ 952 | `text-base md:text-lg text-mist` | desvío | `.sub-section`: 20u/28u `text-cloud` max-w 952u |
| Botón primario | 244×72 · radio 47 (full) · fondo `#c7d7ff` · texto 600 20px `#010104` · icono flecha `#1a4dff` grosor 4 | `.btn-light` degradado blanco→lavanda, `min-h-[54px] text-[15px]` | desvío | `.btn-light` = fondo `#c7d7ff`, texto `#010104`; alto 72u, texto 20u, px 52u |
| Botón secundario | 243×72 · radio 50 · degradado 180° `#101837→#050b21` · borde 1px `#1a4dff` · brillo azul difuminado (blur 7) dentro · texto 600 20px `#ecefff` · icono play `#1a4dff` | `.btn-outline` degradado `#0a1440→#111d58` borde `pulse` | desvío | `.btn-outline` con esos valores + brillo `::before` |
| Botón pequeño («Cotizar proyecto», «Hacer la cuenta») | 176×49 / 375×62 · radio 16 / 47 · fondo `#c7d7ff` · texto 600 15px `#030617` · sombra `0 4px 4px rgba(16,26,62,.25)` | `btn-light h-12 text-sm` | desvío | variante `.btn-light-sm` |
| Tag pill («AI Concierge», «Diseño Web» del proceso) | 243×72 · radio 30 · degradado `#101837→#050b21` · borde 1px `#1a4dff` · brillo · texto 600 18px `#ecefff` | `.btn-blue` (azul sólido) `px-6 py-2.5 text-sm` | desvío | `.tag-pill` |
| Brillo azul dentro de pills/tarjetas | vector radial `#1a4dff → rgba(46,107,255,.12) 81% → 0` con `filter: blur(7.3px)` | brumas varias `bg-electric/[0.09] blur-[140px]` | desvío | utilidad `.glow-inset` (radial + blur 7px) reutilizable |

## 01 · Header → `src/components/layout/Navbar.tsx`

| Propiedad | Figma | Código | Estado | Acción |
|---|---|---|---|---|
| Alto de la barra | 120 (contenido centrado en y≈58) | `h-[76px]` `:87` | desvío | `h-[max(64px,116*var(--u))]` |
| Imago | vector 69×55 `#1a4dff` a x=240 | `isotipo.png h-9 md:h-10` `:91` (imagen azul, ok) | desvío | `h-[max(36px,55*var(--u))]` |
| Menú | centrado en x=960 · Montserrat 600 15px `#ffffff` · «Plataforma · Servicios · Ecosistema · Proyectos · Proceso · Calculadora · Precios» · hueco ≈ 50px | `ul` hijo central de `justify-between` `:94`; `text-[14px] font-medium text-frost/90` `:59-62` | desvío | `ul` absoluto centrado; 15u/600/white; `gap` 24u |
| Botón idioma | 98×46 · radio 20 · degradado `#182557→#050b21` · texto 500 20px white + globo | `h-10 rounded-full glass text-[13px]` `:42-57` | desvío | `h-[46u] rounded-[20u] bg-gradient` texto 20u/500 |
| CTA | 165×46 · radio 20 · fondo `#ffffff` · texto 500 15px `#000` («Iniciar sesion» en Figma; se mantiene el copy «Reserva una llamada») | `btn-light h-10 rounded-full text-[13px] font-semibold` `:122` | desvío | `h-[46u] rounded-[20u] bg-white text-black text-[15u] font-medium` |
| Círculos de desplazamiento | no existen | `SectionRail` | hecho | eliminado |

## 02 · Hero → `src/components/sections/Hero.tsx`

| Propiedad | Figma | Código | Estado | Acción |
|---|---|---|---|---|
| Fondo | imagen planeta + `rgba(0,0,0,.5)` | vídeo `opacity-40` + AICore | ok (equivalente) | — |
| Título | 700 · 52/54 · tracking 0 · white · ancho 764 | `text-[clamp(2.3rem,5.4vw,4.3rem)]` `.display` (-0.02em) `:161,167` | desvío | `text-[max(2rem,52*var(--u))] leading-[1.04] tracking-normal` |
| Subtítulo | 400 · 20/28 · `#c7d7ff` · ancho 952 | `text-base md:text-[1.2rem] text-frost/85 max-w-2xl` `:175` | desvío | `.sub-section` |
| Botones | 72 alto, ver Global | `MagneticButton` 54 | desvío | heredan de `.btn-light/.btn-outline` |
| Separación título→sub→botones | 122 / 180 | `mt-7` / `mt-14 md:mt-24` | desvío | `mt-[32u]` / `mt-[120u]` aprox |
| «Desliza» | no existe | — | hecho | eliminado |
| Widget flotante | 176×176 abajo-derecha | `VoiceWidget` | ok | — |

## 03 · El futuro → `src/components/sections/Evolution.tsx`

| Propiedad | Figma | Código | Estado | Acción |
|---|---|---|---|---|
| Etapas | **3**: «Diseñamos la experiencia» / «Experiencias digitales que elevan tu marca.» · «Automatizamos el sistema» / «Convierte visitantes en clientes.» · «Construimos la inteligencia» / «Agentes AI las 24 horas» (marcos 541:201, 1298:4363, 1298:5622) | 4 etapas + panel de cierre («Diseñamos la experiencia» era el cierre) | desvío | `evolution.stages` = las 3 del Figma (ES/EN); sin panel de cierre; sin caso especial `i === 2` |
| Numeración | no | `01 / 04` | hecho | eliminado |
| Título de etapa | 600 · 85px / 1 · tracking -0.05em · `#1a4dff` · centrado | `display text-white text-[clamp(2.4rem,6.5vw,5.5rem)]` | desvío | `text-electric text-[max(2.4rem,85*var(--u))] font-semibold tracking-[-0.05em]` |
| Sub de etapa | 400 · 22–24 / 28 · white · ancho 1004 | `text-mist text-base md:text-lg` | desvío | `text-white text-[max(1rem,24*var(--u))]` |
| Eyebrow | pill «//EL FUTURO DE LOS NEGOCIOS» arriba (y=123) | `eyebrow eyebrow-muted` | desvío | `.eyebrow` pill normal (azul) |
| Fondo | degradado `#000 → transparente` sobre el vídeo/estrellas | estrellas + rejilla | ok | — |
| Placeholder gris 164×120 | `Rectangle 179 #d9d9d9` | — | n/a | es un hueco de la diseñadora, no se implementa |

## 04 · Servicios → `src/components/sections/Services.tsx`

| Propiedad | Figma | Código | Estado | Acción |
|---|---|---|---|---|
| Cabecera | eyebrow pill · H2 700 50/54 · sub 400 20/28 `#c7d7ff` 929 | inline | desvío | `SectionHeading` |
| Pestañas | contenedor 798×95 · radio 55 · borde 0.5px conic `#4977ff/#1a4dff/#6994ff` · sin fondo · activa 227×64 radio 50 **blanca** texto 600 18px `#000` · inactivas 600 18px white | `p-1.5 border-pulse/30 bg-gradient` · activa azul oscura `text-sm` | desvío | alto 95u, activa blanca, texto 18u |
| Tarjeta | 1440×752 · **radio 35 35 0 0** · degradado 180° `#101a3e→#1a3ba9` · borde 0.5px conic `#6994ff→#1a4dff→#6994ff` · sombra `0 0 150px rgba(26,77,255,.5)` | `card-navy rounded-[28px]` | desvío | `rounded-t-[35u] rounded-b-none`, degradado, sombra |
| h3 | 600 · 38/47 · white · ancho 569 | `text-[clamp(1.6rem,3vw,2.2rem)]` | desvío | 38u |
| Sub tarjeta | 300 · 20/28 · `#c7d7ff` | `text-mist` | desvío | `text-cloud font-light` 20u |
| Features | título 600 18/24 white · desc 400 15/22 white · check 24×24 círculo `#b8f21e` | `text-sm` / `text-[13px] text-mist` · `CheckCircle2 h-5` | desvío | 18u/15u, `text-white`, check 24u |
| Enlace | «Explorar Asenix Copilot →» 500 18px `#1cfcb9` | `text-sm text-neon` | desvío | `text-mint` 18u |
| Botón | «Cotizar proyecto» 176×49 radio 16 `#c7d7ff` 600 15 `#030617` sombra | `btn-light h-12 rounded-full text-sm` | desvío | `.btn-light-sm` |
| Tableta azul | 645×573 · radio 25 · degradado `#1a4dff 28%→#294296` · brillo radial blur 40 | `card-blue rounded-3xl` | desvío | valores |
| Dispositivo | 399×511 · radio 20 20 0 0 · degradado `#fff→#94b2fc 47%→#7a93d0` · borde 0.5 white · sombra `0 0 50px -13px rgba(255,255,255,.59)` · barra superior 74 alto `rgba(255,255,255,.5)` · cámara punto `#1a4dff` | `rounded-[26px] border-pulse/50 bg-[#0b1435]/85` | desvío | rehacer marco del dispositivo (claro, con base recta) |
| Tiles | 4 × 159×159 · radio 15 · degradado `#101a3e→#050b21` · brillo radial · icono lineal azul/verde · etiqueta 400 12/14 `#ecefff` | `aspect-square rounded-2xl border-pulse/25` 12 tiles en 3 filas | desvío | 4 tiles (2×2) por pestaña, radio 15u, etiqueta 12u |
| Iconos | vectores de la diseñadora (no exportados aún) | lucide | desvío | de momento lucide; pedir SVG (`--svg-assets` no los coge: son «Frame») |
| Base de sección | línea 0.5px `#6994ff` a y=948 | — | desvío | `border-b border-line` |

## 05 · Cómo trabajamos → `src/components/sections/Ecosystem.tsx`

| Propiedad | Figma | Código | Estado | Acción |
|---|---|---|---|---|
| Fondo | imagen galaxia (opac .9) | canvas `Galaxy` | ok | — |
| Eyebrow | pill 254×35 centrado | `eyebrow` | desvío | `.eyebrow` |
| Eslogan | **una línea** a y≈540: «Tu negocio es un sistema» (derecha, x222–731) y «Conectamos todas las piezas» (x1192–1770) · 600 · 38/36 · `#f1f3fe` · sobre banda `#04071a` 1349×59 (x240) | dos `h3` `display` en columnas laterales a alturas distintas | desvío | fila única `grid-cols-[1fr_auto_1fr]` alineada al centro del planeta; 38u; banda oscura detrás |
| Efecto por letra | bolita `#b8f21e` 10px recorre la órbita; las letras cambian de color al pasar | resalte por paso | desvío | letras en `span`; color según distancia horizontal a la bolita |
| Pasos | badge 42×42 círculo `#101a3e` número 600 20px white · título 600 20/23 white · línea 278×0.5 `#c7d7ff` bajo el título · desc 300 18/23 `#c7d7ff` · activo: número y título `#b8f21e`, desc `#a7b2d1` | badge 28px `text-[11px]` · título 15px · desc 13px `text-mist` | desvío | 42u/20u/18u, línea, colores |
| Órbita | elipse 464×385 · trazo conic `#1a4dff → #94b2fc → #1a4dff → #b8f21e` · inclinación ≈ -20° | `RX 220 RY 120 TILT -18` | desvío | proporción 464:385 (más redonda), degradado del trazo |
| Planeta | 185×189 · radial `#fff→#ecefff` · borde 2px `#c7d7ff` · sombra `0 0 200px rgba(26,77,255,.49)` · logo azul ≈ 100×82 | `r=66` (132) logo 80 | desvío | diámetro 185u, logo 100u, sombra |

## 06 · Proceso → `src/components/sections/Process.tsx`

| Propiedad | Figma | Código | Estado | Acción |
|---|---|---|---|---|
| Cabecera | eyebrow pill · H2 700 50/54 white 766 · sub 400 **24/32** `rgba(199,215,255,.8)` 951 | inline | desvío | `SectionHeading` con sub 24u |
| Tag pill | 243×72 · radio 30 · degradado `#101837→#050b21` · borde `#1a4dff` · brillo · 600 18px `#ecefff` | `btn-blue text-sm` | desvío | `.tag-pill` |
| h3 | **400** · 45/49 · `#f1f3fe` · ancho 704 | `font-light text-[clamp(1.7rem,3.2vw,2.5rem)]` | desvío | `font-normal text-[max(1.7rem,45*var(--u))] leading-[1.09]` |
| Desc | 400 · 20/30 · `#c7d7ff` (80 %) | `text-base text-mist` | desvío | 20u `text-cloud/80` |
| Bullets | 500 · 16–18 / 35 · white/`#ecefff` · chevron `#b8f21e` 7×13 grosor 3 | punto `h-1.5` · `text-[13px]` | desvío | `ChevronRight` neon `strokeWidth 3` · 16u/35u |
| Nota inferior | icono 60×60 lineal (`#b8f21e`/`#94b2fc`) + texto 400 24/24 `#1a4dff` | `h-11` círculo + `text-sm` | desvío | 24u `text-electric`; iconos animados los enviará la diseñadora (TODO) |
| Tarjeta chat | 524×573 · radio 30 · degradado `#0a1540→#1a4dff` · borde 1.5 degradado `#6994ff→#1a4dff` · cabecera 109 `rgba(26,77,255,.75)` · avatar 68 white · burbujas radio `25 25 5 25` `#1a4dff` · input 437×73 radio 25 borde `#c7d7ff` · botón 43 white | `rounded-[26px] from-[#0b1a52] to-[#0a1440]` | desvío | valores |
| Tarjeta voz | 522×573 · radio 25 · radial `#1a4dff→#101837` · chips 55 alto radio 25 `#101a3e` · orbe verde `#1cfcb9` · lista sectores 400 16/28 white con iconos 22px | `from-[#0b1640]` orbe `mint` | desvío | valores, orbe `#1cfcb9` |
| Tarjeta reservas | 524×573 · degradado `#1a4dff→#0a1540` · nodos 55 alto radio 25 (`#ecefff` Cliente texto `#294296`; resto `#1a4dff` texto 500 18 `#ecefff`) · líneas white 1px · logo 134 | `card-blue` SVG | desvío | valores |

## 07 · Tecnología → `src/components/sections/Technology.tsx`

| Propiedad | Figma | Código | Estado | Acción |
|---|---|---|---|---|
| Cabecera | pill borde degradado `#1a4dff→#102e99` · H2 700 52/54 `#f1f3fe` · sub 400 18/28 `#c7d7ff` 768 | inline | desvío | `SectionHeading` |
| Pastilla | 70 alto · radio 47 · fondo `rgba(255,255,255,.1)` · borde 0.5 degradado `#94b2fc→#586a96` · disco 48 `#ecefff` a 14px del borde · logo ≈ 36 · texto 500 18/33 `#ecefff` · hueco entre pastillas ≈ 12 | `py-2.5 pl-2.5 pr-7` disco 44 logo 40 texto 15/16 `mx-2.5` | desvío | 70u/48u/36u/18u → a 1440 queda 52/36/27/13.5 («achicar») |
| Filas | 2 filas, sentido opuesto | 2 marquesinas | ok | — |

## 08 · Pruebas no promesas → `src/components/sections/CaseStudies.tsx`

| Propiedad | Figma | Código | Estado | Acción |
|---|---|---|---|---|
| Intro | H2 700 52/54 white izquierda 455 · sub 400 18/28 `#c7d7ff` 390 · enlace «Ver casos exitosos →» 500 18 `#1cfcb9` | `text-[clamp(2.2rem,4.2vw,3.2rem)]` · `text-neon text-sm` | desvío | 52u · `text-mint` 18u |
| Tarjetas | **3** (Clientes, Tiempo, + una tercera fuera del marco) · 826×365 · radio 25 · degradado 247° `#101837→#050b21` · borde 2px conic `#6994ff/#1a4dff` · la **principal** con sombra `0 0 150px rgba(26,77,255,.5)` (+ `0 0 80px 3px`) · las demás sin sombra (opacidad .5) | 4 stats iguales `card-navy rounded-[26px]` | desvío | 3 items; `featured` con sombra; `STATS` y `work.items` a 3 |
| Título tarjeta | «+ Clientes» 500 45/48 `#1a4dff` · desc 300 20/25 `#597eff` | `font-semibold text-neon` | desvío | `text-electric` 45u · desc `#597eff` |
| Panel interior | 376×290 · radio 16 · degradado `#1a4dff 21%→#03259b` · chips 45 alto radio 20 degradado `#182a6d→#101837` texto 500 15 `#ecefff` · cifra 600 35 white · etiqueta 400 20 `#1cfcb9` · persona degradado `#1cfcb9→#38d4ff` | `card-blue rounded-2xl` chips `bg-[#0b1435]/85` | desvío | valores |

## 09 · Demo

| Propiedad | Figma | Código | Estado | Acción |
|---|---|---|---|---|
| Sección | rectángulo vacío 1440×752 radio 35 35 0 0 | no existe | n/a | no implementar (indicación de la diseñadora) |

## 10 · Calculadora → `src/components/sections/Roi.tsx`

| Propiedad | Figma | Código | Estado | Acción |
|---|---|---|---|---|
| Tarjeta | 1196×568 · radio 35 · degradado `#09112d→#0e1f5c` · borde 1.3 conic `#6994ff/#1a4dff` | `card-navy rounded-[28px] p-16` | desvío | valores |
| Eyebrow | pill «//CALCULADORA» borde degradado | `eyebrow` | desvío | `.eyebrow` |
| Título | 600 · 35/40 · white, «haz la cuenta.» en `#1a4dff` (misma línea, sin `<br>`) | `display text-[clamp(1.9rem,3.8vw,3rem)]` + `text-gradient` | desvío | 35u/600, span `text-electric` |
| Cuerpo | 400 18/25 white, «Ni un folleto ni una promesa:» en 600 · ancho 485 | `text-mist` | desvío | `text-white` 18u con negrita |
| Botón | «Hacer la cuenta con mis numeros» 375×62 radio 47 `#c7d7ff` 600 15 `#030617` + flecha `#1a4dff` | `btn-light h-[54px] text-[15px]` | desvío | `.btn-light` 62u/15u |
| Nota | 500 12/22 `#c7d7ff` | `text-xs text-mist` | desvío | `text-cloud` 12u |
| Panel ejemplo | 577×498 · radio 35 · degradado `#fff→#c7d7ff` · borde 1.3 `rgba(148,178,252,.5)` · título 600 22 `#000` · etiquetas 700 12 `#000` · campos 250×60 radio 16 white sombra suave texto 500 15 `#000` | panel oscuro `bg-[#070f2c]/70` | desvío | panel **claro** |
| Bloque resultado | 509×169 · radio 16 · `#1a4dff` · filas 500 15 `#c7d7ff` con cifras 700 18 (`#c7d7ff` / `#b8f21e`) · «Se paga solo en» 600 18 white · «3.9» 600 45 white · «meses» 600 25 | `card-blue rounded-2xl text-center` | desvío | valores |
| Franja Diagnóstico | no existe en el Figma | `Roi.tsx:128-151` | desvío | quitar de la sección (queda en /precios) |

## 11 · Planes 2026 → `src/components/sections/Plans.tsx`

| Propiedad | Figma | Código | Estado | Acción |
|---|---|---|---|---|
| Cabecera | pill borde degradado · H2 700 52/54 `#f1f3fe` · sub 400 18/28 `#c7d7ff` 950 | inline | desvío | `SectionHeading` |
| Tarjetas | 3 × 296×86 · radio 30 · destacada: degradado `#1a4dff→#102e99` borde `#1a4dff`, nombre 600 22 white, precio 500 15 `#b8f21e` · resto: fondo `#ffffff`, nombre 600 22 `#000`, precio 600 15 `#1a4dff` · icono estrella 40×40 (`#b8f21e` destacada / `#1a4dff`) pegado al borde superior derecho | pastillas `rounded-full min-w-[210px] py-3.5` azul con `Sparkle h-6` | desvío | 296u×86u radio 30u, blancas salvo la destacada, estrella 40u arriba-derecha |
| Enlace | «¿Necesitas algo personalizado? Habla con nuestro equipo →» 500 18 (`#ecefff` + `#1cfcb9`) | `text-sm text-frost/85` + `text-neon underline` | desvío | 18u, `text-mint`, sin subrayado |
| Brillos | ninguno extra | sombra lima | desvío | quitar sombra lima |

## 12 · Hablemos → `src/components/sections/FinalCTA.tsx`

| Propiedad | Figma | Código | Estado | Acción |
|---|---|---|---|---|
| Fondo | `#f0f2ff` | `bg-paper #f1f3fe` | ok | — |
| Título | «Hablemos.» 600 + «Nos encantaría conocer tu proyecto» 400 · 65/62 · tracking -0.05em · `#1a4dff` · ancho 640 · izquierda | `text-[clamp(2.4rem,5.4vw,4.4rem)] font-light` bold/light | desvío | 65u, 600/400, -0.05em |
| Botón | «Contactar» 244×72 · radio 47 · fondo `#d5dae9` · texto 600 20 `#010104` · flecha `#030617` | `MagneticButton primary` | desvío | `.btn-light` variante paper (`#d5dae9`) |
| Enlaces chat/voz | no existen | `:77-98` | ok | se mantienen (funcionales) |

## 13 · Footer → `src/components/layout/Footer.tsx`

| Propiedad | Figma | Código | Estado | Acción |
|---|---|---|---|---|
| Logo | 83×68 negro | `h-12 md:h-14 brightness-0` | desvío | 68u |
| Texto | «Diseñamos el futuro de los negocios digitales.» 600 + resto 400 · 20/24 · `rgba(4,5,10,.9)` · ancho 582 | `text-[15px] font-bold` + `text-sm text-ink/65` | desvío | 20u |
| Derecha | «© 2026 Asenix» 600 16 · «TERMINOS / PRIVACIDAD» 600 16 UPPER tracking 0.07em · `#000` | `text-[12px] uppercase tracking-[0.1em]` | desvío | 16u |
| Redes | 3 círculos 41×41 `#161614` con icono white (Instagram, LinkedIn, X) | `SOCIALS = []` | desvío | activar con 41u (enlaces reales pendientes → `#`) |

## Pendientes externos

- Iconos animados de Proceso y SVG de los tiles de Servicios (la diseñadora).
- Diseños de las pestañas «Automatización» y «Tecnología» de Servicios.
- Sección Demo.
- Tercera tarjeta de Pruebas (fuera del marco): se usa el tercer caso actual con el estilo de las otras.
