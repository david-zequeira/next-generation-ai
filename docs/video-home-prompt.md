# Vídeo del home (hero.mp4) — prompt para Seedance 2.5 en Higgsfield

Uso: `public/hero.mp4`. El Hero lo pinta al 40 % de opacidad, en bucle, sin sonido,
con un viñeteado radial hacia `#030617` y el titular centrado encima. Por eso el vídeo
debe ser oscuro, con el centro despejado, sin texto y con el último plano igual al primero.

## Ajustes
- 16:9 · 1080p o 2K · 24 fps · 25 s (si el clip máximo es menor, ver partición abajo)
- Referencia de imagen: `public/orb.png` (la esfera) y un frame del sitio con el fondo `#030617`
- Seed fija entre clips · Movimiento de cámara: lento · Sin subtítulos ni texto generado

## Prompt principal (inglés, copiar entero)

Cinematic brand film, 25 seconds, 16:9, in the style of an Apple product launch film: quiet confidence, slow deliberate camera moves, shallow depth of field, photoreal macro details mixed with abstract light. Palette: deep midnight navy (#030617) backgrounds, electric blue (#1A4DFF) and cyan (#38D4FF) light as the protagonist, one lime-green (#B8F21E) accent reserved for "confirmed" moments. Dark overall exposure, clean high-contrast highlights, generous negative space in the center of the frame. No text, no letters, no logos, no readable UI, no watermark, no faces in sharp focus.

Shot 1 (0–4 s): Extreme macro, slow push-in. A dark glass sphere floats in black space. A single thread of electric-blue light awakens inside it and traces orbital rings around the core. Volumetric glow, soft caustics on the glass, faint particles. Sound: a low warm sub tone slowly rising.

Shot 2 (4–8 s): Cut to a real place at night: a small Mediterranean clinic reception after closing, lights off, only streetlight through the blinds. A phone on the counter lights up and rings. Slow lateral dolly. The blue light thread enters through the screen and answers the call: the ringing stops, the screen settles into a calm blue pulse. Sound: the ring cut short, then a soft exhale of ambience.

Shot 3 (8–12 s): Macro of a tablet calendar on the counter, rack focus. Empty slots fill one by one with soft blue blocks, precise and unhurried; the last one turns lime green with a tiny confirmation pulse. Sound: three soft, satisfying clicks.

Shot 4 (12–16 s): Wide, next morning. Golden sunlight through the blinds. The owner (40s, seen from behind, out of focus) unlocks the door, glances at the phone, a relaxed exhale. Slow crane up; the warm light gently shifts back toward blue.

Shot 5 (16–21 s): Back to the abstract world. The blue thread multiplies into hundreds of threads connecting floating glass panels (a chat bubble, a calendar, an invoice, a storefront) into one orbiting system around the sphere, like a constellation snapping into alignment. Slow orbital camera, particles, subtle lens bloom. This is the peak "wow" beat.

Shot 6 (21–25 s): Everything collapses into a single calm sphere at the exact center of the frame, breathing softly, ready. The camera settles into a perfectly still, centered composition surrounded by deep dark negative space. Hold the final 2 seconds motionless so the clip loops seamlessly back into Shot 1.

## Negative prompt
text, letters, captions, logos, watermark, readable UI, cartoon, anime, oversaturated, magenta or purple neon, fast cuts, shaky cam, handheld, lens dirt, people looking at camera, stock-footage look, cheap 3D, plastic materials, flat lighting, clutter in the center of frame

## Partición si Higgsfield limita la duración por clip
- Clip A (0–12 s): planos 1, 2 y 3. Termina en el primer plano del calendario lleno.
- Clip B (12–25 s): planos 4, 5 y 6. Usa el último frame del clip A como imagen inicial (first frame) y `orb.png` como referencia del plano 6.
- Misma seed, mismo prompt de estilo (primer párrafo) en los dos clips. Unir con un fundido de 6 frames.

## Locución opcional (solo para redes; el hero va sin sonido)
"Cada llamada que no coges es un cliente que se va.
Nosotros diseñamos el sistema que responde, reserva y hace el seguimiento por ti.
Veinticuatro horas. Con tu marca. Sin que tengas que estar.
Asenix. Tu negocio, rediseñado para lo que viene."

## Referencias (buscar en YouTube)
- "Apple Intelligence film" y "Introducing Apple Vision Pro": la luz como producto, cristal, cámara lenta y segura.
- "iPhone Pro titanium film": macros de material y tempo pausado (planos 1 y 3).
- "Stripe Sessions opening film": sistemas abstractos, líneas que conectan piezas (plano 5).
- "Linear brand film": oscuridad, contención, precisión (el tono general).
- "Mercury bank brand film": el dueño de negocio tranquilo, humano sin ser stock (plano 4).
- "Nothing Phone launch film": macros oscuras con luz de acento (planos 1 y 6).

## Exportación e integración
- H.264, 1920×1080, 24 fps, sin pista de audio, bitrate ~2–3 Mbps (objetivo < 4 MB).
- Sustituir `public/hero.mp4` y regenerar `public/hero-poster.jpg` con el frame 0 del nuevo clip.
- Comprobar en el home que el centro sigue legible detrás del titular y que el bucle no salta.
