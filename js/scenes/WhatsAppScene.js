/**
 * WhatsAppScene — Shows the 3D phone with a WhatsApp chat simulation.
 *
 * Reads its messages from data/messages.json (loaded externally and
 * passed via constructor config).
 */
import Scene from '../Scene.js';
import PhoneComponent from '../components/PhoneComponent.js';
import ChatEngine from '../components/ChatEngine.js';

class WhatsAppScene extends Scene {
  /**
   * @param {object} config  The parsed messages.json data
   */
  constructor(config = {}) {
    super();
    this.config = config;
    this.phone = null;
    this.engine = null;
  }

  async mount(container) {
    await super.mount(container);

    // Create wrapper div for the phone component
    const wrapper = document.createElement('div');
    wrapper.id = 'whatsapp-phone-wrapper';
    wrapper.style.cssText = 'width:100%;height:100%;display:flex;justify-content:center;align-items:center;perspective:1200px;';
    container.appendChild(wrapper);

    // Build phone
    this.phone = new PhoneComponent('#whatsapp-phone-wrapper', {
      contact: this.config.contact || {},
    });

    // Wire chat engine
    this.engine = new ChatEngine(this.phone);
    this.engine.loadMessages(this.config.messages || []);
  }

  enter() {
    super.enter && super.enter();
    // Start chat playback when the scene becomes visible
    if (this.engine) {
      this.engine.play();
    }
  }

  exit() {
    // ChatEngine uses async awaits; we clear any pending Scene timers
    super.exit();
  }

  unmount() {
    this.phone = null;
    this.engine = null;
    super.unmount();
  }
}

export default WhatsAppScene;
