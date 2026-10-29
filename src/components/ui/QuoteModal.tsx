"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Mic, 
  MessageSquare, 
  Calculator, 
  BarChart3, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck 
} from "lucide-react";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export const QuoteRequestModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, preselectedService }) => {
  const [step, setStep] = useState(1);
  const [selectedArchitectures, setSelectedArchitectures] = useState<string[]>([
    "voice_receptionist"
  ]);
  const [selectedVolume, setSelectedVolume] = useState("under_100");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync preselectedService when opened
  useEffect(() => {
    if (preselectedService && isOpen) {
      const lower = preselectedService.toLowerCase();
      let matchedId: string | null = null;
      if (lower.includes("voice") || lower.includes("receptionist")) {
        matchedId = "voice_receptionist";
      } else if (lower.includes("whatsapp") || lower.includes("triage") || lower.includes("booking")) {
        matchedId = "whatsapp_funnel";
      } else if (lower.includes("estimat") || lower.includes("quote") || lower.includes("software") || lower.includes("solar") || lower.includes("restaurant")) {
        matchedId = "estimation_engine";
      } else if (lower.includes("dashboard") || lower.includes("profit") || lower.includes("analytics") || lower.includes("intelligence")) {
        matchedId = "profit_dashboard";
      }

      if (matchedId && !selectedArchitectures.includes(matchedId)) {
        setSelectedArchitectures((prev) => (prev.length === 0 ? [matchedId!] : [...prev, matchedId!]));
      }
    }
  }, [preselectedService, isOpen]);

  // Reset state on modal close
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStep(1);
        setIsSubmitted(false);
        setError(null);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleArchitecture = (id: string) => {
    setSelectedArchitectures((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const architectureOptions = [
    {
      id: "voice_receptionist",
      title: "AI Voice Receptionist (Inbound / Outbound)",
      icon: Mic,
    },
    {
      id: "whatsapp_funnel",
      title: "WhatsApp Booking & Triage Funnel",
      icon: MessageSquare,
    },
    {
      id: "estimation_engine",
      title: "Custom Estimation Software (Quotation Engine)",
      icon: Calculator,
    },
    {
      id: "profit_dashboard",
      title: "Executive Intelligence & Profit Dashboard",
      icon: BarChart3,
    },
  ];

  const volumeOptions = [
    { id: "under_100", label: "Under 100 leads / month", tier: "EMERGING" },
    { id: "100_500", label: "100 to 500 leads / month", tier: "GROWING" },
    { id: "500_2000", label: "500 to 2,000 leads / month", tier: "HIGH VOLUME" },
    { id: "2000_plus", label: "2,000+ leads / month", tier: "ENTERPRISE" },
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Please provide your name and work email.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const selectedTitles = architectureOptions
      .filter((opt) => selectedArchitectures.includes(opt.id))
      .map((opt) => opt.title);
    const volumeLabel = volumeOptions.find((v) => v.id === selectedVolume)?.label || selectedVolume;

    // 1. Direct Webhook Dispatch to Google Apps Script
    // Set header 'Content-Type': 'text/plain' to prevent CORS preflight blocks
    const webhookUrl = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL;
    if (webhookUrl && webhookUrl !== "your_google_apps_script_url_here") {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            name: formData.name,
            caller_name: formData.name,
            email: formData.email,
            work_email: formData.email,
            phone: formData.phone,
            whatsapp_number: formData.phone,
            selectedArchitectures,
            requested_systems: selectedTitles,
            selectedVolume,
            volume: volumeLabel,
            estimated_monthly_volume: volumeLabel,
            source: "Website Modal (Quote Request)",
          }),
          mode: "no-cors",
        });
      } catch (webhookErr) {
        console.warn("[Google Sheets Client Webhook Error]:", webhookErr);
      }
    }

    // 2. Persist to Next.js API route for local telemetry and admin dashboard
    try {
      const vid = typeof window !== "undefined" ? localStorage.getItem("zavian_vid") : undefined;

      await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services: selectedTitles,
          selectedService: selectedTitles.join(", ") || "Custom Architecture",
          leadVolume: volumeLabel,
          projectScope: `[Volume: ${volumeLabel}] Custom blueprint request submitted via 3-step modal.`,
          timeline: "Within 30 Days",
          visitorId: vid || undefined,
          ...formData,
        }),
      });
    } catch (err: any) {
      console.warn("[Internal Quote Sync Error]:", err);
    } finally {
      // Brief visual transition before showing success confirmation
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#12151E] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 overflow-hidden">
        
        {/* Top Progress Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1 grid grid-cols-3 gap-2">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? "bg-[#8B5CF6]" : "bg-white/10"}`} />
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? "bg-[#8B5CF6]" : "bg-white/10"}`} />
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 3 ? "bg-[#8B5CF6]" : "bg-white/10"}`} />
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {!isSubmitted ? (
          <>
            {/* STEP 01: SELECT ARCHITECTURES */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Step 1: Select Architectures</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Select the AI systems you want deployed (choose all that apply):
                  </p>
                </div>

                <div className="space-y-2.5">
                  {architectureOptions.map((opt) => {
                    const Icon = opt.icon;
                    const active = selectedArchitectures.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => toggleArchitecture(opt.id)}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          active
                            ? "bg-[#8B5CF6]/15 border-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.25)]"
                            : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${active ? "bg-[#8B5CF6] text-white" : "bg-white/5 text-slate-400"}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-semibold text-slate-200">{opt.title}</span>
                        </div>

                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          active ? "bg-[#8B5CF6] border-[#8B5CF6] text-white" : "border-white/20 bg-black/30"
                        }`}>
                          {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button
                    type="button"
                    disabled={selectedArchitectures.length === 0}
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(139,92,246,0.35)] cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 02: INBOUND VOLUME */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Step 2: Monthly Inbound Volume</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Select your estimated monthly customer inquiries (calls, WhatsApp, or web):
                  </p>
                </div>

                <div className="space-y-2.5">
                  {volumeOptions.map((v) => {
                    const active = selectedVolume === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVolume(v.id)}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          active
                            ? "bg-[#8B5CF6]/15 border-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                            : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                        }`}
                      >
                        <span className="text-sm font-medium text-slate-200">{v.label}</span>
                        <span className={`text-[10px] font-mono tracking-widest px-2.5 py-1 rounded transition-colors ${
                          active ? "text-[#FF6B00] font-bold bg-[#FF6B00]/10 border border-[#FF6B00]/30" : "text-slate-500 bg-white/5"
                        }`}>
                          {v.tier}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all shadow-[0_0_15px_rgba(139,92,246,0.35)] cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 03: CONTACT INFORMATION */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Step 3: Contact Information</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Where should we dispatch your custom architecture blueprint and cost breakdown?
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Mahmood or Marcus Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 focus:border-[#8B5CF6] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 focus:border-[#8B5CF6] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      placeholder="+44 / +971 / +92 / +1 WhatsApp Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 focus:border-[#8B5CF6] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] disabled:opacity-50 cursor-pointer"
                    >
                      <span>{isSubmitting ? "Submitting..." : "Submit Quote Request ↗"}</span>
                    </button>
                  </div>

                  {/* Trust Badge */}
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-mono pt-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Fixed-scope architecture proposal sent within 24 hours. No sales spam.</span>
                  </div>
                </div>
              </form>
            )}
          </>
        ) : (
          /* Confirmation State */
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#8B5CF6] flex items-center justify-center text-2xl mx-auto shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] text-[10px] font-mono uppercase font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
              Blueprint Request Staged
            </div>

            <h3 className="text-xl font-bold text-white">
              Inquiry Received
            </h3>

            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Our engineering team will review your selected architectures and dispatch your custom blueprint to{" "}
              <span className="font-semibold text-white">{formData.email}</span> within 24 business hours.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Close Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export { QuoteRequestModal as QuoteModal };
export default QuoteRequestModal;
