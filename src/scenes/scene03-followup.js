import gsap from "gsap";
import { createBubble } from "../components/whatsapp/whatsapp.js";
import { createTypingIndicator } from "../components/whatsapp/typingIndicator.js";
import { TIMINGS, EASINGS } from "../utils/constants.js";

const FACT_CHECK_HTML = `
  <p><strong>Resumo Geral:</strong></p>
  <p>Todas as afirmações foram classificadas como Falsas.</p>
  <p>
    A alegação de que vacinas causam autismo é categoricamente falsa. Diversas fontes confiáveis,
    incluindo órgãos governamentais de saúde e instituições acadêmicas, desmentem essa afirmação,
    classificando-a como desinformação. O Transtorno do Espectro Autista é multifatorial e não possui
    uma causa única ligada à vacinação, refutando um estudo de 1998 que propagou essa ideia.
  </p>
  <p><strong>Saiba mais sobre esse julgamento no nosso website:</strong></p>
  <p>
    <a href="https://tacertoissoai.com.br/verificacao/VsuVWdNTZW3S" target="_blank" rel="noopener noreferrer">
      https://tacertoissoai.com.br/verificacao/VsuVWdNTZW3S
    </a>
  </p>

  <p><strong>Análise por afirmação:</strong></p>
  <p><strong>Afirmação 1:</strong> A vacina causa autismo</p>
  <p><strong>Veredito:</strong> Falso</p>
  <p>
    <strong>Justificativa:</strong> A alegação de que vacinas causam autismo é comprovadamente falsa.
    Múltiplas instituições de saúde e pesquisa, como o Ministério da Saúde [2][3], a Universidade Federal
    de Santa Maria (UFSM) [1], o Instituto Butantan [4] e o Jornal da USP [5], afirmam categoricamente
    que não há relação entre vacinas e o Transtorno do Espectro Autista (TEA). O TEA é descrito como
    multifatorial e sem uma causa única bem definida [1]. A desinformação sobre essa ligação surgiu de um
    artigo científico de 1998 que foi amplamente refutado pela comunidade científica [4]. Outras alegações
    específicas relacionadas a vacinas e autismo também foram verificadas como falsas ou fora de contexto
    por agências de checagem, como o Estadão [6][7][8][9].
  </p>

  <p><strong>Fontes:</strong></p>

  <p><span class="factcheck-source-meta">[1]</span> Algumas vacinas podem causar autismo? - Revista Arco - UFSM</p>
  <p><span class="factcheck-source-meta">Fonte:</span> <span class="factcheck-source-meta">www.ufsm.br</span></p>
  <p>
    <span class="factcheck-source-meta">URL:</span>
    <a href="https://www.ufsm.br/midias/arco/algumas-vacinas-podem-causar-autismo" target="_blank" rel="noopener noreferrer">
      https://www.ufsm.br/midias/arco/algumas-vacinas-podem-causar-autismo
    </a>
  </p>

  <p><span class="factcheck-source-meta">[2]</span> Vacinas infantis não causam autismo - Ministério da Saúde - GOV</p>
  <p><span class="factcheck-source-meta">Fonte:</span> <span class="factcheck-source-meta">www.gov.br</span></p>
  <p>
    <span class="factcheck-source-meta">URL:</span>
    <a href="https://www.gov.br/saude/pt-br/assuntos/saude-com-ciencia/noticias/2025/janeiro/vacinas-infantis-nao-causam-autismo" target="_blank" rel="noopener noreferrer">
      https://www.gov.br/saude/pt-br/assuntos/saude-com-ciencia/noticias/2025/janeiro/vacinas-infantis-nao-causam-autismo
    </a>
  </p>

  <p><span class="factcheck-source-meta">[3]</span> Não existe nenhuma relação entre vacinas e autismo - GOV</p>
  <p><span class="factcheck-source-meta">Fonte:</span> <span class="factcheck-source-meta">www.gov.br</span></p>
  <p>
    <span class="factcheck-source-meta">URL:</span>
    <a href="https://www.gov.br/saude/pt-br/assuntos/saude-com-ciencia/noticias/2024/abril/nao-existe-nenhuma-relacao-entre-vacinas-e-autismo" target="_blank" rel="noopener noreferrer">
      https://www.gov.br/saude/pt-br/assuntos/saude-com-ciencia/noticias/2024/abril/nao-existe-nenhuma-relacao-entre-vacinas-e-autismo
    </a>
  </p>

  <p><span class="factcheck-source-meta">[4]</span> Por que é mentira que vacinas causam autismo? Conheça a história ...</p>
  <p><span class="factcheck-source-meta">Fonte:</span> <span class="factcheck-source-meta">butantan.gov.br</span></p>
  <p>
    <span class="factcheck-source-meta">URL:</span>
    <a href="https://butantan.gov.br/covid/butantan-tira-duvida/tira-duvida-noticias/por-que-e-mentira-que-vacinas-causam-autismo-conheca-a-historia-por-tras-desse-mito" target="_blank" rel="noopener noreferrer">
      https://butantan.gov.br/covid/butantan-tira-duvida/tira-duvida-noticias/por-que-e-mentira-que-vacinas-causam-autismo-conheca-a-historia-por-tras-desse-mito
    </a>
  </p>

  <p><span class="factcheck-source-meta">[5]</span> Afirmação que vacina causa autismo é falsa - Jornal da USP</p>
  <p><span class="factcheck-source-meta">Fonte:</span> <span class="factcheck-source-meta">jornal.usp.br</span></p>
  <p>
    <span class="factcheck-source-meta">URL:</span>
    <a href="https://jornal.usp.br/atualidades/afirmacao-que-vacina-causa-autismo-e-falsa/" target="_blank" rel="noopener noreferrer">
      https://jornal.usp.br/atualidades/afirmacao-que-vacina-causa-autismo-e-falsa/
    </a>
  </p>

  <p><span class="factcheck-source-meta">[6]</span> Aumento de diagnósticos de autismo está relacionado a maior ...</p>
  <p><span class="factcheck-source-meta">Fonte:</span> <span class="factcheck-source-meta">Estadão</span></p>
  <p>
    <span class="factcheck-source-meta">URL:</span>
    <a href="https://www.estadao.com.br/estadao-verifica/criancas-74-vacinas-aumento-autismo/" target="_blank" rel="noopener noreferrer">
      https://www.estadao.com.br/estadao-verifica/criancas-74-vacinas-aumento-autismo/
    </a>
  </p>

  <p><span class="factcheck-source-meta">[7]</span> É falso que criança tenha recebido 18 vacinas e desenvolvido autismo</p>
  <p><span class="factcheck-source-meta">Fonte:</span> <span class="factcheck-source-meta">Estadão</span></p>
  <p>
    <span class="factcheck-source-meta">URL:</span>
    <a href="https://www.estadao.com.br/estadao-verifica/18-vacinas-autismo-crianca-estados-unidos-falso/" target="_blank" rel="noopener noreferrer">
      https://www.estadao.com.br/estadao-verifica/18-vacinas-autismo-crianca-estados-unidos-falso/
    </a>
  </p>

  <p><span class="factcheck-source-meta">[8]</span> Estudo que dizia que crianças vacinadas ficam mais doentes não foi ...</p>
  <p><span class="factcheck-source-meta">Fonte:</span> <span class="factcheck-source-meta">Estadão</span></p>
  <p>
    <span class="factcheck-source-meta">URL:</span>
    <a href="https://www.estadao.com.br/estadao-verifica/estudo-senado-americano-vacinas-cancer-autismo/" target="_blank" rel="noopener noreferrer">
      https://www.estadao.com.br/estadao-verifica/estudo-senado-americano-vacinas-cancer-autismo/
    </a>
  </p>

  <p><span class="factcheck-source-meta">[9]</span> É falso que alumínio presente em vacinas cause encefalite ...</p>
  <p><span class="factcheck-source-meta">Fonte:</span> <span class="factcheck-source-meta">Estadão</span></p>
  <p>
    <span class="factcheck-source-meta">URL:</span>
    <a href="https://www.estadao.com.br/estadao-verifica/falso-aluminio-vacinas-encefalite-autoimune-autismo/" target="_blank" rel="noopener noreferrer">
      https://www.estadao.com.br/estadao-verifica/falso-aluminio-vacinas-encefalite-autoimune-autismo/
    </a>
  </p>
`;

