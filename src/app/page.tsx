import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ui/ChatWidget";
import VoiceWidget from "@/components/ui/VoiceWidget";
import SectionRail from "@/components/ui/SectionRail";
import Bridge from "@/components/ui/Bridge";
import Hero from "@/components/sections/Hero";
import Evolution from "@/components/sections/Evolution";
import Services from "@/components/sections/Services";
import Ecosystem from "@/components/sections/Ecosystem";
import CaseStudies from "@/components/sections/CaseStudies";
import Transformation from "@/components/sections/Transformation";
import Process from "@/components/sections/Process";
import Technology from "@/components/sections/Technology";
import FinalCTA from "@/components/sections/FinalCTA";

import { SITE_URL } from "@/lib/site";

// ProfessionalService (no un Organization pelado): dice a Google QUÉ vendemos,
// DÓNDE y en qué idioma — la señal geográfica que le faltaba a un dominio .es
// cuyo HTML estaba congelado en inglés.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Asenix",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-lockup.png`,
  image: `${SITE_URL}/og.png`,
  slogan: "Digital Evolution.",
  description:
    "Marca, web premium y agentes de IA que atienden, reservan citas y capturan clientes 24/7 para negocios en España.",
  email: "projects@asenix.es",
  areaServed: { "@type": "Country", name: "España" },
  inLanguage: ["es", "en"],
  priceRange: "€€",
  knowsAbout: [
    "Agentes de IA",
    "Automatización de procesos",
    "Diseño web premium",
    "Sistemas de reservas",
    "Agentes de WhatsApp",
    "Software a medida",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <SectionRail />
      <main>
        <Hero />
        <Evolution />
        <Bridge id="era" />
        <Services />
        <Ecosystem />
        <Bridge id="proof" />
        <CaseStudies />
        <Transformation />
        <Bridge id="leap" />
        <Process />
        <Technology />
        {/* Testimonials: retirado hasta tener testimonios reales (ver dictionaries.ts) */}
        <FinalCTA />
      </main>
      <Footer />
      <ChatWidget />
      <VoiceWidget />
    </>
  );
}
