# La web de Asenix → Figma

Cómo llevar las páginas de `asenix.es` a Figma para que la diseñadora trabaje
sobre ellas. Hay dos scripts, uno por página:

| Página | Script | Marcos que crea |
| --- | --- | --- |
| `/precios` | [`precios-figma.js`](./precios-figma.js) | `Precios — Desktop 1440` · `Precios — Móvil 390` |
| `/calculadora` | [`calculadora-figma.js`](./calculadora-figma.js) | `Calculadora — Desktop 1440` · `Calculadora — Móvil 390` |

Los dos se ejecutan igual (Scripter), comparten la colección de variables
`Asenix · Marca` y los estilos de texto `Asenix/…`, y son idempotentes.

---

## /precios

La página de precios completa.

Fichero de destino:
<https://www.figma.com/design/rpFxbX49rzFvoXsvFsurty/NG--AI-—-Figma-import--sitio->

---

## Lo que ya está en el fichero

Creado desde aquí, sin tocar nada de lo que ya había:

| Qué | Dónde |
| --- | --- |
| Página vacía `Precios · /precios` | panel de páginas |
| Colección de variables `Asenix · Marca` (17 colores) | Variables |
| 19 estilos de texto `Asenix/…` | Estilos de texto |
| El lockup del logo subido como imagen | quedó un marco suelto en `Page 1`, se puede borrar |

Los colores son los mismos tokens de `src/app/globals.css` (`@theme`), con los
mismos nombres traducidos: `fondo/void`, `acento/neon`, `texto/mist`,
`borde/line`… Cambiar uno repinta todo lo que lo use.

---

## Ruta A — diseño nativo (recomendada)

Construye la página entera como diseño de Figma de verdad: auto-layout,
variables y estilos. Cada texto, color y espaciado es editable.

### Importar paso a paso

Necesitas permiso de **edición** sobre el fichero. Funciona igual en la app de
escritorio y en el navegador.

1. **Abre el fichero de Figma** (el enlace de arriba).
2. **Instala Scripter**: menú `Plugins` → `Explorar plugins en Community` →
   busca **Scripter** (de Rasmus Andersson) → `Ejecutar`. Es gratuito y no pide
   cuenta. La próxima vez lo tendrás en `Plugins → Scripter`.
3. **Copia el script entero**: abre [`precios-figma.js`](./precios-figma.js) y
   selecciona todo (`⌘A` / `Ctrl+A`), copia. Son 1.700 líneas — tienen que ir
   todas, el fichero es autocontenido.
4. **Pega en Scripter**: borra el código de ejemplo que trae el editor y pega el
   tuyo encima.
5. **Ejecuta**: botón ▶ arriba a la izquierda, o `⌘↩` / `Ctrl+↩`.

Tarda entre 10 y 30 segundos. Cuando acaba, Figma salta solo a los dos marcos
recién creados y en la consola de Scripter aparece:

```
✅ /precios construido en Figma [ { name: 'Precios — Desktop 1440', … },
                                 { name: 'Precios — Móvil 390', … } ]
```

Si no ves esa línea, lo que salga en rojo en la consola es el error: mándamelo
tal cual y lo corrijo sobre el script.

### Alternativa sin plugin de terceros

Si prefieres no instalar Scripter, vale un plugin de desarrollo local (necesita
la **app de escritorio** de Figma):

1. Crea una carpeta con `precios-figma.js` renombrado a `code.js`, y al lado un
   `manifest.json`:
   ```json
   { "name": "Asenix · precios", "id": "asenix-precios",
     "api": "1.0.0", "main": "code.js", "editorType": ["figma"] }
   ```
2. En `code.js`, sustituye las dos últimas líneas activas por el bloque que hay
   comentado justo debajo (allí no existe el `await` de primer nivel).
3. Figma → `Plugins` → `Desarrollo` → `Importar plugin desde manifiesto…`
4. `Plugins` → `Desarrollo` → `Asenix · precios`.

### Después de ejecutarlo

- En `Page 1` quedó un marco suelto con el logo, de cuando lo subí al fichero.
  Se puede borrar sin más.
- Los marcos se generan en la página `Precios · /precios`, no en `Page 1`.

Resultado: dentro de la página `Precios · /precios`, dos marcos uno al lado
del otro — **`Precios — Desktop 1440`** y **`Precios — Móvil 390`** — cada uno
con las mismas 10 secciones nombradas y ordenadas:

