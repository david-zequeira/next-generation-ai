export type Locale = "en" | "es";

const en = {
  nav: {
    links: ["Platform", "Services", "Ecosystem", "Proof", "Process"],
    home: "Home",
    calc: "Calculator",
    pricing: "Pricing",
    cta: "Book a call",
    ctaLong: "Book a strategy call",
    ariaOpen: "Open menu",
    ariaClose: "Close menu",
    ariaLang: "Cambiar a español",
  },
  hero: {
    eyebrow: "Asenix",
    titleA: "Your business, redesigned",
    titleB: "for what's next.",
    sub: "We create premium digital experiences and intelligent systems that attract customers, automate operations and drive growth.",
    ctaPrimary: "Get started",
    ctaSecondary: "See the demo",
  },
  evolution: {
    eyebrow: "The future of business",
    // Las tres etapas del Figma (marcos 541:201, 1298:4363 y 1298:5622)
    stages: [
      { label: "We design the experience", sub: "Digital experiences that elevate your brand." },
      { label: "We automate the system", sub: "Turn visitors into customers." },
      { label: "We build the intelligence", sub: "AI agents around the clock." },
    ],
  },
  services: {
    eyebrow: "Services",
    title: "We build digital ecosystems",
    sub: "Every project combines premium design, high-performance development and intelligent strategy to turn visitors into customers and operations into scalable systems.",
    link: "Talk to our AI",
    cta: "Get a quote",
    tabs: [
      {
        label: "Web design",
        title: "Design that makes businesses unforgettable.",
        desc: "Premium websites designed to build trust, make your brand stand out and turn visitors into customers.",
        features: [
          { title: "Beautiful", desc: "Premium design that reflects the true value of your brand." },
          { title: "Fast", desc: "Performance tuned for an instant experience." },
          { title: "Strategic", desc: "Built to lift conversions and generate opportunities." },
          { title: "Scalable", desc: "Ready for SEO, automation and artificial intelligence." },
        ],
        tiles: ["Brand experience", "Luxury design", "High-performance build", "Conversion & growth"],
      },
      {
        label: "Automation",
        title: "Connected. Always running.",
        desc: "CRM, calendar, payments and follow-up in sync, so every booking moves forward without anyone touching it.",
        features: [
          { title: "Automatic bookings", desc: "Appointments confirmed and synced with your calendar." },
          { title: "No repetitive tasks", desc: "Reminders, invoices and follow-ups run on their own." },
          { title: "Continuous follow-up", desc: "Every client gets a reply, even outside opening hours." },
          { title: "Your tools, connected", desc: "Works with the CRM and calendar you already use." },
        ],
        tiles: ["CRM", "Calendar", "Billing", "Follow-up"],
      },
      {
        label: "Technology",
        title: "Software built to grow with you.",
        desc: "AI agents, integrations and custom systems engineered for your business, not adapted from a template.",
        features: [
          { title: "AI agents", desc: "Assistants that answer, qualify and book, in text and voice." },
          { title: "Integrations", desc: "Your POS, ERP or billing tool, wired into one system." },
          { title: "Data", desc: "Clear metrics on what happens in your business every day." },
          { title: "Security", desc: "GDPR-compliant infrastructure with guardrails from day one." },
        ],
        tiles: ["AI agents", "Integrations", "Data & reports", "Security"],
      },
    ],
  },
  howWeWork: {
    eyebrow: "How we work",
    left: "Your business is a system",
    right: "We connect every piece",
    svgAria: "The six steps of our method orbiting the Asenix core",
    steps: [
      { title: "Discover", desc: "We understand your business." },
      { title: "Define", desc: "We identify where your business can improve and grow." },
      { title: "Design", desc: "We design the experience." },
      { title: "Build", desc: "We turn strategy into reality." },
      { title: "Evolve", desc: "We analyse results and keep optimising." },
      { title: "Integrate", desc: "Intelligent systems that work together effortlessly." },
    ],
  },
  aiLayer: {
    eyebrow: "Process",
    titleA: "The artificial intelligence",
    titleB: "behind your business",
    sub: "We design intelligent ecosystems that serve customers, automate operations and accelerate your company's growth.",
    concierge: {
      tag: "AI Concierge",
      title: "The first member of your digital team",
      desc: "Greets visitors, answers questions and guides every client to the right action. Trained on your business knowledge to give precise, personal answers.",
      bullets: ["Instant replies", "Lead capture", "Bookings & appointments", "Product recommendations", "CRM integration"],
      note: "Automated service, 24 hours a day",
      name: "Asenix AI",
      status: "Online",
      msgs: ["Hi", "Hi 👋 I'm Asenix AI, your intelligent assistant. How can I help you today?", "I'd like some help with a few questions"],
      placeholder: "Write me a message…",
    },
    /** Espejo del bloque ES: sin cifras de rendimiento (ver el comentario allí). */
    voice: {
      tag: "Voice agent · in testing",
      title: "And it answers out loud, too.",
      desc: "The same assistant holds the conversation by voice: it answers with your business's information, resolves the question and books the appointment while talking. We're tuning it with our first clients before opening it up — ask us about the waiting list.",
      bullets: ["Answers, resolves and books out loud", "Says it's an AI and that the call is recorded", "What it doesn't know goes to a person", "In testing with our first clients"],
      note: "Try it right here on this page",
      chips: ["Qualifies leads", "AI receptionist", "Books appointments"],
      sectors: ["E-commerce", "Real estate", "Hospitality", "Health & telemedicine"],
    },
    booking: {
      tag: "AI booking automation",
      title: "Automate your bookings and let AI do the work",
      desc: "We connect CRM, calendars, payments and follow-up so every booking moves forward automatically, with no manual work.",
      bullets: ["Automatic bookings", "Calendar sync", "Client & payment management", "Automated follow-up", "Fewer repetitive tasks"],
      note: "Everything in sync, no manual work",
      client: "Client",
      nodes: ["CRM", "Billing", "Calendar", "Follow-up"],
    },
  },
  technology: {
    eyebrow: "Technology",
    titleA: "Technology that powers",
    titleB: "what we build",
    sub: "We combine the leading technologies in artificial intelligence, software development, infrastructure and automation to build fast, scalable systems ready to evolve.",
  },
  /** Espejo del bloque ES: la prueba es el asistente de esta página, no una cifra. */
  work: {
    title: "Don't take our word for it. Try it.",
    sub: "We have no client case studies to show you yet, and we're not going to invent any. We have something better: the assistant is running on this page.",
    link: "Or do the maths with your numbers",
    disclaimer: "When there are client cases, they'll be here with their name and their measured figures. Not before.",
    studies: [
      {
        headline: "Write to it",
        story: "Ask it what you'd ask a salesperson: prices, timelines, what each plan includes. It answers with Asenix's real information.",
        chips: ["Answers instantly", "Nothing made up"],
        stat: "Now",
        statLabel: "on this page",
        action: "chat",
      },
      {
        headline: "Talk to it",
        story: "The same assistant, out loud. It tells you it's an AI and that the call is recorded, and resolves just as it does in writing.",
        chips: ["Straight from the browser", "Nothing to install"],
        stat: "Now",
        statLabel: "voice call",
        action: "voice",
      },
      {
        headline: "Do the maths",
        story: "What slips away today through unanswered enquiries and no-shows, with our assumptions on screen so you can argue with them.",
        chips: ["No sign-up", "Assumptions on screen"],
        stat: "4",
        statLabel: "questions",
        action: "calc",
      },
    ],
  },
  plans: {
    eyebrow: "Plans 2026",
    titleA: "Simple plans that",
    titleB: "scale with you",
    sub: "Transparent starting prices for AI-driven growth. Every project is unique, so we define the perfect scope in a free consultation.",
    setup: "setup",
    from: "from",
    question: "Need something custom?",
    link: "Talk to our team",
    all: "See every plan in detail",
  },
  // Sección retirada de la home hasta tener testimonios REALES: publicar citas
  // inventadas con nombre y cargo es publicidad engañosa (Ley 3/1991). El
  // componente sigue existiendo; se reactiva rellenando `items`.
  testimonials: {
    eyebrow: "What They Say",
    title: "Trusted at the highest level.",
    items: [] as { quote: string; name: string; role: string }[],
  },
  finalCta: {
    titleA: "Let's talk.",
    titleB: "We'd love to hear about your project",
    cta: "Contact",
    orChat: "or ask our AI right now",
    orVoice: "or talk to it out loud",
    note: "projects@asenix.es · Response within 24 hours",
  },
  roi: {
    eyebrow: "Do the maths",
    titleA: "Before you hire anyone,",
    titleB: "do the maths.",
    body: "Not a brochure and not a promise: your own figures, our assumptions in plain sight, and a number you can argue with. Four questions, no sign-up — and if it doesn't pay for your business, it says so.",
    exampleLabel: "Worked example · neighbourhood salon",
    inputsLabel: "What the owner typed in",
    inputLabels: ["Average ticket", "Visit frequency", "Unanswered enquiries", "Lost bookings"],
    inputs: [
      "€45 average per visit",
      "6 visits a year per client",
      "10 enquiries a week left unanswered",
      "12 no-shows a month",
    ],
    leakLabel: "Slipping away today",
    netLabel: "Left over each month",
    paybackLabel: "Pays for itself in",
    months: "months",
    cta: "Do the maths with my numbers",
    note: "No sign-up. Four questions. Every assumption on screen.",
    diagCta: "Request the free Diagnostic",
  },
  footer: {
    tagline: "Designing the future of digital business.",
    sub: "Exceptional digital experiences. Intelligent automation. Tailored technology.",
    contact: "Contact",
    rights: "All rights reserved.",
    legal: "Terms / Privacy",
    navAria: "Footer",
  },
  cookies: {
    title: "Your privacy, your call",
    body: "We use our own browser storage so the site works and, only if you allow it, to measure visits and learn which campaigns bring customers. No advertising or third-party cookies.",
    accept: "Accept all",
    reject: "Reject",
    configure: "Choose what to allow",
    save: "Save my choice",
    close: "Close",
    more: "Cookie policy",
    necessaryTitle: "Necessary",
    necessaryDesc: "Your language, the chat thread while the tab is open, and this very choice. Always on.",
    always: "Always on",
    analyticsTitle: "Measurement",
    analyticsDesc: "Links your visit (page, referrer, campaign) with the conversation you open, so we learn what works. Without it we only count visits anonymously.",
    footerLink: "Cookie preferences",
  },
  chat: {
    welcome:
      "Hi! 👋 I'm the Asenix assistant. Ask me what we do, pricing or timelines — or book a free strategy call.",
    headerName: "Asenix Assistant",
    headerSub: "Replies instantly · also on WhatsApp",
    placeholder: "Type a message…",
    error: "Oops, I can't connect right now. Write to us at projects@asenix.es 🙏",
    ariaOpen: "Open chat",
    ariaClose: "Close chat",
    ariaSend: "Send",
    ariaInput: "Message",
    ariaDialog: "Chat with the assistant",
    privacyNote: "You're talking to an AI assistant. We store this conversation to answer you and manage your booking.",
    privacyLink: "Privacy policy",
  },
  voice: {
    ariaStart: "Start a voice call with the assistant",
    ariaHangup: "Hang up",
    ariaDialog: "Voice call with the assistant",
    ariaOverlay: "Voice call with the Asenix assistant",
    ariaClose: "Close voice mode",
    ariaMute: "Mute my microphone",
    ariaUnmute: "Unmute my microphone",
    headerName: "Asenix Assistant",
    connecting: "Connecting…",
    inCall: "On a call — speak naturally",
    hangup: "Hang up",
    close: "Close",
    openChat: "Open the chat",
    // Línea de estado del overlay: una por estado de la máquina de 5.2.
    statusConnecting: "Connecting…",
    statusListening: "I'm listening",
    statusThinking: "Thinking…",
    statusToolAgenda: "Checking the calendar…",
    statusToolReserva: "Writing down your booking…",
    statusToolContacto: "Type your email below",
    statusSpeaking: "Speaking",
    // Campo de correo en pantalla (más fiable que dictarlo).
    contactLabel: "Your email",
    contactPlaceholder: "name@company.com",
    contactSend: "Send",
    contactSending: "Sending…",
    contactSent: "Received. The assistant carries on.",
    contactFailed: "That doesn't look like an email. Check it and try again.",
    statusEnded: "Call ended",
    error: "I can't start the call right now. Ask me anything on the chat instead 🙏",
    // Errores con causa conocida: cada uno dice qué ha pasado y qué hacer.
    err: {
      rateLimited: "Too many attempts. Give it a moment.",
      micDenied: "I need your microphone to talk with you. Enable it in your browser.",
      insecure: "Voice needs a secure connection.",
      generic: "The call dropped. You can try again or use the chat.",
    },
    privacyNote:
      "You're talking to an AI assistant: the call is recorded for customer service and booking purposes.",
    privacyLink: "Privacy policy",
  },
  contact: {
    eyebrow: "Contact",
    titleA: "Tell us about",
    titleB: "your business.",
    sub: "One short message is enough. A real person replies within 24 working hours — no automated sales sequences.",
    nameLabel: "Your name",
    namePh: "Ana García",
    contactLabel: "Email or phone",
    contactPh: "ana@business.com · +34 600 000 000",
    planLabel: "Plan you're interested in",
    planNone: "Not sure yet",
    messageLabel: "What do you need?",
    messagePh: "Tell us about your business and what you'd like to improve…",
    submit: "Send message",
    sending: "Sending…",
    successTitle: "Message received.",
    successText: "We'll get back to you within 24 working hours. Meanwhile, you can ask our AI assistant anything.",
    successChat: "Open the chat",
    errorText: "We couldn't send your message right now. Write to us directly:",
    privacyNote: "We only use your details to reply to you. No newsletters, no spam.",
    back: "Back to home",
    or: "Prefer to talk right now?",
    orChat: "Ask our AI assistant",
  },
};

