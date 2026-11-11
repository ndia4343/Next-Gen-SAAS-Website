'use client';

import React from 'react';
import { PhoneCall, Wrench, Radio } from 'lucide-react';
import { SETUP_TIMELINE } from '@/lib/default-config';

interface HowItWorksSectionProps {
  onOpenQuoteModal?: (service?: string) => void;
}

export function HowItWorksSection(_props: HowItWorksSectionProps = {}) {
  const steps = [
    {
      num: '01',
      tag: '01 // We map your call flow',
      title: 'We map your call flow',
      description:
        'We learn how calls and bookings currently work in your clinic, including your services, FAQs, and booking rules.',
      icon: PhoneCall,
      accent: '#10B981',
    },
    {
      num: '02',
      tag: '02 // We build and test your receptionist',
      title: 'We build and test your receptionist',
      description: `We configure your AI receptionist to match your clinic's tone, treatment catalog, and scheduling calendar. Setup takes approximately ${SETUP_TIMELINE}.`,
      icon: Wrench,
      accent: '#0A84FF',
    },
    {
      num: '03',
      tag: '03 // You go live',
      title: 'You go live',
      description:
        'The AI answers every after-hours and overflow call. Your front desk staff can monitor or take over any conversation at any time.',
      icon: Radio,
      accent: '#8B5CF6',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative w-full bg-[#FFFFFF] text-[#0A0A0A] py-20 sm:py-28 px-5 sm:px-8 border-t border-[rgba(0,0,0,0.07)] scroll-mt-20 overflow-hidden"
    >
      <div className="relative z-10 max-w-[1280px] mx-auto">
        <div className="max-w-[680px]">
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] uppercase text-[#10B981] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>03 &mdash; Onboarding &amp; Setup</span>
          </div>

          <h2
            className="mt-4 font-serif-instrument font-normal text-[#0A0A0A] tracking-[-0.02em] leading-[1.02]"
            style={{ fontSize: 'clamp(36px, 4.8vw, 68px)' }}
          >
            How it <span className="italic text-[#10B981]">works</span>
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((step) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.num}
                className="rounded-[24px] bg-[#FAFAFA] border border-[rgba(0,0,0,0.08)] p-6 sm:p-8 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:bg-white transition-colors duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#585A66]">
                      {step.tag}
                    </span>
                    <span
                      className="w-9 h-9 rounded-xl flex items-center justify-center border border-[rgba(0,0,0,0.08)] bg-white shrink-0"
                      style={{ color: step.accent }}
                    >
                      <StepIcon className="w-4 h-4" />
                    </span>
                  </div>

                  <h3 className="mt-5 font-serif-instrument text-2xl sm:text-[28px] text-[#0A0A0A] leading-tight">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-[15px] leading-[1.65] text-[#585A66]">
                    {step.description}
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

export default HowItWorksSection;
