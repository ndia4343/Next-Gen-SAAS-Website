'use client';

import React from 'react';
import ZavianLogo from '@/components/ui/ZavianLogo';
import { Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenQuoteModal?: (service: string) => void;
}

export default function Navbar({ onOpenQuoteModal }: NavbarProps) {
  const handleOpen = () => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal('Discovery Call');
    }
  };

  return (
    <header className="fixed top-5 inset-x-0 z-40 max-w-7xl mx-auto px-6">
      <nav className="glass-panel rounded-full px-6 py-3.5 flex items-center justify-between border border-white/10 shadow-2xl">
        <a href="#hero" className="flex items-center">
          <ZavianLogo showTagline={true} />
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#hero" className="hover:text-white transition-colors">
            Overview
          </a>
          <a href="#core-expertise" className="hover:text-white transition-colors">
            Core Expertise
          </a>
          <a href="#project-support" className="hover:text-white transition-colors">
            Project Support
          </a>
        </div>

        <button
          onClick={handleOpen}
          className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-medium text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Book Discovery</span>
        </button>
      </nav>
    </header>
  );
}
