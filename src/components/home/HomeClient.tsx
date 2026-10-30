'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import SceneCanvasWrapper from '@/components/canvas/SceneCanvasWrapper';
import HeroSection from '@/components/sections/HeroSection';
import AIReceptionistShowcase from '@/components/sections/AIReceptionistShowcase';
import WorkflowPipelineSection from '@/components/sections/WorkflowPipelineSection';
import CoreExpertiseSection from '@/components/sections/CoreExpertiseSection';
import ProjectSupportSection from '@/components/sections/ProjectSupportSection';
import QuoteModal from '@/components/ui/QuoteModal';
import Footer from '@/components/layout/Footer';
import { WebsiteContent, ThemeBrandingConfig } from '@/lib/types';

interface HomeClientProps {
  content: WebsiteContent;
}

export default function HomeClient({ content }: HomeClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Agentic AI');
  const [branding, setBranding] = useState<ThemeBrandingConfig>(content.themeBranding);

  useEffect(() => {
    // 1. Sync from localStorage for immediate reflection on client
    try {
      const saved = localStorage.getItem('zavian_theme_branding');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.logoImageUrl || parsed.logoMode)) {
          setBranding((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch {}

    // 2. Listen to real-time custom events & cross-tab storage changes
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

    // 3. Fetch latest active content from /api/content
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

  const handleOpenModal = (service: string) => {
    setSelectedService(service || 'Discovery Call');
    setModalOpen(true);
  };

  return (
    <main className="relative min-h-screen">
      {/* Root-Level Single 3D Background Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <SceneCanvasWrapper />
      </div>

      <Navbar
        onOpenQuoteModal={handleOpenModal}
        content={content.header}
        themeBranding={branding}
      />
      <HeroSection onOpenQuoteModal={handleOpenModal} content={content.hero} />
      <AIReceptionistShowcase
        onBookCall={() => handleOpenModal('Discovery Call')}
      />
      <WorkflowPipelineSection
        onOpenQuoteModal={handleOpenModal}
      />
      <CoreExpertiseSection onOpenQuoteModal={handleOpenModal} content={content.coreExpertise} />
      <ProjectSupportSection onOpenQuoteModal={handleOpenModal} content={content.projectSupport} />

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
