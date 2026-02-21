/**
 * slide-1.js — Problem slide
 *
 * Phone moves to the right side.
 * Text content enters from the left.
 * This buildTransition animates FROM slide-0 TO slide-1.
 */
window.Slide1Config = {
  id: 'slide-1',
  index: 1,
  element: null,

  sharedElements: {
    phone: {
      x: '67vw',
      y: '50vh',
      xPercent: -50,
      yPercent: -50,
      scale: 0.9,
      rotation: 4,
      opacity: 1
    }
  },

  buildTransition(fromConfig, toConfig) {
    const tl    = gsap.timeline({ paused: true });
    const phone = window.SharedElements.phone;

    // ── 0.0s ─────────────────────────────────────────────
    // Bring destination slide to front immediately
    tl.set(toConfig.element,   { zIndex: 10 }, 0);
    tl.set(fromConfig.element, { zIndex: 5  }, 0);

    // ── 0.0s ─────────────────────────────────────────────
    // Phone travels from slide-0 center → slide-1 right position
    tl.fromTo(phone,
      { ...fromConfig.sharedElements.phone },
      {
        ...toConfig.sharedElements.phone,
        duration: 0.9,
        ease: 'power3.inOut'
      },
      0
    );

    // ── 0.0s ─────────────────────────────────────────────
    // Slide-0 content fades out upward
    tl.to(fromConfig.element.querySelector('.slide__content'), {
      opacity: 0,
      y: -25,
      duration: 0.35,
      ease: 'power2.in'
    }, 0);

    // ── 0.35s ─────────────────────────────────────────────
    // Slide-1 content fades in from the left
    tl.fromTo(toConfig.element.querySelector('.slide__content'),
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out' },
      0.35
    );

    // ── end ───────────────────────────────────────────────
    // Normalize z-index: origin slide goes back to base layer
    tl.set(fromConfig.element, { zIndex: 1 }, '>');

    return tl;
  }
};
