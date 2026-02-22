import gsap from "gsap";
import { createWhatsAppChat, createBubble } from "../components/whatsapp/whatsapp.js";
import { createTypingIndicator } from "../components/whatsapp/typingIndicator.js";
import { TIMINGS, EASINGS } from "../utils/constants.js";

export function createScene(phoneRefs) {
  const tl = gsap.timeline();

  // Build WhatsApp UI inside the phone screen
  const { messages } = createWhatsAppChat(phoneRefs.screen);

  // Create DOM elements (always present, animated via opacity)
  const userMsg = "Vacina causa autismo?";
  const userBubble = createBubble("user", userMsg);
  const { container: typingEl, startLoop, killLoop } = createTypingIndicator();
  const botBubble = createBubble("bot", "", { replyTo: userMsg });

  messages.appendChild(userBubble);
  messages.appendChild(typingEl);
  messages.appendChild(botBubble);

  // Export botBubble ref for scene02 neon effect
  phoneRefs.botBubble = botBubble;

  // 1. Set phone to center
  tl.set(phoneRefs.root, { x: 0, y: 0, scale: 1, rotation: 0 });

  // 2. User message slides in
  tl.fromTo(
    userBubble,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: TIMINGS.msgSlideIn, ease: EASINGS.msgIn }
  );

  // 3. Typing indicator pops in (scale + height expand)
  tl.fromTo(
    typingEl,
    { scale: 0, opacity: 0, height: 0, padding: "0 14px" },
    {
      scale: 1,
      opacity: 1,
      height: 29,           // 5px dots + 12px×2 padding
      padding: "12px 14px",
      duration: 0.3,
      ease: "back.out(1.4)",
      onStart: startLoop,
      onReverseComplete: killLoop,
    }
  );

  // 4. Hold
  tl.to({}, { duration: TIMINGS.typingHold });

  // 5. Typing pops out + collapses height so bot takes its exact position
  tl.to(typingEl, {
    scale: 0,
    opacity: 0,
    height: 0,
    padding: "0 14px",
    duration: 0.2,
    ease: "power2.in",
    onComplete: killLoop,
    onReverseComplete: startLoop,
  });

  tl.fromTo(
    botBubble,
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: TIMINGS.botReply, ease: EASINGS.msgIn },
    "-=0.1"
  );

  // Set bot text via TextPlugin
  tl.to(
    botBubble.querySelector(".wa-bubble__text"),
    {
      duration: 0.8,
      text: "Estou analisando a mensagens para verificar se é fake news. Isso pode levar de 10 segundos a 1 minuto.",
      ease: "none",
    },
    "<"
  );

  // Small pause at end
  tl.to({}, { duration: TIMINGS.scenePause });

  return tl;
}
