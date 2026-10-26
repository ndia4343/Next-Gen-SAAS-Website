"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useModal, ServiceTier } from "../providers/ModalProvider";
import { CheckCircle2, AlertCircle, Loader2, Send, X, Copy, Check } from "lucide-react";
import { soundFX } from "@/lib/audio";

interface QuoteModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  selectedService?: string;
}

const serviceOptions = [
  "Headless Ecommerce",
  "Agentic AI",
  "Idea to Launch",
  "01 / Software",
  "02 / Data",
  "03 / AI",
  "04 / Media",
  "General Discovery",
];

const timelineOptions = [
  "Immediate (< 1 month)",
  "1 - 3 months",
  "3 - 6 months",
  "Flexible / Exploring",
];

export default function QuoteModal({
  isOpen: propIsOpen,
  onClose: propOnClose,
  selectedService: propSelectedService,
}: QuoteModalProps) {
  const modalContext = useModal();

  // Support both props and ModalContext
  const isOpen = propIsOpen !== undefined ? propIsOpen : modalContext.isQuoteModalOpen;
  const activeService = propSelectedService || modalContext.selectedService || "General Discovery";

  const handleClose = useCallback(() => {
    if (propOnClose) {
      propOnClose();
    } else {
      modalContext.closeQuoteModal();
    }
  }, [propOnClose, modalContext]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    selectedService: activeService,
    projectScope: "",
    timeline: "1 - 3 months",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successData, setSuccessData] = useState<{
    inquiryId: string;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync selected service when opened or changed
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        selectedService: activeService,
      }));
      setErrorMessage(null);
      setFieldErrors({});
      setSuccessData(null);
      setCopied(false);
    }
  }, [activeService, isOpen]);

  // Keyboard accessibility: ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear individual field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();
    setIsLoading(true);
    setErrorMessage(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Failed to submit quote inquiry.");
        if (data.errors) {
          setFieldErrors(data.errors);
        }
      } else {
        soundFX.playSuccess();
        setSuccessData({
          inquiryId: data.inquiryId || data.quoteId || "INQ-CONFIRMED",
          message: data.message,
        });
      }
    } catch {
      setErrorMessage("Network connection failed. Please verify your internet and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyInquiryId = () => {
    if (!successData?.inquiryId) return;
    navigator.clipboard.writeText(successData.inquiryId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
    >
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Accessible Glass Container */}
      <div className="relative z-10 w-full max-w-xl rounded-3xl bg-[#0c0c12]/95 border border-white/10 shadow-2xl p-6 sm:p-8 backdrop-blur-2xl text-left overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF6B00]">
              Architecture Discovery & Scoping
            </span>
            <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-white mt-1">
              Request Project Quote
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close quote modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation View */}
        {successData ? (
          <div className="py-6 text-center space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Inquiry Registered</h3>
              <p className="text-sm text-zinc-400 max-w-md mx-auto mt-2 leading-relaxed">
                {successData.message}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between max-w-sm mx-auto">
              <div className="text-left font-mono text-xs">
                <span className="text-zinc-500 block">INQUIRY REF:</span>
                <span className="text-[#FF6B00] font-bold">{successData.inquiryId}</span>
              </div>
              <button
                onClick={handleCopyInquiryId}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <button
              onClick={handleClose}
              className="mt-4 px-8 py-3 rounded-full bg-[#FF6B00] hover:bg-[#ff7b1a] text-black font-semibold text-sm transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          /* Interactive Quote Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Satya Nadella"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161f] border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF6B00] transition-colors"
                />
                {fieldErrors.name && (
                  <p className="text-[11px] text-red-400 mt-1">{fieldErrors.name[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Work Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="architect@enterprise.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161f] border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF6B00] transition-colors"
                />
                {fieldErrors.email && (
                  <p className="text-[11px] text-red-400 mt-1">{fieldErrors.email[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Company / Project <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme Corp / Stealth AI"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161f] border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF6B00] transition-colors"
                />
                {fieldErrors.company && (
                  <p className="text-[11px] text-red-400 mt-1">{fieldErrors.company[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Service Selection <span className="text-red-500">*</span>
                </label>
                <select
                  name="selectedService"
                  value={formData.selectedService}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161f] border border-white/10 text-sm text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                >
                  {serviceOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#12121a]">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Project Scope & Deliverables <span className="text-red-500">*</span>
              </label>
              <textarea
                name="projectScope"
                rows={3}
                required
                value={formData.projectScope}
                onChange={handleChange}
                placeholder="Describe your architecture requirements, scale targets, or tech stack constraints..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161f] border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF6B00] transition-colors"
              />
              {fieldErrors.projectScope && (
                <p className="text-[11px] text-red-400 mt-1">{fieldErrors.projectScope[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Target Timeline
              </label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161f] border border-white/10 text-sm text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
              >
                {timelineOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#12121a]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-[#FF6B00] hover:bg-[#ff7b1a] text-black font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B00]/25 disabled:opacity-50 active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Request Scoped Architecture Quote</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
