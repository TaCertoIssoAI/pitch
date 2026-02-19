/**
 * Scene — Base class for all presentation scenes.
 *
 * Lifecycle:
 *   mount(container)  → Build DOM inside the given container div
 *   enter()           → Called after scene is visible (start animations)
 *   exit()            → Called before scene leaves (stop animations, timers)
 *   unmount()         → Called after DOM is removed (clean up references)
 *
 * To create a new scene, extend this class and override the lifecycle methods.
 *
 * Example:
 *   class MyScene extends Scene {
 *     async mount(container) {
 *       container.innerHTML = '<h1>Hello!</h1>';
 *     }
 *     enter() { console.log('Scene visible'); }
 *     exit()  { console.log('Leaving scene'); }
 *   }
 */
class Scene {
  constructor() {
    this._manager = null;   // set by SceneManager
    this._id = null;        // set by SceneManager
    this._container = null;
    this._timers = [];
  }

  /**
   * Build your scene DOM inside `container`.
   * @param {HTMLElement} container
   */
  async mount(container) {
    this._container = container;
  }

  /**
   * Scene is now visible — start animations, timers, etc.
   */
  enter() {}

  /**
   * Scene is about to leave — clean up.
   */
  exit() {
    this.clearTimers();
  }

  /**
   * DOM has been removed — release references.
   */
  unmount() {
    this._container = null;
  }

  /* ---- Timer helpers (auto-cleared on exit) ---- */

  setTimeout(fn, ms) {
    const id = window.setTimeout(fn, ms);
    this._timers.push({ type: 'timeout', id });
    return id;
  }

  setInterval(fn, ms) {
    const id = window.setInterval(fn, ms);
    this._timers.push({ type: 'interval', id });
    return id;
  }

  clearTimers() {
    for (const t of this._timers) {
      if (t.type === 'timeout') window.clearTimeout(t.id);
      else window.clearInterval(t.id);
    }
    this._timers = [];
  }

  /* ---- State capture for seamless scene continuity ---- */

  /**
   * Override in subclasses to capture the scene's current visual state
   * so the next scene can start exactly where this one left off.
   * Called by SceneManager right before transitioning away.
   * @returns {object|null}  State snapshot, or null if not supported.
   */
  captureState() {
    return null;
  }

  /* ---- Skip-to-end support ---- */

  /**
   * Override in subclasses to return true while animations are still
   * running. When the user tries to advance, SceneManager will call
   * skipToEnd() first so the scene finishes cleanly.
   */
  canSkipToEnd() {
    return false;
  }

  /**
   * Override in subclasses to instantly jump to the scene's final
   * visual state (cancel timers, set CSS classes, etc.).
   */
  skipToEnd() {}

  /* ---- Convenience ---- */

  /** Access the SceneManager (e.g., to call this.manager.next()) */
  get manager() {
    return this._manager;
  }

  get container() {
    return this._container;
  }
}

export default Scene;
