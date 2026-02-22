import gsap from "gsap";
import { createEtapaScene } from "./etapaFactory.js";

export function createScene(phoneRefs) {
  const tl = gsap.timeline();

  // Fade out scene03's position — phone moves from 20vw → -25vw handled by factory
  // Fade out scene02's stage-one panel (it was left invisible by scene03, but ensure it)
  // No previous etapa panel to fade out here — scene03 already hid the stage-one panel.

  const { tl: etapaTl, panel, panelTitle, panelText } = createEtapaScene(phoneRefs, {
    movePhone: true,
    section: phoneRefs.secResumo,
    prevSection: null,
    title: "Etapa 2: Resumo e Veredito",
    text: "A IA consolida os dados das checagens e gera um veredito claro e direto para o usuário.",
  });

  tl.add(etapaTl);

  // Store refs for next scene
  phoneRefs.etapa2Panel = panel;
  phoneRefs.etapa2PanelTitle = panelTitle;
  phoneRefs.etapa2PanelText = panelText;

  return tl;
}
