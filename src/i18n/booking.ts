/**
 * Textos de /contacto — la reserva de llamada del Figma `1643:2250`.
 *
 * Tres desvíos deliberados respecto al marco, porque el marco lleva texto de
 * plantilla sin revisar y publicarlo tal cual sería peor que el diseño:
 *
 * - **Acentos y mayúsculas.** El marco escribe «Obten una llamada estrategica»,
 *   «Telefono», «Ubicacion», «Correo Electronico», «Cuentanos». Aquí van
 *   acentuados y con la mayúscula donde toca.
 * - **La miga dice «Hogar»** en el marco: es «Home» pasado por un traductor.
 *   Aquí es «Inicio».
 * - **Los datos de contacto del marco son de plantilla**: `asenix@asenix.com`
 *   (el dominio real es `.es`) y `+91 76810 12153`, que es un número de India.
 *   Se publican los reales: el correo `.es` y el teléfono de España. Los tres
 *   bloques y su orden sí son los del marco.
 *
 * La forma —cuántos bloques, en qué orden y con qué medidas— sí es la del
 * marco, al píxel. Ver `docs/figma/contacto-1643/spec.md`.
 */

export type BookingDict = {
  breadcrumbHome: string;
  breadcrumbHere: string;
  eyebrow: string;
  titleA: string;
  titleB: string;
  sub: string;
  perks: string[];
  channels: { label: string; value: string; href: string; kind: "email" | "phone" | "place" }[];
  panelTitle: string;
  panelSub: string;
  pickDate: string;
  slotsTitle: string;
  prevSlots: string;
  nextSlots: string;
  slotsEmpty: string;
  slotsLoading: string;
  slotsError: string;
  infoTitle: string;
  namePh: string;
  phonePh: string;
  emailPh: string;
  planPh: string;
  planNone: string;
  goalsPh: string;
  submit: string;
  sending: string;
  note: string;
  months: string[];
  weekdays: string[];
  prevMonth: string;
  nextMonth: string;
  okTitle: string;
  okText: string;
  okCode: string;
  okChat: string;
  errText: string;
  errNoSlot: string;
  messageInstead: string;
  messageInsteadCta: string;
};

const es: BookingDict = {
  breadcrumbHome: "Inicio",
  breadcrumbHere: "Contacto",
  eyebrow: "Reservar llamada",
  titleA: "Obtén una ",
  titleB: "llamada estratégica",
  sub: "30 minutos. Sin rodeos. Llévate un plan claro para crecer con IA, trabajes con nosotros o no.",
  perks: ["30 minutos de tu tiempo", "Recomendaciones personalizadas", "Sin compromiso"],
  channels: [
    { label: "Correo electrónico", value: "projects@asenix.es", href: "mailto:projects@asenix.es", kind: "email" },
    { label: "Teléfono", value: "+34 624 52 87 21", href: "tel:+34624528721", kind: "phone" },
    { label: "Ubicación", value: "Remoto · todo el mundo", href: "", kind: "place" },
  ],
  panelTitle: "Reserva una llamada con nuestro equipo",
  panelSub: "Rellena este formulario y te confirmaremos tu reserva por correo electrónico.",
  pickDate: "Selecciona una fecha",
  slotsTitle: "Horario disponible",
  prevSlots: "Horas anteriores",
  nextSlots: "Horas siguientes",
  slotsEmpty: "No queda hueco este día. Prueba con otro.",
  slotsLoading: "Buscando huecos…",
  slotsError: "No hemos podido consultar la agenda. Prueba de nuevo en un momento.",
  infoTitle: "Tu información",
  namePh: "Nombre completo",
  phonePh: "Teléfono",
  emailPh: "Correo electrónico",
  planPh: "Plan que te interesa",
  planNone: "Aún no lo sé",
  goalsPh: "Cuéntanos cuáles son tus objetivos",
  submit: "Reservar llamada",
  sending: "Reservando…",
  note: "Sin spam. Respondemos en 24 h laborables",
  months: [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ],
  weekdays: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
  prevMonth: "Mes anterior",
  nextMonth: "Mes siguiente",
  okTitle: "Llamada reservada.",
  okText: "Te llega la confirmación por correo con el enlace de la videollamada.",
  okCode: "Tu código de reserva es",
  okChat: "Abrir el chat",
  errText: "No hemos podido reservar ahora mismo. Escríbenos a",
  errNoSlot: "Ese hueco se acaba de ocupar. Elige otro, por favor.",
  messageInstead: "¿Prefieres escribirnos sin reservar?",
  messageInsteadCta: "Mándanos un mensaje",
};

const en: BookingDict = {
  breadcrumbHome: "Home",
  breadcrumbHere: "Contact",
  eyebrow: "Book a call",
  titleA: "Get a ",
  titleB: "strategy call",
  sub: "30 minutes. No fluff. You leave with a clear plan to grow with AI, whether you work with us or not.",
  perks: ["30 minutes of your time", "Tailored recommendations", "No commitment"],
  channels: [
    { label: "Email", value: "projects@asenix.es", href: "mailto:projects@asenix.es", kind: "email" },
    { label: "Phone", value: "+34 624 52 87 21", href: "tel:+34624528721", kind: "phone" },
    { label: "Location", value: "Remote · worldwide", href: "", kind: "place" },
  ],
  panelTitle: "Book a call with our team",
  panelSub: "Fill in this form and we'll confirm your booking by email.",
  pickDate: "Pick a date",
  slotsTitle: "Available times",
  prevSlots: "Earlier times",
  nextSlots: "Later times",
  slotsEmpty: "Nothing left on this day. Try another one.",
  slotsLoading: "Looking for openings…",
  slotsError: "We couldn't reach the calendar. Try again in a moment.",
  infoTitle: "Your details",
  namePh: "Full name",
  phonePh: "Phone",
  emailPh: "Email",
  planPh: "Plan you're interested in",
  planNone: "Not sure yet",
  goalsPh: "Tell us what you're trying to achieve",
  submit: "Book the call",
  sending: "Booking…",
  note: "No spam. We reply within 1 business day",
  months: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ],
  weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  prevMonth: "Previous month",
  nextMonth: "Next month",
  okTitle: "Call booked.",
  okText: "You'll get an email with the video call link.",
  okCode: "Your booking code is",
  okChat: "Open the chat",
  errText: "We couldn't book right now. Write to us at",
  errNoSlot: "That slot has just been taken. Please pick another one.",
  messageInstead: "Rather write to us without booking?",
  messageInsteadCta: "Send us a message",
};

export const bookingDicts: Record<"es" | "en", BookingDict> = { es, en };
