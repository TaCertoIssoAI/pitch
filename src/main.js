import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import "./style.css";

import { createPhone } from "./components/phone/phone.js";
import { addScene, getTimeline } from "./core/masterTimeline.js";
import { registerLabel, initKeyboard, goTo } from "./core/navigator.js";
import { createNav } from "./components/nav/nav.js";
import { scenes } from "./scenes/index.js";

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

// 1. Create the shared phone component
const app = document.getElementById("app");
app.classList.add("stage");
const phoneRefs = createPhone(app);

// 2. Build and register all scenes
scenes.forEach(({ label, factory }) => {
  const sceneTL = factory(phoneRefs);
  addScene(label, sceneTL);
  registerLabel(label);
});

// 3. Create navigation UI
createNav();

// 4. Setup keyboard controls
initKeyboard();

// 5. Auto-play scene 1 on load
getTimeline().tweenTo("scene01_end");
