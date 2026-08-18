import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ui/ChatWidget";
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Asenix",
  slogan: "Digital Evolution.",
  description:
    "Next-generation Artificial Intelligence and Automation for businesses of every size.",
  email: "projects@asenix.es",
  knowsAbout: [
    "AI Automation",
    "AI Agents",
    "Business Process Automation",
    "Custom AI Software",
    "AI Consulting",
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
    </>
  );
}
