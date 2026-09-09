# Home · Asenix Planes (690:14) — spec extraída de Figma

Fuente: IxRzkKKPa5XStlUI6UnpBv «Asenix Web» · modificado 2026-09-09T07:34:33Z · extraído 2026-09-09T10:01:07.121Z · 0 llamadas API

Marco: 1920×9086 · fondo: #ffffff · layout: clip

![marco completo](png/00-home-full@0.5.png)

Convenciones: posiciones relativas a la sección (x,y en px); colores `#hex` o `rgba`; tracking en px y em (para `tracking-[…em]`); desenfoques CSS = radio Figma / 2 (convención de Dev Mode, confirmar una vez); ángulo de degradado exacto solo si las asas cruzan el nodo en eje.

## 01 · Header (band:header) — 1920×120 @ y=366

![Header](png/01-header.png)

Componente: `src/components/layout/Navbar.tsx`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (4)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 363,58 | Plataforma       Servicios        Ecosistema        Planes        Con… |  | Montserrat | 500 | 18 | 20 | 0 | — | #000000 | center/center | 587 WIDTH_AND_HEIGHT |
| 1417,59 | Iniciar sesion |  | Montserrat | 500 | 15 | 16 | 0 | — | #000000 | center/center | 128 HEIGHT |
| 1373,60 | ES |  | Montserrat | 400 | 18 | 16 | 0 | — | #1a4dff | center/center | 24 WIDTH_AND_HEIGHT |
| 1552,60 | Registrarse |  | Montserrat | 500 | 15 | 16 | 0 | — | #000000 | center/center | 128 HEIGHT |

