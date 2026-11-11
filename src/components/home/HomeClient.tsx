'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import VoiceSimulationSection from '@/components/sections/VoiceSimulationSection';
import ConnectedHubSection from '@/components/sections/ConnectedHubSection';
import CommandCenterSection from '@/components/sections/CommandCenterSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import PricingSection from '@/components/sections/PricingSection';
import FaqSection from '@/components/sections/FaqSection';
import FounderSection from '@/components/sections/FounderSection';
import FinalCtaSection from '@/components/sections/FinalCtaSection';
import QuoteModal from '@/components/ui/QuoteModal';
import Footer from '@/components/layout/Footer';
import { WebsiteContent, ThemeBrandingConfig } from '@/lib/types';

interface HomeClientProps {
  content: WebsiteContent;
}

export default function HomeClient({ content }: HomeClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [branding, setBranding] = useState<ThemeBrandingConfig>(content.themeBranding);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('zavian_theme_branding');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.logoImageUrl || parsed.logoMode)) {
          setBranding((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch {}

    const handleBrandingUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeBrandingConfig>;
      if (customEvent.detail) {
        setBranding(customEvent.detail);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'zavian_theme_branding' && e.newValue) {
        try {
          setBranding(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener('zavian_branding_updated', handleBrandingUpdate);
    window.addEventListener('storage', handleStorage);

    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.content?.themeBranding) {
          setBranding((prev) => ({ ...prev, ...data.content.themeBranding }));
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('zavian_branding_updated', handleBrandingUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleOpenModal = (service?: string) => {
    setSelectedService(service || '');
    setModalOpen(true);
  };

  return (
    <main className="relative bg-[#FFFFFF] text-[#0A0A0A] min-h-screen overflow-x-hidden">
      <Navbar
        onOpenQuoteModal={handleOpenModal}
        content={content.header}
        themeBranding={branding}
      />

      {/* Permanently Dark Obsidian Hero + Marquee Strip */}
      <HeroSection onOpenQuoteModal={handleOpenModal} content={content.hero} />

      {/* Pure Architectural White Canvas (#FFFFFF / #FAFAFA) */}
      <VoiceSimulationSection />
      <ConnectedHubSection />
      <CommandCenterSection />
      <HowItWorksSection />
      <PricingSection />
      <FaqSection />
      <FounderSection />
      <FinalCtaSection />

      <Footer
        onOpenQuoteModal={handleOpenModal}
        content={content.footer}
        themeBranding={branding}
      />

      <QuoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedService={selectedService}
      />
    </main>
  );
}
