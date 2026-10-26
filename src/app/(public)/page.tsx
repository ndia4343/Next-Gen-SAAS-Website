import { getWebsiteContent } from "@/lib/content";
import QuoteModalWrapper from "./QuoteModalWrapper";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getWebsiteContent();

  // Structured Data (JSON-LD) for Awwwards-caliber SEO & Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: content.siteMeta.companyName || "NEUROFLUX.AI",
    url: "https://neuroflux.ai",
    logo: "https://neuroflux.ai/logo.png",
    description: content.siteMeta.description,
    sameAs: [
      "https://twitter.com/neuroflux_ai",
      "https://github.com/neuroflux",
      "https://linkedin.com/company/neuroflux-ai",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Engineering Solutions",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Headless Ecommerce Engineering",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Agentic AI Multi-Agent Systems",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Idea to Launch MVP Sprints",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Enterprise Data & Power BI Pipelines",
          },
        },
      ],
    },
  };

  return (
    <main className="relative min-h-screen bg-[#060609] text-white overflow-hidden">
      {/* Structured SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Dynamic Content Sections with Quote Modal & Freya Voice AI */}
      <QuoteModalWrapper content={content} />
    </main>
  );
}
