import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Guard window checks for SSR safety
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
export default gsap;
