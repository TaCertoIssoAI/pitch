/**
 * AnalysisScene — Continues from WhatsAppScene seamlessly.
 *
 * The phone starts in the EXACT same position as the WhatsApp scene
 * final state (diagonal 3D, chat scrolled to bottom). Then it:
 *   1. Smoothly scrolls the chat up to the highlighted message
 *   2. Rotates the phone to face-forward and shifts it left
 *   3. Highlights the message with a pulsing border
 *   4. Draws an animated SVG arrow to a callout card
 *   5. Shows the callout with explanation steps
 *
 * Config (from presentation.json):
 *   {
 *     dataFile:        path to messages.json,
 *     highlightMsg:    index of message to highlight (0-based),
 *     callout: { badge, title, text, steps[] }
 *   }
 */
import Scene from '../Scene.js';
import PhoneComponent from '../components/PhoneComponent.js';
import ChatEngine from '../components/ChatEngine.js';

class AnalysisScene extends Scene {
  constructor(config = {}) {
    super();
    this.config = config;
    this.phone = null;
    this._animationComplete = false;
  }

  async mount(container) {
    await super.mount(container);

    // ---- Phone wrapper ----
    const phoneWrapper = document.createElement('div');
    phoneWrapper.className = 'analysis-phone-wrapper';
    phoneWrapper.id = 'analysis-phone-wrapper';
    container.appendChild(phoneWrapper);

    // Build phone with all messages pre-rendered
    this.phone = new PhoneComponent('#analysis-phone-wrapper', {
      contact: this.config.contact || {},
    });

    // Render all messages instantly
    this._renderMessagesInstantly();

    // Continuously pin chat to bottom until enter() starts the scroll-up.
    // This survives any browser layout recalculations during the fade transition.
    const chatBox = this.phone.getChatBox();
    this._keepAtBottom = true;
    const pinToBottom = () => {
      if (this._keepAtBottom) {
        chatBox.scrollTop = chatBox.scrollHeight;
        requestAnimationFrame(pinToBottom);
      }
    };
    requestAnimationFrame(pinToBottom);

    // Start in diagonal position (matching WhatsApp scene end state)
    const pw = phoneWrapper.querySelector('.phone-wrapper');
    pw.classList.add('state-diagonal');

    // ---- Callout card (initially hidden) ----
    const callout = this._buildCallout();
    callout.style.display = 'none';   // hidden until phone finishes rotating
    container.appendChild(callout);

    // ---- SVG connector (initially hidden) ----
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('analysis-connector');
    svg.id = 'analysis-connector';
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.display = 'none';
    container.appendChild(svg);
  }

  enter() {
    const pw = this._container.querySelector('.phone-wrapper');
    const chatBox = this.phone.getChatBox();

    // Step 0: Smooth scroll-up from bottom to highlighted message
    const scrollUpDelay = 600;   // ms before scroll starts
    const scrollUpDuration = 2000; // ms for the scroll animation

    this.setTimeout(() => {
      // Stop pinning to bottom — NOW we begin the scroll-up
      this._keepAtBottom = false;
      chatBox.scrollTop = chatBox.scrollHeight; // ensure we start from the very bottom
      this._smoothScrollToMessage(chatBox, this.config.highlightMsg ?? 1, scrollUpDuration);
    }, scrollUpDelay);

    const afterScrollDelay = scrollUpDelay + scrollUpDuration;

    // Step 1: Rotate phone to front + shift left
    this.setTimeout(() => {
      pw.classList.remove('state-diagonal');
      pw.classList.add('state-front');
    }, afterScrollDelay + 400);

    // Step 2: Highlight message
    this.setTimeout(() => {
      this._highlightMessage();
    }, afterScrollDelay + 1600);

    // Step 3: Show callout + draw connector
    this.setTimeout(() => {
      const callout = this._container.querySelector('.analysis-callout');
      const svg = this._container.querySelector('#analysis-connector');
      if (callout) callout.style.display = '';
      if (svg) svg.style.display = '';
      this._drawConnector();
      this._animationComplete = true;
    }, afterScrollDelay + 2000);
  }

  /* ================================================================
   *  Skip-to-end: jump to final state instantly
   * ================================================================ */
  canSkipToEnd() {
    return !this._animationComplete;
  }

  skipToEnd() {
    // Cancel all pending timers
    this.clearTimers();
    this._keepAtBottom = false;

    if (!this._container) return;

    const pw = this._container.querySelector('.phone-wrapper');

    // Instantly rotate phone to front
    if (pw) {
      pw.style.transition = 'none';
      pw.classList.remove('state-diagonal');
      pw.classList.add('state-front');
      // Re-enable transitions after a frame
      requestAnimationFrame(() => { pw.style.transition = ''; });
    }

    // Scroll to highlighted message instantly
    const chatBox = this.phone.getChatBox();
    const idx = this.config.highlightMsg ?? 1;
    const targetMsg = chatBox.querySelector(`[data-msg-index="${idx}"]`);
    if (targetMsg) {
      targetMsg.scrollIntoView({ block: 'center' });
    }

    // Highlight message
    this._highlightMessage();

    // Show callout + connector
    const callout = this._container.querySelector('.analysis-callout');
    const svg = this._container.querySelector('#analysis-connector');
    if (callout) callout.style.display = '';
    if (svg) svg.style.display = '';
    this._drawConnector();

    this._animationComplete = true;
  }

