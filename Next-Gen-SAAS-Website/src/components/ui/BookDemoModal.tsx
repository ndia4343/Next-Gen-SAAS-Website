'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mic, 
  MessageSquare, 
  Calculator, 
  BarChart3, 
  Check, 
  ArrowRight, 
  Loader2,
  CheckCircle2
} from 'lucide-react';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ARCHITECTURES = [
  {
    id: 'AI Voice Receptionist (Inbound / Outbound)',
    title: 'AI Voice Receptionist (Inbound / Outbound)',
    desc: 'Autonomous sub-second phone intake & qualification.',
    icon: Mic,
  },
  {
    id: 'WhatsApp Booking & Triage Funnel',
    title: 'WhatsApp Booking & Triage Funnel',
    desc: 'Live conversational calendar booking & lead nurturing.',
    icon: MessageSquare,
  },
  {
    id: 'Custom Estimation Software (Quotation Engine)',
    title: 'Custom Estimation Software (Quotation Engine)',
    desc: 'Instant proposal generation & dynamic pricing logic.',
    icon: Calculator,
  },
  {
    id: 'Executive Intelligence & Profit Dashboard',
    title: 'Executive Intelligence & Profit Dashboard',
    desc: 'Real-time telemetry, margins, and pipeline conversion.',
    icon: BarChart3,
  },
];

export function BookDemoModal({ isOpen, onClose }: BookDemoModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedArchitectures, setSelectedArchitectures] = useState<string[]>([
    'AI Voice Receptionist (Inbound / Outbound)',
    'WhatsApp Booking & Triage Funnel',
  ]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleArchitecture = (id: string) => {
    setSelectedArchitectures((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          notes: formData.notes,
          services: selectedArchitectures,
          source: 'Hero Book Live Demo Modal',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.errors || 'Failed to submit request. Please try again.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setIsSuccess(false);
      setErrorMsg('');
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop with subtle light blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-neutral-900/40 dark:bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card: Pure White porcelain in Light Mode */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative w-full max-w-xl bg-white dark:bg-[#0c0d12] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 z-10 text-neutral-900 dark:text-neutral-100"
          >
            {/* Top Indicator & Close Button */}
            <div className="flex items-center gap-2 mb-6">
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  step >= 1 ? 'bg-violet-600' : 'bg-neutral-200 dark:bg-neutral-800'
                }`}
              />
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  step === 2 || isSuccess
                    ? 'bg-violet-600'
                    : 'bg-neutral-200 dark:bg-neutral-800'
                }`}
              />
              <button
                onClick={handleClose}
                className="ml-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSuccess ? (
              <div className="py-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-extrabold text-neutral-950 dark:text-white">
                  Demo Request Dispatched
                </h3>
                <p className="mt-2 text-neutral-600 dark:text-neutral-300 text-sm max-w-sm leading-relaxed">
                  A receipt has been dispatched to <strong>{formData.email}</strong>. Our solutions team is reviewing your specifications and will respond shortly.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 px-7 py-2.5 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Done
                </button>
              </div>
            ) : step === 1 ? (
              <div>
                <div className="mb-5">
                  <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                    Step 1: Select Architectures
                  </h2>
                  <p className="mt-1 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Select the AI systems you want deployed (choose all that apply):
                  </p>
                </div>

                <div className="space-y-3">
                  {ARCHITECTURES.map((item) => {
                    const isSelected = selectedArchitectures.includes(item.id);
                    const IconComponent = item.icon;

                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleArchitecture(item.id)}
                        className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-violet-50/70 dark:bg-violet-950/20 border-violet-600 dark:border-violet-500 ring-1 ring-violet-600/30'
                            : 'bg-neutral-50/70 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 pr-2">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? 'bg-violet-600 text-white'
                                : 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                              {item.title}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-violet-600 border-violet-600 text-white'
                              : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    disabled={selectedArchitectures.length === 0}
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-bold shadow-md shadow-violet-600/20 transition-all active:scale-95"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <h2 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                    Step 2: Contact Details
                  </h2>
                  <p className="mt-1 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Where should we deliver your architecture review and scheduling link?
                  </p>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Marcus Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                        Business Email *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="marcus@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                        WhatsApp / Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="Apex Logistics / Skyline Dental"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                      Project Notes / Estimated Volumes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Monthly call volume, target CRM (HubSpot, GHL), specific goals..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white resize-none"
                    />
                  </div>
                </div>

                <div className="mt-7 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors"
                  >
                    ← Back to Step 1
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-bold shadow-md shadow-violet-600/20 transition-all active:scale-95"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}