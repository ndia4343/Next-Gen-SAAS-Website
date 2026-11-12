import { FaqItemConfig, SiteConfig } from '@/types/site-config';

// TODO: Set your international WhatsApp number e.g. "971500000000" to activate button
export const WHATSAPP_NUMBER: string = '';

// Generic scope-based onboarding timeline & language defaults
export const SETUP_TIMELINE: string =
  'the decided timeline based on the project details and scope of work';

export const SUPPORTED_LANGUAGES: string =
  'languages tailored to the project details and scope of work';

export type FaqEntry = FaqItemConfig;

export const DEFAULT_FAQ_ITEMS: FaqEntry[] = [
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
    question: 'Does it work with our existing calendar or booking system?',
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
    question: 'Which languages does the receptionist support?',
    answer:
      'Supported languages are configured as per the project details and scope of work, with natural pronunciation and accent recognition.',
  },
  {
    id: 'setup-timeline',
    question: 'How long does setup take?',
    answer:
      'Full onboarding, script testing, and calendar integration are delivered on the decided timeline as per the project details and scope of work.',
  },
];

// TODO: Set founder details to render the "Who's Behind This" section on the storefront
export const FOUNDER_NAME: string = '{{FOUNDER_NAME}}';
export const FOUNDER_ONE_LINER: string = '{{FOUNDER_ONE_LINER}}';
export const FOUNDER_PHOTO_URL: string = '';

