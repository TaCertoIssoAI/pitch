/**
 * slide-3.js — Traction slide
 *
 * Phone zooms out. Arrow/annotation hide. Chat cross-fades back to default.
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

    // DOM references
    const arrowSvg       = document.getElementById('arrow-svg');
    const annotation     = document.getElementById('arrow-annotation');
    const defaultContent = phone.querySelector('.phone-content-default');
    const chatContent    = phone.querySelector('.phone-content-chat');
    const userBubble     = phone.querySelector('.chat-bubble--user');
    const typingBubble   = phone.querySelector('.chat-bubble--typing');
    const botBubble      = phone.querySelector('.chat-bubble--bot');

    // ── 0.0s — z-index swap ──────────────────────────────
    tl.set(toConfig.element,   { zIndex: 10 }, 0);
    tl.set(fromConfig.element, { zIndex: 5  }, 0);

    // ── 0.0s — Arrow and annotation fade out (0.3s) ──────
    tl.fromTo(arrowSvg,
      { opacity: 1 },
      { opacity: 0, duration: 0.3, ease: 'power2.in' },
      0
    );
    tl.fromTo(annotation,
      { opacity: 1, y: 0 },
      { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in' },
      0
    );

    // ── 0.0s — Slide-2 content fades out (0.35s) ────────
    tl.to(fromConfig.element.querySelector('.slide__content'), {
      opacity: 0,
      y: -25,
      duration: 0.35,
      ease: 'power2.in'
    }, 0);

    // ── 0.0s — Phone zoom-out (scale 2.8→0.95, 1.0s) ───
    tl.fromTo(phone,
      { ...fromConfig.sharedElements.phone },
      {
        ...toConfig.sharedElements.phone,
        duration: 1.0,
        ease: 'power3.inOut'
      },
      0
    );

    // ── 0.2s — Chat content fades out (0.4s) ────────────
    tl.fromTo(chatContent,
      { opacity: 1 },
      { opacity: 0, duration: 0.4, ease: 'power2.inOut' },
      0.2
    );

    // ── 0.3s — Default content fades in (0.4s) ──────────
    tl.fromTo(defaultContent,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.inOut' },
      0.3
    );

    // ── 0.35s — Slide-3 content enters from below (0.55s)
    tl.fromTo(toConfig.element.querySelector('.slide__content'),
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
      0.35
    );

    // ── 0.6s — Reset all chat bubbles for re-animation ──
    tl.fromTo(userBubble,
      { opacity: 1, y: 0 },
      { opacity: 0, y: 12, duration: 0.01 },
      0.6
    );
    tl.fromTo(typingBubble,
      { opacity: 0, scale: 0.6 },
      { opacity: 0, scale: 0, duration: 0.01 },
      0.6
    );
    tl.fromTo(botBubble,
      { opacity: 1, scale: 1 },
      { opacity: 0, scale: 0, duration: 0.01 },
      0.6
    );

    // ── end — Normalize z-index ──────────────────────────
    tl.set(fromConfig.element, { zIndex: 1 }, '>');

    return tl;
  }
};
