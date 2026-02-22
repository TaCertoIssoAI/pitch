import gsap from "gsap";
import { el } from "../utils/dom.js";
import { TIMINGS } from "../utils/constants.js";

/**
 * Factory that builds a split-screen "etapa" scene.
 *
 * @param {object}  phoneRefs       – shared refs from the phone component
 * @param {object}  opts
 * @param {boolean} opts.movePhone  – true if phone needs to travel from 20vw → -25vw
 * @param {Element} opts.section    – the .msg-section to scroll to & highlight
 * @param {Element|null} opts.prevSection – previous section to un-highlight (null on first)
 * @param {string}  opts.title      – panel heading
 * @param {string}  opts.text       – panel body
 */
export function createEtapaScene(phoneRefs, opts) {
  const tl = gsap.timeline();

  // ── Build panel ──
  const panel = el("div", { className: "stage-panel" }, [
    el("h3", { textContent: opts.title }),
    el("p", { textContent: opts.text }),
  ]);
  phoneRefs.stage.appendChild(panel);
  const panelTitle = panel.querySelector("h3");
  const panelText = panel.querySelector("p");
  gsap.set(panel, { opacity: 1, x: 0 });
  gsap.set([panelTitle, panelText], { opacity: 0, x: 50 });

  // ── 1. Move phone to split-screen left (if needed) ──
  if (opts.movePhone) {
    tl.to(phoneRefs.root, {
      x: "-25vw",
      duration: TIMINGS.phoneMove,
      ease: "power3.inOut",
    });
  }

  // ── 2. Reset neon on previous section ──
  if (opts.prevSection) {
    tl.to(opts.prevSection, {
      color: "#e9edef",
      textShadow: "0 0 0px rgba(32,198,89,0)",
      duration: 0.4,
      ease: "power2.out",
    }, opts.movePhone ? "<" : "+=0");
  }

  // ── 3. Auto-scroll to current section ──
  const messagesEl = phoneRefs.messages;
  tl.to(messagesEl, {
    scrollTop: () => opts.section.offsetTop - 20,
    duration: 0.8,
    ease: "power2.inOut",
  }, opts.prevSection ? "<+0.1" : (opts.movePhone ? "<+0.3" : "+=0"));

  // ── 4. Neon highlight on current section ──
  tl.fromTo(
    opts.section,
    {
      color: "#e9edef",
      textShadow: "0 0 0px rgba(32,198,89,0)",
    },
    {
      color: "#20c659",
      textShadow:
        "0 0 6px rgba(32,198,89,0.5), 0 0 20px rgba(32,198,89,0.25), 0 0 44px rgba(32,198,89,0.1)",
      duration: 0.7,
      ease: "power2.out",
    },
    "<+0.3"
  );

  // ── 5. Panel fade-in with stagger ──
  tl.fromTo(
    [panelTitle, panelText],
    { opacity: 0, x: 50 },
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: "power2.out",
    },
    "<"
  );

  // ── 6. Hold ──
  tl.to({}, { duration: 0.6 });

  // Store panel ref so the next scene can fade it out
  return { tl, panel, panelTitle, panelText };
}
