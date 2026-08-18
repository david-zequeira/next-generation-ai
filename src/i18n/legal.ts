import { COMPANY } from "@/lib/company";
import type { Locale } from "./dictionaries";

/**
 * Textos legales (RGPD + LSSI-CE), bilingües y fieles a lo que el sistema hace
 * de verdad: si el agente deja de usar un proveedor o de tratar un dato, aquí
 * hay que reflejarlo. Una política que no coincide con la realidad es peor que
 * no tenerla.
 *
 * Los datos identificativos salen de `lib/company.ts` (un único sitio que
 * rellenar al clonar esta landing para otro cliente).
 */

export type LegalSection = {
  heading: string;
  /** Párrafos; se renderizan en orden. */
  body?: string[];
  /** Lista de puntos, después de los párrafos. */
  list?: string[];
};

export type LegalDoc = {
  slug: LegalSlug;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export const LEGAL_SLUGS = ["privacidad", "aviso-legal", "cookies"] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

/** Etiquetas de los enlaces del pie, por idioma. */
export const legalLinkLabels: Record<Locale, Record<LegalSlug, string>> = {
  es: {
    privacidad: "Privacidad",
    "aviso-legal": "Aviso legal",
    cookies: "Cookies",
  },
  en: {
    privacidad: "Privacy",
    "aviso-legal": "Legal notice",
    cookies: "Cookies",
  },
};

// Cada línea aparece solo si su dato existe (mismo patrón que registry): la
// sociedad está en constitución y publicar "[COMPLETAR: NIF]" a la vista de
// cualquiera es peor que omitir la línea hasta tener el dato real.
const identification = {
  es: [
    ...(COMPANY.legalName ? [`Titular: ${COMPANY.legalName}`] : []),
    ...(COMPANY.taxId ? [`NIF: ${COMPANY.taxId}`] : []),
    ...(COMPANY.address ? [`Domicilio: ${COMPANY.address}`] : []),
    `Correo electrónico: ${COMPANY.email}`,
    ...(COMPANY.registry ? [`Datos registrales: ${COMPANY.registry}`] : []),
  ],
  en: [
    ...(COMPANY.legalName ? [`Owner: ${COMPANY.legalName}`] : []),
    ...(COMPANY.taxId ? [`Tax ID: ${COMPANY.taxId}`] : []),
    ...(COMPANY.address ? [`Address: ${COMPANY.address}`] : []),
    `Email: ${COMPANY.email}`,
    ...(COMPANY.registry ? [`Registry details: ${COMPANY.registry}`] : []),
  ],
};

const es: Record<LegalSlug, LegalDoc> = {
  privacidad: {
    slug: "privacidad",
    title: "Política de privacidad",
    updated: COMPANY.updated,
    intro:
      "Esta política explica qué datos personales tratamos cuando visitas esta web o hablas con nuestro asistente, para qué los usamos y qué puedes exigirnos en cualquier momento.",
    sections: [
      {
        heading: "1. Quién es el responsable",
        body: [
          "El responsable del tratamiento de tus datos es:",
        ],
        list: identification.es,
      },
      {
        heading: "2. Qué datos tratamos y de dónde salen",
        body: ["Solo tratamos lo que nos das o lo estrictamente necesario para que la web funcione:"],
        list: [
          "Conversaciones con el asistente: el contenido de tus mensajes y las respuestas. Si pides cita, además tu nombre y un contacto (teléfono o email).",
          "Reservas: fecha y hora elegidas, servicio y código de confirmación.",
          "Medición de visitas: un identificador aleatorio de sesión, la página vista, la web de procedencia y los parámetros de campaña (UTM) de la URL. No usamos cookies publicitarias ni perfiles de terceros.",
          "Datos técnicos: dirección IP y hora de las peticiones, tratados para seguridad y para evitar el uso abusivo del servicio.",
        ],
      },
      {
        heading: "3. Para qué los usamos y con qué base legal",
        list: [
          "Atenderte y responder a tus preguntas — ejecución de tu solicitud previa al contrato (art. 6.1.b RGPD).",
          "Gestionar la cita que reserves — ejecución de tu solicitud (art. 6.1.b RGPD).",
          "Medir visitas de forma agregada y proteger el servicio frente a abusos — interés legítimo (art. 6.1.f RGPD).",
          "Contactarte comercialmente si nos lo pides expresamente — tu consentimiento (art. 6.1.a RGPD), revocable cuando quieras.",
        ],
      },
      {
        heading: "4. Con quién los compartimos",
        body: [
          "No vendemos tus datos ni los cedemos a terceros con fines publicitarios. Para prestar el servicio nos apoyamos en proveedores que actúan como encargados del tratamiento:",
        ],
        list: [
          "Proveedor de inteligencia artificial que genera las respuestas del asistente (Mistral AI, empresa europea con servidores en la UE; en algunos despliegues, Anthropic, en EE. UU., con cláusulas contractuales tipo).",
          "Proveedor de alojamiento del asistente y de la base de datos (servidores en la UE cuando el despliegue lo permite).",
          "Google Calendar, si el negocio tiene la agenda conectada, para crear el evento de tu cita.",
          "Alojamiento de esta web estática.",
        ],
      },
      {
        heading: "5. Cuánto tiempo los conservamos",
        list: [
          "Conversaciones y datos de medición: mientras sean útiles para atenderte y mejorar el servicio, y como máximo 24 meses.",
          "Reservas y datos de facturación asociados: durante los plazos legales aplicables (hasta 6 años en materia mercantil y fiscal).",
          "Registros técnicos de seguridad: un máximo de 12 meses.",
        ],
      },
      {
        heading: "6. Tus derechos",
        body: [
          `Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad escribiendo a ${COMPANY.email}. Te responderemos en el plazo de un mes.`,
          "Si crees que no hemos atendido tu solicitud correctamente, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).",
        ],
      },
      {
        heading: "7. Decisiones automatizadas",
        body: [
          "El asistente responde de forma automática usando inteligencia artificial, pero no toma decisiones con efectos jurídicos sobre ti. Cuando algo se sale de su ámbito, la conversación pasa a una persona del equipo. Puedes pedir hablar con una persona en cualquier momento.",
        ],
      },
      {
        heading: "8. Menores de edad",
        body: [
          "Este servicio está dirigido a personas mayores de 18 años. No recogemos datos de menores de forma consciente; si detectamos alguno, lo eliminamos.",
        ],
      },
      {
        heading: "9. Seguridad",
        body: [
          "Aplicamos medidas técnicas y organizativas razonables: cifrado en tránsito, acceso restringido por credenciales al panel de gestión y límites de uso para evitar accesos abusivos. Ningún sistema es infalible, pero notificaremos cualquier brecha que te afecte conforme al RGPD.",
        ],
      },
      {
        heading: "10. Cambios",
        body: [
          `Si cambiamos esta política, publicaremos la versión actualizada en esta misma página. Última actualización: ${COMPANY.updated}.`,
        ],
      },
    ],
  },

  "aviso-legal": {
    slug: "aviso-legal",
    title: "Aviso legal",
    updated: COMPANY.updated,
    intro:
      "Datos identificativos del titular de este sitio web y condiciones de uso, conforme a la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).",
    sections: [
      {
        heading: "1. Datos identificativos",
        list: [...identification.es, `Sitio web: ${COMPANY.site}`],
      },
      {
        heading: "2. Objeto",
        body: [
          "Este sitio tiene por objeto presentar los servicios de consultoría, desarrollo y automatización con inteligencia artificial del titular, y facilitar el contacto y la reserva de citas. El acceso es gratuito y no requiere registro.",
        ],
      },
      {
        heading: "3. Condiciones de uso",
        body: [
          "Al usar este sitio te comprometes a hacerlo conforme a la ley y a la buena fe, y a no emplearlo para fines ilícitos, ni a intentar dañar, sobrecargar o acceder sin autorización a sus sistemas. El asistente automatizado está para atender consultas legítimas sobre nuestros servicios.",
        ],
      },
      {
        heading: "4. Propiedad intelectual e industrial",
        body: [
          "Los textos, el diseño, el código, los gráficos y las marcas de este sitio pertenecen a su titular o se usan con autorización. No se permite su reproducción, distribución ni transformación sin consentimiento expreso y por escrito.",
        ],
      },
      {
        heading: "5. Responsabilidad",
        body: [
          "El titular procura que la información publicada sea correcta y esté actualizada, pero no garantiza la ausencia de errores. Las respuestas del asistente son informativas y no constituyen asesoramiento profesional vinculante: los precios, plazos y condiciones definitivos se confirman siempre por escrito.",
          "El titular no se responsabiliza de interrupciones del servicio ajenas a su control ni del contenido de sitios de terceros enlazados desde aquí.",
        ],
      },
      {
        heading: "6. Legislación aplicable y jurisdicción",
        body: [
          "Estas condiciones se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales del domicilio del titular, salvo que la normativa de consumo establezca otro fuero.",
        ],
      },
    ],
  },

  cookies: {
    slug: "cookies",
    title: "Política de cookies",
    updated: COMPANY.updated,
    intro:
      "Resumen corto: esta web no usa cookies publicitarias ni de terceros, y por eso no verás un banner pidiéndote permiso.",
    sections: [
      {
        heading: "1. Qué usamos exactamente",
        body: [
          "No instalamos cookies de seguimiento ni de publicidad. Para funcionar, la web guarda dos datos en el almacenamiento local de tu navegador, que no viajan a terceros ni permiten identificarte fuera de este sitio:",
        ],
        list: [
          "Un identificador aleatorio de sesión (sessionStorage): permite que el asistente recuerde tu conversación mientras la pestaña está abierta. Se borra al cerrarla.",
          "Tu idioma preferido (localStorage): para no volver a preguntártelo en la siguiente visita.",
        ],
      },
      {
        heading: "2. Medición de visitas",
        body: [
          "Contamos visitas de forma agregada (página vista, procedencia y parámetros de campaña de la URL) usando el identificador aleatorio anterior. No cruzamos esa información con otras webs ni construimos perfiles publicitarios. Al tratarse de una medición propia y estrictamente necesaria para conocer el rendimiento del sitio, no requiere consentimiento previo.",
        ],
      },
      {
        heading: "3. Cómo eliminarlos",
        body: [
          "Puedes borrar ambos datos en cualquier momento desde las opciones de tu navegador (borrar datos de navegación del sitio) o navegando en modo privado. La web seguirá funcionando: solo perderás el hilo del chat y la preferencia de idioma.",
        ],
      },
      {
        heading: "4. Cambios",
        body: [
          `Si en el futuro incorporamos cookies analíticas o de terceros, actualizaremos esta página y pediremos tu consentimiento antes de instalarlas. Última actualización: ${COMPANY.updated}.`,
        ],
      },
    ],
  },
};

const en: Record<LegalSlug, LegalDoc> = {
  privacidad: {
    slug: "privacidad",
    title: "Privacy policy",
    updated: COMPANY.updated,
    intro:
      "This policy explains what personal data we process when you visit this site or talk to our assistant, what we use it for, and what you can require from us at any time.",
    sections: [
      {
        heading: "1. Who is the controller",
        body: ["The controller of your data is:"],
        list: identification.en,
      },
      {
        heading: "2. What data we process",
        body: ["We only process what you give us or what the site strictly needs to work:"],
        list: [
          "Conversations with the assistant: the content of your messages and our replies. If you book a call, also your name and a contact (phone or email).",
          "Bookings: the date and time you chose, the service and a confirmation code.",
          "Visit measurement: a random session identifier, the page viewed, the referring site and the campaign parameters (UTM) in the URL. No advertising cookies, no third-party profiling.",
          "Technical data: IP address and request timestamps, processed for security and to prevent abuse of the service.",
        ],
      },
      {
        heading: "3. Why we use it and on what legal basis",
        list: [
          "To answer your questions — steps taken at your request prior to a contract (Art. 6(1)(b) GDPR).",
          "To manage the appointment you book — steps taken at your request (Art. 6(1)(b) GDPR).",
          "To measure visits in aggregate and protect the service from abuse — legitimate interest (Art. 6(1)(f) GDPR).",
          "To contact you commercially if you explicitly ask us to — your consent (Art. 6(1)(a) GDPR), withdrawable at any time.",
        ],
      },
      {
        heading: "4. Who we share it with",
        body: [
          "We do not sell your data or share it for advertising. To run the service we rely on providers acting as processors:",
        ],
        list: [
          "The AI provider generating the assistant's replies (Mistral AI, a European company with EU servers; in some deployments, Anthropic, in the US, under standard contractual clauses).",
          "Hosting for the assistant and its database (EU servers where the deployment allows it).",
          "Google Calendar, when the business has its calendar connected, to create your appointment.",
          "Static hosting for this website.",
        ],
      },
      {
        heading: "5. How long we keep it",
        list: [
          "Conversations and measurement data: as long as useful to serve you and improve the service, and at most 24 months.",
          "Bookings and related billing records: for the applicable legal periods (up to 6 years under Spanish commercial and tax law).",
          "Technical security logs: 12 months maximum.",
        ],
      },
      {
        heading: "6. Your rights",
        body: [
          `You can exercise your rights of access, rectification, erasure, objection, restriction and portability at any time by writing to ${COMPANY.email}. We will reply within one month.`,
          "If you believe your request was not handled properly, you may lodge a complaint with the Spanish Data Protection Agency (www.aepd.es).",
        ],
      },
      {
        heading: "7. Automated decisions",
        body: [
          "The assistant replies automatically using artificial intelligence, but it makes no decisions with legal effects on you. Anything outside its scope is handed to a human. You can ask to speak to a person at any time.",
        ],
      },
      {
        heading: "8. Minors",
        body: [
          "This service is intended for people over 18. We do not knowingly collect data from minors; if we detect any, we delete it.",
        ],
      },
      {
        heading: "9. Security",
        body: [
          "We apply reasonable technical and organisational measures: encryption in transit, credential-restricted access to the management panel, and usage limits to prevent abusive access. No system is infallible, but we will notify any breach affecting you as required by the GDPR.",
        ],
      },
      {
        heading: "10. Changes",
        body: [
          `If we change this policy we will publish the updated version on this page. Last updated: ${COMPANY.updated}.`,
        ],
      },
    ],
  },

  "aviso-legal": {
    slug: "aviso-legal",
    title: "Legal notice",
    updated: COMPANY.updated,
    intro:
      "Identifying details of the owner of this website and terms of use, under Spanish Law 34/2002 on Information Society Services and Electronic Commerce (LSSI-CE).",
    sections: [
      {
        heading: "1. Identifying details",
        list: [...identification.en, `Website: ${COMPANY.site}`],
      },
      {
        heading: "2. Purpose",
        body: [
          "This site presents the owner's AI consulting, development and automation services, and makes it easy to get in touch and book a call. Access is free and requires no registration.",
        ],
      },
      {
        heading: "3. Terms of use",
        body: [
          "By using this site you agree to do so lawfully and in good faith, not to use it for unlawful purposes, and not to damage, overload or gain unauthorised access to its systems. The automated assistant is here to handle genuine enquiries about our services.",
        ],
      },
      {
        heading: "4. Intellectual and industrial property",
        body: [
          "The texts, design, code, graphics and trademarks on this site belong to its owner or are used with permission. Reproduction, distribution or modification without express written consent is not permitted.",
        ],
      },
      {
        heading: "5. Liability",
        body: [
          "The owner aims to keep the published information accurate and current, but does not guarantee it is free of errors. The assistant's replies are informative and do not constitute binding professional advice: final prices, timelines and terms are always confirmed in writing.",
          "The owner is not liable for service interruptions beyond its control, nor for the content of third-party sites linked from here.",
        ],
      },
      {
        heading: "6. Governing law and jurisdiction",
        body: [
          "These terms are governed by Spanish law. For any dispute, the parties submit to the courts of the owner's domicile, unless consumer law provides otherwise.",
        ],
      },
    ],
  },

  cookies: {
    slug: "cookies",
    title: "Cookie policy",
    updated: COMPANY.updated,
    intro:
      "Short version: this site uses no advertising or third-party cookies, which is why you won't see a consent banner.",
    sections: [
      {
        heading: "1. What we actually use",
        body: [
          "We install no tracking or advertising cookies. To work, the site stores two items in your browser's local storage. They never travel to third parties and cannot identify you outside this site:",
        ],
        list: [
          "A random session identifier (sessionStorage): lets the assistant remember your conversation while the tab is open. It is deleted when you close it.",
          "Your preferred language (localStorage): so we don't have to ask again on your next visit.",
        ],
      },
      {
        heading: "2. Visit measurement",
        body: [
          "We count visits in aggregate (page viewed, referrer and campaign parameters in the URL) using the random identifier above. We do not cross-reference it with other sites or build advertising profiles. As first-party measurement strictly necessary to understand how the site performs, it requires no prior consent.",
        ],
      },
      {
        heading: "3. How to delete them",
        body: [
          "You can clear both at any time from your browser settings (clear site browsing data) or by browsing privately. The site will keep working: you will only lose the chat thread and the language preference.",
        ],
      },
      {
        heading: "4. Changes",
        body: [
          `If we ever add analytics or third-party cookies, we will update this page and ask for your consent before installing them. Last updated: ${COMPANY.updated}.`,
        ],
      },
    ],
  },
};

export const legalDocs: Record<Locale, Record<LegalSlug, LegalDoc>> = { es, en };
