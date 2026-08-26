/**
 * Textos y parámetros de la calculadora pública (/calculadora), ES + EN.
 *
 * ---
 *
 * **Qué es esto y qué NO es.** Existe una versión interna de esta misma cuenta
 * que se usa durante la llamada de venta: tiene doce campos, el guion de lo que
 * hay que decir en voz alta, la tarifa de fundador y un botón de "copiar para la
 * propuesta". Eso no se publica. Lo que se publica es esto: el mismo motor de
 * cálculo con cuatro preguntas, la tarifa pública y las hipótesis fijas.
 *
 * Reglas que ordenan este archivo:
 *
 * 1. **Ninguna hipótesis es editable por el visitante.** En la llamada se bajan
 *    delante del cliente porque ahí hay una persona explicando de dónde salen.
 *    En la web, un porcentaje que el visitante puede subir convierte la cifra en
 *    lo que él quiera creer, y entonces no prueba nada.
 * 2. **Las tres hipótesis son conservadoras y están escritas en la página**, no
 *    escondidas en un asterisco. Que el número aguante convence más que un
 *    número grande.
 * 3. **Precios públicos, nunca la tarifa de fundador.** Los de aquí son espejo
 *    de `src/i18n/pricing.ts`: si cambian allí, cambian aquí. Nexus no aparece
 *    porque su puesta en marcha es "desde" y no se puede calcular un retorno
 *    sobre un precio que aún no existe.
 * 4. **El resultado puede ser que no sale.** Está contemplado y se dice con
 *    todas las letras. Una calculadora que siempre da que sí es un anuncio.
 * 5. **No es una garantía.** El aviso viaja con el resultado, no en el pie.
 */

export type Locale = "es" | "en";

/** Semanas por mes. Mismo valor que la versión de llamada: 52 / 12. */
export const WEEKS = 4.33;

/**
 * Las tres hipótesis de Asenix. Son las únicas cifras del cálculo que no las
 * pone el visitante, y por eso son las únicas que hay que defender.
 *
 * - `conversion`: de cada 10 personas que preguntan y no reciben respuesta,
 *   cuántas habrían acabado comprando. 2 es el suelo del rango que vemos; en la
 *   llamada muchos dueños dicen 4 o 5 de su propio negocio.
 * - `recovery`: qué parte de ese dinero perdido recupera el agente. 40 % da por
 *   perdido a 6 de cada 10, que es mucho dar por perdido.
 * - `noShowCut`: cuánto bajan los plantones con recordatorio a 24 h y a 2 h.
 */
export const ASSUMPTIONS = {
  conversion: 2 / 10,
  recovery: 0.4,
  noShowCut: 0.3,
} as const;

/** Tarifa pública. Espejo de `pricing.ts` — si cambia allí, cambia aquí. */
export const CALC_PLANS = [
  { k: "arranque", setup: 2900, mrr: 349 },
  { k: "core", setup: 5900, mrr: 349 },
] as const;

export type CalcPlanKey = (typeof CALC_PLANS)[number]["k"];

export type CalcInput = {
  ticket: number;
  visits: number;
  missed: number;
  noShows: number;
};

export type CalcResult = {
  /** Ticket × visitas al año: lo que deja un cliente nuevo en 12 meses. */
  clientValue: number;
  /** Lo que hoy se escapa al mes por consultas sin responder. */
  leak: number;
  /** La parte de esa fuga que recupera el agente. */
  recovered: number;
  /** Dinero de plantones que dejan de perderse. */
  noShowGain: number;
  /** recovered + noShowGain. */
  gain: number;
  /** Cuota + puesta en marcha repartida a 12 meses. */
  cost: number;
  /** gain − cost. Puede ser negativo, y entonces se dice. */
  net: number;
  /** Meses hasta cubrir la puesta en marcha. Infinity si no llega. */
  payback: number;
  /** Retorno sobre lo invertido a 12 meses, en %. */
  roi: number;
};

