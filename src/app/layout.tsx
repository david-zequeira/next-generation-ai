import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Analytics from "@/components/ui/Analytics";
import CursorGlow from "@/components/ui/CursorGlow";
import { LocaleProvider } from "@/i18n/LocaleContext";
import { SITE_URL } from "@/lib/site";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "NEXT GENERATION AI — Building the Future of Business",
  description:
    "Next-generation Artificial Intelligence and Automation for businesses of every size. AI agents, process automation, custom AI software and enterprise integrations.",
  keywords: [
    "AI agency",
    "AI automation",
    "AI agents",
    "business process automation",
    "custom AI software",
    "AI consulting",
  ],
  openGraph: {
    title: "NEXT GENERATION AI — Building the Future of Business",
    description:
      "Every company should operate like a billion-dollar company. We make it real with next-generation AI and automation.",
    type: "website",
    locale: "en_US",
    siteName: "NEXT GENERATION AI",
    // La tarjeta se dibuja en `opengraph-image.tsx` y el postbuild la deja en
    // /og.png — con extensión, para que Pages la sirva como imagen.
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Next Generation AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXT GENERATION AI",
    description: "Building the Future of Business.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} noise bg-void font-sans text-frost antialiased`}
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
