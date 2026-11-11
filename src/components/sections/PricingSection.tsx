'use client';

import React from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useSiteConfig } from '@/context/SiteConfigContext';

export default function PricingSection() {
  const { config } = useSiteConfig();
  const bookingUrl =
    config.branding.calendarBookingUrl || 'https://calendar.app.google/u5vL88X41qmGBCky5';

  return (
    <section
      id="pricing"
      className="relative w-full bg-[#FAFAFA] text-[#0A0A0A] py-20 sm:py-28 px-5 sm:px-8 border-t border-[rgba(0,0,0,0.07)] scroll-mt-20 overflow-hidden"
    >
      <div className="relative z-10 max-w-[1040px] mx-auto">
        <div className="rounded-[28px] bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-7 sm:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-[620px]">
              <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] uppercase text-[#585A66] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#0A0A0A]" />
                <span>Pricing</span>
              </div>

              <h2
                className="mt-4 font-serif-instrument font-normal text-[#0A0A0A] tracking-[-0.02em] leading-[1.04]"
                style={{ fontSize: 'clamp(34px, 4.4vw, 56px)' }}
              >
                Transparent, volume-based pricing
              </h2>

              <p className="mt-4 text-[15.5px] sm:text-base leading-[1.65] text-[#585A66]">
                Every clinic is different. Pricing depends on your monthly call volume and the scheduling systems you use. Book a free missed-call audit and we will provide a clear, fixed monthly quote.
              </p>

              {/* {{PRICE_FROM}} */}
              <div
                className="hidden"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: '<!-- {{PRICE_FROM}} -->' }}
              />

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-[13px] text-[#585A66]">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  Clear fixed monthly quote after discovery
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  Tailored to your clinic calendar &amp; call volume
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="zl-btn inline-flex items-center justify-center gap-2.5 min-h-[52px] px-7 rounded-full bg-[#0A0A0A] hover:bg-[#1F2024] text-white font-semibold text-sm sm:text-[15px] shadow-[0_12px_30px_rgba(0,0,0,0.14)] transition-colors cursor-pointer"
              >
                <span>Book a free missed-call audit</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