```
01 · Barra superior   02 · Cabecera        03 · Planes
04 · Diagnóstico      05 · Comparativa     06 · Módulos
07 · Formas de pago   08 · FAQ             09 · CTA final
10 · Pie
```

Es idempotente: si lo vuelves a ejecutar, borra los marcos y los regenera.
Las variables y los estilos se reutilizan, no se duplican.

### Qué cambia en el marco de 390

Los dos marcos salen del mismo código, con los puntos de ruptura reales del
CSS aplicados — no es un desktop reescalado:

| | Desktop 1440 | Móvil 390 |
| --- | --- | --- |
| Planes | 4 columnas de 293 px | apilados, 342 px |
| Módulos | 3 columnas de 400 px | apilados, 342 px |
| Formas de pago | 4 columnas de 296 px | apilados, 342 px |
| Comparativa | 1232 px, entra entera | 820 px dentro de un marco recortado a 342 (`overflow-x-auto`) |
| Lockup de la barra superior | visible | oculto (`hidden sm:block`) |
| Avisos «0 € de entrada» y «Diagnóstico» | fila, centrados | columna, alineados a la izquierda |
| H1 | 83,2 px | 41,6 px |
| H2 de sección | 48 px | 30,4 px |
| Cabecera, arriba | 112 px | 80 px |

Los tres tamaños de titular del móvil son estilos de texto propios
(`Asenix/Display H1 · 390`, `Asenix/H2 Sección · 390`,
`Asenix/H2 CTA final · 390`): los `clamp()` del CSS resueltos a 390 px.

**Qué es fiel y qué no**

- Fiel: textos (los reales del diccionario ES), jerarquía, colores, radios,
  sombras, degradados, anchos de rejilla y espaciados, calculados a viewport
  1440 con los `clamp()` del CSS ya resueltos.
- Aproximado: la tipografía de display. La web usa Space Grotesk con peso 600
  variable; Figma solo ofrece 500/700, así que los títulos van en **Bold**.
- Simplificado: la rejilla de fondo con máscara radial (no se ha replicado; las
  tres brumas de color sí están, como elipses con desenfoque).
- Estados: las respuestas del FAQ están todas creadas, pero solo la primera
  visible — igual que en la web. Las demás están como capas ocultas.
- Los iconos `✓` y `—` de la comparativa son texto, no los iconos de Lucide.

## Ruta B — importación rápida

La misma vía con la que se trajo la página anterior: el plugin
**html.to.design** → pestaña *Import from URL* → `https://asenix.es/precios`.

Es un clic y sale pixel-perfect, pero produce capas planas sin variables ni
auto-layout — cuesta más editarlo después. Sirve como referencia visual al lado
de la Ruta A.

---

---

## /calculadora

La calculadora pública de retorno. Script:
[`calculadora-figma.js`](./calculadora-figma.js). Mismo procedimiento que el de
`/precios` — Scripter, pegar entero, ▶ — y crea la página
`Calculadora · /calculadora` con dos marcos:

```
Calculadora — Desktop 1440      Calculadora — Móvil 390
```

Cada uno con las mismas secciones nombradas:

```
01 · Barra superior    02 · Cabecera
03 · Formulario y cuenta               04 · Hipótesis
05 · Desglose y Diagnóstico            06 · Resumen fijo (solo en el de 390)
07 · Pie
```

### Qué se ve en los marcos

Los marcos **no** están en blanco: se pintan con el caso de ejemplo de la
página (el botón «Ver un ejemplo»), peluquería con ticket de 45 €, 6 visitas al
año, 10 consultas sin responder a la semana y 12 plantones al mes, comparado
contra el plan Arranque. Y las cifras del panel de resultado no están escritas
a mano: el script lleva dentro una copia exacta de `calculate()` de
`src/i18n/calculadora.ts` y las calcula al ejecutarse. Si el motor cambia en el
código, se cambia también aquí y los marcos siguen enseñando números de verdad.

Con ese caso salen: se paga solo en **3,9 meses**, entran **1.097 €/mes**,
cuesta **591 €/mes** y quedan **507 €/mes** a favor, con un retorno del 86 % a
doce meses.

### Qué cambia en el marco de 390

| | Desktop 1440 | Móvil 390 |
| --- | --- | --- |
| Rejilla principal | formulario 780 px + panel de cuenta 420 px | apilados, 342 px |
| Campos de cada paso | 2 columnas de 348 px | apilados |
| Tarjetas de plan | 2 columnas | apiladas |
| Las tres hipótesis | 3 columnas | apiladas |
| Bloque de captura | 2 columnas | apiladas |
| Lockup de la barra superior | visible | oculto (`hidden sm:block`) |
| Resumen fijo abajo | no existe (`lg:hidden`) | sí, con el hueco de 148 px para los botones flotantes |
| H1 | 64 px | 35,2 px |
| Cifra del payback | 57,6 px | 41,6 px |

