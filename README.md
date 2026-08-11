# NEXT GENERATION AI — Website

Sitio cinematográfico de agencia de IA. **Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · GSAP (ScrollTrigger) · Lenis · React Three Fiber.**

## Arranque

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
```

> El vídeo del hero vive en `public/hero.mp4`.

## Arquitectura

```
src/
  app/
    layout.tsx            # fuentes (Space Grotesk + Inter), SEO/OG, providers
    page.tsx              # ensambla las 10 secciones + JSON-LD
    legal/                # privacidad · aviso legal · cookies (bilingües)
    sitemap.ts robots.ts  # generados en el build, viajan con el export
    globals.css           # design tokens (@theme), glass, gradientes, keyframes
  lib/company.ts          # datos identificativos del titular (LSSI-CE/RGPD)
  i18n/legal.ts           # textos legales ES/EN
scripts/
  og-card.mjs             # tarjeta de Open Graph (1200×630)
  postbuild.mjs           # la renderiza a out/og.png tras el build
  components/
    providers/SmoothScroll.tsx   # Lenis + GSAP ticker compartido
    ui/
      CursorGlow.tsx      # halo que sigue el cursor (rAF + lerp)
      MagneticButton.tsx  # CTA magnético con brillo y sheen
      TextReveal.tsx      # titulares palabra a palabra con máscara
    three/AICore.tsx      # núcleo 3D (esfera distorsionada + partículas + anillos)
    layout/               # Navbar de cristal flotante, Footer
    sections/             # Hero, Evolution, Services, Ecosystem, CaseStudies,
                          # Transformation, Process, Technology, Testimonials, FinalCTA
```

## Antes de publicar para un cliente

1. **Rellenar `src/lib/company.ts`** — razón social, NIF y domicilio. Es lo único que
   personalizan las páginas legales, y los valores por defecto son marcadores visibles
   (`[COMPLETAR: …]`) precisamente para que no pasen desapercibidos si se publican.
2. **Revisar los textos legales** (`src/i18n/legal.ts`) para que sigan describiendo lo que
   el sistema hace de verdad: proveedores de IA, hosting y calendario conectado. Una
   política que no coincide con la realidad es peor que no tenerla.
3. **Dominio propio**: apuntar el DNS a GitHub Pages, definir el dominio en Settings →
   Pages y crear la variable de repo `NEXT_PUBLIC_SITE_URL` (p. ej.
   `https://nextgenerationai.es`). El workflow deja entonces el `basePath` vacío y el
   sitemap, el Open Graph y el aviso legal apuntan solos al dominio bueno.

## Legal y privacidad

`/legal/privacidad`, `/legal/aviso-legal` y `/legal/cookies` son bilingües y comparten el
idioma activo de la landing. Están enlazadas desde el pie y desde el widget de chat, que
avisa de que se habla con una IA y de que la conversación se guarda (RGPD, art. 13).

No hay banner de cookies **porque no hay cookies**: el sitio solo usa `sessionStorage`
(identificador de sesión del chat) y `localStorage` (idioma), y la medición de visitas es
propia y sin terceros. Si algún día se añade analítica externa, hay que actualizar
`/legal/cookies` y pedir consentimiento antes de cargarla.

## Decisiones clave

- **Tailwind v4** con tokens en `@theme` (`--color-void`, `--color-electric`, `--color-neon`…) y animaciones (`--animate-marquee`, `--animate-dash`…).
- **Three.js se carga perezosamente** (`next/dynamic`, `ssr:false`); el canvas es `pointer-events-none` y el parallax del ratón se rastrea a nivel de ventana para no bloquear los CTAs.
- **Scroll horizontal de casos** con GSAP pin solo en `md+` y sin `prefers-reduced-motion`; en móvil degrada a carril con `scroll-snap`.
- **Gradientes en titulares animados**: `background-clip: text` debe aplicarse a cada palabra (prop `wordClassName` de `TextReveal`), nunca al contenedor — las palabras son capas compuestas y el clip del padre no las pinta.
- **Reduced motion**: Lenis se desactiva, las animaciones CSS se anulan globalmente y el pin horizontal no se crea.
- **Sin imágenes externas**: capturas de producto simuladas en CSS, logos como wordmarks, iconos Lucide + SVG inline para marcas sociales.
