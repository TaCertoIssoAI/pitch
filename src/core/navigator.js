import { getTimeline } from "./masterTimeline.js";
import { eventBus } from "./eventBus.js";

let currentIndex = 0;
let isAnimating = false;
const labels = [];

export function registerLabel(label) {
  labels.push(label);
}

export function getLabels() {
  return labels;
}

export function getCurrentIndex() {
  return currentIndex;
}

export function goTo(index) {
  if (isAnimating || index < 0 || index >= labels.length) return;
  isAnimating = true;
  currentIndex = index;
  getTimeline().tweenTo(labels[index] + "_end", {
    duration: 1.2,
    ease: "power2.inOut",
    onComplete: () => {
      isAnimating = false;
      eventBus.emit("slideChanged", index);
    },
  });
}

export function next() {
  goTo(currentIndex + 1);
}

export function prev() {
  goTo(currentIndex - 1);
}

export function initKeyboard() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
  });
}