Los tamaños del móvil son estilos de texto propios (`Asenix/Calc H1 · 390`,
`Asenix/Calc H2 · 390`, `Asenix/Calc H3 · 390`, `Asenix/Calc Payback · 390`):
los `clamp()` del CSS resueltos a 390 px.

### Qué es fiel y qué no

- **Fiel**: los textos reales del diccionario ES, la jerarquía, los colores por
  variable, radios, sombras, degradados, anchos de rejilla y espaciados a
  viewport 1440 con los `clamp()` resueltos. Y las cifras, que se calculan.
- **Aproximado**: la tipografía de display (la web usa Space Grotesk 600
  variable; Figma solo da 500/700, así que los titulares van en Bold).
- **Un solo estado**: los marcos enseñan el caso en el que la cuenta sale. La
  página tiene otros dos —el panel vacío antes de rellenar nada y el «Con estos
  números, no sale» con borde morado— que no se materializan como marcos. Si la
  diseñadora los necesita, se añaden.
- **Añade una variable nueva** a la colección: `texto/alerta` (#ff9bb5), el rojo
  del «queda a favor» cuando es negativo. El resto se reutiliza.

---

## Por qué no se hizo directamente desde aquí

El servidor MCP de Figma está limitado a **20 llamadas al mes** en el plan
Starter, y la cuota se agotó a mitad del trabajo. Con un plan Pro (200/día) se
podría construir y verificar la página directamente contra Figma, sin plugin.

## Pendiente

- **`precios-figma.js` tiene datos viejos**: su `DATA` es de antes de la limpieza
  de tarifa (sale el plan Signal, «El más contratado» y el lede antiguo). Los
  marcos que genera hoy NO son la página publicada. Antes de volver a ejecutarlo
  hay que refrescar `DATA` desde `src/i18n/pricing.ts`.
- Versión EN (el diccionario ya la tiene; sería cambiar `DATA` en el script).
- Tablet (768 px): el CSS tiene un estado intermedio de 2 columnas entre 680 y
  1280 px que no se ha materializado como marco.

---

## Home · auditoría contra el Figma de la diseñadora

Esto va al revés que lo anterior: **leer** el diseño de la diseñadora para
comparar la web con él. El fichero es otro —
<https://www.figma.com/design/IxRzkKKPa5XStlUI6UnpBv/Asenix-Web> («Asenix
Web»), marco del home desktop `541:168` — y **no** comparte variables ni
paleta con los scripts de importación de arriba (esos usan tokens viejos).

Se hace por la API REST y no por el MCP porque el plan Starter da 20 llamadas
al MCP al mes; la REST va aparte (10 peticiones/min con asiento Full) y el
script gasta 4.

1. Token: en Figma, menú de cuenta → **Settings** → **Security** → **Personal
   access tokens** → *Generate new token*, con los permisos «File content:
   read» y «File metadata: read». Guárdalo en `.env.local` como
   `FIGMA_TOKEN=…` (está en `.gitignore`; el script nunca lo imprime).
2. `npm run figma:pull` → `docs/figma/home/`: `raw.json` (árbol completo, no
   se commitea), `png/NN-seccion.png` (una captura por sección a escala 1 y el
   marco entero a 0,5), `fills/` + `fills.json` (rellenos de imagen) y
   `meta.json` (lista de secciones ordenadas por `y`).
   Flags: `--skip-raw --skip-png --skip-fills` para repetir solo una parte,
   `--depth 2` si el árbol es demasiado grande, `--sections-parent ID` si las
   secciones están dentro de un envoltorio, `--svg-assets` para exportar
   logos/iconos vectoriales a `svg/`.
3. `npm run figma:spec` (sin red) → `spec.md` (textos y contenedores por
   sección con fuente, peso, tamaño, interlínea, tracking, color, radio,
   relleno, borde, sombras y layout), `tokens.md` (valores únicos del marco
   con el token más cercano de `src/app/globals.css`) y `audit.md` (plantilla
   Figma vs código; no se sobrescribe, `--force-audit` la regenera).

Convenciones de `spec.md`: posiciones relativas a la sección; tracking en px
y en em (para `tracking-[…em]`); desenfoques CSS = radio de Figma / 2.
