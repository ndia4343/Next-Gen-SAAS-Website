"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PhoneCall, 
  Calendar, 
  CheckCheck, 
  Clock, 
  MapPin, 
  Check, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from "lucide-react";

const CHAT_SEQUENCE = [
  {
    sender: "client",
    text: "Hi Sarah! Marcus here. Need to book a cosmetic polish and consultation for this Thursday afternoon if Dr. Mansoor has an opening.",
    time: "11:28 AM",
  },
  {
    sender: "reception",
    text: "Good morning Marcus! Checking Dr. Mansoor's schedule at our Downtown clinic for Thursday.",
    time: "11:28 AM",
  },
  {
    sender: "reception",
    text: "We have an opening at 4:30 PM with complimentary valet at Boulevard Point. Shall I lock that in for you?",
    time: "11:29 AM",
  },
  {
    sender: "client",
    text: "4:30 PM on Thursday works perfectly. Please lock it in.",
    time: "11:29 AM",
  },
  {
    sender: "reception",
    text: "Done! Your appointment is synchronized with our calendar. Looking forward to seeing you Thursday!",
    time: "11:30 AM",
  },
];

interface AutomatedPipelineLoopProps {
  onOpenQuoteModal?: (service: string) => void;
}

export function AutomatedPipelineLoop({ onOpenQuoteModal }: AutomatedPipelineLoopProps = {}) {
  const [pipelinePhase, setPipelinePhase] = useState<1 | 2 | 3>(1);
  const [visibleMessages, setVisibleMessages] = useState<number>(1);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [loopCycle, setLoopCycle] = useState<number>(0);

  useEffect(() => {
    // Reset states at the start of every loop
    setPipelinePhase(1);
    setVisibleMessages(1);
    setIsTyping(false);

    // Timeline Configuration (14.5s Total Infinite Cycle)
    // T = 2.8s -> Transition to Step 2 (WhatsApp)
    const t1 = setTimeout(() => {
      setPipelinePhase(2);
      
      // WhatsApp message pop sequence
      const m1 = setTimeout(() => { setIsTyping(true); }, 500);
      const m2 = setTimeout(() => { setIsTyping(false); setVisibleMessages(2); }, 1300);
      const m3 = setTimeout(() => { setIsTyping(true); }, 1800);
      const m4 = setTimeout(() => { setIsTyping(false); setVisibleMessages(3); }, 2700);
      const m5 = setTimeout(() => { setVisibleMessages(4); }, 3700);
      const m6 = setTimeout(() => { setIsTyping(true); }, 4200);
      const m7 = setTimeout(() => { setIsTyping(false); setVisibleMessages(5); }, 5200);

      // T = 8.6s -> Transition to Step 3 (Calendar Drop)
      const t2 = setTimeout(() => {
        setPipelinePhase(3);
      }, 5900);

      return () => {
        clearTimeout(m1);
        clearTimeout(m2);
        clearTimeout(m3);
        clearTimeout(m4);
        clearTimeout(m5);
        clearTimeout(m6);
        clearTimeout(m7);
        clearTimeout(t2);
      };
    }, 2800);

    // T = 14.5s -> Restart Loop
    const loopTimer = setTimeout(() => {
      setLoopCycle((c) => c + 1);
    }, 14500);

    return () => {
      clearTimeout(t1);
      clearTimeout(loopTimer);
    };
  }, [loopCycle]);

  return (
    <section 
      id="workflow-pipeline"
      className="relative w-full py-20 px-4 md:px-8 bg-[#FAFAFA] dark:bg-[#07070a] text-[#09090b] dark:text-white overflow-hidden transition-colors scroll-mt-28"
    >
      {/* Background Micro Dot Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px] opacity-70 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto space-y-10">
        
        {/* Header & Live Status */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold tracking-wide text-slate-800 dark:text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AUTOMATED PIPELINE &bull; NO HUMAN INTERVENTION
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#09090b] dark:text-white">
            The call ends. The automation doesn&apos;t.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-normal">
            Voice &rarr; WhatsApp &rarr; Google Calendar. Instant execution in under 2 seconds.
          </p>

          {/* Loop Progress Indicator */}
          <div className="pt-3 max-w-xs mx-auto">
            <div className="h-1.5 w-full bg-slate-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                key={loopCycle}
                className="h-full bg-[#18181b] dark:bg-violet-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 14.5, ease: "linear" }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 font-mono">
              <span>01 Intake</span>
              <span>02 WhatsApp</span>
              <span>03 Calendar</span>
            </div>
          </div>
        </div>

        {/* 3-Column Pipeline Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">

          {/* STEP 01: VOICE INTAKE */}
          <div className={`flex flex-col rounded-3xl p-6 bg-white dark:bg-neutral-900/80 border transition-all duration-300 shadow-sm ${
            pipelinePhase === 1 
              ? "border-[#18181b] dark:border-slate-600 ring-2 ring-slate-900/5 dark:ring-slate-100/5 shadow-md" 
              : "border-slate-200 dark:border-neutral-800"
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-neutral-800">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                Step 01 &bull; Voice
              </span>
              <span className={`text-xs font-bold ${pipelinePhase === 1 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                {pipelinePhase === 1 ? "Active" : "Completed"}
              </span>
            </div>

            <div className="py-4">
              <h3 className="text-lg font-black text-[#09090b] dark:text-white">01 &mdash; THE CALL</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">AI Receptionist Sarah qualifies booking terms.</p>
            </div>

            <div className="flex-1 rounded-2xl bg-[#F8FAFC] dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800 p-4 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    pipelinePhase === 1 ? "bg-emerald-500 animate-ping" : "bg-slate-400"
                  }`} />
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {pipelinePhase === 1 ? "Call Connected &bull; 00:38" : "Call Disconnected"}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-slate-300">
                  Sarah AI Voice
                </span>
              </div>

              {/* Dynamic Soundwave */}
              <div className="flex items-center justify-center gap-1.5 h-12 py-1">
                {[35, 80, 45, 95, 60, 100, 50, 85, 30, 90, 65, 40].map((height, i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 bg-[#18181b] dark:bg-violet-400 rounded-full"
                    animate={
                      pipelinePhase === 1
                        ? { height: [`${height * 0.25}%`, `${height}%`, `${height * 0.25}%`] }
                        : { height: "12%" }
                    }
                    transition={{
                      duration: 0.7,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.04,
                    }}
                  />
                ))}
              </div>

              {/* Caller Metadata */}
              <div className="rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-3 text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>Caller:</span>
                  <span className="font-bold text-[#09090b] dark:text-white">Marcus Vance</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>Inquiry:</span>
                  <span className="font-medium text-[#09090b] dark:text-white">Cosmetic Polish & Consult</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                  <span>Clinic:</span>
                  <div className="flex items-center gap-1 font-medium">
                    <span className="filter blur-[3.5px] select-none text-slate-700 dark:text-slate-300">Al Manara Luxury</span>
                    <span className="text-slate-400">(Downtown Dubai)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 rounded-lg px-2.5 py-1.5">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Requirement Qualified
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">0.3s Latency</span>
              </div>
            </div>
          </div>

          {/* STEP 02: THE MESSAGE */}
          <div className={`flex flex-col rounded-3xl p-6 bg-white dark:bg-neutral-900/80 border transition-all duration-300 shadow-sm ${
            pipelinePhase === 2 
              ? "border-[#18181b] dark:border-slate-600 ring-2 ring-slate-900/5 dark:ring-slate-100/5 shadow-md" 
              : "border-slate-200 dark:border-neutral-800"
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-neutral-800">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                Step 02 &bull; WhatsApp
              </span>
              <span className={`text-xs font-bold ${pipelinePhase === 2 ? "text-emerald-600 dark:text-emerald-400" : pipelinePhase === 3 ? "text-slate-400" : "text-slate-300 dark:text-slate-600"}`}>
                {pipelinePhase === 2 ? "Streaming" : pipelinePhase === 3 ? "Delivered" : "Queued"}
              </span>
            </div>

            <div className="py-4">
              <h3 className="text-lg font-black text-[#09090b] dark:text-white">02 &mdash; THE MESSAGE</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Multi-turn slot reservation with Sarah.</p>
            </div>

            {/* WhatsApp Container */}
            <div className="flex-1 rounded-2xl bg-[#F8FAFC] dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800 flex flex-col h-[400px] overflow-hidden">
              
              {/* WhatsApp Nav Header */}
              <div className="px-3.5 py-2.5 bg-white dark:bg-neutral-900 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#18181b] dark:bg-violet-600 text-white flex items-center justify-center font-bold text-xs">
                    S
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[#09090b] dark:text-white">Sarah</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 font-medium">
                        Reception
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="filter blur-[3px] select-none text-slate-500 dark:text-slate-400">Al Manara Luxury</span>
                      <span>&bull; Downtown Dubai</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Online
                </span>
              </div>

              {/* Message Bubbles */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                {CHAT_SEQUENCE.slice(0, visibleMessages).map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-2xl text-[11.5px] leading-relaxed shadow-xs ${
                        msg.sender === "client"
                          ? "bg-[#18181b] dark:bg-violet-600 text-white rounded-br-xs"
                          : "bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-[#09090b] dark:text-neutral-100 rounded-bl-xs"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                        msg.sender === "client" ? "text-slate-300" : "text-slate-400 dark:text-slate-400"
                      }`}>
                        <span>{msg.time}</span>
                        {msg.sender === "client" && <CheckCheck className="w-3 h-3 text-cyan-300" />}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 dark:bg-slate-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 dark:bg-slate-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 dark:bg-slate-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
              </div>

              <div className="p-2.5 bg-white dark:bg-neutral-900 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-400">
                <span>Encrypted direct communication</span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">Meta Verified</span>
              </div>
            </div>
          </div>

          {/* STEP 03: THE CALENDAR */}
          <div className={`flex flex-col rounded-3xl p-6 bg-white dark:bg-neutral-900/80 border transition-all duration-300 shadow-sm ${
            pipelinePhase === 3 
              ? "border-[#18181b] dark:border-slate-600 ring-2 ring-slate-900/5 dark:ring-slate-100/5 shadow-md" 
              : "border-slate-200 dark:border-neutral-800"
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-neutral-800">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-slate-200 tracking-wide uppercase">
                Step 03 &bull; Calendar
              </span>
              <span className={`text-xs font-bold ${pipelinePhase === 3 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                {pipelinePhase === 3 ? "Synchronized" : "Pending Turn"}
              </span>
            </div>

            <div className="py-4">
              <h3 className="text-lg font-black text-[#09090b] dark:text-white">03 &mdash; THE CALENDAR</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Zero-collision slot insertion via API.</p>
            </div>

            <div className="flex-1 rounded-2xl bg-[#F8FAFC] dark:bg-neutral-950/60 border border-slate-200 dark:border-neutral-800 p-4 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#09090b] dark:text-white">Google Calendar API</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  pipelinePhase === 3
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                    : "bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-slate-400"
                }`}>
                  {pipelinePhase === 3 ? <Check className="w-3 h-3" /> : null}
                  {pipelinePhase === 3 ? "Event Confirmed" : "Awaiting Client Agreement"}
                </span>
              </div>

              {/* Verified Dropped Slot Card */}
              <div className="flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {pipelinePhase === 3 ? (
                    <motion.div
                      key="calendar-card"
                      initial={{ opacity: 0, scale: 0.92, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="w-full rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-4 shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[13px] font-black text-[#09090b] dark:text-white">
                            Cosmetic Consultation & Polish
                          </div>
                          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Thu, Nov 12 &bull; 4:30 PM &ndash; 5:15 PM
                          </div>
                        </div>
                        <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          Valet Reserved
                        </span>
                      </div>

                      <div className="border-t border-slate-100 dark:border-neutral-800 pt-2.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex justify-between">
                          <span className="text-slate-400 dark:text-slate-500">Patient:</span>
                          <span className="font-semibold text-[#09090b] dark:text-white">Marcus Vance</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 dark:text-slate-500">Provider:</span>
                          <span className="font-semibold text-[#09090b] dark:text-white">Dr. Mansoor (Suite 4)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 dark:text-slate-500">Location:</span>
                          <div className="flex items-center gap-1">
                            <span className="filter blur-[3px] select-none text-slate-500 dark:text-slate-400">Al Manara Luxury</span>
                            <span>(Downtown Dubai)</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-8 text-slate-400 space-y-2">
                      <div className="w-7 h-7 rounded-full border-2 border-dashed border-slate-300 dark:border-neutral-700 mx-auto animate-spin" />
                      <p className="text-xs font-medium">Monitoring WhatsApp intent...</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-neutral-800">
                <span>Webhook Triggered</span>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Latency: 1.1s</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export const WorkflowPipelineSection = AutomatedPipelineLoop;
export default AutomatedPipelineLoop;
