import gsap from "gsap";
import { createEtapaScene } from "./etapaFactory.js";

export function createScene(phoneRefs) {
  const tl = gsap.timeline();

  // Fade out previous panel (etapa 3)
  tl.to(
    [phoneRefs.etapa3PanelTitle, phoneRefs.etapa3PanelText],
    {
      opacity: 0,
      x: 36,
      duration: 0.4,
      stagger: 0.08,
      ease: "power2.inOut",
    }
  );

  const { tl: etapaTl, panel, panelTitle, panelText } = createEtapaScene(phoneRefs, {
    movePhone: false,
    section: phoneRefs.secFontes,
    prevSection: phoneRefs.secAnalise,
    title: "Etapa 4: Transparência",
    text: "As evidências são apresentadas com links diretos para fontes oficiais, governamentais e científicas.",
  });

  tl.add(etapaTl);

  phoneRefs.etapa4Panel = panel;
  phoneRefs.etapa4PanelTitle = panelTitle;
  phoneRefs.etapa4PanelText = panelText;

  return tl;
}
