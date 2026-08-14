import type { Metadata } from "next";
import PricingPage from "@/components/pricing/PricingPage";

export const metadata: Metadata = {
  title: "Planes y precios · Plans & pricing — Asenix",
  description:
    "Signal, Core, Orbit y Nexus: marca, web premium y agentes de IA que atienden, reservan y no se van a dormir. Desde 149 €/mes, con opción de 0 € de entrada.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PricingPage />;
}
