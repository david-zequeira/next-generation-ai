import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Política de privacidad · Privacy policy — Next Generation AI",
  description:
    "Qué datos personales tratamos, para qué, con quién los compartimos y cómo ejercer tus derechos (RGPD).",
  robots: { index: true, follow: true },
};

export default function Page() {
  return <LegalPage slug="privacidad" />;
}
