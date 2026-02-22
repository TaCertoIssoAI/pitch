import gsap from "gsap";
import { el } from "../../utils/dom.js";

export function createTypingIndicator() {
  const dot1 = el("div", { className: "wa-typing__dot" });
  const dot2 = el("div", { className: "wa-typing__dot" });
  const dot3 = el("div", { className: "wa-typing__dot" });
  const container = el("div", { className: "wa-typing" }, [dot1, dot2, dot3]);

  let loopTL = null;

  function startLoop() {
    loopTL = gsap.timeline({ repeat: -1 });
    loopTL
      .to(dot1, { y: -3, duration: 0.3, ease: "power1.out" })
      .to(dot1, { y: 0, duration: 0.3, ease: "power1.in" })
      .to(dot2, { y: -3, duration: 0.3, ease: "power1.out" }, 0.15)
      .to(dot2, { y: 0, duration: 0.3, ease: "power1.in" }, 0.45)
      .to(dot3, { y: -3, duration: 0.3, ease: "power1.out" }, 0.3)
      .to(dot3, { y: 0, duration: 0.3, ease: "power1.in" }, 0.6);
  }

  function killLoop() {
    if (loopTL) {
      loopTL.kill();
      loopTL = null;
      gsap.set([dot1, dot2, dot3], { y: 0 });
    }
  }

  return { container, startLoop, killLoop };
}