/**
 * El cálculo entero, sin estado ni DOM: mismo motor que la versión de llamada.
 * Está fuera del componente para poder probarlo y para que la exportación a
 * Figma pueda pintar un caso de ejemplo con las cifras de verdad.
 */
export function calculate(input: CalcInput, plan: { setup: number; mrr: number }): CalcResult {
  const ticket = Math.max(0, input.ticket);
  const visits = Math.max(1, input.visits);
  const clientValue = ticket * visits;

  const leak = Math.max(0, input.missed) * WEEKS * ASSUMPTIONS.conversion * clientValue;
  const recovered = leak * ASSUMPTIONS.recovery;
  const noShowGain = Math.max(0, input.noShows) * ASSUMPTIONS.noShowCut * ticket;
  const gain = recovered + noShowGain;

  const cost = plan.mrr + plan.setup / 12;
  const net = gain - cost;

  // El payback se mide contra la CUOTA, no contra el coste imputado: la puesta
  // en marcha es justo lo que se está amortizando, no puede estar en los dos
  // lados de la división.
  const margin = gain - plan.mrr;
  const payback = margin > 0 ? plan.setup / margin : Infinity;
  const roi = cost > 0 ? ((gain - cost) / cost) * 100 : 0;

  return { clientValue, leak, recovered, noShowGain, gain, cost, net, payback, roi };
}

export type CalcDict = {
  back: string;
  header: { eyebrow: string; titleA: string; titleB: string; lede: string };
  /** El porqué, antes de pedirle números a nadie: dónde se pierde el dinero. */
  why: {
    eyebrow: string;
    title: string;
    body: string;
    items: { title: string; body: string }[];
    foot: string;
  };
  form: {
    step1: string;
    sectorLabel: string;
    sectorHint: string;
    sectors: { k: string; label: string; visits: number }[];
    ticketLabel: string;
    ticketHint: string;
    visitsLabel: string;
    visitsHint: string;
    step2: string;
    step2Hint: string;
    missedLabel: string;
    missedHint: string;
    noShowsLabel: string;
    noShowsHint: string;
    step3: string;
    planHint: string;
    plans: { k: CalcPlanKey; name: string; desc: string }[];
    perMonth: string;
    setupNote: string;
    reset: string;
    example: string;
  };
  result: {
    eyebrow: string;
    idleTitle: string;
    idleBody: string;
    paybackLabel: string;
    months: string;
    paybackBody: string;
    negTitle: string;
    negBody: string;
    negCta: string;
    barGain: string;
    barLeak: string;
    rows: {
      leak: { label: string; note: string };
      recovered: { label: string; note: string };
      noShows: { label: string; note: string };
      gain: { label: string; note: string };
      cost: { label: string; note: string };
      net: { label: string; note: string };
    };
    roiLabel: string;
    roiNote: string;
    clientValueLabel: string;
  };
  assumptions: {
    title: string;
    body: string;
    items: string[];
    math: string;
    warning: string;
  };
  lead: {
    eyebrow: string;
    title: string;
    body: string;
    nameLabel: string;
    namePh: string;
    contactLabel: string;
    contactPh: string;
    submit: string;
    sending: string;
    okTitle: string;
    okBody: string;
    errorText: string;
    privacyNote: string;
    subjectLine: string;
  };
  /** Objeciones reales de la llamada, respondidas antes de pedir el email. */
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] };
  diag: { badge: string; body: string; cta: string };
  toPricing: string;
};

