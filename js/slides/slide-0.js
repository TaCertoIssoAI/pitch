/**
 * slide-0.js — Hero / Opening slide
 *
 * Phone is centered and prominent.
 * This slide has no "buildTransition" because transitions are built
 * by the *destination* slide. Slide 0 only declares its sharedElements state.
 */
window.Slide0Config = {
  id: 'slide-0',
  index: 0,
  element: null, // filled by Orchestrator.init()

  sharedElements: {
    phone: {
      x: '50vw',
      y: '50vh',
      xPercent: -50,
      yPercent: -50,
      scale: 1,
      rotation: 0,
      opacity: 1
    }
  },

  /**
   * Slide 0 is the origin — its buildTransition is never called directly
   * because transitions[0] is built by Slide1Config.buildTransition(slide0, slide1).
   * Defined here for completeness / future use.
   */
  buildTransition(fromConfig, toConfig) {
    return gsap.timeline({ paused: true });
  }
};
