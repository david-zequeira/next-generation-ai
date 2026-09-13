# Home · Asenix HOME (1532:2424) — spec extraída de Figma

Fuente: IxRzkKKPa5XStlUI6UnpBv «Asenix Web» · modificado 2026-09-13T05:50:09Z · extraído 2026-09-13T21:07:09.397Z · 0 llamadas API

Marco: 1920×11618 · fondo: #030617 · layout: clip

![marco completo](png/00-home-full.png)

Convenciones: posiciones relativas a la sección (x,y en px); colores `#hex` o `rgba`; tracking en px y em (para `tracking-[…em]`); desenfoques CSS = radio Figma / 2 (convención de Dev Mode, confirmar una vez); ángulo de degradado exacto solo si las asas cruzan el nodo en eje.

## 01 · Header (band:header) — 1920×120 @ y=356

![Header](png/01-header.png)

Componente: `src/components/layout/Navbar.tsx`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (3)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1435,50 | Es |  | Montserrat | 500 | 20 | 16 | 0 | — | #ffffff | center/center | 71 HEIGHT |
| 1548,50 | Iniciar sesion |  | Montserrat | 500 | 15 | 16 | 0 | — | #000000 | center/center | 99 WIDTH_AND_HEIGHT |
| 485,53 | Plataforma       Servicios         Ecosistema        Proyectos       … |  | Montserrat | 600 | 15 | 20 | 0 | — | #ffffff | center/center | 949  |

