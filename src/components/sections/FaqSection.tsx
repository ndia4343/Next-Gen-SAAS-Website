'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SETUP_TIMELINE, SUPPORTED_LANGUAGES } from '@/lib/default-config';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'unknown-answer',
    question: 'What happens if the AI does not know the answer?',
    answer:
      'The receptionist never guesses. If a caller asks a complex clinical question, it politely takes a detailed message, marks the urgency, and routes it to your team via WhatsApp or email.',
  },
  {
    id: 'front-desk-takeover',
    question: 'Can our front desk team take over a call?',
    answer:
      'Yes. Your staff can view live call transcripts and take over any active conversation instantly with a single click.',
  },
  {
    id: 'calendar-compatibility',
    question: 'Does it work with our existing calendar or practice management software?',
    answer:
      'We connect directly with Google Calendar, Cal.com, and custom booking APIs. Compatibility with your specific clinic management system is confirmed during discovery.',
  },
  {
    id: 'data-privacy',
    question: 'How is patient and caller data handled?',
    answer:
      'All audio streams and chat transcripts are encrypted in transit and at rest. Patient data is never shared or used to train public machine learning models.',
  },
  {
    id: 'languages',
    question: 'Which languages does the receptionist speak?',
    answer: `Our core system supports ${SUPPORTED_LANGUAGES} with natural pronunciation and accent recognition.`,
  },
  {
    id: 'setup-timeline',
    question: 'How long does setup take?',
    answer: `Full onboarding, script testing, and calendar integration typically take ${SETUP_TIMELINE}.`,
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="relative w-full bg-[#FFFFFF] text-[#0A0A0A] py-20 sm:py-28 px-5 sm:px-8 border-t border-[rgba(0,0,0,0.07)] scroll-mt-20 overflow-hidden"
    >
      <div className="relative z-10 max-w-[960px] mx-auto">
        <div className="text-center max-w-[640px] mx-auto">
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] uppercase text-[#585A66] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>FAQ</span>
          </div>

          <h2
            className="mt-4 font-serif-instrument font-normal text-[#0A0A0A] tracking-[-0.02em] leading-[1.04]"
            style={{ fontSize: 'clamp(34px, 4.4vw, 56px)' }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            const buttonId = `faq-btn-${item.id}`;
            const panelId = `faq-panel-${item.id}`;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-colors duration-200 ${
                  isOpen
                    ? 'bg-[#FAFAFA] border-[rgba(0,0,0,0.14)] shadow-[0_8px_24px_rgba(0,0,0,0.04)]'
                    : 'bg-white border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.16)]'
                }`}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-5 sm:px-7 py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-[15.5px] sm:text-[17px] font-semibold text-[#0A0A0A] leading-snug">
                      {item.question}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full border border-[rgba(0,0,0,0.10)] bg-white flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#0A0A0A]' : 'text-[#585A66]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className={isOpen ? 'px-5 sm:px-7 pb-5 pt-0' : 'hidden'}
                >
                  <p className="text-[14.5px] sm:text-[15.5px] leading-[1.65] text-[#585A66]">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
