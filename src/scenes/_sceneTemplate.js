import gsap from "gsap";

/**
 * Scene Template
 *
 * To create a new scene:
 * 1. Copy this file and rename to sceneNN-name.js
 * 2. Implement createScene(phoneRefs) — must return a gsap.timeline()
 * 3. Import and add to the array in scenes/index.js
 *
 * Rules:
 * - First tween MUST set phoneRefs.root position explicitly (no implicit state)
 * - Never remove DOM nodes — use opacity for show/hide
 * - For looping animations, start in onStart, kill in onReverseComplete
 */
export function createScene(phoneRefs) {
  const tl = gsap.timeline();

  // Set phone initial state for this scene
  tl.set(phoneRefs.root, { x: 0, y: 0, scale: 1, rotation: 0 });

  // ... your animations here ...

  return tl;
}
