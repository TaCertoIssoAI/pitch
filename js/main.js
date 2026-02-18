/**
 * main.js — Entry point for the pitch presentation.
 *
 * Loads presentation.json, dynamically instantiates the right Scene
 * class for each entry, registers them in SceneManager, and starts.
 */
import SceneManager from './SceneManager.js';
import TitleScene from './scenes/TitleScene.js';
import WhatsAppScene from './scenes/WhatsAppScene.js';

/* ---- Scene type registry ---- */
const SCENE_TYPES = {
  title: TitleScene,
  whatsapp: WhatsAppScene,
};

async function init() {
  // 1. Load presentation config
  const res = await fetch('./data/presentation.json');
  const presentation = await res.json();

  // 2. Create scene manager
  const manager = new SceneManager('#stage');

  // 3. Instantiate & register each scene
  for (const entry of presentation.scenes) {
    const SceneClass = SCENE_TYPES[entry.type];
    if (!SceneClass) {
      console.warn(`Unknown scene type: "${entry.type}" — skipping "${entry.id}"`);
      continue;
    }

    let config = entry.config || {};

    // If the scene needs external data (e.g., a whatsapp chat), load it
    if (config.dataFile) {
      const dataRes = await fetch(config.dataFile);
      const data = await dataRes.json();
      config = { ...config, ...data };
    }

    const scene = new SceneClass(config);
    manager.register(entry.id, scene);
  }

  // 4. Load scene order + transitions
  manager.loadPresentation(presentation);

  // 5. Build slide indicator dots
  buildIndicator(manager, presentation);

  // 6. Start!
  await manager.start();

  // 7. Keep indicator in sync
  document.getElementById('stage').addEventListener('scene-changed', (e) => {
    updateIndicator(e.detail.index);
  });
}

/* ---- Slide indicator ---- */
function buildIndicator(manager, presentation) {
  const indicator = document.createElement('div');
  indicator.className = 'slide-indicator';
  indicator.id = 'slide-indicator';

  presentation.scenes.forEach((s, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.title = s.id;
    dot.addEventListener('click', () => manager.goTo(s.id));
    indicator.appendChild(dot);
  });

  document.body.appendChild(indicator);

  // Navigation hint
  const hint = document.createElement('div');
  hint.className = 'nav-hint';
  hint.textContent = '← → ou clique para navegar';
  document.body.appendChild(hint);
}

function updateIndicator(activeIndex) {
  const dots = document.querySelectorAll('#slide-indicator .dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === activeIndex));
}

init();

