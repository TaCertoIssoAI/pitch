/**
 * main.js — Entry point
 * Runs after all scripts are loaded.
 * Order: plugin registration → shared elements → orchestrator → navigator.
 */
(function () {
  'use strict';

  // 1. Register GSAP plugins
  gsap.registerPlugin(CustomEase);

  // 2. Define custom easing curves
  CustomEase.create('smoothSlide',  'M0,0 C0.25,0.1 0.25,1 1,1');
  CustomEase.create('snappyBounce', 'M0,0 C0.14,0 0.242,0.438 0.272,0.561 0.313,0.728 0.354,0.963 0.362,1 0.37,0.985 0.414,0.873 0.455,0.811 0.51,0.73 0.659,0.783 0.722,0.812 0.849,0.872 0.964,0.975 1,1');

  // 3. Wait for DOM
  document.addEventListener('DOMContentLoaded', function () {
    // 4. Initialize shared element references
    window.SharedElements.init();

    // 5. Build transitions from the registry
    const transitions = window.Orchestrator.init(window.SlideRegistry);

    // 6. Start navigator (binds all input events)
    window.Navigator.init(transitions, window.SlideRegistry.length);

    // 7. Entrance animation for slide 0
    const slide0Content = document.querySelector('#slide-0 .slide__content');
    if (slide0Content) {
      gsap.fromTo(slide0Content,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.3 }
      );
    }

    // 8. Phone entrance animation
    const phone = window.SharedElements.phone;
    if (phone) {
      gsap.fromTo(phone,
        { scale: 0.7, opacity: 0, rotation: -8 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1.1, ease: 'power3.out', delay: 0.2 }
      );
    }

    console.log('[Pitch] Ready. Slides:', window.SlideRegistry.length, '| Transitions:', transitions.length);
  });
})();
