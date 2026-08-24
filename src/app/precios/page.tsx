import type { Metadata } from "next";
import PricingPage from "@/components/pricing/PricingPage";
import { pricingDicts } from "@/i18n/pricing";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Planes y precios · Plans & pricing — Asenix",
  description:
    "Arranque, Core y Nexus: un asistente que atiende en tu web y tu WhatsApp, responde con la información real de tu negocio y cierra la cita en tu agenda. 349 €/mes, funcionando en 7 días.",
  robots: { index: true, follow: true },
};

const t = pricingDicts.es;

/** "2.900 €" | "+ 349 €/mes" | "desde 18.000 €" → 2900 | 349 | 18000 */
const eur = (s: string): number => Number(s.replace(/[^\d]/g, ""));

/** Los textos admiten **negrita** de la UI; el structured data va limpio. */
const plain = (s: string): string => s.replace(/\*\*/g, "");

// Derivado del MISMO diccionario que pinta la página: si cambia la tarifa en
// pricing.ts, el structured data la sigue solo — sin un cuarto sitio que
// sincronizar a mano.
const offersJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Asenix — Web premium y agentes de IA",
  provider: { "@type": "ProfessionalService", name: "Asenix", url: SITE_URL },
  areaServed: { "@type": "Country", name: "España" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Planes Asenix 2026",
    itemListElement: t.plans.map((plan) => ({
      "@type": "Offer",
      name: `Plan ${plan.name}`,
      description: plain(plan.who),
      price: eur(plan.setup),
      priceCurrency: "EUR",
      url: `${SITE_URL}/precios`,
      priceSpecification: [
        {
          "@type": "PriceSpecification",
          name: "Puesta en marcha",
          price: eur(plan.setup),
          priceCurrency: "EUR",
        },
        {
          "@type": "UnitPriceSpecification",
          name: "Cuota mensual",
          price: eur(plan.mrr),
          priceCurrency: "EUR",
          unitText: "mes",
        },
      ],
    })),
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: t.faq.items.map((f) => ({
    "@type": "Question",
    name: plain(f.q),
    acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PricingPage />
    </>
  );
}
