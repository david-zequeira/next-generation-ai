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
    globals.css           # design tokens (@theme), glass, gradientes, keyframes
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

## Decisiones clave

- **Tailwind v4** con tokens en `@theme` (`--color-void`, `--color-electric`, `--color-neon`…) y animaciones (`--animate-marquee`, `--animate-dash`…).
- **Three.js se carga perezosamente** (`next/dynamic`, `ssr:false`); el canvas es `pointer-events-none` y el parallax del ratón se rastrea a nivel de ventana para no bloquear los CTAs.
- **Scroll horizontal de casos** con GSAP pin solo en `md+` y sin `prefers-reduced-motion`; en móvil degrada a carril con `scroll-snap`.
- **Gradientes en titulares animados**: `background-clip: text` debe aplicarse a cada palabra (prop `wordClassName` de `TextReveal`), nunca al contenedor — las palabras son capas compuestas y el clip del padre no las pinta.
- **Reduced motion**: Lenis se desactiva, las animaciones CSS se anulan globalmente y el pin horizontal no se crea.
- **Sin imágenes externas**: capturas de producto simuladas en CSS, logos como wordmarks, iconos Lucide + SVG inline para marcas sociales.
