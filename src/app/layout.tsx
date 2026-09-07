import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Analytics from "@/components/ui/Analytics";
import CursorGlow from "@/components/ui/CursorGlow";
import { LocaleProvider } from "@/i18n/LocaleContext";
import { SITE_URL } from "@/lib/site";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Asenix — Webs premium y agentes de IA para tu negocio",
  description:
    "Marca, web premium y agentes de IA que atienden, reservan citas y capturan clientes 24/7. Diseño, software a medida y automatización para negocios en España.",
  // Canonical relativo: Next lo resuelve por ruta contra metadataBase, así cada
  // página declara la suya y la copia de github.io deja de competir con asenix.es.
  alternates: { canonical: "./" },
  openGraph: {
    title: "Asenix — Webs premium y agentes de IA para tu negocio",
    description:
      "Marca, web premium y agentes de IA que atienden, reservan y capturan clientes 24/7.",
    type: "website",
    locale: "es_ES",
    url: "./",
    siteName: "Asenix",
    // La tarjeta se dibuja en `opengraph-image.tsx` y el postbuild la deja en
    // /og.png — con extensión, para que Pages la sirva como imagen.
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Asenix — Digital Evolution" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Asenix",
    description: "Webs premium y agentes de IA que atienden y reservan por ti.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      {/* suppressHydrationWarning: extensiones como Bitdefender o ColorZilla
          añaden atributos al <body> antes de que React hidrate; no es un fallo
          del sitio y no debe ensuciar la consola de quien las tenga. */}
      <body
        suppressHydrationWarning
        className={`${montserrat.variable} noise bg-void font-sans text-frost antialiased`}
      >
        <LocaleProvider>
          <Analytics />
          <SmoothScroll>
            <CursorGlow />
            {children}
          </SmoothScroll>
        </LocaleProvider>
      </body>
    </html>
  );
}