export function createScene(phoneRefs) {
  const tl = gsap.timeline();
  const secondBotBubble = createBubble("bot", "", { className: "wa-bubble--factcheck" });
  const secondBotText = secondBotBubble.querySelector(".wa-bubble__text");
  const { container: typingEl, startLoop, killLoop } = createTypingIndicator();

  phoneRefs.messages.appendChild(typingEl);
  phoneRefs.messages.appendChild(secondBotBubble);
  gsap.set(typingEl, { scale: 0, opacity: 0, height: 0, padding: "0 14px" });
  gsap.set(secondBotBubble, { opacity: 0, y: 14 });

  // Fade out Stage 1 content and clear the highlight from first bot reply.
  tl.to(
    [phoneRefs.stageOnePanelTitle, phoneRefs.stageOnePanelText],
    {
      opacity: 0,
      x: 36,
      duration: 0.4,
      stagger: 0.08,
      ease: "power2.inOut",
    }
  );

  tl.to(
    phoneRefs.stageOnePanel,
    {
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
      onStart: () => {
        phoneRefs.stageOnePanel.style.pointerEvents = "none";
      },
      onReverseComplete: () => {
        phoneRefs.stageOnePanel.style.pointerEvents = "";
      },
    },
    "<+0.08"
  );

  tl.to(
    phoneRefs.botBubble,
    {
      borderColor: "rgba(32,198,89,0)",
      boxShadow: "0 0 0px rgba(32,198,89,0), 0 0 0px rgba(32,198,89,0)",
      duration: 0.45,
      ease: "power2.out",
    },
    "<"
  );

  // Move phone to the right, where Stage 1 content used to be.
  tl.to(
    phoneRefs.root,
    {
      x: "20vw",
      duration: TIMINGS.phoneMove,
      ease: "power3.inOut",
    },
    "<"
  );

  // Same "digitando" behavior as the first bot answer.
  tl.fromTo(
    typingEl,
    { scale: 0, opacity: 0, height: 0, padding: "0 14px" },
    {
      scale: 1,
      opacity: 1,
      height: 29,
      padding: "12px 14px",
      duration: 0.38,
      ease: "back.out(1.4)",
      onStart: startLoop,
      onReverseComplete: killLoop,
    },
    "-=0.25"
  );

  tl.to({}, { duration: TIMINGS.typingHold * 2.6 });

  tl.to(typingEl, {
    scale: 0,
    opacity: 0,
    height: 0,
    padding: "0 14px",
    duration: 0.26,
    ease: "power2.in",
    onComplete: killLoop,
    onReverseComplete: startLoop,
  });

  tl.fromTo(
    secondBotBubble,
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: TIMINGS.botReply, ease: EASINGS.msgIn },
    "-=0.25"
  );

  tl.call(() => {
    secondBotText.innerHTML = FACT_CHECK_HTML;
  }, [], "<");

  tl.to({}, { duration: TIMINGS.scenePause });

  // Keep reference in case a future scene needs to swap this placeholder text.
  phoneRefs.secondBotBubble = secondBotBubble;
  phoneRefs.secondBotText = secondBotText;

  return tl;
}
