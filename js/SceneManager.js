/**
 * SceneManager — State machine that orchestrates scenes and transitions.
 *
 * Scenes are registered with a unique id. The presentation order and
 * transition types are driven by a config object (presentation.json).
 *
 * Navigation: next(), prev(), goTo(id)
 * Input:      arrow keys, click/tap, swipe, or programmatic.
 *
 * Usage:
 *   const sm = new SceneManager('#stage');
 *   sm.register('intro',    new IntroScene());
 *   sm.register('whatsapp', new WhatsAppScene());
 *   sm.loadPresentation(presentationConfig);
 *   sm.start();
 */
class SceneManager {
  /**
   * @param {string} stageSelector  CSS selector for the stage element
   */
  constructor(stageSelector) {
    this.stage = document.querySelector(stageSelector);
    this.scenes = new Map();          // id → Scene instance
    this.order = [];                  // ordered scene ids
    this.transitions = new Map();     // "from→to" → transition name
    this.currentIndex = -1;
    this.isTransitioning = false;

    this._initControls();
  }

  /* ================================================================
   *  Registration
   * ================================================================ */

  /**
   * Register a scene instance under a unique id.
   * @param {string} id
   * @param {Scene}  scene
   */
  register(id, scene) {
    this.scenes.set(id, scene);
    scene._manager = this;
    scene._id = id;
  }

  /**
   * Load presentation config (scene order + transition overrides).
   *
   * Config shape:
   *   {
   *     "scenes": [
   *       { "id": "intro",    "transition": "fade" },
   *       { "id": "whatsapp", "transition": "slide-left" },
   *       ...
   *     ],
   *     "defaultTransition": "fade"
   *   }
   */
  loadPresentation(config) {
    this.defaultTransition = config.defaultTransition || 'fade';
    this.order = config.scenes.map((s) => s.id);

    // Build transition map
    for (let i = 0; i < config.scenes.length; i++) {
      const s = config.scenes[i];
      if (s.transition) {
        // The transition *into* this scene
        const prevId = i > 0 ? config.scenes[i - 1].id : null;
        if (prevId) this.transitions.set(`${prevId}→${s.id}`, s.transition);
      }
    }
  }

  /* ================================================================
   *  Navigation
   * ================================================================ */

  async start() {
    if (this.order.length === 0) return;
    this.currentIndex = 0;
    const firstScene = this._current();
    await this._mountScene(firstScene, 'none');
  }

  async next() {
    if (this.isTransitioning) return;
    if (this.currentIndex >= this.order.length - 1) return;

    // If the current scene has pending animations, skip to end first
    const currentScene = this._current();
    if (currentScene && currentScene.canSkipToEnd()) {
      currentScene.skipToEnd();
      return; // user must press again to actually advance
    }

    const fromId = this.order[this.currentIndex];
    const toId = this.order[this.currentIndex + 1];
    const transition = this._resolveTransition(fromId, toId);

    this.currentIndex++;
    await this._transition(fromId, toId, transition, 'forward');
  }

  async prev() {
    if (this.isTransitioning) return;
    if (this.currentIndex <= 0) return;

    const fromId = this.order[this.currentIndex];
    const toId = this.order[this.currentIndex - 1];
    const transition = this._resolveTransition(toId, fromId); // reverse lookup

    this.currentIndex--;
    await this._transition(fromId, toId, transition, 'backward');
  }

  async goTo(id) {
    if (this.isTransitioning) return;
    const idx = this.order.indexOf(id);
    if (idx === -1 || idx === this.currentIndex) return;

    const fromId = this.order[this.currentIndex];
    const direction = idx > this.currentIndex ? 'forward' : 'backward';
    const transition = this._resolveTransition(fromId, id);

    this.currentIndex = idx;
    await this._transition(fromId, id, transition, direction);
  }

  /* ================================================================
   *  Internals
   * ================================================================ */

  _current() {
    return this.scenes.get(this.order[this.currentIndex]);
  }

  _resolveTransition(fromId, toId) {
    return this.transitions.get(`${fromId}→${toId}`) || this.defaultTransition || 'fade';
  }

  /**
   * Mount a scene into the stage (no transition).
   */
  async _mountScene(scene, transition) {
    const container = document.createElement('div');
    container.className = 'scene-container scene-active';
    container.id = `scene-${scene._id}`;
    this.stage.appendChild(container);
    await scene.mount(container);
    scene.enter();
  }

  /**
   * Perform a transition between two scenes.
   */
  async _transition(fromId, toId, transition, direction) {
    this.isTransitioning = true;

    const fromScene = this.scenes.get(fromId);
    const toScene = this.scenes.get(toId);

    // Create incoming container
    const incoming = document.createElement('div');
    incoming.className = 'scene-container';
    incoming.id = `scene-${toId}`;
    this.stage.appendChild(incoming);
    await toScene.mount(incoming);

    const outgoing = document.getElementById(`scene-${fromId}`);

    // Apply transition classes
    const transClass = `t-${transition}`;
    const enterClasses = [transClass, `${transClass}-enter`];
    const exitClasses = [transClass, `${transClass}-exit`];
    if (direction === 'backward') {
      enterClasses.push('reverse');
      exitClasses.push('reverse');
    }

    // Position incoming off-screen
    incoming.classList.add(...enterClasses);
    outgoing.classList.add(...exitClasses);

    // Force reflow
    incoming.offsetHeight;

    // Trigger
    incoming.classList.add(`${transClass}-enter-active`);
    outgoing.classList.add(`${transClass}-exit-active`);

    // Wait for animation to finish
    const duration = this._getTransitionDuration(transition);
    await this._wait(duration);

    // Clean up old scene
    fromScene.exit();
    fromScene.unmount();
    outgoing.remove();

    // Finalize new scene
    incoming.className = 'scene-container scene-active';
    toScene.enter();

    this.isTransitioning = false;

    // Dispatch event for external listeners
    this.stage.dispatchEvent(new CustomEvent('scene-changed', {
      detail: { from: fromId, to: toId, index: this.currentIndex, total: this.order.length }
    }));
  }

  _getTransitionDuration(transition) {
    const durations = {
      'none': 0,
      'fade': 600,
      'slide-left': 700,
      'slide-up': 700,
      'zoom': 600,
      'flip': 800,
    };
    return durations[transition] || 600;
  }

  _wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  /* ================================================================
   *  Input controls (keyboard, click, touch/swipe)
   * ================================================================ */

  _initControls() {
    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        this.next();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.prev();
      }
    });

    // Click (right half = next, left half = prev)
    this.stage.addEventListener('click', (e) => {
      // Ignore clicks on interactive elements inside scenes
      if (e.target.closest('a, button, input, .interactive')) return;
      const rect = this.stage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x > rect.width / 2) {
        this.next();
      } else {
        this.prev();
      }
    });

    // Touch swipe
    let touchStartX = 0;
    let touchStartY = 0;
    this.stage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    this.stage.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      const dy = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(dx) < 50 && Math.abs(dy) < 50) return; // tap, not swipe
      if (Math.abs(dx) > Math.abs(dy)) {
        dx < 0 ? this.next() : this.prev();
      } else {
        dy < 0 ? this.next() : this.prev();
      }
    }, { passive: true });
  }

  /* ================================================================
   *  Public helpers
   * ================================================================ */

  get totalScenes() { return this.order.length; }
  get currentSceneIndex() { return this.currentIndex; }
  get currentSceneId() { return this.order[this.currentIndex]; }
}

export default SceneManager;