const es: typeof en = {
  nav: {
    links: ["Plataforma", "Servicios", "Ecosistema", "Pruebas", "Proceso"],
    home: "Inicio",
    calc: "Calculadora",
    pricing: "Precios",
    cta: "Reservar llamada",
    ctaLong: "Reserva una llamada estratégica",
    ariaOpen: "Abrir menú",
    ariaClose: "Cerrar menú",
    ariaLang: "Switch to English",
  },
  hero: {
    eyebrow: "Asenix",
    titleA: "Tu negocio, rediseñado",
    titleB: "para lo que viene.",
    sub: "Creamos experiencias digitales premium y sistemas inteligentes que atraen clientes, automatizan operaciones e impulsan el crecimiento.",
    ctaPrimary: "Comenzar",
    ctaSecondary: "Ver demo",
  },
  evolution: {
    eyebrow: "El futuro de los negocios",
    stages: [
      { label: "Diseñamos la experiencia", sub: "Experiencias digitales que elevan tu marca." },
      { label: "Automatizamos el sistema", sub: "Convierte visitantes en clientes." },
      { label: "Construimos la inteligencia", sub: "Agentes AI las 24 horas." },
    ],
  },
  services: {
    eyebrow: "Servicios",
    title: "Construimos ecosistemas digitales",
    sub: "Cada proyecto combina diseño premium, desarrollo de alto rendimiento y estrategia inteligente para transformar visitantes en clientes y operaciones en sistemas escalables.",
    link: "Habla con nuestra IA",
    cta: "Cotizar proyecto",
    tabs: [
      {
        label: "Diseño web",
        title: "Diseño que hace a las empresas inolvidables.",
        desc: "Sitios web premium diseñados para generar confianza, destacar tu marca y convertir visitantes en clientes.",
        features: [
          { title: "Belleza", desc: "Diseño premium que refleja el verdadero valor de tu marca." },
          { title: "Rapidez", desc: "Rendimiento optimizado para una experiencia instantánea." },
          { title: "Estrategia", desc: "Diseñado para aumentar conversiones y generar oportunidades." },
          { title: "Escalabilidad", desc: "Preparado para SEO, automatizaciones e inteligencia artificial." },
        ],
        tiles: ["Experiencia de marca", "Diseño de lujo", "Desarrollo de alto rendimiento", "Conversión y crecimiento"],
      },
      {
        label: "Automatización",
        title: "Conectado. Siempre funcionando.",
        desc: "CRM, agenda, pagos y seguimiento sincronizados para que cada reserva avance sin que nadie la toque.",
        features: [
          { title: "Reservas automáticas", desc: "Citas confirmadas y sincronizadas con tu agenda." },
          { title: "Sin tareas repetitivas", desc: "Recordatorios, facturas y seguimientos salen solos." },
          { title: "Seguimiento continuo", desc: "Cada cliente recibe respuesta, también fuera de horario." },
          { title: "Tus herramientas, conectadas", desc: "Funciona con el CRM y la agenda que ya usas." },
        ],
        tiles: ["CRM", "Agenda", "Facturación", "Seguimiento"],
      },
      {
        label: "Tecnología",
        title: "Software a medida que crece contigo.",
        desc: "Agentes de IA, integraciones y sistemas propios pensados para tu negocio, no adaptados de una plantilla.",
        features: [
          { title: "Agentes de IA", desc: "Asistentes que atienden, cualifican y reservan, por texto y por voz." },
          { title: "Integraciones", desc: "Tu TPV, tu ERP o tu facturación, conectados en un solo sistema." },
          { title: "Datos", desc: "Métricas claras de lo que pasa en tu negocio cada día." },
          { title: "Seguridad", desc: "Infraestructura conforme al RGPD y con límites desde el día uno." },
        ],
        tiles: ["Agentes de IA", "Integraciones", "Datos e informes", "Seguridad"],
      },
    ],
  },
  howWeWork: {
    eyebrow: "Cómo trabajamos",
    left: "Tu negocio es un sistema",
    right: "Conectamos todas las piezas",
    svgAria: "Los seis pasos de nuestro método orbitando el núcleo de Asenix",
    steps: [
      { title: "Descubrimos", desc: "Entendemos tu negocio." },
      { title: "Definimos", desc: "Identificamos dónde tu negocio puede mejorar y crecer." },
      { title: "Diseñamos", desc: "Diseñamos la experiencia." },
      { title: "Construimos", desc: "Convertimos la estrategia en realidad." },
      { title: "Evolucionamos", desc: "Analizamos los resultados y optimizamos continuamente." },
      { title: "Integramos", desc: "Sistemas inteligentes que trabajan juntos sin esfuerzo." },
    ],
  },
  aiLayer: {
    eyebrow: "Proceso",
    titleA: "La inteligencia artificial",
    titleB: "detrás de tu negocio",
    sub: "Diseñamos ecosistemas inteligentes que atienden clientes, automatizan operaciones y aceleran el crecimiento de tu empresa.",
    concierge: {
      tag: "AI Concierge",
      title: "El primer miembro de tu equipo digital",
      desc: "Atiende visitantes, responde preguntas y guía a cada cliente hacia la acción correcta. Entrenado con el conocimiento de tu negocio para ofrecer respuestas precisas y personalizadas.",
      bullets: ["Respuestas instantáneas", "Captación de leads", "Reservas y citas", "Recomendaciones de productos", "Integración con CRM"],
      note: "Atención automatizada las 24 horas",
      name: "Asenix AI",
      status: "En línea",
      msgs: ["Hola", "Hola 👋 Soy Asenix AI, tu asistente inteligente. ¿En qué puedo ayudarte hoy?", "Me gustaría que me ayudaras con algunas dudas"],
      placeholder: "Escríbeme un mensaje…",
    },
    /**
     * **17/09/2026 — fuera las tres cifras de rendimiento.**
     *
     * Esta sección prometía "100 % de llamadas respondidas", "3× más citas
     * agendadas" y "90 % de tasa de captación". Con cero clientes de pago no
     * hay de dónde sacar esos porcentajes: no se sostienen ante el primero que
     * pregunte de dónde salen, y contradicen la regla que ordena el resto del
     * sitio — nunca prometer porcentajes, prometer medición. Se eliminan; no
     * se matizan, porque un porcentaje inventado con asterisco sigue siéndolo.
     *
     * El titular también se va. "Nunca pierdas una llamada importante" vende
     * telefonía ENTRANTE, que es justo lo único de aquí que hoy no se puede
     * entregar: falta el número +34, y en `ng-agent/src/plans.ts` el Arranque
     * y el Core llevan `voiceMinutesPerMonth: 0`.
     *
     * Lo que queda es verdad y se puede comprobar sin salir de la página: la
     * llamada por voz desde la web FUNCIONA — es el botón de esta misma home,
     * con aviso hablado de que es una IA y de que se graba (`voice-compliance.ts`
     * y §6 de la política de privacidad). Así que en vez de una lista de espera
     * a secas, la invitación es a probarlo ahora. Convierte mejor que una
     * promesa y, a diferencia de ella, es cierta.
     */
    voice: {
      tag: "Agente de voz · en pruebas",
      title: "Y además, atiende hablando.",
      desc: "El mismo asistente sostiene la conversación por voz: responde con la información de tu negocio, resuelve la duda y cierra la cita hablando. Lo estamos afinando con nuestros primeros clientes antes de abrirlo — pregúntanos por la lista de espera.",
      bullets: ["Responde, resuelve y reserva hablando", "Avisa de que es una IA y de que se graba", "Lo que no sabe, pasa a una persona", "En pruebas con nuestros primeros clientes"],
      note: "Pruébalo ahora mismo en esta página",
      chips: ["Califica clientes potenciales", "Recepcionista con IA", "Agenda citas"],
      sectors: ["Comercio electrónico", "Bienes raíces", "Hostelería", "Salud y telemedicina"],
    },
    booking: {
      tag: "Automatización de reservas con IA",
      title: "Automatiza tus reservas y deja que la IA trabaje por ti",
      desc: "Conectamos CRM, calendarios, pagos y seguimiento para que cada reserva avance automáticamente sin intervención manual.",
      bullets: ["Reservas automáticas", "Sincronización con calendarios", "Gestión de clientes y pagos", "Seguimiento automatizado", "Menos tareas repetitivas"],
      note: "Todo sincronizado, sin intervención manual",
      client: "Cliente",
      nodes: ["CRM", "Facturación", "Agenda", "Seguimiento"],
    },
  },
  technology: {
    eyebrow: "Tecnología",
    titleA: "Tecnología que impulsa",
    titleB: "lo que construimos",
    sub: "Combinamos las tecnologías líderes en inteligencia artificial, desarrollo de software, infraestructura y automatización para crear sistemas rápidos, escalables y preparados para evolucionar.",
  },
  /**
   * **17/09/2026 — la sección dejó de mentirse a sí misma.**
   *
   * Se llamaba «Pruebas, no promesas» y pintaba tres cifras HARDCODEADAS en
   * `CaseStudies.tsx` — +40 % de conversión, −70 % de trabajo manual, 3x de
   * capacidad — animadas contando hacia arriba para que el ojo fuera ahí. Con
   * cero clientes de pago no salían de ningún sitio, y el descargo a 12 px
   * («escenarios ilustrativos basados en los patrones que desplegamos») las
   * empeoraba: daba a entender despliegues que no existen, justo debajo de un
   * titular que las llamaba pruebas.
   *
   * Lo que hay ahora es la única prueba que Asenix puede dar hoy, y es mejor
   * que cualquier cifra: **el asistente está funcionando en esta misma página**.
   * Las tres tarjetas no lo describen, lo ABREN — lanzan `ng:open-chat` y
   * `ng:open-voice`, los mismos eventos que ya usan el hero y el cierre.
   *
   * El descargo pasa de tapar un problema a ser un activo: decir que no hay
   * casos todavía, y que cuando los haya estarán aquí con nombre y cifras
   * medidas, es la misma seriedad que se vende en el resto del sitio.
   *
   * Si algún día hay casos reales, esto vuelve a ser una sección de casos —
   * pero con cliente, cifra medida y permiso para publicarla.
   */
  work: {
    title: "No te lo creas. Pruébalo.",
    sub: "Todavía no tenemos casos de clientes que enseñarte, y no vamos a inventarlos. Tenemos algo mejor: el asistente está funcionando en esta página.",
    link: "O haz la cuenta con tus números",
    disclaimer: "Cuando haya casos de clientes, estarán aquí con su nombre y sus cifras medidas. No antes.",
    studies: [
      {
        headline: "Escríbele",
        story: "Pregúntale lo que le preguntarías a un comercial: precios, plazos, qué incluye cada plan. Responde con la información real de Asenix.",
        chips: ["Responde al instante", "Sin datos inventados"],
        stat: "Ahora",
        statLabel: "en esta página",
        action: "chat",
      },
      {
        headline: "Háblale",
        story: "El mismo asistente, hablando. Te avisa de que es una IA y de que la llamada se graba, y resuelve igual que por escrito.",
        chips: ["Desde el navegador", "Sin instalar nada"],
        stat: "Ahora",
        statLabel: "llamada por voz",
        action: "voice",
      },
      {
        headline: "Haz la cuenta",
        story: "Cuánto se te escapa hoy por consultas sin responder y plantones, con nuestras hipótesis a la vista para que puedas discutirlas.",
        chips: ["Sin registro", "Hipótesis a la vista"],
        stat: "4",
        statLabel: "preguntas",
        action: "calc",
      },
    ],
  },
  plans: {
    eyebrow: "Planes 2026",
    titleA: "Planes simples que",
    titleB: "escalan contigo",
    sub: "Precios iniciales transparentes para un crecimiento impulsado por IA. Como cada proyecto es único, definiremos el alcance perfecto en una consulta gratuita.",
    setup: "de puesta en marcha",
    from: "desde",
    question: "¿Necesitas algo personalizado?",
    link: "Habla con nuestro equipo",
    all: "Ver todos los planes al detalle",
  },
  testimonials: {
    eyebrow: "Lo que dicen",
    title: "Confianza al más alto nivel.",
    items: [],
  },
  finalCta: {
    titleA: "Hablemos.",
    titleB: "Nos encantaría conocer tu proyecto",
    cta: "Contactar",
    orChat: "o pregúntale a nuestra IA ahora mismo",
    orVoice: "o háblale en voz alta",
    note: "projects@asenix.es · Respuesta en menos de 24 h",
  },
  roi: {
    eyebrow: "La cuenta",
    titleA: "Antes de contratar nada,",
    titleB: "haz la cuenta.",
    body: "Ni un folleto ni una promesa: tus cifras, nuestras hipótesis a la vista y un número que puedes discutir. Cuatro preguntas, sin registro — y si a tu negocio no le compensa, lo dice.",
    exampleLabel: "Ejemplo real de la cuenta · peluquería de barrio",
    inputsLabel: "Lo que puso el dueño",
    inputLabels: ["Ingreso medio", "Frecuencia media", "Consultas sin responder", "Reservas perdidas"],
    inputs: [
      "45 € de media por visita",
      "6 visitas al año por cliente",
      "10 consultas a la semana sin responder",
      "12 plantones al mes",
    ],
    leakLabel: "Se le escapa hoy",
    netLabel: "Le quedaría a favor cada mes",
    paybackLabel: "Se paga solo en",
    months: "meses",
    cta: "Hacer la cuenta con mis números",
    note: "Sin registro. Cuatro preguntas. Las hipótesis, en pantalla.",
    diagCta: "Pedir el Diagnóstico gratis",
  },
  footer: {
    tagline: "Diseñamos el futuro de los negocios digitales.",
    sub: "Experiencias digitales excepcionales. Automatización inteligente. Tecnología a medida.",
    contact: "Contacto",
    rights: "Todos los derechos reservados.",
    legal: "Términos / Privacidad",
    navAria: "Pie de página",
  },
  cookies: {
    title: "Tu privacidad, tu decisión",
    body: "Usamos almacenamiento propio para que la web funcione y, solo si nos lo permites, para medir visitas y saber qué campañas traen clientes. Sin cookies publicitarias ni de terceros.",
    accept: "Aceptar todo",
    reject: "Rechazar",
    configure: "Elegir qué permitir",
    save: "Guardar mi elección",
    close: "Cerrar",
    more: "Política de cookies",
    necessaryTitle: "Necesarias",
    necessaryDesc: "Tu idioma, el hilo del chat mientras dura la pestaña y esta misma elección. Siempre activas.",
    always: "Siempre activas",
    analyticsTitle: "Medición",
    analyticsDesc: "Une tu visita (página, procedencia, campaña) con la conversación que abras, para saber qué funciona. Sin ella solo contamos visitas de forma anónima.",
    footerLink: "Preferencias de cookies",
  },
  chat: {
    welcome:
      "¡Hola! 👋 Soy el asistente de Asenix. Pregúntame qué hacemos, precios o plazos — o reserva una llamada de estrategia gratis.",
    headerName: "Asistente Asenix",
    headerSub: "Responde al instante · también en WhatsApp",
    placeholder: "Escríbeme algo…",
    error: "Ups, no consigo conectar ahora mismo. Escríbenos a projects@asenix.es 🙏",
    ariaOpen: "Abrir chat",
    ariaClose: "Cerrar chat",
    ariaSend: "Enviar",
    ariaInput: "Mensaje",
    ariaDialog: "Chat con el asistente",
    privacyNote: "Hablas con un asistente de IA. Guardamos esta conversación para atenderte y gestionar tu cita.",
    privacyLink: "Política de privacidad",
  },
  voice: {
    ariaStart: "Iniciar una llamada de voz con el asistente",
    ariaHangup: "Colgar",
    ariaDialog: "Llamada de voz con el asistente",
    ariaOverlay: "Llamada de voz con el asistente de Asenix",
    ariaClose: "Cerrar el modo voz",
    ariaMute: "Silenciar mi micrófono",
    ariaUnmute: "Activar mi micrófono",
    headerName: "Asistente Asenix",
    connecting: "Conectando…",
    inCall: "En llamada — habla con normalidad",
    hangup: "Colgar",
    close: "Cerrar",
    openChat: "Abrir el chat",
    statusConnecting: "Conectando…",
    statusListening: "Te escucho",
    statusThinking: "Pensando…",
    statusToolAgenda: "Consultando la agenda…",
    statusToolReserva: "Apuntando tu reserva…",
    statusToolContacto: "Escribe tu correo aquí abajo",
    statusSpeaking: "Hablando",
    contactLabel: "Tu correo",
    contactPlaceholder: "nombre@empresa.com",
    contactSend: "Enviar",
    contactSending: "Enviando…",
    contactSent: "Recibido. El asistente sigue contigo.",
    contactFailed: "Eso no parece un correo. Revísalo y vuelve a intentarlo.",
    statusEnded: "Llamada terminada",
    error: "Ahora mismo no puedo iniciar la llamada. Pregúntame lo que quieras por el chat 🙏",
    err: {
      rateLimited: "Demasiados intentos. Espera un momento.",
      micDenied: "Necesito el micrófono para hablar contigo. Actívalo en el navegador.",
      insecure: "La voz necesita una conexión segura.",
      generic: "Se ha cortado la llamada. Puedes volver a intentarlo o seguir por el chat.",
    },
    privacyNote:
      "Hablas con un asistente de IA: la llamada se graba con fines de atención al cliente y gestión de reservas.",
    privacyLink: "Política de privacidad",
  },
  contact: {
    eyebrow: "Contacto",
    titleA: "Cuéntanos sobre",
    titleB: "tu negocio.",
    sub: "Con un mensaje corto basta. Te responde una persona real en menos de 24 horas laborables — sin secuencias comerciales automáticas.",
    nameLabel: "Tu nombre",
    namePh: "Ana García",
    contactLabel: "Email o teléfono",
    contactPh: "ana@negocio.com · 600 000 000",
    planLabel: "Plan que te interesa",
    planNone: "Aún no lo sé",
    messageLabel: "¿Qué necesitas?",
    messagePh: "Cuéntanos sobre tu negocio y qué te gustaría mejorar…",
    submit: "Enviar mensaje",
    sending: "Enviando…",
    successTitle: "Mensaje recibido.",
    successText: "Te contactamos en menos de 24 horas laborables. Mientras tanto, puedes preguntarle lo que quieras a nuestro asistente de IA.",
    successChat: "Abrir el chat",
    errorText: "No hemos podido enviar tu mensaje ahora mismo. Escríbenos directamente:",
    privacyNote: "Solo usamos tus datos para responderte. Sin newsletters ni spam.",
    back: "Volver al inicio",
    or: "¿Prefieres hablar ya?",
    orChat: "Pregunta a nuestro asistente",
  },
};

export type Dict = typeof en;
export const dictionaries: Record<Locale, Dict> = { en, es };
