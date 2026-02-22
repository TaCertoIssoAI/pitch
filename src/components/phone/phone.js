import { el } from "../../utils/dom.js";
import "./phone.css";

export function createPhone() {
  const screen = el("div", { className: "phone__screen" });
  const notch = el("div", { className: "phone__notch" });
  const homeBar = el("div", { className: "phone__home-bar" });
  const bezel = el("div", { className: "phone__bezel" }, [notch, screen, homeBar]);
  const root = el("div", { className: "phone" }, [bezel]);

  document.body.appendChild(root);

  return { root, screen, bezel };
}
