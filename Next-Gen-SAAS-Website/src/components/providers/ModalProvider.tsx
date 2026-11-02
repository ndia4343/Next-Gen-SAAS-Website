"use client";

import React, { createContext, useContext, useState } from "react";

export type ServiceTier =
  | "Headless Ecommerce"
  | "Agentic AI"
  | "Idea to Launch"
  | "01 / Software"
  | "02 / Data"
  | "03 / AI"
  | "04 / Media"
  | "General Discovery";

interface ModalContextType {
  isQuoteModalOpen: boolean;
  selectedService: ServiceTier;
  openQuoteModal: (service?: ServiceTier) => void;
  closeQuoteModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  isQuoteModalOpen: false,
  selectedService: "General Discovery",
  openQuoteModal: () => {},
  closeQuoteModal: () => {},
});

export const useModal = () => useContext(ModalContext);

export default function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [service, setService] = useState<ServiceTier>("General Discovery");

  const openQuoteModal = (targetService: ServiceTier = "General Discovery") => {
    setService(targetService);
    setIsOpen(true);
  };

  const closeQuoteModal = () => {
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        isQuoteModalOpen: isOpen,
        selectedService: service,
        openQuoteModal,
        closeQuoteModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
