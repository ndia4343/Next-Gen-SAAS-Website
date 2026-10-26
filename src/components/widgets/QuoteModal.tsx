"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { useModal } from "../providers/ModalProvider";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { soundFX } from "@/lib/audio";

export default function QuoteModal() {
  const { isQuoteModalOpen, closeQuoteModal, selectedService } = useModal();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    selectedService: selectedService as string,
    projectScope: "",
    timeline: "1 - 3 months",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successData, setSuccessData] = useState<{
    quoteId: string;
    message: string;
  } | null>(null);

  // Sync selectedService when opened
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      selectedService: selectedService,
    }));
    setErrorMessage(null);
    setFieldErrors({});
    setSuccessData(null);
  }, [selectedService, isQuoteModalOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[e.target.name];
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
        setErrorMessage(data.message || "Failed to submit quote request.");
        if (data.errors) {
          setFieldErrors(data.errors);
        }
      } else {
        soundFX.playSuccess();
        setSuccessData({
          quoteId: data.quoteId,
          message: data.message,
        });
      }
    } catch {
      setErrorMessage("Network or server connection failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    soundFX.playClick();
    setSuccessData(null);
    closeQuoteModal();
  };

  return (
    <Modal
      isOpen={isQuoteModalOpen}
      onClose={closeQuoteModal}
      title={successData ? "Blueprint Request Dispatched" : "Project Support & Scoping Quote"}
    >
      {successData ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h4 className="text-2xl font-bold text-white">
            Architecture Blueprint Initialized
          </h4>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-md mx-auto text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between text-zinc-400">
              <span>REFERENCE ID:</span>
              <span className="text-white font-bold">{successData.quoteId}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>SERVICE TIER:</span>
              <span className="text-red-400 font-semibold">{formData.selectedService}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>STATUS:</span>
              <span className="text-emerald-400">QUEUED_FOR_DISCOVERY</span>
            </div>
          </div>

          <p className="text-zinc-300 text-sm max-w-md mx-auto">
            {successData.message} An engineering partner will review your requirements and follow up within 24 hours.
          </p>

          <button
            onClick={handleReset}
            className="mt-6 px-8 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors"
          >
            Close &amp; Return to Experience
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Morgan"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
              />
              {fieldErrors.name && (
                <p className="text-[11px] text-red-400 mt-1">{fieldErrors.name[0]}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Work Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@acme.corp"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
              />
              {fieldErrors.email && (
                <p className="text-[11px] text-red-400 mt-1">{fieldErrors.email[0]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Company / Organization *
              </label>
              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Technologies"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
              />
              {fieldErrors.company && (
                <p className="text-[11px] text-red-400 mt-1">{fieldErrors.company[0]}</p>
              )}
            </div>

            {/* Selected Service Tier */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Selected Service Tier *
              </label>
              <select
                name="selectedService"
                value={formData.selectedService}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[#14141e] border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
              >
                <option value="Headless Ecommerce">Headless Ecommerce</option>
                <option value="Agentic AI">Agentic AI (Featured)</option>
                <option value="Idea to Launch">Idea to Launch</option>
                <option value="01 / Software">01 / Software</option>
                <option value="02 / Data">02 / Data</option>
                <option value="03 / AI">03 / AI</option>
                <option value="04 / Media">04 / Media</option>
                <option value="General Discovery">General Discovery</option>
              </select>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Target Timeline *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                "Immediate (< 1 month)",
                "1 - 3 months",
                "3 - 6 months",
                "Flexible / Exploring",
              ].map((time) => (
                <button
                  type="button"
                  key={time}
                  onClick={() => {
                    soundFX.playClick();
                    setFormData((prev) => ({ ...prev, timeline: time }));
                  }}
                  className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                    formData.timeline === time
                      ? "bg-red-600/20 border-red-500 text-white"
                      : "bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Project Scope */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Project Scope &amp; Architecture Goals *
            </label>
            <textarea
              name="projectScope"
              required
              rows={3}
              value={formData.projectScope}
              onChange={handleChange}
              placeholder="Outline your technical requirements, current stack, integrations (Shopify, OpenAI, BigQuery), or primary bottlenecks..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 transition-colors resize-none"
            />
            {fieldErrors.projectScope && (
              <p className="text-[11px] text-red-400 mt-1">
                {fieldErrors.projectScope[0]}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-sm shadow-xl shadow-red-700/30 flex items-center justify-center gap-2 active:scale-[0.99] transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validating Scope with AI Engine...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Dispatch Request for Instant Scope</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
