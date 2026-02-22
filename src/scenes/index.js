import { createScene as scene01 } from "./scene01-chat.js";
import { createScene as scene02 } from "./scene02-zoom.js";

export const scenes = [
  { label: "scene01", factory: scene01 },
  { label: "scene02", factory: scene02 },
];
