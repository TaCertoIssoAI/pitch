import gsap from "gsap";

const masterTL = gsap.timeline({ paused: true });

export function addScene(label, sceneTL) {
  masterTL.addLabel(label);
  masterTL.add(sceneTL, label);
  masterTL.addLabel(label + "_end");
}

export function getTimeline() {
  return masterTL;
}
