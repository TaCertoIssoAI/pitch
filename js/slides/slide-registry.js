/**
 * slide-registry.js
 * Single source of truth for slide order.
 * To add a new slide: import its config script BEFORE this file,
 * then append its config object to this array. Nothing else changes.
 */
window.SlideRegistry = [
  window.Slide0Config,
  window.Slide1Config,
  window.Slide2Config,
  window.Slide3Config,
];
