const listeners = {};

export const eventBus = {
  on(event, fn) {
    (listeners[event] ??= []).push(fn);
  },
  off(event, fn) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter((f) => f !== fn);
  },
  emit(event, ...args) {
    for (const fn of listeners[event] ?? []) fn(...args);
  },
};
