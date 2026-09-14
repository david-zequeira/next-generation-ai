# Auditoría `/calculadora` · Figma «Asenix Calculadora1» (984:14321) y «Calculadora2» (1555:66997) vs código

Rama `figma/calculadora-984` · plan `plans/02-calculadora-pixel-perfect-figma-984-14321.md`
Extracción del **14 sep 2026 07:45** (fichero modificado ese día a las 06:45) por `GET /v1/files/:key`.
Medidas del Figma en px **a 1920**; el código las aplica como `N*var(--u)` con suelo para móvil.
Medido con `getBoundingClientRect` a viewport 1920×1080. Lint, `tsc --noEmit` y `next build` limpios.

Leyenda: `ok` · `desvío` · `n/a` · `pendiente` (depende de la diseñadora).

## Decisiones

| # | Tema | Resolución |
|---|---|---|
| D1 | Pastillas | El `.eyebrow` global **ya era exacto** (28 alto, `rgba(213,218,233,.08)`, borde `#94b2fc` 0,3, lima 12/22 · 0,05 em). Se añade `.eyebrow-dark` (`globals.css`) para las dos que van sobre el módulo blanco: relleno `#050b21`, sin borde, peso 500, padding 18. Se borra `before:content-none`, que era código muerto |
| D2 | «Hablemos» | El marco se alineó con el home (H1 60/65, botón `#d5dae9`). **No se toca `FinalCTA.tsx`** |
| D3 | Pie | Idéntico al home. **No se toca `Footer.tsx`** |
| D4 | Respuestas del FAQ | Se conserva el `<details>`; `Calculadora2` tiene una fila abierta de 667×175, que confirma el patrón |
| D5 | Barra fija de móvil | Se conserva (no existe en el Figma, que es solo desktop). Pasada a la escala `--u` |
| D6 | Estado activo de las pastillas de sector | Se conserva (`bg-electric`); el Figma solo tiene el estado inactivo |
| D7 | Los dos módulos de la derecha | El condicional `hasData` del código = los dos marcos del Figma |
| D8 | Tarjetas de «cómo se recupera» | **A la izquierda**, como el Figma. Revertido el centrado del commit `92b5eb0` |
| D9 | Aviso de hipótesis (`t.assumptions.warning`) | No existe en el Figma; **se conserva** el texto. Deuda de contenido, no de píxeles |

## Medido a 1920×1080

| Sección | Propiedad | Figma | Medido | Estado |
|---|---|---|---|---|
| Global | Pastillas (alto) | 28 | 28 en las cuatro | ok |
| Global | Pastilla «cómo se recupera» | 162 | 162 | ok |
| Global | Pastilla «dudas razonables» | 168 | 166 | ok |
| Global | Pastilla «calculadora» | 130 | 124 | desvío (6; el copy difiere del rótulo del Figma) |
| Global | Pastilla «tu cuenta» (sobre blanco) | 114 · `#050b21` | 113 · `rgb(5,11,33)` | ok |
| Global | Divisores de banda | 1920 × 0,5 px `#6994ff` | 1912 × 1 px `#6994ff` | ok (0,5 px no es representable; suelo de 1) |
| Hero | H1 | caja 704 · 52/54 | 704 | ok |
| Hero | Entradilla | caja 704 · 20/28 | 704 | ok |
| Hero | Cuadrado numerado | 52 **de contorno** azul, cifra lima | borde `electric`, cifra lima | ok |
| Intro | H2 | caja 708 · 35/46 | 708 | ok |
| Intro | Subtítulo | caja 703 · 20/28 | 703 | ok |
| Formulario | Panel | 947×1585 · r**25** · `#101837→#050b21 61%` | 942×1683 · r25 · igual | ok (alto por copy) |
| Formulario | Tarjetas de paso | 857 · r25 | 850 | ok |
| Formulario | Icono `+` | 23×23 trazo `#779eff` 2 | 23×23 | ok |
| Formulario | Pastillas de sector | alto 37 · `#779eff` | 37 · `rgb(119,158,255)` | ok |
| Formulario | Cajas | 367×**62** · r16 | 376×62 | ok |
| Formulario | Tarjetas de plan | 246×205 · r15 | 251×236 | ok (alto por copy) |
| Formulario | Botones | 246×66 · hueco 32 | 246×66 | ok |
| Cuenta | Módulo vacío | 459×362 | 459×355 | ok |
| Cuenta | Módulo con datos | 462×1177 | 459×1211 | ok (alto: conserva el aviso, D9) |
| Cuenta | Titular payback | «3.9» 45 · «Meses» 25 · a la derecha | igual, `justify-between` | ok |
| Cuenta | Raya bajo el titular | **no existe** | eliminada | ok |
| Cuenta | Barra | 383×11 · `#779eff 0% → #1a4dff 100%` | 381×11 · igual | ok |
| Cuenta | Panel de desglose | 383×441 · r15 | 381×444 | ok |
| Cuenta | Panel de retorno | 383×105 · `rgba(154,165,192,.8)` | 381×106 · igual | ok |
| Cuenta | CTA | 282×66 + icono de envío | 282×66 | ok |
| Resuelve | H2 | caja 696 · **30/38** | 696 | ok |
| Resuelve | Tarjetas | 369×243 · r20 · borde 2 · sombra azul | 369×286 | ok (alto por copy) |
| Resuelve | Relleno de las tres | `rgba(26,77,255,.1)` con opacidad de nodo 0,5 | `electric/5` (alfa horneado) | desvío consciente: el nodo va al 50 %, pero eso apagaría el texto |
| Resuelve | Icono | 52 · r18 · `#081248` · sombra `0 0 10px #1a4dff` | igual | ok |
| Resuelve | Alineación | izquierda | izquierda | ok (D8) |
| Resuelve | Raya interior de la tarjeta | **no existe** | eliminada | ok |
| Resuelve | **Flecha** entre tarjetas | `Arrow` 35 × 2 px `#354d8e`, punta en el extremo derecho (`End point`) | SVG de 35×10, misma punta y grosor | ok |
| FAQ | H2 | caja 696 · 52/52 | 696 | ok |
| FAQ | Filas | 667×62 · r15 · hueco 10 | 667×63 · hueco 10,0 | ok |
| FAQ | «+» | icono 12×12 trazo 2 | 12×12 | ok |
| Captura | Tarjeta | 1196×568 · r35 · cónico 1,3 | 1196×672 | ok (alto por copy) |
| Captura | Reparto | 582 / 614 | 582 / 614 | ok |
| Captura | Pastillas | 163/131/122 · relleno lima→azul · una línea | 161/124/116 · **una línea en 768, 1024, 1280 y 1920**, y también en EN (157/133/114) | ok |
| Captura | Caja de nota | 485×166 · `#ffffff→#c7d7ff` | igual | ok |
| Captura | Cajas del formulario | 439×**62** · r15 | 62 de alto | ok |
| Captura | Botón | 271×66 · r47 `#c7d7ff` + icono de envío | igual | ok |
| Móvil | 375 sin desbordes | — | `scrollWidth` 375 = viewport | ok |
| Consola | Errores | 0 | 0 | ok |

