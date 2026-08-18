import type { Metadata } from "next";
import ContactPage from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contacto · Contact — Asenix",
  description:
    "Cuéntanos sobre tu negocio y te respondemos en menos de 24 horas laborables. Marca, web premium y agentes de IA que atienden y reservan por ti.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return <ContactPage />;
}
