import React from "react";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import ModalProvider from "@/components/providers/ModalProvider";
import CanvasWrapper from "@/components/canvas/CanvasWrapper";
import Navbar from "@/components/ui/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <ModalProvider>
        {/* Persistent Non-Blocking Fixed WebGL Background Canvas */}
        <CanvasWrapper />
        <Navbar />
        {children}
      </ModalProvider>
    </SmoothScrollProvider>
  );
}
