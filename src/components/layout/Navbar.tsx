'use client';

import React from 'react';
import ZavianLogo from '@/components/ui/ZavianLogo';
import { Sparkles } from 'lucide-react';
import { HeaderData, ThemeBrandingConfig } from '@/lib/types';

interface NavbarProps {
  onOpenQuoteModal?: (service: string) => void;
  content?: HeaderData;
  themeBranding?: ThemeBrandingConfig;
}

export default function Navbar({ onOpenQuoteModal, content, themeBranding }: NavbarProps) {
  const handleOpen = () => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal(content?.ctaActionId || 'Discovery Call');
    }
  };

  const navLinks = content?.navItems?.filter((i) => i.active !== false) || [
    { id: '1', label: 'Overview', href: '#hero', target: '_self' },
    { id: '2', label: 'Core Expertise', href: '#core-expertise', target: '_self' },
    { id: '3', label: 'Project Support', href: '#project-support', target: '_self' },
  ];

  return (
    <header className="fixed top-5 inset-x-0 z-40 max-w-7xl mx-auto px-6">
      <nav className="glass-panel rounded-full px-6 py-3.5 flex items-center justify-between border border-white/10 shadow-2xl">
        <a href="#hero" className="flex items-center">
          <ZavianLogo
            showTagline={true}
            wordmarkWhite={themeBranding?.wordmark1 || content?.brandWordmark1}
            wordmarkCrimson={themeBranding?.wordmark2 || content?.brandWordmark2}
            wordmark1Color={themeBranding?.wordmark1Color}
            wordmark2Color={themeBranding?.wordmark2Color}
            tagline={themeBranding?.tagline || content?.tagline}
            logoMode={themeBranding?.logoMode}
            logoImageUrl={themeBranding?.logoImageUrl}
            logoSvgContent={themeBranding?.logoSvgContent}
          />
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          {navLinks.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target={item.target || '_self'}
              className="hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          onClick={handleOpen}
          className="px-5 py-2.5 rounded-full bg-[var(--theme-primary,#dc2626)] hover:brightness-110 text-white font-medium text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-[var(--theme-glow,rgba(220,38,38,0.3))] hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{content?.ctaText || 'Book Discovery'}</span>
        </button>
      </nav>
    </header>
  );
}
