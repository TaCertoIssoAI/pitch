/**
 * shared-elements.js
 * Centralized DOM references for elements that live in #global-layer.
 * Must be loaded before slide configs and orchestrator.
 */
window.SharedElements = {
  phone: null,

  init() {
    this.phone = document.getElementById('phone-mockup');

    if (!this.phone) {
      console.error('[SharedElements] #phone-mockup not found in DOM.');
    }
  }
};
