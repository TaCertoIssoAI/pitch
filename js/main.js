/**
 * main.js - Entry point
 * Loads the messages JSON, creates the phone, and starts playback.
 */
import PhoneComponent from './PhoneComponent.js';
import ChatEngine from './ChatEngine.js';

async function init() {
  // Load conversation data from JSON
  const response = await fetch('./data/messages.json');
  const data = await response.json();

  // Create the phone UI
  const phone = new PhoneComponent('#app', {
    contact: data.contact,
  });

  // Wire up the chat engine and play
  const engine = new ChatEngine(phone);
  engine.loadMessages(data.messages);
  engine.play();
}

init();
