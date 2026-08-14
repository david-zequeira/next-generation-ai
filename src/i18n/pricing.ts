/**
 * Textos de la página de precios (/precios), ES + EN.
 *
 * La tarifa es el espejo de `enterprise-ai/04-productos/tarifa.md` y del catálogo
 * ejecutable de ng-agent (`src/plans.ts`): si cambia un precio hay que tocar los
 * tres sitios, a propósito — un precio público no debería moverse por accidente.
 *
 * Los textos admiten `**negrita**`, que el componente convierte en <strong>.
 */

export type PricingPlan = {
  name: string;
  glyph: string;
  who: string;
  setup: string;
  setupPrefix?: string;
  setupNote: string;
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
  diag: { badge: string; body: string };
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
    titleA: "Elige hasta dónde",
    titleB: "quieres evolucionar",
    lede: "Marca, web premium y agentes de IA que atienden, reservan y no se van a dormir. Un solo sistema, cuatro niveles de profundidad.",
  },
  kit: {
    badge: "0 € de entrada",
    body: "Todos los planes se pueden contratar **sin desembolso inicial**: la puesta en marcha se reparte en la cuota durante 18 meses y a partir del mes 19 **la cuota baja sola**. Cuesta lo mismo que pagarlo de golpe — solo que no lo pagas de golpe.",
  },
  plans: [
    {
      name: "Signal",
      glyph: "◇",
      who: "Para existir bien y no perder a nadie que llegue a tu web.",
      setup: "2.900 €",
      setupNote: "puesta en marcha",
      mrr: "+ 149 €/mes",
      mrrNote: "· servicio gestionado",
      kitline: "o **0 € de entrada** · 309 €/mes durante 18 meses",
      features: [
        { text: "**Identidad de marca esencial** — logo, paleta, tipografías y mini-manual" },
        { text: "**Web premium cinematográfica** hasta 6 secciones, bilingüe" },
        { text: "Dominio, hosting, SSL y textos legales RGPD incluidos" },
        { text: "**Chatbot de IA** que responde con la información real de tu negocio" },
        { text: "**Captura de leads**: nadie se va sin dejar rastro" },
        { text: "Panel con conversaciones, leads y visitas" },
        { text: "Avisos al instante por Telegram o email" },
      ],
      quota: ["500 conversaciones/mes", "Web bilingüe ES/EN", "Agente en 1 idioma", "1 sede"],
      cta: "Empezar por aquí",
    },
    {
      name: "Core",
      glyph: "◆",
      star: true,
      tag: "El más contratado",
      who: "Para que el negocio atienda y llene la agenda solo, 24/7.",
      setup: "5.900 €",
      setupNote: "puesta en marcha",
      mrr: "+ 349 €/mes",
      mrrNote: "· servicio gestionado",
      kitline: "o **0 € de entrada** · 679 €/mes durante 18 meses",
      features: [
        { text: "Todo lo de **Signal**, con la web ampliada", inherited: true },
        { text: "**Agente que reserva**: consulta huecos reales y cierra la cita con confirmación" },
        { text: "**Se integra con tu sistema de reservas actual** o con tu Google Calendar" },
        { text: "**WhatsApp Business oficial**: el mismo cerebro en tu número" },
        { text: "**Recordatorios 24 h y 2 h antes** con cancelación en un clic — el hueco se revende" },
        { text: "**CRM completo**: KPIs, embudo, fichas de cliente, historial y notas" },
        { text: "Informe semanal automático y escalado a humano con tus reglas" },
      ],
      quota: ["1.000 conversaciones/mes", "Web + WhatsApp", "Agente en 2 idiomas", "1 sede", "2 h/mes de cambios"],
      cta: "Quiero este",
    },
    {
      name: "Orbit",
      glyph: "◈",
      who: "Para volumen, varias sedes y un teléfono que no para de sonar.",
      setup: "11.900 €",
      setupNote: "puesta en marcha",
      mrr: "+ 890 €/mes",
      mrrNote: "· servicio gestionado",
      kitline: "o **0 € de entrada** · 1.549 €/mes durante 18 meses",
      features: [
        { text: "Todo lo de **Core**, sin límite de secciones en la web", inherited: true },
        { text: "**Identidad de marca completa** con manual íntegro incluido" },
        { text: "**Agente de voz 24/7**: coge el teléfono, responde y reserva hablando — 500 min/mes" },
        { text: "**Multi-sede** hasta 5 centros con agenda y equipo propios" },
        { text: "**Integraciones a medida**: POS, ERP, HubSpot, Salesforce, Zoho, facturación" },
        { text: "**Campañas de reactivación** de clientes inactivos" },
        { text: "**AI Insights**: recomendaciones automáticas sobre tu propio embudo" },
        { text: "SLA 4 h laborables · revisión estratégica trimestral" },
      ],
      quota: ["2.500 conversaciones/mes", "500 min de voz", "Canales e idiomas ilimitados", "Hasta 5 sedes", "4 h/mes de cambios"],
      cta: "Hablar de Orbit",
    },
    {
      name: "Nexus",
      glyph: "⬢",
      who: "Para que la operación entera corra sobre agentes supervisados por ti.",
      setupPrefix: "desde",
      setup: "18.000 €",
      setupNote: "puesta en marcha",
      mrr: "+ desde 1.900 €/mes",
      mrrNote: "· servicio gestionado",
      kitline: "Condiciones de pago a medida",
      features: [
        { text: "Todo lo de **Orbit**, con identidad completa y sedes ilimitadas", inherited: true },
        { text: "**Agentes a medida**: cualificación de leads, back-office, fidelización, contenido, postventa" },
        { text: "Arquitectura, despliegue y gobierno del sistema" },
        { text: "Entorno de pruebas propio antes de tocar producción" },
        { text: "Gestor de cuenta asignado · 8 h/mes · SLA 2 h" },
        { text: "Formación al equipo y documentación de operación" },
      ],
      quota: ["desde 4.000 conversaciones/mes", "desde 1.000 min de voz", "Multi-marca", "Multi-país"],
      cta: "Diseñar el sistema",
    },
  ],
  diag: {
    badge: "Antes de decidir",
    body: "**Diagnóstico de IA — 490 €.** Dos semanas. Mapeamos tus procesos, medimos por dónde se te escapan clientes (llamadas sin contestar, mensajes fuera de horario, huecos sin revender) y te entregamos las oportunidades ordenadas por retorno, con cifras de tu negocio. **Se te descuenta entero** si contratas cualquier plan en 60 días.",
  },
  compare: {
    eyebrow: "Comparativa",
    title: "Qué incluye cada nivel",
    sub: "Cada peldaño añade una capacidad que el anterior no tiene. No es más de lo mismo: es algo nuevo que tu negocio pasa a saber hacer.",
    cols: ["Signal", "Core", "Orbit", "Nexus"],
    rows: [
      { label: "Puesta en marcha", cells: ["2.900 €", "5.900 €", "11.900 €", "desde 18.000 €"], strong: true },
      { label: "…o sin entrada, 18 meses", cells: ["309 €/mes", "679 €/mes", "1.549 €/mes", "a medida"], accent: true },
      { label: "Cuota mensual", cells: ["149 €", "349 €", "890 €", "desde 1.900 €"], strong: true },
      { label: "Identidad de marca", cells: ["Esencial", "Esencial", "Completa", "Completa"] },
      { label: "Web premium", cells: ["6 secciones", "12 secciones", "Sin límite", "Sin límite"] },
      { label: "Chatbot de IA en la web", cells: ["✓", "✓", "✓", "✓"] },
      { label: "Captura de leads", cells: ["✓", "✓", "✓", "✓"] },
      { label: "Reservas automáticas", cells: ["—", "✓", "✓", "✓"] },
      { label: "Integración con tu sistema de reservas", cells: ["—", "✓", "✓", "✓"] },
      { label: "WhatsApp Business oficial", cells: ["—", "✓", "✓", "✓"] },
      { label: "Recordatorios y cancelación", cells: ["—", "✓", "✓", "✓"] },
      { label: "CRM / panel ejecutivo", cells: ["Básico", "Completo", "Completo + Insights", "A medida"] },
      { label: "Agente de voz", cells: ["—", "add-on", "500 min/mes", "desde 1.000 min/mes"] },
      { label: "Multi-sede", cells: ["1 sede", "1 sede + add-on", "Hasta 5", "Ilimitadas"] },
      { label: "Integraciones a medida", cells: ["—", "add-on", "✓", "✓"] },
      { label: "Campañas de reactivación", cells: ["—", "add-on", "✓", "✓"] },
      { label: "Idiomas del agente", cells: ["1", "2", "Ilimitados", "Ilimitados"] },
      { label: "AI Insights", cells: ["—", "add-on", "✓", "✓"] },
      { label: "Conversaciones incluidas", cells: ["500", "1.000", "2.500", "desde 4.000"] },
      { label: "Horas de cambios al mes", cells: ["—", "2 h", "4 h", "8 h"] },
      { label: "SLA de respuesta", cells: ["48 h", "24 h lab.", "4 h lab.", "2 h"] },
      { label: "Plazo de entrega", cells: ["3–4 sem.", "4–6 sem.", "8–10 sem.", "A definir"] },
    ],
  },
  addons: {
    eyebrow: "Módulos",
    titleA: "Añade lo que necesites,",
    titleB: "cuando lo necesites",
    sub: "Cada módulo se enchufa sobre lo que ya tienes funcionando. Sin rehacer nada y sin parar el servicio.",
    items: [
      { name: "Agente de voz", desc: "Coge el teléfono 24/7, responde con la información de tu negocio y cierra la cita hablando. Incluye 500 minutos al mes.", price: "2.900 €", tail: "+ 290 €/mes" },
      { name: "Minutos de voz extra", desc: "Bloque de 250 minutos adicionales, o consumo suelto por encima de tu cuota.", price: "99 €/mes", tail: "· o 0,45 €/min" },
      { name: "Conversaciones extra", desc: "Bloque de 500 conversaciones más al mes. Pasarte de la cuota nunca corta tu servicio.", tail: "99 €/mes" },
      { name: "Sede adicional", desc: "Otro centro con su propia agenda, horario, equipo y métricas separadas.", price: "490 €", tail: "+ 49 €/mes" },
      { name: "Idioma adicional", desc: "El agente atiende y reserva en otro idioma, con su propio tono de marca.", price: "390 €", tail: "+ 29 €/mes" },
      { name: "Integración a medida", desc: "Tu POS, tu ERP, tu CRM actual o tu software de facturación, conectados al sistema.", price: "desde 890 €", tail: "+ 49 €/mes" },
      { name: "Campañas de reactivación", desc: "El sistema detecta clientes que no vuelven y les escribe solo, con tu voz y tu oferta.", price: "690 €", tail: "+ 190 €/mes" },
      { name: "AI Insights", desc: "Recomendaciones automáticas sobre tu embudo: qué falla, qué hora rinde, qué servicio tira.", tail: "99 €/mes" },
      { name: "Conversaciones extra", note: "· solo web", desc: "Bloque de 1.000 conversaciones más al mes para planes sin WhatsApp.", tail: "59 €/mes" },
      { name: "Manual de identidad completo", desc: "Marca al detalle: aplicaciones, papelería, señalética y normas de uso. Incluido en Orbit y Nexus.", tail: "1.490 €" },
      { name: "Contenido y formación", desc: "Fotografía y vídeo de marca, y formación a tu equipo para sacarle todo al sistema.", price: "desde 690 €", tail: "· formación 490 €" },
    ],
  },
  pay: {
    eyebrow: "Formas de pago",
    titleA: "El desembolso inicial no debería ser",
    titleB: "el motivo de no hacerlo",
    sub: "Cuatro maneras de entrar, sin subvenciones de por medio. Ejemplo sobre el plan Core.",
    items: [
      { k: "Recomendado", title: "0 € de entrada", body: "Sin desembolso inicial. La puesta en marcha se reparte en la cuota durante 18 meses y a partir del mes 19 baja sola a la cuota del plan.", foot: "679 €/mes → 349 €/mes" },
      { k: "Contado", title: "−5 %", body: "Pago único de la puesta en marcha con un 5 % de descuento, más la cuota mensual desde el primer mes.", foot: "5.605 € + 349 €/mes" },
      { k: "Fraccionado", title: "3 plazos", body: "40 % al firmar, 30 % a la entrega de la web y 30 % al arrancar el agente. Sin recargo ni intereses.", foot: "2.360 / 1.770 / 1.770 €" },
      { k: "Lo mismo, no más caro", title: "±0,4 %", body: "Las dos vías cuestan prácticamente igual: 12.222 € en 18 meses sin entrada, frente a 12.182 € pagándolo al contado. Cambia cuándo pagas, no cuánto.", foot: "Sin recargo por financiar" },
    ],
  },
  faq: {
    eyebrow: "Dudas razonables",
    titleA: "Lo que nos preguntan",
    titleB: "antes de firmar",
    items: [
      { q: "¿Qué estoy pagando exactamente en la cuota mensual?", a: "No es «mantenimiento». Es un servicio gestionado: las conversaciones incluidas, el ajuste continuo del agente con lo que se ve en las conversaciones reales, tu panel de métricas, la infraestructura y la seguridad, los informes y el soporte con SLA. Un asistente humano atendiendo 1.000 conversaciones al mes son unos 1.400 € de nómina; la cuota de Core es una cuarta parte de eso." },
      { q: "Ya tengo web. ¿Puedo contratar solo el agente?", a: "Sí. El agente se conecta a la web que ya tienes y te descontamos la parte de diseño y desarrollo. Core sin web queda en 3.900 € + 349 €/mes." },
      { q: "Empiezo por Signal. ¿Qué pasa si luego quiero reservas?", a: "Subes a Core y **te descontamos íntegros los 2.900 € que ya pagaste**, siempre que el cambio sea dentro de tus primeros 12 meses. Pagas la diferencia y el ajuste de cuota. La marca y la web que ya tienes no se rehacen: se amplían." },
      { q: "¿Y si la IA se equivoca o se inventa algo?", a: "El agente solo responde con la información que tú apruebas: tus servicios, tus precios, tus horarios, tus FAQs. Lo que no sabe, no se lo inventa — te lo pasa a ti con el contexto de la conversación. Las dos primeras semanas lo supervisamos juntos y lo ajustamos." },
      { q: "¿Qué pasa si me paso de las conversaciones incluidas?", a: "No se corta nada. Te avisamos al 80 % y al 100 % del consumo, sigues atendiendo con normalidad y hablamos de ampliar el bloque. Apagarte el WhatsApp porque has tenido un mes bueno sería lo contrario de lo que te hemos vendido." },
      { q: "¿Hay permanencia? ¿Puedo irme?", a: "Si pagas la puesta en marcha por adelantado, lo construido es tuyo y la cuota tiene 12 meses el primer año; después, mensual y sin ataduras. Si entras con 0 € de entrada, la permanencia es de 18 meses — que es el tiempo en el que se termina de pagar el trabajo. En los dos casos, cuando te vas te descargas todos tus datos —conversaciones, reservas, clientes, leads— en un clic. Sin rehenes." },
      { q: "¿Trabajáis con el Kit Digital?", a: "Hoy no somos agente digitalizador, así que no tramitamos el bono. Si tienes uno concedido y quieres usarlo, te ponemos en contacto con un agente adherido y desarrollamos el proyecto con él. Y si prefieres no depender de una subvención, con 0 € de entrada empezamos esta semana." },
      { q: "¿Cuánto tarda en estar funcionando?", a: "Signal en 3–4 semanas, Core en 4–6 y Orbit en 8–10. Necesitamos unas 2–3 horas de tu tiempo en total, repartidas en dos sesiones: una para la marca y otra para cargar la información de tu negocio." },
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
    titleA: "Choose how far",
    titleB: "you want to evolve",
    lede: "Brand, premium website and AI agents that answer, book and never sleep. One system, four levels of depth.",
  },
  kit: {
    badge: "€0 upfront",
    body: "Every plan can start with **no upfront payment**: the setup is spread across the monthly fee over 18 months, and from month 19 **the fee drops on its own**. It costs the same as paying it all at once — you just don't pay it all at once.",
  },
  plans: [
    {
      name: "Signal",
      glyph: "◇",
      who: "To exist properly online and lose no one who reaches your site.",
      setup: "€2,900",
      setupNote: "setup",
      mrr: "+ €149/mo",
      mrrNote: "· managed service",
      kitline: "or **€0 upfront** · €309/mo for 18 months",
      features: [
        { text: "**Essential brand identity** — logo, palette, typography and mini-guidelines" },
        { text: "**Cinematic premium website**, up to 6 sections, bilingual" },
        { text: "Domain, hosting, SSL and GDPR legal pages included" },
        { text: "**AI chatbot** that answers with your business's real information" },
        { text: "**Lead capture**: no one leaves without a trace" },
        { text: "Dashboard with conversations, leads and visits" },
        { text: "Instant alerts via Telegram or email" },
      ],
      quota: ["500 conversations/mo", "Bilingual website EN/ES", "Agent in 1 language", "1 location"],
      cta: "Start here",
    },
    {
      name: "Core",
      glyph: "◆",
      star: true,
      tag: "Most popular",
      who: "So the business answers and fills its own calendar, 24/7.",
      setup: "€5,900",
      setupNote: "setup",
      mrr: "+ €349/mo",
      mrrNote: "· managed service",
      kitline: "or **€0 upfront** · €679/mo for 18 months",
      features: [
        { text: "Everything in **Signal**, with an expanded website", inherited: true },
        { text: "**An agent that books**: checks real availability and closes the appointment with confirmation" },
        { text: "**Integrates with your current booking system** or your Google Calendar" },
        { text: "**Official WhatsApp Business**: the same brain on your number" },
        { text: "**Reminders 24 h and 2 h before**, with one-click cancellation — the slot gets resold" },
        { text: "**Full CRM**: KPIs, funnel, client records, history and notes" },
        { text: "Automatic weekly report and human hand-off under your rules" },
      ],
      quota: ["1,000 conversations/mo", "Web + WhatsApp", "Agent in 2 languages", "1 location", "2 h/mo of changes"],
      cta: "I want this one",
    },
    {
      name: "Orbit",
      glyph: "◈",
      who: "For volume, several locations and a phone that won't stop ringing.",
      setup: "€11,900",
      setupNote: "setup",
      mrr: "+ €890/mo",
      mrrNote: "· managed service",
      kitline: "or **€0 upfront** · €1,549/mo for 18 months",
      features: [
        { text: "Everything in **Core**, with no section limit on the website", inherited: true },
        { text: "**Full brand identity** with complete guidelines included" },
        { text: "**24/7 voice agent**: picks up the phone, answers and books by talking — 500 min/mo" },
        { text: "**Multi-location**, up to 5 sites with their own calendar and team" },
        { text: "**Custom integrations**: POS, ERP, HubSpot, Salesforce, Zoho, invoicing" },
        { text: "**Win-back campaigns** for inactive clients" },
        { text: "**AI Insights**: automatic recommendations on your own funnel" },
        { text: "4-hour business SLA · quarterly strategy review" },
      ],
      quota: ["2,500 conversations/mo", "500 voice minutes", "Unlimited channels & languages", "Up to 5 locations", "4 h/mo of changes"],
      cta: "Talk about Orbit",
    },
    {
      name: "Nexus",
      glyph: "⬢",
      who: "So the whole operation runs on agents supervised by you.",
      setupPrefix: "from",
      setup: "€18,000",
      setupNote: "setup",
      mrr: "+ from €1,900/mo",
      mrrNote: "· managed service",
      kitline: "Custom payment terms",
      features: [
        { text: "Everything in **Orbit**, with full identity and unlimited locations", inherited: true },
        { text: "**Custom agents**: lead qualification, back-office, loyalty, content, after-sales" },
        { text: "Architecture, deployment and system governance" },
        { text: "A dedicated staging environment before touching production" },
        { text: "Assigned account manager · 8 h/mo · 2-hour SLA" },
        { text: "Team training and operations documentation" },
      ],
      quota: ["from 4,000 conversations/mo", "from 1,000 voice minutes", "Multi-brand", "Multi-country"],
      cta: "Design the system",
    },
  ],
  diag: {
    badge: "Before deciding",
    body: "**AI Diagnostic — €490.** Two weeks. We map your processes, measure where clients slip away (unanswered calls, after-hours messages, unsold slots) and hand you the opportunities ranked by return, with your business's own numbers. **Fully deducted** if you sign any plan within 60 days.",
  },
  compare: {
    eyebrow: "Comparison",
    title: "What each level includes",
    sub: "Each step adds a capability the previous one doesn't have. It's not more of the same: it's something new your business learns to do.",
    cols: ["Signal", "Core", "Orbit", "Nexus"],
    rows: [
      { label: "Setup", cells: ["€2,900", "€5,900", "€11,900", "from €18,000"], strong: true },
      { label: "…or €0 upfront, 18 months", cells: ["€309/mo", "€679/mo", "€1,549/mo", "custom"], accent: true },
      { label: "Monthly fee", cells: ["€149", "€349", "€890", "from €1,900"], strong: true },
      { label: "Brand identity", cells: ["Essential", "Essential", "Full", "Full"] },
      { label: "Premium website", cells: ["6 sections", "12 sections", "Unlimited", "Unlimited"] },
      { label: "AI chatbot on the website", cells: ["✓", "✓", "✓", "✓"] },
      { label: "Lead capture", cells: ["✓", "✓", "✓", "✓"] },
      { label: "Automatic bookings", cells: ["—", "✓", "✓", "✓"] },
      { label: "Integration with your booking system", cells: ["—", "✓", "✓", "✓"] },
      { label: "Official WhatsApp Business", cells: ["—", "✓", "✓", "✓"] },
      { label: "Reminders & cancellation", cells: ["—", "✓", "✓", "✓"] },
      { label: "CRM / executive dashboard", cells: ["Basic", "Full", "Full + Insights", "Custom"] },
      { label: "Voice agent", cells: ["—", "add-on", "500 min/mo", "from 1,000 min/mo"] },
      { label: "Multi-location", cells: ["1 location", "1 + add-on", "Up to 5", "Unlimited"] },
      { label: "Custom integrations", cells: ["—", "add-on", "✓", "✓"] },
      { label: "Win-back campaigns", cells: ["—", "add-on", "✓", "✓"] },
      { label: "Agent languages", cells: ["1", "2", "Unlimited", "Unlimited"] },
      { label: "AI Insights", cells: ["—", "add-on", "✓", "✓"] },
      { label: "Conversations included", cells: ["500", "1,000", "2,500", "from 4,000"] },
      { label: "Hours of changes per month", cells: ["—", "2 h", "4 h", "8 h"] },
      { label: "Response SLA", cells: ["48 h", "24 h business", "4 h business", "2 h"] },
      { label: "Delivery time", cells: ["3–4 wks", "4–6 wks", "8–10 wks", "To be defined"] },
    ],
  },
  addons: {
    eyebrow: "Modules",
    titleA: "Add what you need,",
    titleB: "when you need it",
    sub: "Each module plugs into what you already have running. Nothing gets rebuilt and the service never stops.",
    items: [
      { name: "Voice agent", desc: "Picks up the phone 24/7, answers with your business's information and closes the booking by talking. Includes 500 minutes a month.", price: "€2,900", tail: "+ €290/mo" },
      { name: "Extra voice minutes", desc: "A block of 250 additional minutes, or pay-as-you-go above your quota.", price: "€99/mo", tail: "· or €0.45/min" },
      { name: "Extra conversations", desc: "A block of 500 more conversations per month. Going over quota never cuts your service.", tail: "€99/mo" },
      { name: "Additional location", desc: "Another site with its own calendar, hours, team and separate metrics.", price: "€490", tail: "+ €49/mo" },
      { name: "Additional language", desc: "The agent answers and books in another language, with its own brand tone.", price: "€390", tail: "+ €29/mo" },
      { name: "Custom integration", desc: "Your POS, your ERP, your current CRM or your invoicing software, connected to the system.", price: "from €890", tail: "+ €49/mo" },
      { name: "Win-back campaigns", desc: "The system spots clients who stopped coming and writes to them on its own, with your voice and your offer.", price: "€690", tail: "+ €190/mo" },
      { name: "AI Insights", desc: "Automatic recommendations on your funnel: what's failing, which hour performs, which service sells.", tail: "€99/mo" },
      { name: "Extra conversations", note: "· web only", desc: "A block of 1,000 more conversations per month for plans without WhatsApp.", tail: "€59/mo" },
      { name: "Full brand guidelines", desc: "Your brand in detail: applications, stationery, signage and usage rules. Included in Orbit and Nexus.", tail: "€1,490" },
      { name: "Content & training", desc: "Brand photography and video, plus training so your team gets everything out of the system.", price: "from €690", tail: "· training €490" },
    ],
  },
  pay: {
    eyebrow: "Ways to pay",
    titleA: "The upfront cost shouldn't be",
    titleB: "the reason not to do it",
    sub: "Four ways in, no subsidies involved. Example based on the Core plan.",
    items: [
      { k: "Recommended", title: "€0 upfront", body: "No initial payment. The setup is spread across the monthly fee over 18 months, and from month 19 it drops on its own to the plan's fee.", foot: "€679/mo → €349/mo" },
      { k: "Pay in full", title: "−5%", body: "One-off payment of the setup with a 5% discount, plus the monthly fee from month one.", foot: "€5,605 + €349/mo" },
      { k: "Instalments", title: "3 payments", body: "40% on signing, 30% on website delivery and 30% when the agent goes live. No surcharge, no interest.", foot: "€2,360 / €1,770 / €1,770" },
      { k: "Same price, not more", title: "±0.4%", body: "Both routes cost practically the same: €12,222 over 18 months with nothing upfront, versus €12,182 paying in full. What changes is when you pay, not how much.", foot: "No financing surcharge" },
    ],
  },
  faq: {
    eyebrow: "Fair questions",
    titleA: "What we get asked",
    titleB: "before signing",
    items: [
      { q: "What exactly am I paying for in the monthly fee?", a: "It's not \"maintenance\". It's a managed service: the conversations included, continuous tuning of the agent based on what real conversations show, your metrics dashboard, infrastructure and security, the reports and SLA-backed support. A human assistant handling 1,000 conversations a month is about €1,400 in payroll; Core's fee is a quarter of that." },
      { q: "I already have a website. Can I get just the agent?", a: "Yes. The agent connects to the website you already have and we deduct the design and development part. Core without the website is €3,900 + €349/mo." },
      { q: "I start with Signal. What if I want bookings later?", a: "You upgrade to Core and **we deduct the full €2,900 you already paid**, as long as the change happens within your first 12 months. You pay the difference and the fee adjustment. Your existing brand and website aren't rebuilt: they're extended." },
      { q: "What if the AI gets something wrong or makes things up?", a: "The agent only answers with information you approve: your services, your prices, your hours, your FAQs. What it doesn't know, it doesn't invent — it hands it to you with the context of the conversation. For the first two weeks we supervise it together and tune it." },
      { q: "What happens if I go over the included conversations?", a: "Nothing gets cut. We alert you at 80% and 100% of usage, you keep serving clients as normal and we talk about expanding the block. Switching off your WhatsApp because you had a good month would be the opposite of what we sold you." },
      { q: "Is there a lock-in? Can I leave?", a: "If you pay the setup upfront, what we build is yours and the fee has a 12-month term the first year; after that, monthly and no strings. If you start with €0 upfront, the commitment is 18 months — the time it takes to finish paying for the work. Either way, when you leave you download all your data — conversations, bookings, clients, leads — in one click. No hostages." },
      { q: "Do you work with Spain's Kit Digital?", a: "We're not a registered digitalisation agent today, so we don't process the grant. If you have one approved and want to use it, we'll connect you with a registered agent and build the project with them. And if you'd rather not depend on a subsidy, with €0 upfront we can start this week." },
      { q: "How long until it's up and running?", a: "Signal in 3–4 weeks, Core in 4–6 and Orbit in 8–10. We need about 2–3 hours of your time in total, split into two sessions: one for the brand and one to load your business's information." },
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
