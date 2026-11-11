'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useSiteConfig } from '@/context/SiteConfigContext';

export default function FinalCtaSection() {
  const { config } = useSiteConfig();
  const bookingUrl =
    config.branding.calendarBookingUrl || 'https://calendar.app.google/u5vL88X41qmGBCky5';
  const contactEmail = config.branding.contactEmail || 'contact@zavianlabs.com';

  return (
    <section
      id="book-audit"
      className="relative w-full bg-[#FFFFFF] text-[#0A0A0A] py-20 sm:py-24 px-5 sm:px-8 border-t border-[rgba(0,0,0,0.07)] overflow-hidden"
    >
      <div className="relative z-10 max-w-[1280px] mx-auto">
        <div className="relative overflow-hidden rounded-[32px] border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] px-6 sm:px-12 py-12 sm:py-16 text-center">
          <div
            className="pointer-events-none absolute left-1/2 -top-1/2 -translate-x-1/2 w-[620px] h-[620px] rounded-full blur-3xl opacity-35"
            style={{
              background:
                'radial-gradient(circle, rgba(16,185,129,0.10) 0%, rgba(139,92,246,0.08) 45%, transparent 70%)',
            }}
          />

          <h2
            className="relative font-serif-instrument font-normal text-[#0A0A0A] max-w-[780px] mx-auto tracking-[-0.02em] leading-[1.02]"
            style={{ fontSize: 'clamp(34px, 4.8vw, 68px)' }}
          >
            See how many patient calls your clinic can recover.
          </h2>

          <p className="relative mt-4 max-w-[560px] mx-auto text-[15.5px] sm:text-base text-[#585A66] leading-relaxed">
            Tell us how incoming calls and appointments work at your clinic today. We&apos;ll walk through your call flow and share a clear monthly quote.
          </p>

          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="zl-btn inline-flex items-center justify-center gap-2 min-h-[52px] px-8 rounded-full bg-[#0A0A0A] hover:bg-[#1F2024] text-white font-semibold text-[15px] shadow-[0_12px_30px_rgba(0,0,0,0.16)] cursor-pointer"
            >
              <span>Book a free missed-call audit</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </a>

            <a
              href={`mailto:${contactEmail}`}
              className="zl-btn inline-flex items-center justify-center min-h-[52px] px-8 rounded-full border border-[rgba(0,0,0,0.14)] bg-white hover:border-[#0A0A0A] text-[#0A0A0A] font-semibold text-[15px] cursor-pointer"
            >
              {contactEmail}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
