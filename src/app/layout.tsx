import "@/lib/react-19-polyfill";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#060609",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://zavianlabs.ai"),
  title: "ZAVIAN LABS · AI Systems & High-Compute WebGL Engineering",
  description:
    "Awwwards-caliber 3D architectures, autonomous AI voice & WhatsApp systems, and enterprise intelligence engineering.",
  keywords: [
    "ZAVIAN LABS",
    "Agentic AI",
    "Autonomous Systems",
    "Next.js 15",
    "Three.js Agency",
    "WebGL Web App",
    "Full-Stack Development",
    "AI Voice Systems",
    "Enterprise Intelligence",
  ],
  authors: [{ name: "Zavian Labs Engineering Team" }],
  openGraph: {
    title: "ZAVIAN LABS · AI Systems & High-Compute WebGL Engineering",
    description:
      "Engineering autonomous intelligence and high-performance 3D architectures for ambitious founders and enterprises.",
    url: "https://zavianlabs.ai",
    siteName: "ZAVIAN LABS",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "ZAVIAN LABS 3D WebGL Neural Core",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZAVIAN LABS · AI Systems & High-Compute WebGL Engineering",
    description:
      "High-performance 3D architectures and autonomous AI systems by ZAVIAN LABS.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-[#060609] text-zinc-100 min-h-screen selection:bg-red-600 selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
