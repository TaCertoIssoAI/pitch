import gsap from "gsap";
import { createEtapaScene } from "./etapaFactory.js";

export function createScene(phoneRefs) {
  const tl = gsap.timeline();

  // Fade out previous panel (etapa 2)
  tl.to(
    [phoneRefs.etapa2PanelTitle, phoneRefs.etapa2PanelText],
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
    section: phoneRefs.secAnalise,
    sectionTitle: phoneRefs.secAnaliseTitle,
    prevSectionTitle: phoneRefs.secResumoTitle,
    title: "Etapa 3: Análise Detalhada",
    text: "Cada afirmação contida na mensagem original é destrinchada e verificada individualmente contra a desinformação.",
  });

  tl.add(etapaTl);

  phoneRefs.etapa3Panel = panel;
  phoneRefs.etapa3PanelTitle = panelTitle;
  phoneRefs.etapa3PanelText = panelText;

  return tl;
}