  exit() {
    super.exit();
  }

  unmount() {
    this._keepAtBottom = false;
    this.phone = null;
    super.unmount();
  }

  /* ================================================================
   *  Smooth scroll to a specific message (eased animation)
   * ================================================================ */
  _smoothScrollToMessage(chatBox, msgIndex, duration) {
    const targetMsg = chatBox.querySelector(`[data-msg-index="${msgIndex}"]`);
    if (!targetMsg) return;

    // Calculate the scroll target so the message is roughly centered
    const targetTop = targetMsg.offsetTop - chatBox.clientHeight / 2 + targetMsg.offsetHeight / 2;
    const scrollTarget = Math.max(0, targetTop);
    const startScroll = chatBox.scrollTop;
    const distance = scrollTarget - startScroll;
    const startTime = performance.now();

    const easeInOutCubic = (t) => t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      chatBox.scrollTop = startScroll + distance * easeInOutCubic(progress);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  /* ================================================================
   *  Render all messages instantly (no animation delays)
   * ================================================================ */
  _renderMessagesInstantly() {
    const chatBox = this.phone.getChatBox();
    const typingIndicator = this.phone.getTypingIndicator();
    const messages = this.config.messages || [];

    const blueTicksSVG = ChatEngine.blueTicksSVG;

    messages.forEach((msg, idx) => {
      if (msg.type === 'user') {
        const html = `
          <div class="msg msg-user" data-msg-index="${idx}">
            <div class="msg-text">${msg.text}</div>
            <div class="msg-time">
              ${ChatEngine.getTime()} ${blueTicksSVG}
            </div>
          </div>`;
        typingIndicator.insertAdjacentHTML('beforebegin', html);
      } else if (msg.type === 'bot') {
        const engine = new ChatEngine(this.phone);
        const content = engine.buildBotContent(msg);
        const html = `
          <div class="msg msg-bot" data-msg-index="${idx}">
            ${content}
            <div class="msg-time">${ChatEngine.getTime()}</div>
          </div>`;
        typingIndicator.insertAdjacentHTML('beforebegin', html);
      }
    });

    // Hide typing indicator
    typingIndicator.style.display = 'none';
  }

  /* ================================================================
   *  Highlight a specific message
   * ================================================================ */
  _highlightMessage() {
    const idx = this.config.highlightMsg ?? 1;
    const chatBox = this.phone.getChatBox();
    const targetMsg = chatBox.querySelector(`[data-msg-index="${idx}"]`);
    if (targetMsg) {
      targetMsg.classList.add('msg-highlight');
    }
  }

  /* ================================================================
   *  Draw SVG connector line from highlighted msg to callout
   * ================================================================ */
  _drawConnector() {
    const svg = this._container.querySelector('#analysis-connector');
    if (!svg) return;

    const idx = this.config.highlightMsg ?? 1;
    const chatBox = this.phone.getChatBox();
    const targetMsg = chatBox.querySelector(`[data-msg-index="${idx}"]`);
    const callout = this._container.querySelector('.analysis-callout');

    if (!targetMsg || !callout) return;

    // Get positions relative to the scene container
    const containerRect = this._container.getBoundingClientRect();
    const msgRect = targetMsg.getBoundingClientRect();
    const calloutRect = callout.getBoundingClientRect();

    // SVG covers the entire container
    svg.setAttribute('viewBox', `0 0 ${containerRect.width} ${containerRect.height}`);
    svg.style.width = containerRect.width + 'px';
    svg.style.height = containerRect.height + 'px';

    // Start point: right edge of highlighted message
    const startX = msgRect.right - containerRect.left + 10;
    const startY = msgRect.top + msgRect.height / 2 - containerRect.top;

    // End point: left edge of callout, vertically centered
    const endX = calloutRect.left - containerRect.left - 10;
    const endY = calloutRect.top + calloutRect.height / 2 - containerRect.top;

    // Curved path
    const midX = (startX + endX) / 2;
    const path = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

    // Arrow head
    const arrowSize = 8;
    const arrowHead = `M ${endX} ${endY - arrowSize} L ${endX + arrowSize + 4} ${endY} L ${endX} ${endY + arrowSize} Z`;

    svg.innerHTML = `
      <path d="${path}" />
      <path class="arrow-head" d="${arrowHead}" />
    `;
  }

  /* ================================================================
   *  Build callout card DOM
   * ================================================================ */
  _buildCallout() {
    const c = this.config.callout || {};
    const stepsHtml = (c.steps || [])
      .map((step, i) => `
        <li>
          <span class="step-number">${i + 1}</span>
          <span>${step}</span>
        </li>`)
      .join('');

    const el = document.createElement('div');
    el.className = 'analysis-callout';
    el.innerHTML = `
      <div class="callout-badge">
        <span class="badge-dot"></span>
        ${c.badge || 'Pipeline'}
      </div>
      <div class="callout-title">${c.title || ''}</div>
      <div class="callout-text">${c.text || ''}</div>
      ${stepsHtml ? `<ul class="callout-steps">${stepsHtml}</ul>` : ''}
    `;
    return el;
  }
}

export default AnalysisScene;
