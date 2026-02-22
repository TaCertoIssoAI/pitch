import { createScene as scene01 } from "./scene01-chat.js";
import { createScene as scene02 } from "./scene02-zoom.js";
import { createScene as scene03 } from "./scene03-followup.js";
import { createScene as scene04 } from "./scene04-etapa2.js";
import { createScene as scene05 } from "./scene05-etapa3.js";
import { createScene as scene06 } from "./scene06-etapa4.js";

export const scenes = [
  { label: "scene01", factory: scene01 },
  { label: "scene02", factory: scene02 },
  { label: "scene03", factory: scene03 },
  { label: "scene04", factory: scene04 },
  { label: "scene05", factory: scene05 },
  { label: "scene06", factory: scene06 },
];
