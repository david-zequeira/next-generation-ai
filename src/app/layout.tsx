import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import CursorGlow from "@/components/ui/CursorGlow";

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
  metadataBase: new URL("https://david-zequeira.github.io/next-generation-ai"),
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
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXT GENERATION AI",
    description: "Building the Future of Business.",
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
        <SmoothScroll>
          <CursorGlow />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
