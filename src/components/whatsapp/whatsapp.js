import { el } from "../../utils/dom.js";
import "./whatsapp.css";

/* ── Inline SVGs (pixel-tuned for 19–20px render) ── */
const ICONS = {
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.11 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  dots: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>`,
  emoji: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  clip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  mic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
  checks: `<svg width="16" height="11" viewBox="0 0 16 11" fill="none"><path d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.011-2.095a.46.46 0 0 0-.327-.14.462.462 0 0 0-.34.153.426.426 0 0 0-.108.32.457.457 0 0 0 .133.313L3.86 9.3a.574.574 0 0 0 .404.166c.149 0 .29-.067.386-.186l6.531-8.09a.39.39 0 0 0-.109-.537z" fill="currentColor"/><path d="M15.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-1.2-1.25-.352.436 1.443 1.748a.574.574 0 0 0 .404.166c.149 0 .29-.067.386-.186l6.531-8.09a.39.39 0 0 0-.109-.537z" fill="currentColor"/></svg>`,
  /* Status bar icons (tiny) */
  signal: `<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><rect x="1" y="18" width="3" height="4" rx="0.5"/><rect x="6" y="14" width="3" height="8" rx="0.5"/><rect x="11" y="10" width="3" height="12" rx="0.5"/><rect x="16" y="6" width="3" height="16" rx="0.5"/></svg>`,
  wifi: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/></svg>`,
  battery: `<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><rect x="1" y="7" width="18" height="10" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="3" y="9" width="14" height="6" rx="0.5"/><rect x="20" y="10" width="2" height="4" rx="0.5"/></svg>`,
};

export function createWhatsAppChat(screen) {
  /* ── Status bar (sits behind notch area) ── */
  const statusBar = el("div", { className: "wa-statusbar" }, [
    el("span", { className: "wa-statusbar__time", textContent: "14:32" }),
    el("span", { className: "wa-statusbar__icons", innerHTML: ICONS.signal + ICONS.wifi + ICONS.battery }),
  ]);

  /* ── Header ── */
  const avatar = el("div", { className: "wa-header__avatar" }, [
    el("img", { src: "/tacertoissoai-logo.png", alt: "Tá Certo Isso AI?" }),
  ]);

  const header = el("div", { className: "wa-header" }, [
    el("span", { className: "wa-header__back", innerHTML: ICONS.back }),
    avatar,
    el("div", { className: "wa-header__info" }, [
      el("div", { className: "wa-header__name", textContent: "Tá Certo Isso AI?" }),
      el("div", { className: "wa-header__status", textContent: "online" }),
    ]),
    el("div", { className: "wa-header__actions" }, [
      el("span", { className: "wa-header__icon", innerHTML: ICONS.video }),
      el("span", { className: "wa-header__icon", innerHTML: ICONS.phone }),
      el("span", { className: "wa-header__icon", innerHTML: ICONS.dots }),
    ]),
  ]);

  /* ── Messages ── */
  const messages = el("div", { className: "wa-messages" });

  /* ── Input bar (WA-accurate layout) ── */
  const fieldWrap = el("div", { className: "wa-input-bar__field-wrap" }, [
    el("span", { innerHTML: ICONS.emoji }),
    el("input", {
      className: "wa-input-bar__field",
      placeholder: "Mensagem",
      readonly: "true",
    }),
    el("span", { className: "wa-input-bar__field-icons" }, [
      el("span", { innerHTML: ICONS.clip }),
      el("span", { innerHTML: ICONS.camera }),
    ]),
  ]);

  const inputBar = el("div", { className: "wa-input-bar" }, [
    fieldWrap,
    el("button", { className: "wa-input-bar__mic", innerHTML: ICONS.mic }),
  ]);

  const chat = el("div", { className: "wa-chat" }, [statusBar, header, messages, inputBar]);
  screen.appendChild(chat);

  return { chat, messages };
}

export function createBubble(type, text, opts = {}) {
  const timeStr = "14:32";
  const children = [];

  /* Reply quote (bot only) */
  if (opts.replyTo) {
    children.push(
      el("div", { className: "wa-bubble__reply" }, [
        el("div", { className: "wa-bubble__reply-author", textContent: "Você" }),
        el("div", { className: "wa-bubble__reply-text", textContent: opts.replyTo }),
      ])
    );
  }

  /* Message text */
  children.push(el("span", { className: "wa-bubble__text", textContent: text }));

  /* Meta row: time (+ checks for user) */
  const metaKids = [el("span", { className: "wa-bubble__time", textContent: timeStr })];
  if (type === "user") {
    metaKids.push(el("span", { className: "wa-bubble__checks", innerHTML: ICONS.checks }));
  }
  children.push(el("span", { className: "wa-bubble__meta" }, metaKids));

  const bubble = el("div", { className: `wa-bubble wa-bubble--${type}` }, children);

  /* "Etapa" floating label for neon highlight (hidden until scene02) */
  if (type === "bot") {
    bubble.appendChild(
      el("div", { className: "wa-etapa-label", textContent: "Etapa 1" })
    );
  }

  return bubble;
}
