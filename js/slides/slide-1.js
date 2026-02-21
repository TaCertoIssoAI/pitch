/**
 * slide-1.js — "Como funciona" / Chat interativo
 *
 * Phone moves right-center. Default phone content cross-fades to WhatsApp chat.
 * Chat bubbles animate in sequentially.
 * This buildTransition animates FROM slide-0 TO slide-1.
 */
window.Slide1Config = {
  id: 'slide-1',
  index: 1,
  element: null,

  sharedElements: {
    phone: {
      x: '55vw',
      y: '50vh',
      xPercent: -50,
      yPercent: -50,
      scale: 1.05,
      rotation: 0,
      opacity: 1
    }
  },

  buildTransition(fromConfig, toConfig) {
    const tl    = gsap.timeline({ paused: true });
    const phone = window.SharedElements.phone;

    // DOM references
    const defaultContent = phone.querySelector('.phone-content-default');
    const chatContent    = phone.querySelector('.phone-content-chat');
    const userBubble     = phone.querySelector('.chat-bubble--user');
    const botBubble      = phone.querySelector('.chat-bubble--bot');

    // ── 0.0s — z-index swap ──────────────────────────────
    tl.set(toConfig.element,   { zIndex: 10 }, 0);
    tl.set(fromConfig.element, { zIndex: 5  }, 0);

    // ── 0.0s — Phone travels to slide-1 position (0.9s) ─
    tl.fromTo(phone,
      { ...fromConfig.sharedElements.phone },
      {
        ...toConfig.sharedElements.phone,
        duration: 0.9,
        ease: 'power3.inOut'
      },
      0
    );

    // ── 0.0s — Slide-0 content fades out upward (0.35s) ─
    tl.to(fromConfig.element.querySelector('.slide__content'), {
      opacity: 0,
      y: -25,
      duration: 0.35,
      ease: 'power2.in'
    }, 0);

    // ── 0.2s — Default phone content fades out (0.4s) ────
    tl.fromTo(defaultContent,
      { opacity: 1 },
      { opacity: 0, duration: 0.4, ease: 'power2.inOut' },
      0.2
    );

    // ── 0.3s — Chat content fades in (0.4s) ─────────────
    tl.fromTo(chatContent,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.inOut' },
      0.3
    );

    // ── 0.35s — Slide-1 text enters from left (0.55s) ───
    tl.fromTo(toConfig.element.querySelector('.slide__content'),
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out' },
      0.35
    );

    // ── 1.0s — User bubble slides in (0.4s) ─────────────
    tl.fromTo(userBubble,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
      1.0
    );

    // ── 1.6s — Bot bubble slides in (0.4s) ──────────────
    tl.fromTo(botBubble,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
      1.6
    );

    // ── end — Normalize z-index ──────────────────────────
    tl.set(fromConfig.element, { zIndex: 1 }, '>');

    return tl;
  }
};
