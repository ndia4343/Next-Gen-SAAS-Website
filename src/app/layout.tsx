import "@/lib/react-19-polyfill";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
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
  metadataBase: new URL("https://neuroflux.ai"),
  title: "NEUROFLUX.AI · 3D SaaS & Agentic AI Engineering Agency",
  description:
    "Awwwards-caliber 3D SaaS architectures, autonomous AI agent swarms, and enterprise data intelligence systems. Headless ecommerce, full-stack MVP launches, and Power BI analytics.",
  keywords: [
    "Agentic AI",
    "Headless Ecommerce",
    "Next.js 15",
    "Three.js Agency",
    "WebGL Web App",
    "Full-Stack Development",
    "Autonomous Agents",
    "Power BI Dashboards",
  ],
  authors: [{ name: "Neuroflux Engineering Team" }],
  openGraph: {
    title: "NEUROFLUX.AI · 3D SaaS & Agentic AI Agency",
    description:
      "Engineering autonomous intelligence and high-velocity software for ambitious founders and enterprises.",
    url: "https://neuroflux.ai",
    siteName: "Neuroflux Systems",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "Neuroflux.ai 3D WebGL Neural Core",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEUROFLUX.AI · 3D SaaS & Agentic AI Agency",
    description:
      "Awwwards-caliber 3D SaaS & AI Engineering Agency web application.",
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