const es: CalcDict = {
  back: "Volver al inicio",
  header: {
    eyebrow: "Calculadora · sin registro",
    titleA: "Cuánto se te está",
    titleB: "escapando cada mes",
    lede: "Cuatro preguntas sobre tu negocio y verás qué parte de lo que hoy se pierde recuperaría el asistente, cuánto cuesta y en cuántos meses se paga solo. Con las cuentas a la vista para que puedas discutirlas.",
  },
  why: {
    eyebrow: "Antes de los números",
    title: "El dinero no se pierde de golpe. Se pierde a goteo y sin factura.",
    body: "Nadie apunta lo que no llegó a entrar. No sale en el TPV, no sale en el banco y no sale en la contabilidad — por eso un negocio puede estar perdiendo el equivalente a un sueldo al mes y no notarlo. Son tres goteos, y los tres se tapan con lo mismo:",
    items: [
      {
        title: "Quien pregunta de noche, por la mañana ya reservó en otro sitio",
        body: "Más de la mitad de las consultas llegan cuando el negocio está cerrado. No es que esa gente no quisiera comprar: es que preguntó a las once y a las nueve del día siguiente ya tenía cita en otra parte.",
      },
      {
        title: "Contestar tarde cuesta casi lo mismo que no contestar",
        body: "El que pregunta por WhatsApp no espera. Manda el mismo mensaje a tres sitios y se queda con el primero que responde. Ese mensaje sin abrir de anoche no es una tarea pendiente: es un cliente que ya no está.",
      },
      {
        title: "Un plantón no es un hueco vacío: es una venta ya cerrada que se cae",
        body: "La cita estaba hecha, el hueco reservado y el equipo esperando. Cuando el aviso llega a tiempo, quien no puede venir cancela — y ese hueco se vuelve a vender el mismo día.",
      },
    ],
    foot: "La calculadora de abajo pone cifras a esos tres goteos con los números de tu negocio, y los compara con lo que cuesta taparlos.",
  },
  form: {
    step1: "1 · Tu negocio",
    sectorLabel: "¿A qué te dedicas?",
    sectorHint: "Solo rellena una casilla por ti — puedes cambiarla.",
    sectors: [
      { k: "dental", label: "Clínica dental", visits: 2 },
      { k: "belleza", label: "Peluquería o estética", visits: 8 },
      { k: "fisio", label: "Fisioterapia o podología", visits: 6 },
      { k: "taller", label: "Taller o automoción", visits: 2 },
      { k: "restaurante", label: "Restaurante", visits: 6 },
      { k: "otro", label: "Otro", visits: 3 },
    ],
    ticketLabel: "Lo que os deja de media una visita",
    ticketHint: "En euros, antes de impuestos. A ojo vale.",
    visitsLabel: "Veces que ese cliente vuelve al año",
    visitsHint: "Ticket × visitas = lo que vale de verdad un cliente nuevo.",
    step2: "2 · Lo que se escapa hoy",
    step2Hint: "Si no lo sabes de memoria, mira el móvil: los mensajes de anoche que siguen sin abrir son el número.",
    missedLabel: "Consultas sin responder o respondidas tarde",
    missedHint: "A la semana. WhatsApp, formularios, llamadas perdidas, mensajes de fuera de horario.",
    noShowsLabel: "Citas a las que no se presentan",
    noShowsHint: "Al mes. Los plantones que hoy dejan el hueco vacío.",
    step3: "3 · Con qué plan lo comparo",
    planHint: "La cuota mensual es la misma en los dos. Lo que cambia es si además te construimos la web.",
    plans: [
      { k: "arranque", name: "Arranque", desc: "El asistente sobre la web que ya tienes" },
      { k: "core", name: "Core", desc: "El asistente y la web nueva" },
    ],
    perMonth: "/mes",
    setupNote: "de puesta en marcha",
    reset: "Empezar de cero",
    example: "Ver un ejemplo",
  },
  result: {
    eyebrow: "Tu cuenta",
    idleTitle: "Rellena tus números",
    idleBody: "En cuanto pongas lo que deja una visita y cuántas consultas se quedan sin responder, aquí aparece la cifra — y el desglose de dónde sale cada euro.",
    paybackLabel: "Se paga solo en",
    months: "meses",
    paybackBody: "A partir de ahí, lo que hoy se pierde se queda en el negocio.",
    negTitle: "Con estos números, no sale",
    negBody: "Lo que recuperaría el asistente no cubre su cuota. Puede ser que falten datos, o que hoy no se te esté escapando lo suficiente como para que te compense — y preferimos decírtelo aquí que en la tercera reunión. Si crees que las cifras que has puesto se quedan cortas, ajústalas; si no, escríbenos igual y te decimos qué haríamos nosotros en tu lugar.",
    negCta: "Cuéntanoslo igual",
    barGain: "Lo que se recupera",
    barLeak: "Lo que se seguiría perdiendo",
    rows: {
      leak: { label: "Se escapa hoy", note: "consultas sin responder × lo que vale un cliente" },
      recovered: { label: "Se recupera", note: "hipótesis del 40 %" },
      noShows: { label: "Plantones evitados", note: "recordatorios 24 h y 2 h · −30 %" },
      gain: { label: "Entra al mes", note: "recuperado + plantones evitados" },
      cost: { label: "Cuesta Asenix", note: "cuota + puesta en marcha repartida a 12 meses" },
      net: { label: "Queda a favor", note: "cada mes, desde el primero" },
    },
    roiLabel: "Retorno a 12 meses",
    roiNote: "Por cada euro invertido en el primer año.",
    clientValueLabel: "Un cliente nuevo vale",
  },
  assumptions: {
    title: "De dónde sale cada número",
    body: "Tú pones cuatro cifras de tu negocio. Nosotros ponemos tres, y son estas — fijas, a la vista y deliberadamente cortas:",
    items: [
      "**2 de cada 10** de las consultas que hoy no se responden habrían acabado comprando. Es el suelo de lo que vemos; muchos dueños nos dicen 4 o 5.",
      "**Recuperamos el 40 %** de ese dinero. Damos por perdidos 6 de cada 10, porque hay quien ya compró en otro sitio antes de que nadie conteste.",
      "**Los recordatorios evitan el 30 %** de los plantones. Avisan 24 h y 2 h antes, y el que cancela libera el hueco a tiempo para revenderlo.",
    ],
    math: "**Se escapa** = consultas sin responder × 4,33 semanas × 2/10 × (ticket × visitas al año). **Plantones** = plantones al mes × 30 % × ticket. **Se paga solo en** = puesta en marcha ÷ (lo que entra al mes − la cuota).",
    warning: "Esto es una estimación construida con los datos que has escrito tú, no una previsión ni una garantía de resultado. Sirve para ver el orden de magnitud y decidir si merece la pena una conversación.",
  },
  lead: {
    eyebrow: "El desglose, por escrito",
    title: "¿Te lo mandamos con tus números dentro?",
    body: "Te enviamos esta misma cuenta desglosada y, si quieres, media hora para revisarla con tus datos reales delante. Sin compromiso y sin llamadas a deshora.",
    nameLabel: "Tu nombre",
    namePh: "Nombre y negocio",
    contactLabel: "Email o teléfono",
    contactPh: "para enviarte el desglose",
    submit: "Enviarme el desglose",
    sending: "Enviando…",
    okTitle: "Recibido",
    okBody: "Te llega el desglose con tus cifras en menos de 24 h laborables. Si prefieres adelantarlo, respóndenos al mismo correo y lo vemos antes.",
    errorText: "No hemos podido enviarlo. Escríbenos a",
    privacyNote: "Solo usamos tus datos para responderte. Sin newsletters ni spam.",
    subjectLine: "Calculadora de retorno · cifras del visitante",
  },
  faq: {
    eyebrow: "Lo que sueles preguntar aquí",
    title: "Antes de darnos tu email",
    items: [
      {
        q: "¿Esto es una estimación o una promesa?",
        a: "Una estimación, y de las prudentes. Cuatro de las siete cifras las pones tú y las otras tres son nuestras, están escritas arriba y son el suelo de lo que vemos, no el techo. **Nadie te va a garantizar un número por adelantado**, ni nosotros ni nadie que trabaje en serio. Lo que sí se puede garantizar es que a los 30 días verás en tu panel cuántas conversaciones se atendieron, cuántas citas se cerraron y cuántos leads entraron — y ahí se compara lo estimado con lo que pasó.",
      },
      {
        q: "Mi negocio no se parece al del ejemplo. ¿Me sirve igual?",
        a: "Sirve si vives de citas o de reservas: clínicas, peluquerías, fisioterapia, talleres, restaurantes, academias, veterinarios, asesorías. La cuenta solo necesita saber **qué te deja un cliente y cuánta gente pregunta sin recibir respuesta**. Si tu negocio no funciona por citas, esta calculadora se queda corta — escríbenos y lo miramos de otra forma.",
      },
      {
        q: "¿Por qué 2 de cada 10 y no un número más alto?",
        a: "Porque es el suelo. Cuando preguntamos en la llamada, la mayoría de dueños dicen que de cada diez que preguntan acaban viniendo cuatro o cinco. Usamos 2 a propósito: **si con el número pesimista ya sale, con el tuyo sale mucho mejor**, y no hay que discutirlo. Si te parece optimista incluso así, divídelo mentalmente por dos y mira si sigue compensando.",
      },
      {
        q: "¿Y si me sale que no compensa?",
        a: "Entonces no compensa, y te lo decimos aquí. Puede pasar por dos motivos: que hoy no se te esté escapando lo suficiente —enhorabuena, tu operativa va fina— o que el plan sea grande para el tamaño de tu negocio. En los dos casos preferimos que lo veas en esta pantalla y no después de tres reuniones. Escríbenos igual: a veces la respuesta correcta es **\"todavía no\"**, y eso también lo decimos.",
      },
      {
        q: "Si os dejo el email, ¿me vais a perseguir?",
        a: "No. Te llega el desglose por escrito con tus cifras dentro y, si quieres, media hora para revisarlo. **Un correo, una respuesta.** Si no contestas, no insistimos: no tenemos equipo comercial llamando a puerta fría ni ganas de tenerlo.",
      },
      {
        q: "Si me decido, ¿cuánto tarda en funcionar?",
        a: "El **Arranque** está atendiendo en tu web y tu WhatsApp en **7 días**, porque se monta sobre la web que ya tienes. El **Core** son 4–6 semanas, que es lo que lleva construir la marca y la web nuevas. La cuota mensual es la misma en los dos.",
      },
    ],
  },
  diag: {
    badge: "El siguiente paso, si te cuadra",
    body: "Esto es una cuenta de servilleta hecha con cifras que has puesto a ojo. El **Diagnóstico de IA** es la versión medida: dos semanas mirando tus procesos de verdad, con las oportunidades ordenadas por retorno y las cifras sacadas de tu negocio en lugar de una hipótesis. **Y no te cuesta nada** — el informe es tuyo, lo contrates o no.",
    cta: "Ver los planes y el Diagnóstico",
  },
  toPricing: "Ver la tarifa completa",
};

