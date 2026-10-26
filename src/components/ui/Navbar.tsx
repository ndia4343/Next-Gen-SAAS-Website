"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Sparkles, Menu, X } from "lucide-react";
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
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center text-white shadow-lg shadow-red-600/40 group-hover:scale-105 transition-transform">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white leading-none">
              NEUROFLUX<span className="text-red-500">.AI</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5">
              3D AI &amp; Software Studio
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-zinc-400">
          <a
            href="#core-expertise"
            className="hover:text-white transition-colors"
          >
            01 / Core Expertise
          </a>
          <a
            href="#project-support"
            className="hover:text-white transition-colors"
          >
            02 / Project Tiers
          </a>
          <a
            href="#methodology"
            className="hover:text-white transition-colors"
          >
            03 / Architecture
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
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-300"
          >
            01 / Core Expertise
          </a>
          <a
            href="#project-support"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-white/5 rounded-lg text-zinc-300"
          >
            02 / Project Tiers
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openQuoteModal("General Discovery");
            }}
            className="w-full mt-2 py-3 rounded-xl bg-red-600 text-white font-semibold text-center"
          >
            Get a Quote
          </button>
        </div>
      )}
    </header>
  );
}
