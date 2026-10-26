"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import { useModal } from "../providers/ModalProvider";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { openQuoteModal } = useModal();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 sm:px-6 lg:px-8",
        scrolled
          ? "py-3 bg-[#060609]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl"
          : "py-6 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 shadow-lg shadow-red-600/30 border border-red-500/30 group-hover:scale-105 transition-transform">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            >
              <path d="M4 4h16L7 20h13" />
              <path d="M9 12h6" strokeOpacity="0.6" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white leading-none">
              ZAVIAN <span className="text-red-500">LABS</span>
            </span>
            <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 uppercase mt-0.5">
              AI SYSTEMS &amp; ENGINEERING
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-zinc-400">
          <a
            href="#core-expertise"
            className="hover:text-white transition-colors"
          >
            01 / CORE EXPERTISE
          </a>
          <a
            href="#project-tiers"
            className="hover:text-white transition-colors"
          >
            02 / PROJECT TIERS
          </a>
          <a
            href="#architecture"
            className="hover:text-white transition-colors"
          >
            03 / ARCHITECTURE
          </a>
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={() => openQuoteModal("General Discovery")}
            className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 active:scale-95 transition-all duration-200 shadow-md shadow-white/10 flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Get Quote</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white bg-white/5"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 p-4 rounded-2xl bg-[#0e0e16]/95 border border-white/10 backdrop-blur-2xl flex flex-col gap-3 font-mono text-xs">
          <a
            href="#core-expertise"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-300 uppercase tracking-wider"
          >
            01 / CORE EXPERTISE
          </a>
          <a
            href="#project-tiers"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-300 uppercase tracking-wider"
          >
            02 / PROJECT TIERS
          </a>
          <a
            href="#architecture"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-300 uppercase tracking-wider"
          >
            03 / ARCHITECTURE
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openQuoteModal("General Discovery");
            }}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-center uppercase tracking-wider shadow-lg shadow-red-700/30"
          >
            Get a Quote
          </button>
        </div>
      )}
    </header>
  );
}
