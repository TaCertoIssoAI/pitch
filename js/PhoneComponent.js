/**
 * PhoneComponent - Renders the 3D phone shell with WhatsApp UI
 *
 * Usage:
 *   const phone = new PhoneComponent('#app', {
 *     contact: { name, avatar, status, unreadCount }
 *   });
 */
class PhoneComponent {
  constructor(containerSelector, config = {}) {
    this.container = document.querySelector(containerSelector);
    this.config = {
      contact: {
        name: 'Contato',
        avatar: '',
        status: 'online',
        unreadCount: 0,
        ...config.contact,
      },
    };

    this.render();
    this.initParallax();
  }

  /* ---- SVG icon helpers ---- */
  static get icons() {
    return {
      signal: `<svg viewBox="0 0 24 24" width="16" height="14" fill="white">
        <rect x="2" y="14" width="3.5" height="6" rx="1"/>
        <rect x="8" y="10" width="3.5" height="10" rx="1"/>
        <rect x="14" y="6" width="3.5" height="14" rx="1"/>
        <rect x="20" y="2" width="3.5" height="18" rx="1" fill="rgba(255,255,255,0.3)"/>
      </svg>`,

      battery: `<svg viewBox="0 0 24 24" width="24" height="12" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="6" width="18" height="12" rx="3" ry="3"></rect>
        <line x1="22" y1="10" x2="22" y2="14"></line>
        <rect x="4" y="8" width="10" height="8" fill="white" stroke="none" rx="1"></rect>
      </svg>`,

      back: `<svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,

      phone: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,

      chevronDown: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-left:4px"><polyline points="6 9 12 15 18 9"></polyline></svg>`,

      plus: `<svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,

      file: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`,

      camera: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,

      mic: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`,
    };
  }

  /* ---- Build the DOM ---- */
  render() {
    const { contact } = this.config;
    const i = PhoneComponent.icons;

    const avatarInner = contact.avatar
      ? `<img src="${contact.avatar}" alt="${contact.name}">`
      : `<span style="font-size:10px;text-align:center;line-height:1">${contact.name.substring(0, 2).toUpperCase()}</span>`;

    this.container.innerHTML = `
      <div class="phone-wrapper" id="phone3d">
        <div class="phone">
          <div class="notch"></div>

          <!-- iOS status bar -->
          <div class="status-bar">
            <span>16:06</span>
            <div class="status-icons">
              ${i.signal}
              <span style="font-size:11px;font-weight:700;margin-right:2px">5G</span>
              ${i.battery}
            </div>
          </div>

          <!-- WhatsApp header -->
          <div class="wa-header">
            <div class="wa-back">
              ${i.back}
              <span>${contact.unreadCount || ''}</span>
            </div>
            <div class="wa-avatar">${avatarInner}</div>
            <div class="wa-info">
              <div class="wa-name">${contact.name}</div>
              <div class="wa-status">${contact.status}</div>
            </div>
            <div class="wa-actions">
              ${i.phone}
              ${i.chevronDown}
            </div>
          </div>

          <!-- Chat messages -->
          <div class="wa-chat" id="chat-box">
            <div class="msg msg-bot typing" id="typing-indicator">
              <div class="dot"></div><div class="dot"></div><div class="dot"></div>
            </div>
          </div>

          <!-- Input bar -->
          <div class="wa-input-area">
            <div class="icon-action">${i.plus}</div>
            <div class="input-pill">
              <div class="icon-action" style="margin-right:4px">${i.file}</div>
            </div>
            <div class="icon-action">${i.camera}</div>
            <div class="icon-action">${i.mic}</div>
          </div>
        </div>
      </div>
    `;

    this.chatBox = this.container.querySelector('#chat-box');
    this.typingIndicator = this.container.querySelector('#typing-indicator');
  }

  /* ---- 3D parallax on mouse move ---- */
  initParallax() {
    document.addEventListener('mousemove', (e) => {
      const phone = this.container.querySelector('#phone3d');
      if (!phone) return;
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      phone.style.transform = `rotateY(${-20 + xAxis}deg) rotateX(${15 - yAxis}deg)`;
    });
  }

  /* ---- Public helpers used by ChatEngine ---- */
  getChatBox() {
    return this.chatBox;
  }

  getTypingIndicator() {
    return this.typingIndicator;
  }
}

export default PhoneComponent;