### Contenedores (3)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| Header | Vector (693:2252) | 240,41 | 69×55 |  | #1a4dff |  |  |  |  |
| Header | Rectangle 28 (700:2755) | 1417,47 | 128×41 | 10 |  | linear-gradient(90deg, #cad3ec 0%, #a7b2d1 100%) 1px inside |  |  |  |
| Header | Rectangle 18 (693:2249) | 1552,47 | 128×41 | 10 | linear-gradient(124deg, #dfe2ea 0%, #dfe2ea 100%) |  |  |  |  |

_Nodos ocultos: 0 · nodos más profundos que 7: 0_

## 02 · Cabecera (band:cabecera) — 1920×561 @ y=486

![Cabecera](png/02-cabecera.png)

Componente: `src/components/pricing/PricingPage.tsx (cabecera)`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (13)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 854,87 | //PLANES 2026 |  | Montserrat | 300 | 14 | 22 | 3.5px (0.25em) | — | #1a4dff | center/center | 214  |
| ↳ | // | | = | 700 | = | = | = | = | #1a4dff | | |
| ↳ | PLANES 2026 | | = | 700 | = | = | = | UPPER | #1a4dff | | |
| 488,138 | Elige por dónde quieres empezar |  | Montserrat | 700 | 52 | 54 | 0 | — | #0b1226 | center/center | 946  |
| 485,240 | La puesta en marcha se puede pagar al contado con un 5 % de descuento… |  | Montserrat | 400 | 18 | 22 | 0 | — | #000000 | center/center | 950  |
| ↳ | La puesta en marcha se puede pagar  | | = | = | = | = | = | = | = | | |
| ↳ | al contado con un 5 % de descuento, en tres plazos sin recargo, | | = | 600 | = | = | = | = | = | | |
| ↳ |  o no pagarla de entrada: con  | | = | = | = | = | = | = | = | | |
| ↳ | 0 € de entrada | | = | 600 | = | = | = | = | = | | |
| ↳ |  se reparte en la cuota durante 18 meses y a partir del mes 19 la cuo… | | = | = | = | = | = | = | = | | |
| 1221,368 | Label | M3/label/large | Roboto | 500 | 14 | 20 | 0.1px (0.007em) | — | #6750a4 | left/center | 35 WIDTH_AND_HEIGHT |
| 780,373 | Comenzar gratis por 30 dias |  | Montserrat | 500 | 20 | 36 | 0 | — | #ecefff | center/center | 362  |
| 528,553 | Funcionando en 7 dias |  | Montserrat | 600 | 14 | 16 | 0 | — | #eef2ff | left/top | 164  |

### Contenedores (9)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| Cabecera | Rectangle 121 (1127:2295) | 0,-120 | 1921×826 |  | linear-gradient(0deg, rgba(240,242,245,0) 35%, #ffffff 100%) |  |  |  |  |
| Cabecera | Servicio Digital experience (1170:1054) | 855,81 | 213×35 | 50 |  | linear-gradient(124deg, #1a4dff 0%, #102e99 100%) 1px inside |  | clip |  |
| ·Cabecera › Servicio Digital experi… | Vector (1170:1055) | 909,-326 | 425×429 |  | radial-gradient(212px 214px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| Cabecera ⧉ Type=Round, Size=Small, State… | Button - elevated (1203:2853) | 1106,344 | 237×68 |  |  |  |  | H justify=center align=center |  |
| ·Cabecera › Button - elevated | Content (I1203:2853;58650:9998) | 1177,358 | 95×40 | 100 | #f7f2fa |  | box-shadow: 0px 1px 3px 1px rgba(0,0,0,0.15), 0px 1px 2px 0px rgba(0,0,0,0.3) | H justify=center align=center clip |  |
| ··Button - elevated › Content | State-layer (I1203:2853;58650:9999) | 1177,358 | 95×40 |  |  |  |  | H justify=center align=center pad=10 16 gap=8 |  |
| ····State-layer › Icon | icon (I1203:2853;58650:10000;54616:25410) | 1195,370 | 17×17 |  | #6750a4 |  |  |  |  |
| Cabecera | Rectangle 67 (1168:1048) | 792,347 | 337×70 | 25 | #101a3e |  |  |  |  |
| Cabecera | Rectangle 93 (717:19848) | 507,544 | 206×33 | 25 | #1a4dff |  |  |  |  |

_Nodos ocultos: 0 · nodos más profundos que 7: 0_

## 03 · Planes (band:planes) — 1920×1326 @ y=1047

![Planes](png/03-planes.png)

Componente: `src/components/pricing/PricingPage.tsx (planes)`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (90)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 805,922 | 1000 conversaciones / mes |  | Montserrat | 400 | 12 | 16 | 0 | — | #ffffff | left/top | 163  |
| 999,921 | Web bilingüe ES/EN |  | Montserrat | 400 | 12 | 16 | 0 | — | #ffffff | left/top | 134  |
| 788,999 | 8h/mes de cambios |  | Montserrat | 400 | 12 | 16 | 0 | — | #ffffff | center/top | 148  |
| 805,960 | Agente en 2 idiomas |  | Montserrat | 400 | 12 | 16 | 0 | — | #ffffff | left/top | 140  |
| 948,959 | 1 Sede |  | Montserrat | 400 | 12 | 16 | 0 | — | #ffffff | center/top | 74  |
| 1211,939 | desde 4.000 conversaciones/mes |  | Montserrat | 400 | 12 | 16 | 0 | — | #ffffff | left/top | 295  |
| 1308,977 | 2h/mes de cambios |  | Montserrat | 400 | 12 | 16 | 0 | — | #ffffff | center/top | 143  |
| 1211,977 | Multi-marca |  | Montserrat | 400 | 12 | 16 | 0 | — | #ffffff | left/top | 77  |
| 1435,938 | Multi-pais |  | Montserrat | 400 | 12 | 16 | 0 | — | #ffffff | center/top | 92  |
| 457,40 | Arranque⏎ |  | Montserrat | 700 | 30 | 30 | 0 | — | #000000 | left/top | 272  |
| 862,41 | Core⏎ |  | Montserrat | 700 | 30 | 30 | 0 | — | #000000 | left/top | 272  |
| 1264,41 | Nexus⏎ |  | Montserrat | 700 | 30 | 30 | 0 | — | #000000 | left/top | 272  |
| 812,86 | Para el negocio que además necesita una cara digital a la altura de l… |  | Montserrat | 400 | 15 | 18 | 0 | — | #000000 | left/top | 298  |
| 1214,86 | Para el negocio que además necesita una cara digital a la altura de l… |  | Montserrat | 400 | 15 | 18 | 0 | — | #000000 | left/top | 298  |
| 403,87 | Para que tu web y tu WhatsApp de hoy dejen de perder clientes. |  | Montserrat | 400 | 15 | 18 | 0 | — | #000000 | left/top | 298  |
| 772,221 | 349€⏎mes · servicio gestionado⏎ |  | Montserrat | 700 | 35 | 24 | 0 | — | #000000 | center/top | 377  |
| ↳ | 34 | | = | = | 48 | = | = | = | #000000 | | |
| ↳ | 9€⏎ | | = | = | 48 | = | 4.8px (0.1em) | = | #000000 | | |
| ↳ | mes · servicio gestionado⏎ | | = | 500 | 12 | = | 0.84px (0.07em) | UPPER | #000000 | | |
| 1178,221 | desde 1.900€⏎mes · servicio gestionado⏎ |  | Montserrat | 700 | 35 | 24 | 0 | — | #000000 | center/top | 377  |
| ↳ | desde | | = | = | 25 | = | = | = | = | | |
| ↳ | 1.90 | | = | = | 48 | = | = | = | #000000 | | |
| ↳ | 0€⏎ | | = | = | 48 | = | 4.8px (0.1em) | = | #000000 | | |
| ↳ | mes · servicio gestionado⏎ | | = | 500 | 12 | = | 0.84px (0.07em) | UPPER | #000000 | | |
| 367,222 | 349€⏎mes · servicio gestionado⏎ |  | Montserrat | 700 | 35 | 24 | 0 | — | #ffffff | center/top | 377  |
| ↳ | 34 | | = | = | 48 | = | = | = | #ffffff | | |
| ↳ | 9€⏎ | | = | = | 48 | = | 4.8px (0.1em) | = | #ffffff | | |
| ↳ | mes · servicio gestionado⏎ | | = | 500 | 12 | = | 0.84px (0.07em) | UPPER | #ffffff | | |
| 802,309 | 5.900 € de puesta en marcha |  | Montserrat | 600 | 18 | 16 | 0 | — | #1a4dff | left/top | 297  |
| ↳ | 5.900 € | | = | 800 | = | = | = | = | = | | |
| ↳ | de puesta en marcha | | = | 500 | = | = | = | = | = | | |
| 1204,309 | 18.000 € de puesta en marcha |  | Montserrat | 400 | 16 | 16 | 0 | — | #b8f21e | left/top | 297  |
| ↳ | 18.000 € | | = | 800 | = | = | = | = | #1a4dff | | |
| ↳ |   | | = | 600 | = | = | = | = | #1a4dff | | |
| ↳ | de puesta en marcha | | = | 500 | = | = | = | = | #1a4dff | | |
| 397,310 | 2.900 € de puesta en marcha |  | Montserrat | 600 | 18 | 16 | 0 | — | #b8f21e | left/top | 317  |
| ↳ | 2.900 € | | = | 800 | = | = | = | = | = | | |
| ↳ | de puesta en marcha | | = | 500 | = | = | = | = | = | | |
| 836,350 | En 3 plazos sin recargo o 0 € de entrada a 679 €/mes durante 18 meses |  | Montserrat | 400 | 14 | 16 | 0 | — | #1a4dff | left/top | 259  |
| ↳ | En 3 plazos sin recargo o  | | = | 500 | = | = | = | = | = | | |
| ↳ | 0 € de entrada | | = | 500 | = | = | = | = | #000000 | | |
| ↳ |  a 679 €/mes durante 18 meses | | = | 500 | = | = | = | = | = | | |
| 1223,357 | Condiciones de pago a medida · siempre después del Diagnóstico |  | Montserrat | 500 | 14 | 16 | 0 | — | #1a4dff | left/top | 289  |
| 424,358 | En 3 plazos sin recargo o 0 € de entrada a 510 €/mes durante 18 meses |  | Montserrat | 400 | 14 | 16 | 0 | — | #1a4dff | left/top | 290  |
| ↳ | En 3 plazos sin recargo o  | | = | 500 | = | = | = | = | = | | |
| ↳ | 0 € de entrada | | = | 500 | = | = | = | = | #000000 | | |
| ↳ |  a 510 €/mes durante 18 meses | | = | 500 | = | = | = | = | = | | |
| 424,428 | El agente se instala en la web que ya tienes - no hay que rehacer nad… |  | Montserrat | 400 | 14 | 17 | 0 | — | #ffffff | left/top | 290  |
| ↳ | El agente se instala en la web que ya tienes | | = | 600 | = | = | = | = | #ffffff | | |
| ↳ |  - no hay que rehacer nada⏎ | | = | = | = | = | = | = | = | | |
| ↳ | ⏎WhatsApp Business oficial: | | = | 600 | = | = | = | = | #ffffff | | |
| ↳ |  el mismo cerebro, en tu número de siempre⏎⏎ | | = | = | = | = | = | = | = | | |
| ↳ | Reserva de verdad:  | | = | 600 | = | = | = | = | #ffffff | | |
| ↳ | mira los huecos libres de tu Google Calendar y cierra la cita con con… | | = | = | = | = | = | = | = | | |
| ↳ | Recordatorios 24 h y 2 h antes  | | = | 600 | = | = | = | = | #ffffff | | |
| ↳ | con cancelación en un clic - el hueco se revende⏎⏎ | | = | = | = | = | = | = | = | | |
| ↳ | Captura de leads: | | = | 600 | = | = | = | = | #ffffff | | |
| ↳ |  nadie se va sin dejar rastro⏎⏎ | | = | = | = | = | = | = | = | | |
| ↳ | CRM y panel ejecutivo:  | | = | 600 | = | = | = | = | #ffffff | | |
| ↳ | conversaciones, clientes, citas, KPIs e informe semanal⏎⏎ | | = | = | = | = | = | = | = | | |
| ↳ | AI Insights:  | | = | 600 | = | = | = | = | #ffffff | | |
| ↳ | qué falla en tu embudo, qué hora rinde y qué servicio tira⏎⏎Avisos al… | | = | = | = | = | = | = | = | | |
| 831,428 | Todo lo del Arranque, con el asistente ya integrado en la web nueva⏎⏎… |  | Montserrat | 400 | 14 | 17 | 0 | — | #000000 | left/top | 288  |
| ↳ | Todo lo del  | | = | = | = | = | = | = | = | | |
| ↳ | Arranque | | = | 600 | = | = | = | = | = | | |
| ↳ | , con el asistente ya integrado en la web nueva⏎ | | = | = | = | = | = | = | = | | |
| ↳ | ⏎Identidad de marca esencial - | | = | 600 | = | = | = | = | = | | |
| ↳ |  logo, paleta, tipografías y mini-manual⏎⏎ | | = | = | = | = | = | = | = | | |
| ↳ | Web premium cinematográfica | | = | 600 | = | = | = | = | = | | |
| ↳ |  hasta 12 secciones, bilingüe⏎⏎Dominio, hosting, SSL y textos legales… | | = | = | = | = | = | = | = | | |
| 1238,428 | Todo lo de Core, con identidad de marca completa⏎⏎Agentes a medida: c… |  | Montserrat | 400 | 14 | 17 | 0 | — | #000000 | left/top | 283  |
| ↳ | Todo lo de  | | = | = | = | = | = | = | = | | |
| ↳ | Core | | = | 600 | = | = | = | = | = | | |
| ↳ | , con identidad de marca completa⏎⏎ | | = | = | = | = | = | = | = | | |
| ↳ | Agentes a medida:  | | = | 600 | = | = | = | = | = | | |
| ↳ | cualificación de leads, back-office, fidelización, postventa⏎⏎Varias … | | = | = | = | = | = | = | = | | |
| 601,921 | Web + WhatsApp |  | Montserrat | 400 | 12 | 16 | 0 | — | #ffffff | left/top | 127  |
| 400,922 | 1000 conversaciones / mes |  | Montserrat | 400 | 12 | 16 | 0 | — | #ffffff | left/top | 163  |
| 543,959 | 1 Sede |  | Montserrat | 400 | 12 | 16 | 0 | — | #ffffff | center/top | 74  |
| 400,960 | Agente en 2 idiomas |  | Montserrat | 400 | 12 | 16 | 0 | — | #ffffff | left/top | 140  |
| 383,999 | 2h/mes de cambios |  | Montserrat | 400 | 12 | 16 | 0 | — | #ffffff | center/top | 148  |
| 738,1058 | ◇ |  | Inter | 300 | 36 | 26 | 0 | — | #1a4dff | left/center | 36  |
| 862,1078 | Quiero tambien la web |  | Montserrat | 600 | 16 | 16 | 0 | — | #ffffff | center/center | 197  |
| 1140,1058 | ◇ |  | Inter | 300 | 36 | 26 | 0 | — | #1a4dff | left/center | 36  |
| 1264,1078 | Diseñar el sistema |  | Montserrat | 600 | 16 | 16 | 0 | — | #ffffff | center/center | 197  |
| 339,1060 | ◇ |  | Inter | 300 | 36 | 26 | 0 | — | #1a4dff | left/center | 34  |
| 456,1079 | Empezar aqui |  | Montserrat | 600 | 16 | 16 | 0 | — | #ffffff | center/center | 186  |
| 609,1270 | ¿Necesitas algo personalizado? Habla con nuestro equipo → |  | Montserrat | 500 | 20 | 24 | 0 | — | #1a4dff | center/top | 704  |
| ↳ | ¿Necesitas algo personalizado? | | = | = | = | = | = | = | #000000 | | |
| ↳ | Habla con nuestro equipo → | | = | = | = | = | = | = | = | | |

### Contenedores (52)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| Planes | Plan Orbita (1146:33) | 365,0 | 377×1169 | 35 | #ffffff |  | box-shadow: 0px 0px 45px 10px #101a3e | clip | 0.2 |
| ··Core › cORE | Plan Orbita (712:18048) | 772,0 | 377×1169 | 35 | #ffffff |  | box-shadow: 0px 0px 45px 10px #101a3e | clip | 0.2 |
| ··Core › cORE | Servicio Digital experience (1139:3983) | 772,164 | 377×1005 | 0 0 35 35 | linear-gradient(180deg, #d5dae9 0%, #ffffff 62%) |  |  | clip |  |
| ······Group › Group | Vector (1173:1129) | 802,431 | 14×11 |  | #1a4dff |  |  |  |  |
| ······Group › Group | Vector (1173:1133) | 802,482 | 14×11 |  | #101a3e |  |  |  |  |
| ······Group › Group | Vector (1173:1137) | 802,533 | 14×11 |  | #101a3e |  |  |  |  |
| ······Group › Group | Vector (1173:1141) | 802,584 | 14×11 |  | #101a3e |  |  |  |  |
| ······Group › Group | Vector (1173:1145) | 802,635 | 14×11 |  | #101a3e |  |  |  |  |
| ······Group › Group | Vector (1173:1149) | 802,686 | 14×11 |  | #101a3e |  |  |  |  |
| ·Planes › Core | Rectangle 76 (1139:3913) | 802,338 | 317×70 | 5 | #ffffff |  |  |  |  |
| ·Planes › Core | Rectangle 77 (1148:49) | 791,914 | 189×30 | 25 | #101a3e |  |  |  |  |
| ·Planes › Core | Rectangle 155 (1148:50) | 988,914 | 145×30 | 25 | #101a3e |  |  |  |  |
| ·Planes › Core | Rectangle 158 (1148:51) | 948,952 | 74×30 | 25 | #101a3e |  |  |  |  |
| ·Planes › Core | Rectangle 157 (1148:52) | 791,991 | 149×30 | 25 | #101a3e |  |  |  |  |
| ·Planes › Core | Rectangle 156 (1148:53) | 791,952 | 149×30 | 25 | #101a3e |  |  |  |  |
| ··Nexus › Frame 187 | Plan Orbita (1139:4060) | 1178,0 | 377×1169 | 35 | #ffffff |  | box-shadow: 0px 0px 45px 10px #101a3e | clip | 0.2 |
| ··Nexus › Frame 187 | Servicio Digital experience (1139:4061) | 1178,164 | 377×1005 | 0 0 35 35 | linear-gradient(180deg, #d5dae9 0%, #ffffff 62%) |  |  | clip |  |
| ···Frame 187 › Servicio Digital experi… | Rectangle 77 (1148:72) | 1197,931 | 231×30 | 25 | #101a3e |  |  |  |  |
| ···Frame 187 › Servicio Digital experi… | Rectangle 158 (1148:74) | 1435,931 | 92×30 | 25 | #101a3e |  |  |  |  |
| ···Frame 187 › Servicio Digital experi… | Rectangle 157 (1148:75) | 1308,969 | 143×30 | 25 | #101a3e |  |  |  |  |
| ···Frame 187 › Servicio Digital experi… | Rectangle 156 (1148:76) | 1197,969 | 103×30 | 25 | #101a3e |  |  |  |  |
| ······Group › Group | Vector (1173:1157) | 1204,431 | 14×11 |  | #1a4dff |  |  |  |  |
| ······Group › Group | Vector (1173:1161) | 1204,482 | 14×11 |  | #101a3e |  |  |  |  |
| ······Group › Group | Vector (1173:1165) | 1204,533 | 14×11 |  | #101a3e |  |  |  |  |
| ······Group › Group | Vector (1173:1169) | 1204,584 | 14×11 |  | #101a3e |  |  |  |  |
| ······Group › Group | Vector (1173:1173) | 1204,652 | 14×11 |  | #101a3e |  |  |  |  |
| ······Group › Group | Vector (1173:1177) | 1204,703 | 14×11 |  | #101a3e |  |  |  |  |
| ······Group › Group | Vector (1173:1181) | 1204,754 | 14×11 |  | #101a3e |  |  |  |  |
| ······Group › Group | Vector (1173:1189) | 1204,805 | 14×11 |  | #101a3e |  |  |  |  |
| ·····Frame › i2 | Vector (1146:97) | 403,42 | 30×29 |  | #b8f21e |  |  |  |  |
| ·····Frame › i2 | Vector (1139:3967) | 808,43 | 30×29 |  | #1a4dff |  |  |  |  |
| ·····Frame › i2 | Vector (1117:1561) | 1210,43 | 30×29 |  | #1a4dff |  |  |  |  |
| Planes | Servicio Digital experience (1146:34) | 365,163 | 377×1005 | 0 0 35 35 | linear-gradient(180deg, #3b67ff 0%, #29459f 100%) |  |  | clip |  |
| Planes | Rectangle 76 (1146:102) | 397,339 | 317×69 | 5 | #ffffff |  |  |  |  |
| Planes | Rectangle 76 (1117:1507) | 1204,339 | 317×69 | 5 | #ffffff |  |  |  |  |
| ···Group › Group | Vector (1146:42) | 397,431 | 14×11 |  | #b8f21e |  |  |  |  |
| ···Group › Group | Vector (1173:1101) | 397,482 | 14×11 |  | #b8f21e |  |  |  |  |
| ···Group › Group | Vector (1173:1105) | 397,533 | 14×11 |  | #b8f21e |  |  |  |  |
| ···Group › Group | Vector (1173:1109) | 397,601 | 14×11 |  | #b8f21e |  |  |  |  |
| Planes | Rectangle 40 (700:11020) | -167,653 | 13×13 |  |  | #000000 1px inside |  |  |  |
| ···Group › Group | Vector (1173:1113) | 397,669 | 14×11 |  | #b8f21e |  |  |  |  |
| ···Group › Group | Vector (1173:1117) | 397,720 | 14×11 |  | #b8f21e |  |  |  |  |
| ···Group › Group | Vector (1173:1121) | 397,771 | 14×11 |  | #b8f21e |  |  |  |  |
| ···Group › Group | Vector (1173:1125) | 397,822 | 14×11 |  | #b8f21e |  |  |  |  |
| Planes | Rectangle 77 (1146:108) | 386,914 | 189×30 | 25 | #101a3e |  |  |  |  |
| Planes | Rectangle 155 (1146:109) | 583,914 | 145×30 | 25 | #101a3e |  |  |  |  |
| Planes | Rectangle 156 (1146:112) | 386,952 | 149×30 | 25 | #101a3e |  |  |  |  |
| Planes | Rectangle 158 (1146:110) | 543,952 | 74×30 | 25 | #101a3e |  |  |  |  |
| Planes | Rectangle 157 (1146:111) | 386,991 | 149×30 | 25 | #101a3e |  |  |  |  |
| Planes | Boton (1139:3917) | 841,1054 | 240×60 | 25 | #1a4dff |  |  | clip |  |
| Planes | Servicio Digital experience (1117:1511) | 1243,1054 | 240×60 | 25 | #1a4dff |  |  | clip |  |
| Planes | Servicio Digital experience (1148:27) | 436,1056 | 226×57 | 25 | #1a4dff |  |  | clip |  |

_Nodos ocultos: 0 · nodos más profundos que 7: 0_

## 04 · Banda Diagnóstico (band:banda-diagnostico) — 1920×316 @ y=2373

![Banda Diagnóstico](png/04-banda-diagnostico.png)

Componente: `src/components/pricing/PricingPage.tsx (diagnóstico)`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (7)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 759,69 | Dos semanas. Analizamos tu operación, detectamos oportunidades de aut… |  | Montserrat | 600 | 18 | 23 | 0 | — | #000000 | left/top | 675  |
| ↳ | Analizamos tu operación, detectamos oportunidades de automatización y… | | = | 400 | = | = | = | = | = | | |
| ↳ | si implementas cualquier plan en los próximos 60 días. | | = | 400 | = | = | = | = | = | | |
| 501,58 | 490 €⏎Diagnóstico de IA ⏎ |  | Montserrat | 600 | 18 | 20 | 0 | — | #1a4dff | center/top | 184  |
| ↳ | 490 €⏎ | | = | = | 38 | = | = | = | #1a4dff | | |
| ↳ | Diagnóstico de IA ⏎ | | = | = | 15 | = | = | = | #000000 | | |
| 523,140 | Contactar |  | Montserrat | 600 | 16 | 36 | 0 | — | #ffffff | center/center | 141  |

### Contenedores (3)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| Banda Diagnóstico | Plan Centro (790:29336) | 331,0 | 1268×220 | 25 | #d5dae9 |  |  | clip |  |
| ·Banda Diagnóstico › Plan Centro | Servicio Digital experience (814:45) | 502,117 | 183×58 | 50 | #1a4dff | #94b2fc 1px inside |  | clip |  |
| ··Plan Centro › Servicio Digital experi… | Vector (814:46) | 555,-266 | 316×416 |  | radial-gradient(158px 208px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |

_Nodos ocultos: 0 · nodos más profundos que 7: 0_

## 05 · Comparativa (band:comparativa) — 1920×1528 @ y=2689

![Comparativa](png/05-comparativa.png)

Componente: `src/components/pricing/PricingPage.tsx (comparativa)`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (45)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 853,6 | //COMPARATIVA |  | Montserrat | 300 | 14 | 22 | 3.5px (0.25em) | — | #1a4dff | center/center | 214  |
| ↳ | // | | = | 700 | = | = | = | = | #1a4dff | | |
| ↳ | COMPARATIVA | | = | 700 | = | = | = | UPPER | #1a4dff | | |
| 598,64 | Que incluye cada nivel |  | Montserrat | 700 | 52 | 52 | 0 | — | #000000 | center/center | 736  |
| 490,126 | El Arranque y Core montan exactamente el mismo asistente y cuestan lo… |  | Montserrat | 400 | 18 | 22 | 0 | — | #000000 | center/center | 952  |
| 364,374 | Cuota mensual⏎Puesta en marcha⏎…o sin entrada, 18 meses⏎Plazo de entr… |  | Montserrat | 700 | 16 | 45 | 0 | — | #000000 | left/top | 379  |
| 331,288 | Característica⏎⏎ |  | Montserrat | 600 | 24 | 30 | 0 | — | #000000 | left/top | 226  |
| 862,374 | 349 €⏎2.900 €⏎510 €/mes⏎7 días⏎⏎-⏎-⏎-⏎-⏎Completo⏎-⏎⏎-⏎-⏎la tuya⏎2⏎1⏎-… |  | Montserrat | 400 | 16 | 45 | 0 | — | #000000 | center/top | 205  |
| ↳ | 349 €⏎2.900 €⏎ | | = | 700 | = | = | = | = | = | | |
| ↳ | 510 €/mes⏎ | | = | 700 | = | = | = | = | #1a4dff | | |
| ↳ | 7 días⏎ | | = | 700 | = | = | = | = | = | | |
| ↳ | ⏎ | | = | 500 | = | = | = | = | = | | |
| ↳ | -⏎-⏎-⏎-⏎ | | = | 500 | = | = | = | = |  | | |
| ↳ | Completo⏎ | | = | 500 | = | = | = | = | = | | |
| ↳ | -⏎ | | = | 500 | = | = | = | = |  | | |
| ↳ | ⏎ | | = | 500 | = | = | = | = | = | | |
| ↳ | -⏎-⏎ | | = | 500 | = | = | = | = |  | | |
| ↳ | la tuya⏎2⏎1⏎ | | = | 500 | = | = | = | = | = | | |
| ↳ | -⏎ | | = | 500 | = | = | = | = |  | | |
| ↳ | 1.000⏎2h⏎24 h lab. | | = | 500 | = | = | = | = | = | | |
| 808,288 | Arranque |  | Montserrat | 600 | 24 | 30 | 0 | — | #000000 | center/top | 313  |
| 1121,374 | 349 €⏎5.900 €⏎679 €/mes⏎4–6 semanas-⏎sobre la nueva⏎-⏎⏎-⏎-⏎Completo⏎⏎… |  | Montserrat | 400 | 16 | 45 | 0 | — | #000000 | center/top | 277  |
| ↳ | 349 €⏎ | | = | 700 | = | = | = | = | = | | |
| ↳ | 5.900 €⏎ | | = | 700 | = | = | = | = | #000000 | | |
| ↳ | 679 €/mes⏎ | | = | 700 | = | = | = | = | #1a4dff | | |
| ↳ | 4–6 semanas | | = | 700 | = | = | = | = | = | | |
| ↳ | -⏎ | | = | 700 | = | = | = | = |  | | |
| ↳ | -⏎ | | = | = | = | = | = | = |  | | |
| ↳ | ⏎ | | = | = | = | = | = | = | = | | |
| ↳ | -⏎-⏎ | | = | = | = | = | = | = |  | | |
| ↳ | ⏎⏎ | | = | = | = | = | = | = | = | | |
| ↳ | -⏎ | | = | = | = | = | = | = |  | | |
| 1121,288 | Core |  | Montserrat | 700 | 24 | 30 | 0 | — | #000000 | center/top | 275  |
| 1356,374 | desde 1.900 €⏎desde 18.000 €⏎a medida⏎A definir⏎⏎-⏎-⏎-⏎-⏎A medida⏎-⏎⏎… |  | Montserrat | 400 | 16 | 45 | 0 | — | #000000 | center/top | 277  |
| ↳ | desde 1.900 €⏎ | | = | 700 | = | = | = | = | = | | |
| ↳ | desde 18.000 €⏎ | | = | 700 | = | = | = | = | #000000 | | |
| ↳ | a medida⏎ | | = | 700 | = | = | = | = | #1a4dff | | |
| ↳ | A definir⏎ | | = | 700 | = | = | = | = | = | | |
| ↳ | ⏎ | | = | = | = | = | = | = | = | | |
| ↳ | -⏎-⏎-⏎-⏎ | | = | = | = | = | = | = |  | | |
| ↳ | -⏎ | | = | = | = | = | = | = |  | | |
| ↳ | ⏎ | | = | = | = | = | = | = | = | | |
| ↳ | -⏎- | | = | = | = | = | = | = |  | | |
| ↳ | -⏎ | | = | = | = | = | = | = |  | | |
| 1356,288 | Nexus |  | Montserrat | 700 | 24 | 30 | 0 | — | #000000 | center/top | 277  |

### Contenedores (57)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| Comparativa | Servicio Digital experience (1170:1051) | 854,0 | 213×35 | 50 |  | linear-gradient(124deg, #1a4dff 0%, #102e99 100%) 1px inside |  | clip |  |
| ·Comparativa › Servicio Digital experi… | Vector (1170:1052) | 908,-407 | 425×429 |  | radial-gradient(212px 214px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| Comparativa | Que incluye (741:27299) | 245,247 | 1440×1128 | 35 | rgba(255,255,255,0.5) | linear-gradient(0deg, #9babd4 0%, #c7d7ff 100%) 1.3px inside | box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.2) | clip |  |
| ·Comparativa › Que incluye | Servicio Digital experience (1156:391) | 245,350 | 1440×1025 | 0 0 35 35 | linear-gradient(180deg, #ffffff 0%, #ecefff 40%) |  |  | clip |  |
| ···Servicio Digital experi… › Frame 204 | Ellipse 62 (1173:1291) | 1248,926 | 24×24 |  | #101a3e |  |  |  |  |
| ···Servicio Digital experi… › Frame 205 | Ellipse 62 (1173:1298) | 1248,878 | 24×24 |  | #101a3e |  |  |  |  |
| ···Servicio Digital experi… › Frame 206 | Ellipse 62 (1173:1305) | 1248,834 | 24×24 |  | #101a3e |  |  |  |  |
| ···Servicio Digital experi… › Frame 207 | Ellipse 62 (1173:1312) | 1248,704 | 24×24 |  | #101a3e |  |  |  |  |
| ···Servicio Digital experi… › Frame 211 | Ellipse 62 (1173:1319) | 1248,752 | 24×24 |  | #101a3e |  |  |  |  |
| ···Servicio Digital experi… › Frame 208 | Ellipse 62 (1173:1326) | 1248,656 | 24×24 |  | #101a3e |  |  |  |  |
| ···Servicio Digital experi… › Frame 209 | Ellipse 62 (1173:1333) | 1248,612 | 24×24 |  | #101a3e |  |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 39 (1185:1495) | 331,392 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 159 (1185:1496) | 331,437 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 160 (1185:1497) | 331,482 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 161 (1185:1498) | 331,527 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 162 (1185:1499) | 331,572 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 163 (1185:1500) | 331,617 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 164 (1185:1501) | 331,662 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 165 (1185:1502) | 331,707 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 166 (1185:1503) | 331,752 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 167 (1185:1504) | 331,797 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 168 (1185:1505) | 331,842 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 169 (1185:1506) | 331,887 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 170 (1185:1507) | 331,932 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 171 (1185:1508) | 331,977 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 172 (1185:1509) | 331,1022 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 173 (1185:1510) | 331,1067 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 174 (1185:1511) | 331,1112 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 175 (1185:1512) | 331,1157 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 176 (1185:1513) | 331,1202 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 177 (1185:1514) | 331,1247 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ···Caracteristicas › Frame 212 | Rectangle 178 (1185:1515) | 331,1292 | 11×11 |  |  | rgba(115,125,149,0.8) 1.3px inside |  |  |  |
| ·Comparativa › Que incluye | Arranque (1160:699) | 807,247 | 315×1128 |  | rgba(199,215,255,0.21) |  |  | clip |  |
| ···Arranque › Frame | Vector (1160:793) | 960,976 | 10×10 |  |  | #000000 2px center |  |  |  |
| ···Arranque › Frame | Vector (1160:794) | 960,976 | 10×10 |  |  | #000000 2px center |  |  |  |
| ···Arranque › Frame | Vector (1160:796) | 960,1156 | 10×10 |  |  | #000000 2px center |  |  |  |
| ···Arranque › Frame | Vector (1160:797) | 960,1156 | 10×10 |  |  | #000000 2px center |  |  |  |
| ···Arranque › Frame 204 | Ellipse 62 (1173:1340) | 953,926 | 24×24 |  | linear-gradient(180deg, #b8f21e 0%, #97ca0f 100%) |  |  |  |  |
| ···Arranque › Frame 205 | Ellipse 62 (1173:1347) | 953,878 | 24×24 |  | linear-gradient(180deg, #b8f21e 0%, #97ca0f 100%) |  |  |  |  |
| ···Arranque › Frame 206 | Ellipse 62 (1173:1354) | 953,834 | 24×24 |  | linear-gradient(180deg, #b8f21e 0%, #97ca0f 100%) |  |  |  |  |
| ···Arranque › Frame 207 | Ellipse 62 (1173:1361) | 953,704 | 24×24 |  | linear-gradient(180deg, #b8f21e 0%, #97ca0f 100%) |  |  |  |  |
| ···Arranque › Frame 211 | Ellipse 62 (1173:1368) | 953,752 | 24×24 |  | linear-gradient(180deg, #b8f21e 0%, #97ca0f 100%) |  |  |  |  |
| ···Arranque › Frame 208 | Ellipse 62 (1173:1375) | 953,656 | 24×24 |  | linear-gradient(180deg, #b8f21e 0%, #97ca0f 100%) |  |  |  |  |
| ···Arranque › Frame 209 | Ellipse 62 (1173:1382) | 953,612 | 24×24 |  | linear-gradient(180deg, #b8f21e 0%, #97ca0f 100%) |  |  |  |  |
| ···Arranque › Frame 210 | Ellipse 62 (1173:1389) | 953,564 | 24×24 |  | linear-gradient(180deg, #b8f21e 0%, #97ca0f 100%) |  |  |  |  |
| ··Que incluye › Frame | Vector (1160:802) | 1254,1156 | 10×10 |  |  | #000000 2px center |  |  |  |
| ··Que incluye › Frame | Vector (1160:803) | 1254,1156 | 10×10 |  |  | #000000 2px center |  |  |  |
| ···Frame 202 › Frame 203 | Ellipse 62 (1173:1195) | 1483,1149 | 24×24 |  | #101a3e |  |  |  |  |
| ···Frame 202 › Frame 204 | Ellipse 62 (1173:1203) | 1483,926 | 24×24 |  | #101a3e |  |  |  |  |
| ···Frame 202 › Frame 205 | Ellipse 62 (1173:1210) | 1483,878 | 24×24 |  | #101a3e |  |  |  |  |
| ···Frame 202 › Frame 206 | Ellipse 62 (1173:1217) | 1483,834 | 24×24 |  | #101a3e |  |  |  |  |
| ···Frame 202 › Frame 207 | Ellipse 62 (1173:1239) | 1483,704 | 24×24 |  | #101a3e |  |  |  |  |
| ···Frame 202 › Frame 211 | Ellipse 62 (1173:1284) | 1483,752 | 24×24 |  | #101a3e |  |  |  |  |
| ···Frame 202 › Frame 208 | Ellipse 62 (1173:1246) | 1483,656 | 24×24 |  | #101a3e |  |  |  |  |
| ···Frame 202 › Frame 209 | Ellipse 62 (1173:1253) | 1483,612 | 24×24 |  | #101a3e |  |  |  |  |
| ···Frame 202 › Frame 210 | Ellipse 62 (1173:1260) | 1483,564 | 24×24 |  | #101a3e |  |  |  |  |
| ·Comparativa › Que incluye | Vector 20 (1160:701) | 331,350 | 1263×0 |  |  | rgba(154,165,192,0.8) 1px inside |  |  |  |

_Nodos ocultos: 0 · nodos más profundos que 7: 24_

## 06 · Módulos (band:modulos) — 1920×1290 @ y=4217

![Módulos](png/06-modulos.png)

Componente: `src/components/pricing/PricingPage.tsx (módulos)`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (46)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 853,111 | //modulos |  | Montserrat | 300 | 14 | 22 | 3.5px (0.25em) | — | #1a4dff | center/center | 214  |
| ↳ | // | | = | 700 | = | = | = | = | #1a4dff | | |
| ↳ | modulos | | = | 700 | = | = | = | UPPER | #1a4dff | | |
| 592,173 | Añade lo que necesites |  | Montserrat | 700 | 52 | 52 | 0 | — | #000000 | center/center | 736  |
| 484,234 | Cada modulo se enchufa sobre lo que ya tienes. Sin rehacer nada y sin… |  | Montserrat | 400 | 18 | 27 | 0 | — | #000000 | center/center | 952  |
| 275,422 | Empezaste por el Arranque y ahora quieres la marca y la web premium. … |  | Montserrat | 400 | 15 | 17 | 0 | — | #000000 | left/top | 388  |
| 275,365 | La web, después |  | Montserrat | 700 | 22 | 24 | 0 | — | #000000 | left/top | 297  |
| 275,505 | 3.000 € |  | Montserrat | 600 | 25 | 30 | 0 | — | #000000 | left/top | 242  |
| 1142,354 | + |  | Montserrat | 500 | 25 | 34 | 0 | — | #ffffff | center/center | 18  |
| 766,417 | Bloque de 500 conversaciones más al mes. Pasarte de la cuota nunca co… |  | Montserrat | 400 | 15 | 17 | 0 | — | #000000 | left/top | 388  |
| 766,367 | Conversaciones extra⏎ |  | Montserrat | 700 | 22 | 30 | 0 | — | #000000 | left/top | 297  |
| 766,503 | 99 €/mes |  | Montserrat | 600 | 25 | 30 | 0 | — | #1a4dff | left/top | 242  |
| 1257,422 | Bloque de 1.000 conversaciones más al mes para planes sin WhatsApp, d… |  | Montserrat | 400 | 15 | 17 | 0 | — | #000000 | left/top | 388  |
| 1257,365 | Conversaciones extra solo web⏎ |  | Montserrat | 700 | 22 | 24 | 0 | — | #000000 | left/top | 273  |
| ↳ | Conversaciones extra  | | = | = | = | = | = | = | = | | |
| ↳ | solo web⏎ | | = | 400 | = | = | = | = | = | | |
| 1257,505 | 59 €/ mes |  | Montserrat | 600 | 25 | 30 | 0 | — | #1a4dff | left/top | 242  |
| 274,698 | Otro centro con su propia agenda, su horario, su equipo y sus métrica… |  | Montserrat | 400 | 15 | 17 | 0 | — | #000000 | left/top | 388  |
| 274,641 | Sede adicional⏎ |  | Montserrat | 700 | 22 | 24 | 0 | — | #000000 | left/top | 297  |
| 274,781 | 490 € + 49 €/mes |  | Montserrat | 700 | 25 | 30 | 0 | — | #000000 | left/top | 260  |
| ↳ | 490 €  | | = | 600 | = | = | = | = | = | | |
| ↳ | + 49 €/mes | | = | 600 | = | = | = | = | #1a4dff | | |
| 766,697 | El agente atiende y reserva en otro idioma, con su propio tono de mar… |  | Montserrat | 400 | 15 | 17 | 0 | — | #000000 | left/top | 388  |
| 766,640 | Idioma adicional⏎⏎ |  | Montserrat | 700 | 22 | 24 | 0 | — | #000000 | left/top | 297  |
| 766,781 | 390 € + 29 €/mes |  | Montserrat | 700 | 25 | 30 | 0 | — | #000000 | left/top | 242  |
| ↳ | 390 €  | | = | 600 | = | = | = | = | = | | |
| ↳ | + 29 €/mes | | = | 600 | = | = | = | = | #1a4dff | | |
| 1257,698 | Tu POS, tu ERP, tu CRM actual o tu software de facturación. Se estudi… |  | Montserrat | 400 | 15 | 17 | 0 | — | #000000 | left/top | 388  |
| 1257,641 | Integracion con tus sistemas⏎ |  | Montserrat | 700 | 22 | 24 | 0 | — | #000000 | left/top | 308  |
| 1257,781 | a presupuestar |  | Montserrat | 600 | 25 | 30 | 0 | — | #1a4dff | left/top | 242  |
| 1142,630 | + |  | Montserrat | 500 | 25 | 34 | 0 | — | #ecefff | center/center | 18  |
| 274,979 | Marca al detalle: aplicaciones, papeleria, senaletica y normas de uso… |  | Montserrat | 600 | 15 | 17 | 0 | — | #000000 | left/top | 387  |
| ↳ | Marca al detalle: | | = | = | = | = | = | = | = | | |
| ↳ |  aplicaciones, papeleria, senaletica y normas de uso. Incluido en Orb… | | = | 400 | = | = | = | = | = | | |
| 274,920 | Manual de Identidad⏎-completo⏎⏎ |  | Montserrat | 700 | 22 | 24 | 0 | — | #000000 | left/top | 297  |
| ↳ | Manual de Identidad⏎ | | = | = | = | = | = | = | = | | |
| ↳ | -completo⏎ | | = | 400 | = | = | = | = | = | | |
| ↳ | ⏎ | | = | = | = | = | = | = | = | | |
| 274,1055 | 1.490 €/mes |  | Montserrat | 600 | 25 | 30 | 0 | — | #1a4dff | left/top | 242  |
| 765,972 | Fotografia y video de marca, y formación a tu equipo para sacarle tod… |  | Montserrat | 600 | 15 | 17 | 0 | — | #000000 | left/top | 388  |
| ↳ | Fotografia y video de marca, | | = | = | = | = | = | = | = | | |
| ↳ |  y formación a tu equipo para sacarle todo al sistema. | | = | 400 | = | = | = | = | = | | |
| 765,915 | Contenido y formacion⏎⏎⏎ |  | Montserrat | 700 | 22 | 24 | 0 | — | #000000 | left/top | 341  |
| 765,1032 | desde 690 € -⏎formacion 490 € |  | Montserrat | 700 | 25 | 25 | 0 | — | #000000 | left/top | 242  |
| ↳ | desde 690 €  | | = | 600 | = | = | = | = | = | | |
| ↳ | -⏎formacion 490 € | | = | 600 | = | = | = | = | #1a4dff | | |

### Contenedores (48)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| Módulos | Rectangle 133 (1160:983) | 0,0 | 1921×1290 |  | linear-gradient(180deg, #f4f6ff 0%, rgba(213,218,233,0.74) 100%) |  |  |  |  |
| Módulos | Servicio Digital experience (1173:1191) | 854,105 | 213×35 | 50 |  | linear-gradient(124deg, #1a4dff 0%, #102e99 100%) 1px inside |  | clip |  |
| ·Módulos › Servicio Digital experi… | Vector (1173:1192) | 908,-302 | 425×429 |  | radial-gradient(212px 214px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| Módulos | modulo (823:203) | 239,324 | 459×244 | 25 | linear-gradient(180deg, #ffffff 0%, #ffffff 100%) | linear-gradient(0deg, #94b2fc 0%, #c7d7ff 100%) 1px inside | box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2) | clip |  |
| ··modulo › Frame | Vector (1185:1538) | 634,518 | 26×0 |  |  | #556a9e 2px center |  |  |  |
| ··modulo › Frame | Vector (1185:1539) | 649,509 | 10×18 |  |  | #556a9e 2px center |  |  |  |
| Módulos | modulo (756:27979) | 730,324 | 459×244 | 25 | #ffffff | linear-gradient(0deg, #94b2fc 0%, #c7d7ff 100%) 1px inside | box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2) | clip |  |
| ·Módulos › modulo | Servicio Digital experience (1163:991) | 1107,347 | 57×57 | 15 | linear-gradient(180deg, #1a4dff 0%, #1036ba 100%) |  |  | clip |  |
| ····Frame › Group | Vector (1163:994) | 1130,363 | 12×21 |  | #ffffff |  |  |  |  |
| ····Frame › Group | Vector (1163:995) | 1125,377 | 22×14 |  | #ffffff |  |  |  |  |
| ··modulo › Frame | Vector (1185:1568) | 1125,518 | 26×0 |  |  | #556a9e 2px center |  |  |  |
| ··modulo › Frame | Vector (1185:1569) | 1140,509 | 10×18 |  |  | #556a9e 2px center |  |  |  |
| Módulos | modulo (823:217) | 1221,324 | 459×244 | 25 | #ffffff | linear-gradient(0deg, #94b2fc 0%, #c7d7ff 100%) 1px inside | box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2) | clip |  |
| ·Módulos › modulo | Servicio Digital experience (1163:1006) | 1598,347 | 57×57 | 15 | linear-gradient(180deg, #1a4dff 0%, #1036ba 100%) |  |  | clip |  |
| ···Servicio Digital experi… › Frame | Vector (825:242) | 1614,363 | 25×25 |  | #ffffff |  |  |  |  |
| ··modulo › Frame | Vector (1185:1577) | 1616,518 | 26×0 |  |  | #556a9e 2px center |  |  |  |
| ··modulo › Frame | Vector (1185:1578) | 1631,509 | 10×18 |  |  | #556a9e 2px center |  |  |  |
| Módulos | Servicio Digital experience (823:211) | 616,361 | 57×57 | 15 | linear-gradient(180deg, #1a4dff 0%, #1036ba 100%) |  |  | clip |  |
| ···Frame › Group | Vector (823:215) | 639,377 | 12×21 |  | #ffffff |  |  |  |  |
| ···Frame › Group | Vector (823:216) | 634,391 | 22×14 |  | #ffffff |  |  |  |  |
| Módulos | modulo (825:248) | 239,600 | 459×244 | 25 | #ffffff | linear-gradient(0deg, #94b2fc 0%, #c7d7ff 100%) 1px inside | box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2) | clip |  |
| ·Módulos › modulo | Servicio Digital experience (1163:1012) | 616,622 | 57×57 | 15 | linear-gradient(180deg, #1a4dff 0%, #1036ba 100%) |  |  | clip |  |
| ···Servicio Digital experi… › Frame | Vector (825:276) | 632,638 | 25×25 |  | #ffffff |  |  |  |  |
| ··modulo › Frame | Vector (1185:1529) | 634,794 | 26×0 |  |  | #556a9e 2px center |  |  |  |
| ··modulo › Frame | Vector (1185:1530) | 649,785 | 10×18 |  |  | #556a9e 2px center |  |  |  |
| Módulos | modulo (825:261) | 730,600 | 459×244 | 25 | #ffffff | linear-gradient(180deg, #94b2fc 0%, #c7d7ff 100%) 1px inside | box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2) | clip |  |
| ··modulo › Frame | Vector (1185:1560) | 1125,794 | 26×0 |  |  | #556a9e 2px center |  |  |  |
| ··modulo › Frame | Vector (1185:1561) | 1140,785 | 10×18 |  |  | #556a9e 2px center |  |  |  |
| Módulos | modulo (825:283) | 1221,600 | 459×244 | 25 | #ffffff | linear-gradient(180deg, #94b2fc 0%, #c7d7ff 100%) 1px inside | box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2) | clip |  |
| ·Módulos › modulo | Servicio Digital experience (1163:1027) | 1598,623 | 57×57 | 15 | linear-gradient(180deg, #1a4dff 0%, #1036ba 100%) |  |  | clip |  |
| ····Frame › _01_1_ | Vector (825:302) | 1624,649 | 4×4 |  | #ffffff |  |  |  |  |
| ····Frame › _01_1_ | Vector (825:303) | 1613,638 | 27×27 |  | #ffffff |  |  |  |  |
| ··modulo › Frame | Vector (1185:1585) | 1616,794 | 26×0 |  |  | #556a9e 2px center |  |  |  |
| ··modulo › Frame | Vector (1185:1586) | 1631,785 | 10×18 |  |  | #556a9e 2px center |  |  |  |
| Módulos | Servicio Digital experience (825:269) | 1107,623 | 57×57 | 15 | linear-gradient(180deg, #1a4dff 0%, #1036ba 100%) |  |  | clip |  |
| ···Frame › world_1_ | Vector (825:296) | 1123,639 | 25×25 |  | #ffffff |  |  |  |  |
| Módulos | modulo (830:362) | 239,876 | 459×244 | 25 | #ffffff | linear-gradient(180deg, #94b2fc 0%, #c7d7ff 100%) 1px inside | box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2) | clip |  |
| ··modulo › Frame | Vector (1173:1466) | 634,1067 | 26×0 |  |  | #556a9e 2px center |  |  |  |
| ··modulo › Frame | Vector (1173:1467) | 649,1058 | 10×18 |  |  | #556a9e 2px center |  |  |  |
| Módulos | modulo (832:388) | 730,876 | 459×244 | 25 | #ffffff | linear-gradient(180deg, #94b2fc 0%, #c7d7ff 100%) 1px inside | box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2) | clip |  |
| ··modulo › Frame | Vector (1185:1552) | 1125,1067 | 26×0 |  |  | #556a9e 2px center |  |  |  |
| ··modulo › Frame | Vector (1185:1553) | 1140,1058 | 10×18 |  |  | #556a9e 2px center |  |  |  |
| Módulos | Servicio Digital experience (830:370) | 616,885 | 57×57 | 15 | linear-gradient(180deg, #1a4dff 0%, #1036ba 100%) |  |  | clip |  |
| Módulos | Servicio Digital experience (832:396) | 1107,885 | 57×57 | 15 | linear-gradient(180deg, #1a4dff 0%, #1036ba 100%) |  |  | clip |  |
| ···Frame › Group | Vector (834:413) | 1123,902 | 26×22 |  | #ffffff |  |  |  |  |
| ···Frame › Group | Vector (834:414) | 1133,910 | 6×7 |  | #ffffff |  |  |  |  |
| ··Frame › Group | Vector (832:378) | 636,904 | 18×18 |  | #ffffff |  |  |  |  |
| ··Frame › Group | Vector (832:379) | 631,899 | 28×28 |  | #ffffff |  |  |  |  |

_Nodos ocultos: 0 · nodos más profundos que 7: 0_

## 07 · Formas de pago (band:formas-de-pago) — 1920×1239 @ y=5507

![Formas de pago](png/07-formas-de-pago.png)

Componente: `src/components/pricing/PricingPage.tsx (pago)`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (24)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 833,152 | //formas de pago |  | Montserrat | 300 | 14 | 22 | 3.5px (0.25em) | — | #1a4dff | center/center | 252  |
| ↳ | // | | = | 700 | = | = | = | = | #1a4dff | | |
| ↳ | formas de pago | | = | 700 | = | = | = | UPPER | #1a4dff | | |
| 485,221 | El desembolso inicial no deberia ser motivo de no hacerlo |  | Montserrat | 700 | 52 | 50 | 0 | — | #0b1226 | center/center | 950  |
| 485,366 | Cuatro maneras de entrar , sin subvenciones de por medio. Ejemplo sob… |  | Montserrat | 400 | 18 | 27 | 0 | — | #000000 | center/center | 952  |
| 261,918 | 0€ de entrada |  | Montserrat | 700 | 30 | 30 | 0 | — | #1a4dff | center/center | 297  |
| 629,918 | -5€ |  | Montserrat | 700 | 30 | 30 | 0 | — | #1a4dff | center/center | 295  |
| 1001,918 | 3 plazos |  | Montserrat | 700 | 30 | 30 | 0 | — | #1a4dff | center/center | 287  |
| 1373,918 | +0.4% |  | Montserrat | 700 | 30 | 30 | 0 | — | #1a4dff | center/center | 287  |
| 261,952 | Recomendado |  | Montserrat | 500 | 16 | 16 | 0 | — | #000000 | center/top | 292  |
| 634,952 | Contado |  | Montserrat | 500 | 16 | 16 | 0 | — | #000000 | center/top | 301  |
| 997,952 | Fraccionado |  | Montserrat | 500 | 16 | 16 | 0 | — | #000000 | center/top | 291  |
| 1369,952 | Lo mismo, no mas caro |  | Montserrat | 500 | 16 | 16 | 0 | — | #000000 | center/top | 291  |
| 261,1022 | Sin desembolso inicial. La puesta en marcha se reparte en la cuota du… |  | Montserrat | 600 | 16 | 21 | 0 | — | #000000 | left/top | 288  |
| ↳ | Sin desembolso inicial. La puesta en marcha se reparte en la cuota du… | | = | 400 | 14 | 16 | = | = | = | | |
| ↳ | 1.490 €/mes | | = | 700 | = | = | = | = | #030617 | | |
| 629,1022 | Pago unico de la puesta en marcha con un 5% de descuento, mas la cuot… |  | Montserrat | 600 | 16 | 21 | 0 | — | #000000 | left/top | 295  |
| ↳ | Pago unico de la puesta en marcha  | | = | 400 | = | = | = | = | = | | |
| ↳ | con un 5% de descuento, mas la cuota mensual desde el primer mes.⏎ | | = | 400 | = | = | = | = | = | | |
| ↳ | 5.605 € + 349 €/mes | | = | 700 | = | = | = | = | #030617 | | |
| 1001,1022 | 40 % al firmar, 30% a la entrega de la web y 30% al arrancar el agent… |  | Montserrat | 400 | 16 | 21 | 0 | — | #000000 | left/top | 291  |
| ↳ | 2.360 / 1.770 / 1.770€ | | = | 700 | = | = | = | = | #030617 | | |
| 1369,1022 | Las dos vías cuestan prácticamente igual: 12.222 € en 18 meses sin en… |  | Montserrat | 400 | 16 | 21 | 0 | — | #000000 | left/top | 291  |
| ↳ | Sin cargo por financiar | | = | 700 | = | = | = | = | #030617 | | |

### Contenedores (11)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| Formas de pago | Servicio Digital experience (1185:1588) | 833,146 | 253×35 | 50 |  | linear-gradient(119deg, #1a4dff 0%, #102e99 100%) 1px inside |  | clip |  |
| ·Formas de pago › Servicio Digital experi… | Vector (1185:1589) | 907,-261 | 425×429 |  | radial-gradient(212px 214px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| Formas de pago | Servicio Digital experience (1185:1600) | 240,473 | 336×303 | 30 30 30 39 | linear-gradient(180deg, #1a4dff 0%, #0a1540 100%) | linear-gradient(180deg, #94b2fc 0%, #ffffff 100%) 1.5px ins… |  | clip |  |
| ·Formas de pago › Servicio Digital experi… | Vector (1185:1601) | 337,323 | 392×378 |  | radial-gradient(196px 189px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| Formas de pago | Rectangle 20 (836:417) | 261,897 | 295×92 | 47 | #d5dae9 | #1a4dff 1px inside |  |  |  |
| Formas de pago | Rectangle 130 (836:440) | 629,897 | 295×92 | 47 | #d5dae9 | #1a4dff 1px inside |  |  |  |
| Formas de pago | Rectangle 131 (836:444) | 997,897 | 295×92 | 47 | #d5dae9 | #1a4dff 1px inside |  |  |  |
| Formas de pago | Rectangle 132 (836:449) | 1365,897 | 295×92 | 47 | #d5dae9 | #1a4dff 1px inside |  |  |  |
| Formas de pago | Line 2 (836:425) | 556,944 | 73×0 |  |  | #1a4dff 1px center |  |  |  |
| Formas de pago | Line 3 (836:445) | 924,944 | 73×0 |  |  | #1a4dff 1px center |  |  |  |
| Formas de pago | Line 4 (836:450) | 1292,944 | 73×0 |  |  | #1a4dff 1px center |  |  |  |

_Nodos ocultos: 0 · nodos más profundos que 7: 0_

## 08 · Dudas razonables (band:dudas-razonables) — 1920×801 @ y=6746

![Dudas razonables](png/08-dudas-razonables.png)

Componente: `src/components/pricing/PricingPage.tsx (FAQ)`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (18)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 821,6 | //dudas razonables |  | Montserrat | 300 | 14 | 22 | 3.5px (0.25em) | — | #1a4dff | center/center | 278  |
| ↳ | // | | = | 700 | = | = | = | = | #1a4dff | | |
| ↳ | dudas razonables | | = | 700 | = | = | = | UPPER | #1a4dff | | |
| 608,88 | Preguntas? Respuestas |  | Montserrat | 700 | 52 | 52 | 0 | — | #0b1226 | center/center | 704  |
| ↳ | Preguntas?  | | = | = | = | = | = | = | #030617 | | |
| ↳ | Respuestas | | = | = | = | = | = | = | = | | |
| 649,201 | ¿Qué estoy pagando exactamente en la cuota mensual? |  | Montserrat | 700 | 16 | 23 | 0 | — | #000000 | left/top | 576  |
| 1221,198 | + |  | Montserrat | 500 | 42 | 34 | 0 | — | #1a4dff | center/center | 91  |
| 649,294 | Ya tengo web. ¿Puedo contratar solo el agente? |  | Montserrat | 700 | 16 | 23 | 0 | — | #000000 | left/top | 576  |
| 1221,291 | + |  | Montserrat | 500 | 42 | 34 | 0 | — | #1a4dff | center/center | 91  |
| 649,387 | Empiezo por Signal. ¿Qué pasa si luego quiero reservas? |  | Montserrat | 700 | 16 | 23 | 0 | — | #000000 | left/top | 576  |
| 1221,384 | + |  | Montserrat | 500 | 42 | 34 | 0 | — | #1a4dff | center/center | 91  |
| 649,480 | ¿Y si la IA se equivoca o se inventa algo? |  | Montserrat | 700 | 16 | 23 | 0 | — | #000000 | left/top | 576  |
| 1221,477 | + |  | Montserrat | 500 | 42 | 34 | 0 | — | #1a4dff | center/center | 91  |
| 649,573 | ¿Qué pasa si me paso de las conversaciones incluidas? |  | Montserrat | 700 | 16 | 23 | 0 | — | #000000 | left/top | 576  |
| 1221,570 | + |  | Montserrat | 500 | 42 | 34 | 0 | — | #1a4dff | center/center | 91  |
| 649,666 | ¿Hay permanencia? ¿Puedo irme? |  | Montserrat | 700 | 16 | 23 | 0 | — | #000000 | left/top | 576  |
| 1221,663 | + |  | Montserrat | 500 | 42 | 34 | 0 | — | #1a4dff | center/center | 91  |

### Contenedores (20)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| Dudas razonables | Servicio Digital experience (1185:1647) | 821,0 | 278×35 | 50 |  | linear-gradient(117deg, #1a4dff 0%, #102e99 100%) 1px inside |  | clip |  |
| ·Dudas razonables › Servicio Digital experi… | Vector (1185:1648) | 908,-407 | 420×429 |  | radial-gradient(210px 214px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| Dudas razonables | Que incluye (1185:1883) | 608,171 | 704×80 | 25 | rgba(255,255,255,0.5) | linear-gradient(0deg, #9babd4 0%, #c7d7ff 100%) 1.3px inside |  | clip |  |
| ··Que incluye › Frame | Vector (1185:2027) | 1101,584 | 5×11 |  |  | #000000 2px center |  |  |  |
| ··Que incluye › Frame | Vector (1185:2028) | 1101,584 | 5×11 |  |  | #000000 2px center |  |  |  |
| Dudas razonables | Que incluye (1185:2106) | 608,264 | 704×80 | 25 | rgba(255,255,255,0.5) | linear-gradient(0deg, #9babd4 0%, #c7d7ff 100%) 1.3px inside |  | clip |  |
| ··Que incluye › Frame | Vector (1185:2108) | 1101,677 | 5×11 |  |  | #000000 2px center |  |  |  |
| ··Que incluye › Frame | Vector (1185:2109) | 1101,677 | 5×11 |  |  | #000000 2px center |  |  |  |
| Dudas razonables | Que incluye (1185:2112) | 608,357 | 704×80 | 25 | rgba(255,255,255,0.5) | linear-gradient(0deg, #9babd4 0%, #c7d7ff 100%) 1.3px inside |  | clip |  |
| ··Que incluye › Frame | Vector (1185:2114) | 1101,770 | 5×11 |  |  | #000000 2px center |  |  |  |
| ··Que incluye › Frame | Vector (1185:2115) | 1101,770 | 5×11 |  |  | #000000 2px center |  |  |  |
| Dudas razonables | Que incluye (1185:2118) | 608,450 | 704×80 | 25 | rgba(255,255,255,0.5) | linear-gradient(0deg, #9babd4 0%, #c7d7ff 100%) 1.3px inside |  | clip |  |
| ··Que incluye › Frame | Vector (1185:2120) | 1101,863 | 5×11 |  |  | #000000 2px center |  |  |  |
| ··Que incluye › Frame | Vector (1185:2121) | 1101,863 | 5×11 |  |  | #000000 2px center |  |  |  |
| Dudas razonables | Que incluye (1185:2124) | 608,543 | 704×80 | 25 | rgba(255,255,255,0.5) | linear-gradient(0deg, #9babd4 0%, #c7d7ff 100%) 1.3px inside |  | clip |  |
| ··Que incluye › Frame | Vector (1185:2126) | 1101,956 | 5×11 |  |  | #000000 2px center |  |  |  |
| ··Que incluye › Frame | Vector (1185:2127) | 1101,956 | 5×11 |  |  | #000000 2px center |  |  |  |
| Dudas razonables | Que incluye (1185:2130) | 608,636 | 704×80 | 25 | rgba(255,255,255,0.5) | linear-gradient(0deg, #9babd4 0%, #c7d7ff 100%) 1.3px inside |  | clip |  |
| ··Que incluye › Frame | Vector (1185:2132) | 1101,1049 | 5×11 |  |  | #000000 2px center |  |  |  |
| ··Que incluye › Frame | Vector (1185:2133) | 1101,1049 | 5×11 |  |  | #000000 2px center |  |  |  |

_Nodos ocultos: 0 · nodos más profundos que 7: 0_

## 09 · CTA final (band:cta-final) — 1920×659 @ y=7547

![CTA final](png/09-cta-final.png)

Componente: `src/components/pricing/PricingPage.tsx (cta)`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (7)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 572,212 | Llamada de estrategia sin compromiso. Salimos con un número: cuántos … |  | Montserrat | 400 | 18 | 23 | 0 | — | #ffffff | center/top | 772  |
| 483,379 | Precios en euros, sin IVA. Vigentes desde agosto de 2026. |  | Montserrat | 400 | 14 | 23 | 0 | — | #1cfcb9 | center/top | 949  |
| 572,126 | No estas seguro por donde comenzar? |  | Montserrat | 700 | 40 | 40 | 0 | — | #ffffff | center/center | 766  |
| 848,310 | Reservar llamada |  | Montserrat | 600 | 15 | 36 | 0 | — | #1a4dff | center/center | 221  |
| 851,59 | //siguiente paso |  | Montserrat | 300 | 14 | 22 | 3.5px (0.25em) | — | #ffffff | center/center | 214  |
| ↳ | // | | = | 700 | = | = | = | = | #ffffff | | |
| ↳ | siguiente paso | | = | 700 | = | = | = | UPPER | #ffffff | | |

### Contenedores (5)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| CTA final | Servicio Digital experience (1185:1632) | 360,0 | 1197×460 | 35 | linear-gradient(180deg, #3b67ff 0%, #29459f 100%) |  |  | clip |  |
| ·CTA final › Servicio Digital experi… | Servicio Digital experience (1185:1636) | 847,285 | 223×69 | 50 | #ffffff | #94b2fc 1px inside |  | clip |  |
| ··Servicio Digital experi… › Servicio Digital experi… | Vector (1185:1637) | 907,-239 | 419×564 |  | radial-gradient(210px 282px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |
| ·CTA final › Servicio Digital experi… | Servicio Digital experience (1185:1643) | 832,52 | 253×40 | 50 |  | #ffffff 1px inside |  | clip |  |
| ··Servicio Digital experi… › Servicio Digital experi… | Vector (1185:1644) | 906,-418 | 425×495 |  | radial-gradient(212px 248px at 50% 50%, #1a4dff 0%, rgba(46,107,255,0.12) 81%, rgba(46,107,255,0) 100%) |  | filter: blur(7.3px) |  |  |

_Nodos ocultos: 0 · nodos más profundos que 7: 0_

## 10 · Hablemos y pie (band:hablemos-y-pie) — 1920×800 @ y=8206

![Hablemos y pie](png/10-hablemos-y-pie.png)

Componente: `src/components/sections/FinalCTA.tsx + Footer`  
Contenedor: relleno — · radio 0 · layout — · efectos —

### Textos (9)

| Pos | Texto | Estilo | Familia | Peso | Tamaño | Interlínea | Tracking | Caja | Color | Alineación | Ancho |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1067,637 | © 2026 Asenix          Tearms / Privacy |  | Montserrat | 400 | 16 | 66 | 0 | — | #ffffff | right/center | 339  |
| ↳ | © 2026 Asenix           | | = | 600 | = | = | = | = | #ffffff | | |
| ↳ | Tearms / Privacy | | = | 600 | = | = | 1.12px (0.07em) | UPPER | #ffffff | | |
| 362,613 | Designing the future of digital business.⏎Exceptional digital experie… |  | Montserrat | 400 | 20 | 24 | 0 | — | #ffffff | left/center | 582  |
| ↳ | Designing the future of digital business.⏎ | | = | 600 | = | = | = | = | #ffffff | | |
| ↳ | Exceptional digital experiences. Intelligent automation. Tailored tec… | | = | = | = | = | = | = | #ffffff | | |
| 240,179 | Let's talk. We'd love to hear from you. |  | Montserrat | 600 | 75 | 70 | -3.75px (-0.05em) | — | linear-gradient(90deg, #2a54e8 0%, #1133a9 100%) | left/center | 704  |
| ↳ | We'd love to hear from you. | | = | 400 | = | = | = | = | = | | |
| 240,425 | Contact |  | Montserrat | 600 | 24 | 16 | 0 | — | #030617 | center/center | 294  |

### Contenedores (9)

| Ruta | Nodo | Pos | Tamaño | Radio | Relleno | Borde | Efectos | Layout | Opac. |
|---|---|---|---|---|---|---|---|---|---|
| ·Hablemos y pie › Frame 111 | Rectangle 12 (776:28412) | 0,0 | 1920×794 |  | #060e29 |  |  |  |  |
| ·Hablemos y pie › Frame 111 | Rectangle 13 (776:28416) | 240,389 | 293×85 | 43 | linear-gradient(116deg, #a7b2d1 0%, #47537e 100%) |  |  |  |  |
| ··Frame 111 › Group | Vector (776:28419) | 256,601 | 83×68 |  | #ffffff |  |  |  |  |
| ··Frame 111 › Frame | Vector (776:28421) | 1495,628 | 41×41 |  | #ffffff |  |  |  |  |
| ··Frame 111 › Frame | Vector (776:28422) | 1505,636 | 21×20 |  | #060e29 |  |  |  |  |
| ··Frame 111 › Frame | Vector (776:28424) | 1545,628 | 41×41 |  | #ffffff |  |  |  |  |
| ··Frame 111 › Frame | Vector (776:28425) | 1555,638 | 20×21 |  | #060e29 |  |  |  |  |
| ···Frame › Group | Vector (776:28428) | 1445,628 | 41×40 |  | #ffffff |  |  |  |  |
| ···Frame › Group | Vector (776:28429) | 1452,657 | 8×5 |  | #ffffff |  |  |  |  |

_Nodos ocultos: 0 · nodos más profundos que 7: 0_

