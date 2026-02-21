/**
 * orchestrator.js
 * Builds the transitions[] array from the SlideRegistry.
 * Never needs to be modified when adding new slides.
 */
window.Orchestrator = {
  transitions: [],

  init(slideRegistry) {
    // 1. Resolve DOM references for each slide
    slideRegistry.forEach(config => {
      config.element = document.getElementById(config.id);
      if (!config.element) {
        console.error(`[Orchestrator] Element #${config.id} not found.`);
      }
    });

    // 2. Set initial GSAP state
    //    - Slide 0: visible on top
    //    - All others: content hidden (ready for entrance animation)
    slideRegistry.forEach((config, i) => {
      gsap.set(config.element, { zIndex: i === 0 ? 10 : 1 });

      if (i !== 0) {
        const content = config.element.querySelector('.slide__content');
        if (content) {
          gsap.set(content, { opacity: 0, y: 40 });
        }
      }
    });

    // 3. Set phone to slide 0's desired state
    const phone = window.SharedElements.phone;
    if (phone && slideRegistry[0].sharedElements && slideRegistry[0].sharedElements.phone) {
      gsap.set(phone, slideRegistry[0].sharedElements.phone);
    }

    // 4. Build transitions[i] = animation from slide[i] → slide[i+1]
    this.transitions = [];
    for (let i = 0; i < slideRegistry.length - 1; i++) {
      const fromConfig = slideRegistry[i];
      const toConfig   = slideRegistry[i + 1];
      const tl = toConfig.buildTransition(fromConfig, toConfig);
      tl.pause(0);
      this.transitions.push(tl);
    }

    return this.transitions;
  }
};
