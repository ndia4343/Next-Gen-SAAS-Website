# NEUROFLUX.AI · 3D SaaS & Agentic AI Engineering Agency Platform

A production-grade, Awwwards-caliber 3D SaaS and AI Engineering Agency web application built with **Next.js 15 (App Router, Turbopack, Server Actions)**, **React 19**, **Three.js / React Three Fiber**, **Tailwind CSS v4**, and **GSAP ScrollTrigger**.

---

## 🚀 Key Highlights & Architectural Features

### 1. 3D WebGL Rendering Pipeline
- **Fixed Persistent Canvas**: Non-blocking background WebGL scene (`pointer-events-none`) with `<AdaptiveDpr pixelated />` and `<Preload all />`.
- **Procedural 3D Neural Core**:
  - Inner procedural wireframe icosahedron with pulsing `#DC2626` emissive shader.
  - Orbiting refractive glass rings powered by `@react-three/drei`'s `<MeshTransmissionMaterial />`.
  - 1,800-point GPU particle field with `bufferGeometry` and additive blending.
  - Ambient `<Sparkles />` and dynamic directional/point lighting.
  - Zero state updates in `useFrame`: directly mutates mesh refs for 60 FPS performance.
  - **Scroll Choreography**: Synchronized with DOM scroll position via GSAP `ScrollTrigger` and `Lenis`.

### 2. Smooth Scroll Physics & Synchronization
- **Lenis Smooth Scroll** synced directly to `gsap.ticker.add((time) => lenis.raf(time * 1000))`.
- `gsap.ticker.lagSmoothing(0)` guarantees zero camera drift or jitter between the 3D scene and DOM elements.

### 3. Modern Design System & Obsidian Dark Mode
- **Tailwind CSS v4** CSS-first architecture (`src/app/globals.css`) via `@import "tailwindcss";` and `@theme`.
- Obsidian surfaces (`#060609`, `#0c0c12`), Crimson `#DC2626` accents, Vibrant Orange `#FF6B00`, and Electric Cyan `#00B4D8`.
- 3D perspective tilt cards with radial spotlight cursor tracking and elevated Z-depth (`translateZ(20px)`).

### 4. Interactive Sections Driven by Dynamic Content
- **Kinetic Hero Section**: Eyebrow badge with glowing beacon, staggered GSAP headline reveal (`useGSAP`), dual magnetic CTAs, and terminal HUD metric cards.
- **"Build & Grow" Core Expertise Matrix**: 3-column 3D perspective grid with live checklists, indigo checkmarks, and elevated featured tier.
- **Project Support Bento Grid**: 2x2 dark glass bento layout with capability badges, code/waveform thumbnail previews, and orange quote action triggers.
- **Floating Freya Voice AI Agent**: Fixed floating widget (`bottom-6 right-6 z-50`) with canvas audio waveform visualizer running on `requestAnimationFrame`, state machine (`idle`, `connecting`, `listening`, `speaking`), Web Speech API voice synthesis, and conversation transcript.
- **Context-Aware Quote Modal**: Accessible modal with pre-selected service tier, real-time feedback, optimistic loading state, and Zod-validated `/api/quote` route handler.

### 5. Live Backend Admin Panel (`/admin`)
- Full CRUD content management for Hero copy, Core Expertise cards, Project Support Bento cards, and Freya voice settings.
- Re-orderable Bento cards, toggleable 3D elevated states, and live checklist item management.
- Instant synchronization backed by atomic file writes to `src/data/content.json` and Next.js `revalidatePath` cache invalidation.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.1.4](https://nextjs.org/) (App Router, Server Actions, TypeScript)
- **UI Library**: [React 19](https://react.dev/)
- **3D Graphics**: [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei), [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing)
- **Animation & Physics**: [GSAP](https://greensock.com/gsap/) with `@gsap/react` and `ScrollTrigger`, [Lenis](https://lenis.darkroom.engineering/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/postcss`)
- **Icons & Validation**: [lucide-react](https://lucide.dev/), [zod](https://zod.dev/)

---

## 📦 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/ndia4343/Next-Gen-SAAS-Website.git
cd Next-Gen-SAAS-Website
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

### 4. Admin Content Management
Visit [http://localhost:3000/admin](http://localhost:3000/admin) to edit live copy, metrics, 3D cards, and Freya Voice AI settings.

---

## 📄 License
MIT License. Built for high-velocity software engineering and autonomous intelligence teams.
