/**
 * slide-3.js — Traction slide
 *
 * Phone moves to the right side, slightly scaled down.
 * Text content enters from below.
 * This buildTransition animates FROM slide-2 TO slide-3.
 */
window.Slide3Config = {
  id: 'slide-3',
  index: 3,
  element: null,

  sharedElements: {
    phone: {
      x: '30vw',
      y: '50vh',
      xPercent: -50,
      yPercent: -50,
      scale: 0.95,
      rotation: 0,
      opacity: 1
    }
  },

  buildTransition(fromConfig, toConfig) {
    const tl    = gsap.timeline({ paused: true });
    const phone = window.SharedElements.phone;

    // ── 0.0s ─────────────────────────────────────────────
    tl.set(toConfig.element,   { zIndex: 10 }, 0);
    tl.set(fromConfig.element, { zIndex: 5  }, 0);

    // ── 0.0s ─────────────────────────────────────────────
    // Phone travels from slide-2 position → slide-3 position
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
    // Slide-2 content fades out upward
    tl.to(fromConfig.element.querySelector('.slide__content'), {
      opacity: 0,
      y: -25,
      duration: 0.35,
      ease: 'power2.in'
    }, 0);

    // ── 0.35s ────────────────────────────────────────────
    // Slide-3 content enters from below
    tl.fromTo(toConfig.element.querySelector('.slide__content'),
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
      0.35
    );

    // ── end ───────────────────────────────────────────────
    tl.set(fromConfig.element, { zIndex: 1 }, '>');

    return tl;
  }
};
