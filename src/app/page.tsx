'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import CoreExpertiseSection from '@/components/sections/CoreExpertiseSection';
import ProjectSupportSection from '@/components/sections/ProjectSupportSection';
import VoiceAgentWidget from '@/components/widgets/VoiceAgentWidget';
import QuoteModal from '@/components/ui/QuoteModal';

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Agentic AI');

  const handleOpenModal = (service: string) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  return (
    <main className="relative min-h-screen">
      <Navbar onOpenQuoteModal={handleOpenModal} />
      <HeroSection onOpenQuoteModal={handleOpenModal} />
      <CoreExpertiseSection onOpenQuoteModal={handleOpenModal} />
      <ProjectSupportSection onOpenQuoteModal={handleOpenModal} />
      <VoiceAgentWidget />

      <QuoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedService={selectedService}
      />
    </main>
  );
}
