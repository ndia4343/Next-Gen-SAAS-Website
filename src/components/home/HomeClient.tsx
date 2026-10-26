'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import CoreExpertiseSection from '@/components/sections/CoreExpertiseSection';
import ProjectSupportSection from '@/components/sections/ProjectSupportSection';
import VoiceAgentWidget from '@/components/widgets/VoiceAgentWidget';
import QuoteModal from '@/components/ui/QuoteModal';
import Footer from '@/components/layout/Footer';
import { WebsiteContent } from '@/lib/types';

interface HomeClientProps {
  content: WebsiteContent;
}

export default function HomeClient({ content }: HomeClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Agentic AI');

  const handleOpenModal = (service: string) => {
    setSelectedService(service || 'Discovery Call');
    setModalOpen(true);
  };

  return (
    <main className="relative min-h-screen">
      <Navbar
        onOpenQuoteModal={handleOpenModal}
        content={content.header}
        themeBranding={content.themeBranding}
      />
      <HeroSection onOpenQuoteModal={handleOpenModal} content={content.hero} />
      <CoreExpertiseSection onOpenQuoteModal={handleOpenModal} content={content.coreExpertise} />
      <ProjectSupportSection onOpenQuoteModal={handleOpenModal} content={content.projectSupport} />
      <VoiceAgentWidget content={content.freyaVoiceAgent} />

      <Footer
        onOpenQuoteModal={handleOpenModal}
        content={content.footer}
        themeBranding={content.themeBranding}
      />

      <QuoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedService={selectedService}
      />
    </main>
  );
}
