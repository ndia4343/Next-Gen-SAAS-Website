'use client';

import React from 'react';
import { FOUNDER_NAME, FOUNDER_ONE_LINER, FOUNDER_PHOTO_URL } from '@/lib/default-config';

export default function FounderSection() {
  if (!FOUNDER_NAME || FOUNDER_NAME.trim() === '' || FOUNDER_NAME === '{{FOUNDER_NAME}}') {
    return null;
  }

  const oneLiner =
    FOUNDER_ONE_LINER && FOUNDER_ONE_LINER !== '{{FOUNDER_ONE_LINER}}'
      ? FOUNDER_ONE_LINER
      : '';

  const initials = FOUNDER_NAME.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return (
    <section
      id="founder"
      className="relative w-full bg-[#FAFAFA] text-[#0A0A0A] py-16 sm:py-20 px-5 sm:px-8 border-t border-[rgba(0,0,0,0.07)] scroll-mt-20 overflow-hidden"
    >
      <div className="relative z-10 max-w-[960px] mx-auto">
        <div className="rounded-[24px] bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_12px_36px_rgba(0,0,0,0.04)] p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Optional Founder Photo Slot */}
          {FOUNDER_PHOTO_URL ? (
            <img
              src={FOUNDER_PHOTO_URL}
              alt={FOUNDER_NAME}
              className="w-20 h-20 rounded-2xl object-cover border border-[rgba(0,0,0,0.10)] shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-[#0A0A0A] text-white flex items-center justify-center font-serif-instrument text-3xl shrink-0">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#585A66] font-semibold">
              Who&apos;s Behind This
            </div>
            <h2 className="mt-1.5 font-serif-instrument text-2xl sm:text-3xl text-[#0A0A0A]">
              {FOUNDER_NAME}
            </h2>
            {oneLiner && (
              <p className="mt-2 text-[15px] leading-[1.6] text-[#585A66]">
                {oneLiner}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
