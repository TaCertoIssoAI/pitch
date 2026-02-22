import gsap from "gsap";
import { TIMINGS, EASINGS } from "../utils/constants.js";

export function createScene(phoneRefs) {
  const tl = gsap.timeline();
  const botBubble = phoneRefs.botBubble;
  const etapaLabel = botBubble.querySelector(".wa-etapa-label");

  // 1. Phone zooms in and shifts to vertically center the bot message
  tl.to(phoneRefs.root, {
    scale: 1.3,
    y: -60,
    duration: TIMINGS.phoneMove,
    ease: "power3.inOut",
  });

  // 2. Neon glow animates in (smooth energy effect via GSAP-driven boxShadow)
  tl.fromTo(
    botBubble,
    {
      borderColor: "rgba(0,255,0,0)",
      boxShadow: "0 0 0px rgba(0,255,0,0), 0 0 0px rgba(0,255,0,0)",
    },
    {
      borderColor: "rgba(0,255,0,0.55)",
      boxShadow:
        "0 0 6px rgba(0,255,0,0.3), 0 0 20px rgba(0,255,0,0.15), 0 0 44px rgba(0,255,0,0.06)",
      duration: 0.7,
      ease: "power2.out",
    },
    "-=0.3"
  );

  // 3. "ETAPA 1" label rises in from below
  tl.fromTo(
    etapaLabel,
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
    "-=0.35"
  );

  // Hold
  tl.to({}, { duration: 0.6 });

  return tl;
}
