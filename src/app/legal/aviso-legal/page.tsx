import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Aviso legal · Legal notice — Asenix",
  description:
    "Datos identificativos del titular del sitio y condiciones de uso (LSSI-CE).",
  robots: { index: true, follow: true },
};

export default function Page() {
  return <LegalPage slug="aviso-legal" />;
}
