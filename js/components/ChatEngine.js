/**
 * ChatEngine - Plays back a conversation from a JSON message array.
 *
 * Each message object supports:
 *   { type: "user" | "bot", delay, typingDuration?, text?, html?, quote?, linkPreview? }
 *
 * Usage:
 *   const engine = new ChatEngine(phoneComponent);
 *   engine.loadMessages(jsonData.messages);
 *   engine.play();
 */
class ChatEngine {
  constructor(phoneComponent) {
    this.phone = phoneComponent;
    this.chatBox = phoneComponent.getChatBox();
    this.typingIndicator = phoneComponent.getTypingIndicator();
    this.messages = [];
  }

  /* ---- SVG assets ---- */
  static get blueTicksSVG() {
    return `<svg viewBox="0 0 18 18" width="16" height="16">
      <path fill="#53bdeb" d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.604.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.86.86 0 0 0 1.252-.062l7.809-10.022a.434.434 0 0 0-.082-.604zm-8.834 3.493a.434.434 0 0 0-.604.076l-4.57 5.864a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.86.86 0 0 0 1.252-.062l5.405-6.924a.434.434 0 0 0-.082-.604l-.57-.444a.434.434 0 0 0-.325-.094.434.434 0 0 0-.27.168z"/>
    </svg>`;
  }

  /* ---- Helpers ---- */
  static getTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  scrollToBottom() {
    this.chatBox.scrollTop = this.chatBox.scrollHeight;
  }

  showTyping() {
    this.typingIndicator.style.display = 'block';
    this.scrollToBottom();
  }

  hideTyping() {
    this.typingIndicator.style.display = 'none';
  }

  /* ---- Message renderers ---- */
  addUserMessage(text) {
    const html = `
      <div class="msg msg-user">
        <div class="msg-text">${text}</div>
        <div class="msg-time">
          ${ChatEngine.getTime()}
          ${ChatEngine.blueTicksSVG}
        </div>
      </div>`;
    this.typingIndicator.insertAdjacentHTML('beforebegin', html);
    this.scrollToBottom();
  }

  addBotMessage(content) {
    const html = `
      <div class="msg msg-bot">
        ${content}
        <div class="msg-time">${ChatEngine.getTime()}</div>
      </div>`;
    this.typingIndicator.insertAdjacentHTML('beforebegin', html);
    this.scrollToBottom();
  }

  /* ---- Build rich HTML from a message object ---- */
  buildBotContent(msg) {
    let parts = [];

    // Quote block
    if (msg.quote) {
      parts.push(`
        <div class="quote">
          <div class="quote-name">${msg.quote.name}</div>
          <div class="quote-text">${msg.quote.text}</div>
        </div>`);
    }

    // Link preview card
    if (msg.linkPreview) {
      const lp = msg.linkPreview;
      parts.push(`
        <div class="link-preview">
          <div class="lp-image-mock">
            <div class="lp-logo"><span></span> ${lp.logo}</div>
            <div class="lp-title-mock">${lp.title}</div>
            <div class="lp-graph"></div>
          </div>
          <div class="lp-content">
            <div class="lp-title">${lp.previewTitle}</div>
            <div class="lp-desc">${lp.description}</div>
            <div class="lp-url">🔗 ${lp.url}</div>
          </div>
        </div>`);
    }

    // Plain text or raw HTML body
    if (msg.html) {
      parts.push(`<div class="msg-text">${msg.html}</div>`);
    } else if (msg.text) {
      parts.push(`<div class="msg-text">${msg.text}</div>`);
    }

    return parts.join('\n');
  }

  /* ---- Load messages from array ---- */
  loadMessages(messages) {
    this.messages = messages;
  }

  /* ---- Play the conversation sequentially ---- */
  async play() {
    let elapsed = 0;

    for (const msg of this.messages) {
      const delay = msg.delay || 1000;
      const typingDuration = msg.typingDuration || 0;

      // Wait for the message delay
      await this._wait(delay);

      if (msg.type === 'user') {
        this.addUserMessage(msg.text);
      } else if (msg.type === 'bot') {
        if (typingDuration > 0) {
          this.showTyping();
          await this._wait(typingDuration);
          this.hideTyping();
        }
        const content = this.buildBotContent(msg);
        this.addBotMessage(content);
      }
    }
  }

  /* ---- Promise-based delay ---- */
  _wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default ChatEngine;
