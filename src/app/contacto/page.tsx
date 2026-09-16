import type { Metadata } from "next";
import BookingPage from "@/components/contact/BookingPage";

export const metadata: Metadata = {
  title: "Reservar llamada · Book a call — Asenix",
  description:
    "Reserva una llamada estratégica de 30 minutos. Sin rodeos y sin compromiso: te llevas un plan claro para crecer con IA, trabajes con nosotros o no.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return <BookingPage />;
}