const en: CalcDict = {
  back: "Back to home",
  header: {
    eyebrow: "Calculator · no sign-up",
    titleA: "How much is slipping",
    titleB: "away every month",
    lede: "Four questions about your business and you'll see how much of what you lose today the assistant would recover, what it costs, and how many months it takes to pay for itself. With the maths in plain sight, so you can argue with it.",
  },
  why: {
    eyebrow: "Before the numbers",
    title: "Money doesn't leave all at once. It leaks, and it never shows up on an invoice.",
    body: "Nobody records what never came in. It isn't in the till, it isn't in the bank and it isn't in the accounts — which is how a business can be losing the equivalent of a salary every month without feeling it. Three leaks, and the same thing plugs all three:",
    items: [
      {
        title: "Whoever asks at night has booked somewhere else by morning",
        body: "More than half of enquiries arrive when the business is shut. It isn't that those people didn't want to buy: they asked at eleven, and by nine the next morning they had an appointment elsewhere.",
      },
      {
        title: "Answering late costs almost as much as not answering",
        body: "People asking on WhatsApp don't wait. They send the same message to three places and go with whoever replies first. That unopened message from last night isn't a task on your list: it's a client who is already gone.",
      },
      {
        title: "A no-show isn't an empty slot: it's a closed sale falling through",
        body: "The appointment was booked, the slot held and the team waiting. When the reminder arrives in time, whoever can't come cancels — and that slot gets resold the same day.",
      },
    ],
    foot: "The calculator below puts figures on those three leaks using your own numbers, and weighs them against what it costs to plug them.",
  },
  form: {
    step1: "1 · Your business",
    sectorLabel: "What do you do?",
    sectorHint: "This only fills one field for you — you can change it.",
    sectors: [
      { k: "dental", label: "Dental clinic", visits: 2 },
      { k: "belleza", label: "Salon or beauty", visits: 8 },
      { k: "fisio", label: "Physio or podiatry", visits: 6 },
      { k: "taller", label: "Garage or automotive", visits: 2 },
      { k: "restaurante", label: "Restaurant", visits: 6 },
      { k: "otro", label: "Something else", visits: 3 },
    ],
    ticketLabel: "What an average visit leaves you",
    ticketHint: "In euros, before tax. A rough figure is fine.",
    visitsLabel: "Times that client comes back per year",
    visitsHint: "Ticket × visits = what a new client is actually worth.",
    step2: "2 · What's slipping away today",
    step2Hint: "If you don't know it by heart, check your phone: last night's unopened messages are the number.",
    missedLabel: "Enquiries unanswered or answered late",
    missedHint: "Per week. WhatsApp, forms, missed calls, after-hours messages.",
    noShowsLabel: "Appointments nobody shows up to",
    noShowsHint: "Per month. The no-shows that leave the slot empty today.",
    step3: "3 · Which plan am I comparing against",
    planHint: "The monthly fee is the same in both. What changes is whether we also build your website.",
    plans: [
      { k: "arranque", name: "Arranque", desc: "The assistant on the site you already have" },
      { k: "core", name: "Core", desc: "The assistant and a new website" },
    ],
    perMonth: "/mo",
    setupNote: "setup",
    reset: "Start over",
    example: "See an example",
  },
  result: {
    eyebrow: "Your numbers",
    idleTitle: "Fill in your figures",
    idleBody: "As soon as you enter what a visit leaves you and how many enquiries go unanswered, the figure appears here — with the breakdown of where every euro comes from.",
    paybackLabel: "Pays for itself in",
    months: "months",
    paybackBody: "From then on, what's lost today stays in the business.",
    negTitle: "With these numbers, it doesn't add up",
    negBody: "What the assistant would recover doesn't cover its monthly fee. Maybe figures are missing, or maybe you simply aren't losing enough today for this to be worth it — and we'd rather tell you here than in the third meeting. If you think the numbers you entered are too low, adjust them; if not, write to us anyway and we'll tell you what we'd do in your place.",
    negCta: "Tell us anyway",
    barGain: "Recovered",
    barLeak: "Still lost",
    rows: {
      leak: { label: "Slipping away today", note: "unanswered enquiries × what a client is worth" },
      recovered: { label: "Recovered", note: "40 % assumption" },
      noShows: { label: "No-shows avoided", note: "24 h and 2 h reminders · −30 %" },
      gain: { label: "Comes in per month", note: "recovered + no-shows avoided" },
      cost: { label: "Asenix costs", note: "fee + setup spread over 12 months" },
      net: { label: "Left over", note: "every month, from the first one" },
    },
    roiLabel: "12-month return",
    roiNote: "For every euro invested in the first year.",
    clientValueLabel: "A new client is worth",
  },
  assumptions: {
    title: "Where each number comes from",
    body: "You provide four figures from your business. We provide three, and here they are — fixed, visible and deliberately low:",
    items: [
      "**2 in 10** of today's unanswered enquiries would have ended up buying. That's the floor of what we see; plenty of owners tell us 4 or 5.",
      "**We recover 40 %** of that money. We write off 6 in 10, because some people bought elsewhere before anyone replied.",
      "**Reminders avoid 30 %** of no-shows. They go out 24 h and 2 h ahead, and whoever cancels frees the slot in time to resell it.",
    ],
    math: "**Slipping away** = unanswered enquiries × 4.33 weeks × 2/10 × (ticket × visits per year). **No-shows** = monthly no-shows × 30 % × ticket. **Pays for itself in** = setup ÷ (monthly gain − monthly fee).",
    warning: "This is an estimate built from figures you typed in yourself — not a forecast and not a guarantee of results. It's here to show the order of magnitude and help you decide whether a conversation is worth it.",
  },
  lead: {
    eyebrow: "The breakdown, in writing",
    title: "Want it sent over with your numbers in it?",
    body: "We'll email you this same calculation, itemised, and half an hour to go through it with your real data if you want. No commitment, no calls at odd hours.",
    nameLabel: "Your name",
    namePh: "Name and business",
    contactLabel: "Email or phone",
    contactPh: "so we can send the breakdown",
    submit: "Send me the breakdown",
    sending: "Sending…",
    okTitle: "Got it",
    okBody: "You'll have the breakdown with your figures within 24 working hours. If you'd rather move faster, reply to that same email and we'll look at it sooner.",
    errorText: "We couldn't send it. Write to us at",
    privacyNote: "We only use your details to reply to you. No newsletters, no spam.",
    subjectLine: "ROI calculator · visitor's figures",
  },
  faq: {
    eyebrow: "What people ask at this point",
    title: "Before you give us your email",
    items: [
      {
        q: "Is this an estimate or a promise?",
        a: "An estimate, and a cautious one. Four of the seven figures are yours and the other three are ours, written out above, and they're the floor of what we see rather than the ceiling. **Nobody can guarantee you a number up front** — not us, not anyone working seriously. What can be guaranteed is that after 30 days your dashboard shows how many conversations were handled, how many appointments closed and how many leads came in, so the estimate can be held against what actually happened.",
      },
      {
        q: "My business looks nothing like the example. Does this still work?",
        a: "It works if you live off appointments or bookings: clinics, salons, physios, garages, restaurants, academies, vets, advisors. The maths only needs to know **what a client leaves you and how many people ask without getting an answer**. If your business doesn't run on appointments, this calculator falls short — write to us and we'll look at it another way.",
      },
      {
        q: "Why 2 in 10 and not something higher?",
        a: "Because it's the floor. When we ask on a call, most owners say four or five out of every ten enquiries end up walking in. We use 2 on purpose: **if it already adds up with the pessimistic number, it adds up far better with yours**, and there's nothing to argue about. If even that sounds optimistic, halve it in your head and see whether it still pays.",
      },
      {
        q: "And if it turns out it doesn't pay?",
        a: "Then it doesn't, and we say so right here. It happens for two reasons: either you aren't losing enough today — congratulations, your operation is tight — or the plan is large for the size of your business. Either way we'd rather you saw it on this screen than after three meetings. Write to us anyway: sometimes the right answer is **\"not yet\"**, and we say that too.",
      },
      {
        q: "If I leave my email, will you chase me?",
        a: "No. You get the breakdown in writing with your figures in it and, if you want it, half an hour to go through it. **One email, one reply.** If you don't answer, we don't push: we have no cold-calling sales team and no wish to build one.",
      },
      {
        q: "If I go ahead, how long until it works?",
        a: "**Arranque** is answering on your website and WhatsApp in **7 days**, because it sits on the site you already have. **Core** takes 4–6 weeks, which is what building the new brand and website takes. The monthly fee is the same either way.",
      },
    ],
  },
  diag: {
    badge: "The next step, if it adds up",
    body: "This is a back-of-the-napkin calculation from figures you estimated. The **AI Diagnostic** is the measured version: two weeks looking at your actual processes, with the opportunities ranked by return and the figures taken from your business rather than from an assumption. **And it costs you nothing** — the report is yours, whether you sign up or not.",
    cta: "See the plans and the Diagnostic",
  },
  toPricing: "See the full pricing",
};

export const calcDicts: Record<Locale, CalcDict> = { es, en };
