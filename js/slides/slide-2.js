/**
 * slide-2.js — Zoom-in + SVG arrow + annotation
 *
 * Phone zooms in to the left side (scale 2.8).
 * SVG arrow draws itself, annotation text fades in.
 * This buildTransition animates FROM slide-1 TO slide-2.
 */
window.Slide2Config = {
  id: 'slide-2',
  index: 2,
  element: null,

  sharedElements: {
    phone: {
      x: '25vw',
      y: '50vh',
      xPercent: -50,
      yPercent: -50,
      scale: 2.8,
      rotation: 0,
      opacity: 1
    }
  },

  buildTransition(fromConfig, toConfig) {
    const tl    = gsap.timeline({ paused: true });
    const phone = window.SharedElements.phone;

    // DOM references
    const arrowSvg        = document.getElementById('arrow-svg');
    const arrowPath       = document.getElementById('arrow-path');
    const arrowHead       = document.getElementById('arrow-head');
    const annotation      = document.getElementById('arrow-annotation');

    // Measure path length for stroke-dashoffset animation
    const pathLength = arrowPath.getTotalLength();

    // ── 0.0s — z-index swap ──────────────────────────────
    tl.set(toConfig.element,   { zIndex: 10 }, 0);
    tl.set(fromConfig.element, { zIndex: 5  }, 0);

    // ── 0.0s — Slide-1 text fades out (0.35s) ───────────
    tl.to(fromConfig.element.querySelector('.slide__content'), {
      opacity: 0,
      x: -30,
      duration: 0.35,
      ease: 'power2.in'
    }, 0);

    // ── 0.0s — Phone zoom-in (scale 1.05→2.8, 1.0s) ────
    tl.fromTo(phone,
      { ...fromConfig.sharedElements.phone },
      {
        ...toConfig.sharedElements.phone,
        duration: 1.0,
        ease: 'power3.inOut'
      },
      0
    );

    // ── 0.8s — Arrow SVG fades in (0.2s) ────────────────
    tl.fromTo(arrowSvg,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: 'power2.out' },
      0.8
    );

    // ── 0.8s — Stroke draws from start to end (0.7s) ────
    tl.fromTo(arrowPath,
      { strokeDasharray: pathLength, strokeDashoffset: pathLength },
      { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' },
      0.8
    );

    // ── 1.2s — Annotation text fades in (0.5s) ──────────
    tl.fromTo(annotation,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      1.2
    );

    // ── 1.3s — Arrow head appears (0.2s) ────────────────
    tl.fromTo(arrowHead,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: 'power2.out' },
      1.3
    );

    // ── end — Normalize z-index ──────────────────────────
    tl.set(fromConfig.element, { zIndex: 1 }, '>');

    return tl;
  }
};
