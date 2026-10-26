"use client";

import React, { useState } from "react";
import HeroSection from "@/components/sections/HeroSection";
import CoreExpertiseSection from "@/components/sections/CoreExpertiseSection";
import ProjectSupportSection from "@/components/sections/ProjectSupportSection";
import FooterSection from "@/components/sections/FooterSection";
import VoiceAgentWidget from "@/components/widgets/VoiceAgentWidget";
import QuoteModal from "@/components/ui/QuoteModal";
import { WebsiteContent } from "@/lib/types";
import { ServiceTier, useModal } from "@/components/providers/ModalProvider";

interface QuoteModalWrapperProps {
  content: WebsiteContent;
}

export default function QuoteModalWrapper({ content }: QuoteModalWrapperProps) {
  const { isQuoteModalOpen, closeQuoteModal, selectedService } = useModal();
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const [localService, setLocalService] = useState<ServiceTier>("General Discovery");

  const effectiveIsOpen = isQuoteModalOpen || localIsOpen;
  const effectiveService = selectedService || localService;

  const handleClose = () => {
    setLocalIsOpen(false);
    closeQuoteModal();
  };

  return (
    <div className="relative z-10 flex flex-col w-full">
      <HeroSection data={content.hero} />
      <CoreExpertiseSection data={content.coreExpertise} />
      <ProjectSupportSection data={content.projectSupport} />
      <FooterSection />
      <VoiceAgentWidget config={content.freyaVoiceAgent} />
      <QuoteModal
        isOpen={effectiveIsOpen}
        onClose={handleClose}
        selectedService={effectiveService}
      />
    </div>
  );
}