## Simplificaciones conscientes

- **Rejilla del hero**: el Figma pone los iconos en x 281/734/1179 (pasos 453 y 445, no uniformes).
  Se usa una rejilla de tres columnas iguales desplazada 41 px. La asimetría de 3 px parece descuido.
- **Opacidad de las tarjetas de «cómo se recupera»**: el nodo va al 50 %, lo que en Figma también
  apaga el texto. Se hornea en los alfas del fondo (`electric/5`) y la sombra (0,25) para que los
  titulares se lean, que es lo que enseña el render.
- **Resplandor interior de las seis pastillas de sector**: omitido (es sutil y son seis nodos).
- **Pastillas de la captura por debajo de 1920**: se escalan de forma proporcional (sin el suelo de
  12 px de `fs-u-*`, con un mínimo de 9 px) para que las tres sigan en **una sola fila** y se lean
  como un proceso. Con los suelos normales se partían en dos líneas entre 768 y 1400.
- **Bordes de las tarjetas de paso**: implementados los tres distintos (360°, plano, 180°) tal cual.

## Duplicados y erratas del Figma (pendientes de la diseñadora)

- El FAQ repite **«Mi negocio no se parece al del ejemplo. ¿Me sirve igual?»** en las filas 2 y 3,
  y ha desaparecido «Si os dejo el email, ¿me vais a perseguir?».
- La tarjeta de plan «Arranque» está duplicada: `Rectangle 138` y `Rectangle 181`, misma posición
  y mismo relleno.
- La etiqueta «Ver un ejemplo» está duplicada: `1308:5882` @458,1484 y `1308:5883` @453,1487.
- El titular de la primera fuga del hero va a peso **700** y los otros dos a **600**.
- «Consultas perdidas» va a 16/**25** y «Citas perdidas» a 16/**30**.
- El rótulo de la pastilla de la captura dice «SIN COMPROMISOS» y el diccionario «Sin compromiso».

## Pendientes externos

- **PNG del diseño**: `/v1/images` seguía en 429 el 14 sep (`retry-after` ≈ 18 sep). `png/` está
  vacío en las dos extracciones. La verificación se hizo midiendo la web, no comparando imágenes.
- **Claves muertas del diccionario** (D9): `t.header.*`, `t.why.title/body/items/foot`,
  `t.assumptions.title/body/items/stats`, `t.lead.eyebrow/title/body`, `t.form.planHint`, `t.back`
  no se renderizan; `t.assumptions.body/items` sí alimentan el JSON-LD de FAQ en
  `src/app/calculadora/page.tsx:28-30`, que anuncia una sección de hipótesis que ya no está en pantalla.
