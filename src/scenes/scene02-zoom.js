import gsap from "gsap";
import { TIMINGS } from "../utils/constants.js";
import { el } from "../utils/dom.js";

export function createScene(phoneRefs) {
  const tl = gsap.timeline();
  const botBubble = phoneRefs.botBubble;

  // Build external panel (Stage right)
  const panel = el("div", { className: "scene02-panel" }, [
    el("h3", { textContent: "Etapa 1" }),
    el("p", {
      textContent:
        "A mensagem é recebida e encaminhada para o nosso sistema de análise inteligente.",
    }),
  ]);
  phoneRefs.stage.appendChild(panel);
  const panelTitle = panel.querySelector("h3");
  const panelText = panel.querySelector("p");
  phoneRefs.stageOnePanel = panel;
  phoneRefs.stageOnePanelTitle = panelTitle;
  phoneRefs.stageOnePanelText = panelText;

  // Align transform-origin with the bot message
  const bubbleRect = botBubble.getBoundingClientRect();
  const phoneRect = phoneRefs.root.getBoundingClientRect();
  const originX = bubbleRect.left + bubbleRect.width / 2 - phoneRect.left;
  const originY = bubbleRect.top + bubbleRect.height / 2 - phoneRect.top;
  gsap.set(phoneRefs.root, { transformOrigin: `${originX}px ${originY}px` });
  gsap.set(panel, { opacity: 1, x: 0 });

  // 1. Phone zooms in and shifts left for split screen
  tl.to(phoneRefs.root, {
    scale: 1.45,
    x: "-30vw",
    duration: TIMINGS.phoneMove,
    ease: "power3.inOut",
  });

  // 2. Neon text glow on bot message
  const botText = botBubble.querySelector(".wa-bubble__text");
  tl.fromTo(
    botText,
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
    "-=0.3"
  );

  // 3. External panel slides in with stagger
  tl.from(
    [panelTitle, panelText],
    {
      opacity: 0,
      x: 50,
      duration: 0.6,
      stagger: 0.12,
      ease: "power2.out",
    },
    "<"
  );

  // Hold
  tl.to({}, { duration: 0.6 });

  return tl;
}