### Contenedores (6)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| Header | Vector (1532:2975) | 240,35 | 69×55 |  | #1a4dff |  |  |  |  |
| Header | Servicio Digital experience (1532:3001) | 1408,35 | 98×46 | 20 | linear-gradient(180deg, #182557 0%, #050b21 99%) |  |  | clip |  |
| ···Frame › Group | Vector (1532:3005) | 1426,50 | 13×14 |  | #ffffff |  |  |  |  |
| ···Frame › Group | Vector (1532:3006) | 1435,56 | 9×10 |  | #ffffff |  |  |  |  |
| Header | Servicio Digital experience (1532:2993) | 1515,35 | 165×46 | 20 | #ffffff |  |  | clip |  |
| ·Header › Servicio Digital experi… | Vector (1532:2994) | 1556,-267 | 335×329 |  | radial-gradient(168px 164px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |

_Nodos ocultos: 0 · nodos más profundos que 6: 0_

## 02 · Hero (band:hero) — 1920×960 @ y=476

![Hero](png/02-hero.png)

Componente: `src/components/sections/Hero.tsx`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (4)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 609,280 | Tu negocio, rediseñado⏎para lo que viene |  | Montserrat | 700 | 55 | 57 | 0 | — | #ffffff | center/center | 702  |
| 608,409 | Creamos experiencias digitales premium y sistemas inteligentes que at… |  | Montserrat | 400 | 20 | 28 | 0 | — | #c7d7ff | center/center | 704  |
| 1036,730 | Ver Demo |  | Montserrat | 600 | 18 | 16 | 0 | — | #ecefff | left/center | 94  |
| 790,729 | Comenzar |  | Montserrat | 600 | 18 | 16 | 0 | — | #010104 | center/center | 96  |

### Contenedores (7)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| Hero | Fondo-30 1 (1532:2971) | 0,-120 | 1921×1080 |  | image(d3c90fbf…, FILL) + rgba(0,0,0,0.5) |  |  |  |  |
| Hero | Rectangle 20 (1532:2976) | 731,700 | 213×72 | 47 | #c7d7ff |  |  |  |  |
| ·Hero › Frame 255 | Servicio Digital experience (1532:2997) | 976,702 | 213×72 | 50 | linear-gradient(180deg, #101837 0%, #050b21 100%) | #1a4dff 1px inside |  | clip |  |
| ··Frame 255 › Servicio Digital experi… | Vector (1532:2998) | 1029,130 | 433×615 |  | linear-gradient(90deg, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ··Frame 255 › Play | Icon (I1532:2999;7758:12092) | 1146,727 | 14×18 |  |  | #1a4dff 2px center |  |  |  |
| ·Hero › Arrow right | Icon (I1532:2978;7758:11060) | 899,727 | 19×19 |  |  | #1a4dff 2px center |  |  |  |
| ·Hero › Frame 164 | Vector (1532:2992) | 1776,812 | 45×37 |  | #ffffff |  |  |  |  |

_Nodos ocultos: 0 · nodos más profundos que 6: 2_

## 03 · El futuro (band:el-futuro) — 1920×1089 @ y=1436

![El futuro](png/03-el-futuro.png)

Componente: `src/components/sections/Evolution.tsx`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (3)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 238,453 | Diseñamos la experiencia |  | Montserrat | 600 | 85 | 20 | -4.25px (-0.05em) | — | #1a4dff | center/center | 1444  |
| 458,548 | Experiencias digitales que elevan tu marca. |  | Montserrat | 400 | 24 | 28 | 0 | — | #ffffff | center/center | 1004  |
| 855,131 | el futuro de los negocios |  | Montserrat | 600 | 12 | 22 | 0.6px (0.05em) | UPPER | #b8f21e | center/center | 210  |

### Contenedores (3)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| ·El futuro › El futuro | Rectangle 2 (1532:2438) | 0,0 | 1920×1080 |  | linear-gradient(180deg, #000000 0%, rgba(0,0,0,0) 100%) |  |  |  |  |
| ·El futuro › El futuro | Rectangle 162 (1555:72502) | 0,253 | 1920×827 |  | linear-gradient(180deg, #030617 0%, #040b24 100%) |  |  |  |  |
| ··El futuro › Frame 240 | Servicio Digital experience (1532:2443) | 845,126 | 230×28 | 50 | rgba(213,218,233,0.08) | #94b2fc 0.3px inside |  | clip |  |

_Nodos ocultos: 0 · nodos más profundos que 6: 0_

## 04 · Servicios (band:servicios) — 1920×1364 @ y=2525

![Servicios](png/04-servicios.png)

Componente: `src/components/sections/Services.tsx`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (24)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1123,1007 | Experiencia⏎de marca |  | Montserrat | 400 | 12 | 14 | 0.6px (0.05em) | — | #ecefff | center/top | 111  |
| 1302,1007 | Diseño de lujo |  | Montserrat | 400 | 12 | 14 | 0 | — | #ecefff | center/top | 108  |
| 1111,1186 | Desarrollo de alto rendimiento |  | Montserrat | 400 | 12 | 14 | 0 | — | #ecefff | center/bottom | 136  |
| 1276,1188 | Conversion⏎y crecimiento |  | Montserrat | 400 | 12 | 14 | 0 | — | #ecefff | center/bottom | 160  |
| 331,717 | Diseño que hace a las empresas inolvidables. |  | Montserrat | 600 | 38 | 47 | 0 | — | #ffffff | left/top | 569  |
| 331,831 | Sitios web premium diseñados para generar confianza, destacar tu marc… |  | Montserrat | 300 | 20 | 28 | 0 | — | #c7d7ff | left/center | 569  |
| 371,1090 | Diseñado para aumentar conversiones y generar oportunidades. |  | Montserrat | 400 | 15 | 24 | 0 | — | #ffffff | left/top | 245  |
| 371,1057 | Estrategia |  | Montserrat | 600 | 18 | 24 | 0 | — | #ffffff | left/top | 245  |
| 371,954 | Belleza |  | Montserrat | 600 | 18 | 24 | 0 | — | #ffffff | left/top | 245  |
| 371,987 | Diseño premium que refleja el verdadero valor de tu marca. |  | Montserrat | 400 | 15 | 22 | 0 | — | #ffffff | left/top | 245  |
| 664,987 | Rendimiento optimizado para una experiencia instantánea. |  | Montserrat | 400 | 15 | 24 | 0 | — | #ffffff | left/top | 245  |
| 664,955 | Rapidez |  | Montserrat | 600 | 18 | 24 | 0 | — | #ffffff | left/top | 245  |
| 664,1090 | Preparado para SEO, automatizaciones e inteligencia artificial. |  | Montserrat | 400 | 15 | 24 | 0 | — | #ffffff | left/top | 245  |
| 664,1057 | Escalabilidad |  | Montserrat | 600 | 18 | 24 | 0 | — | #ffffff | left/top | 245  |
| 332,1223 | Cotizar proyectos |  | Montserrat | 600 | 14 | 36 | 0 | — | #ffffff | center/center | 195  |
| 850,480 | Automatizacion |  | Montserrat | 600 | 18 | 36 | 0 | — | #ffffff | center/center | 220  |
| 1076,480 | Tecnologia |  | Montserrat | 600 | 18 | 36 | 0 | — | #ffffff | center/center | 212  |
| 921,130 | servicios |  | Montserrat | 600 | 12 | 22 | 0.6px (0.05em) | UPPER | #b8f21e | center/center | 78  |
| 609,188 | Construimos ecosistemas digitales |  | Montserrat | 700 | 52 | 54 | 0 | — | #ffffff | center/center | 702  |
| 609,305 | Cada proyecto combina diseño premium, desarrollo de alto rendimiento … |  | Montserrat | 400 | 20 | 28 | 0 | — | #c7d7ff | center/top | 703  |
| 618,481 | Diseño Web |  | Montserrat | 600 | 18 | 36 | 0 | — | #000000 | center/center | 212  |
| 548,1221 | Explorar Asenix Copilot → |  | Montserrat | 500 | 14 | 24 | 0 | — | #1cfcb9 | left/top | 231  |
| ↳ | Explorar Asenix Copilot | | = | = | = | = | = | = | = | | |
| ↳ |  → | | = | = | = | = | = | = | = | | |

### Contenedores (27)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| Servicios | Servicio Digital experience (1532:2445) | 0,0 | 1926×1364 | 25 25 0 0 |  |  |  | clip |  |
| ··Servicio Digital experi… › Frame 91 | Rectangle 35 (1532:2447) | 240,613 | 1440×752 | 35 35 0 0 | linear-gradient(180deg, #101a3e 0%, #1a3ba9 100%) | conic-gradient(#6994ff 32%, #1a4dff 50%, #6994ff 68%) 0.5px… | box-shadow: 0px 0px 150px 0px rgba(26,77,255,0.5) |  |  |
| ··Servicio Digital experi… › Frame 91 | Servicio Digital experience (1532:2448) | 944,705 | 645×573 | 25 | linear-gradient(180deg, #1a4dff 28%, #294296 100%) |  |  | clip |  |
| ···Frame 91 › Servicio Digital experi… | Vector (1532:2449) | 1075,438 | 703×711 |  | radial-gradient(352px 356px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 66%, rgba(46,107,255,0) 100%) |  | filter: blur(40px) |  |  |
| ···Frame 91 › Servicio Digital experi… | Vector (1532:2450) | 366,562 | 1088×1015 |  | radial-gradient(544px 508px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 66%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ···Frame 91 › Servicio Digital experi… | Rectangle 21 (1532:2451) | 1069,780 | 399×511 | 20 20 0 0 | linear-gradient(180deg, #ffffff 0%, #94b2fc 47%, #7a93d0 100%) | #ffffff 0.5px inside | box-shadow: 0px 0px 50px -13px rgba(255,255,255,0.59) |  |  |
| ···Frame 91 › Servicio Digital experi… | Rectangle 22 (1532:2452) | 1069,780 | 399×74 | 20 20 0 0 | rgba(255,255,255,0.5) |  |  |  |  |
| ···Frame 91 › Servicio Digital experi… | Servicio Digital experience (1532:2453) | 1099,894 | 159×159 | 15 | linear-gradient(180deg, #101a3e 0%, #050b21 61%) |  |  | clip |  |
| ····Servicio Digital experi… › Servicio Digital experi… | Vector (1532:2454) | 1150,819 | 180×178 |  | radial-gradient(90px 89px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ···Frame 91 › Servicio Digital experi… | Servicio Digital experience (1532:2470) | 1099,1073 | 159×159 | 15 | linear-gradient(180deg, #101a3e 0%, #050b21 61%) |  |  | clip |  |
| ····Servicio Digital experi… › Servicio Digital experi… | Vector (1532:2471) | 1150,998 | 180×178 |  | radial-gradient(90px 89px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ···Frame 91 › Servicio Digital experi… | Servicio Digital experience (1532:2480) | 1276,894 | 159×159 | 15 | linear-gradient(180deg, #101a3e 0%, #050b21 61%) |  |  | clip |  |
| ····Servicio Digital experi… › Servicio Digital experi… | Vector (1532:2481) | 1327,819 | 180×178 |  | radial-gradient(90px 89px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ···Frame 91 › Servicio Digital experi… | Servicio Digital experience (1532:2493) | 1276,1073 | 159×159 | 15 | linear-gradient(180deg, #101a3e 0%, #050b21 61%) |  |  | clip |  |
| ····Servicio Digital experi… › Servicio Digital experi… | Vector (1532:2494) | 1327,998 | 180×178 |  | radial-gradient(90px 89px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ···Frame 91 › Servicio Digital experi… | Ellipse 7 (1532:2506) | 1260,810 | 15×15 |  |  | #1a4dff 1px inside |  |  |  |
| ···Frame 91 › Servicio Digital experi… | Ellipse 8 (1532:2507) | 1263,813 | 9×9 |  | #1a4dff |  |  |  |  |
| ·····Frame 230 › Frame 209 | Ellipse 62 (1532:2515) | 331,1057 | 24×24 |  | #b8f21e |  |  |  |  |
| ·····Frame 231 › Frame 209 | Ellipse 62 (1532:2526) | 331,954 | 24×24 |  | #b8f21e |  |  |  |  |
| ····Frame 223 › Frame 232 | Ellipse 62 (1532:2536) | 620,954 | 24×24 |  | #b8f21e |  |  |  |  |
| ····Frame 225 › Frame 229 | Ellipse 62 (1532:2546) | 620,1057 | 24×24 |  | #b8f21e |  |  |  |  |
| ·Servicios › Servicio Digital experi… | Vector 20 (1532:2552) | 0,1365 | 1920×0 |  |  | radial-gradient(960px 0px at 50% 50%, #1a4dff 0%, #030617 1… |  |  |  |
| ·Servicios › Servicio Digital experi… | Servicio Digital experience (1532:2553) | 334,1204 | 194×53 | 50 | linear-gradient(180deg, #101837 0%, #050b21 61%) | #1a4dff 1px inside |  | clip |  |
| ··Servicio Digital experi… › Servicio Digital experi… | Vector (1532:2554) | 383,1038 | 222×214 |  | linear-gradient(90deg, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(22.3px) |  |  |
| ·Servicios › Servicio Digital experi… | Rectangle 29 (1532:3216) | 605,445 | 711×90 | 55 |  | conic-gradient(#4977ff 63%, #1a4dff 75%, #6994ff 88%) 0.5px… |  |  |  |
| ··Frame 248 › Frame 239 | Servicio Digital experience (1532:3111) | 910,125 | 100×28 | 50 | rgba(213,218,233,0.08) | #94b2fc 0.3px inside |  | clip |  |
| ·Servicios › Frame 249 | Rectangle 181 (1532:3218) | 618,457 | 212×66 | 47 | #ffffff |  |  |  |  |

_Nodos ocultos: 0 · nodos más profundos que 6: 22_

## 05 · Cómo trabajamos (band:como-trabajamos) — 1920×1037 @ y=3889

![Cómo trabajamos](png/05-como-trabajamos.png)

Componente: `src/components/sections/Ecosystem.tsx`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (22)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 890,130 | como trabajamos |  | Montserrat | 600 | 12 | 22 | 0.6px (0.05em) | UPPER | #b8f21e | center/center | 140  |
| 1072,283 | 1 |  | Montserrat | 600 | 20 | 22 | 0 | UPPER | #ffffff | center/center | 13  |
| 821,285 | Descubrimos |  | Montserrat | 600 | 20 | 23 | 0 | — | #ffffff | left/top | 239  |
| 821,341 | Entendemos tu negocio. |  | Montserrat | 300 | 16 | 24 | 0 | — | #c7d7ff | left/top | 278  |
| 675,379 | 6 |  | Montserrat | 600 | 20 | 22 | 0 | UPPER | #ffffff | center/center | 13  |
| 675,379 | 6 |  | Montserrat | 600 | 20 | 22 | 0 | UPPER | #ffffff | center/center | 13  |
| 1469,379 | 2 |  | Montserrat | 600 | 20 | 22 | 0 | UPPER | #ffffff | center/center | 13  |
| 421,381 | Integramos |  | Montserrat | 600 | 20 | 23 | 0 | — | #ffffff | left/top | 289  |
| 1222,381 | Definimos |  | Montserrat | 600 | 20 | 23 | 0 | — | #ffffff | left/top | 242  |
| 421,437 | Sistemas inteligentes que trabajan juntos sin esfuerzo. |  | Montserrat | 300 | 16 | 24 | 0 | — | #c7d7ff | left/top | 307  |
| 1222,437 | Identificamos dónde tu negocio puede mejorar y crecer. |  | Montserrat | 300 | 16 | 24 | 0 | — | #c7d7ff | left/top | 296  |
| 1192,540 | Conectamos todas las piezas |  | Montserrat | 600 | 38 | 36 | 0 | — | #f1f3fe | left/top | 578  |
| 222,543 | Tu negocio es un sistema |  | Montserrat | 600 | 38 | 36 | 0 | — | #f1f3fe | right/top | 509  |
| 1469,637 | 3 |  | Montserrat | 600 | 20 | 22 | 0 | UPPER | #ffffff | center/center | 13  |
| 675,638 | 5 |  | Montserrat | 600 | 20 | 22 | 0 | UPPER | #b8f21e | center/center | 13  |
| 1221,643 | Diseñamos |  | Montserrat | 600 | 20 | 23 | 0 | — | #ffffff | left/top | 235  |
| 421,644 | Evolucionamos |  | Montserrat | 600 | 20 | 23 | 0 | — | #1a4dff | left/top | 221  |
| 1221,699 | Diseñamos la experiencia. |  | Montserrat | 300 | 16 | 24 | 0 | — | #c7d7ff | left/top | 287  |
| 421,700 | Analizamos los resultados y optimizamos continuamente. |  | Montserrat | 300 | 16 | 24 | 0 | — | #a7b2d1 | left/top | 278  |
| 1072,751 | 4 |  | Montserrat | 600 | 20 | 22 | 0 | UPPER | #ffffff | center/center | 13  |
| 821,753 | Construimos |  | Montserrat | 600 | 20 | 23 | 0 | — | #ffffff | left/top | 281  |
| 821,809 | Convertimos la estrategia en realidad. |  | Montserrat | 300 | 16 | 24 | 0 | — | #c7d7ff | left/top | 278  |

### Contenedores (22)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| Cómo trabajamos | Vector 31 (1532:2557) | 1,0 | 1920×0 |  |  | #6994ff 0.5px inside |  |  |  |
| Cómo trabajamos | Servicio Digital experience (1532:3104) | 880,125 | 160×28 | 50 | rgba(213,218,233,0.08) | #94b2fc 0.3px inside |  | clip |  |
| ·Cómo trabajamos › Frame 223 | Vector (1532:2598) | 1057,269 | 42×42 |  | #101a3e |  |  |  |  |
| Cómo trabajamos | Vector 12 (1532:2576) | 821,323 | 278×0 |  | #c7d7ff | #c7d7ff 0.5px center |  |  |  |
| Cómo trabajamos | Vector (1532:2601) | 728,364 | 464×385 |  |  | conic-gradient(#1a4dff 12%, #94b2fc 58%, #1a4dff 87%, #b8f2… |  |  |  |
| ·Cómo trabajamos › Frame 218 | Vector (1532:2583) | 660,365 | 42×42 |  | #101a3e |  |  |  |  |
| ·Cómo trabajamos › Frame 219 | Vector (1532:2586) | 660,365 | 42×42 |  | #101a3e |  |  |  |  |
| ·Cómo trabajamos › Frame 220 | Vector (1532:2589) | 1454,365 | 42×42 |  | #101a3e |  |  |  |  |
| Cómo trabajamos | Vector 11 (1532:2574) | 421,419 | 278×0 |  | #c7d7ff | #c7d7ff 0.5px center |  |  |  |
| Cómo trabajamos | Vector 15 (1532:2575) | 1221,419 | 278×0 |  | #c7d7ff | #c7d7ff 0.5px center |  |  |  |
| Cómo trabajamos | Vector (1532:2718) | 869,463 | 185×189 |  | radial-gradient(94px 93px at 50% 50%, #ffffff 0%, #ecefff 100%) | #c7d7ff 2px center | box-shadow: 0px 0px 200px 0px rgba(26,77,255,0.49) |  |  |
| ·Cómo trabajamos › Frame | Vector (1532:2720) | 910,543 | 48×51 |  | #1a4dff |  |  |  |  |
| ·Cómo trabajamos › Frame | Vector (1532:2721) | 949,531 | 62×52 |  | #1a4dff |  |  |  |  |
| ·Cómo trabajamos › Frame | Vector (1532:2722) | 951,512 | 48×82 |  | #1a4dff |  |  |  |  |
| Cómo trabajamos | Rectangle 40 (1532:2558) | 240,537 | 1349×59 |  | #04071a |  |  |  |  |
| ·Cómo trabajamos › Frame 221 | Vector (1532:2592) | 1454,623 | 42×42 |  | #101a3e |  |  |  |  |
| ·Cómo trabajamos › Frame 25 | Vector (1532:2580) | 660,624 | 42×42 |  | #101a3e |  |  |  |  |
| Cómo trabajamos | Vector (1532:2602) | 787,650 | 10×10 |  | #b8f21e |  |  |  |  |
| Cómo trabajamos | Vector 14 (1532:2578) | 1221,681 | 278×0 |  | #c7d7ff | #c7d7ff 0.5px center |  |  |  |
| Cómo trabajamos | Vector 10 (1532:2573) | 421,682 | 278×0 |  |  | #1a4dff 0.5px center |  |  |  |
| ·Cómo trabajamos › Frame 222 | Vector (1532:2595) | 1057,737 | 42×42 |  | #101a3e |  |  |  |  |
| Cómo trabajamos | Vector 13 (1532:2577) | 821,791 | 278×0 |  | #c7d7ff | #c7d7ff 0.5px center |  |  |  |

_Nodos ocultos: 0 · nodos más profundos que 6: 0_

## 06 · Proceso (band:proceso) — 1920×3015 @ y=4926

![Proceso](png/06-proceso.png)

Componente: `src/components/sections/Process.tsx`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (36)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 913,130 | Proceso |  | Montserrat | 600 | 12 | 22 | 0.6px (0.05em) | UPPER | #b8f21e | center/center | 94  |
| 609,188 | La inteligencia artificial detrás de tu negocio |  | Montserrat | 700 | 52 | 54 | 0 | — | #ffffff | center/top | 704  |
| 608,317 | Diseñamos ecosistemas inteligentes que atienden clientes, automatizan… |  | Montserrat | 400 | 26 | 34 | 0 | — | rgba(199,215,255,0.8) | center/top | 705  |
| 256,562 | AI Concierge |  | Montserrat | 600 | 18 | 36 | 0 | — | #779eff | center/center | 139  |
| 1142,1086 | Escribeme un mensaje... |  | Montserrat | 400 | 18 | 19 | 0 | — | #ffffff | left/top | 233  |
| 1205,663 | En Linea |  | Montserrat | 300 | 15 | 20 | 0 | — | #ecefff | left/top | 165  |
| 1189,640 | Asenix AI |  | Montserrat | 500 | 24 | 20 | 0 | — | #ffffff | left/top | 276  |
| 1249,960 | Me gustaria me ayudaras con algunas dudas. |  | Montserrat | 400 | 18 | 21 | 0 | — | #ecefff | right/center | 274  |
| 1452,784 | Hola |  | Montserrat | 400 | 18 | 19 | 0 | — | #ecefff | center/center | 95  |
| 1110,854 | Hola 👋 Soy Asenix AI, tu asistente inteligente.¿En qué puedo ayudart… |  | Montserrat | 400 | 18 | 24 | 0 | — | #ecefff | left/top | 437  |
| 240,659 | El primer miembro de tu equipo digital |  | Montserrat | 400 | 45 | 49 | 0 | — | #f1f3fe | left/top | 704  |
| 240,777 | Atiende visitantes, responde preguntas y guía a cada cliente hacia la… |  | Montserrat | 400 | 20 | 28 | 0 | — | rgba(199,215,255,0.8) | left/top | 704  |
| 281,910 | Respuestas instantáneas⏎Captación de leads       ⏎Reservas y citas |  | Montserrat | 500 | 16 | 35 | 0 | — | #ffffff | left/center | 295  |
| 617,916 | Recomendaciones de productos⏎Integración con CRM  ⏎ |  | Montserrat | 500 | 16 | 35 | 0 | — | #ffffff | left/center | 336  |
| 316,1071 | Atencion automatizada⏎las 24 horas |  | Montserrat | 400 | 24 | 24 | 0 | — | #1a4dff | left/center | 339  |
| 998,1373 | Agentes de voz con AI |  | Montserrat | 600 | 18 | 36 | 0 | — | #779eff | center/center | 206 WIDTH_AND_HEIGHT |
| 639,1913 | Bienes raices⏎Salud y telemedicina |  | Montserrat | 400 | 16 | 28 | 0 | — | #ffffff | left/center | 170  |
| 404,1911 | Comercio electronico⏎Hospitabilidad |  | Montserrat | 400 | 16 | 28 | 0 | — | #ffffff | left/center | 189  |
| 692,1548 | Agenda⏎citas |  | Montserrat | 400 | 16 | 18 | 0 | — | #ffffff | left/center | 70  |
| 546,1482 | Califica clientes⏎potenciales |  | Montserrat | 400 | 16 | 18 | 0 | — | #ffffff | left/center | 127  |
| 467,1559 | Recepcionista⏎con Ai |  | Montserrat | 400 | 16 | 18 | 0 | — | #ffffff | left/center | 118  |
| 976,1493 | Nunca pierdas una llamada importante. |  | Montserrat | 400 | 45 | 49 | 0 | — | #f1f3fe | left/top | 708  |
| 976,1611 | Agentes de voz impulsados por IA que responden, califican y programan… |  | Montserrat | 400 | 20 | 28 | 0 | — | #c7d7ff | left/top | 708  |
| 1009,1720 | 100 % de llamadas respondidas⏎3 × más citas agendadas⏎90 % de tasa de… |  | Montserrat | 500 | 18 | 35 | 0 | — | #ecefff | left/center | 536  |
| 1051,1913 | Llamadas entrantes⏎las 24 horas |  | Montserrat | 400 | 24 | 25 | 0 | — | #1a4dff | left/center | 246  |
| 211,2217 | Automatizacion de reservas con AI |  | Montserrat | 600 | 18 | 36 | 0 | — | #779eff | center/center | 389  |
| 1310,2313 | Cliente |  | Montserrat | 500 | 18 | 18 | 0 | — | #294296 | left/center | 91  |
| 1166,2632 | CRM |  | Montserrat | 500 | 18 | 18 | 0 | — | #ecefff | left/center | 55  |
| 1467,2632 | Agenda |  | Montserrat | 500 | 18 | 18 | 0 | — | #ecefff | left/center | 91  |
| 1289,2555 | Facturacion |  | Montserrat | 500 | 18 | 18 | 0 | — | #ecefff | left/center | 114  |
| 1286,2733 | Seguimiento |  | Montserrat | 500 | 18 | 18 | 0 | — | #ecefff | left/center | 131  |
| 245,2323 | Automatiza tus reservas y deja que la IA trabaje por ti |  | Montserrat | 400 | 45 | 49 | 0 | — | #f1f3fe | left/top | 703  |
| 245,2442 | Conectamos CRM, calendarios, pagos y seguimiento para que cada reserv… |  | Montserrat | 400 | 20 | 28 | 0 | — | #a7b2d1 | left/top | 703  |
| 271,2547 | Reservas automáticas⏎Gestión de clientes y pagos         ⏎Menos tarea… |  | Montserrat | 500 | 18 | 35 | 0 | — | #ecefff | left/center | 317  |
| 616,2547 | Sincronización con calendarios⏎Seguimiento automatizado          ⏎ |  | Montserrat | 500 | 18 | 35 | 0 | — | #ecefff | left/center | 337  |
| 316,2728 | Todo sincronizado, sin intervención manual |  | Montserrat | 400 | 24 | 24 | 0 | — | #1a4dff | left/center | 339  |

### Contenedores (86)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| Proceso | Vector 20 (1532:3103) | 0,0 | 1920×0 |  |  | radial-gradient(960px 0px at 50% 50%, #1a4dff 0%, #030617 1… |  |  |  |
| ·Proceso › Frame 251 | Servicio Digital experience (1532:3106) | 913,125 | 94×28 | 50 | rgba(213,218,233,0.08) | #94b2fc 0.3px inside |  | clip |  |
| Proceso | Diseño Web (1532:3023) | 204,534 | 243×72 | 30 | linear-gradient(180deg, #101837 0%, #050b21 61%) | #1a4dff 1px inside |  | clip |  |
| ·Proceso › Diseño Web | Vector (1532:3024) | 325,320 | 299×286 |  | linear-gradient(90deg, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(24.1px) |  |  |
| Proceso | Servicio Digital experience (1532:2846) | 1065,606 | 524×573 | 30 30 30 39 | linear-gradient(180deg, #0a1540 0%, #1a4dff 100%) | linear-gradient(0deg, #6994ff 0%, #1a4dff 100%) 1.5px inside |  | clip |  |
| ·Proceso › Servicio Digital experi… | Vector (1532:2847) | 1220,340 | 612×586 |  | radial-gradient(306px 293px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ·Proceso › Servicio Digital experi… | Rectangle 72 (1532:2848) | 1110,1059 | 437×73 | 25 |  | #c7d7ff 1px center |  |  |  |
| ·Proceso › Servicio Digital experi… | Ellipse 1 (1532:2850) | 1490,1074 | 43×44 |  | #ffffff |  |  |  |  |
| ·Proceso › Servicio Digital experi… | Servicio Digital experience (1532:2851) | 1065,606 | 524×109 | 30 30 0 0 | rgba(26,77,255,0.75) |  |  | clip |  |
| ··Servicio Digital experi… › Servicio Digital experi… | Ellipse 17 (1532:2854) | 1188,669 | 8×8 |  | #b8f21e |  |  |  |  |
| ··Servicio Digital experi… › Servicio Digital experi… | Ellipse 1 (1532:2856) | 1098,627 | 68×68 |  | #b8f21e |  |  |  |  |
| ··Servicio Digital experi… › Servicio Digital experi… | Vector (1532:2857) | 1114,643 | 36×30 |  | #000000 |  |  |  |  |
| ·Proceso › Servicio Digital experi… | Rectangle 108 (1532:2865) | 1227,949 | 320×62 | 25 25 5 25 | #1a4dff |  |  |  |  |
| ·Proceso › Servicio Digital experi… | Rectangle 69 (1532:2867) | 1452,762 | 95×62 | 25 25 5 25 | #1a4dff |  |  |  |  |
| ·Proceso › X | Icon (I1318:6631;68:16114) | 315,665 | 14×14 |  |  | #ffffff 3px center |  |  |  |
| ·Proceso › Chevron right | Icon (I1532:3012;7758:11234) | 248,910 | 6×13 |  |  | #b8f21e 3px center |  |  |  |
| ·Proceso › Chevron right | Icon (I1532:3016;7758:11234) | 586,910 | 7×13 |  |  | #b8f21e 3px center |  |  |  |
| ·Proceso › Chevron right | Icon (I1532:3009;7758:11234) | 248,945 | 6×13 |  |  | #b8f21e 3px center |  |  |  |
| ·Proceso › Chevron right | Icon (I1532:3014;7758:11234) | 586,945 | 7×13 |  |  | #b8f21e 3px center |  |  |  |
| ·Proceso › Chevron right | Icon (I1532:3008;7758:11234) | 248,979 | 6×13 |  |  | #b8f21e 3px center |  |  |  |
| ···Group › Group | Vector (1532:2925) | 246,1053 | 30×25 |  | #b8f21e |  |  |  |  |
| ···Group › Group | Vector (1532:2926) | 275,1056 | 3×3 |  | #b8f21e |  |  |  |  |
| ···Group › Group | Vector (1532:2927) | 280,1056 | 3×3 |  | #b8f21e |  |  |  |  |
| ···Group › Group | Vector (1532:2928) | 286,1056 | 3×3 |  | #b8f21e |  |  |  |  |
| ···Group › Group | Vector (1532:2930) | 265,1048 | 33×25 |  | #779eff |  |  |  |  |
| ···Group › Group | Vector (1532:2931) | 242,1076 | 56×32 |  | #779eff |  |  |  |  |
| Proceso | Diseño Web (1532:3041) | 955,1355 | 292×72 | 30 | linear-gradient(180deg, #101837 0%, #050b21 61%) | #1a4dff 1px inside |  | clip |  |
| ·Proceso › Diseño Web | Vector (1532:3042) | 1100,1141 | 359×286 |  | linear-gradient(90deg, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(24.1px) |  |  |
| ·Proceso › Diseño Web | Frame 233 (1532:3043) | 988,1363 | 226×56 |  |  |  |  | H justify=center align=center pad=10 gap=10 |  |
| Proceso | Servicio Digital experience (1532:2726) | 331,1427 | 522×573 | 25 | radial-gradient(286px 261px at 50% 50%, #1a4dff 0%, #101837 100%) | linear-gradient(180deg, #6994ff 0%, #1a4dff 100%) 1.5px ins… |  | clip |  |
| ·Proceso › Servicio Digital experi… | Vector (1532:2727) | 578,1224 | 484×490 |  | radial-gradient(242px 245px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ·Proceso › Servicio Digital experi… | Line 5 (1532:2765) | 375,1863 | 434×0 |  |  | #c7d7ff 1px center |  |  |  |
| ··Servicio Digital experi… › Frame 155 | Servicio Digital experience (1532:2769) | 630,1538 | 161×55 | 25 | #101a3e |  |  | clip |  |
| ···Frame 155 › Servicio Digital experi… | Vector (1532:2770) | 369,651 | 390×924 |  | radial-gradient(195px 462px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ··Servicio Digital experi… › Frame 156 | Servicio Digital experience (1532:2791) | 482,1472 | 222×55 | 25 | #101a3e |  |  | clip |  |
| ···Frame 156 › Servicio Digital experi… | Vector (1532:2792) | 122,585 | 537×924 |  | radial-gradient(269px 462px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ··Servicio Digital experi… › Frame 157 | Servicio Digital experience (1532:2813) | 406,1549 | 204×55 | 25 | #101a3e |  |  | clip |  |
| ···Frame 157 › Servicio Digital experi… | Vector (1532:2814) | 75,662 | 494×924 |  | radial-gradient(247px 462px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ··Servicio Digital experi… › chimenea-de-la-casa 1 | Vector (1532:2835) | 371,1932 | 22×22 |  | #ffffff |  |  |  |  |
| ··Servicio Digital experi… › cesta-de-compras-menos 1 | Vector (1532:2837) | 371,1900 | 22×22 |  | #ffffff |  |  |  |  |
| ··Servicio Digital experi… › llave-de-casa 1 | Vector (1532:2839) | 608,1900 | 22×22 |  | #ffffff |  |  |  |  |
| ··Servicio Digital experi… › medico 1 | Vector (1532:2841) | 607,1933 | 22×20 |  | #ffffff |  |  |  |  |
| ·Proceso › Chevron right | Icon (I1532:3015;7758:11234) | 986,1728 | 7×13 |  |  | #b8f21e 3px center |  |  |  |
| ·Proceso › Chevron right | Icon (I1532:3013;7758:11234) | 986,1763 | 7×13 |  |  | #b8f21e 3px center |  |  |  |
| ·Proceso › Chevron right | Icon (I1532:3010;7758:11234) | 986,1798 | 7×13 |  |  | #b8f21e 3px center |  |  |  |
| ·Proceso › Chevron right | Icon (I1532:3011;7758:11234) | 986,1833 | 7×13 |  |  | #b8f21e 3px center |  |  |  |
| ··apoyo-tecnico 1 › Group | Vector (1532:2844) | 976,1905 | 48×48 |  | #779eff |  |  |  |  |
| ··apoyo-tecnico 1 › Group | Vector (1532:2845) | 993,1937 | 13×8 |  | #b8f21e |  |  |  |  |
| Proceso | Diseño Web (1532:3026) | 204,2189 | 404×72 | 30 | linear-gradient(180deg, #101837 0%, #050b21 61%) | #1a4dff 1px inside |  | clip |  |
| ·Proceso › Diseño Web | Vector (1532:3027) | 405,1975 | 497×286 |  | linear-gradient(90deg, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(24.1px) |  |  |
| Proceso | Servicio Digital experience (1532:2870) | 1065,2261 | 524×573 | 30 30 30 39 | linear-gradient(180deg, #1a4dff 0%, #0a1540 100%) | linear-gradient(180deg, #6994ff 0%, #1a4dff 100%) 1.5px ins… |  | clip |  |
| ·Proceso › Servicio Digital experi… | Vector (1532:2871) | 1216,2079 | 612×586 |  | radial-gradient(306px 293px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ·Proceso › Servicio Digital experi… | Servicio Digital experience (1532:2872) | 1251,2306 | 152×55 | 25 | #ecefff |  |  | clip |  |
| ··Servicio Digital experi… › Servicio Digital experi… | Vector (1532:2873) | 1004,1419 | 368×924 |  | radial-gradient(184px 462px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ····usuario 1 › Group | Vector (1532:2876) | 1280,2319 | 12×12 |  | #1a4dff |  |  |  |  |
| ····usuario 1 › Group | Vector (1532:2877) | 1277,2333 | 18×10 |  | #1a4dff |  |  |  |  |
| ·Proceso › Servicio Digital experi… | Servicio Digital experience (1532:2879) | 1104,2621 | 132×55 | 25 | #1a4dff |  |  | clip |  |
| ··Servicio Digital experi… › Servicio Digital experi… | Vector (1532:2880) | 890,1734 | 319×924 |  | radial-gradient(160px 462px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ··Servicio Digital experi… › Servicio Digital experi… | Vector (1532:2881) | 1129,2636 | 24×22 |  | #ffffff |  |  |  |  |
| ·Proceso › Servicio Digital experi… | Servicio Digital experience (1532:2884) | 1406,2621 | 152×55 | 25 | #1a4dff |  |  | clip |  |
| ··Servicio Digital experi… › Servicio Digital experi… | Vector (1532:2885) | 1159,1734 | 368×924 |  | radial-gradient(184px 462px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ···Servicio Digital experi… › auditoria-alternativa 1 | Vector (1532:2887) | 1430,2637 | 22×24 |  | #ffffff |  |  |  |  |
| ·Proceso › Servicio Digital experi… | Servicio Digital experience (1532:2889) | 1236,2545 | 183×55 | 25 | #1a4dff |  |  | clip |  |
| ··Servicio Digital experi… › Servicio Digital experi… | Vector (1532:2890) | 939,1658 | 443×924 |  | radial-gradient(221px 462px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ···Servicio Digital experi… › recibo 1 | Vector (1532:2892) | 1258,2559 | 19×26 |  | #ffffff |  |  |  |  |
| ·Proceso › Servicio Digital experi… | Servicio Digital experience (1532:2894) | 1229,2723 | 196×55 | 25 | #1a4dff |  |  | clip |  |
| ··Servicio Digital experi… › Servicio Digital experi… | Vector (1532:2895) | 911,1836 | 474×924 |  | radial-gradient(237px 462px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ··Servicio Digital experi… › seguimiento-de-ubicacio… | Vector (1532:2898) | 1247,2735 | 26×26 |  | #ffffff |  |  |  |  |
| ·Proceso › Servicio Digital experi… | Vector 22 (1532:2899) | 1327,2361 | 0×37 |  |  | #ffffff 1px center |  |  |  |
| ·Proceso › Servicio Digital experi… | Vector 26 (1532:2900) | 1325,2649 | 0×74 |  |  | #ffffff 1px center |  |  |  |
| ·Proceso › Servicio Digital experi… | Vector 28 (1532:2901) | 1236,2646 | 170×1 |  |  | #ffffff 1px center |  |  |  |
| ·Proceso › Servicio Digital experi… | Vector 27 (1532:2902) | 1327,2506 | 0×39 |  |  | #ffffff 1px center |  |  |  |
| ·Proceso › Servicio Digital experi… | Vector 29 (1532:2903) | 1419,2575 | 67×47 |  |  | #ffffff 1px center |  |  |  |
| ··Servicio Digital experi… › Frame | aaaa 1 (1532:2905) | 1260,2386 | 134×134 |  | image(1fd5b047…, FILL) |  |  |  |  |
| ·Proceso › Chevron right | Icon (I1532:3020;7758:11234) | 250,2547 | 7×13 |  |  | #b8f21e 2px center |  |  |  |
| ·Proceso › Chevron right | Icon (I1532:3022;7758:11234) | 586,2547 | 7×13 |  |  | #b8f21e 3px center |  |  |  |
| Proceso | Vector 29 (1532:3017) | 1169,2573 | 67×47 |  |  | #ffffff 1px center |  |  |  |
| ·Proceso › Chevron right | Icon (I1532:3019;7758:11234) | 250,2582 | 7×13 |  |  | #b8f21e 2px center |  |  |  |
| ·Proceso › Chevron right | Icon (I1532:3021;7758:11234) | 586,2582 | 7×13 |  |  | #b8f21e 3px center |  |  |  |
| ·Proceso › Chevron right | Icon (I1532:3018;7758:11234) | 250,2616 | 7×13 |  |  | #b8f21e 3px center |  |  |  |
| ···Group › Group | Vector (1543:6555) | 246,2710 | 30×25 |  | #b8f21e |  |  |  |  |
| ···Group › Group | Vector (1543:6556) | 275,2713 | 3×3 |  | #b8f21e |  |  |  |  |
| ···Group › Group | Vector (1543:6557) | 280,2713 | 3×3 |  | #b8f21e |  |  |  |  |
| ···Group › Group | Vector (1543:6558) | 286,2713 | 3×3 |  | #b8f21e |  |  |  |  |
| ···Group › Group | Vector (1543:6560) | 265,2705 | 33×25 |  | #779eff |  |  |  |  |
| ···Group › Group | Vector (1543:6561) | 242,2733 | 56×32 |  | #779eff |  |  |  |  |

_Nodos ocultos: 0 · nodos más profundos que 6: 17_

## 07 · Tecnología (band:tecnologia) — 1920×804 @ y=7941

![Tecnología](png/07-tecnologia.png)

Componente: `src/components/sections/Technology.tsx`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (32)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 914,182 | tecnologia |  | Montserrat | 600 | 12 | 22 | 0.6px (0.05em) | UPPER | #b8f21e | center/center | 92  |
| 609,236 | Tecnología que impulsa⏎lo que construimos |  | Montserrat | 700 | 52 | 54 | 0 | — | #f1f3fe | center/top | 705  |
| 609,367 | Combinamos las tecnologías líderes en inteligencia artificial, desarr… |  | Montserrat | 400 | 20 | 28 | 0 | — | #c7d7ff | center/top | 705  |
| 21,599 | LangChain |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 90  |
| 188,599 | Claude |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 62  |
| 330,599 | GPT |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 36  |
| 1008,599 | AWS |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 40  |
| 570,599 | n8n |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 40  |
| 690,599 | Supabase |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 80  |
| 450,599 | MCP |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 40  |
| 855,599 | Firebase |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 80  |
| 1133,599 | Vercel |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 52  |
| 1269,599 | Figma |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 57  |
| 1409,599 | GitHub |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 60  |
| 1553,599 | Twilio |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 52  |
| 1821,599 | PostgreSQL |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 101  |
| 1690,599 | Redis |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 52  |
| -12,683 | Twilio |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 52  |
| 1028,683 | Firebase |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 74  |
| 581,683 | React |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 55  |
| 715,683 | Next.js |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 59  |
| 853,683 | TypeScript |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 92  |
| 1180,683 | Docker |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 64  |
| 1322,683 | Cloudflare |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 96  |
| 435,683 | Node.js |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 65  |
| 256,683 | PostgreSQL |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 101  |
| 125,683 | Redis |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 52  |
| 1483,683 | LangChain |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 90  |
| 1650,683 | Claude |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 62  |
| 1792,683 | GPT |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 36  |
| 1912,683 | MCP |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 40  |
| 2051,759 | Node.js |  | Montserrat | 500 | 16 | 33 | 0 | — | #ffffff | left/center | 65  |

### Contenedores (131)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| Tecnología | Vector 17 (1532:2932) | 0,0 | 1920×0 |  |  | #6994ff 0.5px inside |  |  |  |
| ···Frame 293 › Frame 240 | Servicio Digital experience (1532:3114) | 902,177 | 116×28 | 50 | rgba(213,218,233,0.08) | #94b2fc 0.3px inside |  | clip |  |
| ·Tecnología › Frame 246 | Rectangle 168 (1532:2618) | 1945,578 | 136×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 246 | Ellipse 63 (1532:2619) | 1954,587 | 37×38 |  | #ffffff |  |  |  |  |
| ···Frame › Group | Vector (1532:2622) | 1960,593 | 25×26 |  | #09a56b |  |  |  |  |
| ···Frame › Group | Vector (1532:2623) | 1971,601 | 11×11 |  | #09a56b |  |  |  |  |
| ·Tecnología › Frame 246 | Vector (1532:2624) | 644,587 | 38×38 |  | #3ecf8e |  |  |  |  |
| ·Tecnología › Frame 246 | Rectangle 78 (1532:2625) | -34,578 | 157×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 246 | Ellipse 32 (1532:2627) | -25,587 | 37×38 |  | #ffffff |  |  |  |  |
| ·Tecnología › Frame 246 | Rectangle 147 (1532:2628) | 133,578 | 132×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 246 | Rectangle 148 (1532:2629) | 275,578 | 110×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 246 | Rectangle 149 (1532:2630) | 395,578 | 110×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 246 | Rectangle 151 (1532:2631) | 635,578 | 155×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 246 | Rectangle 150 (1532:2632) | 515,578 | 110×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 246 | Rectangle 152 (1532:2633) | 800,578 | 143×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 246 | Rectangle 153 (1532:2634) | 1078,578 | 126×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 246 | Rectangle 154 (1532:2635) | 1214,578 | 130×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 246 | Rectangle 155 (1532:2636) | 1354,578 | 134×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 246 | Ellipse 45 (1532:2638) | 142,587 | 37×38 |  | #ffffff |  |  |  |  |
| ·Tecnología › Frame 246 | Ellipse 46 (1532:2640) | 284,587 | 37×38 |  | #ffffff |  |  |  |  |
| ·Tecnología › Frame 246 | Vector (1532:2641) | 146,592 | 30×29 |  | #d97757 |  |  |  |  |
| ·Tecnología › Frame 246 | Rectangle 153 (1532:2642) | 953,578 | 115×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 246 | Ellipse 50 (1532:2644) | 962,587 | 37×38 |  | #ffffff |  |  |  |  |
| ···Frame › Group | Vector (1532:2647) | 968,599 | 26×8 |  | #252f3e |  |  |  |  |
| ····Group › Group | Vector (1532:2649) | 967,610 | 26×5 |  | #ff9900 |  |  |  |  |
| ····Group › Group | Vector (1532:2650) | 990,609 | 5×5 |  | #ff9900 |  |  |  |  |
| ··Frame 246 › Group | Vector (1532:2652) | -4,603 | 7×7 |  | #000000 |  |  |  |  |
| ··Frame 246 › Group | Vector (1532:2653) | -21,599 | 29×15 |  | #000000 |  |  |  |  |
| ··Frame 246 › Group | Vector (1532:2654) | -11,609 | 1×2 |  | #000000 |  |  |  |  |
| ·Tecnología › Frame 246 | Ellipse 49 (1532:2658) | 810,587 | 37×38 |  | #ffffff |  |  |  |  |
| ···Frame › Group | Vector (1532:2661) | 824,614 | 8×4 |  | #ff9100 |  |  |  |  |
| ···Frame › Group | Vector (1532:2662) | 818,603 | 10×14 |  | #ffc400 |  |  |  |  |
| ···Frame › Group | Vector (1532:2663) | 823,604 | 6×11 |  | #ff9100 |  |  |  |  |
| ···Frame › Group | Vector (1532:2664) | 823,594 | 15×23 |  | #dd2c00 |  |  |  |  |
| ·Tecnología › Frame 246 | Ellipse 48 (1532:2666) | 524,587 | 37×38 |  | #ffffff |  |  |  |  |
| ·Tecnología › Frame 246 | Ellipse 50 (1532:2667) | 1088,587 | 37×38 |  | #ffffff |  |  |  |  |
| ·Tecnología › Frame 246 | Ellipse 51 (1532:2668) | 1224,587 | 37×38 |  | #ffffff |  |  |  |  |
| ·Tecnología › Frame 246 | Ellipse 52 (1532:2669) | 1364,587 | 37×38 |  | #ffffff |  |  |  |  |
| ···Frame › Group | Vector (1532:2672) | 1370,594 | 25×24 |  | #161614 |  |  |  |  |
| ···Frame › Group | Vector (1532:2673) | 1374,611 | 5×3 |  | #161614 |  |  |  |  |
| ··Frame 246 › Frame | Vector (1532:2676) | 1243,604 | 8×8 |  | #1abcfe |  |  |  |  |
| ··Frame 246 › Frame | Vector (1532:2677) | 1235,611 | 8×8 |  | #0acf83 |  |  |  |  |
| ··Frame 246 › Frame | Vector (1532:2678) | 1243,596 | 8×8 |  | #ff7262 |  |  |  |  |
| ··Frame 246 › Frame | Vector (1532:2679) | 1235,596 | 8×8 |  | #f24e1e |  |  |  |  |
| ··Frame 246 › Frame | Vector (1532:2680) | 1235,604 | 8×8 |  | #a259ff |  |  |  |  |
| ·Tecnología › Frame 246 | Ellipse 47 (1532:2684) | 404,587 | 37×38 |  | #ffffff |  |  |  |  |
| ··Frame 246 › Frame | Vector (1532:2686) | 409,592 | 27×29 |  | #000000 |  |  |  |  |
| ··Frame 246 › Frame | Vector (1532:2687) | 413,596 | 18×18 |  | #000000 |  |  |  |  |
| ··Frame 246 › Frame | Vector (1532:2689) | 529,598 | 28×15 |  | #ea4b71 |  |  |  |  |
| ·Tecnología › Frame 246 | Rectangle 167 (1532:2690) | 1498,578 | 127×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 246 | Ellipse 62 (1532:2692) | 1507,587 | 37×38 |  | #ffffff |  |  |  |  |
| ···Frame › Group | Vector (1532:2695) | 1513,593 | 26×26 |  | #cf272d |  |  |  |  |
| ···Frame › Group | Vector (1532:2696) | 1520,600 | 12×12 |  | #cf272d |  |  |  |  |
| ·Tecnología › Frame 246 | Vector (1532:2697) | 289,593 | 27×27 |  | #000000 |  |  |  |  |
| ·Tecnología › Frame 246 | Vector (1532:2698) | 1095,596 | 22×18 |  | #000000 |  |  |  |  |
| ·Tecnología › Frame 246 | Rectangle 169 (1532:2699) | 1766,578 | 169×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 246 | Ellipse 64 (1532:2701) | 1775,587 | 37×38 |  | #ffffff |  |  |  |  |
| ··Frame 246 › Group | Vector (1532:2703) | 1781,594 | 26×27 |  | #6a778f |  |  |  |  |
| ··Frame 246 › Group | Vector (1532:2704) | 1782,595 | 25×26 |  | #ffffff |  |  |  |  |
| ·Tecnología › Frame 246 | Rectangle 170 (1532:2705) | 1635,578 | 121×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 246 | Ellipse 65 (1532:2707) | 1644,587 | 37×38 |  | #ffffff |  |  |  |  |
| ··Frame 246 › Frame 244 | Vector (1532:2709) | 1649,606 | 28×11 |  | #912626 |  |  |  |  |
| ··Frame 246 › Frame 244 | Vector (1532:2710) | 1649,604 | 28×12 |  | #c6302b |  |  |  |  |
| ··Frame 246 › Frame 244 | Vector (1532:2711) | 1649,602 | 28×11 |  | #912626 |  |  |  |  |
| ··Frame 246 › Frame 244 | Vector (1532:2712) | 1649,600 | 28×11 |  | #c6302b |  |  |  |  |
| ··Frame 246 › Frame 244 | Vector (1532:2713) | 1649,597 | 28×11 |  | #912626 |  |  |  |  |
| ··Frame 246 › Frame 244 | Vector (1532:2714) | 1649,595 | 28×12 |  | #c6302b |  |  |  |  |
| ··Frame 246 › Frame 244 | Vector (1532:2715) | 1654,596 | 12×8 |  | #ffffff |  |  |  |  |
| ··Frame 246 › Frame 244 | Vector (1532:2716) | 1669,599 | 4×2 |  | #621b1c |  |  |  |  |
| ··Frame 246 › Frame 244 | Vector (1532:2717) | 1665,599 | 4×3 |  | #9a2928 |  |  |  |  |
| ·Tecnología › Frame 247 | Rectangle 156 (1532:3121) | -67,662 | 127×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 247 | Ellipse 53 (1532:3123) | -58,671 | 37×38 |  | #ffffff |  |  |  |  |
| ·Tecnología › Frame 247 | Rectangle 161 (1532:3124) | 526,662 | 124×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 247 | Rectangle 162 (1532:3125) | 660,662 | 128×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 247 | Rectangle 166 (1532:3126) | 798,662 | 165×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 247 | Rectangle 163 (1532:3127) | 1125,662 | 132×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 247 | Rectangle 164 (1532:3128) | 1267,662 | 151×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 247 | Rectangle 153 (1532:3129) | 973,662 | 142×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 247 | Ellipse 50 (1532:3131) | 982,671 | 37×38 |  | #ffffff |  |  |  |  |
| ··Frame 247 › Frame | Vector (1532:3133) | 989,679 | 18×16 |  | linear-gradient(132deg, #387eb8 0%, #366994 100%) |  |  |  |  |
| ··Frame 247 › Frame | Vector (1532:3134) | 995,685 | 18×16 |  | linear-gradient(131deg, #ffe052 0%, #ffc331 100%) |  |  |  |  |
| ·Tecnología › Frame 247 | Ellipse 56 (1532:3136) | 670,671 | 37×38 |  | #ffffff |  |  |  |  |
| ·Tecnología › Frame 247 | Ellipse 61 (1532:3137) | 808,671 | 37×38 |  | #ffffff |  |  |  |  |
| ···Frame › Group | Vector (1532:3140) | 816,679 | 22×21 |  | #007acc |  |  |  |  |
| ···Frame › Group | Vector (1532:3141) | 821,689 | 15×10 |  | #ffffff |  |  |  |  |
| ·Tecnología › Frame 247 | Ellipse 57 (1532:3144) | 535,671 | 37×38 |  | #ffffff |  |  |  |  |
| ·Tecnología › Frame 247 | Ellipse 58 (1532:3145) | 1135,671 | 37×38 |  | #ffffff |  |  |  |  |
| ··Frame 247 › Frame | Vector (1532:3147) | 1139,683 | 29×17 |  | #0091e2 |  |  |  |  |
| ··Frame 247 › Frame | Vector (1532:3148) | 1141,679 | 17×9 |  | #0091e2 |  |  |  |  |
| ·Tecnología › Frame 247 | Ellipse 59 (1532:3149) | 1277,671 | 37×38 |  | #ffffff |  |  |  |  |
| ····Group › Frame 72 | Vector (1532:3153) | 1282,680 | 30×18 |  | #f38020 |  |  |  |  |
| ····Group › Frame 72 | Vector (1532:3154) | 1310,688 | 11×10 |  | #faae40 |  |  |  |  |
| ·Tecnología › Frame 247 | Rectangle 159 (1532:3157) | 380,662 | 136×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 247 | Ellipse 61 (1532:3159) | 389,671 | 37×38 |  | #ffffff |  |  |  |  |
| ···Frame › Group | Vector (1532:3162) | 395,677 | 25×26 |  | #09a56b |  |  |  |  |
| ···Frame › Group | Vector (1532:3163) | 406,685 | 11×11 |  | #09a56b |  |  |  |  |
| ···Frame › Group | Vector (1532:3166) | 539,678 | 29×25 |  | #17b0da |  |  |  |  |
| ···Frame › Group | Vector (1532:3167) | 551,688 | 5×5 |  | #17b0da |  |  |  |  |
| ··Frame 247 › Group | Vector (1532:3169) | 675,677 | 27×27 |  | #000000 |  |  |  |  |
| ·Tecnología › Frame 247 | Rectangle 158 (1532:3170) | 201,662 | 169×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 247 | Ellipse 55 (1532:3172) | 210,671 | 37×38 |  | #ffffff |  |  |  |  |
| ··Frame 247 › Group | Vector (1532:3174) | 216,678 | 26×27 |  | #6a778f |  |  |  |  |
| ··Frame 247 › Group | Vector (1532:3175) | 217,679 | 25×26 |  | #ffffff |  |  |  |  |
| ·Tecnología › Frame 247 | Rectangle 157 (1532:3176) | 70,662 | 121×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 247 | Ellipse 54 (1532:3178) | 79,671 | 37×38 |  | #ffffff |  |  |  |  |
| ··Frame 247 › Frame 243 | Vector (1532:3180) | 84,690 | 28×11 |  | #912626 |  |  |  |  |
| ··Frame 247 › Frame 243 | Vector (1532:3181) | 84,688 | 28×12 |  | #c6302b |  |  |  |  |
| ··Frame 247 › Frame 243 | Vector (1532:3182) | 84,686 | 28×11 |  | #912626 |  |  |  |  |
| ··Frame 247 › Frame 243 | Vector (1532:3183) | 84,684 | 28×11 |  | #c6302b |  |  |  |  |
| ··Frame 247 › Frame 243 | Vector (1532:3184) | 84,681 | 28×11 |  | #912626 |  |  |  |  |
| ··Frame 247 › Frame 243 | Vector (1532:3185) | 84,679 | 28×12 |  | #c6302b |  |  |  |  |
| ··Frame 247 › Frame 243 | Vector (1532:3186) | 89,680 | 12×8 |  | #ffffff |  |  |  |  |
| ··Frame 247 › Frame 243 | Vector (1532:3187) | 104,683 | 4×2 |  | #621b1c |  |  |  |  |
| ··Frame 247 › Frame 243 | Vector (1532:3188) | 100,683 | 4×3 |  | #9a2928 |  |  |  |  |
| ·Tecnología › Frame 247 | Rectangle 171 (1532:3189) | 1428,662 | 157×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 247 | Ellipse 66 (1532:3191) | 1437,671 | 37×38 |  | #ffffff |  |  |  |  |
| ·Tecnología › Frame 247 | Rectangle 172 (1532:3192) | 1595,662 | 132×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 247 | Rectangle 173 (1532:3193) | 1737,662 | 110×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 247 | Ellipse 67 (1532:3195) | 1604,671 | 37×38 |  | #ffffff |  |  |  |  |
| ·Tecnología › Frame 247 | Ellipse 68 (1532:3197) | 1746,671 | 37×38 |  | #ffffff |  |  |  |  |
| ·Tecnología › Frame 247 | Vector (1532:3198) | 1608,676 | 30×29 |  | #d97757 |  |  |  |  |
| ··Frame 247 › Group | Vector (1532:3200) | 1458,687 | 7×7 |  | #000000 |  |  |  |  |
| ··Frame 247 › Group | Vector (1532:3201) | 1441,683 | 29×15 |  | #000000 |  |  |  |  |
| ··Frame 247 › Group | Vector (1532:3202) | 1451,693 | 1×2 |  | #000000 |  |  |  |  |
| ·Tecnología › Frame 247 | Vector (1532:3203) | 1751,677 | 27×27 |  | #000000 |  |  |  |  |
| ···Frame › Group | Vector (1532:3206) | -52,677 | 26×26 |  | #cf272d |  |  |  |  |
| ···Frame › Group | Vector (1532:3207) | -45,684 | 12×12 |  | #cf272d |  |  |  |  |
| ·Tecnología › Frame 247 | Rectangle 149 (1532:3208) | 1857,662 | 110×55 | 47 | rgba(255,255,255,0.1) | rgba(148,178,252,0.61) 0.5px inside |  |  |  |
| ·Tecnología › Frame 247 | Ellipse 47 (1532:3210) | 1866,671 | 37×38 |  | #ffffff |  |  |  |  |
| ··Frame 247 › Frame | Vector (1532:3212) | 1871,676 | 27×29 |  | #000000 |  |  |  |  |
| ··Frame 247 › Frame | Vector (1532:3213) | 1875,680 | 18×18 |  | #000000 |  |  |  |  |

_Nodos ocultos: 0 · nodos más profundos que 6: 0_

## 08 · Pruebas no promesas (band:pruebas-no-promesas) — 1920×1011 @ y=8745

![Pruebas no promesas](png/08-pruebas-no-promesas.png)

Componente: `src/components/sections/CaseStudies.tsx`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (17)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 240,311 | Pruebas no promesas |  | Montserrat | 700 | 52 | 54 | 0 | — | #ffffff | left/top | 455  |
| 245,439 | Los resultados hablan más fuerte que cualquier presentación.⏎ |  | Montserrat | 400 | 20 | 28 | 0 | — | #c7d7ff | left/top | 390  |
| 784,355 | + Clientes |  | Montserrat | 500 | 45 | 48 | 0 | — | #1a4dff | left/top | 355  |
| 826,413 | Automatizamos cada interacción para convertir visitantes en clientes. |  | Montserrat | 300 | 20 | 25 | 0 | — | #779eff | left/top | 254  |
| 1169,520 | Conversión |  | Montserrat | 400 | 20 | 20 | 0 | — | #1cfcb9 | left/center | 115  |
| 1169,492 | +40% |  | Montserrat | 600 | 35 | 20 | 0 | — | #ffffff | left/top | 120  |
| 1188,378 | Atención 24/7⏎ |  | Montserrat | 500 | 15 | 15 | 0 | — | #ecefff | left/top | 126  |
| 1188,326 | Seguimiento inteligente |  | Montserrat | 500 | 15 | 15 | 0 | — | #ecefff | left/top | 192  |
| 2045,334 | Trabajo manual |  | Montserrat | 400 | 20 | 20 | 0 | — | #1cfcb9 | left/center | 160  |
| 2045,306 | -70% |  | Montserrat | 600 | 35 | 20 | 0 | — | #ffffff | left/top | 120  |
| 2064,455 | Flujo inteligente⏎ |  | Montserrat | 400 | 15 | 15 | 0 | — | #ecefff | left/top | 126  |
| 2064,507 | Procesos automaticos |  | Montserrat | 400 | 15 | 15 | 0 | — | #ecefff | left/top | 172  |
| 1662,350 | + Tiempo |  | Montserrat | 500 | 45 | 48 | 0 | — | #1a4dff | left/top | 355  |
| 1704,408 | Procesos inteligentes que eliminan tareas repetitivas y conectan toda… |  | Montserrat | 300 | 20 | 25 | 0 | — | #779eff | left/top | 237  |
| 240,546 |  Ver casos existoros → |  | Montserrat | 500 | 14 | 24 | 0 | — | #1cfcb9 | left/top | 508  |
| ↳ |  Ver casos existoros | | = | = | = | = | = | = | = | | |
| ↳ |  → | | = | = | = | = | = | = | #1cfcb9 | | |

### Contenedores (19)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| Pruebas no promesas | Rectangle 2 (1532:3214) | 1681,-752 | 239×1579 |  | linear-gradient(270deg, #030617 0%, rgba(3,6,23,0) 100%) |  |  |  |  |
| Pruebas no promesas | Rectangle 147 (1532:3215) | 0,-751 | 242×1578 |  | linear-gradient(90deg, #030617 0%, rgba(3,6,23,0) 100%) |  |  |  |  |
| Pruebas no promesas | Rectangle 162 (1555:78050) | -4,0 | 1920×827 |  | linear-gradient(180deg, #030617 0%, #040b24 100%) |  |  |  |  |
| ·Pruebas no promesas › Frame 300 | Frame 87 (1532:2937) | 731,244 | 826×365 |  |  |  | box-shadow: 0px 0px 150px 0px rgba(26,77,255,0.5) |  |  |
| ·Pruebas no promesas › Frame 300 | Servicio Digital experience (1532:2938) | 731,244 | 826×365 | 25 | linear-gradient(247deg, #101837 0%, #050b21 100%) | conic-gradient(#6994ff 12%, #1a4dff 50%, #6994ff 85%) 2px i… | box-shadow: 0px 0px 81.8px 25px rgba(26,77,255,0.5) | clip | 0.5 |
| ··Frame 300 › Servicio Digital experi… | Vector (1532:2939) | 833,50 | 600×377 |  | radial-gradient(300px 189px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ·Pruebas no promesas › Frame 300 | Servicio Digital experience (1532:2942) | 1144,282 | 376×290 | 16 | linear-gradient(180deg, #1a4dff 21%, #03259b 100%) |  |  | clip |  |
| ··Frame 300 › Servicio Digital experi… | Vector (1532:2943) | 996,176 | 508×475 |  | radial-gradient(254px 238px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ··Frame 300 › Servicio Digital experi… | Rectangle 104 (1532:2946) | 1169,362 | 147×45 | 20 | linear-gradient(180deg, #182a6d 0%, #101837 100%) |  |  |  |  |
| ··Frame 300 › Servicio Digital experi… | Rectangle 104 (1532:2948) | 1169,310 | 221×45 | 20 | linear-gradient(180deg, #182a6d 0%, #101837 100%) |  |  |  |  |
| ···Servicio Digital experi… › Frame | Vector (1532:2951) | 1317,376 | 179×197 |  | linear-gradient(179deg, #1cfcb9 0%, #38d4ff 100%) |  |  |  |  |
| ··Frame 300 › Frame 234 | Frame 224 (1532:2953) | 1609,239 | 826×365 |  |  |  | box-shadow: 0px 0px 150px 0px rgba(26,77,255,0.5) |  |  |
| ··Frame 300 › Frame 234 | Servicio Digital experience (1532:2954) | 1609,239 | 826×365 | 25 | linear-gradient(247deg, #101837 0%, #050b21 100%) | conic-gradient(#6994ff 26%, #1a4dff 50%, #6994ff 74%) 1px i… |  | clip | 0.5 |
| ···Frame 234 › Servicio Digital experi… | Vector (1532:2955) | 1709,72 | 626×333 |  | radial-gradient(313px 167px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ··Frame 300 › Frame 234 | Servicio Digital experience (1532:2956) | 2020,277 | 376×290 | 16 | linear-gradient(180deg, #1a4dff 21%, #03259b 100%) |  |  | clip |  |
| ···Frame 234 › Servicio Digital experi… | Vector (1532:2957) | 1855,164 | 541×475 |  | radial-gradient(271px 238px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ····Servicio Digital experi… › Frame 84 | Rectangle 104 (1532:2961) | 2045,439 | 161×45 | 20 | linear-gradient(90deg, #182a6d 0%, #101837 100%) |  |  |  |  |
| ····Servicio Digital experi… › Frame 85 | Rectangle 104 (1532:2964) | 2045,491 | 207×45 | 20 | linear-gradient(90deg, #182a6d 0%, #101837 100%) |  |  |  |  |
| ····Servicio Digital experi… › Frame | Vector (1532:2967) | 2230,370 | 104×104 |  | linear-gradient(180deg, #1cfcb9 0%, #38d4ff 100%) |  |  |  |  |

_Nodos ocultos: 0 · nodos más profundos que 6: 0_

## 09 · Calculadora (band:calculadora) — 1920×670 @ y=9756

![Calculadora](png/09-calculadora.png)

Componente: `src/components/sections/Roi.tsx`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (25)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 412,112 | calculadora |  | Montserrat | 600 | 12 | 22 | 0.6px (0.05em) | UPPER | #b8f21e | center/center | 125  |
| 944,112 | Ejemplo real de una cuenta |  | Montserrat | 600 | 22 | 23 | 0 | — | #000000 | center/center | 577  |
| 412,158 | Antes de contratar nada, haz la cuenta. |  | Montserrat | 600 | 35 | 40 | 0 | — | #ffffff | left/center | 462  |
| ↳ | haz la cuenta. | | = | = | = | = | = | = | #1a4dff | | |
| 981,163 | Ingreso medio |  | Montserrat | 700 | 12 | 17 | 0 | — | #000000 | left/top | 209  |
| 1240,163 | Frecuencia media |  | Montserrat | 700 | 12 | 17 | 0 | — | #000000 | left/top | 209  |
| 1004,202 | 6 visitas al año por cliente |  | Montserrat | 500 | 15 | 30 | 0 | — | #000000 | left/top | 209  |
| 1260,202 | 6 visitas al año por cliente |  | Montserrat | 500 | 15 | 30 | 0 | — | #000000 | left/top | 209  |
| 981,262 | Consultas sin responder |  | Montserrat | 700 | 12 | 17 | 0 | — | #000000 | left/top | 209  |
| 1240,262 | Reservas perdidas |  | Montserrat | 700 | 12 | 17 | 0 | — | #000000 | left/top | 209  |
| 412,263 | Ni un folleto ni una promesa: tus cifras, nuestras hipótesis a la vis… |  | Montserrat | 400 | 18 | 27 | 0 | — | #ffffff | left/top | 485  |
| ↳ | Ni un folleto ni una promesa:  | | = | 600 | = | = | = | = | = | | |
| 1004,297 | 10 consultas a la semana sin responder |  | Montserrat | 500 | 15 | 17 | 0 | — | #000000 | left/top | 209  |
| 1260,299 | 12 plantones al mes |  | Montserrat | 500 | 15 | 30 | 0 | — | #000000 | left/top | 209  |
| 1004,386 | Se le escapa hoy |  | Montserrat | 500 | 15 | 16 | 0 | — | #c7d7ff | left/center | 276  |
| 1398,388 | 2.338 € |  | Montserrat | 700 | 18 | 16 | 0 | — | #c7d7ff | right/center | 71  |
| 1004,410 | Le quedaría a favor cada mes |  | Montserrat | 500 | 15 | 16 | 0 | — | #c7d7ff | left/center | 256  |
| 1398,412 | 507 € |  | Montserrat | 700 | 18 | 16 | 0 | — | #b8f21e | right/center | 71  |
| 409,443 | Hacer la cuenta con mis numeros |  | Montserrat | 600 | 15 | 16 | 0 | — | #030617 | center/center | 343  |
| 1295,472 |  3.9 meses⏎ |  | Montserrat | 700 | 35 | 30 | 0 | — | #ffffff | right/top | 174  |
| ↳ |   | | = | 600 | 25 | = | = | = | #ffffff | | |
| ↳ | 3.9  | | = | 600 | 45 | = | = | = | #ffffff | | |
| ↳ | meses⏎ | | = | 600 | 25 | = | = | = | #ffffff | | |
| 1004,486 | Se paga solo en  |  | Montserrat | 600 | 18 | 22 | 0 | — | #ffffff | left/top | 167  |
| 412,532 | Sin registro. Cuatro preguntas. Las hipótesis, en pantalla. |  | Montserrat | 500 | 12 | 22 | 0 | — | #c7d7ff | left/top | 409  |

### Contenedores (10)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| Calculadora | Rectangle 141 (1532:3051) | 362,36 | 1196×568 | 35 | linear-gradient(180deg, #09112d 0%, #0e1f5c 100%) | conic-gradient(#6994ff 26%, #1a4dff 50%, #6994ff 72%) 1.3px… |  |  |  |
| Calculadora | Rectangle 144 (1532:3055) | 944,71 | 577×498 | 35 | linear-gradient(180deg, #ffffff 0%, #c7d7ff 100%) | rgba(148,178,252,0.5) 1.3px center |  |  |  |
| ·Calculadora › Frame 294 | Servicio Digital experience (1532:3116) | 412,107 | 129×28 | 50 | rgba(213,218,233,0.08) | #94b2fc 0.3px inside |  | clip |  |
| Calculadora ⧉ Size=Small, Color=Primary con… | Extended FAB (1532:3056) | 981,186 | 250×60 | 16 | #ffffff |  | box-shadow: 0px 1px 4px 0px rgba(12,12,13,0.05), 0px 1px 4px 0px rgba(12,12,13,0.1) | H justify=center align=center clip |  |
| Calculadora ⧉ Size=Small, Color=Primary con… | Extended FAB (1532:3057) | 1240,186 | 250×60 | 16 | #ffffff |  | box-shadow: 0px 1px 4px 0px rgba(12,12,13,0.05), 0px 1px 4px 0px rgba(12,12,13,0.1) | H justify=center align=center clip |  |
| Calculadora ⧉ Size=Small, Color=Primary con… | Extended FAB (1532:3060) | 981,283 | 250×60 | 16 | #ffffff |  | box-shadow: 0px 1px 4px 0px rgba(12,12,13,0.05), 0px 1px 4px 0px rgba(12,12,13,0.1) | H justify=center align=center clip |  |
| Calculadora ⧉ Size=Small, Color=Primary con… | Extended FAB (1532:3061) | 1240,283 | 250×60 | 16 | #ffffff |  | box-shadow: 0px 1px 4px 0px #a7b2d1, 0px 1px 4px 0px rgba(54,54,68,0.1) | H justify=center align=center clip |  |
| Calculadora | Rectangle 140 (1532:3069) | 981,363 | 509×169 | 16 | #1a4dff |  |  |  |  |
| ·Calculadora › Frame 236 | Rectangle 145 (1532:3100) | 409,422 | 375×66 | 47 | #c7d7ff |  |  |  |  |
| ··Frame 236 › Arrow right | Icon (I1532:3102;7758:11060) | 727,446 | 19×20 |  |  | #1a4dff 2px center |  |  |  |

_Nodos ocultos: 0 · nodos más profundos que 6: 0_

## 10 · Planes 2026 (band:planes-2026) — 1920×754 @ y=10426

![Planes 2026](png/10-planes-2026.png)

Componente: `src/components/sections/Plans.tsx`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (21)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 913,65 | planes 2026 |  | Montserrat | 600 | 12 | 22 | 0.6px (0.05em) | UPPER | #b8f21e | center/center | 94  |
| 609,123 | Planes simples que escalan contigo |  | Montserrat | 700 | 52 | 54 | 0 | — | #f1f3fe | center/top | 702  |
| 485,254 | Precios iniciales transparentes para un crecimiento impulsado por IA.… |  | Montserrat | 400 | 20 | 28 | 0 | — | #c7d7ff | center/top | 950  |
| 498,449 | Arranque |  | Montserrat | 600 | 24 | 30 | 0 | — | #ffffff | center/center | 302  |
| 392,443 | ◇ |  | Inter | 300 | 36 | 26 | 0 | — | #1a4dff | left/center | 41  |
| 498,476 | 2.900 € de puesta en marcha |  | Montserrat | 500 | 16 | 16 | 0 | — | #b8f21e | center/top | 301  |
| ↳ | 2.900 €  | | = | 600 | = | = | = | = | = | | |
| ↳ | de puesta en marcha | | = | 400 | = | = | = | = | = | | |
| 809,452 | Core |  | Montserrat | 600 | 24 | 30 | 0 | — | #000000 | center/center | 302  |
| 703,443 | ◇ |  | Inter | 300 | 36 | 26 | 0 | — | #1a4dff | left/center | 41  |
| 809,476 | 5.900 € de puesta en marcha |  | Montserrat | 600 | 16 | 16 | 0 | — | #1a4dff | center/top | 301  |
| ↳ | de puesta en marcha | | = | 400 | = | = | = | = | = | | |
| 1221,453 | Nexus |  | Montserrat | 600 | 24 | 30 | 0 | — | #000000 | center/center | 100  |
| 1014,443 | ◇ |  | Inter | 300 | 36 | 26 | 0 | — | #1a4dff | left/center | 41  |
| 1120,476 | 18.000 € de puesta en marcha |  | Montserrat | 600 | 16 | 16 | 0 | — | #1a4dff | center/top | 301  |
| ↳ | de puesta en marcha | | = | 400 | = | = | = | = | = | | |
| 1004,612 | 45 € de media por visita |  | Montserrat | 500 | 15 | 30 | 0 | — | #000000 | left/top | 209  |
| 608,638 | ¿Necesitas algo personalizado? Habla con nuestro equipo → |  | Montserrat | 500 | 14 | 24 | 0 | — | #1cfcb9 | center/top | 704  |
| ↳ | ¿Necesitas algo personalizado? | | = | = | = | = | = | = | #ecefff | | |
| ↳ |   | | = | = | = | = | = | = | = | | |
| ↳ | Habla con nuestro equipo → | | = | = | = | = | = | = | = | | |

### Contenedores (7)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| ·Planes 2026 › Frame 292 | Servicio Digital experience (1532:3118) | 906,60 | 108×28 | 50 | rgba(213,218,233,0.08) | #94b2fc 0.3px inside |  | clip |  |
| ·····Frame › i2 | Vector (1532:3034) | 710,408 | 40×41 |  | #b8f21e |  |  |  |  |
| ·····Frame › i2 | Vector (1532:3040) | 1024,408 | 41×41 |  | #1a4dff |  |  |  |  |
| ·····Frame › i2 | Vector (1532:3050) | 1339,408 | 41×41 |  | #1a4dff |  |  |  |  |
| Planes 2026 | Servicio Digital experience (1532:2908) | 498,428 | 301×88 | 30 | linear-gradient(180deg, #1a4dff 0%, #102e99 100%) | #1a4dff 1px inside |  | clip |  |
| Planes 2026 | Servicio Digital experience (1532:2912) | 809,428 | 301×88 | 30 | #ffffff |  |  | clip |  |
| Planes 2026 | Servicio Digital experience (1532:2916) | 1120,428 | 301×88 | 30 | #ffffff |  |  | clip |  |

_Nodos ocultos: 0 · nodos más profundos que 6: 0_

## 11 · Hablemos (band:hablemos) — 1920×536 @ y=11180

![Hablemos](png/11-hablemos.png)

Componente: `src/components/sections/FinalCTA.tsx`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (19)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 485,403 | Pregunta a nuestra AI → |  | Montserrat | 500 | 18 | 24 | 0 | — | #1a4dff | left/top | 623  |
| ↳ | Pregunta a nuestra AI | | = | = | = | = | = | = | = | | |
| 485,430 | Hablale en voz alta → |  | Montserrat | 500 | 18 | 24 | 0 | — | #1a4dff | left/top | 623  |
| 1041,645 |        Privacidad  /  aviso legal  /  cookies  /  preferencias de coo… |  | Montserrat | 400 | 14 | 66 | 0 | — | #000000 | right/center | 639  |
| ↳ |         | | = | 600 | = | = | = | = | = | | |
| ↳ | Privacidad  | | = | 600 | = | = | 0.98px (0.07em) | UPPER | = | | |
| ↳ |  /  aviso legal | | = | 600 | = | = | 0.98px (0.07em) | UPPER | = | | |
| ↳ |   /  cookies  /  preferencias de cookies | | = | 600 | = | = | 0.98px (0.07em) | UPPER | = | | |
| 1481,151 | Plataforma⏎    Servicios⏎    Ecosistema⏎    Pruebas⏎    Proceso⏎    C… |  | Montserrat | 500 | 16 | 34 | 1.12px (0.07em) | — | #000000 | right/center | 199  |
| 801,673 | © 2026 Asenix   Todos los derechos reservados. |  | Montserrat | 500 | 14 | 66 | 0.98px (0.07em) | — | #586a96 | right/center | 879  |
| ↳ | © 2026 Asenix    | | = | 700 | = | = | = | = | #000000 | | |
| 344,628 | Diseñamos el futuro de los negocios digitales.⏎Experiencias digitales… |  | Montserrat | 400 | 16 | 24 | 0 | — | rgba(4,5,10,0.9) | left/center | 459  |
| ↳ | Diseñamos el futuro de los negocios digitales.⏎ | | = | 600 | = | = | = | = | = | | |
| ↳ | Experiencias digitales excepcionales. Automatización inteligente. Tec… | | = | = | = | = | = | = | = | | |
| 240,151 | Hablemos. Nos encantaría conocer tu proyecto |  | Montserrat | 600 | 60 | 65 | -3px (-0.05em) | — | #1a4dff | left/center | 580  |
| ↳ | Hablemos. | | = | = | = | = | = | = | #000000 | | |
| ↳ |   | | = | = | = | = | = | = | = | | |
| ↳ | Nos encantaría conocer tu proyecto | | = | 400 | = | = | = | = | #000000 | | |
| 292,419 | Contactar |  | Montserrat | 600 | 18 | 16 | 0 | — | #010104 | center/center | 110  |

### Contenedores (9)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| ·Hablemos › Frame 254 | Rectangle 12 (1532:3077) | 0,0 | 1920×794 |  | #f0f2ff |  |  |  |  |
| ··Frame 254 › Group | Vector (1532:3086) | 240,616 | 83×68 |  | #000000 |  |  |  |  |
| ··Frame 254 › Frame | Vector (1532:3088) | 1589,587 | 41×41 |  | #161614 |  |  |  |  |
| ··Frame 254 › Frame | Vector (1532:3089) | 1599,595 | 21×20 |  | #ffffff |  |  |  |  |
| ··Frame 254 › Frame | Vector (1532:3091) | 1639,587 | 41×41 |  | #161614 |  |  |  |  |
| ··Frame 254 › Frame | Vector (1532:3092) | 1649,597 | 20×21 |  | #ffffff |  |  |  |  |
| ···Frame › Group | Vector (1532:3095) | 1539,587 | 41×40 |  | #161614 |  |  |  |  |
| ···Frame › Group | Vector (1532:3096) | 1546,616 | 8×5 |  | #161614 |  |  |  |  |
| ·Hablemos › Frame 254 | Rectangle 146 (1532:3097) | 240,397 | 213×66 | 47 | #d5dae9 |  |  |  |  |

_Nodos ocultos: 0 · nodos más profundos que 6: 0_

## 12 · Footer (band:footer) — 1920×258 @ y=11716

![Footer](png/12-footer.png)

Componente: `src/components/layout/Footer.tsx`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (0)

_Sin textos_

### Contenedores (0)

_Sin contenedores con estilo_

_Nodos ocultos: 0 · nodos más profundos que 6: 0_

