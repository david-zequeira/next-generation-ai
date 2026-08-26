/**
 * Textos de la página de precios (/precios), ES + EN.
 *
 * La tarifa es el espejo de `enterprise-ai/04-productos/tarifa.md` y del catálogo
 * ejecutable de ng-agent (`src/plans.ts`): si cambia un precio hay que tocar los
 * tres sitios, a propósito — un precio público no debería moverse por accidente.
 *
 * Los textos admiten `**negrita**`, que el componente convierte en <strong>.
 *
 * ---
 *
 * **Regla que ordena esta página (23/08/2026).** Aquí solo se publica lo que el
 * sistema entrega hoy. Lo que se quitó en la limpieza y por qué:
 *
 * - **Agente de voz** (Orbit y add-on): construido, pero falta la telefonía +34 y
 *   los DPA de Retell/Twilio sin firmar. Además `ng-agent/src/tenants.ts` impide
 *   contratar bloques de voz en un plan sin voz, así que el add-on sobre Core no
 *   era ni aprovisionable. Vive ahora en `voice`, como lista de espera.
 * - **Plan Orbit**: su diferencial era la voz. Sin voz no es un peldaño, es un
 *   Core más caro. Vuelve cuando la voz se pueda entregar.
 * - **"Se integra con tu sistema de reservas actual"**: solo existe Google
 *   Calendar. Ni Booksy, ni Fresha, ni Doctoralia, ni CoverManager.
 * - **Campañas de reactivación**: el panel guarda fichas de campaña, pero no hay
 *   motor de envío saliente. Nadie escribe solo a nadie.
 * - **Integraciones POS/ERP/CRM con precio**: cero líneas de código. Pasa a
 *   presupuestarse tras el Diagnóstico, que es lo que realmente es.
 * - **Plan Signal**: sin WhatsApp ni reservas no produce el resultado que vende
 *   Asenix, y sus límites ni siquiera existían en el código. Su hueco lo ocupa el
 *   **Arranque**, que sí reserva.
 * - **"El más contratado"**: con 0 clientes era prueba social inventada. La
 *   etiqueta de ahora es un hecho comprobable: **funcionando en 7 días**.
 * - **AI Insights** dejó de ser add-on de 99 €/mes: `panel.ts` lo sirve a
 *   cualquier cliente con panel, así que se cobra a nadie y se incluye en todos.
 *
 * Antes de volver a añadir cualquiera de estas líneas, compruébalo contra el
 * código. El playbook lo detalla en `enterprise-ai/02-ventas/asenix-sales-gtm-playbook.md` §2.4.
 *
 * ---
 *
 * **Cambio del 26/08/2026 — el Diagnóstico pasa de 490 € a 0 €.** Con cero
 * clientes, cobrar 490 € por el diagnóstico filtraba justo a la gente que hace
 * falta ahora: negocios dispuestos a enseñarnos sus números. La prioridad no es
 * facturar el diagnóstico, es tener casos reales. Se regala igual que la llamada.
 *
 * Dos cosas que NO cambian con esto, y que sostienen el precio de los planes:
 *
 * - El trabajo es el mismo. Dos semanas, mismo entregable. Gratis no es "más
 *   corto" ni "por encima": eso sería devaluar el producto de verdad.
 * - Ya no hay descuento que aplicar. Antes los 490 € se descontaban del plan;
 *   ahora no hay nada que descontar, así que esa frase desaparece en vez de
 *   quedarse como reclamo vacío.
 *
 * Cuando haya cartera, esto vuelve a tener precio. Al subirlo, revisar también
 * `diag` en `src/i18n/calculadora.ts`, que cuenta lo mismo.
 *
 * **El texto público NO cuenta este motivo.** "Somos nuevos y necesitamos casos"
 * es la razón interna y es cierta, pero dicha en la web solo consigue que el
 * lector rebaje lo que cree que vale el diagnóstico — y de paso, el resto. Fuera
 * se dice qué se lleva y que corre de nuestra cuenta. Por qué, es cosa nuestra.
 */

export type PricingPlan = {
  name: string;
  glyph: string;
  who: string;
  /** Puesta en marcha. Se pinta en SEGUNDO plano: es el número que asusta. */
  setup: string;
  setupPrefix?: string;
  setupNote: string;
  /** Cuota mensual. Es el precio PRINCIPAL de la tarjeta: lo que el dueño compara con una nómina. */
  mrr: string;
  mrrNote: string;
  kitline: string;
  features: { text: string; inherited?: boolean }[];
  quota: string[];
  cta: string;
  star?: boolean;
  tag?: string;
};