export const defaultConfig: SiteConfig = {
  branding: {
    companyName: 'ZAVIAN LABS',
    tagline: 'AI VOICE RECEPTIONIST FOR CLINICS & AESTHETICS PRACTICES',
    logoTextPrimary: 'ZAVIAN',
    logoTextSecondary: 'LABS',
    logoIconSize: 36,
    logoImageUrl: '/images/zavian-cube-mark.png',
    contactEmail: 'contact@zavianlabs.com',
    calendarBookingUrl: 'https://calendar.app.google/u5vL88X41qmGBCky5',
    enableLightMode: true,
  },
  hero: {
    eyebrowBadge: 'Technology that picks up the phone.',
    headlinePrefix: 'Never miss',
    headlineAccent: 'another',
    headlineSuffix: 'patient call.',
    headlineFontSize: 88,
    headlineFontWeight: 'font-normal',
    headlineFontFamily: 'serif',
    subheadline:
      'An AI receptionist that answers every call, books into your calendar and confirms with the patient, day or night. Built for clinics and aesthetics practices.',
    primaryCtaText: 'Hear it answer a call',
    primaryCtaLink: '#voice-simulation',
    secondaryCtaText: 'Book a free missed-call audit',
    secondaryCtaLink: 'https://calendar.app.google/u5vL88X41qmGBCky5',
  },
  marquee: {
    items: [
      '24/7 CALL PICKUP',
      'CALENDAR BOOKINGS',
      'WHATSAPP CONFIRMATIONS',
      'AFTER-HOURS COVERAGE',
      'CUSTOM WORKFLOWS',
    ],
    speedSeconds: 26,
  },
  voiceTheatre: {
    sectionEyebrow: '01 — Clinic Call & Booking Demo',
    sectionTitle: 'Never lose a patient call to',
    sectionTitleAccent: 'voicemail.',
    sectionDescription:
      'Every missed call is a patient booking lost to another clinic. Here is how our receptionist handles inquiries, calendar bookings, and follow-ups. (Select other sectors below to preview adapted workflows).',
    demoAudioUrl: '/audio/clinic-demo.mp3',
    industries: [
      {
        id: 'dental',
        label: 'Dental & Aesthetics',
        channelNote: 'Voice Sample + Calendar Booking',
        regionBadge: 'UAE Clinics · AED',
        agentName: 'Sarah',
        agentRole: 'Clinic Front-Desk Receptionist',
        callerName: 'Marcus Vance',
        script: [
          {
            at: 0,
            who: 'Patient (Marcus)',
            isAi: false,
            text: "Hi, I work in town and usually finish late. Do you have an assessment slot for clear aligners after 5:30 PM this week?",
          },
          {
            at: 5,
            who: 'Sarah · Reception Desk',
            isAi: true,
            text: 'Yes, we keep evening appointments open on weekdays. Dr. Thorne has Thursday at 6:00 PM or Saturday morning at 10:30 AM. Both include a 3D scan.',
          },
          {
            at: 11,
            who: 'Patient (Marcus)',
            isAi: false,
            text: 'Thursday at 6:00 PM works best for my commute.',
          },
          {
            at: 15,
            who: 'Sarah · Reception Desk',
            isAi: true,
            text: "Reserved in Treatment Room 2 for Thursday at 6:00 PM. I'm sending your parking directions and WhatsApp confirmation now.",
          },
        ],
        lockedSlotMessage: 'Thursday · 6:00 PM · Aligner Assessment + 3D Scan',
        lockedSlotSub: 'Booked on clinic calendar · Treatment Room 2 (Dr. Thorne)',
        completionSummary:
          'Sarah just qualified the caller and booked Treatment Room 2 in under 28 seconds.',
        whatsAppContactName: 'Sarah • Clinic Desk',
        whatsAppNotice:
          'Hi Marcus — your aligner assessment & 3D scan with Dr. Thorne is reserved for Thursday at 6:00 PM (Treatment Room 2). Tap below to confirm.',
        whatsAppReply: '1 — Confirm',
        whatsAppFollowup:
          'Thank you Marcus! Treatment Room 2 is confirmed on our calendar. We have sent the calendar invite to your phone.',
        whatsAppAttachmentName: 'Clinic_Appointment_Invite.ics',
        whatsAppAttachmentMeta: 'Treatment Room 2 • Clinic Parking Guide',
        outcomes: [
          'Picks up after-hours & busy front-desk clinic calls right away',
          'Checks clinician availability and books directly onto your calendar',
          'Sends clear WhatsApp appointment passes and directions automatically',
        ],
      },
      {
        id: 'solar',
        label: 'Solar Pipeline',
        channelNote: 'Automated Quote & Survey Flow',
        regionBadge: 'Regional Solar · Custom Quotes',
        agentName: 'Hassan',
        agentRole: 'Solar Pipeline Survey Coordinator',
        callerName: 'Tariq Mahmood',
        script: [
          {
            at: 0,
            who: 'Homeowner (Tariq)',
            isAi: false,
            text: 'My summer electricity bill hit Rs 98,000 last month. Can your team quote a 10 or 12 kW system and visit this week?',
          },
          {
            at: 5,
            who: 'Hassan · Solar Pipeline Desk',
            isAi: true,
            text: 'Based on 1,450 monthly units, a 12 kW hybrid system covers most of your usage. Would Wednesday at 10:00 AM work for a roof survey?',
          },
          {
            at: 11,
            who: 'Homeowner (Tariq)',
            isAi: false,
            text: 'Yes, Wednesday at 10 works. Can you send the cost breakdown first?',
          },
          {
            at: 15,
            who: 'Hassan · Solar Pipeline Desk',
            isAi: true,
            text: "Done — I've booked Wednesday 10:00 AM with our survey engineer and sent your custom 12 kW PDF estimate to WhatsApp.",
          },
        ],
        lockedSlotMessage: 'Wednesday · 10:00 AM · 12 kW Site Survey',
        lockedSlotSub: 'Tariff Estimate Sent + Survey Engineer Assigned',
        completionSummary:
          'Hassan just sized the 12 kW request, booked the site survey, and sent the WhatsApp estimate.',
        whatsAppContactName: 'Hassan • Solar Pipeline',
        whatsAppNotice:
          'Solar Pipeline Estimate: Recommended 12 kW Hybrid system for your monthly bill (~Rs 74,000/mo illustrative savings). Survey booked Wednesday 10:00 AM.',
        whatsAppReply: '1 — Confirm Survey',
        whatsAppFollowup:
          'Confirmed! Your engineer visit and 12 kW system estimate are locked for Wednesday at 10:00 AM.',
        whatsAppAttachmentName: 'SolarPipeline_12kW_Estimate.pdf',
        whatsAppAttachmentMeta: '12 kW Sizing • Example Payback Summary',
        outcomes: [
          'Sizes solar kW options from utility bills in plain conversation',
          'Sends branded PDF quotes directly into WhatsApp',
          'Books site engineers without losing evening or weekend inquiries',
        ],
      },
      {
        id: 'hr',
        label: 'HR & Recruitment',
        channelNote: 'Candidate Screening Flow',
        regionBadge: 'Hiring & Staffing · Multi-Timezone',
        agentName: 'Maya',
        agentRole: 'Candidate Screening Coordinator',
        callerName: 'Bilal Ahmed',
        script: [
          {
            at: 0,
            who: 'Candidate (Bilal)',
            isAi: false,
            text: "I'm calling about the Senior Accountant opening. Are you still shortlisting candidates this week?",
          },
          {
            at: 5,
            who: 'Maya · Recruitment Desk',
            isAi: true,
            text: 'Yes, the role is open. To save time before our recruiter call, what is your notice period and are you comfortable working on-site?',
          },
          {
            at: 11,
            who: 'Candidate (Bilal)',
            isAi: false,
            text: '30 days notice, and on-site works well for me.',
          },
          {
            at: 15,
            who: 'Maya · Recruitment Desk',
            isAi: true,
            text: "Great — I've booked your 15-minute recruiter screen for tomorrow at 11:00 AM and texted you a WhatsApp link to drop your CV.",
          },
        ],
        lockedSlotMessage: 'Tomorrow · 11:00 AM · Recruiter Call Booked',
        lockedSlotSub: 'Senior Accountant Role • CV & 30-Day Notice Logged',
        completionSummary:
          'Maya just screened the candidate, noted notice period, and booked the recruiter call.',
        whatsAppContactName: 'Maya • Talent Desk',
        whatsAppNotice:
          'Hi Bilal — your screening call for Senior Accountant is booked for tomorrow at 11:00 AM. Confirm your 30-day notice period and share your CV below.',
        whatsAppReply: '1 — Confirm + Attach CV',
        whatsAppFollowup:
          'Received and added to your candidate folder. Speak tomorrow at 11:00 AM!',
        whatsAppAttachmentName: 'Bilal_Ahmed_CV.pdf',
        whatsAppAttachmentMeta: '30 Days Notice • Candidate Notes',
        outcomes: [
          'Asks role fit, availability & notice period automatically',
          'Books suitable candidates straight onto recruiter calendars',
          'Collects CVs in WhatsApp ahead of the interview',
        ],
      },
      {
        id: 'custom',
        label: 'Custom Workflows',
        channelNote: 'Tailored Booking & Dispatch Flow',
        regionBadge: 'Custom Schedules · Any Timezone',
        agentName: 'Zed',
        agentRole: 'Operations Coordinator',
        callerName: 'Nadia Al-Mansoor',
        script: [
          {
            at: 0,
            who: 'Client (Nadia)',
            isAi: false,
            text: 'We have three commercial units tripping in Warehouse 4. Can someone inspect before Thursday?',
          },
          {
            at: 5,
            who: 'Zed · Dispatch Desk',
            isAi: true,
            text: 'We have an open crew slot Tuesday at 2:00 PM or Wednesday at 9:30 AM. Which fits your site access hours?',
          },
          {
            at: 11,
            who: 'Client (Nadia)',
            isAi: false,
            text: 'Tuesday 2:00 PM is ideal. Do you need a gate pass ahead of time?',
          },
          {
            at: 15,
            who: 'Zed · Dispatch Desk',
            isAi: true,
            text: "Yes please — I've booked Tuesday 2:00 PM under ticket #ZL-408 and sent a WhatsApp thread where you can drop the pin and gate pass.",
          },
        ],
        lockedSlotMessage: 'Tuesday · 2:00 PM · Inspection Dispatch #ZL-408',
        lockedSlotSub: 'Logged in Team Schedule + WhatsApp Thread Started',
        completionSummary:
          'Zed just logged ticket #ZL-408, booked the inspection slot, and sent WhatsApp follow-up instructions.',
        whatsAppContactName: 'Zed • Dispatch Desk',
        whatsAppNotice:
          'Ticket #ZL-408 is booked for Tuesday 2:00 PM (Warehouse 4). Confirm below to share your location pin and gate pass.',
        whatsAppReply: '1 — Confirm Dispatch',
        whatsAppFollowup:
          'Confirmed! Your gate pass and pin are logged with our dispatch team.',
        whatsAppAttachmentName: 'Warehouse4_Gate_Pass.pdf',
        whatsAppAttachmentMeta: 'Site Pin • Entry Pass',
        outcomes: [
          'Built around how your business answers calls and schedules jobs',
          'Collects site pins, photos, or entry passes inside WhatsApp',
          'Keeps every request and confirmation in one place',
        ],
      },
    ],
  },
  constellation: {
    sectionTitle: 'One desk.',
    sectionTitleAccent: 'Every booking connected.',
    sectionDescription:
      'Keep your phone calls, WhatsApp messages, and clinic calendars working together.',
    coreNodeTitle: 'ZAVIAN DESK',
    coreNodeDescription:
      'Centralizes every incoming inquiry and appointment into one reliable workflow.',
    coreNodeStatus: 'CONNECTED WORKFLOW',
    coreNodeSpecs: [
      { label: '01', value: 'Automatic Call & Booking Log' },
      { label: '02', value: 'Instant Human Front-Desk Handover' },
      { label: '03', value: 'Real-Time Booking Calendar Sync' },
    ],
    nodes: [
      {
        id: 'voice',
        label: 'Phone Receptionist',
        x: 102,
        y: 88,
        title: 'Phone Receptionist',
        description:
          'Answers incoming calls in your clinic tone, checks what the patient needs, and books or routes the request right away.',
        status: 'INBOUND CALLS',
        specs: [
          { label: 'Answer Speed', value: 'Answers in under a second' },
          { label: 'Coverage', value: 'Day, evening & weekend calls' },
          { label: 'Escalation', value: 'Transfers urgent calls to staff' },
        ],
      },
      {
        id: 'cal',
        label: 'Booking Calendar',
        x: 320,
        y: 48,
        title: 'Booking Calendar',
        description:
          'Checks open treatment rooms and practitioner slots directly so patients only book available times.',
        status: 'LIVE CALENDAR SYNC',
        specs: [
          { label: 'Compatible', value: 'Google Calendar, Cal.com & Clinic APIs' },
          { label: 'Double Booking', value: 'Checks open slots before booking' },
          { label: 'Updates', value: 'Syncs with your booking calendar' },
        ],
      },
      {
        id: 'crm',
        label: 'Patient Notes',
        x: 538,
        y: 88,
        title: 'Patient & Lead Notes',
        description:
          'Logs caller contact details, summary notes, and appointment status cleanly so your reception team never misses context.',
        status: 'FRONT DESK RECORDS',
        specs: [
          { label: 'Call Log', value: 'Full call transcript + summary' },
          { label: 'Privacy', value: 'Encrypted in transit and at rest' },
          { label: 'Follow-Up', value: 'Flags urgent questions for staff' },
        ],
      },
      {
        id: 'dash',
        label: 'Live Dashboard',
        x: 538,
        y: 332,
        title: 'Practice Dashboard',
        description:
          'Shows answered calls, booked appointments, and missed-call recoveries on one clear screen for practice managers.',
        status: 'CLINIC VISIBILITY',
        specs: [
          { label: 'Tracking', value: 'Calls answered & slots booked' },
          { label: 'Attribution', value: 'Daytime vs. after-hours volume' },
          { label: 'Summaries', value: 'Daily front-desk activity log' },
        ],
      },
      {
        id: 'api',
        label: 'Custom Integration',
        x: 320,
        y: 372,
        title: 'Clinic Software & APIs',
        description:
          'Connects cleanly with booking calendars, web forms, or bespoke internal tools built around how your team operates.',
        status: 'BESPOKE SOFTWARE',
        specs: [
          { label: 'Compatibility', value: 'Confirmed during discovery call' },
          { label: 'Security', value: 'Role-based staff access controls' },
          { label: 'Alerts', value: 'Instant WhatsApp or email handover' },
        ],
      },
      {
        id: 'wa',
        label: 'WhatsApp',
        x: 102,
        y: 332,
        title: 'WhatsApp Confirmations',
        description:
          'Follows up the call in WhatsApp with booking confirmations, clinic directions, or rescheduling options.',
        status: 'PATIENT MESSAGING',
        specs: [
          { label: 'Confirmations', value: 'Sends calendar invite & notes' },
          { label: 'Reminders', value: 'Clear time & parking instructions' },
          { label: 'Handover', value: 'Staff can step in anytime' },
        ],
      },
    ],
  },
  telemetry: {
    sectionTitle: 'See every call become a',
    sectionTitleAccent: 'tracked booking.',
    sectionDescription:
      'A clear view of after-hours call volume, booked treatment rooms, and front-desk time saved—syncing directly with your Google Calendar or scheduling software.',
    autoCycleSeconds: 4,
    sectors: [
      {
        id: 'dental',
        label: 'Dental & Aesthetics',
        badgeLabel: 'CLINIC SCHEDULE DEMO // SAMPLE TELEMETRY',
        chartTitle: 'Sample Patient Inquiry & After-Hours Call Curve',
        chartSubtitle: 'Illustrative demo showing evening & weekend inquiry capture (18:00–02:00)',
        kpis: [
          {
            label: 'Sample Booked Value (30D)',
            value: 'AED 218,400',
            delta: 'Example numbers to show what your dashboard will track',
          },
          {
            label: 'Sample Booking Rate',
            value: '42.6%',
            delta: 'Example numbers to show what your dashboard will track',
          },
          {
            label: 'Estimated Hours Saved',
            value: '118 Hrs/Mo',
            delta: 'Example numbers to show what your dashboard will track',
          },
        ],
        weeklyChartBars: [34, 42, 68, 86, 94, 88, 79, 52, 38, 45, 58, 64],
        barLabels: ['14:00', '16:00', '18:00', '20:00', '22:00', '00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00'],
        subCardTitle: 'Sample Treatment Room Schedule',
        subCardStatus: 'Sample Calendar Sync',
        subCardItems: [
          { title: 'Treatment Room 1 — Farah A.', subtitle: 'Aligners · RESERVED', metric: 'AED 3,800', time: 'Thu 6:00 PM' },
          { title: 'Treatment Room 2 — Marcus V.', subtitle: 'Consultation · CONFIRMED', metric: 'AED 2,400', time: 'Fri 4:30 PM' },
          { title: 'Treatment Room 3 — David W.', subtitle: 'Hygiene · CONFIRMED', metric: 'AED 1,250', time: 'Sat 10:30 AM' },
        ],
        highlightLabel: 'Sample After-Hours Coverage',
        highlightValue: 'Evening & Weekend Slots',
      },
      {
        id: 'solar',
        label: 'Solar Pipeline',
        badgeLabel: 'SOLAR PIPELINE DEMO // SAMPLE WORKFLOW',
        chartTitle: 'Sample Quote-to-Survey Tracking',
        chartSubtitle: 'Illustrative demo · sample workflow data for residential solar installers',
        kpis: [
          {
            label: 'Sample Quote Pipeline',
            value: 'Rs 48.5M',
            delta: 'Example numbers to show what your dashboard will track',
          },
          {
            label: 'Sample Survey Bookings',
            value: '31.4%',
            delta: 'Example numbers to show what your dashboard will track',
          },
          {
            label: 'Sample Quote Prep Time',
            value: '2.1 min',
            delta: 'Example numbers to show what your dashboard will track',
          },
        ],
        weeklyChartBars: [24, 34, 46, 58, 69, 78, 85, 90, 93, 96, 97, 98],
        barLabels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
        subCardTitle: 'Sample Solar Workflow Steps',
        subCardStatus: 'Illustrative Example',
        subCardItems: [
          { title: '01 · Utility Bill Sizing', subtitle: 'Sample tariff calculation', metric: '2.1 min', time: 'Example' },
          { title: '02 · Branded PDF Estimate', subtitle: 'WhatsApp follow-up', metric: 'Instant', time: 'Example' },
          { title: '03 · Roof Survey Booking', subtitle: 'Synced to calendar', metric: '31.4%', time: 'Example' },
        ],
        highlightLabel: 'Sample Conversion Preview',
        highlightValue: '98.2% Demo Peak',
      },
      {
        id: 'hr',
        label: 'HR & Recruitment',
        badgeLabel: 'RECRUITMENT DEMO // SAMPLE WORKFLOW',
        chartTitle: 'Sample Candidate Screening Funnel',
        chartSubtitle: 'Illustrative demo · automated initial screening to recruiter calendar booking',
        kpis: [
          {
            label: 'Sample Screenings',
            value: '1,240',
            delta: 'Example numbers to show what your dashboard will track',
          },
          {
            label: 'Sample Interview Rate',
            value: '38.7%',
            delta: 'Example numbers to show what your dashboard will track',
          },
          {
            label: 'Estimated Hours Saved',
            value: '84 Hrs/Mo',
            delta: 'Example numbers to show what your dashboard will track',
          },
        ],
        weeklyChartBars: [100, 87, 52, 39, 94, 92, 88, 95, 96, 91, 94, 98],
        barLabels: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'],
        subCardTitle: 'Sample Candidate Handoff',
        subCardStatus: 'Illustrative Example',
        subCardItems: [
          { title: 'Inbound Applicants', subtitle: '1,240 sample leads', metric: '100%', time: 'Stage 1' },
          { title: 'Initial Phone Screen', subtitle: '1,080 pre-screened', metric: '87.1%', time: 'Stage 2' },
          { title: 'Recruiter Call Booked', subtitle: '480 sample bookings', metric: '38.7%', time: 'Stage 4' },
        ],
        highlightLabel: 'Sample Bookings Tracked',
        highlightValue: '480 Sample Calls',
      },
    ],
  },
  faq: DEFAULT_FAQ_ITEMS,
};
