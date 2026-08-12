import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Política de cookies · Cookie policy — Asenix",
  description:
    "Esta web no usa cookies publicitarias ni de terceros. Qué guarda tu navegador y cómo borrarlo.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return <LegalPage slug="cookies" />;
}