export type PricingDict = {
  back: string;
  header: { eyebrow: string; titleA: string; titleB: string; lede: string };
  kit: { badge: string; body: string };
  plans: PricingPlan[];
  /** Puente a /calculadora: la cuenta antes que la tarifa, para quien duda. */
  calc: { badge: string; body: string; cta: string };
  diag: { badge: string; body: string };
  /** Agente de voz: construido, aún no entregable. Lista de espera, no venta. */
  voice: { badge: string; body: string };
  compare: {
    eyebrow: string;
    title: string;
    sub: string;
    cols: string[];
    rows: { label: string; cells: string[]; strong?: boolean; accent?: boolean }[];
  };
  addons: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    sub: string;
    items: { name: string; note?: string; desc: string; price?: string; tail?: string }[];
  };
  pay: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    sub: string;
    items: { k: string; title: string; body: string; foot: string }[];
  };
  faq: { eyebrow: string; titleA: string; titleB: string; items: { q: string; a: string }[] };
  final: { eyebrow: string; titleA: string; titleB: string; sub: string; cta: string; mini: string };
};

const es: PricingDict = {
  back: "Volver al inicio",
  header: {
    eyebrow: "Planes · 2026",
    titleA: "Elige por dónde",
    titleB: "quieres empezar",
    lede: "Un asistente que atiende en tu web y en tu WhatsApp, responde con la información real de tu negocio y cierra la cita en tu agenda. Tres niveles, según de dónde partas.",
  },
  kit: {
    badge: "Tres formas de pagarlo",
    body: "La puesta en marcha se puede pagar **al contado con un 5 % de descuento**, **en tres plazos sin recargo**, o no pagarla de entrada: con **0 € de entrada** se reparte en la cuota durante 18 meses y a partir del mes 19 la cuota baja sola. Cuesta lo mismo — solo cambia cuándo lo pagas.",
  },
  plans: [
    {
      name: "Arranque",
      glyph: "◇",
      star: true,
      tag: "Funcionando en 7 días",
      who: "Para que tu web y tu WhatsApp de hoy dejen de perder clientes.",
      setup: "2.900 €",
      setupNote: "de puesta en marcha",
      mrr: "349 €",
      mrrNote: "/mes · servicio gestionado",
      kitline: "En 3 plazos sin recargo · o **0 € de entrada** a 510 €/mes durante 18 meses",
      features: [
        { text: "**El agente se instala en la web que ya tienes** — no hay que rehacer nada" },
        { text: "**WhatsApp Business oficial**: el mismo cerebro, en tu número de siempre" },
        { text: "**Reserva de verdad**: mira los huecos libres de tu Google Calendar y cierra la cita con confirmación" },
        { text: "**Recordatorios 24 h y 2 h antes** con cancelación en un clic — el hueco se revende" },
        { text: "**Captura de leads**: nadie se va sin dejar rastro" },
        { text: "**CRM y panel ejecutivo**: conversaciones, clientes, citas, KPIs e informe semanal" },
        { text: "**AI Insights**: qué falla en tu embudo, qué hora rinde y qué servicio tira" },
        { text: "Avisos al instante por Telegram o email · y lo delicado pasa a una persona con tus reglas" },
      ],
      quota: ["1.000 conversaciones/mes", "Web + WhatsApp", "Agente en 2 idiomas", "1 sede", "2 h/mes de cambios"],
      cta: "Empezar por aquí",
    },
    {
      name: "Core",
      glyph: "◆",
      who: "Para el negocio que además necesita una cara digital a la altura de lo que cobra.",
      setup: "5.900 €",
      setupNote: "de puesta en marcha",
      mrr: "349 €",
      mrrNote: "/mes · servicio gestionado",
      kitline: "En 3 plazos sin recargo · o **0 € de entrada** a 679 €/mes durante 18 meses",
      features: [
        { text: "Todo lo del **Arranque**, con el asistente ya integrado en la web nueva", inherited: true },
        { text: "**Identidad de marca esencial** — logo, paleta, tipografías y mini-manual" },
        { text: "**Web premium cinematográfica** hasta 12 secciones, bilingüe" },
        { text: "Dominio, hosting, SSL y textos legales RGPD incluidos" },
        { text: "Sesión de marca contigo: textos, fotos y estructura, decididos en una tarde" },
        { text: "Misma cuota mensual que el Arranque — lo que cambia es lo que se construye" },
      ],
      quota: ["1.000 conversaciones/mes", "Web bilingüe ES/EN", "Agente en 2 idiomas", "1 sede", "2 h/mes de cambios"],
      cta: "Quiero también la web",
    },
    {
      name: "Nexus",
      glyph: "⬢",
      who: "Para que la operación entera corra sobre agentes supervisados por ti.",
      setupPrefix: "desde",
      setup: "18.000 €",
      setupNote: "de puesta en marcha",
      mrr: "desde 1.900 €",
      mrrNote: "/mes · servicio gestionado",
      kitline: "Condiciones de pago a medida · siempre después del Diagnóstico",
      features: [
        { text: "Todo lo de **Core**, con identidad de marca completa", inherited: true },
        { text: "**Agentes a medida**: cualificación de leads, back-office, fidelización, postventa" },
        { text: "**Varias sedes**, cada una con su agenda, su horario y sus métricas" },
        { text: "**Integraciones con tus sistemas**, evaluadas y presupuestadas en el Diagnóstico" },
        { text: "Arquitectura, despliegue y gobierno del sistema" },
        { text: "Entorno de pruebas propio antes de tocar producción" },
        { text: "Gestor de cuenta asignado · 8 h/mes · SLA 2 h" },
        { text: "Formación al equipo y documentación de operación" },
      ],
      quota: ["desde 4.000 conversaciones/mes", "Multi-marca", "Multi-país", "8 h/mes de cambios"],
      cta: "Diseñar el sistema",
    },
  ],
  calc: {
    badge: "¿Te compensa?",
    body: "Antes de mirar precios, mira la cuenta: **cuatro preguntas sobre tu negocio** y verás cuánto se te escapa hoy por consultas sin responder y plantones, y en cuántos meses se paga solo. Sin registro, y con las hipótesis a la vista para que puedas discutirlas.",
    cta: "Hacer la cuenta",
  },
  diag: {
    badge: "Gratis, antes de decidir",
    body: "**Diagnóstico de IA — 0 €.** Dos semanas. Mapeamos tus procesos, medimos por dónde se te escapan clientes (llamadas sin contestar, mensajes fuera de horario, huecos sin revender) y te entregamos las oportunidades ordenadas por retorno, con las cifras de tu negocio. **Corre de nuestra cuenta**: preferimos enseñarte el número antes de pedirte una decisión. El informe es tuyo, lo contrates o no.",
  },
  voice: {
    badge: "En pruebas",
    body: "**Agente de voz — todavía no está a la venta.** El agente que coge el teléfono, responde y reserva hablando está construido y funcionando en pruebas internas. No lo vendemos hasta cerrar la telefonía española y firmar los acuerdos de tratamiento de datos con los proveedores de voz: prometer una fecha antes de eso sería vender humo. **Cuando esté, los clientes que ya estén con nosotros entran primero** — dilo en la llamada y te apuntamos a la lista.",
  },
  compare: {
    eyebrow: "Comparativa",
    title: "Qué incluye cada nivel",
    sub: "El Arranque y Core montan exactamente el mismo asistente y cuestan lo mismo al mes. La diferencia es si además te construimos la marca y la web.",
    cols: ["Arranque", "Core", "Nexus"],
    rows: [
      { label: "Cuota mensual", cells: ["349 €", "349 €", "desde 1.900 €"], strong: true },
      { label: "Puesta en marcha", cells: ["2.900 €", "5.900 €", "desde 18.000 €"], strong: true },
      { label: "…o sin entrada, 18 meses", cells: ["510 €/mes", "679 €/mes", "a medida"], accent: true },
      { label: "Plazo de entrega", cells: ["7 días", "4–6 semanas", "A definir"], strong: true },
      { label: "Asistente en tu web actual", cells: ["✓", "sobre la nueva", "✓"] },
      { label: "WhatsApp Business oficial", cells: ["✓", "✓", "✓"] },
      { label: "Reservas en tu Google Calendar", cells: ["✓", "✓", "✓"] },
      { label: "Recordatorios y cancelación en un clic", cells: ["✓", "✓", "✓"] },
      { label: "Captura de leads", cells: ["✓", "✓", "✓"] },
      { label: "CRM / panel ejecutivo", cells: ["Completo", "Completo", "A medida"] },
      { label: "AI Insights", cells: ["✓", "✓", "✓"] },
      { label: "Informe semanal automático", cells: ["✓", "✓", "✓"] },
      { label: "Escalado a una persona", cells: ["✓", "✓", "✓"] },
      { label: "Identidad de marca", cells: ["—", "Esencial", "Completa"] },
      { label: "Web premium", cells: ["la tuya", "12 secciones", "Sin límite"] },
      { label: "Idiomas del agente", cells: ["2", "2", "Ilimitados"] },
      { label: "Sedes", cells: ["1", "1 + add-on", "Varias"] },
      { label: "Agentes a medida", cells: ["—", "—", "✓"] },
      { label: "Conversaciones incluidas", cells: ["1.000", "1.000", "desde 4.000"] },
      { label: "Horas de cambios al mes", cells: ["2 h", "2 h", "8 h"] },
      { label: "SLA de respuesta", cells: ["24 h lab.", "24 h lab.", "2 h"] },
    ],
  },
  addons: {
    eyebrow: "Módulos",
    titleA: "Añade lo que necesites,",
    titleB: "cuando lo necesites",
    sub: "Cada módulo se enchufa sobre lo que ya tienes funcionando. Sin rehacer nada y sin parar el servicio.",
    items: [
      { name: "La web, después", desc: "Empezaste por el Arranque y ahora quieres la marca y la web premium. Se añade sin tocar el asistente, y pagas la diferencia exacta con Core.", price: "3.000 €" },
      { name: "Conversaciones extra", desc: "Bloque de 500 conversaciones más al mes. Pasarte de la cuota nunca corta tu servicio: te avisamos y lo hablamos.", tail: "99 €/mes" },
      { name: "Conversaciones extra", note: "· solo web", desc: "Bloque de 1.000 conversaciones más al mes para planes sin WhatsApp, donde cada conversación cuesta bastante menos.", tail: "59 €/mes" },
      { name: "Sede adicional", desc: "Otro centro con su propia agenda, su horario, su equipo y sus métricas separadas.", price: "490 €", tail: "+ 49 €/mes" },
      { name: "Idioma adicional", desc: "El agente atiende y reserva en otro idioma, con su propio tono de marca.", price: "390 €", tail: "+ 29 €/mes" },
      { name: "Integración con tus sistemas", desc: "Tu POS, tu ERP, tu CRM actual o tu software de facturación. Se estudia y se presupuesta en el Diagnóstico: cada sistema es un mundo y no vendemos conectores que no existen.", price: "a presupuestar" },
      { name: "Manual de identidad completo", desc: "Marca al detalle: aplicaciones, papelería, señalética y normas de uso. Incluido en Nexus.", tail: "1.490 €" },
      { name: "Contenido y formación", desc: "Fotografía y vídeo de marca, y formación a tu equipo para sacarle todo al sistema.", price: "desde 690 €", tail: "· formación 490 €" },
    ],
  },
  pay: {
    eyebrow: "Formas de pago",
    titleA: "El desembolso inicial no debería ser",
    titleB: "el motivo de no hacerlo",
    sub: "Cuatro maneras de entrar, sin subvenciones de por medio. Ejemplo sobre el Arranque.",
    items: [
      { k: "Al contado", title: "−5 %", body: "Pago único de la puesta en marcha con un 5 % de descuento, más la cuota mensual desde el primer mes. Lo construido es tuyo desde el día uno.", foot: "2.755 € + 349 €/mes" },
      { k: "Fraccionado", title: "3 plazos", body: "40 % al firmar, 30 % cuando el asistente empieza a responder y 30 % cuando lleva una semana reservando. Sin recargo ni intereses.", foot: "1.160 / 870 / 870 €" },
      { k: "Sin entrada", title: "0 € de entrada", body: "Sin desembolso inicial. La puesta en marcha se reparte en la cuota durante 18 meses y a partir del mes 19 baja sola a la cuota del plan. Lleva permanencia de 18 meses.", foot: "510 €/mes → 349 €/mes" },
      { k: "Lo mismo, no más caro", title: "±0,1 %", body: "Las dos vías cuestan prácticamente igual: 9.180 € en 18 meses sin entrada, frente a 9.182 € pagándolo al contado. Cambia cuándo pagas, no cuánto.", foot: "Sin recargo por financiar" },
    ],
  },
  faq: {
    eyebrow: "Dudas razonables",
    titleA: "Lo que nos preguntan",
    titleB: "antes de firmar",
    items: [
      { q: "¿Qué estoy pagando exactamente en la cuota mensual?", a: "No es «mantenimiento». Es un servicio gestionado: las conversaciones incluidas, el ajuste continuo del agente con lo que se ve en las conversaciones reales, tu panel de métricas, la infraestructura y la seguridad, los informes y el soporte con SLA. Un asistente humano atendiendo 1.000 conversaciones al mes son unos 1.400 € de nómina; la cuota es una cuarta parte de eso." },
      { q: "Ya tengo web. ¿Puedo contratar solo el asistente?", a: "Sí, y es exactamente el **Arranque**: 2.900 € de puesta en marcha y 349 €/mes. El asistente se instala sobre la web que ya tienes y sobre tu WhatsApp, sin rehacer nada. Es lo que contrata la mayoría, y está funcionando en **7 días**." },
      { q: "Empiezo por el Arranque. ¿Y si luego quiero la web?", a: "Se añade cuando quieras por **3.000 €**, que es la diferencia exacta con Core. Lo que ya tienes montado no se rehace: el asistente, tu historial de conversaciones y tus citas siguen igual, y la web se construye alrededor." },
      { q: "¿Y el agente de voz que coge el teléfono?", a: "Está construido y funcionando en pruebas internas, pero **todavía no lo vendemos**: antes hay que cerrar la telefonía española y firmar los acuerdos de tratamiento de datos con los proveedores de voz. Prometer una fecha antes de tener eso resuelto sería vender humo. Cuando esté disponible, los clientes que ya estén con nosotros entran primero." },
      { q: "¿Con qué agenda funciona?", a: "Con **Google Calendar**, que es lo que usa la mayoría de negocios pequeños y lo que hoy podemos garantizar de verdad. Si llevas la agenda en otro programa, lo miramos antes de firmar nada y te decimos si tiene solución — sin vender integraciones que no existan." },
      { q: "¿Y si la IA se equivoca o se inventa algo?", a: "El agente solo responde con la información que tú apruebas: tus servicios, tus precios, tus horarios, tus FAQs. Lo que no sabe, no se lo inventa — te lo pasa a ti con el contexto de la conversación. Las dos primeras semanas lo supervisamos juntos y lo ajustamos." },
      { q: "¿Qué pasa si me paso de las conversaciones incluidas?", a: "No se corta nada. Te avisamos al 80 % y al 100 % del consumo, sigues atendiendo con normalidad y hablamos de ampliar el bloque. Apagarte el WhatsApp porque has tenido un mes bueno sería lo contrario de lo que te hemos vendido." },
      { q: "¿Hay permanencia? ¿Puedo irme?", a: "Si pagas la puesta en marcha por adelantado, lo construido es tuyo y la cuota tiene 12 meses el primer año; después, mensual y sin ataduras. Si entras con 0 € de entrada, la permanencia es de 18 meses — que es el tiempo en el que se termina de pagar el trabajo. En los dos casos, cuando te vas te descargas todos tus datos —conversaciones, reservas, clientes, leads— en un clic. Sin rehenes." },
      { q: "¿Trabajáis con el Kit Digital?", a: "Hoy no somos agente digitalizador, así que no tramitamos el bono. Si tienes uno concedido y quieres usarlo, te ponemos en contacto con un agente adherido y desarrollamos el proyecto con él. Y si prefieres no depender de una subvención, con 0 € de entrada empezamos esta semana." },
      { q: "¿Cuánto tarda en estar funcionando?", a: "El Arranque, **7 días** desde que nos pasas los datos de tu negocio. Core tarda 4–6 semanas porque incluye construir la marca y la web. En los dos casos necesitamos unas 2–3 horas de tu tiempo, repartidas en dos sesiones." },
      { q: "¿Dónde están mis datos?", a: "En servidores de la Unión Europea, con proveedores de IA con garantías de RGPD. La web avisa de que se habla con una IA y de que la conversación se guarda, como exige el artículo 13 del RGPD. Y tus datos son portables: te los llevas cuando quieras." },
      { q: "¿Trabajáis fuera de España?", a: "Sí. Operamos en España, Reino Unido y el resto de Europa. La tarifa se ajusta al mercado local; escríbenos y te pasamos la de tu país." },
    ],
  },
  final: {
    eyebrow: "Siguiente paso",
    titleA: "Veinte minutos y te decimos",
    titleB: "qué plan te sobra",
    sub: "Llamada de estrategia sin compromiso. Salimos con un número: cuántos clientes estás perdiendo hoy y cuánto vale recuperarlos.",
    cta: "Reservar la llamada",
    mini: "Precios en euros, sin IVA. Vigentes desde agosto de 2026.",
  },
};

