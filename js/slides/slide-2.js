/**
 * slide-2.js — Solution slide
 *
 * Phone moves to the bottom-left, tilted.
 * Text content enters from the right.
 * This buildTransition animates FROM slide-1 TO slide-2.
 */
window.Slide2Config = {
  id: 'slide-2',
  index: 2,
  element: null,

  sharedElements: {
    phone: {
      x: '72vw',
      y: '55vh',
      xPercent: -50,
      yPercent: -50,
      scale: 0.85,
      rotation: -5,
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
    // Phone travels from slide-1 position → slide-2 position
    tl.fromTo(phone,
      { ...fromConfig.sharedElements.phone },
      {
        ...toConfig.sharedElements.phone,
        duration: 0.85,
        ease: 'power3.inOut'
      },
      0
    );

    // ── 0.0s ─────────────────────────────────────────────
    // Slide-1 content fades out to the left
    tl.to(fromConfig.element.querySelector('.slide__content'), {
      opacity: 0,
      x: -30,
      duration: 0.35,
      ease: 'power2.in'
    }, 0);

    // ── 0.3s ─────────────────────────────────────────────
    // Slide-2 content enters from the right
    tl.fromTo(toConfig.element.querySelector('.slide__content'),
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out' },
      0.3
    );

    // ── end ───────────────────────────────────────────────
    tl.set(fromConfig.element, { zIndex: 1 }, '>');

    return tl;
  }
};
