import { el } from "../../utils/dom.js";
import { eventBus } from "../../core/eventBus.js";
import { goTo, prev, next, getLabels } from "../../core/navigator.js";
import "./nav.css";

export function createNav() {
  const labels = getLabels();
  const prevBtn = el("button", { className: "nav__arrow", textContent: "‹" });
  const nextBtn = el("button", { className: "nav__arrow", textContent: "›" });

  const dotsContainer = el("div", { className: "nav__dots" });
  const dots = labels.map((_, i) => {
    const dot = el("button", { className: "nav__dot" });
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
    return dot;
  });

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  const nav = el("div", { className: "nav" }, [prevBtn, dotsContainer, nextBtn]);
  document.body.appendChild(nav);

  function update(index) {
    dots.forEach((d, i) => {
      d.classList.toggle("nav__dot--active", i === index);
    });
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === labels.length - 1;
  }

  update(0);
  eventBus.on("slideChanged", update);
}