const en: PricingDict = {
  back: "Back to home",
  header: {
    eyebrow: "Plans · 2026",
    titleA: "Choose where",
    titleB: "you want to start",
    lede: "An assistant that answers on your website and your WhatsApp, replies with your business's real information and books the appointment in your calendar. Three levels, depending on where you're starting from.",
  },
  kit: {
    badge: "Three ways to pay",
    body: "The setup can be paid **in full with a 5% discount**, **in three instalments with no surcharge**, or not upfront at all: with **€0 upfront** it's spread across the monthly fee over 18 months, and from month 19 the fee drops on its own. It costs the same — only when you pay changes.",
  },
  plans: [
    {
      name: "Arranque",
      glyph: "◇",
      star: true,
      tag: "Live in 7 days",
      who: "So the website and WhatsApp you already have stop losing you clients.",
      setup: "€2,900",
      setupNote: "setup",
      mrr: "€349",
      mrrNote: "/mo · managed service",
      kitline: "3 instalments, no surcharge · or **€0 upfront** at €510/mo for 18 months",
      features: [
        { text: "**The assistant installs on the website you already have** — nothing gets rebuilt" },
        { text: "**Official WhatsApp Business**: the same brain, on your usual number" },
        { text: "**It actually books**: checks the free slots in your Google Calendar and closes the appointment with confirmation" },
        { text: "**Reminders 24 h and 2 h before**, with one-click cancellation — the slot gets resold" },
        { text: "**Lead capture**: no one leaves without a trace" },
        { text: "**CRM and executive dashboard**: conversations, clients, bookings, KPIs and a weekly report" },
        { text: "**AI Insights**: what's failing in your funnel, which hour performs, which service sells" },
        { text: "Instant alerts via Telegram or email · and anything delicate goes to a human under your rules" },
      ],
      quota: ["1,000 conversations/mo", "Web + WhatsApp", "Agent in 2 languages", "1 location", "2 h/mo of changes"],
      cta: "Start here",
    },
    {
      name: "Core",
      glyph: "◆",
      who: "For the business that also needs a digital face worthy of what it charges.",
      setup: "€5,900",
      setupNote: "setup",
      mrr: "€349",
      mrrNote: "/mo · managed service",
      kitline: "3 instalments, no surcharge · or **€0 upfront** at €679/mo for 18 months",
      features: [
        { text: "Everything in **Arranque**, with the assistant already built into the new website", inherited: true },
        { text: "**Essential brand identity** — logo, palette, typography and mini-guidelines" },
        { text: "**Cinematic premium website**, up to 12 sections, bilingual" },
        { text: "Domain, hosting, SSL and GDPR legal pages included" },
        { text: "A brand session with you: copy, photos and structure, settled in one afternoon" },
        { text: "Same monthly fee as Arranque — what changes is what gets built" },
      ],
      quota: ["1,000 conversations/mo", "Bilingual website EN/ES", "Agent in 2 languages", "1 location", "2 h/mo of changes"],
      cta: "I want the website too",
    },
    {
      name: "Nexus",
      glyph: "⬢",
      who: "So the whole operation runs on agents supervised by you.",
      setupPrefix: "from",
      setup: "€18,000",
      setupNote: "setup",
      mrr: "from €1,900",
      mrrNote: "/mo · managed service",
      kitline: "Custom payment terms · always after the Diagnostic",
      features: [
        { text: "Everything in **Core**, with full brand identity", inherited: true },
        { text: "**Custom agents**: lead qualification, back-office, loyalty, after-sales" },
        { text: "**Several locations**, each with its own calendar, hours and metrics" },
        { text: "**Integrations with your systems**, assessed and quoted in the Diagnostic" },
        { text: "Architecture, deployment and system governance" },
        { text: "A dedicated staging environment before touching production" },
        { text: "Assigned account manager · 8 h/mo · 2-hour SLA" },
        { text: "Team training and operations documentation" },
      ],
      quota: ["from 4,000 conversations/mo", "Multi-brand", "Multi-country", "8 h/mo of changes"],
      cta: "Design the system",
    },
  ],
  calc: {
    badge: "Is it worth it?",
    body: "Before looking at prices, look at the maths: **four questions about your business** and you'll see how much slips away today through unanswered enquiries and no-shows, and how many months it takes to pay for itself. No sign-up, and every assumption in plain sight so you can argue with it.",
    cta: "Run the numbers",
  },
  diag: {
    badge: "Free, before you decide",
    body: "**AI Diagnostic — €0.** Two weeks. We map your processes, measure where clients slip away (unanswered calls, after-hours messages, unsold slots) and hand you the opportunities ranked by return, using your business's own numbers. **It's on us**: we'd rather show you the number before asking you for a decision. The report is yours, whether you sign up or not.",
  },
  voice: {
    badge: "In testing",
    body: "**Voice agent — not on sale yet.** The agent that picks up the phone, answers and books by talking is built and running in internal testing. We won't sell it until Spanish telephony is in place and the data processing agreements with the voice providers are signed: promising a date before that would be selling smoke. **When it's ready, clients already with us go first** — mention it on the call and we'll add you to the list.",
  },
  compare: {
    eyebrow: "Comparison",
    title: "What each level includes",
    sub: "Arranque and Core run exactly the same assistant and cost the same per month. The difference is whether we also build your brand and website.",
    cols: ["Arranque", "Core", "Nexus"],
    rows: [
      { label: "Monthly fee", cells: ["€349", "€349", "from €1,900"], strong: true },
      { label: "Setup", cells: ["€2,900", "€5,900", "from €18,000"], strong: true },
      { label: "…or €0 upfront, 18 months", cells: ["€510/mo", "€679/mo", "custom"], accent: true },
      { label: "Delivery time", cells: ["7 days", "4–6 wks", "To be defined"], strong: true },
      { label: "Assistant on your current website", cells: ["✓", "on the new one", "✓"] },
      { label: "Official WhatsApp Business", cells: ["✓", "✓", "✓"] },
      { label: "Bookings in your Google Calendar", cells: ["✓", "✓", "✓"] },
      { label: "Reminders & one-click cancellation", cells: ["✓", "✓", "✓"] },
      { label: "Lead capture", cells: ["✓", "✓", "✓"] },
      { label: "CRM / executive dashboard", cells: ["Full", "Full", "Custom"] },
      { label: "AI Insights", cells: ["✓", "✓", "✓"] },
      { label: "Automatic weekly report", cells: ["✓", "✓", "✓"] },
      { label: "Hand-off to a human", cells: ["✓", "✓", "✓"] },
      { label: "Brand identity", cells: ["—", "Essential", "Full"] },
      { label: "Premium website", cells: ["yours", "12 sections", "Unlimited"] },
      { label: "Agent languages", cells: ["2", "2", "Unlimited"] },
      { label: "Locations", cells: ["1", "1 + add-on", "Several"] },
      { label: "Custom agents", cells: ["—", "—", "✓"] },
      { label: "Conversations included", cells: ["1,000", "1,000", "from 4,000"] },
      { label: "Hours of changes per month", cells: ["2 h", "2 h", "8 h"] },
      { label: "Response SLA", cells: ["24 h business", "24 h business", "2 h"] },
    ],
  },
  addons: {
    eyebrow: "Modules",
    titleA: "Add what you need,",
    titleB: "when you need it",
    sub: "Each module plugs into what you already have running. Nothing gets rebuilt and the service never stops.",
    items: [
      { name: "The website, later", desc: "You started with Arranque and now you want the brand and the premium website. It's added without touching the assistant, and you pay the exact difference with Core.", price: "€3,000" },
      { name: "Extra conversations", desc: "A block of 500 more conversations per month. Going over quota never cuts your service: we tell you and we talk about it.", tail: "€99/mo" },
      { name: "Extra conversations", note: "· web only", desc: "A block of 1,000 more conversations per month for plans without WhatsApp, where each conversation costs considerably less.", tail: "€59/mo" },
      { name: "Additional location", desc: "Another site with its own calendar, hours, team and separate metrics.", price: "€490", tail: "+ €49/mo" },
      { name: "Additional language", desc: "The agent answers and books in another language, with its own brand tone.", price: "€390", tail: "+ €29/mo" },
      { name: "Integration with your systems", desc: "Your POS, your ERP, your current CRM or your invoicing software. It gets assessed and quoted in the Diagnostic: every system is its own world and we don't sell connectors that don't exist.", price: "quoted" },
      { name: "Full brand guidelines", desc: "Your brand in detail: applications, stationery, signage and usage rules. Included in Nexus.", tail: "€1,490" },
      { name: "Content & training", desc: "Brand photography and video, plus training so your team gets everything out of the system.", price: "from €690", tail: "· training €490" },
    ],
  },
  pay: {
    eyebrow: "Ways to pay",
    titleA: "The upfront cost shouldn't be",
    titleB: "the reason not to do it",
    sub: "Four ways in, no subsidies involved. Example based on Arranque.",
    items: [
      { k: "In full", title: "−5%", body: "One-off payment of the setup with a 5% discount, plus the monthly fee from month one. What we build is yours from day one.", foot: "€2,755 + €349/mo" },
      { k: "Instalments", title: "3 payments", body: "40% on signing, 30% when the assistant starts answering and 30% once it's been booking for a week. No surcharge, no interest.", foot: "€1,160 / €870 / €870" },
      { k: "Nothing upfront", title: "€0 upfront", body: "No initial payment. The setup is spread across the monthly fee over 18 months and from month 19 it drops on its own to the plan's fee. It carries an 18-month commitment.", foot: "€510/mo → €349/mo" },
      { k: "Same price, not more", title: "±0.1%", body: "Both routes cost practically the same: €9,180 over 18 months with nothing upfront, versus €9,182 paying in full. What changes is when you pay, not how much.", foot: "No financing surcharge" },
    ],
  },
  faq: {
    eyebrow: "Fair questions",
    titleA: "What we get asked",
    titleB: "before signing",
    items: [
      { q: "What exactly am I paying for in the monthly fee?", a: "It's not \"maintenance\". It's a managed service: the conversations included, continuous tuning of the agent based on what real conversations show, your metrics dashboard, infrastructure and security, the reports and SLA-backed support. A human assistant handling 1,000 conversations a month is about €1,400 in payroll; the fee is a quarter of that." },
      { q: "I already have a website. Can I get just the assistant?", a: "Yes, and that's exactly **Arranque**: €2,900 setup and €349/mo. The assistant installs on the website you already have and on your WhatsApp, with nothing rebuilt. It's what most clients take, and it's running in **7 days**." },
      { q: "I start with Arranque. What if I want the website later?", a: "It can be added whenever you like for **€3,000**, the exact difference with Core. What's already running doesn't get rebuilt: the assistant, your conversation history and your bookings stay as they are, and the website gets built around them." },
      { q: "What about the voice agent that answers the phone?", a: "It's built and running in internal testing, but **we're not selling it yet**: first we need Spanish telephony in place and the data processing agreements signed with the voice providers. Promising a date before that is settled would be selling smoke. When it's available, clients already with us go first." },
      { q: "Which calendar does it work with?", a: "**Google Calendar**, which is what most small businesses use and what we can genuinely guarantee today. If you keep your calendar in another system, we look at it before signing anything and tell you whether it has a solution — without selling integrations that don't exist." },
      { q: "What if the AI gets something wrong or makes things up?", a: "The agent only answers with information you approve: your services, your prices, your hours, your FAQs. What it doesn't know, it doesn't invent — it hands it to you with the context of the conversation. For the first two weeks we supervise it together and tune it." },
      { q: "What happens if I go over the included conversations?", a: "Nothing gets cut. We alert you at 80% and 100% of usage, you keep serving clients as normal and we talk about expanding the block. Switching off your WhatsApp because you had a good month would be the opposite of what we sold you." },
      { q: "Is there a lock-in? Can I leave?", a: "If you pay the setup upfront, what we build is yours and the fee has a 12-month term the first year; after that, monthly and no strings. If you start with €0 upfront, the commitment is 18 months — the time it takes to finish paying for the work. Either way, when you leave you download all your data — conversations, bookings, clients, leads — in one click. No hostages." },
      { q: "Do you work with Spain's Kit Digital?", a: "We're not a registered digitalisation agent today, so we don't process the grant. If you have one approved and want to use it, we'll connect you with a registered agent and build the project with them. And if you'd rather not depend on a subsidy, with €0 upfront we can start this week." },
      { q: "How long until it's up and running?", a: "Arranque, **7 days** from the moment you send us your business's details. Core takes 4–6 weeks because it includes building the brand and the website. Either way we need about 2–3 hours of your time, split into two sessions." },
      { q: "Where is my data?", a: "On European Union servers, with AI providers under GDPR guarantees. The website discloses that visitors are talking to an AI and that the conversation is stored, as Article 13 of the GDPR requires. And your data is portable: take it with you whenever you want." },
      { q: "Do you work outside Spain?", a: "Yes. We operate in Spain, the United Kingdom and the rest of Europe. Pricing adjusts to the local market; write to us and we'll send you your country's rates." },
    ],
  },
  final: {
    eyebrow: "Next step",
    titleA: "Twenty minutes and we'll tell you",
    titleB: "which plan you don't need",
    sub: "A no-commitment strategy call. We leave with a number: how many clients you're losing today and what it's worth to win them back.",
    cta: "Book the call",
    mini: "Prices in euros, VAT not included. Valid from August 2026.",
  },
};

export const pricingDicts: Record<"es" | "en", PricingDict> = { es, en };
