/**
 * TitleScene — A simple scene that shows a title, subtitle, and optional image.
 *
 * Config (from presentation.json):
 *   { title, subtitle, image, background }
 */
import Scene from '../Scene.js';

class TitleScene extends Scene {
  constructor(config = {}) {
    super();
    this.config = config;
  }

  async mount(container) {
    await super.mount(container);

    const bg = this.config.background || '#0a0a0a';
    container.style.background = bg;

    const image = this.config.image
      ? `<img src="${this.config.image}" alt="" style="max-width:280px;max-height:280px;margin-bottom:32px;border-radius:24px;opacity:0;animation:sceneFadeUp .8s .2s ease forwards;">`
      : '';

    container.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px;max-width:800px;">
        ${image}
        <h1 style="font-size:clamp(2rem,5vw,4rem);font-weight:800;color:#fff;margin-bottom:16px;opacity:0;animation:sceneFadeUp .8s .3s ease forwards;">
          ${this.config.title || ''}
        </h1>
        <p style="font-size:clamp(1rem,2.5vw,1.5rem);color:rgba(255,255,255,0.6);max-width:600px;line-height:1.6;opacity:0;animation:sceneFadeUp .8s .5s ease forwards;">
          ${this.config.subtitle || ''}
        </p>
      </div>
    `;
  }

  enter() {}
  exit() { super.exit(); }
}

export default TitleScene;
