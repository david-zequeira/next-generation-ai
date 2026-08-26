import type { Metadata } from "next";
import CalculatorPage from "@/components/calculator/CalculatorPage";
import { ASSUMPTIONS, calcDicts } from "@/i18n/calculadora";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Calculadora de retorno · ROI calculator — Asenix",
  description:
    "Cuatro preguntas sobre tu negocio y verás cuánto se te escapa cada mes por consultas sin responder y plantones, cuánto recuperaría el asistente y en cuántos meses se paga solo. Sin registro.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/calculadora` },
};

const t = calcDicts.es;

// El FAQ declarado es literalmente lo que la página responde en pantalla: las
// tres hipótesis y el aviso de que es una estimación. Si algún día se suavizan
// ahí, aquí queda la copia que Google ya indexó — por eso salen del mismo sitio.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿De dónde salen los números de la calculadora?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `${t.assumptions.body.replace(/\*\*/g, "")} ${t.assumptions.items
          .map((i) => i.replace(/\*\*/g, ""))
          .join(" ")}`,
      },
    },
    {
      "@type": "Question",
      name: "¿El resultado es una garantía?",
      acceptedAnswer: { "@type": "Answer", text: t.assumptions.warning },
    },
    {
      "@type": "Question",
      name: "¿Qué porcentaje de recuperación se aplica?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Se aplica un ${ASSUMPTIONS.recovery * 100} % de recuperación sobre lo que hoy se pierde y una reducción del ${
          ASSUMPTIONS.noShowCut * 100
        } % de los plantones. Son fijas y conservadoras: el visitante no puede subirlas.`,
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <CalculatorPage />
    </>
  );
}
