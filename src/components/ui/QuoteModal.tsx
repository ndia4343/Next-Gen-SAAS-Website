'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Send, CheckCircle2, ShieldCheck, Clock, Users, Building } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedService: string;
}

const SERVICE_OPTIONS = [
  'AI Voice Receptionists',
  'WhatsApp Inbound Workflows',
  'Custom Software & Dashboards',
  'Full Automation Pipeline',
];

const VOLUME_OPTIONS = [
  '< 100 leads / mo',
  '100 – 500 leads / mo',
  '500 – 2,500 leads / mo',
  '2,500+ leads / mo',
];

const TIMELINE_OPTIONS = [
  'Immediate (< 2 weeks)',
  'Within 30 Days',
  'Exploring / Planning',
];

const CRM_OPTIONS = ['HubSpot', 'GoHighLevel', 'Salesforce', 'Cal.com / Google', 'Custom / None'];

export default function QuoteModal({ isOpen, onClose, preselectedService }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [formData, setFormData] = useState({
    selectedService: preselectedService || 'AI Voice Receptionists',
    projectScope: '',
    leadVolume: '100 – 500 leads / mo',
    timeline: 'Within 30 Days',
    crm: 'HubSpot',
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, selectedService: preselectedService }));
    }
  }, [preselectedService]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setTimeout(() => {
        setStep(1);
        setSubmitted(false);
        setErrorMsg('');
      }, 200);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Validation per step
  const validateStep1 = () => {
    if (!formData.selectedService) {
      setErrorMsg('Please select a primary architecture focus.');
      return false;
    }
    if (!formData.projectScope.trim() || formData.projectScope.trim().length < 5) {
      setErrorMsg('Please provide a brief description of your deliverables (at least 5 characters).');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const validateStep2 = () => {
    if (!formData.leadVolume) {
      setErrorMsg('Please select your typical inbound volume.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const validateStep3 = () => {
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid corporate email address.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    setErrorMsg('');
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const vid = typeof window !== 'undefined' ? localStorage.getItem('zavian_vid') : undefined;

      // Pack enriched scope with volume and CRM details
      const enrichedScope = `[Volume: ${formData.leadVolume}] [CRM/Stack: ${formData.crm}] ${formData.projectScope.trim()}`;

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        company: formData.company.trim() || undefined,
        selectedService: formData.selectedService,
        projectScope: enrichedScope,
        timeline: formData.timeline,
        visitorId: vid || undefined,
      };

      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || data.errors || 'Submission failed');
      }

      setInquiryId(data.inquiryId || `ZAV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting scope. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-[#0c0c12] border border-zinc-200 dark:border-white/15 p-6 sm:p-8 shadow-2xl text-zinc-900 dark:text-zinc-100 transition-colors">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-white p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close quote modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          /* Real Confirmation Screen — No fake "proposal generated" claims */
          <div className="text-center py-6 sm:py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold px-3 py-1 rounded-full bg-emerald-500/10 mb-2">
                ● Inquiry Logged &amp; Verified
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Technical Scope Received
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/10 max-w-md mx-auto text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>REFERENCE ID:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-200">{inquiryId}</span>
              </div>
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>FOCUS:</span>
                <span className="text-[#FF6B00] font-semibold">{formData.selectedService}</span>
              </div>
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
                <span>ESTIMATED VOLUME:</span>
                <span className="text-zinc-900 dark:text-zinc-200">{formData.leadVolume}</span>
              </div>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              Your deployment requirements have been assigned to our solutions engineering team. We will review your architecture specifications and contact you at <strong className="text-zinc-900 dark:text-white font-medium">{formData.email}</strong> within 24 hours.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-xs tracking-wide transition-all cursor-pointer shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Modal Header & Progress Indicator */}
            <div className="mb-6 pb-4 border-b border-zinc-200 dark:border-white/10">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-[#FF6B00] font-bold uppercase tracking-widest">
                  ZAVIAN LABS ONBOARDING
                </span>
                <span className="text-zinc-400 dark:text-zinc-500">
                  Step 0{step} of 03
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF6B00] to-purple-500 transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-3">
                {step === 1 && 'Scope & System Focus'}
                {step === 2 && 'Inbound Volume & Stack'}
                {step === 3 && 'Contact & Engineering Dispatch'}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {step === 1 && 'Select the primary automation architecture and outline your objectives.'}
                {step === 2 && 'Help us understand your current throughput and integration requirements.'}
                {step === 3 && 'Provide your direct information so our lead solutions engineer can follow up.'}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-xs font-mono">
                {errorMsg}
              </div>
            )}

            {/* STEP 1: SCOPE */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400 mb-2 font-semibold">
                    1. Architecture Focus *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SERVICE_OPTIONS.map((srv) => {
                      const isSelected = formData.selectedService === srv;
                      return (
                        <button
                          key={srv}
                          type="button"
                          onClick={() => setFormData({ ...formData, selectedService: srv })}
                          className={`p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#FF6B00] bg-orange-500/10 text-[#FF6B00] dark:text-orange-400 font-semibold shadow-sm'
                              : 'border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-white/20'
                          }`}
                        >
                          {srv}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400 mb-2 font-semibold">
                    2. Deliverables &amp; Technical Constraints *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="e.g. Need an AI voice receptionist to answer after-hours calls, qualify property management leads, and sync to HubSpot with zero missed calls..."
                    value={formData.projectScope}
                    onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
                    className="w-full p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-900 dark:text-white text-xs placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 transition-all resize-none"
                  />
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    Min 5 characters. Be as specific as you like.
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-3 rounded-xl bg-[#FF6B00] hover:bg-[#ff7b1a] text-black font-semibold text-xs font-mono uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/20"
                  >
                    <span>Next: Inbound Volume</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: VOLUME & TECH STACK */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400 mb-2 font-semibold">
                    1. Estimated Monthly Lead Volume *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {VOLUME_OPTIONS.map((vol) => {
                      const isSelected = formData.leadVolume === vol;
                      return (
                        <button
                          key={vol}
                          type="button"
                          onClick={() => setFormData({ ...formData, leadVolume: vol })}
                          className={`p-3 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold shadow-sm'
                              : 'border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-white/20'
                          }`}
                        >
                          {vol}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400 mb-2 font-semibold">
                    2. Primary CRM / Calendar Integration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CRM_OPTIONS.map((crm) => {
                      const isSelected = formData.crm === crm;
                      return (
                        <button
                          key={crm}
                          type="button"
                          onClick={() => setFormData({ ...formData, crm })}
                          className={`p-2.5 rounded-xl border text-[11px] font-medium text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#FF6B00] bg-orange-500/10 text-[#FF6B00] dark:text-orange-400 font-semibold shadow-sm'
                              : 'border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-white/20'
                          }`}
                        >
                          {crm}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400 mb-2 font-semibold">
                    3. Target Implementation Timeline
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIMELINE_OPTIONS.map((time) => {
                      const isSelected = formData.timeline === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setFormData({ ...formData, timeline: time })}
                          className={`p-2.5 rounded-xl border text-[11px] font-medium text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm'
                              : 'border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-white/20'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-1/3 py-3 rounded-xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 font-semibold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-2/3 py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7c4ee8] text-white font-semibold text-xs font-mono uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-500/20"
                  >
                    <span>Next: Contact Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONTACT & SUBMIT */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-900 dark:text-white text-xs placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                      Corporate Email *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="sarah@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-900 dark:text-white text-xs placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 019-2834"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-900 dark:text-white text-xs placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="Apex Ventures Inc."
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-900 dark:text-white text-xs placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 transition-all"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Direct engineering review · No sales spam</span>
                  </div>
                  <span className="text-zinc-400 dark:text-zinc-500 text-[11px]">24h SLA</span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-1/3 py-3.5 rounded-xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 font-semibold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#8B5CF6] hover:brightness-110 disabled:opacity-50 text-white font-semibold text-xs font-mono uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Logging Scope...' : 'Dispatch Inquiry ↗'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
